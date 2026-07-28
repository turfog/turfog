"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getLevelTitle } from "@/lib/utils";
import { formatXP } from "@/lib/utils";
import { MAX_RELIABILITY_SCORE } from "@/lib/constants";

interface ReputationBadgeProps {
  reliabilityScore: number;
  level: number;
  streak: number;
  xpPoints: number;
}

export default function ReputationBadge({
  reliabilityScore,
  level,
  streak,
  xpPoints,
}: ReputationBadgeProps) {
  const levelTitle = getLevelTitle(level);
  const reliabilityPercent = (reliabilityScore / MAX_RELIABILITY_SCORE) * 100;

  const getReliabilityColor = (score: number): string => {
    if (score >= 8) return "text-emerald";
    if (score >= 6) return "text-amber";
    return "text-coral";
  };

  const getReliabilityBg = (score: number): string => {
    if (score >= 8) return "bg-emerald";
    if (score >= 6) return "bg-amber";
    return "bg-coral";
  };

  const getReliabilityLabel = (score: number): string => {
    if (score >= 9) return "Exceptional";
    if (score >= 8) return "Excellent";
    if (score >= 6) return "Good";
    if (score >= 4) return "Fair";
    return "Low";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="bg-white rounded-xl border border-neutral-200 p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-body-sm font-semibold text-neutral-900">
          Reputation
        </h4>
        <span className="text-caption text-neutral-400">{levelTitle}</span>
      </div>

      {/* Reliability Score Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-body-xs text-neutral-500">Reliability</span>
          <span
            className={cn(
              "text-body-xs font-semibold",
              getReliabilityColor(reliabilityScore)
            )}
          >
            {reliabilityScore.toFixed(1)} / {MAX_RELIABILITY_SCORE}
          </span>
        </div>
        <div className="relative h-2 bg-neutral-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${reliabilityPercent}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className={cn(
              "h-full rounded-full transition-colors",
              getReliabilityBg(reliabilityScore)
            )}
          />
        </div>
        <p className="text-caption text-neutral-400 mt-1">
          {getReliabilityLabel(reliabilityScore)} reliability rating
        </p>
      </div>

      {/* Level and XP */}
      <div className="flex items-center gap-4 mb-3">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-body-xs text-neutral-500">
              Level {level} - {levelTitle}
            </span>
            <span className="text-body-xs font-semibold text-primary-green">
              {formatXP(xpPoints)} XP
            </span>
          </div>
          <div className="relative h-1.5 bg-neutral-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(level % 10) * 10}%` }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
              className="h-full bg-primary-green rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Streak */}
      {streak > 0 && (
        <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
          <motion.span
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
            className="text-lg"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sunset-orange">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
            </svg>
          </motion.span>
          <span className="text-body-xs text-neutral-600">
            <span className="font-semibold text-sunset-orange">{streak} match streak</span> - keep it going
          </span>
        </div>
      )}
    </motion.div>
  );
}