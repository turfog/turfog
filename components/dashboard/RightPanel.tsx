"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { TrendingItem } from "@/types/feed";
import {
  MapPinIcon,
  UsersIcon,
  RunIcon,
} from "@/components/SvgIcons";
import Badge from "@/components/ui/Badge";

interface RightPanelProps {
  className?: string;
}

interface LiveOpportunity {
  id: string;
  type: "i-want-to-play" | "looking-for-player";
  playerName: string;
  playerPhoto: string;
  playerUsername: string;
  sport: string;
  skillLevel: string;
  location: string;
  timeAgo: string;
  note: string;
}

const mockOpportunities: LiveOpportunity[] = [
  {
    id: "1",
    type: "i-want-to-play",
    playerName: "Rahul Sharma",
    playerPhoto: "",
    playerUsername: "rahul_s",
    sport: "football",
    skillLevel: "intermediate",
    location: "Andheri West, Mumbai",
    timeAgo: "2 minutes ago",
    note: "Ready for a 5-a-side match this evening. Available after 6 PM.",
  },
  {
    id: "2",
    type: "looking-for-player",
    playerName: "Mumbai Strikers",
    playerPhoto: "",
    playerUsername: "mumbai_strikers",
    sport: "cricket",
    skillLevel: "advanced",
    location: "Bandra, Mumbai",
    timeAgo: "5 minutes ago",
    note: "Need 2 players for a T20 match tomorrow morning at 7 AM.",
  },
  {
    id: "3",
    type: "i-want-to-play",
    playerName: "Priya Patel",
    playerPhoto: "",
    playerUsername: "priya_p",
    sport: "badminton",
    skillLevel: "beginner",
    location: "Powai, Mumbai",
    timeAgo: "8 minutes ago",
    note: "Looking for a doubles partner for regular weekend games.",
  },
  {
    id: "4",
    type: "looking-for-player",
    playerName: "Dunk Squad",
    playerPhoto: "",
    playerUsername: "dunk_squad",
    sport: "basketball",
    skillLevel: "intermediate",
    location: "Juhu, Mumbai",
    timeAgo: "12 minutes ago",
    note: "Need 1 more player for 3v3 tonight at 8 PM.",
  },
];

const mockTrending: TrendingItem[] = [
  {
    id: "1",
    title: "Sunday football league",
    subtitle: "Andheri sports complex",
    sport: "football",
    participantCount: 24,
    city: "Mumbai",
    hotScore: 95,
  },
  {
    id: "2",
    title: "Weekend cricket tournament",
    subtitle: "Shivaji park",
    sport: "cricket",
    participantCount: 18,
    city: "Mumbai",
    hotScore: 88,
  },
];

export default function RightPanel({ className }: RightPanelProps) {
  const [activeTab, setActiveTab] = useState<"opportunities" | "trending">("opportunities");

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="px-4 py-4 border-b border-neutral-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-body-sm font-semibold text-neutral-900">Live activity</h2>
          <span className="flex items-center gap-1.5 text-body-xs text-emerald font-medium">
            <span className="w-1.5 h-1.5 bg-emerald rounded-full animate-pulse-soft" />
            24 active now
          </span>
        </div>

        <div className="flex bg-neutral-100 rounded-lg p-0.5">
          <button
            onClick={() => setActiveTab("opportunities")}
            className={cn(
              "flex-1 py-1.5 text-body-xs font-medium rounded-md transition-all duration-200",
              activeTab === "opportunities" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
            )}
          >
            Opportunities
          </button>
          <button
            onClick={() => setActiveTab("trending")}
            className={cn(
              "flex-1 py-1.5 text-body-xs font-medium rounded-md transition-all duration-200",
              activeTab === "trending" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
            )}
          >
            Trending
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === "opportunities" ? (
            <motion.div key="opportunities" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} className="divide-y divide-neutral-100">
              {mockOpportunities.map((opportunity, index) => (
                <OpportunityCard key={opportunity.id} opportunity={opportunity} delay={index * 0.05} />
              ))}
            </motion.div>
          ) : (
            <motion.div key="trending" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} className="p-4 space-y-3">
              {mockTrending.map((item, index) => (
                <TrendingCard key={item.id} item={item} delay={index * 0.05} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function OpportunityCard({ opportunity, delay }: { opportunity: LiveOpportunity; delay: number }) {
  const isIWantToPlay = opportunity.type === "i-want-to-play";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3, ease: "easeOut" }}
      whileHover={{ backgroundColor: "rgba(0,0,0,0.01)" }}
      className="p-4 cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
          isIWantToPlay ? "bg-electric-blue/10 text-electric-blue" : "bg-sunset-orange/10 text-sunset-orange"
        )}>
          {isIWantToPlay ? <RunIcon size={20} /> : <UsersIcon size={20} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-body-sm font-semibold text-neutral-900 truncate">{opportunity.playerName}</span>
            <Badge variant={isIWantToPlay ? "info" : "warning"} size="sm" animated={false}>
              {isIWantToPlay ? "Want to play" : "Need player"}
            </Badge>
          </div>
          <p className="text-body-xs text-neutral-500 mb-1.5 line-clamp-2">{opportunity.note}</p>
          <div className="flex items-center gap-3 text-body-xs text-neutral-400">
            <span className="flex items-center gap-1"><MapPinIcon size={12} />{opportunity.location}</span>
            <span>{opportunity.timeAgo}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TrendingCard({ item, delay }: { item: TrendingItem; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3, ease: "easeOut" }}
      className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer"
    >
      <div className="w-10 h-10 bg-coral/10 rounded-xl flex items-center justify-center flex-shrink-0">
        <FireIcon size={20} className="text-coral" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-body-sm font-semibold text-neutral-900 truncate">{item.title}</p>
        <p className="text-body-xs text-neutral-500">{item.subtitle} &middot; {item.participantCount} players</p>
      </div>
      <div className="text-body-xs font-semibold text-coral">{item.hotScore}%</div>
    </motion.div>
  );
}

function FireIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}