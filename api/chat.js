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

module.exports = async (req, res) => {
  corsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: 'AI not configured',
      hint: 'Set OPENROUTER_API_KEY in Vercel project settings.',
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
    modelId = DEFAULT_MODEL,
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
    const errText = upstream?._err || (await (upstream?.text?.() || Promise.resolve(''))) || 'Upstream error';
    return res.status(upstream?.status || 502).json({ error: 'AI upstream failed', detail: errText });
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
