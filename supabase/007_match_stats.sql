-- ============================================================
-- TURFOG - Match results & player stats (E10)
-- Run in Supabase SQL Editor.
-- ============================================================
create table if not exists public.match_results (
  id uuid primary key default gen_random_uuid(),
  sport text not null,
  team_a_name text default '',
  team_b_name text default '',
  score_a int default 0,
  score_b int default 0,
  location text default '',
  recorded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);
alter table public.match_results enable row level security;

drop policy if exists match_results_read on public.match_results;
drop policy if exists match_results_insert on public.match_results;
create policy match_results_read on public.match_results for select using (true);
create policy match_results_insert on public.match_results for insert with check (auth.uid() = recorded_by);

create table if not exists public.player_match_stats (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references public.match_results(id) on delete cascade,
  player_id uuid references auth.users(id) on delete cascade,
  player_name text default '',
  team_side text default 'a',
  goals int default 0,
  assists int default 0,
  created_at timestamptz default now()
);
alter table public.player_match_stats enable row level security;

drop policy if exists player_match_stats_read on public.player_match_stats;
drop policy if exists player_match_stats_insert on public.player_match_stats;
create policy player_match_stats_read on public.player_match_stats for select using (true);
create policy player_match_stats_insert on public.player_match_stats for insert with check (auth.uid() = player_id);