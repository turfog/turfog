import { createClient } from "@/lib/supabase";

export interface TeamVerifiedStats {
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  winRate: number;
}

const n = (v: unknown): number => (typeof v === "number" ? v : Number(v) || 0);

export async function fetchTeamVerifiedStats(teamId: string): Promise<TeamVerifiedStats> {
  const supabase = createClient();
  const { data } = await supabase.rpc("team_verified_stats", { p_team_id: teamId });
  const row = (Array.isArray(data) ? data[0] : data) as Record<string, unknown> | undefined;
  const played = n(row?.played);
  const wins = n(row?.wins);
  const draws = n(row?.draws);
  const losses = n(row?.losses);
  const goalsFor = n(row?.goals_for);
  const goalsAgainst = n(row?.goals_against);
  return {
    played,
    wins,
    draws,
    losses,
    goalsFor,
    goalsAgainst,
    winRate: played > 0 ? Math.round((wins / played) * 100) : 0,
  };
}