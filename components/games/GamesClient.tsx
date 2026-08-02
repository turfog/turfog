"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import {
  MapPinIcon,
  ClockIcon,
  UsersIcon,
  ArrowLeftIcon,
  PlusIcon,
  FootballIcon,
  CricketIcon,
  PickleballIcon,
  PadelIcon,
  BadmintonIcon,
} from "@/components/SvgIcons";
import type { SportId } from "@/types";

const sportIconMap: Record<SportId, React.ReactNode> = {
  football: <FootballIcon size={18} />,
  "box-cricket": <CricketIcon size={18} />,
  pickleball: <PickleballIcon size={18} />,
  padel: <PadelIcon size={18} />,
  badminton: <BadmintonIcon size={18} />,
};

const games = [
  {
    id: "g1",
    title: "Sunday 5v5 football",
    sport: "football" as SportId,
    venue: "Andheri sports complex",
    time: "Today, 6:00 PM",
    playersJoined: 8,
    playersNeeded: 2,
    skill: "Intermediate",
    host: "Rahul Sharma",
  },
  {
    id: "g2",
    title: "Night box cricket - tennis ball",
    sport: "box-cricket" as SportId,
    venue: "Bandra turf ground",
    time: "Today, 9:00 PM",
    playersJoined: 14,
    playersNeeded: 4,
    skill: "All levels",
    host: "Mumbai Strikers",
  },
  {
    id: "g3",
    title: "Pickleball doubles meetup",
    sport: "pickleball" as SportId,
    venue: "Powai sports club",
    time: "Tomorrow, 7:00 AM",
    playersJoined: 6,
    playersNeeded: 2,
    skill: "Beginner",
    host: "Priya Patel",
  },
  {
    id: "g4",
    title: "Padel doubles - glass court",
    sport: "padel" as SportId,
    venue: "South Mumbai padel arena",
    time: "Sat, 4:00 PM",
    playersJoined: 4,
    playersNeeded: 0,
    skill: "Advanced",
    host: "Arjun Nair",
  },
  {
    id: "g5",
    title: "Badminton singles challenge",
    sport: "badminton" as SportId,
    venue: "Andheri badminton hub",
    time: "Sun, 8:00 AM",
    playersJoined: 5,
    playersNeeded: 3,
    skill: "Intermediate",
    host: "Sneha Reddy",
  },
  {
    id: "g6",
    title: "Corporate football league - week 5",
    sport: "football" as SportId,
    venue: "Navi Mumbai sports complex",
    time: "Sun, 5:30 PM",
    playersJoined: 12,
    playersNeeded: 2,
    skill: "Advanced",
    host: "Vikram Singh",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
};

export default function GamesClient() {
  const [filter, setFilter] = useState<SportId | "all">("all");

  const filtered =
    filter === "all" ? games : games.filter((g) => g.sport === filter);

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-1">
            <Link href="/dashboard" className="flex items-center gap-2 text-body-xs text-neutral-400 hover:text-neutral-600 transition-colors">
              <ArrowLeftIcon size={14} />
              Dashboard
            </Link>
            <Link href="/dashboard">
              <Button size="sm" variant="primary">
                <PlusIcon size={15} />
                Create match
              </Button>
            </Link>
          </div>
          <h1 className="text-display-sm font-bold text-neutral-900 font-display">
            Games
          </h1>
          <p className="text-body-sm text-neutral-500">
            Upcoming matches near you. Join or create your own.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-3xl mx-auto px-6 py-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {(["all", "football", "box-cricket", "pickleball", "padel", "badminton"] as const).map((sportId) => (
            <button
              key={sportId}
              onClick={() => setFilter(sportId)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-full text-body-xs font-medium whitespace-nowrap border transition-all",
                filter === sportId
                  ? "bg-primary-green text-white border-primary-green"
                  : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"
              )}
            >
              {sportId !== "all" && sportIconMap[sportId]}
              {sportId === "all" ? "All" : sportId === "box-cricket" ? "Box cricket" : sportId.charAt(0).toUpperCase() + sportId.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Game Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-3xl mx-auto px-6 pb-12 space-y-4"
      >
        {filtered.map((game) => (
          <motion.div key={game.id} variants={itemVariants}>
            <Card padding="md" className="hover:border-primary-green/30 group">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 bg-primary-green/10 rounded-xl flex items-center justify-center flex-shrink-0 text-primary-green">
                  {sportIconMap[game.sport]}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-body-sm font-semibold text-neutral-900 mb-1">
                    {game.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-body-xs text-neutral-400 mb-2">
                    <span className="flex items-center gap-1">
                      <MapPinIcon size={12} />
                      {game.venue}
                    </span>
                    <span className="flex items-center gap-1">
                      <ClockIcon size={12} />
                      {game.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <UsersIcon size={12} />
                      {game.playersJoined} joined
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={game.playersNeeded > 0 ? "warning" : "success"}
                      size="sm"
                      animated={false}
                    >
                      {game.playersNeeded > 0
                        ? `Need ${game.playersNeeded} more`
                        : "Full squad"}
                    </Badge>
                    <span className="text-caption text-neutral-400 capitalize">
                      {game.skill}
                    </span>
                    <span className="text-caption text-neutral-400">
                      by {game.host}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {game.playersNeeded > 0 ? (
                    <Button size="sm" variant="primary">
                      Join
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
