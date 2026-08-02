"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import LocationBar from "@/components/discovery/LocationBar";
import PresenceSelector from "@/components/discovery/PresenceSelector";
import IWantToPlay from "@/components/heartbeat/IWantToPlay";
import LookingForPlayer from "@/components/heartbeat/LookingForPlayer";
import PostComposer from "@/components/feed/PostComposer";
import SocialFeed from "@/components/feed/SocialFeed";
import MobileNearbyScroller from "@/components/feed/MobileNearbyScroller";
import { MOCK_POSTS } from "@/lib/mock-feed";
import type { Player, SocialPost } from "@/types";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 26 } },
};

export default function HomeCenter({ player }: { player: Player }) {
  const [posts, setPosts] = useState<SocialPost[]>(MOCK_POSTS);
  const addPost = (p: SocialPost) => setPosts((prev) => [p, ...prev]);

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="max-w-2xl mx-auto space-y-5">
      <motion.div variants={item}>
        <LocationBar />
      </motion.div>
      <motion.div variants={item}>
        <PresenceSelector />
      </motion.div>
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <IWantToPlay />
        <LookingForPlayer />
      </motion.div>
      <motion.div variants={item}>
        <MobileNearbyScroller />
      </motion.div>
      <motion.div variants={item}>
        <PostComposer player={player} onPost={addPost} />
      </motion.div>
      <motion.div variants={item}>
        <SocialFeed posts={posts} />
      </motion.div>
    </motion.div>
  );
}