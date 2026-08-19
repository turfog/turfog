import { createClient } from "@/lib/supabase";
import type { SocialPost, PostComment, SportId } from "@/types";

interface PostRow {
  id: string;
  author_id: string | null;
  author_name: string;
  author_username: string;
  author_avatar: string;
  author_verified: boolean;
  sport: string | null;
  location: string;
  text: string;
  image_url: string | null;
  image_alt: string;
  media_type: string | null;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  created_at: string;
}

interface AuthorMeta {
  username: string;
  presence_status: string | null;
  reliability_score: number | null;
}

const SPORTS_SET = new Set<SportId>(["football", "box-cricket", "pickleball", "padel", "badminton"]);

function safeSport(v: string | null | undefined): SportId | undefined {
  return v && SPORTS_SET.has(v as SportId) ? (v as SportId) : undefined;
}

function mapPost(row: PostRow, liked: boolean, meta?: AuthorMeta): SocialPost {
  return {
    id: row.id,
    authorId: row.author_id ?? undefined,
    authorName: row.author_name ?? "Player",
    authorUsername: row.author_username ?? "player",
    authorAvatar: row.author_avatar ?? "",
    authorVerified: !!row.author_verified,
    presence: meta?.presence_status ?? "offline",
    trustScore: meta ? Number(meta.reliability_score) || 4.8 : 4.8,
    createdAt: row.created_at,
    sport: safeSport(row.sport),
    location: row.location || undefined,
    text: row.text ?? "",
    media: row.image_url
      ? {
          type: row.media_type === "video" ? "video" : "image",
          url: row.image_url,
          alt: row.image_alt || "",
        }
      : null,
    heartbeat: null,
    likes: typeof row.likes_count === "number" ? row.likes_count : 0,
    comments: [],
    shares: typeof row.shares_count === "number" ? row.shares_count : 0,
    likedByMe: liked,
    savedByMe: false,
    nearbyWantToJoin: 0,
  };
}

export async function fetchFeed(): Promise<SocialPost[]> {
  const supabase = createClient();
  const { data: rows } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(40);
  const list = (rows ?? []) as PostRow[];
  if (list.length === 0) return [];

  const ids = list.map((r) => r.id);
  const usernames = Array.from(new Set(list.map((r) => r.author_username).filter(Boolean)));

  const { data: { user } } = await supabase.auth.getUser();
  const likePromise = user
    ? supabase.from("post_likes").select("post_id").eq("user_id", user.id).in("post_id", ids)
    : Promise.resolve({ data: [] as Array<{ post_id: string }> });
  const metaPromise = usernames.length
    ? supabase.from("players").select("username, presence_status, reliability_score").in("username", usernames)
    : Promise.resolve({ data: [] as AuthorMeta[] });

  const [likeRes, metaRes] = await Promise.all([likePromise, metaPromise]);
  const likedSet = new Set((likeRes.data ?? []).map((l) => l.post_id));
  const metaMap = new Map<string, AuthorMeta>();
  (metaRes.data ?? []).forEach((m) => metaMap.set(m.username, m));

  return list.map((r) => mapPost(r, likedSet.has(r.id), metaMap.get(r.author_username)));
}

export async function fetchComments(postId: string): Promise<Array<PostComment & { parentId: string | null }>> {
  const supabase = createClient();
  const { data } = await supabase
    .from("post_comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });
  return ((data ?? []) as Array<{ id: string; author_name: string; author_avatar: string; text: string; created_at: string; parent_id: string | null }>).map((c) => ({
    id: c.id,
    authorName: c.author_name ?? "Player",
    authorAvatar: c.author_avatar ?? "",
    text: c.text ?? "",
    createdAt: c.created_at,
    parentId: c.parent_id ?? null,
  }));
}

export async function likePost(postId: string): Promise<{ liked: boolean; likes_count: number } | null> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("toggle_post_like", { p_post_id: postId });
  if (error) { console.error("Supabase RPC error:", error); return null; }
  return data as { liked: boolean; likes_count: number };
}

export async function commentPost(postId: string, text: string, parentId?: string | null): Promise<PostComment & { comments_count: number; parentId: string | null } | null> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("add_post_comment", { p_post_id: postId, p_text: text, p_parent_id: parentId ?? null });
  if (error) { console.error("Supabase RPC error:", error); return null; }
  const d = data as { id: string; authorName: string; authorAvatar: string; text: string; createdAt: string; comments_count: number; parentId: string | null };
  return { id: d.id, authorName: d.authorName, authorAvatar: d.authorAvatar, text: d.text, createdAt: d.createdAt, comments_count: d.comments_count, parentId: d.parentId ?? null };
}

export async function sharePost(postId: string): Promise<number | null> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("share_post", { p_post_id: postId });
  if (error) { console.error("Supabase RPC error:", error); return null; }
  return (data as { shares_count: number }).shares_count;
}

export async function toggleFollow(targetId: string): Promise<{ following: boolean } | null> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("toggle_follow", { p_target_id: targetId });
  if (error) { console.error("Supabase RPC error:", error); return null; }
  return data as { following: boolean };
}

export async function fetchMyFollows(): Promise<{ myUsername: string; following: Set<string> }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { myUsername: "", following: new Set() };
  const [{ data: me }, { data: rows }] = await Promise.all([
    supabase.from("players").select("username").eq("auth_id", user.id).maybeSingle(),
    supabase.from("follows").select("following_username").eq("follower_id", user.id),
  ]);
  const set = new Set<string>();
  (rows ?? []).forEach((r) => {
    if (r.following_username) set.add(r.following_username);
  });
  return { myUsername: (me as { username: string } | null)?.username ?? "", following: set };
}

export async function createPost(input: {
  text: string;
  imageUrl?: string;
  imageAlt?: string;
  mediaType?: "image" | "video";
  location?: string;
}): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data: player } = await supabase
    .from("players")
    .select("full_name, username, profile_photo, verification_status")
    .eq("auth_id", user.id)
    .maybeSingle();
  const { error } = await supabase.from("posts").insert({
    author_id: user.id,
    author_name: player?.full_name ?? "Player",
    author_username: player?.username ?? "player",
    author_avatar: player?.profile_photo ?? "",
    author_verified: player?.verification_status === "verified",
    text: input.text,
    image_url: input.imageUrl ?? null,
    image_alt: input.imageAlt ?? "",
    media_type: input.mediaType ?? null,
    location: input.location ?? "",
  });
  return !error;
}