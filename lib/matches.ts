import { createClient } from "@/lib/supabase";

type Row = Record<string, unknown>;
const str = (v: unknown, d = ""): string => (v == null ? d : String(v));
const num = (v: unknown, d = 0): number => (typeof v === "number" ? v : Number(v) || d);

export interface Match {
  id: string;
  sport: string;
  teamAName: string;
  teamBName: string;
  scoreA: number;
  scoreB: number;
  venue: string;
  playedAt: string;
  status: string;
}

export interface PlayerStats {
  matchesPlayed: number;
  goals: number;
  assists: number;
  runs: number;
  wickets: number;
  saves: number;
  points: number;
  mvps: number;
}

export interface StatInput {
  goals?: number;
  assists?: number;
  runs?: number;
  wickets?: number;
  saves?: number;
  points?: number;
  mvp?: boolean;
}

export async function recordMatch(input: {
  sport: string;
  teamAName: string;
  teamBName: string;
  scoreA: number;
  scoreB: number;
  venue: string;
}): Promise<string | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from("matches")
    .insert({
      sport: input.sport,
      team_a_name: input.teamAName,
      team_b_name: input.teamBName,
      score_a: input.scoreA,
      score_b: input.scoreB,
      venue: input.venue,
      created_by: user.id,
    })
    .select("id")
    .single();
  if (error) return null;
  return str((data as { id: string }).id);
}

export async function fetchMatches(limit = 20): Promise<Match[]> {
  const supabase = createClient();
  const { data } = await supabase.from("matches").select("*").order("played_at", { ascending: false }).limit(limit);
  return ((data ?? []) as Row[]).map((m) => ({
    id: str(m.id),
    sport: str(m.sport),
    teamAName: str(m.team_a_name, "Team A"),
    teamBName: str(m.team_b_name, "Team B"),
    scoreA: num(m.score_a),
    scoreB: num(m.score_b),
    venue: str(m.venue),
    playedAt: str(m.played_at),
    status: str(m.status, "completed"),
  }));
}

export async function logPlayerStat(matchId: string, userId: string, stats: StatInput): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase.from("player_match_stats").upsert(
    {
      match_id: matchId,
      user_id: userId,
      goals: stats.goals ?? 0,
      assists: stats.assists ?? 0,
      runs: stats.runs ?? 0,
      wickets: stats.wickets ?? 0,
      saves: stats.saves ?? 0,
      points: stats.points ?? 0,
      mvp: stats.mvp ?? false,
    },
    { onConflict: "match_id,user_id" }
  );
  return !error;
}

export async function fetchPlayerStats(userId: string): Promise<PlayerStats> {
  const supabase = createClient();
  const { data } = await supabase.from("player_match_stats").select("*").eq("user_id", userId);
  const list = (data ?? []) as Row[];
  const matchIds = new Set<string>();
  let goals = 0, assists = 0, runs = 0, wickets = 0, saves = 0, points = 0, mvps = 0;
  list.forEach((r) => {
    matchIds.add(str(r.match_id));
    goals += num(r.goals);
    assists += num(r.assists);
    runs += num(r.runs);
    wickets += num(r.wickets);
    saves += num(r.saves);
    points += num(r.points);
    if (r.mvp === true) mvps += 1;
  });
  return { matchesPlayed: matchIds.size, goals, assists, runs, wickets, saves, points, mvps };
}