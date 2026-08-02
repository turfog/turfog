import { createClient } from "@/lib/supabase";

export interface PlayerResult {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  verified: boolean;
  presence: string;
  reliability: number;
  followers: number;
}

export interface PostResult {
  id: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  authorVerified: boolean;
  text: string;
  imageUrl: string | null;
  mediaType: string | null;
  createdAt: string;
  likes: number;
}

export interface MatchResult {
  id: string;
  sport: string;
  venue: string;
  area: string;
  organizerName: string;
  organizerUsername: string;
  needed: number;
  capacity: number;
  kickoffAt: string;
  latitude: number | null;
  longitude: number | null;
}

export interface SearchResults {
  players: PlayerResult[];
  posts: PostResult[];
  matches: MatchResult[];
}

const EMPTY: SearchResults = { players: [], posts: [], matches: [] };

export async function searchAll(raw: string): Promise<SearchResults> {
  const q = raw.replace(/[,()%_\\]/g, " ").trim();
  if (q.length < 2) return EMPTY;
  const pat = `%${q}%`;
  const supabase = createClient();

  const [playersRes, postsRes, matchesRes] = await Promise.all([
    supabase
      .from("players")
      .select("auth_id, username, full_name, profile_photo, verification_status, presence_status, reliability_score, followers_count")
      .or(`username.ilike.${pat},full_name.ilike.${pat}`)
      .limit(6),
    supabase
      .from("posts")
      .select("id, author_name, author_username, author_avatar, author_verified, text, image_url, media_type, likes_count, created_at")
      .or(`text.ilike.${pat},author_name.ilike.${pat},author_username.ilike.${pat}`)
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("match_requests")
      .select("id, sport, venue, area, organizer_name, organizer_username, needed, capacity, kickoff_at, latitude, longitude")
      .eq("is_active", true)
      .or(`venue.ilike.${pat},area.ilike.${pat},sport.ilike.${pat},organizer_name.ilike.${pat}`)
      .order("kickoff_at", { ascending: true })
      .limit(6),
  ]);

  const players: PlayerResult[] = ((playersRes.data ?? []) as Array<Record<string, unknown>>).map((r) => ({
    id: String(r.auth_id ?? r.username ?? ""),
    username: String(r.username ?? "player"),
    fullName: String(r.full_name ?? "Player"),
    avatar: String(r.profile_photo ?? ""),
    verified: r.verification_status === "verified",
    presence: String(r.presence_status ?? "offline"),
    reliability: Number(r.reliability_score) || 4.8,
    followers: Number(r.followers_count) || 0,
  }));

  const posts: PostResult[] = ((postsRes.data ?? []) as Array<Record<string, unknown>>).map((r) => ({
    id: String(r.id ?? ""),
    authorName: String(r.author_name ?? "Player"),
    authorUsername: String(r.author_username ?? "player"),
    authorAvatar: String(r.author_avatar ?? ""),
    authorVerified: r.author_verified === true,
    text: String(r.text ?? ""),
    imageUrl: r.image_url ? String(r.image_url) : null,
    mediaType: r.media_type ? String(r.media_type) : null,
    createdAt: String(r.created_at ?? ""),
    likes: Number(r.likes_count) || 0,
  }));

  const matches: MatchResult[] = ((matchesRes.data ?? []) as Array<Record<string, unknown>>).map((r) => ({
    id: String(r.id ?? ""),
    sport: String(r.sport ?? ""),
    venue: String(r.venue ?? ""),
    area: String(r.area ?? ""),
    organizerName: String(r.organizer_name ?? "Player"),
    organizerUsername: String(r.organizer_username ?? "player"),
    needed: Number(r.needed) || 0,
    capacity: Number(r.capacity) || 0,
    kickoffAt: String(r.kickoff_at ?? ""),
    latitude: r.latitude != null ? Number(r.latitude) : null,
    longitude: r.longitude != null ? Number(r.longitude) : null,
  }));

  return { players, posts, matches };
}