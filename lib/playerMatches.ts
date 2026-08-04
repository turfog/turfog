import { createClient } from "@/lib/supabase";

export interface PlayerMatchEntry {
  matchId: string;
  sport: string;
  teamAName: string;
  teamBName: string;
  scoreA: number;
  scoreB: number;
  venue: string;
  playedAt: string;
  goals: number;
  assists: number;
  runs: number;
  wickets: number;
  saves: number;
  points: number;
  mvp: boolean;
}

export async function fetchPlayerMatches(userId: string, limit = 5): Promise<PlayerMatchEntry[]> {
  if (!userId) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from("player_match_stats")
    .select("*, matches(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  const rows = (data ?? []) as Array<Record<string, unknown>>;
  return rows.map((r) => {
    const m = (r.matches ?? {}) as Record<string, unknown>;
    return {
      matchId: String(r.match_id),
      sport: String(m.sport ?? ""),
      teamAName: String(m.team_a_name ?? "Team A"),
      teamBName: String(m.team_b_name ?? "Team B"),
      scoreA: Number(m.score_a ?? 0),
      scoreB: Number(m.score_b ?? 0),
      venue: String(m.venue ?? ""),
      playedAt: String(m.played_at ?? ""),
      goals: Number(r.goals ?? 0),
      assists: Number(r.assists ?? 0),
      runs: Number(r.runs ?? 0),
      wickets: Number(r.wickets ?? 0),
      saves: Number(r.saves ?? 0),
      points: Number(r.points ?? 0),
      mvp: r.mvp === true,
    };
  });
}