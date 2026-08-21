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
import { useSocial } from "@/context/SocialContext";
import type { Player } from "@/types";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 24 } },
};

function SectionLabel({ label, dot }: { label: string; dot?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 px-1">
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
        </span>
      )}
      <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">{label}</span>
      <div className="flex-1 h-px bg-gradient-to-r from-black/[0.06] to-transparent" />
    </div>
  );
}

export default function HomeCenter({ player }: { player: Player }) {
  const social = useSocial();
  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="max-w-2xl mx-auto space-y-6">
      {/* ── Go Live Section ── */}
      <motion.div variants={item} className="space-y-3">
        <SectionLabel label="Go live" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <IWantToPlay />
          <LookingForPlayer />
        </div>
      </motion.div>

      {/* ── Live Status Section ── */}
      <motion.div variants={item} className="space-y-3">
        <SectionLabel label="Live status" dot />
        <div className="space-y-3">
          <HeroHeader />
          <PresenceSelector />
          <LocationBar />
          <LiveTicker />
        </div>
      </motion.div>

      {/* ── Insights ── */}
      <motion.div variants={item} className="space-y-3">
        <SectionLabel label="Insights" />
        <InsightCards />
      </motion.div>

      {/* ── Players ── */}
      <motion.div variants={item} className="space-y-3">
        <SectionLabel label="Nearby players" dot />
        <PlayerShowcase />
        <div className="xl:hidden"><AvailablePlayers variant="scroller" /></div>
      </motion.div>

      {/* ── Share & Feed ── */}
      <motion.div variants={item} className="space-y-3">
        <SectionLabel label="Your feed" />
        <PostComposer player={player} onPosted={() => social.refresh()} />
      </motion.div>

      <motion.div variants={item}>
        <SocialFeed />
      </motion.div>
    </motion.div>
  );
}