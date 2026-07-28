"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SPORTS } from "@/lib/constants";
import type { TrendingItem } from "@/types/feed";
import type { SportId } from "@/types/heartbeat";
import {
  MapPinIcon,
  UsersIcon,
  ChevronRightIcon,
  FireIcon,
  RunIcon,
  FootballIcon,
  CricketIcon,
  BasketballIcon,
  BadmintonIcon,
} from "@/components/SvgIcons";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

// ----- Mock Data -----

const mockTrendingItems: TrendingItem[] = [
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
  {
    id: "3",
    title: "3v3 basketball showdown",
    subtitle: "Juhu beach court",
    sport: "basketball",
    participantCount: 12,
    city: "Mumbai",
    hotScore: 82,
  },
  {
    id: "4",
    title: "Badminton doubles meetup",
    subtitle: "Powai sports club",
    sport: "badminton",
    participantCount: 16,
    city: "Mumbai",
    hotScore: 76,
  },
  {
    id: "5",
    title: "Volleyball by the beach",
    subtitle: "Juhu beach",
    sport: "volleyball",
    participantCount: 10,
    city: "Mumbai",
    hotScore: 70,
  },
];

// ----- Sport Icons Map -----

const sportIcons: Record<SportId, React.ReactNode> = {
  football: <FootballIcon size={18} />,
  cricket: <CricketIcon size={18} />,
  basketball: <BasketballIcon size={18} />,
  badminton: <BadmintonIcon size={18} />,
  tennis: <RunIcon size={18} />,
  volleyball: <RunIcon size={18} />,
  "table-tennis": <RunIcon size={18} />,
  hockey: <RunIcon size={18} />,
};

const sportColors: Record<SportId, string> = {
  football: "text-primary-green bg-primary-green/10",
  cricket: "text-electric-blue bg-electric-blue/10",
  basketball: "text-sunset-orange bg-sunset-orange/10",
  badminton: "text-emerald bg-emerald/10",
  tennis: "text-amber bg-amber/10",
  volleyball: "text-coral bg-coral/10",
  "table-tennis": "text-neutral-500 bg-neutral-100",
  hockey: "text-neutral-700 bg-neutral-100",
};

// ----- Animation Variants -----

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
};

// ----- Component -----

export default function TrendingToday() {
  const [trendingItems] = useState<TrendingItem[]>(mockTrendingItems);

  const getHotScoreColor = (score: number): string => {
    if (score >= 90) return "text-coral";
    if (score >= 75) return "text-amber";
    return "text-emerald";
  };

  const getHotScoreBg = (score: number): string => {
    if (score >= 90) return "bg-coral/10";
    if (score >= 75) return "bg-amber/10";
    return "bg-emerald/10";
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FireIcon size={20} className="text-coral" />
          <h2 className="text-body-lg font-semibold text-neutral-900">
            Trending today
          </h2>
        </div>
        <Link
          href="/trending"
          className="text-body-sm text-electric-blue hover:text-electric-blue-hover font-medium transition-colors"
        >
          See all
        </Link>
      </div>

      {/* Trending List */}
      <div className="space-y-3">
        {trendingItems.map((item, index) => (
          <motion.div key={item.id} variants={itemVariants}>
            <Link href={`/matches/${item.id}`}>
              <Card
                padding="md"
                className="hover:border-coral/20 group overflow-hidden"
              >
                <div className="flex items-center gap-3">
                  {/* Rank */}
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                    {index === 0 ? (
                      <motion.span
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="text-body-lg font-bold text-coral"
                      >
                        {index + 1}
                      </motion.span>
                    ) : index === 1 ? (
                      <span className="text-body-lg font-bold text-amber">
                        {index + 1}
                      </span>
                    ) : index === 2 ? (
                      <span className="text-body-lg font-bold text-emerald">
                        {index + 1}
                      </span>
                    ) : (
                      <span className="text-body-md font-semibold text-neutral-400">
                        {index + 1}
                      </span>
                    )}
                  </div>

                  {/* Sport Icon */}
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                      sportColors[item.sport]
                    )}
                  >
                    {sportIcons[item.sport]}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-body-sm font-semibold text-neutral-900 truncate">
                        {item.title}
                      </h3>
                      <Badge
                        variant={
                          index === 0
                            ? "danger"
                            : index === 1
                            ? "warning"
                            : "default"
                        }
                        size="sm"
                        animated={index === 0}
                      >
                        {index === 0
                          ? "Hot"
                          : index === 1
                          ? "Trending"
                          : "Rising"}
                      </Badge>
                    </div>
                    <p className="text-body-xs text-neutral-500 mb-1.5">
                      {item.subtitle}
                    </p>
                    <div className="flex items-center gap-3 text-body-xs text-neutral-400">
                      <span className="flex items-center gap-1">
                        <MapPinIcon size={12} />
                        {item.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <UsersIcon size={12} />
                        {item.participantCount} players
                      </span>
                    </div>
                  </div>

                  {/* Hot Score */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        getHotScoreBg(item.hotScore)
                      )}
                    >
                      <span
                        className={cn(
                          "text-body-sm font-bold",
                          getHotScoreColor(item.hotScore)
                        )}
                      >
                        {item.hotScore}
                      </span>
                    </div>
                    <span className="text-caption text-neutral-400 mt-0.5">
                      Hot
                    </span>
                  </div>

                  {/* Arrow */}
                  <ChevronRightIcon
                    size={18}
                    className="text-neutral-300 group-hover:text-neutral-500 transition-colors flex-shrink-0"
                  />
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div variants={itemVariants} className="text-center pt-2">
        <Link
          href="/discover"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 rounded-full text-body-sm font-medium text-neutral-700 transition-colors"
        >
          <FireIcon size={16} className="text-coral" />
          Explore more trending
          <ChevronRightIcon size={16} />
        </Link>
      </motion.div>
    </motion.div>
  );
}