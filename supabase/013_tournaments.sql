-- ============================================================
-- TURFOG - Tournaments (E7a): league format, fixtures, tables
-- Run in Supabase SQL Editor after 012.
-- ============================================================

create table if not exists public.tournaments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  sport text,
  format text default 'league',
  status text default 'registration',
  city text default '',
  description text default '',
  starts_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);
alter table public.tournaments enable row level security;

create table if not exists public.tournament_teams (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid references public.tournaments(id) on delete cascade,
  team_id uuid references public.teams(id) on delete cascade,
  registered_by uuid references auth.users(id) on delete set null,
  status text default 'registered',
  registered_at timestamptz default now(),
  unique (tournament_id, team_id)
);
alter table public.tournament_teams enable row level security;

create table if not exists public.tournament_fixtures (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid references public.tournaments(id) on delete cascade,
  round int default 1,
  team_a_id uuid references public.teams(id) on delete set null,
  team_b_id uuid references public.teams(id) on delete set null,
  score_a int default 0,
  score_b int default 0,
  status text default 'upcoming',
  played_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);
alter table public.tournament_fixtures enable row level security;

drop policy if exists tn_read on public.tournaments;
drop policy if exists tn_insert on public.tournaments;
drop policy if exists tn_update on public.tournaments;
create policy tn_read on public.tournaments for select using (true);
create policy tn_insert on public.tournaments for insert with check (auth.uid() = created_by);
create policy tn_update on public.tournaments for update using (auth.uid() = created_by);

drop policy if exists tt_read on public.tournament_teams;
drop policy if exists tt_insert on public.tournament_teams;
create policy tt_read on public.tournament_teams for select using (true);
create policy tt_insert on public.tournament_teams for insert with check (auth.uid() = registered_by);

drop policy if exists tf_read on public.tournament_fixtures;
drop policy if exists tf_insert on public.tournament_fixtures;
drop policy if exists tf_update on public.tournament_fixtures;
create policy tf_read on public.tournament_fixtures for select using (true);
create policy tf_insert on public.tournament_fixtures for insert with check (auth.uid() = created_by);
create policy tf_update on public.tournament_fixtures for update using (auth.uid() = created_by);