import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { SportId } from "@/types";

const SPORTS = new Set<SportId>(["football", "box-cricket", "pickleball", "padel", "badminton"]);
export function safeSportId(v: unknown): SportId | null {
  return typeof v === "string" && SPORTS.has(v as SportId) ? (v as SportId) : null;
}

export interface ProfilePost {
  id: string;
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

export interface OrganizedMatch {
  id: string;
  sport: SportId | null;
  venue: string;
  area: string;
  needed: number;
  capacity: number;
  kickoffAt: string;
}

export interface ProfileView {
  id: string | null;
  username: string;
  fullName: string;
  avatar: string;
  bio: string;
  city: string;
  verified: boolean;
  presence: string;
  reliability: number;
  followers: number;
  following: number;
  joinedAt: string;
  sports: string[];
  primarySport: SportId | null;
  isDemo: boolean;
  postsCount: number;
  organizedCount: number;
  joinedCount: number;
}

export interface ProfilePayload {
  view: ProfileView;
  posts: ProfilePost[];
  organized: OrganizedMatch[];
  viewer: { myId: string | null; myUsername: string; following: boolean };
}

type Row = Record<string, unknown>;
const str = (v: unknown, d = ""): string => (v == null ? d : String(v));
const num = (v: unknown, d = 0): number => (typeof v === "number" ? v : Number(v) || d);
const bool = (v: unknown): boolean => v === true || v === "verified";

function mapPost(r: Row): ProfilePost {
  return {
    id: str(r.id),
    text: str(r.text),
    imageUrl: r.image_url ? str(r.image_url) : null,
    imageAlt: str(r.image_alt),
    mediaType: r.media_type ? str(r.media_type) : null,
    sport: safeSportId(r.sport),
    location: str(r.location),
    likes: num(r.likes_count),
    comments: num(r.comments_count),
    createdAt: str(r.created_at),
  };
}

function mapMatch(r: Row): OrganizedMatch {
  return {
    id: str(r.id),
    sport: safeSportId(r.sport),
    venue: str(r.venue),
    area: str(r.area),
    needed: num(r.needed),
    capacity: num(r.capacity),
    kickoffAt: str(r.kickoff_at),
  };
}

export async function fetchProfileView(username: string, viewerId: string | null): Promise<ProfilePayload | null> {
  const supa = await createServerSupabaseClient();
  const clean = username.toLowerCase();

  const { data: player } = await supa.from("players").select("*").eq("username", clean).maybeSingle();
  const { data: hb } = await supa
    .from("heartbeats")
    .select("user_name, user_avatar, verified, sport, location, note, is_active, expires_at, created_at")
    .eq("user_username", clean)
    .order("created_at", { ascending: false })
    .limit(40);
  const { data: posts } = await supa
    .from("posts")
    .select("id, text, image_url, image_alt, media_type, sport, location, likes_count, comments_count, created_at, author_name, author_avatar, author_verified")
    .eq("author_username", clean)
    .order("created_at", { ascending: false })
    .limit(12);
  const { data: organized } = await supa
    .from("match_requests")
    .select("id, sport, venue, area, needed, capacity, kickoff_at")
    .eq("organizer_username", clean)
    .order("kickoff_at", { ascending: false })
    .limit(6);
  const { count: postsCount } = await supa.from("posts").select("id", { count: "exact", head: true }).eq("author_username", clean);

  const heartbeats = (hb ?? []) as Row[];
  const postList = (posts ?? []) as Row[];
  const organizedList = (organized ?? []) as Row[];

  if (!player && heartbeats.length === 0 && postList.length === 0) return null;

  const nowIso = new Date().toISOString();
  const live = heartbeats.some((h) => h.is_active === true && str(h.expires_at) > nowIso);

  let id: string | null = null;
  let fullName = "";
  let avatar = "";
  let verified = false;
  let bio = "";
  let city = "";
  let presence = "offline";
  let reliability = 4.8;
  let followers = 0;
  let following = 0;
  let joinedAt = "";
  let joinedCount = 0;
  const sportSet = new Set<string>();

  if (player) {
    const p = player as Row;
    id = str(p.auth_id);
    fullName = str(p.full_name, clean);
    avatar = str(p.profile_photo);
    verified = bool(p.verification_status);
    bio = str(p.bio);
    city = str(p.city);
    presence = str(p.presence_status, "offline");
    reliability = num(p.reliability_score, 4.8);
    followers = num(p.followers_count);
    following = num(p.following_count);
    joinedAt = str(p.created_at);
    const { count: jc } = await supa
      .from("match_request_participants")
      .select("id", { count: "exact", head: true })
      .eq("user_id", id)
      .eq("status", "joined");
    joinedCount = jc ?? 0;
  } else if (heartbeats.length > 0) {
    const h0 = heartbeats[0];
    fullName = str(h0.user_name, clean);
    avatar = str(h0.user_avatar);
    verified = bool(h0.verified);
    city = str(h0.location);
    bio = str(h0.note);
    presence = live ? "available-now" : "offline";
    joinedAt = str(heartbeats[heartbeats.length - 1].created_at);
  } else {
    const p0 = postList[0];
    fullName = str(p0.author_name, clean);
    avatar = str(p0.author_avatar);
    verified = bool(p0.author_verified);
    joinedAt = str(p0.created_at);
  }

  heartbeats.forEach((h) => { const s = str(h.sport); if (s) sportSet.add(s); });
  if (sportSet.size === 0) postList.forEach((p) => { const s = str(p.sport); if (s) sportSet.add(s); });
  const sports = Array.from(sportSet);
  const primarySport = sports.map(safeSportId).find((s): s is SportId => s !== null) ?? null;

  let viewerFollowing = false;
  let myUsername = "";
  if (viewerId) {
    const { data: me } = await supa.from("players").select("username").eq("auth_id", viewerId).maybeSingle();
    myUsername = str((me as Row | null)?.username);
    if (id) {
      const { data: f } = await supa
        .from("follows")
        .select("id")
        .eq("follower_id", viewerId)
        .eq("following_id", id)
        .maybeSingle();
      viewerFollowing = !!f;
    }
  }

  return {
    view: {
      id,
      username: clean,
      fullName,
      avatar,
      bio,
      city,
      verified,
      presence,
      reliability,
      followers,
      following,
      joinedAt,
      sports,
      primarySport,
      isDemo: !player,
      postsCount: postsCount ?? postList.length,
      organizedCount: organizedList.length,
      joinedCount,
    },
    posts: postList.map(mapPost),
    organized: organizedList.map(mapMatch),
    viewer: { myId: viewerId, myUsername, following: viewerFollowing },
  };
}