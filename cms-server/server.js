const express = require('express');
const cors = require('cors');
const fs = require('fs/promises');
const path = require('path');
const { randomUUID } = require('crypto');

const app = express();
const PORT = process.env.PORT || process.env.CMS_PORT || 4100;
const ADMIN_TOKEN = process.env.CMS_ADMIN_TOKEN || 'eduai-local-admin';
const DATA_FILE = path.join(__dirname, 'data', 'reels.json');

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use('/cms', express.static(path.join(__dirname, 'public')));

async function readReels() {
  const raw = await fs.readFile(DATA_FILE, 'utf8');
  return JSON.parse(raw);
}

async function writeReels(reels) {
  await fs.writeFile(DATA_FILE, JSON.stringify(reels, null, 2) + '\n', 'utf8');
}

function adminAuth(req, res, next) {
  const incoming = req.headers['x-admin-token'];
  if (!incoming || incoming !== ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized admin token' });
  }
  return next();
}

function normalizeReel(payload) {
  return {
    id: payload.id || randomUUID(),
    creator: payload.creator || 'Unknown Creator',
    handle: payload.handle || '@unknown',
    avatar: payload.avatar || 'EA',
    title: payload.title || 'Untitled Reel',
    likes: payload.likes || '0',
    comments: payload.comments || '0',
    youtubeId: payload.youtubeId || '',
    hlsUrl: payload.hlsUrl || '',
    posterUrl: payload.posterUrl || '',
    tags: Array.isArray(payload.tags)
      ? payload.tags
      : typeof payload.tags === 'string'
        ? payload.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
        : [],
  };
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'eduai-cms', port: PORT });
});

app.get('/api/reels', async (_req, res) => {
  try {
    const reels = await readReels();
    res.json({ reels });
  } catch (error) {
    res.status(500).json({ error: 'Failed to read reels', details: error.message });
  }
});

app.post('/api/reels', adminAuth, async (req, res) => {
  try {
    const reels = await readReels();
    const reel = normalizeReel(req.body || {});
    reels.unshift(reel);
    await writeReels(reels);
    res.status(201).json({ reel });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create reel', details: error.message });
  }
});

app.put('/api/reels/:id', adminAuth, async (req, res) => {
  try {
    const reels = await readReels();
    const idx = reels.findIndex((r) => r.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Reel not found' });

    const updated = normalizeReel({ ...reels[idx], ...req.body, id: reels[idx].id });
    reels[idx] = updated;
    await writeReels(reels);
    res.json({ reel: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update reel', details: error.message });
  }
});

app.delete('/api/reels/:id', adminAuth, async (req, res) => {
  try {
    const reels = await readReels();
    const next = reels.filter((r) => r.id !== req.params.id);
    if (next.length === reels.length) return res.status(404).json({ error: 'Reel not found' });

    await writeReels(next);
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete reel', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`EduAI CMS API running at http://localhost:${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/cms`);
});
