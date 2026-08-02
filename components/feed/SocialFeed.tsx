"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { SocialPost } from "@/types";
import PostCard from "@/components/feed/PostCard";

const TABS = [
  { id: "for-you", label: "For you" },
  { id: "matches", label: "Matches" },
  { id: "moments", label: "Moments" },
] as const;

type Tab = (typeof TABS)[number]["id"];

export default function SocialFeed({ posts }: { posts: SocialPost[] }) {
  const [tab, setTab] = useState<Tab>("for-you");

  const filtered =
    tab === "matches"
      ? posts.filter((p) => p.heartbeat)
      : tab === "moments"
      ? posts.filter((p) => p.media)
      : posts;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-body-lg font-semibold text-neutral-900 font-display">
          Your feed
        </h2>
      </div>
      <div className="flex gap-1.5 mb-4">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "px-4 py-1.5 rounded-full text-body-xs font-medium border transition-all",
              tab === t.id
                ? "bg-neutral-900 text-white border-neutral-900"
                : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-300"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-body-sm text-neutral-400">
            No posts here yet. Be the first.
          </div>
        ) : (
          filtered.map((p) => <PostCard key={p.id} post={p} />)
        )}
      </div>
    </div>
  );
}