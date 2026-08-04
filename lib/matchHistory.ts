import { createClient } from "@/lib/supabase";

export interface MatchPlayerStat {
  matchId: string;
  userId: string;
  name: string;
  username: string;
  goals: number;
  assists: number;
  runs: number;
  wickets: number;
  saves: number;
  points: number;
  mvp: boolean;
}

export async function fetchMatchStats(matchIds: string[]): Promise<MatchPlayerStat[]> {
  if (matchIds.length === 0) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from("player_match_stats")
    .select("*")
    .in("match_id", matchIds);
  const rows = (data ?? []) as Array<Record<string, unknown>>;
  if (rows.length === 0) return [];

  const userIds = Array.from(new Set(rows.map((r) => String(r.user_id))));
  const { data: players } = await supabase
    .from("players")
    .select("auth_id, full_name, username")
    .in("auth_id", userIds);
  const playerMap = new Map<string, { name: string; username: string }>();
  ((players ?? []) as Array<Record<string, unknown>>).forEach((p) => {
    playerMap.set(String(p.auth_id), {
      name: String(p.full_name ?? "Player"),
      username: String(p.username ?? "player"),
    });
  });

  return rows.map((r) => {
    const userId = String(r.user_id);
    const pl = playerMap.get(userId);
    return {
      matchId: String(r.match_id),
      userId,
      name: pl?.name ?? "Player",
      username: pl?.username ?? "player",
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