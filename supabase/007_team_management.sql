-- ============================================================
-- TURFOG - Team management (E1.5): roles, jerseys, removal, invites
-- Run in Supabase SQL Editor after 006.
-- ============================================================

create or replace function public.team_role(p_team_id uuid)
returns text language sql security definer set search_path = public stable as $$
  select role from public.team_members
  where team_id = p_team_id and user_id = auth.uid() and status = 'active'
  limit 1;
$$;

create or replace function public.team_set_role(p_member_id uuid, p_role text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_team uuid;
  v_my_role text;
begin
  select team_id into v_team from public.team_members where id = p_member_id;
  if v_team is null then raise exception 'member not found'; end if;
  v_my_role := public.team_role(v_team);
  if v_my_role is null or v_my_role not in ('owner','captain') then raise exception 'not authorized'; end if;
  if p_role = 'owner' and v_my_role <> 'owner' then raise exception 'only the owner can transfer ownership'; end if;
  if p_role = 'owner' then
    update public.team_members set role = 'captain' where team_id = v_team and role = 'owner';
  end if;
  update public.team_members set role = p_role where id = p_member_id;
  return jsonb_build_object('ok', true);
end; $$;

create or replace function public.team_set_jersey(p_member_id uuid, p_jersey int, p_position text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_team uuid;
  v_my_role text;
begin
  select team_id into v_team from public.team_members where id = p_member_id;
  if v_team is null then raise exception 'member not found'; end if;
  v_my_role := public.team_role(v_team);
  if v_my_role is null or v_my_role not in ('owner','captain') then raise exception 'not authorized'; end if;
  update public.team_members set jersey_number = p_jersey, position = coalesce(p_position, '') where id = p_member_id;
  return jsonb_build_object('ok', true);
end; $$;

create or replace function public.team_remove_member(p_member_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_team uuid;
  v_my_role text;
  v_target_role text;
begin
  select team_id, role into v_team, v_target_role from public.team_members where id = p_member_id;
  if v_team is null then return jsonb_build_object('ok', true); end if;
  v_my_role := public.team_role(v_team);
  if v_my_role is null or v_my_role not in ('owner','captain') then raise exception 'not authorized'; end if;
  if v_target_role = 'owner' then raise exception 'cannot remove the owner'; end if;
  delete from public.team_members where id = p_member_id;
  update public.teams set member_count = (select count(*) from public.team_members where team_id = v_team and status = 'active') where id = v_team;
  return jsonb_build_object('ok', true);
end; $$;

create or replace function public.team_invite(p_team_id uuid, p_target_username text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_my_role text;
  v_target uuid;
  v_name text;
  v_avatar text;
  v_exists boolean;
begin
  v_my_role := public.team_role(p_team_id);
  if v_my_role is null or v_my_role not in ('owner','captain') then raise exception 'not authorized'; end if;
  select auth_id, coalesce(full_name, username, 'Player'), coalesce(profile_photo, '')
    into v_target, v_name, v_avatar from public.players where username = lower(p_target_username);
  if v_target is null then raise exception 'player not found'; end if;
  select exists(select 1 from public.team_members where team_id = p_team_id and user_id = v_target) into v_exists;
  if v_exists then raise exception 'already a member or invited'; end if;
  insert into public.team_members (team_id, user_id, username, display_name, avatar, role, status)
    values (p_team_id, v_target, lower(p_target_username), v_name, v_avatar, 'member', 'invited');
  return jsonb_build_object('ok', true);
end; $$;

create or replace function public.team_respond_invite(p_team_id uuid, p_accept boolean)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_count int;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  if p_accept then
    update public.team_members set status = 'active' where team_id = p_team_id and user_id = v_uid and status = 'invited';
    select count(*) into v_count from public.team_members where team_id = p_team_id and status = 'active';
    update public.teams set member_count = v_count where id = p_team_id;
  else
    delete from public.team_members where team_id = p_team_id and user_id = v_uid and status = 'invited';
  end if;
  return jsonb_build_object('ok', true);
end; $$;