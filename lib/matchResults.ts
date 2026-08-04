import { createClient } from "@/lib/supabase";

export async function recordMatchPerformance(input: {
  sport: string;
  teamAName: string;
  teamBName: string;
  scoreA: number;
  scoreB: number;
  teamSide: string;
  goals: number;
  assists: number;
  location: string;
}): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: match, error: matchError } = await supabase
    .from("match_results")
    .insert({
      sport: input.sport,
      team_a_name: input.teamAName,
      team_b_name: input.teamBName,
      score_a: input.scoreA,
      score_b: input.scoreB,
      location: input.location,
      recorded_by: user.id,
    })
    .select("id")
    .single();

  if (matchError || !match) return false;

  const { data: profile } = await supabase
    .from("players")
    .select("full_name")
    .eq("auth_id", user.id)
    .maybeSingle();
  const playerName = ((profile ?? {}) as Record<string, unknown>).full_name;

  const { error: statsError } = await supabase.from("player_match_stats").insert({
    match_id: ((match as Record<string, unknown>).id as string),
    player_id: user.id,
    player_name: typeof playerName === "string" ? playerName : "Player",
    team_side: input.teamSide,
    goals: input.goals,
    assists: input.assists,
  });

  return !statsError;
}