const express = require('express');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || process.env.CMS_PORT || 4100;
const ADMIN_TOKEN = process.env.CMS_ADMIN_TOKEN || 'eduai-local-admin';

// Service-role key bypasses RLS — required for CMS write operations
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '1mb' }));
app.use('/cms', express.static(path.join(__dirname, 'public')));
app.get('/', (_req, res) => res.redirect('/cms'));

function adminAuth(req, res, next) {
  const incoming = req.headers['x-admin-token'];
  if (!incoming || incoming !== ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized — invalid admin token' });
  }
  return next();
}

// Frontend uses camelCase; Supabase table uses snake_case
function toRow(p) {
  const handle = p.handle || '@unknown';
  return {
    creator:    p.creator    || 'Unknown Creator',
    handle,
    avatar:     p.avatar     || handle.replace('@', '').substring(0, 2).toUpperCase(),
    title:      p.title      || 'Untitled Reel',
    likes:      p.likes      || '0',
    comments:   p.comments   || '0',
    youtube_id: p.youtubeId  || p.youtube_id  || '',
    hls_url:    p.hlsUrl     || p.hls_url     || '',
    poster_url: p.posterUrl  || p.poster_url  || '',
    tags: Array.isArray(p.tags)
      ? p.tags
      : typeof p.tags === 'string'
        ? p.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
  };
}

function toApi(r) {
  return {
    id:        r.id,
    creator:   r.creator,
    handle:    r.handle,
    avatar:    r.avatar,
    title:     r.title,
    likes:     r.likes,
    comments:  r.comments,
    youtubeId: r.youtube_id,
    hlsUrl:    r.hls_url,
    posterUrl: r.poster_url,
    tags:      r.tags || [],
  };
}

// ── Routes ────────────────────────────────────────────────────────────────────

app.get('/api/health', (_req, res) => {
  const sbConfigured = !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY);
  res.json({ ok: true, service: 'eduai-cms', supabase: sbConfigured, port: PORT });
});

app.get('/api/reels', async (_req, res) => {
  const { data, error } = await supabase
    .from('reels')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ reels: data.map(toApi) });
});

app.post('/api/reels', adminAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('reels')
    .insert(toRow(req.body || {}))
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ reel: toApi(data) });
});

app.put('/api/reels/:id', adminAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('reels')
    .update(toRow(req.body || {}))
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Reel not found' });
  res.json({ reel: toApi(data) });
});

app.delete('/api/reels/:id', adminAuth, async (req, res) => {
  const { error } = await supabase.from('reels').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`EduAI CMS  →  http://localhost:${PORT}`);
  console.log(`Admin panel →  http://localhost:${PORT}/cms`);
});
