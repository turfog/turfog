import { createClient } from "@/lib/supabase";

export interface NotificationItem {
  id: string;
  type: string;
  actorName: string;
  actorUsername: string;
  actorAvatar: string;
  text: string;
  href: string;
  createdAt: string;
  read: boolean;
}

type Row = Record<string, unknown>;
const str = (v: unknown, d = ""): string => (v == null ? d : String(v));

export async function fetchNotifications(): Promise<NotificationItem[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from("notifications")
    .select("*")
    .eq("recipient_id", user.id)
    .order("created_at", { ascending: false })
    .limit(40);
  return ((data ?? []) as Row[]).map((n) => ({
    id: str(n.id),
    type: str(n.type),
    actorName: str(n.actor_name, "Someone"),
    actorUsername: str(n.actor_username),
    actorAvatar: str(n.actor_avatar),
    text: str(n.text),
    href: str(n.href, "/"),
    createdAt: str(n.created_at),
    read: n.read === true,
  }));
}

export async function fetchUnreadCount(): Promise<number> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;
  const { count } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("recipient_id", user.id)
    .eq("read", false);
  return count ?? 0;
}

export async function markNotificationsRead(): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase
    .from("notifications")
    .update({ read: true })
    .eq("recipient_id", user.id)
    .eq("read", false);
}