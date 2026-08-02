"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import {
  MapPinIcon,
  ShieldIcon,
  RunIcon,
  UsersIcon,
  ChevronRightIcon,
  FootballIcon,
  CricketIcon,
  PickleballIcon,
  PadelIcon,
  BadmintonIcon,
} from "@/components/SvgIcons";
import type { SportId } from "@/types";

const sportIconMap: Record<SportId, React.ReactNode> = {
  football: <FootballIcon size={13} />,
  "box-cricket": <CricketIcon size={13} />,
  pickleball: <PickleballIcon size={13} />,
  padel: <PadelIcon size={13} />,
  badminton: <BadmintonIcon size={13} />,
};

type PresenceId = "available-now" | "in-30-min" | "today" | "weekend" | "offline";

const presenceConfig: Record<PresenceId, { label: string; dot: string; badge: "success" | "warning" | "info" | "default" }> = {
  "available-now": { label: "Available now", dot: "bg-emerald", badge: "success" },
  "in-30-min": { label: "In 30 min", dot: "bg-amber", badge: "warning" },
  today: { label: "Today", dot: "bg-electric-blue", badge: "info" },
  weekend: { label: "Weekend", dot: "bg-purple-500", badge: "default" },
  offline: { label: "Offline", dot: "bg-neutral-300", badge: "default" },
};

interface NearbyPlayer {
  id: string;
  name: string;
  username: string;
  distance: string;
  sports: SportId[];
  skill: string;
  presence: PresenceId;
  trustScore: number;
  matches: number;
  lastActive: string;
}

const mockPlayers: NearbyPlayer[] = [
  {
    id: "p1",
    name: "Rahul Sharma",
    username: "rahul_sharma",
    distance: "0.8 km",
    sports: ["football"],
    skill: "Intermediate",
    presence: "available-now",
    trustScore: 4.8,
    matches: 42,
    lastActive: "2 min ago",
  },
  {
    id: "p2",
    name: "Priya Patel",
    username: "priya_patel",
    distance: "1.2 km",
    sports: ["badminton", "pickleball"],
    skill: "Beginner",
    presence: "available-now",
    trustScore: 4.5,
    matches: 18,
    lastActive: "5 min ago",
  },
  {
    id: "p3",
    name: "Arjun Nair",
    username: "arjun_nair",
    distance: "2.1 km",
    sports: ["football", "box-cricket"],
    skill: "Advanced",
    presence: "in-30-min",
    trustScore: 4.9,
    matches: 67,
    lastActive: "12 min ago",
  },
  {
    id: "p4",
    name: "Sneha Reddy",
    username: "sneha_reddy",
    distance: "3.4 km",
    sports: ["padel", "badminton"],
    skill: "Intermediate",
    presence: "today",
    trustScore: 4.6,
    matches: 31,
    lastActive: "1 hr ago",
  },
  {
    id: "p5",
    name: "Vikram Singh",
    username: "vikram_singh",
    distance: "4.7 km",
    sports: ["box-cricket"],
    skill: "Advanced",
    presence: "weekend",
    trustScore: 4.7,
    matches: 55,
    lastActive: "3 hr ago",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
};

export default function NearbyPlayers() {
  const [players] = useState<NearbyPlayer[]>(mockPlayers);

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald opacity-60" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald" />
          </span>
          <h2 className="text-body-lg font-semibold text-neutral-900 font-display">
            Players near you
          </h2>
        </div>
        <span className="text-body-xs text-neutral-400">
          {players.length} within 5 km
        </span>
      </div>

      {/* Player Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        {players.map((player) => {
          const presence = presenceConfig[player.presence];
          return (
            <motion.div key={player.id} variants={itemVariants}>
              <Link href={`/${player.username}`}>
                <Card padding="md" className="hover:border-primary-green/30 group">
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <Avatar
                      alt={player.name}
                      size="md"
                      online={player.presence === "available-now"}
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-body-sm font-semibold text-neutral-900 truncate">
                          {player.name}
                        </h3>
                        <Badge variant={presence.badge} size="sm" animated={false}>
                          <span className={cn("w-1.5 h-1.5 rounded-full mr-1", presence.dot)} />
                          {presence.label}
                        </Badge>
                      </div>

                      <p className="text-caption text-neutral-400 mb-1.5">
                        @{player.username} / {player.lastActive}
                      </p>

                      {/* Sports + Skill */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-2">
                        {player.sports.map((sport) => (
                          <span
                            key={sport}
                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-100 rounded-md text-caption text-neutral-600 font-medium"
                          >
                            {sportIconMap[sport]}
                            {sport === "box-cricket" ? "Box cricket" : sport.charAt(0).toUpperCase() + sport.slice(1)}
                          </span>
                        ))}
                        <span className="px-2 py-0.5 bg-neutral-100 rounded-md text-caption text-neutral-600 font-medium capitalize">
                          {player.skill}
                        </span>
                      </div>

                      {/* Meta Row */}
                      <div className="flex items-center gap-3 text-caption text-neutral-400">
                        <span className="flex items-center gap-1">
                          <MapPinIcon size={11} />
                          {player.distance}
                        </span>
                        <span className="flex items-center gap-1">
                          <ShieldIcon size={11} />
                          {player.trustScore} trust
                        </span>
                        <span className="flex items-center gap-1">
                          <RunIcon size={11} />
                          {player.matches} matches
                        </span>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <ChevronRightIcon
                        size={16}
                        className="text-neutral-300 group-hover:text-neutral-500 transition-colors"
                      />
                      <div className="flex gap-1.5">
                        <motion.span
                          whileTap={{ scale: 0.9 }}
                          className="inline-flex items-center justify-center w-8 h-8 bg-primary-green/10 rounded-lg text-primary-green hover:bg-primary-green/20 transition-colors cursor-pointer"
                        >
                          <RunIcon size={15} />
                        </motion.span>
                        <motion.span
                          whileTap={{ scale: 0.9 }}
                          className="inline-flex items-center justify-center w-8 h-8 bg-electric-blue/10 rounded-lg text-electric-blue hover:bg-electric-blue/20 transition-colors cursor-pointer"
                        >
                          <UsersIcon size={15} />
                        </motion.span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
