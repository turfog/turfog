import { createClient } from "@/lib/supabase";
import { buildSeedSlots, nextPowerOfTwo, totalRounds } from "@/lib/bracket";

type Row = Record<string, unknown>;
const str = (v: unknown, d = ""): string => (v == null ? d : String(v));

// Generate a full single-elimination bracket for a tournament.
// Teams are seeded by registration order; byes go to the top seeds.
export async function generateKnockout(tournamentId: string): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: regs } = await supabase
    .from("tournament_teams")
    .select("team_id")
    .eq("tournament_id", tournamentId)
    .order("registered_at", { ascending: true });
  const teamIds = ((regs ?? []) as Row[]).map((r) => str(r.team_id));
  const n = teamIds.length;
  if (n < 2) return false;

  const size = nextPowerOfTwo(n);
  const rounds = totalRounds(size);
  const slots = buildSeedSlots(n);
  const seedToTeam = new Map<number, string>();
  teamIds.forEach((tid, i) => seedToTeam.set(i + 1, tid));

  // Wipe any existing fixtures so regeneration is idempotent.
  await supabase.from("tournament_fixtures").delete().eq("tournament_id", tournamentId);

  const fixtures: Array<Record<string, unknown>> = [];
  // Round 1 pairings from seed slots.
  let position = 0;
  for (let i = 0; i < slots.length; i += 2) {
    const seedA = slots[i];
    const seedB = slots[i + 1];
    const teamA = seedA ? seedToTeam.get(seedA) ?? null : null;
    const teamB = seedB ? seedToTeam.get(seedB) ?? null : null;
    fixtures.push({
      tournament_id: tournamentId,
      round: 1,
      position,
      team_a_id: teamA,
      team_b_id: teamB,
      status: "upcoming",
      created_by: user.id,
    });
    position += 1;
  }
  // Later rounds start empty; winners are advanced in.
  let matchCount = size / 2;
  for (let r = 2; r <= rounds; r++) {
    matchCount = Math.floor(matchCount / 2);
    for (let p = 0; p < matchCount; p++) {
      fixtures.push({
        tournament_id: tournamentId,
        round: r,
        position: p,
        team_a_id: null,
        team_b_id: null,
        status: "upcoming",
        created_by: user.id,
      });
    }
  }

  const { error } = await supabase.from("tournament_fixtures").insert(fixtures);
  if (error) return false;

  // Resolve round-1 byes: a team with no opponent advances automatically.
  const { data: r1 } = await supabase
    .from("tournament_fixtures")
    .select("id, position, team_a_id, team_b_id")
    .eq("tournament_id", tournamentId)
    .eq("round", 1)
    .order("position", { ascending: true });
  for (const fx of (r1 ?? []) as Row[]) {
    const a = fx.team_a_id ? str(fx.team_a_id) : null;
    const b = fx.team_b_id ? str(fx.team_b_id) : null;
    let winner: string | null = null;
    if (a && !b) winner = a;
    else if (!a && b) winner = b;
    if (winner) {
      await supabase
        .from("tournament_fixtures")
        .update({ status: "completed", played_at: new Date().toISOString() })
        .eq("id", str(fx.id));
      await supabase.rpc("advance_tournament_winner", {
        p_fixture_id: str(fx.id),
        p_winner_team_id: winner,
      });
    }
  }

  await supabase.from("tournaments").update({ status: "ongoing" }).eq("id", tournamentId);
  return true;
}

// Record a knockout result and advance the winner to the next round.
export async function recordKnockoutResult(
  fixtureId: string,
  scoreA: number,
  scoreB: number
): Promise<boolean> {
  const supabase = createClient();
  const { data: fx } = await supabase
    .from("tournament_fixtures")
    .select("id, team_a_id, team_b_id")
    .eq("id", fixtureId)
    .single();
  if (!fx) return false;

  const { error } = await supabase
    .from("tournament_fixtures")
    .update({ score_a: scoreA, score_b: scoreB, status: "completed", played_at: new Date().toISOString() })
    .eq("id", fixtureId);
  if (error) return false;

  const winner = scoreA >= scoreB ? fx.team_a_id : fx.team_b_id;
  if (winner) {
    await supabase.rpc("advance_tournament_winner", {
      p_fixture_id: fixtureId,
      p_winner_team_id: winner,
    });
  }
  return true;
}