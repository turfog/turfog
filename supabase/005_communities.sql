-- ============================================================
-- TURFOG - Communities (foundation of the ecosystem's social layer)
-- Run in Supabase SQL Editor after 001-004.
-- ============================================================

create table if not exists public.communities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  sport text,
  city text default '',
  area text default '',
  description text default '',
  cover text default '',
  member_count int default 0,
  is_verified boolean default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);
alter table public.communities enable row level security;

create table if not exists public.community_members (
  id uuid primary key default gen_random_uuid(),
  community_id uuid references public.communities(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text default 'member',
  joined_at timestamptz default now(),
  unique (community_id, user_id)
);
alter table public.community_members enable row level security;

drop policy if exists com_read on public.communities;
drop policy if exists com_insert on public.communities;
drop policy if exists com_update on public.communities;
drop policy if exists com_delete on public.communities;
create policy com_read on public.communities for select using (true);
create policy com_insert on public.communities for insert with check (auth.uid() = created_by);
create policy com_update on public.communities for update using (auth.uid() = created_by);
create policy com_delete on public.communities for delete using (auth.uid() = created_by);

drop policy if exists comm_read on public.community_members;
drop policy if exists comm_insert on public.community_members;
drop policy if exists comm_delete on public.community_members;
create policy comm_read on public.community_members for select using (true);
create policy comm_insert on public.community_members for insert with check (auth.uid() = user_id);
create policy comm_delete on public.community_members for delete using (auth.uid() = user_id);

create or replace function public.join_community(p_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_exists boolean;
  v_count int;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  select exists(select 1 from public.community_members where community_id = p_id and user_id = v_uid) into v_exists;
  if v_exists then
    delete from public.community_members where community_id = p_id and user_id = v_uid;
  else
    insert into public.community_members (community_id, user_id, role) values (p_id, v_uid, 'member');
  end if;
  select count(*) into v_count from public.community_members where community_id = p_id;
  update public.communities set member_count = v_count where id = p_id;
  return jsonb_build_object('joined', not v_exists, 'member_count', v_count);
end; $$;

do $$ begin alter publication supabase_realtime add table public.communities; exception when others then null; end $$;
do $$ begin alter publication supabase_realtime add table public.community_members; exception when others then null; end $$;

insert into public.communities (name, slug, sport, city, area, description, member_count, is_verified)
values
  ('Mumbai weekend warriors','mumbai-weekend-warriors','football','Mumbai','Andheri','The biggest 5v5 football community in Mumbai. Every Saturday and Sunday.',248,true),
  ('Bandra box cricket league','bandra-box-cricket-league','box-cricket','Mumbai','Bandra','Night cricket under the lights. Tennis ball, corporate and casual teams.',186,true),
  ('Andheri badminton hub','andheri-badminton-hub','badminton','Mumbai','Andheri','Singles, doubles, mixed doubles. Morning and evening batches. Coaching available.',156,false),
  ('Powai pickleball club','powai-pickleball-club','pickleball','Mumbai','Powai','Beginner friendly. Weekly ladder. Coaching sessions every Wednesday.',94,false),
  ('South Mumbai padel society','south-mumbai-padel-society','padel','Mumbai','Colaba','Premium glass court doubles. Weekend tournaments. All skill levels.',72,false),
  ('Juhu football academy community','juhu-football-academy','football','Mumbai','Juhu','Youth and weekend football. Drills, scrimmages and matches.',120,false);