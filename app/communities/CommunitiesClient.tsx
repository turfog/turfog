"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SPORTS } from "@/lib/constants";
import type { SportId } from "@/types/heartbeat";
import {
  UsersIcon,
  MapPinIcon,
  SearchIcon,
  PlusIcon,
  ChevronRightIcon,
  FootballIcon,
  CricketIcon,
  BasketballIcon,
  BadmintonIcon,
  RunIcon,
} from "@/components/SvgIcons";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";

interface Community {
  id: string;
  name: string;
  sport: SportId;
  memberCount: number;
  city: string;
  description: string;
  imageUrl: string;
  isJoined: boolean;
  activeMatches: number;
}

const mockCommunities: Community[] = [
  {
    id: "1",
    name: "Mumbai weekend warriors",
    sport: "football",
    memberCount: 234,
    city: "Mumbai",
    description: "Regular weekend football matches across Mumbai. All skill levels welcome.",
    imageUrl: "",
    isJoined: true,
    activeMatches: 3,
  },
  {
    id: "2",
    name: "Cricket premier league",
    sport: "cricket",
    memberCount: 189,
    city: "Mumbai",
    description: "Organized T20 and one-day matches every weekend at Shivaji Park.",
    imageUrl: "",
    isJoined: false,
    activeMatches: 5,
  },
  {
    id: "3",
    name: "Basketball dunk squad",
    sport: "basketball",
    memberCount: 87,
    city: "Mumbai",
    description: "3v3 and 5v5 basketball games at Juhu and Bandra courts.",
    imageUrl: "",
    isJoined: false,
    activeMatches: 2,
  },
  {
    id: "4",
    name: "Badminton club Powai",
    sport: "badminton",
    memberCount: 56,
    city: "Mumbai",
    description: "Doubles and singles badminton matches at Powai sports complex.",
    imageUrl: "",
    isJoined: true,
    activeMatches: 1,
  },
  {
    id: "5",
    name: "Tennis enthusiasts Mumbai",
    sport: "tennis",
    memberCount: 42,
    city: "Mumbai",
    description: "Tennis partners and matches for all levels in western suburbs.",
    imageUrl: "",
    isJoined: false,
    activeMatches: 0,
  },
  {
    id: "6",
    name: "Volleyball beach club",
    sport: "volleyball",
    memberCount: 34,
    city: "Mumbai",
    description: "Beach volleyball at Juhu every Saturday morning.",
    imageUrl: "",
    isJoined: false,
    activeMatches: 1,
  },
];

const sportIcons: Record<SportId, React.ReactNode> = {
  football: <FootballIcon size={22} />,
  cricket: <CricketIcon size={22} />,
  basketball: <BasketballIcon size={22} />,
  badminton: <BadmintonIcon size={22} />,
  tennis: <RunIcon size={22} />,
  volleyball: <RunIcon size={22} />,
  "table-tennis": <RunIcon size={22} />,
  hockey: <RunIcon size={22} />,
};

const sportColors: Record<SportId, string> = {
  football: "bg-primary-green/10 text-primary-green",
  cricket: "bg-electric-blue/10 text-electric-blue",
  basketball: "bg-sunset-orange/10 text-sunset-orange",
  badminton: "bg-emerald/10 text-emerald",
  tennis: "bg-amber/10 text-amber",
  volleyball: "bg-coral/10 text-coral",
  "table-tennis": "bg-neutral-100 text-neutral-500",
  hockey: "bg-neutral-100 text-neutral-700",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
};

export default function CommunitiesClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [communities, setCommunities] = useState(mockCommunities);
  const [activeFilter, setActiveFilter] = useState<SportId | "all">("all");

  const filteredCommunities = communities.filter((community) => {
    const matchesSearch =
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "all" || community.sport === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handleJoinToggle = (id: string) => {
    setCommunities((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              isJoined: !c.isJoined,
              memberCount: c.isJoined ? c.memberCount - 1 : c.memberCount + 1,
            }
          : c
      )
    );
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-4 space-y-4">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-display-xs font-bold text-neutral-900">Communities</h1>
          <p className="text-body-sm text-neutral-500 mt-1">Find your sports tribe</p>
        </div>
        <Link href="/communities/create">
          <Button size="sm" leftIcon={<PlusIcon size={16} />}>
            Create
          </Button>
        </Link>
      </motion.div>

      {/* Search */}
      <motion.div variants={itemVariants}>
        <Input
          type="text"
          placeholder="Search communities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<SearchIcon size={18} />}
        />
      </motion.div>

      {/* Sport Filters */}
      <motion.div variants={itemVariants} className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveFilter("all")}
          className={cn(
            "px-3.5 py-2 rounded-full text-body-xs font-medium whitespace-nowrap transition-all border",
            activeFilter === "all"
              ? "bg-neutral-900 text-white border-neutral-900"
              : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"
          )}
        >
          All sports
        </button>
        {SPORTS.slice(0, 6).map((sport) => (
          <button
            key={sport.id}
            onClick={() => setActiveFilter(sport.id)}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-2 rounded-full text-body-xs font-medium whitespace-nowrap transition-all border",
              activeFilter === sport.id
                ? "bg-primary-green text-white border-primary-green"
                : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"
            )}
          >
            {sportIcons[sport.id]}
            {sport.name}
          </button>
        ))}
      </motion.div>

      {/* Communities List */}
      <motion.div variants={itemVariants} className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredCommunities.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <UsersIcon size={40} className="text-neutral-300 mx-auto mb-3" />
              <p className="text-body-md text-neutral-500">No communities found</p>
              <p className="text-body-sm text-neutral-400">Try a different search or create one</p>
            </motion.div>
          ) : (
            filteredCommunities.map((community) => (
              <motion.div
                key={community.id}
                variants={itemVariants}
                layout
                exit={{ opacity: 0, x: -20 }}
              >
                <Link href={`/communities/${community.id}`}>
                  <Card padding="md" className="hover:border-primary-green/20 group">
                    <div className="flex items-start gap-3">
                      {/* Community Icon */}
                      <div
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                          sportColors[community.sport]
                        )}
                      >
                        {sportIcons[community.sport]}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-body-sm font-semibold text-neutral-900 truncate">
                            {community.name}
                          </h3>
                          {community.activeMatches > 0 && (
                            <Badge variant="success" size="sm" animated>
                              {community.activeMatches} active
                            </Badge>
                          )}
                        </div>
                        <p className="text-body-xs text-neutral-500 mb-2 line-clamp-2">
                          {community.description}
                        </p>
                        <div className="flex items-center gap-3 text-body-xs text-neutral-400">
                          <span className="flex items-center gap-1">
                            <UsersIcon size={12} />
                            {community.memberCount} members
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPinIcon size={12} />
                            {community.city}
                          </span>
                        </div>
                      </div>

                      {/* Join Button */}
                      <motion.button
                        whileTap={{ scale: 0.94 }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleJoinToggle(community.id);
                        }}
                        className={cn(
                          "px-4 py-2 rounded-lg text-body-xs font-semibold transition-all flex-shrink-0",
                          community.isJoined
                            ? "bg-primary-green/10 text-primary-green hover:bg-primary-green/20"
                            : "bg-primary-green text-white hover:bg-primary-green-hover"
                        )}
                      >
                        {community.isJoined ? "Joined" : "Join"}
                      </motion.button>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}