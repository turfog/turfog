"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import {
  UsersIcon,
  CalendarIcon,
  MapPinIcon,
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

const communities = [
  {
    id: "c1",
    name: "Mumbai weekend warriors",
    sport: "football" as SportId,
    members: 248,
    matchesThisWeek: 6,
    city: "Mumbai",
    description: "The biggest 5v5 football community in Mumbai. Every Saturday and Sunday.",
    joined: true,
  },
  {
    id: "c2",
    name: "Bandra box cricket league",
    sport: "box-cricket" as SportId,
    members: 186,
    matchesThisWeek: 4,
    city: "Mumbai",
    description: "Night cricket under the lights. Tennis ball. Corporate and casual teams.",
    joined: false,
  },
  {
    id: "c3",
    name: "Powai pickleball club",
    sport: "pickleball" as SportId,
    members: 94,
    matchesThisWeek: 3,
    city: "Mumbai",
    description: "Beginner friendly. Weekly ladder. Coaching sessions every Wednesday.",
    joined: false,
  },
  {
    id: "c4",
    name: "South Mumbai padel society",
    sport: "padel" as SportId,
    members: 72,
    matchesThisWeek: 2,
    city: "Mumbai",
    description: "Premium glass court doubles. Weekend tournaments. All skill levels.",
    joined: false,
  },
  {
    id: "c5",
    name: "Andheri badminton hub",
    sport: "badminton" as SportId,
    members: 156,
    matchesThisWeek: 5,
    city: "Mumbai",
    description: "Singles, doubles, mixed doubles. Morning and evening batches. Coaching available.",
    joined: true,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
};

export default function CommunitiesClient() {
  const [filter, setFilter] = useState<SportId | "all">("all");

  const filtered =
    filter === "all"
      ? communities
      : communities.filter((c) => c.sport === filter);

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
            <Button size="sm" variant="primary">
              <PlusIcon size={15} />
              Create community
            </Button>
          </div>
          <h1 className="text-display-sm font-bold text-neutral-900 font-display">
            Communities
          </h1>
          <p className="text-body-sm text-neutral-500">
            Join local sports communities and never play alone
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
                "px-4 py-2 rounded-full text-body-xs font-medium whitespace-nowrap border transition-all",
                filter === sportId
                  ? "bg-primary-green text-white border-primary-green"
                  : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"
              )}
            >
              {sportId === "all" ? "All" : sportId === "box-cricket" ? "Box cricket" : sportId.charAt(0).toUpperCase() + sportId.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Community Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-3xl mx-auto px-6 pb-12 space-y-4"
      >
        {filtered.map((community) => (
          <motion.div key={community.id} variants={itemVariants}>
            <Card padding="md" className="hover:border-primary-green/30 group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-green/10 rounded-xl flex items-center justify-center flex-shrink-0 text-primary-green">
                  {sportIconMap[community.sport]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-body-sm font-semibold text-neutral-900">
                      {community.name}
                    </h3>
                    {community.joined && (
                      <Badge variant="success" size="sm" animated={false}>
                        Joined
                      </Badge>
                    )}
                  </div>
                  <p className="text-body-xs text-neutral-500 mb-2 line-clamp-2">
                    {community.description}
                  </p>
                  <div className="flex items-center gap-4 text-body-xs text-neutral-400">
                    <span className="flex items-center gap-1">
                      <UsersIcon size={12} />
                      {community.members} members
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarIcon size={12} />
                      {community.matchesThisWeek} this week
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPinIcon size={12} />
                      {community.city}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Button
                    size="sm"
                    variant={community.joined ? "outline" : "primary"}
                  >
                    {community.joined ? "View" : "Join"}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
