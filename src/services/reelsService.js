/**
 * Reels service — single source of truth for fetching reel content.
 *
 * - Uses CMS_BASE (Vercel serverless /api/reels) with graceful fallback to
 *   local curated + generated reels.
 * - Session-caches the response for 5 min to avoid re-fetching on tab switch.
 * - Never throws: always resolves with { reels, source, error? }.
 */

import { REELS, GENERATED_REELS, CMS_BASE } from '../constants/data';

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 min
const FETCH_TIMEOUT_MS = 8000;

let _cache = null; // { timestamp, payload }

/* ─── Utils ──────────────────────────────────────────────────────── */
function mergeReels(primary, generated = []) {
  const byId = new Map();
  [...primary, ...generated].forEach((r) => {
    if (r?.id) byId.set(r.id, r);
  });
  return Array.from(byId.values());
}

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), ms);
    promise.then(
      (v) => { clearTimeout(t); resolve(v); },
      (e) => { clearTimeout(t); reject(e); },
    );
  });
}

/* ─── Public API ─────────────────────────────────────────────────── */

/**
 * Returns the full reels feed. Never rejects.
 * @param {{ force?: boolean }} opts
 * @returns {Promise<{ reels: Array, source: string, error?: string }>}
 */
export async function fetchReels({ force = false } = {}) {
  // Serve from in-memory cache first
  if (!force && _cache && Date.now() - _cache.timestamp < CACHE_TTL_MS) {
    return { ..._cache.payload, source: 'cache' };
  }

  const fallbackPayload = {
    reels: mergeReels(REELS, GENERATED_REELS),
    source: 'local',
  };

  if (!CMS_BASE) return fallbackPayload;

  try {
    const res = await withTimeout(
      fetch(`${CMS_BASE}/api/reels`, { headers: { Accept: 'application/json' } }),
      FETCH_TIMEOUT_MS,
    );
    if (!res.ok) throw new Error(`CMS ${res.status}`);
    const data = await res.json();
    if (!data || !Array.isArray(data.reels) || data.reels.length === 0) {
      throw new Error('empty payload');
    }
    const merged = mergeReels(data.reels, GENERATED_REELS);
    const payload = {
      reels: merged.length ? merged : fallbackPayload.reels,
      source: data._source || 'cms',
    };
    _cache = { timestamp: Date.now(), payload };
    return payload;
  } catch (e) {
    return { ...fallbackPayload, error: e?.message || 'fetch failed' };
  }
}

/** Invalidate the in-memory cache. Call after posting a new reel, etc. */
export function invalidateReelsCache() {
  _cache = null;
}
