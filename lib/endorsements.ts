import { createClient } from "@/lib/supabase";

export const ENDORSEMENT_CATEGORIES = ["Teamwork", "Skill", "Sportsmanship", "Reliability", "Leadership"];

export interface EndorsablePlayer {
  id: string;
  name: string;
  username: string;
  avatar: string;
}

export interface EndorsementRecord {
  endorserId: string;
  endorseeId: string;
  category: string;
}

export async function fetchPlayersToEndorse(): Promise<EndorsablePlayer[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let query = supabase
    .from("players")
    .select("auth_id, full_name, username, profile_photo")
    .limit(20);
  if (user) {
    query = query.neq("auth_id", user.id);
  }
  const { data } = await query;
  return ((data ?? []) as Array<Record<string, unknown>>).map((p) => ({
    id: String(p.auth_id),
    name: String(p.full_name ?? "Player"),
    username: String(p.username ?? "player"),
    avatar: String(p.profile_photo ?? ""),
  }));
}

export async function fetchEndorsements(): Promise<EndorsementRecord[]> {
  const supabase = createClient();
  const { data } = await supabase.from("endorsements").select("endorser_id, endorsee_id, category");
  return ((data ?? []) as Array<Record<string, unknown>>).map((e) => ({
    endorserId: String(e.endorser_id),
    endorseeId: String(e.endorsee_id),
    category: String(e.category),
  }));
}

export async function endorsePlayer(endorseeId: string, category: string): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { error } = await supabase.from("endorsements").insert({
    endorser_id: user.id,
    endorsee_id: endorseeId,
    category,
  });
  return !error;
}
export async function fetchEndorsementsForUser(userId: string): Promise<EndorsementRecord[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("endorsements")
    .select("endorser_id, endorsee_id, category")
    .eq("endorsee_id", userId);
  return ((data ?? []) as Array<Record<string, unknown>>).map((e) => ({
    endorserId: String(e.endorser_id),
    endorseeId: String(e.endorsee_id),
    category: String(e.category),
  }));
}