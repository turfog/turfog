-- ============================================================
-- TURFOG - Recruitment responses (E2b): accept / decline / interested / available later
-- Run in Supabase SQL Editor after 007.
-- ============================================================

create or replace function public.team_respond_invite_status(p_team_id uuid, p_status text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_count int;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  if p_status = 'accepted' then
    update public.team_members set status = 'active' where team_id = p_team_id and user_id = v_uid and status = 'invited';
    select count(*) into v_count from public.team_members where team_id = p_team_id and status = 'active';
    update public.teams set member_count = v_count where id = p_team_id;
  elsif p_status = 'declined' then
    delete from public.team_members where team_id = p_team_id and user_id = v_uid and status = 'invited';
  elsif p_status in ('interested', 'available_later') then
    update public.team_members set status = p_status where team_id = p_team_id and user_id = v_uid and status = 'invited';
  else
    raise exception 'invalid status';
  end if;
  return jsonb_build_object('ok', true);
end; $$;