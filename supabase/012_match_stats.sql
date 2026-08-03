-- ============================================================
-- TURFOG - Matches + per-player performance stats (E6)
-- Run in Supabase SQL Editor after 011.
-- ============================================================

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  sport text,
  team_a_name text default '',
  team_b_name text default '',
  score_a int default 0,
  score_b int default 0,
  venue text default '',
  mvp_user_id uuid,
  status text default 'completed',
  played_at timestamptz default now(),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);
alter table public.matches enable row level security;

create table if not exists public.player_match_stats (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references public.matches(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  goals int default 0,
  assists int default 0,
  runs int default 0,
  wickets int default 0,
  saves int default 0,
  points int default 0,
  mvp boolean default false,
  created_at timestamptz default now(),
  unique (match_id, user_id)
);
alter table public.player_match_stats enable row level security;

drop policy if exists mt_read on public.matches;
drop policy if exists mt_insert on public.matches;
drop policy if exists mt_update on public.matches;
create policy mt_read on public.matches for select using (true);
create policy mt_insert on public.matches for insert with check (auth.uid() = created_by);
create policy mt_update on public.matches for update using (auth.uid() = created_by);

drop policy if exists pms_read on public.player_match_stats;
drop policy if exists pms_insert on public.player_match_stats;
drop policy if exists pms_update on public.player_match_stats;
create policy pms_read on public.player_match_stats for select using (true);
create policy pms_insert on public.player_match_stats for insert with check (auth.uid() = user_id);
create policy pms_update on public.player_match_stats for update using (auth.uid() = user_id);