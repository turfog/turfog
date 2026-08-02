-- ============================================================
-- TURFOG - Messaging (conversations, members, messages)
-- Run in Supabase SQL Editor after 001/002/003.
-- ============================================================

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  is_group boolean default false,
  title text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);
alter table public.conversations enable row level security;

create table if not exists public.conversation_members (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  username text default '',
  display_name text default '',
  avatar text default '',
  last_read_at timestamptz default now(),
  unread_count int default 0,
  joined_at timestamptz default now(),
  unique (conversation_id, user_id)
);
alter table public.conversation_members enable row level security;

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) on delete cascade,
  sender_id uuid references auth.users(id) on delete set null,
  sender_name text default '',
  sender_avatar text default '',
  text text,
  created_at timestamptz default now()
);
alter table public.messages enable row level security;
create index if not exists messages_conv_idx on public.messages (conversation_id, created_at);

-- membership helper (security definer avoids RLS recursion in policies)
create or replace function public.is_conversation_member(p_conv uuid)
returns boolean language sql security definer set search_path = public stable as $$
  select exists(select 1 from public.conversation_members where conversation_id = p_conv and user_id = auth.uid());
$$;

drop policy if exists conv_read on public.conversations;
drop policy if exists conv_insert on public.conversations;
create policy conv_read on public.conversations for select using (public.is_conversation_member(id));
create policy conv_insert on public.conversations for insert with check (auth.uid() = created_by);

drop policy if exists cm_read on public.conversation_members;
drop policy if exists cm_insert on public.conversation_members;
drop policy if exists cm_update on public.conversation_members;
create policy cm_read on public.conversation_members for select using (user_id = auth.uid() or public.is_conversation_member(conversation_id));
create policy cm_insert on public.conversation_members for insert with check (auth.uid() = user_id or public.is_conversation_member(conversation_id));
create policy cm_update on public.conversation_members for update using (user_id = auth.uid());

drop policy if exists msg_read on public.messages;
drop policy if exists msg_insert on public.messages;
create policy msg_read on public.messages for select using (public.is_conversation_member(conversation_id));
create policy msg_insert on public.messages for insert with check (sender_id = auth.uid() and public.is_conversation_member(conversation_id));

-- keep unread counts in sync (security definer so it can update other members)
create or replace function public.handle_new_message()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.conversation_members set unread_count = unread_count + 1
    where conversation_id = NEW.conversation_id and user_id <> NEW.sender_id;
  update public.conversation_members set unread_count = 0, last_read_at = now()
    where conversation_id = NEW.conversation_id and user_id = NEW.sender_id;
  return NEW;
end; $$;

drop trigger if exists on_new_message on public.messages;
create trigger on_new_message after insert on public.messages
  for each row execute function public.handle_new_message();

-- idempotent 1:1 conversation
create or replace function public.get_or_create_dm(p_target_id uuid)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_conv uuid;
  v_my_username text; v_my_name text; v_my_avatar text;
  v_tg_username text; v_tg_name text; v_tg_avatar text;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  if v_uid = p_target_id then raise exception 'cannot message yourself'; end if;

  select c.id into v_conv
    from public.conversations c
    join public.conversation_members m1 on m1.conversation_id = c.id and m1.user_id = v_uid
    join public.conversation_members m2 on m2.conversation_id = c.id and m2.user_id = p_target_id
    where c.is_group = false
    limit 1;
  if v_conv is not null then return v_conv; end if;

  select coalesce(username,'player'), coalesce(full_name, username, 'Player'), coalesce(profile_photo,'')
    into v_my_username, v_my_name, v_my_avatar from public.players where auth_id = v_uid;
  select coalesce(username,'player'), coalesce(full_name, username, 'Player'), coalesce(profile_photo,'')
    into v_tg_username, v_tg_name, v_tg_avatar from public.players where auth_id = p_target_id;

  v_my_username := coalesce(v_my_username, 'player');
  v_my_name := coalesce(v_my_name, 'Player');
  v_tg_username := coalesce(v_tg_username, 'player');
  v_tg_name := coalesce(v_tg_name, 'Player');

  insert into public.conversations (is_group, created_by) values (false, v_uid) returning id into v_conv;
  insert into public.conversation_members (conversation_id, user_id, username, display_name, avatar)
    values (v_conv, v_uid, v_my_username, v_my_name, coalesce(v_my_avatar,''));
  insert into public.conversation_members (conversation_id, user_id, username, display_name, avatar)
    values (v_conv, p_target_id, v_tg_username, v_tg_name, coalesce(v_tg_avatar,''));
  return v_conv;
end; $$;

create or replace function public.mark_conversation_read(p_conv uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.conversation_members set unread_count = 0, last_read_at = now()
    where conversation_id = p_conv and user_id = auth.uid();
end; $$;

do $$ begin alter publication supabase_realtime add table public.messages; exception when others then null; end $$;
do $$ begin alter publication supabase_realtime add table public.conversation_members; exception when others then null; end $$;
do $$ begin alter publication supabase_realtime add table public.conversations; exception when others then null; end $$;