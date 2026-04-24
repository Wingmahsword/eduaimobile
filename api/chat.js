/**
 * AI chat proxy — OpenRouter.
 *
 * Keeps OPENROUTER_API_KEY server-side so it never ships in the client bundle.
 * Supports streaming (SSE passthrough) when the client sends `stream: true`.
 *
 * Env required:
 *   OPENROUTER_API_KEY     — the secret key (set in Vercel → Settings → Environment)
 *   OPENROUTER_SITE_URL    — optional; defaults to the request origin
 *   OPENROUTER_APP_NAME    — optional; defaults to "EduAI Mobile"
 */

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

const DEFAULT_MODEL = 'meta-llama/llama-3.3-70b-instruct:free';

function corsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// Abuse-protection limits
const MAX_MESSAGES = 20;
const MAX_PAYLOAD_CHARS = 8000;

module.exports = async (req, res) => {
  corsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Prefer OPENROUTER_KEY (spec), fall back to OPENROUTER_API_KEY (legacy).
  // Trim any trailing whitespace/newlines that may leak via shell piping.
  const rawKey = process.env.OPENROUTER_KEY || process.env.OPENROUTER_API_KEY || '';
  const apiKey = rawKey.trim();
  if (!apiKey) {
    return res.status(503).json({
      error: 'AI not configured',
      hint: 'Set OPENROUTER_KEY in Vercel project settings.',
    });
  }

  // Parse body (Vercel may or may not auto-parse)
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const {
    messages,
    modelId = body.model || DEFAULT_MODEL,  // accept both `modelId` and `model`
    message,       // legacy: single string
    stream = false,
    temperature = 0.7,
    max_tokens = 1024,
  } = body;

  // Normalise to OpenAI-style messages array
  let msgs;
  if (Array.isArray(messages) && messages.length > 0) {
    msgs = messages
      .filter((m) => m && m.role && m.content)
      .map((m) => ({ role: m.role, content: String(m.content) }));
  } else if (typeof message === 'string' && message.trim()) {
    msgs = [{ role: 'user', content: message.trim() }];
  } else {
    return res.status(400).json({ error: 'Missing `messages` array or `message` string' });
  }

  // Abuse guards
  if (msgs.length > MAX_MESSAGES) {
    return res.status(400).json({ error: `Too many messages (max ${MAX_MESSAGES})` });
  }
  const payloadChars = msgs.reduce((n, m) => n + (m.content?.length || 0), 0);
  if (payloadChars > MAX_PAYLOAD_CHARS) {
    return res.status(400).json({ error: `Input too long (max ${MAX_PAYLOAD_CHARS} chars)` });
  }

  const origin = req.headers.origin || process.env.OPENROUTER_SITE_URL || 'https://eduai-mobile.vercel.app';
  const appName = process.env.OPENROUTER_APP_NAME || 'EduAI Mobile';

  const upstream = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': origin,
      'X-Title': appName,
    },
    body: JSON.stringify({
      model: modelId,
      messages: msgs,
      stream,
      temperature,
      max_tokens,
    }),
  }).catch((e) => ({ ok: false, status: 502, _err: e?.message || 'network' }));

  if (!upstream || !upstream.ok) {
    const status = upstream?.status || 502;
    let detail = upstream?._err || '';
    try {
      const raw = await (upstream?.text?.() || Promise.resolve(''));
      if (raw) {
        try {
          const j = JSON.parse(raw);
          detail = j?.error?.message || j?.error || raw;
        } catch { detail = raw; }
      }
    } catch {}
    const friendly =
      status === 429 ? 'This free model is rate-limited. Try a different agent or retry in a minute.' :
      status === 404 ? 'Model not available.' :
      status === 401 ? 'AI key is invalid. Update OPENROUTER_KEY in Vercel.' :
      'AI upstream failed';
    return res.status(status).json({ error: friendly, detail: String(detail || '').slice(0, 400) });
  }

  // ── Streaming (SSE passthrough) ─────────────────────────────
  if (stream) {
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    // Node 18+ on Vercel — use reader
    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        res.write(decoder.decode(value, { stream: true }));
      }
    } catch (e) {
      // Ignore — client may have disconnected
    }
    return res.end();
  }

  // ── Non-streaming JSON ──────────────────────────────────────
  const data = await upstream.json().catch(() => null);
  if (!data) return res.status(502).json({ error: 'Invalid upstream response' });
  const reply = data?.choices?.[0]?.message?.content || '';
  return res.status(200).json({ reply, model: modelId, raw: data });
};
