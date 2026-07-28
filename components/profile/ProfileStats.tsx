"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProfileStatsProps {
  totalMatches: number;
  totalWins: number;
  totalMvps: number;
  winRate: number;
}

interface StatItem {
  label: string;
  value: number;
  suffix?: string;
  color: string;
  bgColor: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 25 },
  },
};

export default function ProfileStats({
  totalMatches,
  totalWins,
  totalMvps,
  winRate,
}: ProfileStatsProps) {
  const stats: StatItem[] = [
    {
      label: "Matches",
      value: totalMatches,
      color: "text-electric-blue",
      bgColor: "bg-electric-blue/10",
    },
    {
      label: "Wins",
      value: totalWins,
      color: "text-emerald",
      bgColor: "bg-emerald/10",
    },
    {
      label: "MVPs",
      value: totalMvps,
      color: "text-amber",
      bgColor: "bg-amber/10",
    },
    {
      label: "Win rate",
      value: winRate,
      suffix: "%",
      color: "text-primary-green",
      bgColor: "bg-primary-green/10",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-4 gap-2"
    >
      {stats.map((stat) => (
        <motion.div
          key={stat.label}
          variants={itemVariants}
          whileHover={{ y: -2 }}
          className={cn(
            "rounded-xl p-3 text-center transition-colors",
            stat.bgColor
          )}
        >
          <p className={cn("text-display-xs font-bold", stat.color)}>
            {stat.value}
            {stat.suffix || ""}
          </p>
          <p className="text-caption text-neutral-500 mt-0.5">{stat.label}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}