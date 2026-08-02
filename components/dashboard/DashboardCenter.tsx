"use client";

import React from "react";
import { motion } from "framer-motion";
import LocationBar from "@/components/discovery/LocationBar";
import PresenceSelector from "@/components/discovery/PresenceSelector";
import NearbyPlayers from "@/components/discovery/NearbyPlayers";
import IWantToPlay from "@/components/heartbeat/IWantToPlay";
import LookingForPlayer from "@/components/heartbeat/LookingForPlayer";
import SportsFeed from "@/components/feed/SportsFeed";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
};

export default function DashboardCenter() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-2xl mx-auto space-y-5"
    >
      {/* Live Location Discovery */}
      <motion.div variants={itemVariants}>
        <LocationBar />
      </motion.div>

      {/* Presence Status */}
      <motion.div variants={itemVariants}>
        <PresenceSelector />
      </motion.div>

      {/* Heartbeat Engine */}
      <motion.div variants={itemVariants}>
        <h1 className="text-display-sm font-bold text-neutral-900 font-display mb-1">
          What&apos;s your play today?
        </h1>
        <p className="text-body-sm text-neutral-500 mb-4">
          Go live and let nearby players find you
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <IWantToPlay />
        <LookingForPlayer />
      </motion.div>

      {/* Live Nearby Discovery */}
      <motion.div variants={itemVariants}>
        <NearbyPlayers />
      </motion.div>

      {/* Sports Feed */}
      <motion.div variants={itemVariants}>
        <SportsFeed />
      </motion.div>
    </motion.div>
  );
}
