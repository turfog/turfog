"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn, timeAgo } from "@/lib/utils";
import { createClient } from "@/lib/supabase";
import { fetchMessages, fetchMembers, sendMessage, markConversationRead } from "@/lib/messaging";
import type { Message, Member } from "@/lib/messaging";
import { useMessaging } from "@/context/MessagingContext";
import Avatar from "@/components/ui/Avatar";
import { SendIcon, CheckCircleIcon, ArrowLeftIcon } from "@/components/SvgIcons";

export default function ConversationThread({ conversationId, title, onBack, onActivity }: { conversationId: string; title: string; onBack: () => void; onActivity: () => void }) {
  const { myId } = useMessaging();
  const [messages, setMessages] = useState<Message[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const idsRef = useRef<Set<string>>(new Set());

  const load = useCallback(async () => {
    const [msgs, mems] = await Promise.all([fetchMessages(conversationId), fetchMembers(conversationId)]);
    idsRef.current = new Set(msgs.map((m) => m.id));
    setMessages(msgs);
    setMembers(mems);
  }, [conversationId]);

  useEffect(() => {
    load();
    markConversationRead(conversationId);
    const supabase = createClient();
    const channel = supabase
      .channel(`thread-msgs-${conversationId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${conversationId}` }, (payload) => {
        const p = payload.new as Record<string, unknown>;
        const id = String(p.id ?? "");
        if (!id || idsRef.current.has(id)) return;
        idsRef.current.add(id);
        const msg: Message = {
          id,
          conversationId: String(p.conversation_id ?? ""),
          senderId: p.sender_id ? String(p.sender_id) : null,
          senderName: String(p.sender_name ?? "Player"),
          senderAvatar: String(p.sender_avatar ?? ""),
          text: String(p.text ?? ""),
          createdAt: String(p.created_at ?? ""),
        };
        setMessages((prev) => [...prev, msg]);
        markConversationRead(conversationId);
        onActivity();
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "conversation_members", filter: `conversation_id=eq.${conversationId}` }, () => {
        void fetchMembers(conversationId).then(setMembers);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [conversationId, load, onActivity]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const other = members.find((m) => m.userId !== myId);
  const isGroup = members.length > 2;
  const last = messages[messages.length - 1];
  const seen = !isGroup && !!last && last.senderId === myId && !!other && !!other.lastReadAt && last.createdAt <= other.lastReadAt;

  const submit = async () => {
    const t = text.trim();
    if (!t || sending) return;
    setSending(true);
    setText("");
    const msg = await sendMessage(conversationId, t);
    if (msg && !idsRef.current.has(msg.id)) {
      idsRef.current.add(msg.id);
      setMessages((prev) => [...prev, msg]);
    }
    await markConversationRead(conversationId);
    setSending(false);
    onActivity();
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-100 flex-shrink-0">
        <button onClick={onBack} className="md:hidden w-8 h-8 rounded-lg hover:bg-neutral-100 flex items-center justify-center text-neutral-500">
          <ArrowLeftIcon size={18} />
        </button>
        <Avatar alt={title} src={other?.avatar ?? ""} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-body-sm font-semibold text-neutral-900 truncate">{title}</p>
          <p className="text-caption text-neutral-400">{isGroup ? `${members.length} members` : other?.username ? `@${other.username}` : ""}</p>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-4 py-4 space-y-3 bg-neutral-50/50">
        {messages.length === 0 ? (
          <p className="text-center text-caption text-neutral-400 py-10">No messages yet. Say hello.</p>
        ) : (
          messages.map((m) => {
            const mine = m.senderId === myId;
            return (
              <div key={m.id} className={cn("flex items-end gap-2", mine ? "justify-end" : "justify-start")}>
                {!mine && <Avatar alt={m.senderName} src={m.senderAvatar} size="xs" />}
                <div className={cn("max-w-[75%] rounded-2xl px-3.5 py-2", mine ? "bg-primary-green text-white rounded-br-md" : "bg-white border border-neutral-200 text-neutral-800 rounded-bl-md")}>
                  {isGroup && !mine && <p className="text-caption font-semibold text-electric-blue mb-0.5">{m.senderName}</p>}
                  <p className="text-body-sm whitespace-pre-line break-words">{m.text}</p>
                  <p className={cn("text-caption mt-1", mine ? "text-white/70" : "text-neutral-400")}>{timeAgo(m.createdAt)}</p>
                </div>
              </div>
            );
          })
        )}
        {seen && (
          <p className="text-caption text-electric-blue flex items-center justify-end gap-1">
            <CheckCircleIcon size={12} />
            Seen
          </p>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="px-4 py-3 border-t border-neutral-100 flex-shrink-0">
        <div className="flex items-center gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
            placeholder="Write a message..."
            className="flex-1 px-4 py-2.5 rounded-full border border-neutral-200 text-body-sm text-neutral-900 outline-none focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/20 placeholder:text-neutral-400"
          />
          <button onClick={submit} disabled={!text.trim() || sending} className="w-10 h-10 rounded-full bg-primary-green text-white flex items-center justify-center disabled:opacity-40 flex-shrink-0">
            <SendIcon size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}