create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  sport text not null,
  team_a_name text default '',
  team_b_name text default '',
  score_a int default 0,
  score_b int default 0,
  venue text default '',
  status text default 'completed',
  played_at timestamptz default now(),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);
