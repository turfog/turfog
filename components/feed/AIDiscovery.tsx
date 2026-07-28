"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SPORTS } from "@/lib/constants";
import type { AIDiscoveryRecommendation } from "@/types/feed";
import type { SportId } from "@/types/heartbeat";
import {
  RunIcon,
  UsersIcon,
  MapPinIcon,
  ChevronRightIcon,
  SparklesIcon,
  RefreshIcon,
} from "@/components/SvgIcons";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";

// ----- Mock Data -----

const mockRecommendations: AIDiscoveryRecommendation[] = [
  {
    id: "1",
    type: "match",
    title: "Sunday football at Andheri",
    description: "5-a-side match. 8 players confirmed. Need 2 more.",
    matchScore: 98,
    reason: "Matches your skill level and preferred time",
    sport: "football",
    actionUrl: "/matches/match-123",
    imageUrl: "",
  },
  {
    id: "2",
    type: "player",
    title: "Arjun Nair",
    description: "Advanced football player. 85% match rate. 4.8 reliability.",
    matchScore: 92,
    reason: "Plays at your usual venues",
    sport: "football",
    actionUrl: "/arjun_nair",
    imageUrl: "",
  },
  {
    id: "3",
    type: "community",
    title: "Mumbai weekend warriors",
    description: "200+ members. Regular football and cricket matches.",
    matchScore: 87,
    reason: "Popular in your area",
    sport: "football",
    actionUrl: "/communities/mumbai-weekend-warriors",
    imageUrl: "",
  },
  {
    id: "4",
    type: "match",
    title: "Cricket T20 at Shivaji park",
    description: "T20 match tomorrow morning. All skill levels welcome.",
    matchScore: 85,
    reason: "Near your location",
    sport: "cricket",
    actionUrl: "/matches/match-456",
    imageUrl: "",
  },
];

// ----- Animation Variants -----

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
};

// ----- Component -----

export default function AIDiscovery() {
  const [recommendations, setRecommendations] = useState(mockRecommendations);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const visibleRecommendations = recommendations.filter(
    (rec) => !dismissedIds.has(rec.id)
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate AI refresh
    setTimeout(() => {
      setRecommendations((prev) => {
        const shuffled = [...prev].sort(() => Math.random() - 0.5);
        return shuffled.map((rec) => ({
          ...rec,
          matchScore: Math.floor(Math.random() * 15) + 80,
        }));
      });
      setDismissedIds(new Set());
      setIsRefreshing(false);
    }, 1200);
  };

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => new Set([...prev, id]));
  };

  const getTypeIcon = (type: AIDiscoveryRecommendation["type"]) => {
    switch (type) {
      case "match":
        return <RunIcon size={18} className="text-sunset-orange" />;
      case "player":
        return <UsersIcon size={18} className="text-electric-blue" />;
      case "community":
        return <UsersIcon size={18} className="text-emerald" />;
    }
  };

  const getTypeBadge = (type: AIDiscoveryRecommendation["type"]) => {
    switch (type) {
      case "match":
        return { variant: "warning" as const, text: "Match" };
      case "player":
        return { variant: "info" as const, text: "Player" };
      case "community":
        return { variant: "success" as const, text: "Community" };
    }
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
          <SparklesIcon size={20} className="text-amber" />
          <h2 className="text-body-lg font-semibold text-neutral-900">
            Discover for you
          </h2>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 text-body-xs text-electric-blue hover:text-electric-blue-hover font-medium transition-colors disabled:opacity-50"
        >
          <motion.span
            animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
            transition={
              isRefreshing
                ? { repeat: Infinity, duration: 1, ease: "linear" }
                : { duration: 0.3 }
            }
          >
            <RefreshIcon size={14} />
          </motion.span>
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </motion.button>
      </div>

      {/* Recommendations */}
      <AnimatePresence mode="popLayout">
        {visibleRecommendations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 bg-white rounded-2xl border border-neutral-200"
          >
            <SparklesIcon size={32} className="text-neutral-300 mx-auto mb-2" />
            <p className="text-body-sm text-neutral-500">
              No more recommendations right now
            </p>
            <button
              onClick={handleRefresh}
              className="text-body-sm text-electric-blue font-medium mt-1 hover:underline"
            >
              Refresh for more
            </button>
          </motion.div>
        ) : (
          visibleRecommendations.map((rec, index) => (
            <motion.div
              key={rec.id}
              variants={itemVariants}
              layout
              exit={{ opacity: 0, x: 50, transition: { duration: 0.2 } }}
            >
              <Link href={rec.actionUrl}>
                <Card padding="md" className="hover:border-electric-blue/20 group">
                  <div className="flex items-start gap-3">
                    {/* Type Icon */}
                    <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-white transition-colors">
                      {getTypeIcon(rec.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-body-sm font-semibold text-neutral-900 truncate">
                          {rec.title}
                        </h3>
                        <Badge
                          variant={getTypeBadge(rec.type).variant}
                          size="sm"
                          animated={false}
                        >
                          {getTypeBadge(rec.type).text}
                        </Badge>
                      </div>

                      <p className="text-body-xs text-neutral-500 mb-2 line-clamp-2">
                        {rec.description}
                      </p>

                      {/* AI Reason */}
                      <div className="flex items-center gap-1.5 text-body-xs text-amber">
                        <SparklesIcon size={12} />
                        <span>{rec.reason}</span>
                      </div>
                    </div>

                    {/* Match Score */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="relative w-10 h-10">
                        <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                          <circle
                            cx="18"
                            cy="18"
                            r="15"
                            fill="none"
                            stroke="#E4E7EC"
                            strokeWidth="3"
                          />
                          <motion.circle
                            cx="18"
                            cy="18"
                            r="15"
                            fill="none"
                            stroke={
                              rec.matchScore >= 90
                                ? "#10B981"
                                : rec.matchScore >= 80
                                ? "#0078D4"
                                : "#FF9900"
                            }
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeDasharray={`${(rec.matchScore / 100) * 94.2} 94.2`}
                            initial={{ strokeDasharray: "0 94.2" }}
                            animate={{
                              strokeDasharray: `${(rec.matchScore / 100) * 94.2} 94.2`,
                            }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-caption font-bold text-neutral-700">
                          {rec.matchScore}
                        </span>
                      </div>
                      <span className="text-caption text-neutral-400 mt-0.5">
                        Match
                      </span>
                    </div>
                  </div>

                  {/* Dismiss Button */}
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDismiss(rec.id);
                      }}
                      className="text-body-xs text-neutral-400 hover:text-neutral-600 transition-colors"
                    >
                      Not interested
                    </button>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ----- Helper Icons -----

function SparklesIcon({
  size = 24,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z" />
      <path d="M19 15l.5 1.5L21 17l-1.5.5L19 19l-.5-1.5L17 17l1.5-.5z" />
      <path d="M5 3l.5 1.5L7 5l-1.5.5L5 7l-.5-1.5L3 5l1.5-.5z" />
    </svg>
  );
}

function RefreshIcon({
  size = 24,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}