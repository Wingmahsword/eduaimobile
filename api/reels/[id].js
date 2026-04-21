const { createClient } = require('@supabase/supabase-js');

const ADMIN_TOKEN = process.env.CMS_ADMIN_TOKEN || '';

function getSupabase() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) return null;
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}

function toRow(p) {
  const handle = p.handle || '@unknown';
  return {
    creator:    p.creator    || 'Unknown Creator',
    handle,
    avatar:     p.avatar     || handle.replace('@','').substring(0,2).toUpperCase(),
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
  return { id:r.id, creator:r.creator, handle:r.handle, avatar:r.avatar, title:r.title,
           likes:r.likes, comments:r.comments, youtubeId:r.youtube_id,
           hlsUrl:r.hls_url, posterUrl:r.poster_url, tags:r.tags||[] };
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,x-admin-token');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (!ADMIN_TOKEN || req.headers['x-admin-token'] !== ADMIN_TOKEN)
    return res.status(401).json({ error: 'Unauthorized' });

  const sb = getSupabase();
  if (!sb) return res.status(503).json({ error: 'Database not configured' });

  const { id } = req.query;

  if (req.method === 'PUT') {
    const { data, error } = await sb.from('reels').update(toRow(req.body||{})).eq('id', id).select().single();
    if (error) return res.status(500).json({ error: error.message });
    if (!data)  return res.status(404).json({ error: 'Reel not found' });
    return res.json({ reel: toApi(data) });
  }

  if (req.method === 'DELETE') {
    const { error } = await sb.from('reels').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ ok: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
};
