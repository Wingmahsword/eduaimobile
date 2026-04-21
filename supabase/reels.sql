-- ============================================================
-- EduAI Reels Table
-- Run this in: Supabase Dashboard > SQL Editor > New Query
-- Run AFTER schema.sql (which handles auth tables)
-- ============================================================

create table if not exists public.reels (
  id          uuid primary key default gen_random_uuid(),
  creator     text not null default 'Unknown Creator',
  handle      text not null default '@unknown',
  avatar      text default 'EA',
  title       text not null default 'Untitled Reel',
  likes       text default '0',
  comments    text default '0',
  youtube_id  text default '',
  hls_url     text default '',
  poster_url  text default '',
  tags        text[] default '{}',
  created_at  timestamptz default now() not null
);

-- RLS: anyone can read reels (public feed), only service role can write
alter table public.reels enable row level security;

create policy "Public reels read" on public.reels
  for select to anon, authenticated using (true);

-- Seed default reels
insert into public.reels (creator, handle, avatar, title, likes, comments, youtube_id, hls_url, poster_url, tags) values
  ('Data Expertise',  '@data_expertise',  'DE', 'Neural Networks Explained',  '12K',  '240',  '04XBrv4OxNM', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',                                                                     'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1000', ARRAY['ml','neuralnets']),
  ('Ram Naresh',       '@ramnaresh',       'RN', 'Alpha-Beta Pruning',          '45K',  '510',  'oFuNxc49et0', 'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8',                   'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000', ARRAY['algorithms','ai']),
  ('Microlearn',       '@micro_ai',        'ML', 'Start Your AI Career Right',  '82K',  '1.2K', 'cArcHKeM7xg', 'https://test-streams.mux.dev/test_001/stream.m3u8',                                                                    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1000', ARRAY['career','strategy']),
  ('Data Enthusiast',  '@data_enthusiast', 'DH', '2024 ML Roadmap',             '124K', '2.4K', 'PGuKUCS0A9A', '',                                                                                                                      '',                                                                    ARRAY['roadmap','learning']),
  ('Bear Kids AI',     '@bear_ai',         'BK', 'Defining ML Simply',          '310K', '18K',  '2U3-fG_VlLY', '',                                                                                                                      '',                                                                    ARRAY['basics','ml']),
  ('Aisha Learns AI',  '@aisha.codes',     'AL', '3 AI Projects For Freshers',  '26K',  '830',  'fN8Q6k5k6xA', '',                                                                                                                      '',                                                                    ARRAY['projects','career']),
  ('Prompt Monk',      '@prompt_monk',     'PM', 'Prompt Patterns That Work',   '19K',  '402',  'R8Y-4x9f6e4', '',                                                                                                                      '',                                                                    ARRAY['prompts','genai'])
on conflict do nothing;
