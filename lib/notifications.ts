import { createClient } from "@/lib/supabase";
import { fetchActiveRequests } from "@/lib/discovery";

export interface NotificationItem {
  id: string;
  type: "follow" | "like" | "comment" | "opportunity";
  actorName: string;
  actorAvatar: string;
  text: string;
  href: string;
  createdAt: string;
}

type Row = Record<string, unknown>;
const str = (v: unknown, d = ""): string => (v == null ? d : String(v));

export async function fetchNotifications(): Promise<NotificationItem[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const me = user.id;
  const items: NotificationItem[] = [];

  try {
    const { data: myPosts } = await supabase.from("posts").select("id, text").eq("author_id", me).limit(100);
    const myPostList = (myPosts ?? []) as Row[];
    const myPostIds = myPostList.map((p) => str(p.id));
    const postText = new Map(myPostList.map((p) => [str(p.id), str(p.text)]));

    const { data: follows } = await supabase
      .from("follows")
      .select("follower_id, follower_username, created_at")
      .eq("following_id", me)
      .order("created_at", { ascending: false })
      .limit(20);

    let likes: Row[] = [];
    let comments: Row[] = [];
    if (myPostIds.length > 0) {
      const { data: lk } = await supabase.from("post_likes").select("user_id, post_id, created_at").in("post_id", myPostIds).order("created_at", { ascending: false }).limit(40);
      likes = ((lk ?? []) as Row[]).filter((l) => str(l.user_id) !== me);
      const { data: cm } = await supabase.from("post_comments").select("user_id, post_id, author_name, author_avatar, text, created_at").in("post_id", myPostIds).order("created_at", { ascending: false }).limit(40);
      comments = ((cm ?? []) as Row[]).filter((c) => str(c.user_id) !== me);
    }

    const actorIds = Array.from(
      new Set([...((follows ?? []) as Row[]).map((f) => str(f.follower_id)), ...likes.map((l) => str(l.user_id))])
    ).filter(Boolean);
    const actorMap = new Map<string, { name: string; avatar: string; username: string }>();
    if (actorIds.length > 0) {
      const { data: actors } = await supabase.from("players").select("auth_id, full_name, username, profile_photo").in("auth_id", actorIds);
      ((actors ?? []) as Row[]).forEach((a) =>
        actorMap.set(str(a.auth_id), { name: str(a.full_name, str(a.username, "Player")), avatar: str(a.profile_photo), username: str(a.username) })
      );
    }

    ((follows ?? []) as Row[]).forEach((f, i) => {
      const actor = actorMap.get(str(f.follower_id));
      items.push({
        id: `follow-${str(f.follower_id)}-${i}`,
        type: "follow",
        actorName: actor?.name ?? str(f.follower_username, "A player"),
        actorAvatar: actor?.avatar ?? "",
        text: "started following you",
        href: actor?.username ? `/${actor.username}` : "/",
        createdAt: str(f.created_at),
      });
    });

    likes.forEach((l, i) => {
      const actor = actorMap.get(str(l.user_id));
      const snippet = (postText.get(str(l.post_id)) ?? "").slice(0, 60);
      items.push({
        id: `like-${str(l.user_id)}-${str(l.post_id)}-${i}`,
        type: "like",
        actorName: actor?.name ?? "A player",
        actorAvatar: actor?.avatar ?? "",
        text: snippet ? `liked your post: "${snippet}"` : "liked your post",
        href: "/",
        createdAt: str(l.created_at),
      });
    });

    comments.forEach((c, i) => {
      const snippet = (postText.get(str(c.post_id)) ?? "").slice(0, 50);
      items.push({
        id: `comment-${str(c.user_id)}-${str(c.post_id)}-${i}`,
        type: "comment",
        actorName: str(c.author_name, "A player"),
        actorAvatar: str(c.author_avatar),
        text: snippet ? `commented on your post: "${snippet}"` : "commented on your post",
        href: "/",
        createdAt: str(c.created_at),
      });
    });

    const reqs = await fetchActiveRequests();
    reqs
      .filter((r) => r.organizer_id !== me)
      .slice(0, 5)
      .forEach((r, i) => {
        items.push({
          id: `opp-${r.id}-${i}`,
          type: "opportunity",
          actorName: r.organizer_name || "A team",
          actorAvatar: r.organizer_avatar || "",
          text: `is looking for ${r.needed} ${r.sport} player${r.needed === 1 ? "" : "s"} at ${r.venue || r.area || "the turf"}`,
          href: "/games",
          createdAt: r.created_at,
        });
      });
  } catch {
    // degrade gracefully; return whatever was collected
  }

  return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 40);
}