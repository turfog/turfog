-- ============================================================
-- TURFOG - Endorsements & reputation (E9)
-- Run in Supabase SQL Editor.
-- ============================================================
create table if not exists public.endorsements (
  id uuid primary key default gen_random_uuid(),
  endorser_id uuid references auth.users(id) on delete cascade,
  endorsee_id uuid references auth.users(id) on delete cascade,
  category text not null,
  created_at timestamptz default now(),
  unique (endorser_id, endorsee_id, category)
);
alter table public.endorsements enable row level security;

drop policy if exists endorse_read on public.endorsements;
drop policy if exists endorse_insert on public.endorsements;
create policy endorse_read on public.endorsements for select using (true);
create policy endorse_insert on public.endorsements for insert with check (auth.uid() = endorser_id);