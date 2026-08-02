-- ============================================================
-- TURFOG - Officials (E3): umpire/referee registry + bookings
-- Run in Supabase SQL Editor after 008.
-- ============================================================

create table if not exists public.officials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  username text default '',
  display_name text default '',
  avatar text default '',
  verified boolean default false,
  sport text,
  official_role text default 'referee',
  certification text default '',
  years_experience int default 0,
  matches_officiated int default 0,
  rating numeric default 0,
  reviews_count int default 0,
  price numeric,
  languages text default '',
  availability text default '',
  city text default '',
  area text default '',
  latitude double precision,
  longitude double precision,
  bio text default '',
  is_active boolean default true,
  created_at timestamptz default now(),
  unique (user_id)
);
alter table public.officials enable row level security;

create table if not exists public.official_bookings (
  id uuid primary key default gen_random_uuid(),
  official_id uuid references public.officials(id) on delete cascade,
  requester_id uuid references auth.users(id) on delete cascade,
  requester_name text default '',
  team_name text default '',
  sport text,
  match_date timestamptz,
  note text default '',
  status text default 'requested',
  created_at timestamptz default now()
);
alter table public.official_bookings enable row level security;

drop policy if exists off_read on public.officials;
drop policy if exists off_insert on public.officials;
drop policy if exists off_update on public.officials;
drop policy if exists off_delete on public.officials;
create policy off_read on public.officials for select using (true);
create policy off_insert on public.officials for insert with check (auth.uid() = user_id);
create policy off_update on public.officials for update using (auth.uid() = user_id);
create policy off_delete on public.officials for delete using (auth.uid() = user_id);

drop policy if exists ob_read on public.official_bookings;
drop policy if exists ob_insert on public.official_bookings;
drop policy if exists ob_update on public.official_bookings;
create policy ob_read on public.official_bookings for select using (
  auth.uid() = requester_id or auth.uid() = (select user_id from public.officials where id = official_id)
);
create policy ob_insert on public.official_bookings for insert with check (auth.uid() = requester_id);
create policy ob_update on public.official_bookings for update using (
  auth.uid() = (select user_id from public.officials where id = official_id)
);

insert into public.officials (user_id, username, display_name, verified, sport, official_role, certification, years_experience, matches_officiated, rating, reviews_count, price, languages, availability, city, bio)
values
  (null, 'ravi_kumar', 'Ravi Kumar', true, 'football', 'referee', 'AIFF Certified Referee', 8, 240, 4.8, 52, 500, 'English, Tamil', 'Weekends and weekday evenings', 'Chennai', 'Experienced football referee for 5v5, 7v7 and 11v11. Calm, consistent, and fitness-focused.'),
  (null, 'suresh_menon', 'Suresh Menon', true, 'box-cricket', 'umpire', 'BCCI Level 2 Umpire', 12, 180, 4.9, 41, 800, 'English, Hindi, Marathi', 'Night matches preferred', 'Mumbai', 'Senior cricket umpire specializing in box cricket and corporate leagues.'),
  (null, 'anita_desai', 'Anita Desai', false, 'badminton', 'umpire', 'BWF Certified Umpire', 5, 90, 4.6, 23, 300, 'English, Kannada', 'Mornings and weekends', 'Bengaluru', 'Badminton umpire for singles and doubles. Tournament experience.'),
  (null, 'vikram_rao', 'Vikram Rao', false, 'padel', 'referee', 'National Padel Referee', 3, 45, 4.5, 12, 400, 'English, Telugu', 'Weekends', 'Hyderabad', 'Padel referee for glass-court doubles and club tournaments.'),
  (null, 'meera_nair', 'Meera Nair', true, 'football', 'scorer', 'Certified Match Official', 6, 120, 4.7, 28, 600, 'English, Malayalam', 'Flexible', 'Mumbai', 'Football referee and scorer. Available for youth and weekend leagues.');