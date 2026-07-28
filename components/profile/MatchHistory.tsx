"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/utils";
import { SPORTS } from "@/lib/constants";
import type { SportId } from "@/types/heartbeat";
import {
  TrophyIcon,
  MedalIcon,
  FootballIcon,
  CricketIcon,
  BasketballIcon,
  BadmintonIcon,
  RunIcon,
} from "@/components/SvgIcons";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";

interface MatchHistoryProps {
  playerId: string;
}

interface MatchRecord {
  id: string;
  sport: SportId;
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  result: "win" | "loss" | "draw";
  isMvp: boolean;
  playedAt: string;
}

const mockMatches: MatchRecord[] = [
  {
    id: "m1",
    sport: "football",
    teamA: "Andheri United",
    teamB: "Bandra FC",
    scoreA: 3,
    scoreB: 2,
    result: "win",
    isMvp: true,
    playedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "m2",
    sport: "cricket",
    teamA: "Mumbai Strikers",
    teamB: "Delhi Capitals",
    scoreA: 120,
    scoreB: 118,
    result: "win",
    isMvp: false,
    playedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: "m3",
    sport: "basketball",
    teamA: "Dunk Squad",
    teamB: "Juhu Ballers",
    scoreA: 45,
    scoreB: 52,
    result: "loss",
    isMvp: false,
    playedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: "m4",
    sport: "badminton",
    teamA: "Priya & Rahul",
    teamB: "Arjun & Neha",
    scoreA: 21,
    scoreB: 18,
    result: "win",
    isMvp: true,
    playedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
];

const sportIcons: Record<SportId, React.ReactNode> = {
  football: <FootballIcon size={16} />,
  cricket: <CricketIcon size={16} />,
  basketball: <BasketballIcon size={16} />,
  badminton: <BadmintonIcon size={16} />,
  tennis: <RunIcon size={16} />,
  volleyball: <RunIcon size={16} />,
  "table-tennis": <RunIcon size={16} />,
  hockey: <RunIcon size={16} />,
};

export default function MatchHistory({ playerId }: MatchHistoryProps) {
  const [matches] = useState<MatchRecord[]>(mockMatches);
  const [showAll, setShowAll] = useState(false);

  const displayedMatches = showAll ? matches : matches.slice(0, 3);

  return (
    <div className="space-y-2">
      <AnimatePresence mode="popLayout">
        {displayedMatches.map((match, index) => (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-3 p-3 bg-white rounded-xl border border-neutral-200 hover:border-neutral-300 transition-colors"
          >
            {/* Sport Icon */}
            <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0">
              {sportIcons[match.sport]}
            </div>

            {/* Match Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-body-sm font-medium text-neutral-900 truncate">
                  {match.teamA} vs {match.teamB}
                </span>
                <Badge
                  variant={
                    match.result === "win"
                      ? "success"
                      : match.result === "loss"
                      ? "danger"
                      : "default"
                  }
                  size="sm"
                  animated={false}
                >
                  {match.result === "win" ? "Won" : match.result === "loss" ? "Lost" : "Draw"}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-body-xs text-neutral-500 mt-0.5">
                <span className="font-semibold text-neutral-700">
                  {match.scoreA} - {match.scoreB}
                </span>
                <span>{timeAgo(match.playedAt)}</span>
                {match.isMvp && (
                  <span className="flex items-center gap-1 text-amber font-medium">
                    <MedalIcon size={12} />
                    MVP
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {matches.length > 3 && (
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAll(!showAll)}
          className="w-full py-2.5 text-body-sm text-electric-blue hover:text-electric-blue-hover font-medium transition-colors text-center"
        >
          {showAll ? "Show less" : `See all ${matches.length} matches`}
        </motion.button>
      )}

      {matches.length === 0 && (
        <div className="text-center py-8">
          <TrophyIcon size={32} className="text-neutral-300 mx-auto mb-2" />
          <p className="text-body-sm text-neutral-500">No matches played yet</p>
        </div>
      )}
    </div>
  );
}

function MedalIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  );
}

function TrophyIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 6 9 6 9z" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5C17 4 18 9 18 9z" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
    </svg>
  );
}