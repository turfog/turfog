import { createClient } from "@/lib/supabase";

export interface LivePlayer {
  id: string;
  userId: string;
  name: string;
  username: string;
  avatar: string;
  verified: boolean;
  sport: string;
  location: string;
  expiresAt: string;
}

export async function fetchLivePlayers(): Promise<LivePlayer[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let query = supabase
    .from("heartbeats")
    .select("*")
    .eq("is_active", true)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(12);
  if (user) {
    query = query.neq("user_id", user.id);
  }
  const { data } = await query;
  return ((data ?? []) as Array<Record<string, unknown>>).map((h) => ({
    id: String(h.id),
    userId: String(h.user_id),
    name: String(h.user_name ?? "Player"),
    username: String(h.user_username ?? "player"),
    avatar: String(h.user_avatar ?? ""),
    verified: h.verified === true,
    sport: String(h.sport ?? ""),
    location: String(h.location ?? ""),
    expiresAt: String(h.expires_at),
  }));
}