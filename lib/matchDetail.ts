import { createClient } from "@/lib/supabase";

export interface MatchDetail {
  id: string;
  sport: string;
  teamAName: string;
  teamBName: string;
  scoreA: number;
  scoreB: number;
  venue: string;
  playedAt: string;
  createdAt: string;
}

export interface MatchDetailPlayerStat {
  userId: string;
  name: string;
  username: string;
  avatar: string;
  goals: number;
  assists: number;
  runs: number;
  wickets: number;
  saves: number;
  points: number;
  mvp: boolean;
}

export async function fetchMatchDetail(matchId: string): Promise<MatchDetail | null> {
  if (!matchId) return null;
  const supabase = createClient();
  const { data } = await supabase.from("matches").select("*").eq("id", matchId).maybeSingle();
  if (!data) return null;
  const m = data as Record<string, unknown>;
  return {
    id: String(m.id),
    sport: String(m.sport ?? ""),
    teamAName: String(m.team_a_name ?? "Team A"),
    teamBName: String(m.team_b_name ?? "Team B"),
    scoreA: Number(m.score_a ?? 0),
    scoreB: Number(m.score_b ?? 0),
    venue: String(m.venue ?? ""),
    playedAt: String(m.played_at ?? ""),
    createdAt: String(m.created_at ?? ""),
  };
}

export async function fetchMatchDetailStats(matchId: string): Promise<MatchDetailPlayerStat[]> {
  if (!matchId) return [];
  const supabase = createClient();
  const { data } = await supabase.from("player_match_stats").select("*").eq("match_id", matchId);
  const rows = (data ?? []) as Array<Record<string, unknown>>;
  if (rows.length === 0) return [];

  const userIds = Array.from(new Set(rows.map((r) => String(r.user_id))));
  const { data: players } = await supabase
    .from("players")
    .select("auth_id, full_name, username, profile_photo")
    .in("auth_id", userIds);
  const playerMap = new Map<string, { name: string; username: string; avatar: string }>();
  ((players ?? []) as Array<Record<string, unknown>>).forEach((p) => {
    playerMap.set(String(p.auth_id), {
      name: String(p.full_name ?? "Player"),
      username: String(p.username ?? "player"),
      avatar: String(p.profile_photo ?? ""),
    });
  });

  return rows.map((r) => {
    const userId = String(r.user_id);
    const pl = playerMap.get(userId);
    return {
      userId,
      name: pl?.name ?? "Player",
      username: pl?.username ?? "player",
      avatar: pl?.avatar ?? "",
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