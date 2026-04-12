-- ================================================
-- ZenMind Migration: Community Posts & Stats
-- Run this in Supabase SQL Editor
-- ================================================

-- 1. Community Posts
create table public.community_posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete set null,
  group_id text,  -- matches the hardcoded group IDs: 'g1', 'g2', 'g3', or null for global
  author_name text not null default 'Anonymous',
  content text not null,
  created_at timestamptz default now() not null
);

alter table public.community_posts enable row level security;

-- Everyone can read posts
create policy "Posts are viewable by everyone"
  on community_posts for select
  using (true);

-- Authenticated users can create posts
create policy "Authenticated users can create posts"
  on community_posts for insert
  with check (auth.uid() is not null);

-- Users can delete their own posts
create policy "Users can delete own posts"
  on community_posts for delete
  using (auth.uid() = user_id);


-- 2. Community Comments
create table public.community_comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.community_posts on delete cascade not null,
  user_id uuid references auth.users on delete set null,
  author_name text not null default 'Anonymous',
  content text not null,
  created_at timestamptz default now() not null
);

alter table public.community_comments enable row level security;

create policy "Comments are viewable by everyone"
  on community_comments for select
  using (true);

create policy "Authenticated users can create comments"
  on community_comments for insert
  with check (auth.uid() is not null);

create policy "Users can delete own comments"
  on community_comments for delete
  using (auth.uid() = user_id);


-- 3. Community Likes (one per user per post)
create table public.community_likes (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.community_posts on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  created_at timestamptz default now() not null,
  unique (post_id, user_id)
);

alter table public.community_likes enable row level security;

create policy "Likes are viewable by everyone"
  on community_likes for select
  using (true);

create policy "Authenticated users can like"
  on community_likes for insert
  with check (auth.uid() = user_id);

create policy "Users can unlike (delete own likes)"
  on community_likes for delete
  using (auth.uid() = user_id);


-- 4. Site Stats (single-row config table for homepage)
create table public.site_stats (
  id int primary key default 1 check (id = 1),  -- ensures single row
  member_count text not null default '10k+',
  app_rating text not null default '4.9/5',
  updated_at timestamptz default now() not null
);

alter table public.site_stats enable row level security;

create policy "Site stats are viewable by everyone"
  on site_stats for select
  using (true);

-- Insert the initial stats row
insert into public.site_stats (member_count, app_rating)
values ('10k+', '4.9/5');
