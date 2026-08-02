"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import {
  TrophyIcon,
  ShieldIcon,
  ZapIcon,
  RunIcon,
  CheckCircleIcon,
  SettingsIcon,
  ArrowLeftIcon,
  StarIcon,
} from "@/components/SvgIcons";

// ----- Mock Player Data -----

const player = {
  fullName: "Rahul Sharma",
  username: "rahul_sharma",
  bio: "Weekend football warrior. 5-a-side specialist. Never miss a Sunday match.",
  city: "Mumbai",
  level: 7,
  xp: 2380,
  xpToNext: 3000,
  streak: 10,
  totalMatches: 42,
  totalWins: 29,
  totalMvps: 8,
  reliability: 4.8,
  verificationStatus: "verified" as const,
};

const matchHistory = [
  { id: "m1", sport: "Football", result: "Won", score: "3-2", opponent: "Bandra FC", mvp: true, date: "2 days ago" },
  { id: "m2", sport: "Football", result: "Won", score: "5-1", opponent: "Juhu Strikers", mvp: false, date: "5 days ago" },
  { id: "m3", sport: "Box cricket", result: "Lost", score: "48-52", opponent: "Powai Warriors", mvp: false, date: "1 week ago" },
  { id: "m4", sport: "Football", result: "Won", score: "2-0", opponent: "Navi Mumbai FC", mvp: true, date: "1 week ago" },
  { id: "m5", sport: "Badminton", result: "Won", score: "21-18, 21-15", opponent: "Arjun Nair", mvp: false, date: "2 weeks ago" },
];

const tabs = ["Overview", "Matches", "Achievements"] as const;
type TabId = (typeof tabs)[number];

// ----- Component -----

export default function ProfileClient() {
  const [activeTab, setActiveTab] = useState<TabId>("Overview");
  const xpPercent = Math.round((player.xp / player.xpToNext) * 100);

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Cover + Header */}
      <div className="relative">
        {/* Cover Photo */}
        <div className="h-44 md:h-56 bg-gradient-to-r from-primary-green via-electric-blue to-primary-green" />

        {/* Back + Settings */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <Link href="/dashboard">
            <motion.span
              whileTap={{ scale: 0.9 }}
              className="inline-flex items-center gap-2 px-3 py-2 bg-black/20 backdrop-blur-md text-white text-body-xs font-medium rounded-xl hover:bg-black/30 transition-colors"
            >
              <ArrowLeftIcon size={16} />
              Dashboard
            </motion.span>
          </Link>
          <Link href="/settings">
            <motion.span
              whileTap={{ scale: 0.9 }}
              className="inline-flex items-center justify-center w-9 h-9 bg-black/20 backdrop-blur-md text-white rounded-xl hover:bg-black/30 transition-colors"
            >
              <SettingsIcon size={18} />
            </motion.span>
          </Link>
        </div>

        {/* Profile Info */}
        <div className="max-w-3xl mx-auto px-6">
          <div className="relative -mt-14 mb-4">
            <div className="flex items-end gap-4">
              <Avatar alt={player.fullName} size="xl" online className="border-4 border-white shadow-lg" />
              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-display-sm font-bold text-neutral-900 font-display">
                    {player.fullName}
                  </h1>
                  {player.verificationStatus === "verified" && (
                    <CheckCircleIcon size={18} className="text-electric-blue" />
                  )}
                </div>
                <p className="text-body-xs text-neutral-500">@{player.username}</p>
              </div>
            </div>
          </div>

          <p className="text-body-sm text-neutral-600 mb-3">{player.bio}</p>

          <div className="flex items-center gap-3 mb-6">
            <Badge variant="info" size="sm" animated={false}>
              Level {player.level}
            </Badge>
            <Badge variant="premium" size="sm" animated={false}>
              {player.streak} match streak
            </Badge>
            <span className="flex items-center gap-1 text-body-xs text-neutral-400">
              <ShieldIcon size={13} />
              {player.reliability} reliability
            </span>
          </div>

          {/* XP Progress */}
          <Card padding="sm" className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-body-xs font-medium text-neutral-700">
                Level {player.level}
              </span>
              <span className="text-body-xs text-neutral-400">
                {player.xp.toLocaleString()} / {player.xpToNext.toLocaleString()} XP
              </span>
            </div>
            <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-primary-green to-emerald rounded-full"
              />
            </div>
          </Card>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-3xl mx-auto px-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: RunIcon, value: player.totalMatches, label: "Matches", color: "text-electric-blue" },
            { icon: TrophyIcon, value: player.totalWins, label: "Wins", color: "text-emerald" },
            { icon: StarIcon, value: player.totalMvps, label: "MVPs", color: "text-amber" },
            { icon: ZapIcon, value: `${player.streak}`, label: "Streak", color: "text-sunset-orange" },
          ].map((stat) => (
            <Card key={stat.label} padding="md" className="text-center">
              <stat.icon size={20} className={cn(stat.color, "mx-auto mb-2")} />
              <p className="text-display-xs font-bold text-neutral-900">
                {stat.value}
              </p>
              <p className="text-caption text-neutral-400">{stat.label}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex gap-1 border-b border-neutral-200 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-5 py-3 text-body-sm font-medium border-b-2 transition-all",
                activeTab === tab
                  ? "border-primary-green text-primary-green"
                  : "border-transparent text-neutral-500 hover:text-neutral-700"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "Overview" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 pb-12"
          >
            <h2 className="text-body-lg font-semibold text-neutral-900 font-display">
              Recent activity
            </h2>
            {matchHistory.slice(0, 3).map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </motion.div>
        )}

        {/* Matches Tab */}
        {activeTab === "Matches" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 pb-12"
          >
            <h2 className="text-body-lg font-semibold text-neutral-900 font-display">
              Match history
            </h2>
            {matchHistory.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </motion.div>
        )}

        {/* Achievements Tab */}
        {activeTab === "Achievements" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 pb-12"
          >
            <h2 className="text-body-lg font-semibold text-neutral-900 font-display">
              Achievements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "Match streak: 10", desc: "10 consecutive matches without canceling", xp: 150, earned: true },
                { title: "MVP collector", desc: "Earned 5 MVP awards", xp: 200, earned: true },
                { title: "Community builder", desc: "Joined 3 communities", xp: 100, earned: true },
                { title: "Unstoppable", desc: "Win 50 matches", xp: 500, earned: false },
              ].map((achievement) => (
                <Card
                  key={achievement.title}
                  padding="md"
                  className={cn(
                    !achievement.earned && "opacity-50"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-amber/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <TrophyIcon size={20} className="text-amber" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-body-sm font-semibold text-neutral-900 mb-0.5">
                        {achievement.title}
                      </h3>
                      <p className="text-body-xs text-neutral-500 mb-1.5">
                        {achievement.desc}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-caption text-amber font-medium">
                          +{achievement.xp} XP
                        </span>
                        {achievement.earned ? (
                          <Badge variant="success" size="sm" animated={false}>
                            Earned
                          </Badge>
                        ) : (
                          <Badge variant="default" size="sm" animated={false}>
                            Locked
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ----- Match Card Sub-component -----

function MatchCard({
  match,
}: {
  match: {
    id: string;
    sport: string;
    result: string;
    score: string;
    opponent: string;
    mvp: boolean;
    date: string;
  };
}) {
  const isWin = match.result === "Won";

  return (
    <Card padding="md" className="hover:border-neutral-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
              isWin ? "bg-emerald/10" : "bg-coral/10"
            )}
          >
            <TrophyIcon
              size={20}
              className={isWin ? "text-emerald" : "text-coral"}
            />
          </div>
          <div>
            <p className="text-body-sm font-semibold text-neutral-900">
              vs {match.opponent}
            </p>
            <div className="flex items-center gap-2 text-body-xs text-neutral-400">
              <span>{match.sport}</span>
              <span>{match.date}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-body-sm font-bold text-neutral-900">
            {match.score}
          </p>
          <div className="flex items-center gap-1.5 justify-end">
            <Badge
              variant={isWin ? "success" : "danger"}
              size="sm"
              animated={false}
            >
              {match.result}
            </Badge>
            {match.mvp && (
              <Badge variant="premium" size="sm" animated={false}>
                MVP
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
