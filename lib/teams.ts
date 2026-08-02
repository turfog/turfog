import { createClient } from "@/lib/supabase";
import type { SportId } from "@/types";

const SPORTS = new Set<SportId>(["football", "box-cricket", "pickleball", "padel", "badminton"]);
type Row = Record<string, unknown>;
const str = (v: unknown, d = ""): string => (v == null ? d : String(v));
const num = (v: unknown, d = 0): number => (typeof v === "number" ? v : Number(v) || d);
function safeSport(v: unknown): SportId {
  return typeof v === "string" && SPORTS.has(v as SportId) ? (v as SportId) : "football";
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  sport: SportId;
  city: string;
  area: string;
  description: string;
  logo: string;
  cover: string;
  homeTurf: string;
  foundedYear: number;
  ownerId: string | null;
  memberCount: number;
  followerCount: number;
  verified: boolean;
  joined: boolean;
  following: boolean;
  viewerRole: string | null;
}

export interface TeamMember {
  id: string;
  userId: string | null;
  username: string;
  displayName: string;
  avatar: string;
  role: string;
  jerseyNumber: number | null;
  position: string;
  joinedAt: string;
}

export interface TeamPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  imageUrl: string | null;
  imageAlt: string;
  mediaType: string | null;
  sport: SportId | null;
  location: string;
  likes: number;
  comments: number;
  createdAt: string;
}

function mapTeam(t: Row, joined: boolean, following: boolean, viewerRole: string | null): Team {
  return {
    id: str(t.id),
    name: str(t.name, "Team"),
    slug: str(t.slug),
    sport: safeSport(t.sport),
    city: str(t.city),
    area: str(t.area),
    description: str(t.description),
    logo: str(t.logo),
    cover: str(t.cover),
    homeTurf: str(t.home_turf),
    foundedYear: num(t.founded_year),
    ownerId: t.owner_id ? str(t.owner_id) : null,
    memberCount: num(t.member_count),
    followerCount: num(t.follower_count),
    verified: t.is_verified === true,
    joined,
    following,
    viewerRole,
  };
}

export async function fetchTeams(): Promise<Team[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data } = await supabase.from("teams").select("*").order("member_count", { ascending: false }).limit(60);
  const list = (data ?? []) as Row[];
  let joinedSet = new Set<string>();
  let followedSet = new Set<string>();
  if (user) {
    const { data: mine } = await supabase.from("team_members").select("team_id").eq("user_id", user.id).eq("status", "active");
    joinedSet = new Set(((mine ?? []) as Row[]).map((m) => str(m.team_id)));
    const { data: fol } = await supabase.from("team_follows").select("team_id").eq("user_id", user.id);
    followedSet = new Set(((fol ?? []) as Row[]).map((f) => str(f.team_id)));
  }
  return list.map((t) => mapTeam(t, joinedSet.has(str(t.id)), followedSet.has(str(t.id)), null));
}

export async function fetchTeamBySlug(slug: string): Promise<Team | null> {
  const supabase = createClient();
  const { data } = await supabase.from("teams").select("*").eq("slug", slug).maybeSingle();
  if (!data) return null;
  const t = data as Row;
  const { data: { user } } = await supabase.auth.getUser();
  let joined = false;
  let following = false;
  let viewerRole: string | null = null;
  if (user) {
    const { data: mem } = await supabase.from("team_members").select("role, status").eq("team_id", str(t.id)).eq("user_id", user.id).maybeSingle();
    if (mem && (mem as Row).status === "active") {
      joined = true;
      viewerRole = str((mem as Row).role);
    }
    const { data: fol } = await supabase.from("team_follows").select("id").eq("team_id", str(t.id)).eq("user_id", user.id).maybeSingle();
    following = !!fol;
  }
  return mapTeam(t, joined, following, viewerRole);
}

export async function fetchTeamMembers(teamId: string): Promise<TeamMember[]> {
  const supabase = createClient();
  const { data } = await supabase.from("team_members").select("*").eq("team_id", teamId).eq("status", "active");
  return ((data ?? []) as Row[]).map((m) => ({
    id: str(m.id),
    userId: m.user_id ? str(m.user_id) : null,
    username: str(m.username),
    displayName: str(m.display_name, "Player"),
    avatar: str(m.avatar),
    role: str(m.role, "member"),
    jerseyNumber: m.jersey_number == null ? null : num(m.jersey_number),
    position: str(m.position),
    joinedAt: str(m.joined_at),
  }));
}

export async function fetchTeamPosts(teamId: string): Promise<TeamPost[]> {
  const supabase = createClient();
  const { data } = await supabase.from("posts").select("*").eq("team_id", teamId).order("created_at", { ascending: false }).limit(20);
  return ((data ?? []) as Row[]).map((p) => ({
    id: str(p.id),
    authorName: str(p.author_name, "Player"),
    authorAvatar: str(p.author_avatar),
    text: str(p.text),
    imageUrl: p.image_url ? str(p.image_url) : null,
    imageAlt: str(p.image_alt),
    mediaType: p.media_type ? str(p.media_type) : null,
    sport: p.sport ? safeSport(p.sport) : null,
    location: str(p.location),
    likes: num(p.likes_count),
    comments: num(p.comments_count),
    createdAt: str(p.created_at),
  }));
}

export async function joinTeam(id: string): Promise<{ joined: boolean; memberCount: number } | null> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("join_team", { p_id: id });
  if (error) return null;
  const d = data as { joined: boolean; member_count: number };
  return { joined: d.joined, memberCount: d.member_count };
}

export async function followTeam(id: string): Promise<{ following: boolean; followerCount: number } | null> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("follow_team", { p_id: id });
  if (error) return null;
  const d = data as { following: boolean; follower_count: number };
  return { following: d.following, followerCount: d.follower_count };
}

export async function createTeam(input: { name: string; sport: SportId; city: string; homeTurf: string; description: string }): Promise<string | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const slug = `${input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${Date.now().toString(36)}`;
  const { data, error } = await supabase
    .from("teams")
    .insert({ name: input.name, slug, sport: input.sport, city: input.city, area: input.city, home_turf: input.homeTurf, description: input.description, owner_id: user.id, member_count: 1 })
    .select("id")
    .single();
  if (error) return null;
  const id = str((data as { id: string }).id);
  const { data: player } = await supabase.from("players").select("full_name, username, profile_photo").eq("auth_id", user.id).maybeSingle();
  await supabase.from("team_members").insert({
    team_id: id,
    user_id: user.id,
    username: (player as { username: string } | null)?.username ?? "player",
    display_name: (player as { full_name: string } | null)?.full_name ?? "Player",
    avatar: (player as { profile_photo: string } | null)?.profile_photo ?? "",
    role: "owner",
    status: "active",
  });
  return id;
}