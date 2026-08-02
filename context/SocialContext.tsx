"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  fetchFeed,
  fetchMyFollows,
  likePost as apiLike,
  commentPost as apiComment,
  sharePost as apiShare,
  toggleFollow as apiFollow,
} from "@/lib/social";
import { subscribeSocial } from "@/lib/discovery";
import type { SocialPost, PostComment } from "@/types";

interface SocialState {
  posts: SocialPost[];
  myUsername: string;
  loading: boolean;
  refresh: () => Promise<void>;
  isFollowing: (username: string) => boolean;
  like: (postId: string) => void;
  share: (postId: string) => void;
  comment: (postId: string, text: string) => Promise<PostComment | null>;
  follow: (targetId: string, targetUsername: string) => void;
}

const DEFAULT_STATE: SocialState = {
  posts: [],
  myUsername: "",
  loading: true,
  refresh: async () => {},
  isFollowing: () => false,
  like: () => {},
  share: () => {},
  comment: async () => null,
  follow: () => {},
};

const SocialContext = createContext<SocialState | null>(null);

export function SocialProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [following, setFollowing] = useState<Set<string>>(new Set());
  const [myUsername, setMyUsername] = useState("");
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const [feed, follows] = await Promise.all([fetchFeed(), fetchMyFollows()]);
      setPosts(feed);
      setFollowing(follows.following);
      setMyUsername(follows.myUsername);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const unsub = subscribeSocial(() => refresh());
    return unsub;
  }, [refresh]);

  const isFollowing = useCallback(
    (username: string) => following.has(username),
    [following]
  );

  const like = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, likedByMe: !p.likedByMe, likes: p.likes + (p.likedByMe ? -1 : 1) }
          : p
      )
    );
    void apiLike(postId).then((res) => {
      if (!res) return;
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, likedByMe: res.liked, likes: res.likes_count } : p))
      );
    });
  }, []);

  const share = useCallback((postId: string) => {
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, shares: p.shares + 1 } : p)));
    void apiShare(postId).then((count) => {
      if (count == null) return;
      setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, shares: count } : p)));
    });
  }, []);

  const comment = useCallback(async (postId: string, text: string): Promise<PostComment | null> => {
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, comments: [...p.comments, { id: "tmp", authorName: "", authorAvatar: "", text, createdAt: new Date().toISOString() } as PostComment] } : p)));
    const res = await apiComment(postId, text);
    if (!res) return null;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, comments: p.comments.filter((c) => c.id !== "tmp") }
          : p
      )
    );
    return { id: res.id, authorName: res.authorName, authorAvatar: res.authorAvatar, text: res.text, createdAt: res.createdAt };
  }, []);

  const follow = useCallback((targetId: string, targetUsername: string) => {
    setFollowing((prev) => {
      const next = new Set(prev);
      if (next.has(targetUsername)) next.delete(targetUsername);
      else next.add(targetUsername);
      return next;
    });
    void apiFollow(targetId).then((res) => {
      if (!res) return;
      setFollowing((prev) => {
        const next = new Set(prev);
        if (res.following) next.add(targetUsername);
        else next.delete(targetUsername);
        return next;
      });
    });
  }, []);

  return (
    <SocialContext.Provider value={{ posts, myUsername, loading, refresh, isFollowing, like, share, comment, follow }}>
      {children}
    </SocialContext.Provider>
  );
}

export function useSocial(): SocialState {
  return useContext(SocialContext) ?? DEFAULT_STATE;
}