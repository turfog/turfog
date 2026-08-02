-- ============================================================
-- TURFOG - Live Discovery Engine schema
-- Run this in Supabase: Database -> SQL Editor -> New query -> Run
-- ============================================================

-- 1) Players: location + live presence columns
alter table public.players add column if not exists latitude double precision;
alter table public.players add column if not exists longitude double precision;
alter table public.players add column if not exists location_label text default '';
alter table public.players add column if not exists presence_status text default 'offline';
alter table public.players add column if not exists presence_expires_at timestamptz;

-- 2) Heartbeats (I Want to Play / Looking for Player live signals)
create table if not exists public.heartbeats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  user_name text default '',
  user_username text default '',
  user_avatar text default '',
  verified boolean default false,
  type text check (type in ('i-want-to-play','looking-for-player')),
  sport text,
  skill_level text default 'intermediate',
  location text default '',
  latitude double precision,
  longitude double precision,
  note text default '',
  is_active boolean default true,
  expires_at timestamptz,
  created_at timestamptz default now()
);
alter table public.heartbeats enable row level security;
drop policy if exists hb_read on public.heartbeats;
drop policy if exists hb_insert on public.heartbeats;
drop policy if exists hb_update on public.heartbeats;
drop policy if exists hb_delete on public.heartbeats;
create policy hb_read on public.heartbeats for select using (true);
create policy hb_insert on public.heartbeats for insert with check (auth.uid() = user_id);
create policy hb_update on public.heartbeats for update using (auth.uid() = user_id);
create policy hb_delete on public.heartbeats for delete using (auth.uid() = user_id);
create index if not exists heartbeats_active_idx on public.heartbeats (is_active, created_at desc);

-- 3) Match requests (the "Players Wanted" cards)
create table if not exists public.match_requests (
  id uuid primary key default gen_random_uuid(),
  organizer_id uuid references auth.users(id) on delete set null,
  organizer_name text default '',
  organizer_username text default '',
  organizer_avatar text default '',
  verified boolean default false,
  sport text,
  needed int default 1,
  capacity int default 1,
  waitlist_count int default 0,
  kickoff_at timestamptz,
  venue text default '',
  area text default '',
  latitude double precision,
  longitude double precision,
  skill text default 'any',
  match_type text default 'casual',
  team_name text,
  is_active boolean default true,
  created_at timestamptz default now()
);
alter table public.match_requests enable row level security;
drop policy if exists mr_read on public.match_requests;
drop policy if exists mr_insert on public.match_requests;
drop policy if exists mr_update on public.match_requests;
drop policy if exists mr_delete on public.match_requests;
create policy mr_read on public.match_requests for select using (true);
create policy mr_insert on public.match_requests for insert with check (auth.uid() = organizer_id);
create policy mr_update on public.match_requests for update using (auth.uid() = organizer_id);
create policy mr_delete on public.match_requests for delete using (auth.uid() = organizer_id);
create index if not exists match_requests_active_idx on public.match_requests (is_active, kickoff_at);

-- 4) Participants (joined / waitlist)
create table if not exists public.match_request_participants (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references public.match_requests(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  status text check (status in ('joined','waitlist')) default 'joined',
  created_at timestamptz default now(),
  unique (request_id, user_id)
);
alter table public.match_request_participants enable row level security;
drop policy if exists mpp_read on public.match_request_participants;
drop policy if exists mpp_insert on public.match_request_participants;
drop policy if exists mpp_update on public.match_request_participants;
drop policy if exists mpp_delete on public.match_request_participants;
create policy mpp_read on public.match_request_participants for select using (true);
create policy mpp_insert on public.match_request_participants for insert with check (auth.uid() = user_id);
create policy mpp_update on public.match_request_participants for update using (auth.uid() = user_id);
create policy mpp_delete on public.match_request_participants for delete using (auth.uid() = user_id);

-- 5) Enable Realtime on the discovery tables (ignore "already member" errors)
do $$ begin alter publication supabase_realtime add table public.heartbeats; exception when others then null; end $$;
do $$ begin alter publication supabase_realtime add table public.match_requests; exception when others then null; end $$;
do $$ begin alter publication supabase_realtime add table public.match_request_participants; exception when others then null; end $$;

-- 6) Seed a few live requests so the panel is populated on first load
insert into public.match_requests
  (organizer_name, organizer_username, verified, sport, needed, capacity, waitlist_count, kickoff_at, venue, area, latitude, longitude, skill, match_type, team_name)
values
  ('Rahul Sharma', 'rahul_sharma', true,  'football',    1, 1, 0, now() + interval '14 minutes', 'Champions Turf', 'Andheri west', 19.1136, 72.8697, 'intermediate', 'casual',      null),
  ('Arjun Nair',   'arjun_nair',   true,  'box-cricket', 0, 2, 3, now() + interval '38 minutes', 'Sixer Arena',    'Bandra',       19.0544, 72.8302, 'advanced',     'competitive', 'Bandra Strikers'),
  ('Sneha Reddy',  'sneha_reddy',  false, 'badminton',   2, 2, 0, now() + interval '95 minutes', 'Smash Court',    'Powai',        19.1176, 72.9060, 'any',          'practice',    null),
  ('Priya Patel',  'priya_patel',  false, 'pickleball',  3, 3, 0, now() + interval '8 minutes',  'Pickle Hub',     'Juhu',         19.0883, 72.8265, 'beginner',     'casual',      null);