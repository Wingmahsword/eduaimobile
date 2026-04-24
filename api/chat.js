/**
 * AI chat proxy — OpenRouter.
 *
 * Keeps OPENROUTER_KEY server-side so it never ships in the client bundle.
 * Supports streaming (SSE passthrough) when the client sends `stream: true`.
 *
 * Env:
 *   OPENROUTER_KEY (preferred)  |  OPENROUTER_API_KEY (legacy)
 *   OPENROUTER_SITE_URL  — optional
 *   OPENROUTER_APP_NAME  — optional
 */

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL  = 'meta-llama/llama-3.3-70b-instruct:free';
const MAX_MESSAGES   = 20;
const MAX_CHARS      = 8000;

module.exports = async (req, res) => {
  try {
    return await handler(req, res);
  } catch (e) {
    // Last-resort catch — avoid empty 503s and keep response non-sensitive.
    console.error('[api/chat] unhandled error', e);
    try {
      res.status(500).json({ error: 'Internal server error' });
    } catch {
      try { res.statusCode = 500; res.end('internal server error'); } catch {}
    }
  }
};

async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')    return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = (process.env.OPENROUTER_KEY || process.env.OPENROUTER_API_KEY || '').trim();
  if (!apiKey) {
    return res.status(503).json({
      error: 'AI not configured',
      hint: 'Set OPENROUTER_KEY in Vercel project settings.',
    });
  }

  // Vercel Node runtime auto-parses JSON — accept both object and string shapes.
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  if (!body || typeof body !== 'object') body = {};

  const modelId     = body.modelId || body.model || DEFAULT_MODEL;
  const stream      = body.stream === true;
  const temperature = typeof body.temperature === 'number' ? body.temperature : 0.7;
  const max_tokens  = typeof body.max_tokens  === 'number' ? body.max_tokens  : 1024;

  // Normalise to OpenAI messages shape
  let msgs = [];
  if (Array.isArray(body.messages) && body.messages.length > 0) {
    msgs = body.messages
      .filter((m) => m && m.role && m.content != null)
      .map((m) => ({ role: m.role, content: String(m.content) }));
  } else if (typeof body.message === 'string' && body.message.trim()) {
    msgs = [{ role: 'user', content: body.message.trim() }];
  }
  if (msgs.length === 0) {
    return res.status(400).json({ error: 'Missing `messages` array or `message` string' });
  }
  if (msgs.length > MAX_MESSAGES) {
    return res.status(400).json({ error: `Too many messages (max ${MAX_MESSAGES})` });
  }
  const charCount = msgs.reduce((n, m) => n + m.content.length, 0);
  if (charCount > MAX_CHARS) {
    return res.status(400).json({ error: `Input too long (max ${MAX_CHARS} chars)` });
  }

  const origin  = req.headers.origin || process.env.OPENROUTER_SITE_URL || 'https://eduai-mobile.vercel.app';
  const appName = process.env.OPENROUTER_APP_NAME || 'EduAI Mobile';

  let upstream;
  try {
    upstream = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': origin,
        'X-Title': appName,
      },
      body: JSON.stringify({ model: modelId, messages: msgs, stream, temperature, max_tokens }),
    });
  } catch (e) {
    return res.status(502).json({
      error: 'AI upstream failed',
      detail: (e && e.message) ? String(e.message).slice(0, 400) : 'network',
    });
  }

  if (!upstream.ok) {
    let detail = '';
    try {
      const raw = await upstream.text();
      try {
        const j = JSON.parse(raw);
        detail = j?.error?.message || j?.error || raw;
      } catch { detail = raw; }
    } catch {}
    const friendly =
      upstream.status === 429 ? 'This free model is rate-limited. Try another agent or retry in a minute.' :
      upstream.status === 404 ? 'Model not available.' :
      upstream.status === 401 ? 'AI key is invalid. Update OPENROUTER_KEY in Vercel.' :
      'AI upstream failed';
    return res.status(upstream.status).json({
      error: friendly,
      detail: String(detail || '').slice(0, 400),
    });
  }

  // Streaming (SSE passthrough)
  if (stream) {
    res.status(200);
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    try {
      const reader = upstream.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        res.write(decoder.decode(value, { stream: true }));
      }
    } catch {}
    return res.end();
  }

  // Non-streaming JSON
  let data;
  try { data = await upstream.json(); } catch { data = null; }
  if (!data) return res.status(502).json({ error: 'Invalid upstream response' });
  const reply = data?.choices?.[0]?.message?.content || '';
  return res.status(200).json({ reply, model: modelId, raw: data });
}
