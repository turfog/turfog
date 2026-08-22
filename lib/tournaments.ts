import { createClient } from "@/lib/supabase";

export interface Tournament {
  id: string;
  name: string;
  slug: string;
  sport: string;
  city: string | null;
  startDate: string | null;
  endDate: string | null;
  status: "upcoming" | "live" | "completed";
  teamCount: number;
}

export async function fetchTournaments(): Promise<Tournament[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tournaments")
    .select(`
      id,
      name,
      slug,
      sport,
      city,
      start_date,
      end_date,
      status,
      team_count:tournament_teams(count)
    `)
    .order("start_date", { ascending: false });

  if (error || !data) return [];

  return (data as any[]).map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    sport: t.sport,
    city: t.city,
    startDate: t.start_date,
    endDate: t.end_date,
    status: t.status,
    teamCount: t.team_count?.[0]?.count ?? 0,
  }));
}

export async function fetchUserTeams(): Promise<Array<{ id: string; name: string; slug: string }>> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from("team_members")
    .select("teams(id, name, slug)")
    .in("role", ["owner", "captain"])
    .eq("user_id", user.id);
  return (data ?? []).map((m: any) => m.teams).filter(Boolean) as Array<{ id: string; name: string; slug: string }>;
}

export async function registerTeamForTournament(tournamentId: string, teamId: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase.from("tournament_teams").insert({
    tournament_id: tournamentId,
    team_id: teamId,
  });
  return !error;
}

export interface BracketRound {
  id: string;
  name: string;
  roundNumber: number;
  matches: BracketMatch[];
}

export interface BracketMatch {
  id: string;
  position: number;
  teamA: { id: string; name: string; slug: string; logo: string | null } | null;
  teamB: { id: string; name: string; slug: string; logo: string | null } | null;
  winnerId: string | null;
  scoreA: number | null;
  scoreB: number | null;
  advancesTo: string | null;
}

export async function fetchTournamentBrackets(tournamentId: string): Promise<BracketRound[]> {
  const supabase = createClient();
  const { data: rounds } = await supabase
    .from("tournament_rounds")
    .select("id, name, round_number")
    .eq("tournament_id", tournamentId)
    .order("round_number", { ascending: true });

  if (!rounds || rounds.length === 0) return [];

  const { data: matches } = await supabase
    .from("tournament_matches")
    .select(`
      id,
      round_id,
      position,
      team_a_id,
      team_b_id,
      winner_id,
      advances_to,
      match_id,
      matches(score_a, score_b)
    `)
    .in("round_id", rounds.map((r) => r.id));

  const matchMap = new Map<string, any>();
  (matches ?? []).forEach((m) => matchMap.set(m.id, m));

  // Fetch all team data in one query
  const teamIds = new Set<string>();
  (matches ?? []).forEach((m) => {
    if (m.team_a_id) teamIds.add(m.team_a_id);
    if (m.team_b_id) teamIds.add(m.team_b_id);
  });

  const { data: teams } = await supabase
    .from("teams")
    .select("id, name, slug, logo")
    .in("id", Array.from(teamIds));

  const teamMap = new Map<string, any>();
  (teams ?? []).forEach((t) => teamMap.set(t.id, t));

  return rounds.map((round) => ({
    id: round.id,
    name: round.name,
    roundNumber: round.round_number,
    matches: (matches ?? [])
      .filter((m) => m.round_id === round.id)
      .sort((a, b) => a.position - b.position)
      .map((m) => ({
        id: m.id,
        position: m.position,
        teamA: m.team_a_id ? teamMap.get(m.team_a_id) || null : null,
        teamB: m.team_b_id ? teamMap.get(m.team_b_id) || null : null,
        winnerId: m.winner_id,
        scoreA: (() => { const mm = m.matches as any; return Array.isArray(mm) ? mm[0]?.score_a ?? null : mm?.score_a ?? null; })(),
        scoreB: (() => { const mm = m.matches as any; return Array.isArray(mm) ? mm[0]?.score_b ?? null : mm?.score_b ?? null; })(),
        advancesTo: m.advances_to,
      })),
  }));
}