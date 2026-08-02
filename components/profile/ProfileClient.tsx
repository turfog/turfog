"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn, timeAgo } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import type { SportId } from "@/types";
import type { ProfilePayload, ProfilePost, OrganizedMatch } from "@/lib/profile";
import {
  TrophyIcon,
  ZapIcon,
  RunIcon,
  CheckCircleIcon,
  MapPinIcon,
  CalendarIcon,
  ArrowLeftIcon,
  SettingsIcon,
  ClockIcon,
  HeartIcon,
  CommentIcon,
  UsersIcon,
  FootballIcon,
  CricketIcon,
  PickleballIcon,
  PadelIcon,
  BadmintonIcon,
} from "@/components/SvgIcons";

const coverGradient: Record<SportId, string> = {
  football: "from-primary-green to-emerald",
  "box-cricket": "from-electric-blue to-primary-green",
  pickleball: "from-emerald to-electric-blue",
  padel: "from-amber to-sunset-orange",
  badminton: "from-sunset-orange to-amber",
};

const sportIcon: Record<SportId, React.ReactNode> = {
  football: <FootballIcon size={13} />,
  "box-cricket": <CricketIcon size={13} />,
  pickleball: <PickleballIcon size={13} />,
  padel: <PadelIcon size={13} />,
  badminton: <BadmintonIcon size={13} />,
};

const sportName: Record<SportId, string> = {
  football: "Football",
  "box-cricket": "Box cricket",
  pickleball: "Pickleball",
  padel: "Padel",
  badminton: "Badminton",
};

function presenceLabel(p: string): string | null {
  switch (p) {
    case "available-now": return "Available now";
    case "in-30-min": return "In 30 min";
    case "today": return "Available today";
    case "tonight": return "Tonight";
    case "weekend": return "Weekend";
    default: return null;
  }
}

function formatJoined(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function formatKickoff(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const sameDay = d.toDateString() === new Date().toDateString();
  const day = d.toLocaleDateString("en-US", { weekday: "short" });
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return `${sameDay ? "Today" : day}, ${time}`;
}

const tabs = ["Overview", "Activity", "Achievements"] as const;
type TabId = (typeof tabs)[number];

export default function ProfileClient({ payload }: { payload: ProfilePayload }) {
  const { view, posts, organized } = payload;
  const [tab, setTab] = useState<TabId>("Overview");
  const cover = view.primarySport ? coverGradient[view.primarySport] : "from-neutral-700 to-neutral-900";
  const presence = presenceLabel(view.presence);

  const achievements = [
    { on: view.verified, title: "Verified player", desc: "Identity confirmed by Turfog", xp: 100 },
    { on: view.postsCount > 0, title: "First moment", desc: "Shared your first match moment", xp: 50 },
    { on: view.organizedCount > 0, title: "Matchmaker", desc: "Organized your first match", xp: 150 },
    { on: view.followers > 0, title: "Building a network", desc: "Gained your first follower", xp: 75 },
    { on: view.reliability >= 4.5, title: "Trusted teammate", desc: "Maintained a 4.5+ reliability score", xp: 200 },
    { on: view.joinedCount >= 5, title: "Regular", desc: "Joined 5 matches as a player", xp: 120 },
  ];

  const stats = [
    { Icon: ZapIcon, value: view.postsCount, label: "Posts", color: "text-electric-blue" },
    { Icon: TrophyIcon, value: view.organizedCount, label: "Organized", color: "text-sunset-orange" },
    { Icon: RunIcon, value: view.joinedCount, label: "Joined", color: "text-primary-green" },
    { Icon: UsersIcon, value: view.followers, label: "Followers", color: "text-amber" },
  ];

  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="relative">
        <div className={cn("h-44 md:h-56 bg-gradient-to-r", cover)} />
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <Link href="/">
            <motion.span whileTap={{ scale: 0.9 }} className="inline-flex items-center gap-2 px-3 py-2 bg-black/20 backdrop-blur-md text-white text-body-xs font-medium rounded-xl hover:bg-black/30 transition-colors">
              <ArrowLeftIcon size={16} />
              Home
            </motion.span>
          </Link>
          <Link href="/settings">
            <motion.span whileTap={{ scale: 0.9 }} className="inline-flex items-center justify-center w-9 h-9 bg-black/20 backdrop-blur-md text-white rounded-xl hover:bg-black/30 transition-colors">
              <SettingsIcon size={18} />
            </motion.span>
          </Link>
        </div>

        <div className="max-w-3xl mx-auto px-6">
          <div className="relative -mt-14 mb-4">
            <div className="flex items-end gap-4">
              <Avatar alt={view.fullName} src={view.avatar} size="xl" online={view.presence === "available-now"} className="border-4 border-white shadow-lg" />
              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-display-sm font-bold text-neutral-900 font-display">{view.fullName}</h1>
                  {view.verified && <CheckCircleIcon size={18} className="text-electric-blue" />}
                </div>
                <p className="text-body-xs text-neutral-500">@{view.username}</p>
              </div>
            </div>
          </div>

          {view.bio && <p className="text-body-sm text-neutral-600 mb-3">{view.bio}</p>}

          <div className="flex flex-wrap items-center gap-2 mb-4">
            {presence && <Badge variant="success" size="sm" animated={view.presence === "available-now"}>{presence}</Badge>}
            <Badge variant="info" size="sm" animated={false}>{view.reliability.toFixed(1)} trust</Badge>
            {view.sports.map((s) => {
              const id = (new Set<SportId>(["football", "box-cricket", "pickleball", "padel", "badminton"])).has(s as SportId) ? (s as SportId) : null;
              return id ? <Badge key={s} variant="default" size="sm" animated={false}>{sportName[id]}</Badge> : null;
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-body-xs text-neutral-400 mb-6">
            {view.city && <span className="flex items-center gap-1"><MapPinIcon size={13} />{view.city}</span>}
            {view.joinedAt && <span className="flex items-center gap-1"><CalendarIcon size={13} />Joined {formatJoined(view.joinedAt)}</span>}
            <span className="flex items-center gap-1"><UsersIcon size={13} />{view.following} following</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((s) => (
            <motion.div key={s.label} whileHover={{ y: -3 }} className="bg-white rounded-2xl border border-neutral-200 shadow-card p-4 text-center">
              <s.Icon size={20} className={cn(s.color, "mx-auto mb-2")} />
              <p className="text-display-xs font-bold text-neutral-900">{s.value}</p>
              <p className="text-caption text-neutral-400">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-16">
        <div className="flex gap-1 border-b border-neutral-200 mb-6">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={cn("px-5 py-3 text-body-sm font-medium border-b-2 transition-all", tab === t ? "border-primary-green text-primary-green" : "border-transparent text-neutral-500 hover:text-neutral-700")}>
              {t}
            </button>
          ))}
        </div>

        {tab === "Overview" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h2 className="text-body-lg font-semibold text-neutral-900 font-display">Your moments</h2>
            {posts.length === 0 ? (
              <p className="text-center py-12 text-body-sm text-neutral-400">Share your first match moment from the home feed.</p>
            ) : (
              posts.map((p) => <PostTile key={p.id} post={p} />)
            )}
          </motion.div>
        )}

        {tab === "Activity" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h2 className="text-body-lg font-semibold text-neutral-900 font-display">Matches you organized</h2>
            {organized.length === 0 ? (
              <p className="text-center py-12 text-body-sm text-neutral-400">Post a "Looking for a player" request to see it here.</p>
            ) : (
              organized.map((m) => <MatchTile key={m.id} match={m} />)
            )}
          </motion.div>
        )}

        {tab === "Achievements" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((a) => (
              <div key={a.title} className={cn("bg-white rounded-2xl border border-neutral-200 shadow-card p-4 flex items-start gap-3 transition-opacity", !a.on && "opacity-40")}>
                <div className="w-10 h-10 bg-amber/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrophyIcon size={20} className="text-amber" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-body-sm font-semibold text-neutral-900 mb-0.5">{a.title}</h3>
                  <p className="text-body-xs text-neutral-500 mb-1.5">{a.desc}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-caption text-amber font-medium">+{a.xp} XP</span>
                    <Badge variant={a.on ? "success" : "default"} size="sm" animated={false}>{a.on ? "Earned" : "Locked"}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function PostTile({ post }: { post: ProfilePost }) {
  return (
    <motion.article whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300, damping: 24 }} className="bg-white rounded-2xl border border-neutral-200 shadow-card overflow-hidden">
      <div className="p-4">
        {post.text && <p className="text-body-sm text-neutral-700 whitespace-pre-line">{post.text}</p>}
        {post.location && <p className="flex items-center gap-1 text-caption text-neutral-400 mt-1.5"><MapPinIcon size={12} />{post.location}</p>}
      </div>
      {post.imageUrl && (
        <div className="aspect-[16/9] overflow-hidden bg-neutral-100">
          <img src={post.imageUrl} alt={post.imageAlt} loading="lazy" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="flex items-center justify-between px-4 py-3 text-caption text-neutral-400 border-t border-neutral-100">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1"><HeartIcon size={13} />{post.likes}</span>
          <span className="flex items-center gap-1"><CommentIcon size={13} />{post.comments}</span>
          {post.sport && <span className="inline-flex items-center gap-1 text-neutral-500">{sportIcon[post.sport]}{sportName[post.sport]}</span>}
        </div>
        <span className="flex items-center gap-1"><ClockIcon size={12} />{timeAgo(post.createdAt)}</span>
      </div>
    </motion.article>
  );
}

function MatchTile({ match }: { match: OrganizedMatch }) {
  const full = match.needed <= 0;
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-card p-4 flex items-center gap-3">
      <span className="w-10 h-10 rounded-xl bg-sunset-orange/10 text-sunset-orange flex items-center justify-center flex-shrink-0">
        {match.sport ? sportIcon[match.sport] : <RunIcon size={18} />}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-body-sm font-semibold text-neutral-900 truncate">{match.venue || "Match"}</p>
        <div className="flex items-center gap-2 text-caption text-neutral-400">
          {match.sport && <span className="capitalize">{sportName[match.sport]}</span>}
          <span className="flex items-center gap-0.5"><MapPinIcon size={11} />{match.area}</span>
          <span className="flex items-center gap-0.5"><ClockIcon size={11} />{formatKickoff(match.kickoffAt)}</span>
        </div>
      </div>
      <Badge variant={full ? "success" : "warning"} size="sm" animated={false}>{full ? "Full" : `${match.needed} slots`}</Badge>
    </div>
  );
}