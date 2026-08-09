"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn, timeAgo } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import { toggleFollow } from "@/lib/social";
import type { SportId } from "@/types";
import type { ProfilePayload, ProfilePost, OrganizedMatch } from "@/lib/profile";
import {
  CheckCircleIcon,
  MapPinIcon,
  CalendarIcon,
  UsersIcon,
  ShieldIcon,
  ArrowLeftIcon,
  MessageIcon,
  TrophyIcon,
  RunIcon,
  ClockIcon,
  ZapIcon,
  HeartIcon,
  CommentIcon,
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

function presenceMeta(p: string): { label: string; dot: string; badge: "success" | "warning" | "info" | "default" } | null {
  switch (p) {
    case "available-now": return { label: "Available now", dot: "bg-emerald", badge: "success" };
    case "in-30-min": return { label: "In 30 min", dot: "bg-amber", badge: "warning" };
    case "today": return { label: "Available today", dot: "bg-electric-blue", badge: "info" };
    case "tonight": return { label: "Tonight", dot: "bg-purple-500", badge: "default" };
    case "weekend": return { label: "Weekend", dot: "bg-sunset-orange", badge: "default" };
    default: return null;
  }
}

function formatJoined(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function formatKickoff(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const day = d.toLocaleDateString("en-US", { weekday: "short" });
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  const today = new Date();
  const sameDay = d.toDateString() === today.toDateString();
  return `${sameDay ? "Today" : day}, ${time}`;
}

function CountUp({ value }: { value: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (value <= 0) { setN(0); return; }
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 700);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{n}</>;
}

const reveal = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 26 } } };

export default function PublicProfile({ payload }: { payload: ProfilePayload }) {
  const { view, posts, organized, viewer } = payload;
  const [following, setFollowing] = useState(viewer.following);
  const [tab, setTab] = useState<"overview" | "activity">("overview");
  const isMe = !!viewer.myUsername && viewer.myUsername === view.username;
  const presence = presenceMeta(view.presence);
  const cover = view.primarySport ? coverGradient[view.primarySport] : "from-neutral-700 to-neutral-900";

  const onFollow = async () => {
    if (!view.id) return;
    setFollowing((v) => !v);
    const res = await toggleFollow(view.id);
    if (res) setFollowing(res.following);
  };

  const badges: Array<{ label: string; tone: string }> = [];
  if (view.verified) badges.push({ label: "Verified player", tone: "text-electric-blue bg-electric-blue/10" });
  if (presence) badges.push({ label: presence.label, tone: "text-emerald bg-emerald/10" });
  if (view.organizedCount > 0) badges.push({ label: "Match organizer", tone: "text-sunset-orange bg-sunset-orange/10" });
  if (view.reliability >= 4.5) badges.push({ label: `Reliable ${view.reliability}`, tone: "text-amber bg-amber/10" });
  if (view.followers > 0) badges.push({ label: `${view.followers} followers`, tone: "text-primary-green bg-primary-green/10" });

  const stats = [
    { label: "Posts", value: view.postsCount, color: "text-electric-blue", Icon: ZapIcon },
    { label: "Organized", value: view.organizedCount, color: "text-sunset-orange", Icon: TrophyIcon },
    { label: "Followers", value: view.followers, color: "text-primary-green", Icon: UsersIcon },
    { label: "Trust", value: view.reliability, color: "text-amber", Icon: ShieldIcon, fixed: true },
  ];

  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="relative">
        <div className={cn("relative h-44 md:h-56 bg-gradient-to-r overflow-hidden", cover)}>
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{ background: "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.6) 50%, transparent 70%)" }}
            animate={{ x: ["-60%", "120%"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", repeatDelay: 3 }}
          />
          <div className="absolute top-4 left-4">
            <Link href="/">
              <motion.span whileTap={{ scale: 0.9 }} className="inline-flex items-center gap-2 px-3 py-2 bg-black/20 backdrop-blur-md text-white text-body-xs font-medium rounded-xl hover:bg-black/30 transition-colors">
                <ArrowLeftIcon size={16} />
                Back
              </motion.span>
            </Link>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6">
          <div className="relative -mt-14 mb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
            <div className="flex items-end gap-4">
              <Avatar alt={view.fullName} src={view.avatar} size="xl" online={view.presence === "available-now"} className="border-4 border-white shadow-lg" />
              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-display-sm font-bold text-neutral-900 font-display">{view.fullName}</h1>
                  {view.verified && <CheckCircleIcon size={18} className="text-electric-blue" />}
                </div>
                <p className="text-body-xs text-neutral-500">@{view.username}</p>
                {view.presence === "available-now" && (
                  <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-emerald/10 text-emerald text-caption font-semibold w-fit">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald opacity-70" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald" />
                    </span>
                    Live now
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2 sm:pb-2">
              {isMe ? (
                <Link href="/settings">
                  <span className="px-4 py-2 rounded-xl border border-neutral-200 text-body-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors">Edit profile</span>
                </Link>
              ) : view.id ? (
                <>
                  <motion.button whileTap={{ scale: 0.96 }} onClick={onFollow} className={cn("px-4 py-2 rounded-xl text-body-xs font-semibold transition-colors", following ? "bg-neutral-100 text-neutral-600 border border-neutral-200" : "bg-primary-green text-white hover:bg-primary-green/90")}>
                    {following ? "Following" : "Follow"}
                  </motion.button>
                  <Link href={`/messages?to=${view.id}`}>
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-neutral-200 text-body-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors">
                      <MessageIcon size={15} />
                      Message
                    </span>
                  </Link>
                </>
              ) : (
                <span className="px-3 py-2 rounded-xl bg-neutral-100 text-caption font-medium text-neutral-500">Public activity</span>
              )}
            </div>
          </div>

          {view.bio && <p className="text-body-sm text-neutral-600 mb-3">{view.bio}</p>}

          <div className="flex flex-wrap items-center gap-3 text-body-xs text-neutral-400 mb-4">
            {view.city && <span className="flex items-center gap-1"><MapPinIcon size={13} />{view.city}</span>}
            {view.joinedAt && <span className="flex items-center gap-1"><CalendarIcon size={13} />Joined {formatJoined(view.joinedAt)}</span>}
            <span className="flex items-center gap-1"><UsersIcon size={13} />{view.following} following</span>
            {view.sports.length > 0 && (
              <span className="flex items-center gap-1.5">
                {view.sports.map((s) => {
                  const id = safeSportIdLocal(s);
                  return id ? <span key={s} className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-100 rounded-md text-neutral-600 font-medium">{sportIcon[id]}{sportName[id]}</span> : null;
                })}
              </span>
            )}
          </div>

          {badges.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {badges.map((b) => (
                <span key={b.label} className={cn("px-2.5 py-1 rounded-full text-caption font-semibold", b.tone)}>{b.label}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-3xl mx-auto px-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((s) => (
            <motion.div key={s.label} whileHover={{ y: -3 }} className="bg-white rounded-2xl border border-neutral-200/80 shadow-card p-4 text-center">
              <s.Icon size={20} className={cn(s.color, "mx-auto mb-2")} />
              <p className="text-display-xs font-bold text-neutral-900">
                {s.fixed ? view.reliability.toFixed(1) : <CountUp value={s.value} />}
              </p>
              <p className="text-caption text-neutral-400">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="max-w-3xl mx-auto px-6 pb-16">
        <div className="flex gap-1 border-b border-neutral-200 mb-6">
          {(["overview", "activity"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={cn("px-5 py-3 text-body-sm font-medium border-b-2 capitalize transition-all", tab === t ? "border-primary-green text-primary-green" : "border-transparent text-neutral-500 hover:text-neutral-700")}>
              {t}
            </button>
          ))}
        </div>

        {tab === "overview" ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h2 className="text-body-lg font-semibold text-neutral-900 font-display">Recent moments</h2>
            {posts.length === 0 ? (
              <p className="text-center py-12 text-body-sm text-neutral-400">No moments shared yet.</p>
            ) : (
              posts.map((p) => <PostTile key={p.id} post={p} />)
            )}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h2 className="text-body-lg font-semibold text-neutral-900 font-display">Matches organized</h2>
            {organized.length === 0 ? (
              <p className="text-center py-12 text-body-sm text-neutral-400">Has not organized a match yet.</p>
            ) : (
              organized.map((m) => <MatchTile key={m.id} match={m} />)
            )}
            {view.id && view.joinedCount > 0 && (
              <p className="text-body-xs text-neutral-500 pt-2">Also joined {view.joinedCount} match{view.joinedCount === 1 ? "" : "es"} as a player.</p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function safeSportIdLocal(v: string): SportId | null {
  const set = new Set<SportId>(["football", "box-cricket", "pickleball", "padel", "badminton"]);
  return set.has(v as SportId) ? (v as SportId) : null;
}

function PostTile({ post }: { post: ProfilePost }) {
  return (
    <motion.article whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300, damping: 24 }} className="bg-white rounded-2xl border border-neutral-200/80 shadow-card overflow-hidden">
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
    <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-card p-4 flex items-center gap-3">
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
      <Badge variant={full ? "success" : "warning"} size="sm" animated={false}>
        {full ? "Full" : `${match.needed} slots`}
      </Badge>
    </div>
  );
}