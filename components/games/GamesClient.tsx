"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useLocation } from "@/context/LocationContext";
import {
  fetchActiveRequests,
  fetchMyParticipants,
  joinRequest,
  subscribeRequests,
  haversineKm,
} from "@/lib/discovery";
import type { MatchRequestRow } from "@/lib/discovery";
import type { SportId } from "@/types";
import {
  MapPinIcon,
  ClockIcon,
  UsersIcon,
  ArrowLeftIcon,
  PlusIcon,
  FootballIcon,
  CricketIcon,
  PickleballIcon,
  PadelIcon,
  BadmintonIcon,
} from "@/components/SvgIcons";

const sportIconMap: Record<SportId, React.ReactNode> = {
  football: <FootballIcon size={18} />,
  "box-cricket": <CricketIcon size={18} />,
  pickleball: <PickleballIcon size={18} />,
  padel: <PadelIcon size={18} />,
  badminton: <BadmintonIcon size={18} />,
};

const sportName: Record<SportId, string> = {
  football: "Football",
  "box-cricket": "Box cricket",
  pickleball: "Pickleball",
  padel: "Padel",
  badminton: "Badminton",
};

const SPORTS = new Set<SportId>(["football", "box-cricket", "pickleball", "padel", "badminton"]);
function safeSport(v: string | null | undefined): SportId {
  return v && SPORTS.has(v as SportId) ? (v as SportId) : "football";
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

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const itemVariants = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } } };

export default function GamesClient() {
  const { lat, lng, radius } = useLocation();
  const [rows, setRows] = useState<MatchRequestRow[]>([]);
  const [myActions, setMyActions] = useState<Record<string, "joined" | "waitlist">>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<SportId | "all">("all");
  const [busy, setBusy] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const [r, m] = await Promise.all([fetchActiveRequests(), fetchMyParticipants()]);
      setRows(r);
      setMyActions(m);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const unsub = subscribeRequests(() => refresh());
    return unsub;
  }, [refresh]);

  const games = useMemo(() => {
    const mapped = rows.map((r) => {
      const sport = safeSport(r.sport);
      const distanceKm = lat != null && lng != null && r.latitude != null && r.longitude != null ? haversineKm(lat, lng, r.latitude, r.longitude) : null;
      return {
        id: r.id,
        sport,
        title: `${sportName[sport]} at ${r.venue || r.area || "the turf"}`,
        venue: r.venue,
        area: r.area,
        time: formatKickoff(r.kickoff_at),
        playersJoined: Math.max(0, (r.capacity ?? 0) - (r.needed ?? 0)),
        playersNeeded: r.needed ?? 0,
        skill: r.skill,
        host: r.organizer_name,
        distanceKm,
      };
    });
    const inRadius = lat != null && lng != null ? mapped.filter((g) => g.distanceKm == null || g.distanceKm <= radius) : mapped;
    const bySport = filter === "all" ? inRadius : inRadius.filter((g) => g.sport === filter);
    return bySport.sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));
  }, [rows, lat, lng, radius, filter]);

  const onJoin = async (id: string, needed: number) => {
    if (myActions[id] || busy) return;
    setBusy(id);
    await joinRequest(id, needed <= 0);
    await refresh();
    setBusy(null);
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-1">
            <Link href="/" className="flex items-center gap-2 text-body-xs text-neutral-400 hover:text-neutral-600 transition-colors">
              <ArrowLeftIcon size={14} />
              Home
            </Link>
            <Link href="/#composer">
              <Button size="sm" variant="primary">
                <PlusIcon size={15} />
                Create match
              </Button>
            </Link>
          </div>
          <h1 className="text-display-sm font-bold text-neutral-900 font-display">Games</h1>
          <p className="text-body-sm text-neutral-500">Live matches near you. Join one or post your own.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {(["all", "football", "box-cricket", "pickleball", "padel", "badminton"] as const).map((sportId) => (
            <button
              key={sportId}
              onClick={() => setFilter(sportId)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-full text-body-xs font-medium whitespace-nowrap border transition-all",
                filter === sportId ? "bg-primary-green text-white border-primary-green" : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"
              )}
            >
              {sportId !== "all" && sportIconMap[sportId]}
              {sportId === "all" ? "All" : sportName[sportId]}
            </button>
          ))}
        </div>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-3xl mx-auto px-6 pb-12 space-y-4">
        {loading ? (
          <p className="text-center py-12 text-body-sm text-neutral-400">Loading live games...</p>
        ) : games.length === 0 ? (
          <p className="text-center py-12 text-body-sm text-neutral-400">No live games in this radius yet. Be the first to post one.</p>
        ) : (
          games.map((game) => {
            const action = myActions[game.id];
            return (
              <motion.div key={game.id} variants={itemVariants}>
                <Card padding="md" className="hover:border-primary-green/30 group">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 bg-primary-green/10 rounded-xl flex items-center justify-center flex-shrink-0 text-primary-green">
                      {sportIconMap[game.sport]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-body-sm font-semibold text-neutral-900 mb-1">{game.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-body-xs text-neutral-400 mb-2">
                        <span className="flex items-center gap-1"><MapPinIcon size={12} />{game.venue}{game.area ? `, ${game.area}` : ""}</span>
                        <span className="flex items-center gap-1"><ClockIcon size={12} />{game.time}</span>
                        <span className="flex items-center gap-1"><UsersIcon size={12} />{game.playersJoined} joined</span>
                        {game.distanceKm != null && <span className="flex items-center gap-1"><MapPinIcon size={12} />{game.distanceKm.toFixed(1)} km</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={game.playersNeeded > 0 ? "warning" : "success"} size="sm" animated={false}>
                          {game.playersNeeded > 0 ? `Need ${game.playersNeeded} more` : "Full squad"}
                        </Badge>
                        <span className="text-caption text-neutral-400 capitalize">{game.skill}</span>
                        <span className="text-caption text-neutral-400">by {game.host}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {action ? (
                        <Badge variant={action === "joined" ? "success" : "info"} size="sm" animated={false}>
                          {action === "joined" ? "Joined" : "Waitlist"}
                        </Badge>
                      ) : (
                        <Button size="sm" variant="primary" loading={busy === game.id} onClick={() => onJoin(game.id, game.playersNeeded)}>
                          {game.playersNeeded > 0 ? "Join" : "Waitlist"}
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })
        )}
      </motion.div>
    </div>
  );
}