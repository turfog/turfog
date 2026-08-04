-- ============================================================
-- TURFOG - Tournament bracket advancement (E7b)
-- Adds a stable per-round position so knockout advancement is deterministic.
-- Run in Supabase SQL Editor after 013.
-- ============================================================

alter table public.tournament_fixtures
  add column if not exists position int default 0;

-- Index to make "find the fixture at round R, position P" fast.
create index if not exists tournament_fixtures_round_position_idx
  on public.tournament_fixtures (tournament_id, round, position);

-- A SECURITY DEFINER function so any authenticated member of the tournament
-- can advance a winner, without opening up broad UPDATE policies.
create or replace function public.advance_tournament_winner(
  p_fixture_id uuid,
  p_winner_team_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tournament uuid;
  v_round int;
  v_position int;
  v_next_position int;
  v_slot int;
  v_next_fixture uuid;
begin
  select tournament_id, round, position
    into v_tournament, v_round, v_position
    from public.tournament_fixtures
   where id = p_fixture_id;

  if v_tournament is null then
    return;
  end if;

  v_next_position := floor(v_position / 2);
  v_slot := v_position % 2;

  select id into v_next_fixture
    from public.tournament_fixtures
   where tournament_id = v_tournament
     and round = v_round + 1
     and position = v_next_position
   limit 1;

  if v_next_fixture is null then
    return;
  end if;

  if v_slot = 0 then
    update public.tournament_fixtures set team_a_id = p_winner_team_id where id = v_next_fixture;
  else
    update public.tournament_fixtures set team_b_id = p_winner_team_id where id = v_next_fixture;
  end if;
end;
$$;

grant execute on function public.advance_tournament_winner(uuid, uuid) to authenticated;