"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import type { PlayerRequest, SportId, MatchType } from "@/types";
import {
  UsersIcon,
  MapPinIcon,
  ClockIcon,
  XIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  RunIcon,
  ZapIcon,
  ShieldIcon,
  TrophyIcon,
  FootballIcon,
  CricketIcon,
  PickleballIcon,
  PadelIcon,
  BadmintonIcon,
} from "@/components/SvgIcons";

const T = Date.now();
const CAP = 7;
const PREFS = new Set<SportId>(["football", "badminton", "box-cricket"]);

const sportIcon: Record<SportId, React.ReactNode> = {
  football: <FootballIcon size={12} />,
  "box-cricket": <CricketIcon size={12} />,
  pickleball: <PickleballIcon size={12} />,
  padel: <PadelIcon size={12} />,
  badminton: <BadmintonIcon size={12} />,
};

const sportName: Record<SportId, string> = {
  football: "Football",
  "box-cricket": "Box cricket",
  pickleball: "Pickleball",
  padel: "Padel",
  badminton: "Badminton",
};

const sportText: Record<SportId, string> = {
  football: "text-primary-green",
  "box-cricket": "text-electric-blue",
  pickleball: "text-emerald",
  padel: "text-amber",
  badminton: "text-sunset-orange",
};

const matchTypeMeta: Record<
  MatchType,
  { Icon: (props: { size?: number }) => React.ReactNode; label: string }
> = {
  casual: { Icon: RunIcon, label: "Casual" },
  practice: { Icon: ZapIcon, label: "Practice" },
  competitive: { Icon: ShieldIcon, label: "Competitive" },
  tournament: { Icon: TrophyIcon, label: "Tournament" },
};

const urgText = {
  critical: "text-coral",
  soon: "text-sunset-orange",
  calm: "text-emerald",
} as const;

const urgBg = {
  critical: "bg-coral/10",
  soon: "bg-sunset-orange/10",
  calm: "bg-emerald/10",
} as const;

const MOCK_REQUESTS: PlayerRequest[] = [
  { id: "r1", organizerName: "Rahul Sharma", organizerUsername: "rahul_sharma", organizerAvatar: "", verified: true, sport: "football", needed: 1, capacity: 10, waitlist: 0, kickoffAt: new Date(T + 14 * 60000).toISOString(), venue: "Champions Turf", area: "Porur", distanceKm: 0.9, skill: "intermediate", matchType: "casual", mutuals: 2 },
  { id: "r2", organizerName: "Arjun Nair", organizerUsername: "arjun_nair", organizerAvatar: "", verified: true, sport: "box-cricket", needed: 0, capacity: 12, waitlist: 3, kickoffAt: new Date(T + 38 * 60000).toISOString(), venue: "Sixer Arena", area: "Anna Nagar", distanceKm: 2.4, skill: "advanced", matchType: "competitive", teamName: "Bandra Strikers" },
  { id: "r3", organizerName: "Sneha Reddy", organizerUsername: "sneha_reddy", organizerAvatar: "", verified: false, sport: "badminton", needed: 2, capacity: 4, waitlist: 0, kickoffAt: new Date(T + 95 * 60000).toISOString(), venue: "Smash Court", area: "Velachery", distanceKm: 3.1, skill: "any", matchType: "practice", mutuals: 1 },
  { id: "r4", organizerName: "Priya Patel", organizerUsername: "priya_patel", organizerAvatar: "", verified: false, sport: "pickleball", needed: 3, capacity: 8, waitlist: 0, kickoffAt: new Date(T + 8 * 60000).toISOString(), venue: "Pickle Hub", area: "OMR", distanceKm: 1.6, skill: "beginner", matchType: "casual" },
  { id: "r5", organizerName: "Vikram Singh", organizerUsername: "vikram_singh", organizerAvatar: "", verified: true, sport: "football", needed: 4, capacity: 14, waitlist: 1, kickoffAt: new Date(T + 210 * 60000).toISOString(), venue: "Turf United", area: "Bandra", distanceKm: 4.7, skill: "advanced", matchType: "tournament", teamName: "Mumbai XI", mutuals: 3 },
  { id: "r6", organizerName: "Ananya Iyer", organizerUsername: "ananya_iyer", organizerAvatar: "", verified: true, sport: "padel", needed: 2, capacity: 4, waitlist: 0, kickoffAt: new Date(T + 55 * 60000).toISOString(), venue: "Glass Court Club", area: "Powai", distanceKm: 2.0, skill: "intermediate", matchType: "competitive" },
];

const EXTRA: Array<Omit<PlayerRequest, "kickoffAt"> & { offsetMin: number }> = [
  { id: "rx1", organizerName: "Karan Mehta", organizerUsername: "karan_mehta", organizerAvatar: "", verified: false, sport: "football", needed: 2, capacity: 10, waitlist: 0, offsetMin: 11, venue: "Goal Arena", area: "Andheri", distanceKm: 1.1, skill: "intermediate", matchType: "casual", mutuals: 1 },
  { id: "rx2", organizerName: "Meera Nair", organizerUsername: "meera_nair", organizerAvatar: "", verified: true, sport: "badminton", needed: 1, capacity: 4, waitlist: 0, offsetMin: 6, venue: "Net Court", area: "Juhu", distanceKm: 0.6, skill: "beginner", matchType: "practice" },
];

function formatCountdown(ms: number): string | null {
  if (ms <= 0) return null;
  const s = Math.floor(ms / 1000);
  if (s < 60) return "now";
  const m = Math.floor(s / 60);
  if (m < 60) return `in ${m}m`;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return mm ? `in ${h}h ${mm}m` : `in ${h}h`;
}

function urgency(ms: number): "critical" | "soon" | "calm" {
  const m = ms / 60000;
  if (m <= 15) return "critical";
  if (m <= 60) return "soon";
  return "calm";
}

function score(req: PlayerRequest, now: number): number {
  const mins = (new Date(req.kickoffAt).getTime() - now) / 60000;
  const timeScore = mins > 0 ? 1000 / (mins + 5) : 0;
  const distScore = 100 / (req.distanceKm + 1);
  const compat = PREFS.has(req.sport) ? 30 : 0;
  const ver = req.verified ? 15 : 0;
  const mut = (req.mutuals ?? 0) * 5;
  const pop = req.waitlist > 0 ? 8 : 0;
  return timeScore + distScore + compat + ver + mut + pop;
}

function insertSorted(arr: PlayerRequest[], req: PlayerRequest, now: number): PlayerRequest[] {
  const next = [...arr, req];
  next.sort((a, b) => score(b, now) - score(a, now));
  return next;
}

export default function PlayersWanted({ variant }: { variant: "rail" | "scroller" }) {
  const [requests, setRequests] = useState<PlayerRequest[]>(MOCK_REQUESTS);
  const [now, setNow] = useState(0);
  const [myAction, setMyAction] = useState<Record<string, "joined" | "waitlist">>({});
  const poolRef = useRef(0);

  useEffect(() => {
    const start = Date.now();
    setNow(start);
    setRequests((prev) => [...prev].sort((a, b) => score(b, start) - score(a, start)));

    const tick = setInterval(() => setNow(Date.now()), 1000);

    const adder = setInterval(() => {
      const t = Date.now();
      setRequests((prev) => {
        const pruned = prev.filter((r) => new Date(r.kickoffAt).getTime() - t > 0);
        if (pruned.length >= CAP) return pruned;
        const template = EXTRA[poolRef.current % EXTRA.length];
        poolRef.current += 1;
        const id = `${template.id}-${t}`;
        if (pruned.some((r) => r.id === id)) return pruned;
        const req: PlayerRequest = { ...template, id, kickoffAt: new Date(t + template.offsetMin * 60000).toISOString() };
        return insertSorted(pruned, req, t);
      });
    }, 14000);

    return () => {
      clearInterval(tick);
      clearInterval(adder);
    };
  }, []);

  const visible = requests.filter((r) => now === 0 || new Date(r.kickoffAt).getTime() - now > 0);

  const handleJoin = (id: string) => {
    if (myAction[id]) return;
    const req = requests.find((r) => r.id === id);
    if (!req) return;
    const full = req.needed <= 0;
    setRequests((prev) =>
      prev.map((r) =>
        r.id !== id ? r : full ? { ...r, waitlist: r.waitlist + 1 } : { ...r, needed: r.needed - 1 }
      )
    );
    setMyAction((a) => ({ ...a, [id]: full ? "waitlist" : "joined" }));
  };

  const handleDismiss = (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    setMyAction((a) => {
      const { [id]: _removed, ...rest } = a;
      return rest;
    });
  };

  const card = (req: PlayerRequest) => {
    const ms = now > 0 ? new Date(req.kickoffAt).getTime() - now : 0;
    const cd = now > 0 ? formatCountdown(ms) : null;
    const urg = now > 0 ? urgency(ms) : "calm";
    const joined = req.capacity - req.needed;
    const pct = Math.round((joined / req.capacity) * 100);
    const word = req.needed === 1 ? "player" : "players";
    const full = req.needed <= 0;
    const action = myAction[req.id];
    const mt = matchTypeMeta[req.matchType];

    return (
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-card p-3.5 h-full flex flex-col">
        <div className="flex items-start gap-2.5">
          <Avatar alt={req.organizerName} src={req.organizerAvatar} size="sm" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-body-xs font-semibold text-neutral-900 truncate">{req.organizerName}</span>
              {req.verified && <CheckCircleIcon size={13} className="text-electric-blue flex-shrink-0" />}
            </div>
            <Link href={`/${req.organizerUsername}`} className="text-caption text-neutral-400 hover:text-electric-blue truncate block">
              @{req.organizerUsername}
            </Link>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="flex items-center gap-0.5 text-caption text-neutral-400">
              <MapPinIcon size={11} />
              {req.distanceKm} km
            </span>
            <button
              type="button"
              onClick={() => handleDismiss(req.id)}
              aria-label="Dismiss request"
              className="w-6 h-6 rounded-md hover:bg-neutral-100 text-neutral-300 hover:text-neutral-500 flex items-center justify-center"
            >
              <XIcon size={14} />
            </button>
          </div>
        </div>

        <p className="text-body-xs text-neutral-700 leading-snug mt-2.5">
          {full ? (
            <>
              <Link href={`/${req.organizerUsername}`} className="font-semibold text-neutral-900 hover:text-electric-blue">@{req.organizerUsername}</Link>{" "}
              {sportName[req.sport]} match is full
            </>
          ) : (
            <>
              <Link href={`/${req.organizerUsername}`} className="font-semibold text-neutral-900 hover:text-electric-blue">@{req.organizerUsername}</Link>{" "}
              is looking for{" "}
              <span className="font-semibold text-neutral-900">{req.needed} {sportName[req.sport]} {word}</span>{" "}
              in <span className="font-semibold text-neutral-900">{req.area}</span>
              {req.teamName ? (
                <> for <span className="font-semibold text-neutral-900">{req.teamName}</span></>
              ) : null}
            </>
          )}
        </p>

        <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
          <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-caption font-semibold", urgText[urg], urgBg[urg])}>
            {urg === "critical" && (
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral opacity-70" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-coral" />
              </span>
            )}
            <ClockIcon size={11} />
            {now > 0 ? (cd ? `Starts ${cd}` : "Starting now") : "Starts soon"}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-100 text-caption text-neutral-600 font-medium">
            <span className={cn("flex items-center", sportText[req.sport])}>{sportIcon[req.sport]}</span>
            {sportName[req.sport]}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-100 text-caption text-neutral-600 font-medium">
            <mt.Icon size={11} />
            {mt.label}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-caption text-neutral-600 font-medium capitalize">
            {req.skill === "any" ? "All levels" : req.skill}
          </span>
          {req.mutuals ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-electric-blue/10 text-caption text-electric-blue font-medium">
              <UsersIcon size={11} />
              {req.mutuals} mutuals
            </span>
          ) : null}
        </div>

        <p className="flex items-center gap-1 text-caption text-neutral-500 mt-2">
          <MapPinIcon size={11} />
          <span className="font-medium text-neutral-700">{req.venue}</span>
        </p>

        <div className="mt-2.5">
          <div className="h-1.5 rounded-full bg-neutral-100 overflow-hidden">
            <div className="h-full rounded-full bg-primary-green transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-caption text-neutral-500">{joined}/{req.capacity} joined</span>
            {full ? (
              <Badge variant="info" size="sm" animated={false}>Waitlist {req.waitlist}</Badge>
            ) : (
              <span className="text-caption font-semibold text-neutral-700">{req.needed} left</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <motion.button
            type="button"
            whileTap={action ? undefined : { scale: 0.96 }}
            disabled={!!action}
            onClick={() => handleJoin(req.id)}
            className={cn(
              "flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-body-xs font-semibold transition-colors",
              action === "joined"
                ? "bg-emerald/10 text-emerald border border-emerald/20 cursor-default"
                : action === "waitlist"
                ? "bg-amber/10 text-amber border border-amber/20 cursor-default"
                : full
                ? "bg-electric-blue text-white hover:bg-electric-blue-hover"
                : "bg-primary-green text-white hover:bg-primary-green/90"
            )}
          >
            {action === "joined" ? (
              <><CheckCircleIcon size={14} />Joined</>
            ) : action === "waitlist" ? (
              <><CheckCircleIcon size={14} />On waitlist</>
            ) : full ? (
              <><UsersIcon size={14} />Join waitlist</>
            ) : (
              <><RunIcon size={14} />Join now</>
            )}
          </motion.button>
          <Link
            href="/games"
            className="px-3 py-2 rounded-xl border border-neutral-200 text-neutral-500 text-body-xs font-medium hover:bg-neutral-50 inline-flex items-center gap-1"
          >
            Details
            <ChevronRightIcon size={13} />
          </Link>
        </div>
      </div>
    );
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sunset-orange opacity-60" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sunset-orange" />
          </span>
          <h2 className="text-body-sm font-semibold text-neutral-900 font-display">Players wanted</h2>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-sunset-orange/10 text-caption font-semibold text-sunset-orange">
          {visible.length} live
        </span>
      </div>
      {variant === "rail" && (
        <p className="text-caption text-neutral-400 -mt-1 mb-3">Real-time requests near you</p>
      )}

      {variant === "rail" ? (
        <div className="flex flex-col gap-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((req) => {
              const ms = now > 0 ? new Date(req.kickoffAt).getTime() - now : 1;
              const critical = now > 0 && ms > 0 && ms <= 15 * 60000;
              return (
                <motion.div
                  key={req.id}
                  layout
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 40, scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 320, damping: 28 }}
                  className={cn(critical && "ring-1 ring-coral/30 rounded-2xl")}
                >
                  {card(req)}
                </motion.div>
              );
            })}
          </AnimatePresence>
          {visible.length > 3 && (
            <Link href="/games" className="block text-center text-body-xs text-electric-blue font-medium hover:underline">
              See all requests
            </Link>
          )}
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
          {visible.map((req) => (
            <div key={req.id} className="w-[268px] flex-shrink-0">
              {card(req)}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}