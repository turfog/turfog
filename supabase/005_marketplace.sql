-- ============================================================
-- TURFOG - Marketplace (E8)
-- Run in Supabase SQL Editor.
-- ============================================================
create table if not exists public.marketplace_listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references auth.users(id) on delete set null,
  seller_name text,
  seller_username text,
  title text not null,
  category text default 'equipment',
  description text default '',
  price numeric,
  location text default '',
  image_url text,
  is_active boolean default true,
  created_at timestamptz default now()
);
alter table public.marketplace_listings enable row level security;

drop policy if exists mkt_read on public.marketplace_listings;
drop policy if exists mkt_insert on public.marketplace_listings;
create policy mkt_read on public.marketplace_listings for select using (true);
create policy mkt_insert on public.marketplace_listings for insert with check (auth.uid() = seller_id);

insert into public.marketplace_listings (seller_name, seller_username, title, category, description, price, location)
values
  ('Rahul Sharma', 'rahul_sharma', 'Football coaching - 1hr session', 'coaching', 'Technical drills and match tactics. All levels welcome.', 500, 'Andheri'),
  ('Priya Patel', 'priya_patel', 'Badminton racket - Yonex Nanoflare', 'equipment', 'Barely used, grip replaced. Great for intermediate players.', 2200, 'Powai'),
  ('Arjun Nair', 'arjun_nair', 'Box cricket umpire available', 'coaching', 'Certified umpire for box cricket leagues. Weekends only.', 800, 'Bandra'),
  ('Sneha Reddy', 'sneha_reddy', 'Physio session - sports injury', 'physio', 'Sports injury assessment and recovery. Home visits available.', 700, 'Velachery'),
  ('Vikram Singh', 'vikram_singh', 'Turf booking - Saturday slots', 'venue', '5v5 turf available Saturday evenings. Floodlights included.', 1500, 'Bandra'),
  ('Meera Nair', 'meera_nair', 'Match photography package', 'photography', 'Full match coverage, edited photos within 48 hours.', 1200, 'Powai');