-- ============================================================
-- TURFOG - Endorsements & reputation (E5)
-- Run in Supabase SQL Editor after 010.
-- ============================================================

create table if not exists public.endorsements (
  id uuid primary key default gen_random_uuid(),
  endorser_id uuid references auth.users(id) on delete cascade,
  endorsee_id uuid references auth.users(id) on delete cascade,
  category text not null,
  comment text default '',
  created_at timestamptz default now(),
  unique (endorser_id, endorsee_id, category),
  check (endorser_id <> endorsee_id)
);
alter table public.endorsements enable row level security;

drop policy if exists end_read on public.endorsements;
drop policy if exists end_insert on public.endorsements;
drop policy if exists end_delete on public.endorsements;
create policy end_read on public.endorsements for select using (true);
create policy end_insert on public.endorsements for insert with check (auth.uid() = endorser_id and endorser_id <> endorsee_id);
create policy end_delete on public.endorsements for delete using (auth.uid() = endorser_id);