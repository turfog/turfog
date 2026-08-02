"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase";
import { fetchMyConversations, getMyId } from "@/lib/messaging";
import type { ConversationSummary } from "@/lib/messaging";

interface MessagingState {
  conversations: ConversationSummary[];
  totalUnread: number;
  myId: string | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

const DEFAULT: MessagingState = { conversations: [], totalUnread: 0, myId: null, loading: true, refresh: async () => {} };
const MessagingContext = createContext<MessagingState | null>(null);

export function MessagingProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [myId, setMyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const [convs, id] = await Promise.all([fetchMyConversations(), getMyId()]);
      setConversations(convs);
      setMyId(id);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const supabase = createClient();
    const channel = supabase
      .channel("messaging-inbox")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, () => { void refresh(); })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "conversation_members" }, () => { void refresh(); })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "conversation_members" }, () => { void refresh(); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [refresh]);

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0);

  return (
    <MessagingContext.Provider value={{ conversations, totalUnread, myId, loading, refresh }}>
      {children}
    </MessagingContext.Provider>
  );
}

export function useMessaging(): MessagingState {
  return useContext(MessagingContext) ?? DEFAULT;
}