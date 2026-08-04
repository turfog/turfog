"use client";

import { motion } from "framer-motion";
import HeroHeader from "@/components/discovery/HeroHeader";
import LiveTicker from "@/components/discovery/LiveTicker";
import LocationBar from "@/components/discovery/LocationBar";
import PresenceSelector from "@/components/discovery/PresenceSelector";
import AvailablePlayers from "@/components/discovery/AvailablePlayers";
import PlayerShowcase from "@/components/discovery/PlayerShowcase";
import IWantToPlay from "@/components/heartbeat/IWantToPlay";
import LookingForPlayer from "@/components/heartbeat/LookingForPlayer";
import PostComposer from "@/components/feed/PostComposer";
import SocialFeed from "@/components/feed/SocialFeed";
import InsightCards from "@/components/feed/InsightCards";
import LiveNow from "@/components/live/LiveNow";
import { useSocial } from "@/context/SocialContext";
import type { Player } from "@/types";

const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 26 } } };

export default function HomeCenter({ player }: { player: Player }) {
  const social = useSocial();

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="max-w-2xl mx-auto space-y-5">
      <motion.div variants={item}><HeroHeader />
      </motion.div>
      <motion.div variants={item}>
        <LiveTicker />
      </motion.div>
      <motion.div variants={item}>
        <LocationBar /></motion.div>
      <motion.div variants={item}><PresenceSelector /></motion.div>
      <motion.div variants={item}>
        <LiveNow />
      </motion.div>
      <motion.div variants={item}>
        <InsightCards />
      </motion.div>
      <motion.div variants={item}>
        <PlayerShowcase />
      </motion.div>
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <IWantToPlay />
        <LookingForPlayer />
      </motion.div>
      <motion.div variants={item} className="xl:hidden"><AvailablePlayers variant="scroller" /></motion.div>
      <motion.div variants={item}><PostComposer player={player} onPosted={() => social.refresh()} /></motion.div>
      <motion.div variants={item}><SocialFeed /></motion.div>
    </motion.div>
  );
}