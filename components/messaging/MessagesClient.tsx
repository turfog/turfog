"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn, timeAgo } from "@/lib/utils";
import { useMessaging } from "@/context/MessagingContext";
import { getOrCreateDm } from "@/lib/messaging";
import ConversationThread from "@/components/messaging/ConversationThread";
import Avatar from "@/components/ui/Avatar";
import Logo from "@/components/Logo";
import { MessageIcon } from "@/components/SvgIcons";

export default function MessagesClient() {
  const router = useRouter();
  const { conversations, loading, refresh, myId } = useMessaging();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const to = params.get("to");
    if (to) {
      setOpening(true);
      getOrCreateDm(to).then((convId) => {
        if (convId) setSelectedId(convId);
        setOpening(false);
        router.replace("/messages");
        void refresh();
      });
    }
  }, [router, refresh]);

  const selected = conversations.find((c) => c.id === selectedId) ?? null;

  return (
    <div className="h-screen flex flex-col bg-neutral-100">
      <header className="h-14 bg-white border-b border-neutral-200 flex items-center gap-3 px-4 flex-shrink-0">
        <Link href="/" aria-label="Turfog home"><Logo size={26} /></Link>
        <span className="text-body-md font-semibold text-neutral-900 font-display">Messages</span>
      </header>

      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-[300px_1fr]">
        {/* thread list */}
        <div className={cn("flex-col border-r border-neutral-100 bg-white min-h-0", selectedId ? "hidden md:flex" : "flex")}>
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
            {loading ? (
              <div className="p-4 space-y-3">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-neutral-100 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-1/2 rounded bg-neutral-100 animate-pulse" />
                      <div className="h-2.5 w-3/4 rounded bg-neutral-100 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-10 text-center">
                <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-3">
                  <MessageIcon size={22} className="text-neutral-300" />
                </div>
                <p className="text-body-sm text-neutral-500">No conversations yet</p>
                <p className="text-caption text-neutral-400 mt-1">Message a nearby player to start chatting.</p>
              </div>
            ) : (
              conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={cn("w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-neutral-50", selectedId === c.id ? "bg-primary-green/5" : "hover:bg-neutral-50")}
                >
                  <Avatar alt={c.title} src={c.otherAvatar} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-body-sm font-semibold text-neutral-900 truncate">{c.title}</span>
                      <span className="text-caption text-neutral-400 flex-shrink-0">{c.lastMessageAt ? timeAgo(c.lastMessageAt) : ""}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className={cn("text-caption truncate", c.unread > 0 ? "text-neutral-800 font-medium" : "text-neutral-400")}>
                        {c.lastSenderId === myId ? "You: " : ""}
                        {c.lastMessageText || "Say hello"}
                      </span>
                      {c.unread > 0 && (
                        <span className="flex-shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-primary-green text-white text-caption font-semibold flex items-center justify-center">{c.unread}</span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* thread */}
        <div className={cn("flex-col min-h-0 bg-white", selectedId ? "flex" : "hidden md:flex")}>
          {opening ? (
            <div className="flex-1 flex items-center justify-center text-body-sm text-neutral-400">Opening conversation...</div>
          ) : selected ? (
            <ConversationThread conversationId={selected.id} title={selected.title} onBack={() => setSelectedId(null)} onActivity={() => refresh()} />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
              <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
                <MessageIcon size={26} className="text-neutral-300" />
              </div>
              <p className="text-body-sm text-neutral-500">Select a conversation</p>
              <p className="text-caption text-neutral-400 mt-1">Your messages will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}