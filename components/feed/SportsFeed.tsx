"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, timeAgo } from "@/lib/utils";
import type { FeedItem, SportId } from "@/types";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import {
  RunIcon,
  UsersIcon,
  MapPinIcon,
  CheckCircleIcon,
  FootballIcon,
  CricketIcon,
  PickleballIcon,
  PadelIcon,
  BadmintonIcon,
  TrophyIcon,
} from "@/components/SvgIcons";

// ----- Mock Feed Data -----

const mockFeedItems: FeedItem[] = [
  {
    id: "1",
    type: "heartbeat",
    createdAt: new Date(Date.now() - 3 * 60000).toISOString(),
    data: {
      kind: "heartbeat",
      heartbeatType: "i-want-to-play",
      userId: "user1",
      userName: "Rahul Sharma",
      userAvatar: "",
      sport: "football",
      skillLevel: "intermediate",
      location: "Andheri west, Mumbai",
      note: "Ready for a 5v5 match this evening. Available after 6 PM.",
    },
  },
  {
    id: "2",
    type: "heartbeat",
    createdAt: new Date(Date.now() - 8 * 60000).toISOString(),
    data: {
      kind: "heartbeat",
      heartbeatType: "looking-for-player",
      userId: "user2",
      userName: "Mumbai Strikers",
      userAvatar: "",
      sport: "box-cricket",
      skillLevel: "advanced",
      location: "Bandra, Mumbai",
      note: "Need 2 players for a night match tomorrow at 9 PM. Proper gear required.",
    },
  },
  {
    id: "3",
    type: "match-result",
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
    data: {
      kind: "match-result",
      matchId: "match1",
      sport: "football",
      teamA: "Andheri United",
      teamB: "Bandra FC",
      scoreA: 3,
      scoreB: 2,
      mvpName: "Rahul Sharma",
      mvpId: "user1",
    },
  },
  {
    id: "4",
    type: "achievement",
    createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
    data: {
      kind: "achievement",
      userId: "user3",
      userName: "Priya Patel",
      achievementTitle: "Match streak: 10",
      achievementDescription: "Completed 10 consecutive matches without canceling",
      xpEarned: 150,
    },
  },
  {
    id: "5",
    type: "heartbeat",
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
    data: {
      kind: "heartbeat",
      heartbeatType: "i-want-to-play",
      userId: "user4",
      userName: "Arjun Nair",
      userAvatar: "",
      sport: "badminton",
      skillLevel: "beginner",
      location: "Powai, Mumbai",
      note: "Looking for a doubles partner. Free on weekends.",
    },
  },
];

// ----- Sport Filter Options -----

const filterOptions: Array<{ id: SportId | "all"; name: string; icon?: React.ReactNode }> = [
  { id: "all", name: "All" },
  { id: "football", name: "Football", icon: <FootballIcon size={15} /> },
  { id: "box-cricket", name: "Box cricket", icon: <CricketIcon size={15} /> },
  { id: "pickleball", name: "Pickleball", icon: <PickleballIcon size={15} /> },
  { id: "padel", name: "Padel", icon: <PadelIcon size={15} /> },
  { id: "badminton", name: "Badminton", icon: <BadmintonIcon size={15} /> },
];

// ----- Component -----

export default function SportsFeed() {
  const [activeFilter, setActiveFilter] = useState<SportId | "all">("all");

  const filteredItems =
    activeFilter === "all"
      ? mockFeedItems
      : mockFeedItems.filter((item) => {
          if (item.type === "heartbeat" && item.data.kind === "heartbeat") {
            return item.data.sport === activeFilter;
          }
          if (item.type === "match-result" && item.data.kind === "match-result") {
            return item.data.sport === activeFilter;
          }
          return false;
        });

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-body-lg font-semibold text-neutral-900 font-display">
          Sports feed
        </h2>
        <button className="text-body-sm text-electric-blue hover:text-electric-blue-hover font-medium transition-colors">
          See all
        </button>
      </div>

      {/* Sport Filters */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
        {filterOptions.map((filter) => (
          <motion.button
            key={filter.id}
            whileTap={{ scale: 0.94 }}
            onClick={() => setActiveFilter(filter.id)}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-2 rounded-full text-body-xs font-medium whitespace-nowrap transition-all duration-200 border",
              activeFilter === filter.id
                ? "bg-primary-green text-white border-primary-green shadow-sm"
                : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"
            )}
          >
            {filter.icon && (
              <span className={activeFilter === filter.id ? "text-white" : "text-neutral-400"}>
                {filter.icon}
              </span>
            )}
            {filter.name}
          </motion.button>
        ))}
      </div>

      {/* Feed Items */}
      <AnimatePresence mode="wait">
        {filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <RunIcon size={28} className="text-neutral-300" />
            </div>
            <p className="text-body-md text-neutral-500">
              No activity for this sport yet
            </p>
            <p className="text-body-sm text-neutral-400">
              Be the first to go live
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {filteredItems.map((item, index) => (
              <FeedItemCard key={item.id} item={item} delay={index * 0.05} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ----- Feed Item Card -----

function FeedItemCard({ item, delay }: { item: FeedItem; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3, ease: "easeOut" }}
    >
      {item.type === "heartbeat" && item.data.kind === "heartbeat" && (
        <HeartbeatCard data={item.data} ago={timeAgo(item.createdAt)} />
      )}
      {item.type === "match-result" && item.data.kind === "match-result" && (
        <MatchResultCard data={item.data} ago={timeAgo(item.createdAt)} />
      )}
      {item.type === "achievement" && item.data.kind === "achievement" && (
        <AchievementCard data={item.data} ago={timeAgo(item.createdAt)} />
      )}
    </motion.div>
  );
}

// ----- Heartbeat Card -----

function HeartbeatCard({
  data,
  ago,
}: {
  data: FeedItem["data"] & { kind: "heartbeat" };
  ago: string;
}) {
  const isIWantToPlay = data.heartbeatType === "i-want-to-play";

  return (
    <Card padding="md" className="hover:border-electric-blue/30 transition-all">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
            isIWantToPlay
              ? "bg-electric-blue/10 text-electric-blue"
              : "bg-sunset-orange/10 text-sunset-orange"
          )}
        >
          {isIWantToPlay ? <RunIcon size={20} /> : <UsersIcon size={20} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Avatar src={data.userAvatar} alt={data.userName} size="xs" />
            <span className="text-body-sm font-semibold text-neutral-900">
              {data.userName}
            </span>
            <Badge
              variant={isIWantToPlay ? "info" : "warning"}
              size="sm"
              animated={false}
            >
              {isIWantToPlay ? "Want to play" : "Need player"}
            </Badge>
          </div>
          <p className="text-body-sm text-neutral-600 mb-2 line-clamp-2">
            {data.note}
          </p>
          <div className="flex items-center gap-3 text-body-xs text-neutral-400">
            <span className="flex items-center gap-1">
              <MapPinIcon size={12} />
              {data.location}
            </span>
            <span>{ago}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ----- Match Result Card -----

function MatchResultCard({
  data,
  ago,
}: {
  data: FeedItem["data"] & { kind: "match-result" };
  ago: string;
}) {
  return (
    <Card padding="md" className="hover:border-emerald/30 transition-all">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald/10 rounded-xl flex items-center justify-center flex-shrink-0">
          <FootballIcon size={20} className="text-emerald" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-body-sm font-semibold text-neutral-900">
              {data.teamA} vs {data.teamB}
            </span>
            <span className="text-body-lg font-bold text-neutral-900">
              {data.scoreA} - {data.scoreB}
            </span>
          </div>
          <div className="flex items-center gap-3 text-body-xs text-neutral-400">
            <span className="flex items-center gap-1">
              <CheckCircleIcon size={12} className="text-emerald" />
              MVP: {data.mvpName}
            </span>
            <span>{ago}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ----- Achievement Card -----

function AchievementCard({
  data,
  ago,
}: {
  data: FeedItem["data"] & { kind: "achievement" };
  ago: string;
}) {
  return (
    <Card padding="md" className="hover:border-amber/30 transition-all bg-gradient-to-r from-amber/5 to-transparent">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-amber/10 rounded-xl flex items-center justify-center flex-shrink-0">
          <TrophyIcon size={20} className="text-amber" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-body-sm font-semibold text-neutral-900">
              {data.userName}
            </span>
            <Badge variant="premium" size="sm" animated={false}>
              Achievement
            </Badge>
          </div>
          <p className="text-body-sm font-medium text-neutral-700 mb-0.5">
            {data.achievementTitle}
          </p>
          <div className="flex items-center gap-3 text-body-xs text-neutral-400">
            <span>{data.achievementDescription}</span>
            <span className="text-amber font-medium">+{data.xpEarned} XP</span>
            <span>{ago}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
