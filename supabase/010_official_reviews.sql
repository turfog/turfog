-- ============================================================
-- TURFOG - Official reviews + completion rollups (E3b)
-- Run in Supabase SQL Editor after 009.
-- ============================================================

create table if not exists public.official_reviews (
  id uuid primary key default gen_random_uuid(),
  official_id uuid references public.officials(id) on delete cascade,
  booking_id uuid references public.official_bookings(id) on delete cascade,
  reviewer_id uuid references auth.users(id) on delete cascade,
  reviewer_name text default '',
  rating int not null check (rating >= 1 and rating <= 5),
  comment text default '',
  created_at timestamptz default now(),
  unique (booking_id)
);
alter table public.official_reviews enable row level security;

drop policy if exists orv_read on public.official_reviews;
drop policy if exists orv_insert on public.official_reviews;
drop policy if exists orv_delete on public.official_reviews;
create policy orv_read on public.official_reviews for select using (true);
create policy orv_insert on public.official_reviews for insert with check (auth.uid() = reviewer_id);
create policy orv_delete on public.official_reviews for delete using (auth.uid() = reviewer_id);

-- either the requester or the official can update a booking (e.g. mark completed)
drop policy if exists ob_update on public.official_bookings;
create policy ob_update on public.official_bookings for update using (
  auth.uid() = requester_id or auth.uid() = (select user_id from public.officials where id = official_id)
);

-- bump matches officiated when a booking is completed
create or replace function public.handle_booking_completed()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.status = 'completed' and old.status is distinct from 'completed' then
    update public.officials set matches_officiated = matches_officiated + 1 where id = new.official_id;
  end if;
  return new;
end; $$;

drop trigger if exists on_booking_completed on public.official_bookings;
create trigger on_booking_completed after update on public.official_bookings
  for each row execute function public.handle_booking_completed();

-- recount rating + reviews when a review is added
create or replace function public.handle_official_review()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_count int;
  v_avg numeric;
begin
  select count(*), coalesce(avg(rating), 0) into v_count, v_avg
    from public.official_reviews where official_id = new.official_id;
  update public.officials set reviews_count = v_count, rating = round(v_avg, 2) where id = new.official_id;
  return new;
end; $$;

drop trigger if exists on_official_review on public.official_reviews;
create trigger on_official_review after insert on public.official_reviews
  for each row execute function public.handle_official_review();