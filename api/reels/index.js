const { createClient } = require('@supabase/supabase-js');

const ADMIN_TOKEN = process.env.CMS_ADMIN_TOKEN || '';

function getSupabase() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) return null;
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}

const FALLBACK = [
  { id:'r1', creator:'Data Expertise',   handle:'@data_expertise',  avatar:'DE', title:'Neural Networks Explained',    likes:'12K',  comments:'240',  youtubeId:'04XBrv4OxNM', hlsUrl:'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',                                                                   posterUrl:'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1080', tags:['ml','neuralnets'] },
  { id:'r2', creator:'Ram Naresh',        handle:'@ramnaresh',       avatar:'RN', title:'Alpha-Beta Pruning',            likes:'45K',  comments:'510',  youtubeId:'oFuNxc49et0', hlsUrl:'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8', posterUrl:'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1080', tags:['algorithms','ai'] },
  { id:'r3', creator:'Microlearn',        handle:'@micro_ai',        avatar:'ML', title:'Start Your AI Career Right',    likes:'82K',  comments:'1.2K', youtubeId:'cArcHKeM7xg', hlsUrl:'https://test-streams.mux.dev/test_001/stream.m3u8',                                                            posterUrl:'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1080', tags:['career','strategy'] },
  { id:'r4', creator:'Data Enthusiast',   handle:'@data_enthusiast', avatar:'DH', title:'2024 ML Roadmap',               likes:'124K', comments:'2.4K', youtubeId:'PGuKUCS0A9A', hlsUrl:'', posterUrl:'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=1080', tags:['roadmap','learning'] },
  { id:'r5', creator:'Bear Kids AI',      handle:'@bear_ai',         avatar:'BK', title:'Defining ML Simply',            likes:'310K', comments:'18K',  youtubeId:'2U3-fG_VlLY', hlsUrl:'', posterUrl:'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1080', tags:['basics','ml'] },
  { id:'r6', creator:'Aisha Learns AI',   handle:'@aisha.codes',     avatar:'AL', title:'3 AI Projects For Freshers',    likes:'26K',  comments:'830',  youtubeId:'fN8Q6k5k6xA', hlsUrl:'', posterUrl:'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1080', tags:['projects','career'] },
  { id:'r7', creator:'Prompt Monk',       handle:'@prompt_monk',     avatar:'PM', title:'Prompt Patterns That Work',     likes:'19K',  comments:'402',  youtubeId:'R8Y-4x9f6e4', hlsUrl:'', posterUrl:'https://images.unsplash.com/photo-1673187649012-b1ae64af5c8a?w=1080', tags:['prompts','genai'] },
  { id:'r8', creator:'NeuralNinja',       handle:'@neuralninja',     avatar:'NN', title:'Transformer Attention Visual',  likes:'38K',  comments:'921',  youtubeId:'kCc8FmEb1nY', hlsUrl:'', posterUrl:'https://images.unsplash.com/photo-1676573038296-2a82a7f16bbe?w=1080', tags:['transformers','deep'] },
  { id:'r9', creator:'VisionVeda',        handle:'@vision_veda',     avatar:'VV', title:'CNN Filters Explained Simply',  likes:'21K',  comments:'334',  youtubeId:'aircAruvnKk', hlsUrl:'', posterUrl:'https://images.unsplash.com/photo-1593642532400-2682810df593?w=1080', tags:['cnn','vision'] },
  { id:'r10',creator:'TokenTales',        handle:'@token_tales',     avatar:'TT', title:'How LLMs Generate Text',        likes:'54K',  comments:'1.1K', youtubeId:'x6Q7c9RyMzk', hlsUrl:'', posterUrl:'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=1080', tags:['llm','genai'] },
  { id:'r11',creator:'AgentCraft',        handle:'@agentcraft',      avatar:'AC', title:'AI Agent Loop Explained',       likes:'31K',  comments:'670',  youtubeId:'TkwXa7Cvfr8', hlsUrl:'', posterUrl:'https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=1080', tags:['agents','ai'] },
  { id:'r12',creator:'LearnLoop',         handle:'@learnloop',       avatar:'LL', title:'Fine-Tuning vs Prompting',      likes:'44K',  comments:'812',  youtubeId:'m8pOnJxOcqY', hlsUrl:'', posterUrl:'https://images.unsplash.com/photo-1692607431208-7b6f9ac0e7c9?w=1080', tags:['finetuning','prompts'] },
];

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
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,x-admin-token');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const sb = getSupabase();

  if (req.method === 'GET') {
    if (!sb) return res.json({ reels: FALLBACK, _source: 'fallback' });
    const { data, error } = await sb.from('reels').select('*').order('created_at', { ascending: false });
    if (error) return res.json({ reels: FALLBACK, _source: 'fallback' });
    return res.json({ reels: data.map(toApi) });
  }

  if (req.method === 'POST') {
    if (!ADMIN_TOKEN || req.headers['x-admin-token'] !== ADMIN_TOKEN)
      return res.status(401).json({ error: 'Unauthorized' });
    if (!sb) return res.status(503).json({ error: 'Database not configured — set SUPABASE_URL and SUPABASE_SERVICE_KEY in Vercel' });
    const { data, error } = await sb.from('reels').insert(toRow(req.body||{})).select().single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ reel: toApi(data) });
  }

  res.status(405).json({ error: 'Method not allowed' });
};
