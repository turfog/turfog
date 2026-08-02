import { createClient } from "@/lib/supabase";

export interface ConversationSummary {
  id: string;
  isGroup: boolean;
  title: string;
  otherUsername: string;
  otherName: string;
  otherAvatar: string;
  lastMessageText: string;
  lastMessageAt: string;
  lastSenderId: string | null;
  unread: number;
  memberCount: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string | null;
  senderName: string;
  senderAvatar: string;
  text: string;
  createdAt: string;
}

export interface Member {
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  lastReadAt: string;
}

interface ConvRow { id: string; is_group: boolean; title: string | null; created_at: string; }
interface MyMemberRow { conversation_id: string; unread_count: number | null; }
interface MemberRow { conversation_id: string; user_id: string; username: string | null; display_name: string | null; avatar: string | null; last_read_at: string | null; }
interface MsgRow { id: string; conversation_id: string; sender_id: string | null; sender_name: string | null; sender_avatar: string | null; text: string | null; created_at: string; }

export async function getMyId(): Promise<string | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export async function fetchMyConversations(): Promise<ConversationSummary[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data: myMembers } = await supabase.from("conversation_members").select("conversation_id, unread_count").eq("user_id", user.id);
  const mine = (myMembers ?? []) as MyMemberRow[];
  if (mine.length === 0) return [];
  const convIds = mine.map((m) => m.conversation_id);
  const unreadMap = new Map<string, number>(mine.map((m) => [m.conversation_id, Number(m.unread_count) || 0]));
  const [{ data: convs }, { data: members }, { data: msgs }] = await Promise.all([
    supabase.from("conversations").select("id, is_group, title, created_at").in("id", convIds),
    supabase.from("conversation_members").select("conversation_id, user_id, username, display_name, avatar, last_read_at").in("conversation_id", convIds),
    supabase.from("messages").select("id, conversation_id, sender_id, sender_name, sender_avatar, text, created_at").in("conversation_id", convIds).order("created_at", { ascending: false }).limit(200),
  ]);
  const convList = (convs ?? []) as ConvRow[];
  const memberList = (members ?? []) as MemberRow[];
  const msgList = (msgs ?? []) as MsgRow[];
  const lastByConv = new Map<string, MsgRow>();
  msgList.forEach((m) => { if (!lastByConv.has(m.conversation_id)) lastByConv.set(m.conversation_id, m); });
  const membersByConv = new Map<string, MemberRow[]>();
  memberList.forEach((mm) => { const arr = membersByConv.get(mm.conversation_id) ?? []; arr.push(mm); membersByConv.set(mm.conversation_id, arr); });
  return convList
    .map((c) => {
      const mems = membersByConv.get(c.id) ?? [];
      const other = mems.find((mm) => mm.user_id !== user.id);
      const last = lastByConv.get(c.id);
      return {
        id: c.id,
        isGroup: !!c.is_group,
        title: c.title || (c.is_group ? mems.map((m) => m.display_name || "Player").join(", ") : other?.display_name || "Player"),
        otherUsername: other?.username ?? "",
        otherName: other?.display_name ?? "Player",
        otherAvatar: other?.avatar ?? "",
        lastMessageText: last?.text ?? "",
        lastMessageAt: last?.created_at ?? c.created_at,
        lastSenderId: last?.sender_id ?? null,
        unread: unreadMap.get(c.id) ?? 0,
        memberCount: mems.length,
      };
    })
    .sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt));
}

export async function fetchMessages(conversationId: string): Promise<Message[]> {
  const supabase = createClient();
  const { data } = await supabase.from("messages").select("id, conversation_id, sender_id, sender_name, sender_avatar, text, created_at").eq("conversation_id", conversationId).order("created_at", { ascending: true }).limit(200);
  return ((data ?? []) as MsgRow[]).map((m) => ({
    id: m.id,
    conversationId: m.conversation_id,
    senderId: m.sender_id,
    senderName: m.sender_name ?? "Player",
    senderAvatar: m.sender_avatar ?? "",
    text: m.text ?? "",
    createdAt: m.created_at,
  }));
}

export async function fetchMembers(conversationId: string): Promise<Member[]> {
  const supabase = createClient();
  const { data } = await supabase.from("conversation_members").select("user_id, username, display_name, avatar, last_read_at").eq("conversation_id", conversationId);
  return ((data ?? []) as MemberRow[]).map((m) => ({
    userId: m.user_id,
    username: m.username ?? "",
    displayName: m.display_name ?? "Player",
    avatar: m.avatar ?? "",
    lastReadAt: m.last_read_at ?? "",
  }));
}

export async function sendMessage(conversationId: string, text: string): Promise<Message | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: player } = await supabase.from("players").select("full_name, username, profile_photo").eq("auth_id", user.id).maybeSingle();
  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      sender_name: player?.full_name ?? player?.username ?? "Player",
      sender_avatar: player?.profile_photo ?? "",
      text,
    })
    .select("id, conversation_id, sender_id, sender_name, sender_avatar, text, created_at")
    .single();
  if (error) return null;
  const m = data as MsgRow;
  return { id: m.id, conversationId: m.conversation_id, senderId: m.sender_id, senderName: m.sender_name ?? "Player", senderAvatar: m.sender_avatar ?? "", text: m.text ?? "", createdAt: m.created_at };
}

export async function getOrCreateDm(targetUserId: string): Promise<string | null> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_or_create_dm", { p_target_id: targetUserId });
  if (error) return null;
  return data ? String(data) : null;
}

export async function markConversationRead(conversationId: string): Promise<void> {
  const supabase = createClient();
  await supabase.rpc("mark_conversation_read", { p_conv: conversationId });
}