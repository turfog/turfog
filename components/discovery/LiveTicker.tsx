"use client";

import { motion } from "framer-motion";
import { useDiscovery } from "@/context/DiscoveryContext";
import { RunIcon } from "@/components/SvgIcons";

function sportLabel(sport: string): string {
  if (!sport) return "a match";
  return sport.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function LiveTicker() {
  const { requests } = useDiscovery();

  const items = requests.slice(0, 8).map((r) => ({
    id: `r-${r.id}`,
    text: `${r.organizerName || "A player"} needs ${r.needed} more for ${sportLabel(r.sport)}${r.venue ? ` at ${r.venue}` : ""}`,
  }));

  if (items.length === 0) return null;

  return (
    <div className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden py-2.5">
      <div className="flex items-center">
        <div className="flex items-center gap-1.5 px-4 flex-shrink-0 border-r border-neutral-800">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral opacity-70" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-coral" />
          </span>
          <span className="text-caption font-bold text-white uppercase tracking-wider">Live</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <motion.div
            className="flex gap-10 whitespace-nowrap px-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          >
            {[...items, ...items].map((it, i) => (
              <span key={`${it.id}-${i}`} className="flex items-center gap-2 text-body-xs text-white/80">
                <RunIcon size={13} className="text-electric-blue flex-shrink-0" />
                {it.text}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}