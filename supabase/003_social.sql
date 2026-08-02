-- ============================================================
-- TURFOG - Social layer (posts, likes, comments, follows)
-- Run in Supabase SQL Editor after 001 + 002.
-- ============================================================

-- 1) Posts
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references auth.users(id) on delete set null,
  author_name text default 'Player',
  author_username text default 'player',
  author_avatar text default '',
  author_verified boolean default false,
  sport text,
  location text default '',
  text text default '',
  image_url text,
  image_alt text default '',
  media_type text,
  likes_count int default 0,
  comments_count int default 0,
  shares_count int default 0,
  created_at timestamptz default now()
);
alter table public.posts enable row level security;
drop policy if exists posts_read on public.posts;
drop policy if exists posts_insert on public.posts;
drop policy if exists posts_update on public.posts;
drop policy if exists posts_delete on public.posts;
create policy posts_read on public.posts for select using (true);
create policy posts_insert on public.posts for insert with check (auth.uid() = author_id);
create policy posts_update on public.posts for update using (auth.uid() = author_id);
create policy posts_delete on public.posts for delete using (auth.uid() = author_id);
create index if not exists posts_created_idx on public.posts (created_at desc);

-- 2) Likes
create table if not exists public.post_likes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.posts(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  unique (post_id, user_id)
);
alter table public.post_likes enable row level security;
drop policy if exists pl_read on public.post_likes;
drop policy if exists pl_insert on public.post_likes;
drop policy if exists pl_delete on public.post_likes;
create policy pl_read on public.post_likes for select using (true);
create policy pl_insert on public.post_likes for insert with check (auth.uid() = user_id);
create policy pl_delete on public.post_likes for delete using (auth.uid() = user_id);
create index if not exists post_likes_post_idx on public.post_likes (post_id);
create index if not exists post_likes_user_idx on public.post_likes (user_id);

-- 3) Comments
create table if not exists public.post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.posts(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  author_name text default 'Player',
  author_avatar text default '',
  text text,
  created_at timestamptz default now()
);
alter table public.post_comments enable row level security;
drop policy if exists pc_read on public.post_comments;
drop policy if exists pc_insert on public.post_comments;
drop policy if exists pc_delete on public.post_comments;
create policy pc_read on public.post_comments for select using (true);
create policy pc_insert on public.post_comments for insert with check (auth.uid() = user_id);
create policy pc_delete on public.post_comments for delete using (auth.uid() = user_id);
create index if not exists post_comments_post_idx on public.post_comments (post_id, created_at);

-- 4) Follows
create table if not exists public.follows (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid references auth.users(id) on delete cascade,
  follower_username text default '',
  following_id uuid references auth.users(id) on delete cascade,
  following_username text default '',
  created_at timestamptz default now(),
  unique (follower_id, following_id),
  check (follower_id <> following_id)
);
alter table public.follows enable row level security;
drop policy if exists fw_read on public.follows;
drop policy if exists fw_insert on public.follows;
drop policy if exists fw_delete on public.follows;
create policy fw_read on public.follows for select using (true);
create policy fw_insert on public.follows for insert with check (auth.uid() = follower_id);
create policy fw_delete on public.follows for delete using (auth.uid() = follower_id);
create index if not exists follows_follower_idx on public.follows (follower_id);
create index if not exists follows_following_idx on public.follows (following_id);

-- 5) Follower / following counters on players
alter table public.players add column if not exists followers_count int default 0;
alter table public.players add column if not exists following_count int default 0;

-- 6) Realtime on the social tables
do $$ begin alter publication supabase_realtime add table public.posts; exception when others then null; end $$;
do $$ begin alter publication supabase_realtime add table public.post_likes; exception when others then null; end $$;
do $$ begin alter publication supabase_realtime add table public.post_comments; exception when others then null; end $$;
do $$ begin alter publication supabase_realtime add table public.follows; exception when others then null; end $$;

-- ============================================================
-- RPCs: atomic, SECURITY DEFINER so count updates bypass RLS
-- while auth.uid() guards who may act.
-- ============================================================

create or replace function public.toggle_post_like(p_post_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_exists boolean;
  v_count int;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  select exists(select 1 from public.post_likes where post_id = p_post_id and user_id = v_uid) into v_exists;
  if v_exists then
    delete from public.post_likes where post_id = p_post_id and user_id = v_uid;
  else
    insert into public.post_likes (post_id, user_id) values (p_post_id, v_uid);
  end if;
  select count(*) into v_count from public.post_likes where post_id = p_post_id;
  update public.posts set likes_count = v_count where id = p_post_id;
  return jsonb_build_object('liked', not v_exists, 'likes_count', v_count);
end; $$;

create or replace function public.add_post_comment(p_post_id uuid, p_text text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_name text;
  v_avatar text;
  v_id uuid;
  v_count int;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  select coalesce(full_name, username, 'Player'), coalesce(profile_photo, '')
    into v_name, v_avatar from public.players where auth_id = v_uid;
  insert into public.post_comments (post_id, user_id, author_name, author_avatar, text)
    values (p_post_id, v_uid, v_name, v_avatar, p_text) returning id into v_id;
  update public.posts set comments_count = comments_count + 1 where id = p_post_id;
  select comments_count into v_count from public.posts where id = p_post_id;
  return jsonb_build_object(
    'id', v_id, 'authorName', v_name, 'authorAvatar', v_avatar,
    'text', p_text, 'createdAt', now(), 'comments_count', v_count
  );
end; $$;

create or replace function public.share_post(p_post_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_count int;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  update public.posts set shares_count = shares_count + 1 where id = p_post_id returning shares_count into v_count;
  return jsonb_build_object('shares_count', v_count);
end; $$;

create or replace function public.toggle_follow(p_target_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_my_username text;
  v_target_username text;
  v_exists boolean;
  v_followers int;
  v_following int;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  if v_uid = p_target_id then raise exception 'cannot follow yourself'; end if;
  select username into v_my_username from public.players where auth_id = v_uid;
  select username into v_target_username from public.players where auth_id = p_target_id;
  select exists(select 1 from public.follows where follower_id = v_uid and following_id = p_target_id) into v_exists;
  if v_exists then
    delete from public.follows where follower_id = v_uid and following_id = p_target_id;
  else
    insert into public.follows (follower_id, follower_username, following_id, following_username)
      values (v_uid, v_my_username, p_target_id, v_target_username);
  end if;
  select count(*) into v_followers from public.follows where following_id = p_target_id;
  select count(*) into v_following from public.follows where follower_id = v_uid;
  update public.players set followers_count = v_followers where auth_id = p_target_id;
  update public.players set following_count = v_following where auth_id = v_uid;
  return jsonb_build_object('following', not v_exists, 'followers_count', v_followers, 'following_count', v_following);
end; $$;

-- 7) Seed rich-looking posts (system author; reads are public so null author_id is fine)
insert into public.posts (author_id, author_name, author_username, author_verified, sport, location, text, image_url, image_alt, media_type, likes_count, comments_count, shares_count, created_at)
values
  (null,'Rahul Sharma','rahul_sharma',true,'football','Andheri west, Mumbai','What a finish tonight. Last-minute winner in the 5v5 and the whole turf erupted. This is why we play. Who is up for a rematch this weekend?','https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=900&q=80','Football players celebrating on artificial turf at golden hour','image',128,2,6, now()-interval '12 minutes'),
  (null,'Arjun Nair','arjun_nair',true,'box-cricket','Shivaji park, Mumbai','Match highlights from Sunday league. Full send.','https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=900&q=80','Box cricket match under floodlights','video',210,1,18, now()-interval '3 hours'),
  (null,'Priya Patel','priya_patel',false,'badminton','Powai, Mumbai','First clean smash of the season and it felt perfect. Doubles partner carried me today, thank you Sneha.','https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=900&q=80','Badminton player mid-rally on a modern indoor court','image',92,0,4, now()-interval '90 minutes');

insert into public.post_comments (post_id, user_id, author_name, author_avatar, text, created_at)
select p.id, null, 'Priya Patel', '', 'That goal was insane!', now()-interval '8 minutes'
from public.posts p where p.author_username = 'rahul_sharma' order by p.created_at desc limit 1;

insert into public.post_comments (post_id, user_id, author_name, author_avatar, text, created_at)
select p.id, null, 'Arjun Nair', '', 'Rematch on, Saturday 6 PM?', now()-interval '5 minutes'
from public.posts p where p.author_username = 'rahul_sharma' order by p.created_at desc limit 1;