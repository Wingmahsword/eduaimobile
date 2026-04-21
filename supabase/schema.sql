-- ============================================================
-- EduAI Supabase Schema
-- Run this in: Supabase Dashboard > SQL Editor > New Query
-- ============================================================

-- Auto-create profile when a user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

-- Profiles table
create table if not exists public.profiles (
  id            uuid references auth.users(id) on delete cascade primary key,
  email         text,
  display_name  text,
  coins         integer default 100 not null,
  avatar_color  text default '#06B6D4',
  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null
);

-- Enrollments table
create table if not exists public.enrollments (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  course_id   text not null,
  enrolled_at timestamptz default now() not null,
  unique(user_id, course_id)
);

-- Liked reels table
create table if not exists public.liked_reels (
  user_id  uuid references auth.users(id) on delete cascade not null,
  reel_id  text not null,
  liked_at timestamptz default now() not null,
  primary key (user_id, reel_id)
);

-- Saved reels table
create table if not exists public.saved_reels (
  user_id  uuid references auth.users(id) on delete cascade not null,
  reel_id  text not null,
  saved_at timestamptz default now() not null,
  primary key (user_id, reel_id)
);

-- Row Level Security
alter table public.profiles   enable row level security;
alter table public.enrollments enable row level security;
alter table public.liked_reels enable row level security;
alter table public.saved_reels enable row level security;

-- Profiles policies
create policy "Own profile read"   on public.profiles for select using (auth.uid() = id);
create policy "Own profile update" on public.profiles for update using (auth.uid() = id);

-- Enrollments policies
create policy "Own enrollments all" on public.enrollments for all using (auth.uid() = user_id);

-- Liked reels policies
create policy "Own likes all" on public.liked_reels for all using (auth.uid() = user_id);

-- Saved reels policies
create policy "Own saves all" on public.saved_reels for all using (auth.uid() = user_id);

-- Trigger: create profile on signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
