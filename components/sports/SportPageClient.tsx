"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Sport, SportId } from "@/types";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import {
  UsersIcon,
  CalendarIcon,
  MapPinIcon,
  ChevronRightIcon,
  TrophyIcon,
  RunIcon,
  PlusIcon,
  SearchIcon,
  ArrowLeftIcon,
  ClockIcon,
  FootballIcon,
  CricketIcon,
  PickleballIcon,
  PadelIcon,
  BadmintonIcon,
} from "@/components/SvgIcons";

// ----- Sport Images (Placeholder - replace with original Turfog photography) -----

const sportImages: Record<SportId, string> = {
  football:
    "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1600&q=80",
  "box-cricket":
    "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1600&q=80",
  pickleball:
    "https://images.unsplash.com/photo-1554068696-82a4e2d1a5a4?w=1600&q=80",
  padel:
    "https://images.unsplash.com/photo-1612534847738-b3af3b1f283d?w=1600&q=80",
  badminton:
    "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1600&q=80",
};

const sportIconMap: Record<SportId, React.ReactNode> = {
  football: <FootballIcon size={22} />,
  "box-cricket": <CricketIcon size={22} />,
  pickleball: <PickleballIcon size={22} />,
  padel: <PadelIcon size={22} />,
  badminton: <BadmintonIcon size={22} />,
};

// ----- Mock Data -----

const upcomingGames = [
  {
    id: "g1",
    title: "Sunday 5v5 football",
    venue: "Andheri sports complex",
    time: "Today, 6:00 PM",
    playersJoined: 8,
    playersNeeded: 2,
    skill: "Intermediate",
  },
  {
    id: "g2",
    title: "Weekend friendly match",
    venue: "Bandra turf ground",
    time: "Sat, 8:00 AM",
    playersJoined: 10,
    playersNeeded: 4,
    skill: "All levels",
  },
  {
    id: "g3",
    title: "Corporate league - week 4",
    venue: "Powai sports hub",
    time: "Sun, 5:30 PM",
    playersJoined: 12,
    playersNeeded: 0,
    skill: "Advanced",
  },
];

const nearbyPlayers = [
  { name: "Rahul Sharma", skill: "Intermediate", matches: 42, online: true },
  { name: "Priya Patel", skill: "Beginner", matches: 18, online: true },
  { name: "Arjun Nair", skill: "Advanced", matches: 67, online: false },
  { name: "Sneha Reddy", skill: "Intermediate", matches: 31, online: true },
  { name: "Vikram Singh", skill: "Advanced", matches: 55, online: false },
  { name: "Ananya Iyer", skill: "Beginner", matches: 12, online: true },
];

const leaderboard = [
  { rank: 1, name: "Arjun Nair", xp: 2840, wins: 38, mvps: 12 },
  { rank: 2, name: "Vikram Singh", xp: 2610, wins: 34, mvps: 9 },
  { rank: 3, name: "Rahul Sharma", xp: 2380, wins: 29, mvps: 8 },
  { rank: 4, name: "Sneha Reddy", xp: 1950, wins: 24, mvps: 6 },
  { rank: 5, name: "Priya Patel", xp: 1720, wins: 20, mvps: 5 },
];

const recentMatches = [
  { id: "m1", teamA: "Andheri United", teamB: "Bandra FC", scoreA: 3, scoreB: 2, mvp: "Rahul Sharma" },
  { id: "m2", teamA: "Powai Warriors", teamB: "Juhu Strikers", scoreA: 1, scoreB: 4, mvp: "Arjun Nair" },
  { id: "m3", teamA: "Mumbai XI", teamB: "Navi Mumbai FC", scoreA: 2, scoreB: 2, mvp: "Sneha Reddy" },
];

// ----- Tabs -----

const tabs = ["Games", "Players", "Leaderboard", "Results"] as const;
type TabId = (typeof tabs)[number];

// ----- Component -----

export default function SportPageClient({ sport }: { sport: Sport }) {
  const [activeTab, setActiveTab] = useState<TabId>("Games");

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Hero Banner */}
      <section className="relative h-[420px] md:h-[480px] overflow-hidden">
        {/* Placeholder image - replace with original Turfog photography */}
        <img
          src={sportImages[sport.id]}
          alt={`${sport.name} players in action`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/50 to-neutral-900/20" />

        {/* Back Button */}
        <div className="absolute top-6 left-6 z-10">
          <Link href="/">
            <motion.span
              whileTap={{ scale: 0.9 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md text-white text-body-xs font-medium rounded-xl border border-white/15 hover:bg-white/20 transition-colors"
            >
              <ArrowLeftIcon size={16} />
              Back
            </motion.span>
          </Link>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white/15 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/10">
                  {sportIconMap[sport.id]}
                </div>
                <div>
                  <h1 className="text-display-lg font-display font-bold text-white">
                    {sport.name}
                  </h1>
                  <p className="text-body-sm text-white/60">{sport.tagline}</p>
                </div>
              </div>

              {/* Formats */}
              <div className="flex flex-wrap gap-2 mb-6">
                {sport.formats.map((format) => (
                  <span
                    key={format}
                    className="px-3 py-1 bg-white/10 backdrop-blur-md text-white/80 text-caption font-medium rounded-full border border-white/10"
                  >
                    {format}
                  </span>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3">
                <Link href="/dashboard">
                  <motion.span
                    whileTap={{ scale: 0.96 }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-green text-white text-body-sm font-semibold rounded-xl shadow-glow-green hover:bg-primary-green/90 transition-colors"
                  >
                    <PlusIcon size={18} />
                    Create match
                  </motion.span>
                </Link>
                <Link href="/dashboard">
                  <motion.span
                    whileTap={{ scale: 0.96 }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md text-white text-body-sm font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-colors"
                  >
                    <SearchIcon size={18} />
                    Find players
                  </motion.span>
                </Link>
                <Link href="/dashboard">
                  <motion.span
                    whileTap={{ scale: 0.96 }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md text-white text-body-sm font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-colors"
                  >
                    <RunIcon size={18} />
                    Join match
                  </motion.span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-around">
          {[
            { icon: UsersIcon, value: "860", label: "Active players" },
            { icon: CalendarIcon, value: "42", label: "Upcoming matches" },
            { icon: MapPinIcon, value: "18", label: "Nearby venues" },
            { icon: TrophyIcon, value: "126", label: "Matches this month" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon size={18} className="text-primary-green mx-auto mb-1" />
              <p className="text-body-md font-bold text-neutral-900">
                {stat.value}
              </p>
              <p className="text-caption text-neutral-400 hidden sm:block">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-neutral-200">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-5 py-3.5 text-body-sm font-medium whitespace-nowrap border-b-2 transition-all",
                  activeTab === tab
                    ? "border-primary-green text-primary-green"
                    : "border-transparent text-neutral-500 hover:text-neutral-700"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Games Tab */}
        {activeTab === "Games" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-body-lg font-semibold text-neutral-900 font-display">
              Upcoming games
            </h2>
            {upcomingGames.map((game) => (
              <Card key={game.id} padding="md" className="hover:border-primary-green/30 group">
                <div className="flex items-center justify-between">
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
                      <span className="text-caption text-neutral-400">
                        {game.playersJoined} joined
                      </span>
                      <span className="text-caption text-neutral-400">
                        {game.skill}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                    {game.playersNeeded > 0 && (
                      <Button size="sm" variant="primary">
                        Join
                      </Button>
                    )}
                    <ChevronRightIcon
                      size={18}
                      className="text-neutral-300 group-hover:text-neutral-500 transition-colors"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </motion.div>
        )}

        {/* Players Tab */}
        {activeTab === "Players" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-body-lg font-semibold text-neutral-900 font-display mb-4">
              Nearby players
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nearbyPlayers.map((player) => (
                <Card key={player.name} padding="md" className="hover:border-electric-blue/30">
                  <div className="flex items-center gap-3">
                    <Avatar alt={player.name} size="md" online={player.online} />
                    <div className="flex-1 min-w-0">
                      <p className="text-body-sm font-semibold text-neutral-900">
                        {player.name}
                      </p>
                      <p className="text-body-xs text-neutral-500">
                        {player.skill} / {player.matches} matches
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Connect
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === "Leaderboard" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-body-lg font-semibold text-neutral-900 font-display mb-4">
              Top players
            </h2>
            <Card padding="none" className="overflow-hidden">
              {leaderboard.map((player, index) => (
                <div
                  key={player.rank}
                  className={cn(
                    "flex items-center gap-4 px-5 py-4 transition-colors hover:bg-neutral-50",
                    index < leaderboard.length - 1 && "border-b border-neutral-100"
                  )}
                >
                  <span
                    className={cn(
                      "w-8 h-8 flex items-center justify-center rounded-lg text-body-sm font-bold",
                      player.rank === 1
                        ? "bg-amber/10 text-amber"
                        : player.rank === 2
                        ? "bg-neutral-200 text-neutral-600"
                        : player.rank === 3
                        ? "bg-sunset-orange/10 text-sunset-orange"
                        : "text-neutral-400"
                    )}
                  >
                    {player.rank}
                  </span>
                  <Avatar alt={player.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-body-sm font-semibold text-neutral-900">
                      {player.name}
                    </p>
                    <p className="text-caption text-neutral-400">
                      {player.wins} wins / {player.mvps} MVPs
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-body-sm font-bold text-primary-green">
                      {player.xp.toLocaleString()}
                    </p>
                    <p className="text-caption text-neutral-400">XP</p>
                  </div>
                </div>
              ))}
            </Card>
          </motion.div>
        )}

        {/* Results Tab */}
        {activeTab === "Results" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-body-lg font-semibold text-neutral-900 font-display">
              Recent matches
            </h2>
            {recentMatches.map((match) => (
              <Card key={match.id} padding="md" className="hover:border-emerald/30">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-body-sm font-semibold text-neutral-900 mb-1">
                      {match.teamA} vs {match.teamB}
                    </p>
                    <p className="text-body-xs text-neutral-400">
                      MVP: {match.mvp}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-display-xs font-bold text-neutral-900">
                      {match.scoreA} - {match.scoreB}
                    </span>
                    <TrophyIcon size={18} className="text-amber" />
                  </div>
                </div>
              </Card>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
