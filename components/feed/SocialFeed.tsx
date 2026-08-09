"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSocial } from "@/context/SocialContext";
import PostCard from "@/components/feed/PostCard";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import { UsersIcon } from "@/components/SvgIcons";

const TABS = [
  { id: "for-you", label: "For you" },
  { id: "following", label: "Following" },
  { id: "media", label: "Media" },
] as const;

type Tab = (typeof TABS)[number]["id"];

function PostSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-card p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-2.5 w-1/4" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
      <Skeleton className="h-9 w-full rounded-xl" />
    </div>
  );
}

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
              "px-4 py-1.5 rounded-full text-body-xs font-medium border transition-all active:scale-[0.97]",
              tab === t.id
                ? "bg-neutral-900 text-white border-neutral-900 shadow-sm"
                : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {loading ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-card">
            <EmptyState
              icon={<UsersIcon size={24} />}
              title={
                tab === "following"
                  ? "No posts from players you follow"
                  : tab === "media"
                  ? "No media posts yet"
                  : "No posts yet"
              }
              description={
                tab === "following"
                  ? "Follow players to see their match moments here."
                  : tab === "media"
                  ? "Posts with photos and videos will show up here."
                  : "Be the first to share a moment with your community."
              }
            />
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