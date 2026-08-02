"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSocial } from "@/context/SocialContext";
import PostCard from "@/components/feed/PostCard";

const TABS = [
  { id: "for-you", label: "For you" },
  { id: "following", label: "Following" },
  { id: "media", label: "Media" },
] as const;

type Tab = (typeof TABS)[number]["id"];

export default function SocialFeed() {
  const { posts, loading, isFollowing } = useSocial();
  const [tab, setTab] = useState<Tab>("for-you");

  const filtered =
    tab === "following"
      ? posts.filter((p) => isFollowing(p.authorUsername))
      : tab === "media"
      ? posts.filter((p) => p.media)
      : posts;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-body-lg font-semibold text-neutral-900 font-display">Your feed</h2>
      </div>
      <div className="flex gap-1.5 mb-4">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "px-4 py-1.5 rounded-full text-body-xs font-medium border transition-all",
              tab === t.id ? "bg-neutral-900 text-white border-neutral-900" : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-300"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-body-sm text-neutral-400">Loading your feed...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-body-sm text-neutral-400">
            {tab === "following" ? "Follow players to see their posts here." : "No posts yet. Be the first to share a moment."}
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {filtered.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}