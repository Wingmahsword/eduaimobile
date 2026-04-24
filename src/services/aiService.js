/**
 * AI service — talks to the `/api/chat` Vercel function (OpenRouter proxy).
 *
 * Exposes:
 *   - chatOnce(messages, modelId)         → { reply, error? }  (single-shot, no streaming)
 *   - chatStream(messages, modelId, onChunk) → finishes when the stream ends
 *
 * The API key is stored server-side; clients never see it. If the endpoint
 * returns 503 `AI not configured`, the caller should show a "missing key"
 * banner instead of a generic error.
 */

import { API_BASE } from '../constants/data';

const CHAT_URL = `${API_BASE}/api/chat`;

/* ─── Non-streaming ────────────────────────────────────────────── */
export async function chatOnce(messages, modelId) {
  try {
    const res = await fetch(CHAT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, modelId, stream: false }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        reply: '',
        error: data?.error || `HTTP ${res.status}`,
        detail: data?.detail,
        missingKey: res.status === 503,
        rateLimited: res.status === 429,
        status: res.status,
      };
    }
    return { reply: data.reply || '', model: data.model };
  } catch (e) {
    return { reply: '', error: e?.message || 'Network error' };
  }
}

/* ─── Streaming (SSE passthrough) ──────────────────────────────── */
/**
 * @param {Array<{role, content}>} messages
 * @param {string} modelId
 * @param {(textDelta: string) => void} onChunk — called for each token delta
 * @returns {Promise<{ ok: boolean, error?: string, missingKey?: boolean }>}
 */
export async function chatStream(messages, modelId, onChunk) {
  let res;
  try {
    res = await fetch(CHAT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
      body: JSON.stringify({ messages, modelId, stream: true }),
    });
  } catch (e) {
    return { ok: false, error: e?.message || 'Network error' };
  }

  if (!res.ok) {
    let errMsg = `HTTP ${res.status}`;
    try { const j = await res.json(); errMsg = j?.error || errMsg; } catch {}
    return {
      ok: false,
      error: errMsg,
      missingKey: res.status === 503,
      rateLimited: res.status === 429,
      status: res.status,
    };
  }

  // Some hosts (older native fetch) may not support `res.body.getReader()`.
  // Fall back to one-shot text if not.
  if (!res.body || typeof res.body.getReader !== 'function') {
    const text = await res.text();
    parseSSEBlock(text, onChunk);
    return { ok: true };
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // SSE events separated by blank lines
    const parts = buffer.split('\n\n');
    buffer = parts.pop() || '';
    for (const part of parts) parseSSEEvent(part, onChunk);
  }
  if (buffer) parseSSEEvent(buffer, onChunk);
  return { ok: true };
}

function parseSSEEvent(raw, onChunk) {
  // Each event is lines like: "data: {...}" or "data: [DONE]"
  for (const line of raw.split('\n')) {
    const m = line.match(/^data:\s*(.*)$/);
    if (!m) continue;
    const payload = m[1].trim();
    if (!payload || payload === '[DONE]') continue;
    try {
      const j = JSON.parse(payload);
      const delta = j?.choices?.[0]?.delta?.content;
      if (delta) onChunk(delta);
    } catch {
      // skip malformed chunk
    }
  }
}

function parseSSEBlock(text, onChunk) {
  for (const block of text.split('\n\n')) parseSSEEvent(block, onChunk);
}
