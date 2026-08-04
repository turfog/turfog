"use client";

import { motion } from "framer-motion";
import { useDiscovery } from "@/context/DiscoveryContext";

export default function HeroHeader() {
  const { requests, heartbeats } = useDiscovery();
  const liveCount = requests.length + heartbeats.length;

  return (
    <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-900 to-emerald-900 border border-neutral-800 p-6 md:p-8">
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-primary-green/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-10 w-40 h-40 rounded-full bg-electric-blue/10 blur-3xl" />
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative">
        <div className="flex items-center gap-2 mb-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-green opacity-70" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-green" />
          </span>
          <span className="text-caption font-bold text-primary-green uppercase tracking-wider">Live near you</span>
        </div>
        <h1 className="text-display-sm md:text-display-md font-display font-bold text-white leading-tight">
          Find your match.
          <br />
          <span className="text-primary-green">Never cancel again.</span>
        </h1>
        <p className="text-body-sm text-white/60 mt-3">
          {liveCount > 0 ? `${liveCount} live opportunities around you right now` : "Go live and let nearby players find you"}
        </p>
      </motion.div>
    </section>
  );
}