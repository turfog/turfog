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
  invited: boolean;
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

function mapTeam(t: Row, joined: boolean, following: boolean, invited: boolean, viewerRole: string | null): Team {
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
    invited,
    viewerRole,
  };
}

function mapMember(m: Row): TeamMember {
  return {
    id: str(m.id),
    userId: m.user_id ? str(m.user_id) : null,
    username: str(m.username),
    displayName: str(m.display_name, "Player"),
    avatar: str(m.avatar),
    role: str(m.role, "member"),
    jerseyNumber: m.jersey_number == null ? null : num(m.jersey_number),
    position: str(m.position),
    joinedAt: str(m.joined_at),
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
  return list.map((t) => mapTeam(t, joinedSet.has(str(t.id)), followedSet.has(str(t.id)), false, null));
}

export async function fetchTeamBySlug(slug: string): Promise<Team | null> {
  const supabase = createClient();
  const { data } = await supabase.from("teams").select("*").eq("slug", slug).maybeSingle();
  if (!data) return null;
  const t = data as Row;
  const { data: { user } } = await supabase.auth.getUser();
  let joined = false;
  let following = false;
  let invited = false;
  let viewerRole: string | null = null;
  if (user) {
    const { data: mem } = await supabase.from("team_members").select("role, status").eq("team_id", str(t.id)).eq("user_id", user.id).maybeSingle();
    if (mem) {
      const status = str((mem as Row).status);
      if (status === "active") {
        joined = true;
        viewerRole = str((mem as Row).role);
      } else if (status === "invited") {
        invited = true;
      }
    }
    const { data: fol } = await supabase.from("team_follows").select("id").eq("team_id", str(t.id)).eq("user_id", user.id).maybeSingle();
    following = !!fol;
  }
  return mapTeam(t, joined, following, invited, viewerRole);
}

export async function fetchTeamMembers(teamId: string): Promise<TeamMember[]> {
  const supabase = createClient();
  const { data } = await supabase.from("team_members").select("*").eq("team_id", teamId).eq("status", "active");
  return ((data ?? []) as Row[]).map(mapMember);
}

export async function fetchTeamInvites(teamId: string): Promise<TeamMember[]> {
  const supabase = createClient();
  const { data } = await supabase.from("team_members").select("*").eq("team_id", teamId).eq("status", "invited");
  return ((data ?? []) as Row[]).map(mapMember);
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

// ----- Management (E1.5) -----

export async function setMemberRole(memberId: string, role: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase.rpc("team_set_role", { p_member_id: memberId, p_role: role });
  return !error;
}

export async function setMemberJersey(memberId: string, jersey: number | null, position: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase.rpc("team_set_jersey", { p_member_id: memberId, p_jersey: jersey, p_position: position });
  return !error;
}

export async function removeMember(memberId: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase.rpc("team_remove_member", { p_member_id: memberId });
  return !error;
}

export async function inviteToTeam(teamId: string, username: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = createClient();
  const { error } = await supabase.rpc("team_invite", { p_team_id: teamId, p_target_username: username });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function respondToInvite(teamId: string, accept: boolean): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase.rpc("team_respond_invite", { p_team_id: teamId, p_accept: accept });
  return !error;
}

export async function postTeamAnnouncement(teamId: string, text: string, imageUrl?: string): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data: player } = await supabase.from("players").select("full_name, username, profile_photo, verification_status").eq("auth_id", user.id).maybeSingle();
  const p = (player ?? {}) as Row;
  const { error } = await supabase.from("posts").insert({
    author_id: user.id,
    author_name: str(p.full_name, "Player"),
    author_username: str(p.username, "player"),
    author_avatar: str(p.profile_photo),
    author_verified: p.verification_status === "verified",
    text,
    image_url: imageUrl ?? null,
    image_alt: imageUrl ? "Team announcement" : "",
    media_type: imageUrl ? "image" : null,
    team_id: teamId,
  });
  return !error;
}
// ----- Recruitment (E2) -----

export interface PlayerSearchResult {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  verified: boolean;
  presence: string;
  reliability: number;
  city: string;
  followers: number;
  latitude: number | null;
  longitude: number | null;
}

export async function searchPlayers(opts: { query: string; verifiedOnly?: boolean }): Promise<PlayerSearchResult[]> {
  const supabase = createClient();
  let q = supabase
    .from("players")
    .select("auth_id, username, full_name, profile_photo, verification_status, presence_status, reliability_score, city, followers_count, latitude, longitude")
    .limit(12);
  const term = opts.query.trim();
  if (term) {
    const safe = term.replace(/[,()%_\\]/g, " ");
    q = q.or(`username.ilike.%${safe}%,full_name.ilike.%${safe}%`);
  }
  if (opts.verifiedOnly) q = q.eq("verification_status", "verified");
  const { data } = await q;
  return ((data ?? []) as Row[]).map((r) => ({
    id: str(r.auth_id),
    username: str(r.username),
    fullName: str(r.full_name, "Player"),
    avatar: str(r.profile_photo),
    verified: r.verification_status === "verified",
    presence: str(r.presence_status, "offline"),
    reliability: num(r.reliability_score, 4.8),
    city: str(r.city),
    followers: num(r.followers_count),
    latitude: r.latitude != null ? num(r.latitude) : null,
    longitude: r.longitude != null ? num(r.longitude) : null,
  }));
}
