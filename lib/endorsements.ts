import { createClient } from "@/lib/supabase";

type Row = Record<string, unknown>;
const str = (v: unknown, d = ""): string => (v == null ? d : String(v));

export const ENDORSEMENT_CATEGORIES: Array<{ id: string; label: string }> = [
  { id: "teamwork", label: "Teamwork" },
  { id: "leadership", label: "Leadership" },
  { id: "sportsmanship", label: "Sportsmanship" },
  { id: "skill", label: "Skill" },
  { id: "communication", label: "Communication" },
  { id: "punctuality", label: "Punctuality" },
  { id: "reliability", label: "Reliability" },
  { id: "fitness", label: "Fitness" },
  { id: "tactical", label: "Tactical awareness" },
  { id: "discipline", label: "Discipline" },
  { id: "attitude", label: "Positive attitude" },
  { id: "fair_play", label: "Fair play" },
];

export interface EndorsementSummary {
  total: number;
  byCategory: Record<string, number>;
  myEndorsed: string[];
  eligible: boolean;
  reason: "teammate" | "co-player" | null;
}

export async function checkEndorseEligibility(
  myId: string,
  targetUserId: string
): Promise<{ eligible: boolean; reason: "teammate" | "co-player" | null }> {
  const supabase = createClient();
  const { data: myTeams } = await supabase.from("team_members").select("team_id").eq("user_id", myId).eq("status", "active");
  const teamIds = ((myTeams ?? []) as Row[]).map((t) => str(t.team_id));
  if (teamIds.length > 0) {
    const { data: shared } = await supabase.from("team_members").select("id").eq("user_id", targetUserId).eq("status", "active").in("team_id", teamIds).limit(1);
    if ((shared ?? []).length > 0) return { eligible: true, reason: "teammate" };
  }
  const { data: myMatches } = await supabase.from("match_request_participants").select("request_id").eq("user_id", myId);
  const matchIds = ((myMatches ?? []) as Row[]).map((m) => str(m.request_id));
  if (matchIds.length > 0) {
    const { data: shared } = await supabase.from("match_request_participants").select("id").eq("user_id", targetUserId).in("request_id", matchIds).limit(1);
    if ((shared ?? []).length > 0) return { eligible: true, reason: "co-player" };
  }
  return { eligible: false, reason: null };
}

export async function fetchEndorsementSummary(targetUserId: string, myId: string | null): Promise<EndorsementSummary> {
  const supabase = createClient();
  const { data } = await supabase.from("endorsements").select("endorser_id, category").eq("endorsee_id", targetUserId);
  const list = (data ?? []) as Row[];
  const byCategory: Record<string, number> = {};
  const myEndorsed: string[] = [];
  list.forEach((e) => {
    const cat = str(e.category);
    byCategory[cat] = (byCategory[cat] ?? 0) + 1;
    if (myId && str(e.endorser_id) === myId) myEndorsed.push(cat);
  });
  let eligible = false;
  let reason: "teammate" | "co-player" | null = null;
  if (myId && myId !== targetUserId) {
    const elig = await checkEndorseEligibility(myId, targetUserId);
    eligible = elig.eligible;
    reason = elig.reason;
  }
  return { total: list.length, byCategory, myEndorsed, eligible, reason };
}

export async function addEndorsement(targetUserId: string, category: string): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { error } = await supabase.from("endorsements").insert({
    endorser_id: user.id,
    endorsee_id: targetUserId,
    category,
  });
  return !error;
}