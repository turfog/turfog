import { createClient } from "@/lib/supabase";
import type { SportId } from "@/types";

const SPORTS = new Set<SportId>(["football", "box-cricket", "pickleball", "padel", "badminton"]);
type Row = Record<string, unknown>;
const str = (v: unknown, d = ""): string => (v == null ? d : String(v));
const num = (v: unknown, d = 0): number => (typeof v === "number" ? v : Number(v) || d);
function safeSport(v: unknown): SportId {
  return typeof v === "string" && SPORTS.has(v as SportId) ? (v as SportId) : "football";
}

export interface Community {
  id: string;
  name: string;
  slug: string;
  sport: SportId;
  city: string;
  area: string;
  description: string;
  cover: string;
  memberCount: number;
  verified: boolean;
  joined: boolean;
}

export async function fetchCommunities(): Promise<Community[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data } = await supabase.from("communities").select("*").order("member_count", { ascending: false }).limit(60);
  const list = (data ?? []) as Row[];
  let joinedSet = new Set<string>();
  if (user) {
    const { data: mine } = await supabase.from("community_members").select("community_id").eq("user_id", user.id);
    joinedSet = new Set(((mine ?? []) as Row[]).map((m) => str(m.community_id)));
  }
  return list.map((c) => ({
    id: str(c.id),
    name: str(c.name, "Community"),
    slug: str(c.slug),
    sport: safeSport(c.sport),
    city: str(c.city),
    area: str(c.area),
    description: str(c.description),
    cover: str(c.cover),
    memberCount: num(c.member_count),
    verified: c.is_verified === true,
    joined: joinedSet.has(str(c.id)),
  }));
}

export async function joinCommunity(id: string): Promise<{ joined: boolean; memberCount: number } | null> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("join_community", { p_id: id });
  if (error) return null;
  const d = data as { joined: boolean; member_count: number };
  return { joined: d.joined, memberCount: d.member_count };
}

export async function createCommunity(input: { name: string; sport: SportId; city: string; description: string }): Promise<string | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const slug = `${input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${Date.now().toString(36)}`;
  const { data, error } = await supabase
    .from("communities")
    .insert({ name: input.name, slug, sport: input.sport, city: input.city, area: input.city, description: input.description, member_count: 1, created_by: user.id })
    .select("id")
    .single();
  if (error) return null;
  const id = str((data as { id: string }).id);
  await supabase.from("community_members").insert({ community_id: id, user_id: user.id, role: "owner" });
  return id;
}