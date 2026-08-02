-- ============================================================
-- TURFOG - Teams (ecosystem kernel: recruitment/officials/tournaments plug in here)
-- Run in Supabase SQL Editor after 001-005.
-- ============================================================

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  sport text,
  city text default '',
  area text default '',
  description text default '',
  logo text default '',
  cover text default '',
  home_turf text default '',
  founded_year int,
  owner_id uuid references auth.users(id) on delete set null,
  member_count int default 0,
  follower_count int default 0,
  is_verified boolean default false,
  created_at timestamptz default now()
);
alter table public.teams enable row level security;

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references public.teams(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  username text default '',
  display_name text default '',
  avatar text default '',
  role text default 'member',
  jersey_number int,
  position text default '',
  status text default 'active',
  joined_at timestamptz default now(),
  unique (team_id, user_id)
);
alter table public.team_members enable row level security;

create table if not exists public.team_follows (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references public.teams(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  unique (team_id, user_id)
);
alter table public.team_follows enable row level security;

alter table public.posts add column if not exists team_id uuid references public.teams(id) on delete set null;

drop policy if exists teams_read on public.teams;
drop policy if exists teams_insert on public.teams;
drop policy if exists teams_update on public.teams;
drop policy if exists teams_delete on public.teams;
create policy teams_read on public.teams for select using (true);
create policy teams_insert on public.teams for insert with check (auth.uid() = owner_id);
create policy teams_update on public.teams for update using (auth.uid() = owner_id);
create policy teams_delete on public.teams for delete using (auth.uid() = owner_id);

drop policy if exists tm_read on public.team_members;
drop policy if exists tm_insert on public.team_members;
drop policy if exists tm_update on public.team_members;
drop policy if exists tm_delete on public.team_members;
create policy tm_read on public.team_members for select using (true);
create policy tm_insert on public.team_members for insert with check (auth.uid() = user_id);
create policy tm_update on public.team_members for update using (auth.uid() = user_id);
create policy tm_delete on public.team_members for delete using (auth.uid() = user_id);

drop policy if exists tf_read on public.team_follows;
drop policy if exists tf_insert on public.team_follows;
drop policy if exists tf_delete on public.team_follows;
create policy tf_read on public.team_follows for select using (true);
create policy tf_insert on public.team_follows for insert with check (auth.uid() = user_id);
create policy tf_delete on public.team_follows for delete using (auth.uid() = user_id);

create or replace function public.join_team(p_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_exists boolean;
  v_count int;
  v_username text; v_name text; v_avatar text;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  select exists(select 1 from public.team_members where team_id = p_id and user_id = v_uid and status = 'active') into v_exists;
  if v_exists then
    delete from public.team_members where team_id = p_id and user_id = v_uid;
  else
    select coalesce(username,'player'), coalesce(full_name, username, 'Player'), coalesce(profile_photo,'')
      into v_username, v_name, v_avatar from public.players where auth_id = v_uid;
    insert into public.team_members (team_id, user_id, username, display_name, avatar, role, status)
      values (p_id, v_uid, v_username, v_name, v_avatar, 'member', 'active')
      on conflict (team_id, user_id) do update set status = 'active';
  end if;
  select count(*) into v_count from public.team_members where team_id = p_id and status = 'active';
  update public.teams set member_count = v_count where id = p_id;
  return jsonb_build_object('joined', not v_exists, 'member_count', v_count);
end; $$;

create or replace function public.follow_team(p_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_exists boolean;
  v_count int;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  select exists(select 1 from public.team_follows where team_id = p_id and user_id = v_uid) into v_exists;
  if v_exists then
    delete from public.team_follows where team_id = p_id and user_id = v_uid;
  else
    insert into public.team_follows (team_id, user_id) values (p_id, v_uid);
  end if;
  select count(*) into v_count from public.team_follows where team_id = p_id;
  update public.teams set follower_count = v_count where id = p_id;
  return jsonb_build_object('following', not v_exists, 'follower_count', v_count);
end; $$;

do $$ begin alter publication supabase_realtime add table public.teams; exception when others then null; end $$;
do $$ begin alter publication supabase_realtime add table public.team_members; exception when others then null; end $$;
do $$ begin alter publication supabase_realtime add table public.team_follows; exception when others then null; end $$;

-- Seed teams
insert into public.teams (name, slug, sport, city, area, description, home_turf, founded_year, member_count, follower_count, is_verified)
values
  ('Chennai Warriors','chennai-warriors','football','Chennai','Velachery','Competitive but friendly 5v5 and 7v7 football. Two sessions a week.','Velachery Turf Arena',2021,5,182,true),
  ('Mumbai Strikers','mumbai-strikers','box-cricket','Mumbai','Bandra','Night box cricket league. Tennis ball, hard ball, and corporate fixtures.','Bandra Box Cricket Hub',2020,4,141,true),
  ('Bengaluru Smashers','bengaluru-smashers','badminton','Bengaluru','Koramangala','Doubles specialists. Weekly ladder and coaching.','Koramangala Sports Court',2022,3,88,false),
  ('Hyderabad Padel Club','hyderabad-padel-club','padel','Hyderabad','Gachibowli','Glass court padel. Beginner to advanced. Weekend tournaments.','Gachibowli Padel Arena',2023,3,54,false);

-- Seed members (display-only; user_id null is allowed and bypassed via SQL editor)
insert into public.team_members (team_id, user_id, username, display_name, avatar, role, jersey_number, position, status)
select id, null, 'vikram_singh', 'Vikram Singh', '', 'owner', 10, 'Striker', 'active' from public.teams where slug = 'chennai-warriors';
insert into public.team_members (team_id, user_id, username, display_name, avatar, role, jersey_number, position, status)
select id, null, 'rahul_sharma', 'Rahul Sharma', '', 'captain', 7, 'Midfielder', 'active' from public.teams where slug = 'chennai-warriors';
insert into public.team_members (team_id, user_id, username, display_name, avatar, role, jersey_number, position, status)
select id, null, 'arjun_nair', 'Arjun Nair', '', 'vice', 9, 'Winger', 'active' from public.teams where slug = 'chennai-warriors';
insert into public.team_members (team_id, user_id, username, display_name, avatar, role, jersey_number, position, status)
select id, null, 'sneha_reddy', 'Sneha Reddy', '', 'member', 4, 'Defender', 'active' from public.teams where slug = 'chennai-warriors';
insert into public.team_members (team_id, user_id, username, display_name, avatar, role, jersey_number, position, status)
select id, null, 'priya_patel', 'Priya Patel', '', 'member', 11, 'Goalkeeper', 'active' from public.teams where slug = 'chennai-warriors';

insert into public.team_members (team_id, user_id, username, display_name, avatar, role, jersey_number, position, status)
select id, null, 'arjun_nair', 'Arjun Nair', '', 'owner', 1, 'All-rounder', 'active' from public.teams where slug = 'mumbai-strikers';
insert into public.team_members (team_id, user_id, username, display_name, avatar, role, jersey_number, position, status)
select id, null, 'rahul_sharma', 'Rahul Sharma', '', 'captain', 18, 'Batsman', 'active' from public.teams where slug = 'mumbai-strikers';
insert into public.team_members (team_id, user_id, username, display_name, avatar, role, jersey_number, position, status)
select id, null, 'vikram_singh', 'Vikram Singh', '', 'member', 99, 'Bowler', 'active' from public.teams where slug = 'mumbai-strikers';

insert into public.team_members (team_id, user_id, username, display_name, avatar, role, jersey_number, position, status)
select id, null, 'sneha_reddy', 'Sneha Reddy', '', 'owner', 0, 'Doubles', 'active' from public.teams where slug = 'bengaluru-smashers';
insert into public.team_members (team_id, user_id, username, display_name, avatar, role, jersey_number, position, status)
select id, null, 'priya_patel', 'Priya Patel', '', 'captain', 0, 'Singles', 'active' from public.teams where slug = 'bengaluru-smashers';

insert into public.team_members (team_id, user_id, username, display_name, avatar, role, jersey_number, position, status)
select id, null, 'priya_patel', 'Priya Patel', '', 'owner', 0, 'Right court', 'active' from public.teams where slug = 'hyderabad-padel-club';
insert into public.team_members (team_id, user_id, username, display_name, avatar, role, jersey_number, position, status)
select id, null, 'sneha_reddy', 'Sneha Reddy', '', 'member', 0, 'Left court', 'active' from public.teams where slug = 'hyderabad-padel-club';

-- Seed team posts
insert into public.posts (author_id, author_name, author_username, author_verified, text, image_url, media_type, likes_count, comments_count, team_id, created_at)
select null, 'Vikram Singh', 'vikram_singh', true, 'Warriors took the derby 3-2 last night. Two more slots open for Sunday. Who is in?', 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=900&q=80', 'image', 34, 5, id, now() - interval '1 day' from public.teams where slug = 'chennai-warriors';
insert into public.posts (author_id, author_name, author_username, author_verified, text, image_url, media_type, likes_count, comments_count, team_id, created_at)
select null, 'Rahul Sharma', 'rahul_sharma', true, 'Training session moved to 7 PM Thursday at Velachery Turf Arena. Bring boots.', null, null, 12, 2, id, now() - interval '3 hours' from public.teams where slug = 'chennai-warriors';
insert into public.posts (author_id, author_name, author_username, author_verified, text, image_url, media_type, likes_count, comments_count, team_id, created_at)
select null, 'Arjun Nair', 'arjun_nair', true, 'Strikers are recruiting a reliable bowler for the night league. DM or request to join.', 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=900&q=80', 'image', 21, 4, id, now() - interval '2 days' from public.teams where slug = 'mumbai-strikers';