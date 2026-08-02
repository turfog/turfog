"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Card from "@/components/ui/Card";
import { useLocation } from "@/context/LocationContext";
import { useDiscovery } from "@/context/DiscoveryContext";
import type { SportId } from "@/types";
import {
  FootballIcon,
  CricketIcon,
  PickleballIcon,
  PadelIcon,
  BadmintonIcon,
  ZapIcon,
  ChevronRightIcon,
} from "@/components/SvgIcons";

const sportIcon: Record<SportId, React.ReactNode> = {
  football: <FootballIcon size={12} />,
  "box-cricket": <CricketIcon size={12} />,
  pickleball: <PickleballIcon size={12} />,
  padel: <PadelIcon size={12} />,
  badminton: <BadmintonIcon size={12} />,
};

const sportDots: Array<{ sport: SportId; angle: number; dist: number; color: string }> = [
  { sport: "football", angle: 30, dist: 38, color: "bg-primary-green" },
  { sport: "box-cricket", angle: 110, dist: 52, color: "bg-electric-blue" },
  { sport: "badminton", angle: 185, dist: 44, color: "bg-sunset-orange" },
  { sport: "padel", angle: 250, dist: 58, color: "bg-amber" },
  { sport: "pickleball", angle: 310, dist: 64, color: "bg-emerald" },
];

export default function RadarMini() {
  const { radius } = useLocation();
  const { requests, heartbeats } = useDiscovery();

  const activeSports = new Set<SportId>();
  heartbeats.forEach((p) => activeSports.add(p.sport));
  requests.forEach((r) => activeSports.add(r.sport));

  const available = heartbeats.length;
  const matches = requests.length;

  return (
    <Card padding="md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ZapIcon size={16} className="text-sunset-orange" />
          <h3 className="text-body-sm font-semibold text-neutral-900">Live radar</h3>
        </div>
        <span className="flex items-center gap-1 text-caption text-emerald font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse-soft" />
          Live
        </span>
      </div>

      <div className="relative flex items-center justify-center my-2">
        <div className="relative w-40 h-40">
          <div className="absolute inset-0 rounded-full border border-neutral-200" />
          <div className="absolute inset-4 rounded-full border border-neutral-100" />
          <div className="absolute inset-8 rounded-full border border-neutral-100" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <motion.span
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="block w-3 h-3 bg-electric-blue rounded-full shadow-glow-blue"
            />
          </div>
          {sportDots.map((d, i) => {
            const r = (d.angle * Math.PI) / 180;
            const x = 50 + d.dist * Math.cos(r) * 0.45;
            const y = 50 + d.dist * Math.sin(r) * 0.45;
            const active = activeSports.has(d.sport);
            return (
              <motion.span
                key={d.sport}
                initial={{ scale: 0 }}
                animate={{ scale: active ? 1 : 0.6 }}
                transition={{ delay: 0.2 + i * 0.08, type: "spring" }}
                className={cn(
                  "absolute w-5 h-5 rounded-full flex items-center justify-center text-white transition-opacity",
                  active ? d.color : "bg-neutral-200 text-neutral-400 opacity-50"
                )}
                style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
              >
                {sportIcon[d.sport]}
              </motion.span>
            );
          })}
        </div>
      </div>

      <p className="text-center text-caption text-neutral-500 mb-2">
        <span className="font-semibold text-neutral-800">{available} players</span> and{" "}
        <span className="font-semibold text-neutral-800">{matches} matches</span> within {radius} km
      </p>
      <Link href="/games" className="flex items-center justify-center gap-1 text-body-xs text-electric-blue font-medium hover:underline">
        Open full radar
        <ChevronRightIcon size={13} />
      </Link>
    </Card>
  );
}