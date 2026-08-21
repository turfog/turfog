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
  createdBy: string;
  verificationStatus: string;
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
  teamAId?: string | null;
  teamBId?: string | null;
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
      team_a_id: input.teamAId ?? null,
      team_b_id: input.teamBId ?? null,
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
    createdBy: str(m.created_by),
    verificationStatus: str(m.verification_status, "pending"),
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

export async function verifyMatch(matchId: string): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data: match } = await supabase
    .from("matches")
    .select("created_by, team_a_name, team_b_name")
    .eq("id", matchId)
    .maybeSingle();
  const { error } = await supabase
    .from("matches")
    .update({ verification_status: "verified", verified_by: user.id, verified_at: new Date().toISOString() })
    .eq("id", matchId);
  if (error) return false;
  const rec = (match as { created_by: string | null } | null)?.created_by;
  if (rec && rec !== user.id) {
    const { data: me } = await supabase.from("players").select("full_name, username, profile_photo").eq("auth_id", user.id).maybeSingle();
    const p = (me ?? {}) as Record<string, unknown>;
    await supabase.from("notifications").insert({
      recipient_id: rec,
      actor_id: user.id,
      actor_name: (p.full_name as string) ?? "Someone",
      actor_username: (p.username as string) ?? "",
      actor_avatar: (p.profile_photo as string) ?? "",
      type: "match-verified",
      text: "confirmed your match result",
      href: "/matches",
      target_id: matchId,
    });
  }
  return true;
}
