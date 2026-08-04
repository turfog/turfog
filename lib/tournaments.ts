import { createClient } from "@/lib/supabase";

type Row = Record<string, unknown>;
const str = (v: unknown, d = ""): string => (v == null ? d : String(v));
const num = (v: unknown, d = 0): number => (typeof v === "number" ? v : Number(v) || d);

export interface Tournament {
  id: string;
  name: string;
  slug: string;
  sport: string;
  format: string;
  status: string;
  city: string;
  description: string;
  startsAt: string;
  createdBy: string | null;
}

export interface TournamentTeam {
  id: string;
  tournamentId: string;
  teamId: string;
  teamName: string;
  teamSlug: string;
  status: string;
}

export interface Fixture {
  id: string;
  tournamentId: string;
  round: number;
  teamAId: string;
  teamAName: string;
  teamBId: string;
  teamBName: string;
  scoreA: number;
  scoreB: number;
  status: string;
}

export interface TableRow {
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  points: number;
}

export async function fetchTournaments(): Promise<Tournament[]> {
  const supabase = createClient();
  const { data } = await supabase.from("tournaments").select("*").order("created_at", { ascending: false }).limit(40);
  return ((data ?? []) as Row[]).map(mapTournament);
}

export async function fetchTournamentBySlug(slug: string): Promise<Tournament | null> {
  const supabase = createClient();
  const { data } = await supabase.from("tournaments").select("*").eq("slug", slug).maybeSingle();
  return data ? mapTournament(data as Row) : null;
}

function mapTournament(t: Row): Tournament {
  return {
    id: str(t.id),
    name: str(t.name, "Tournament"),
    slug: str(t.slug),
    sport: str(t.sport),
    format: str(t.format, "league"),
    status: str(t.status, "registration"),
    city: str(t.city),
    description: str(t.description),
    startsAt: str(t.starts_at),
    createdBy: t.created_by ? str(t.created_by) : null,
  };
}

export async function createTournament(input: { name: string; sport: string; city: string; description: string; startsAt: string; format?: string }): Promise<string | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const slug = `${input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${Date.now().toString(36)}`;
  const { data, error } = await supabase
    .from("tournaments")
    .insert({
      name: input.name,
      slug,
      sport: input.sport,
      format: input.format === "knockout" ? "knockout" : "league",
      status: "registration",
      city: input.city,
      description: input.description,
      starts_at: input.startsAt || null,
      created_by: user.id,
    })
    .select("id")
    .single();
  if (error) return null;
  return str((data as { id: string }).id);
}

export async function fetchMyTeams(): Promise<Array<{ id: string; name: string; slug: string }>> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data: mem } = await supabase.from("team_members").select("team_id").eq("user_id", user.id).eq("status", "active");
  const teamIds = ((mem ?? []) as Row[]).map((m) => str(m.team_id));
  if (teamIds.length === 0) return [];
  const { data: teams } = await supabase.from("teams").select("id, name, slug").in("id", teamIds);
  return ((teams ?? []) as Row[]).map((t) => ({ id: str(t.id), name: str(t.name, "Team"), slug: str(t.slug) }));
}

export async function registerTeamForTournament(tournamentId: string, teamId: string): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { error } = await supabase.from("tournament_teams").insert({
    tournament_id: tournamentId,
    team_id: teamId,
    registered_by: user.id,
    status: "registered",
  });
  return !error;
}

export async function fetchTournamentTeams(tournamentId: string): Promise<TournamentTeam[]> {
  const supabase = createClient();
  const { data } = await supabase.from("tournament_teams").select("*").eq("tournament_id", tournamentId);
  const list = (data ?? []) as Row[];
  const teamIds = list.map((r) => str(r.team_id));
  let teamMap = new Map<string, { name: string; slug: string }>();
  if (teamIds.length > 0) {
    const { data: teams } = await supabase.from("teams").select("id, name, slug").in("id", teamIds);
    teamMap = new Map(((teams ?? []) as Row[]).map((t) => [str(t.id), { name: str(t.name, "Team"), slug: str(t.slug) }]));
  }
  return list.map((r) => {
    const tm = teamMap.get(str(r.team_id));
    return {
      id: str(r.id),
      tournamentId: str(r.tournament_id),
      teamId: str(r.team_id),
      teamName: tm?.name ?? "Team",
      teamSlug: tm?.slug ?? "",
      status: str(r.status, "registered"),
    };
  });
}

export async function generateRoundRobin(tournamentId: string): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data: regs } = await supabase.from("tournament_teams").select("team_id").eq("tournament_id", tournamentId);
  const teamIds = ((regs ?? []) as Row[]).map((r) => str(r.team_id));
  if (teamIds.length < 2) return false;
  const fixtures: Array<Record<string, unknown>> = [];
  for (let i = 0; i < teamIds.length; i++) {
    for (let j = i + 1; j < teamIds.length; j++) {
      fixtures.push({
        tournament_id: tournamentId,
        round: 1,
        team_a_id: teamIds[i],
        team_b_id: teamIds[j],
        status: "upcoming",
        created_by: user.id,
      });
    }
  }
  const { error } = await supabase.from("tournament_fixtures").insert(fixtures);
  if (error) return false;
  await supabase.from("tournaments").update({ status: "ongoing" }).eq("id", tournamentId);
  return true;
}

export async function fetchFixtures(tournamentId: string): Promise<Fixture[]> {
  const supabase = createClient();
  const { data } = await supabase.from("tournament_fixtures").select("*").eq("tournament_id", tournamentId).order("round", { ascending: true }).order("created_at", { ascending: true });
  const list = (data ?? []) as Row[];
  const teamIds = Array.from(new Set(list.flatMap((f) => [str(f.team_a_id), str(f.team_b_id)]).filter(Boolean)));
  let teamMap = new Map<string, string>();
  if (teamIds.length > 0) {
    const { data: teams } = await supabase.from("teams").select("id, name").in("id", teamIds);
    teamMap = new Map(((teams ?? []) as Row[]).map((t) => [str(t.id), str(t.name, "Team")]));
  }
  return list.map((f) => ({
    id: str(f.id),
    tournamentId: str(f.tournament_id),
    round: num(f.round, 1),
    teamAId: str(f.team_a_id),
    teamAName: teamMap.get(str(f.team_a_id)) ?? "TBD",
    teamBId: str(f.team_b_id),
    teamBName: teamMap.get(str(f.team_b_id)) ?? "TBD",
    scoreA: num(f.score_a),
    scoreB: num(f.score_b),
    status: str(f.status, "upcoming"),
  }));
}

export async function recordFixtureResult(fixtureId: string, scoreA: number, scoreB: number): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from("tournament_fixtures")
    .update({ score_a: scoreA, score_b: scoreB, status: "completed", played_at: new Date().toISOString() })
    .eq("id", fixtureId);
  return !error;
}

export function computeLeagueTable(fixtures: Fixture[]): TableRow[] {
  const map = new Map<string, TableRow>();
  const ensure = (id: string): TableRow => {
    if (!map.has(id)) map.set(id, { teamId: id, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 });
    return map.get(id) as TableRow;
  };
  fixtures.filter((f) => f.status === "completed").forEach((f) => {
    const a = ensure(f.teamAId);
    const b = ensure(f.teamBId);
    a.played += 1; b.played += 1;
    a.gf += f.scoreA; a.ga += f.scoreB;
    b.gf += f.scoreB; b.ga += f.scoreA;
    if (f.scoreA > f.scoreB) { a.won += 1; a.points += 3; b.lost += 1; }
    else if (f.scoreA < f.scoreB) { b.won += 1; b.points += 3; a.lost += 1; }
    else { a.drawn += 1; b.drawn += 1; a.points += 1; b.points += 1; }
  });
  const rows = Array.from(map.values());
  rows.forEach((r) => { r.gd = r.gf - r.ga; });
  rows.sort((x, y) => y.points - x.points || y.gd - x.gd || y.gf - x.gf);
  return rows;
}