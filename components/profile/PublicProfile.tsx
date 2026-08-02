"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import {
  TrophyIcon,
  ShieldIcon,
  ZapIcon,
  RunIcon,
  CheckCircleIcon,
  MapPinIcon,
  CalendarIcon,
  ArrowLeftIcon,
  StarIcon,
  UsersIcon,
} from "@/components/SvgIcons";

// ----- Mock Data -----

const profileData: Record<
  string,
  {
    fullName: string;
    bio: string;
    city: string;
    level: number;
    xp: number;
    streak: number;
    totalMatches: number;
    totalWins: number;
    totalMvps: number;
    reliability: number;
    verified: boolean;
    online: boolean;
    joined: string;
    sports: string[];
    availability: string;
    followers: number;
    following: number;
  }
> = {
  rahul_sharma: {
    fullName: "Rahul Sharma",
    bio: "Weekend football warrior. 5-a-side specialist. Never miss a Sunday match at Andheri.",
    city: "Mumbai",
    level: 7,
    xp: 2380,
    streak: 10,
    totalMatches: 42,
    totalWins: 29,
    totalMvps: 8,
    reliability: 4.8,
    verified: true,
    online: true,
    joined: "Jan 2026",
    sports: ["Football", "Box cricket"],
    availability: "Available now",
    followers: 128,
    following: 86,
  },
  priya_patel: {
    fullName: "Priya Patel",
    bio: "Badminton enthusiast. Pickleball convert. Looking for doubles partners in Powai.",
    city: "Mumbai",
    level: 4,
    xp: 1120,
    streak: 5,
    totalMatches: 18,
    totalWins: 11,
    totalMvps: 3,
    reliability: 4.5,
    verified: true,
    online: true,
    joined: "Mar 2026",
    sports: ["Badminton", "Pickleball"],
    availability: "Available now",
    followers: 64,
    following: 42,
  },
  arjun_nair: {
    fullName: "Arjun Nair",
    bio: "Competitive footballer. Box cricket captain. Building the best team in Bandra.",
    city: "Mumbai",
    level: 9,
    xp: 3240,
    streak: 15,
    totalMatches: 67,
    totalWins: 48,
    totalMvps: 14,
    reliability: 4.9,
    verified: true,
    online: false,
    joined: "Nov 2025",
    sports: ["Football", "Box cricket"],
    availability: "In 30 minutes",
    followers: 256,
    following: 112,
  },
};

const defaultProfile = {
  fullName: "Turfog Player",
  bio: "Sports enthusiast. Always up for a game.",
  city: "Mumbai",
  level: 3,
  xp: 680,
  streak: 2,
  totalMatches: 12,
  totalWins: 7,
  totalMvps: 1,
  reliability: 4.2,
  verified: false,
  online: false,
  joined: "Jun 2026",
  sports: ["Football"],
  availability: "This weekend",
  followers: 18,
  following: 24,
};

const matchHistory = [
  { id: "m1", sport: "Football", result: "Won", score: "3-2", opponent: "Bandra FC", mvp: true, date: "2 days ago" },
  { id: "m2", sport: "Football", result: "Won", score: "5-1", opponent: "Juhu Strikers", mvp: false, date: "5 days ago" },
  { id: "m3", sport: "Box cricket", result: "Lost", score: "48-52", opponent: "Powai Warriors", mvp: false, date: "1 week ago" },
  { id: "m4", sport: "Football", result: "Won", score: "2-0", opponent: "Navi Mumbai FC", mvp: true, date: "1 week ago" },
];

const tabs = ["Overview", "Matches", "Stats"] as const;
type TabId = (typeof tabs)[number];

// ----- Component -----

export default function PublicProfile({ username }: { username: string }) {
  const [activeTab, setActiveTab] = useState<TabId>("Overview");
  const profile = profileData[username] || defaultProfile;

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Cover */}
      <div className="relative">
        <div className="h-40 md:h-52 bg-gradient-to-r from-primary-green via-electric-blue to-emerald" />

        {/* Back */}
        <div className="absolute top-4 left-4">
          <Link href="/">
            <motion.span
              whileTap={{ scale: 0.9 }}
              className="inline-flex items-center gap-2 px-3 py-2 bg-black/20 backdrop-blur-md text-white text-body-xs font-medium rounded-xl hover:bg-black/30 transition-colors"
            >
              <ArrowLeftIcon size={16} />
              Back
            </motion.span>
          </Link>
        </div>

        {/* Profile Header */}
        <div className="max-w-3xl mx-auto px-6">
          <div className="relative -mt-14 mb-4">
            <div className="flex items-end justify-between">
              <div className="flex items-end gap-4">
                <Avatar
                  alt={profile.fullName}
                  size="xl"
                  online={profile.online}
                  className="border-4 border-white shadow-lg"
                />
                <div className="pb-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-display-sm font-bold text-neutral-900 font-display">
                      {profile.fullName}
                    </h1>
                    {profile.verified && (
                      <CheckCircleIcon size={18} className="text-electric-blue" />
                    )}
                  </div>
                  <p className="text-body-xs text-neutral-500">@{username}</p>
                </div>
              </div>
              <div className="pb-2 flex gap-2">
                <Button size="sm" variant="primary">
                  <RunIcon size={15} />
                  Invite
                </Button>
                <Button size="sm" variant="outline">
                  Follow
                </Button>
              </div>
            </div>
          </div>

          <p className="text-body-sm text-neutral-600 mb-3">{profile.bio}</p>

          {/* Meta Row */}
          <div className="flex flex-wrap items-center gap-3 text-body-xs text-neutral-400 mb-4">
            <span className="flex items-center gap-1">
              <MapPinIcon size={13} />
              {profile.city}
            </span>
            <span className="flex items-center gap-1">
              <CalendarIcon size={13} />
              Joined {profile.joined}
            </span>
            <span className="flex items-center gap-1">
              <UsersIcon size={13} />
              {profile.followers} followers
            </span>
            <span className="flex items-center gap-1">
              <ShieldIcon size={13} />
              {profile.reliability} trust
            </span>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <Badge variant="info" size="sm" animated={false}>
              Level {profile.level}
            </Badge>
            <Badge variant="premium" size="sm" animated={false}>
              {profile.streak} streak
            </Badge>
            {profile.sports.map((sport) => (
              <Badge key={sport} variant="default" size="sm" animated={false}>
                {sport}
              </Badge>
            ))}
            <Badge
              variant={profile.availability === "Available now" ? "success" : "warning"}
              size="sm"
              animated={profile.availability === "Available now"}
            >
              {profile.availability}
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-3xl mx-auto px-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: RunIcon, value: profile.totalMatches, label: "Matches", color: "text-electric-blue" },
            { icon: TrophyIcon, value: profile.totalWins, label: "Wins", color: "text-emerald" },
            { icon: StarIcon, value: profile.totalMvps, label: "MVPs", color: "text-amber" },
            { icon: ZapIcon, value: profile.xp.toLocaleString(), label: "XP", color: "text-sunset-orange" },
          ].map((stat) => (
            <Card key={stat.label} padding="md" className="text-center">
              <stat.icon size={20} className={cn(stat.color, "mx-auto mb-2")} />
              <p className="text-display-xs font-bold text-neutral-900">{stat.value}</p>
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

        {/* Overview */}
        {activeTab === "Overview" && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pb-12">
            <h2 className="text-body-lg font-semibold text-neutral-900 font-display">Recent matches</h2>
            {matchHistory.slice(0, 3).map((match) => (
              <PublicMatchCard key={match.id} match={match} />
            ))}
          </motion.div>
        )}

        {/* Matches */}
        {activeTab === "Matches" && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pb-12">
            <h2 className="text-body-lg font-semibold text-neutral-900 font-display">Match history</h2>
            {matchHistory.map((match) => (
              <PublicMatchCard key={match.id} match={match} />
            ))}
          </motion.div>
        )}

        {/* Stats */}
        {activeTab === "Stats" && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="pb-12">
            <h2 className="text-body-lg font-semibold text-neutral-900 font-display mb-4">Performance</h2>
            <Card padding="lg">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  { label: "Win rate", value: `${Math.round((profile.totalWins / profile.totalMatches) * 100)}%` },
                  { label: "MVP rate", value: `${Math.round((profile.totalMvps / profile.totalMatches) * 100)}%` },
                  { label: "Reliability", value: `${profile.reliability}/5.0` },
                  { label: "Current streak", value: `${profile.streak} matches` },
                  { label: "Level", value: `${profile.level}` },
                  { label: "Total XP", value: profile.xp.toLocaleString() },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-display-xs font-bold text-neutral-900 mb-1">{stat.value}</p>
                    <p className="text-caption text-neutral-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ----- Match Card -----

function PublicMatchCard({
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
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", isWin ? "bg-emerald/10" : "bg-coral/10")}>
            <TrophyIcon size={20} className={isWin ? "text-emerald" : "text-coral"} />
          </div>
          <div>
            <p className="text-body-sm font-semibold text-neutral-900">vs {match.opponent}</p>
            <div className="flex items-center gap-2 text-body-xs text-neutral-400">
              <span>{match.sport}</span>
              <span>{match.date}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-body-sm font-bold text-neutral-900">{match.score}</p>
          <div className="flex items-center gap-1.5 justify-end">
            <Badge variant={isWin ? "success" : "danger"} size="sm" animated={false}>
              {match.result}
            </Badge>
            {match.mvp && (
              <Badge variant="premium" size="sm" animated={false}>MVP</Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
