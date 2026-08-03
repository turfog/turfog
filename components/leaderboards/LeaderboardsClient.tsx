"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";
import { fetchLeaderboards } from "@/lib/leaderboards";
import type { Leaderboards, LeaderboardEntry } from "@/lib/leaderboards";
import {
  ZapIcon,
  HeartIcon,
  ShieldIcon,
  TrophyIcon,
  StarIcon,
  ArrowLeftIcon,
  MapPinIcon,
  CheckCircleIcon,
} from "@/components/SvgIcons";

type BoardId = "active" | "favorites" | "reliable" | "matchmakers" | "leaders";

const BOARDS: Array<{ id: BoardId; label: string; Icon: (p: { size?: number; className?: string }) => React.ReactNode; desc: string; unit: string }> = [
  { id: "active", label: "Most active", Icon: ZapIcon, desc: "Posts plus matches joined", unit: "actions" },
  { id: "favorites", label: "Community favorites", Icon: HeartIcon, desc: "Most followers", unit: "followers" },
  { id: "reliable", label: "Most reliable", Icon: ShieldIcon, desc: "Highest reliability score", unit: "score" },
  { id: "matchmakers", label: "Top matchmakers", Icon: TrophyIcon, desc: "Matches organized", unit: "matches" },
  { id: "leaders", label: "Leaders", Icon: StarIcon, desc: "Captain and owner roles", unit: "roles" },
];

function rankCls(rank: number): string {
  if (rank === 0) return "bg-amber/15 text-amber border-amber/30";
  if (rank === 1) return "bg-neutral-200 text-neutral-600 border-neutral-300";
  if (rank === 2) return "bg-sunset-orange/15 text-sunset-orange border-sunset-orange/30";
  return "bg-neutral-100 text-neutral-500 border-neutral-200";
}

export default function LeaderboardsClient() {
  const [data, setData] = useState<Leaderboards | null>(null);
  const [loading, setLoading] = useState(true);
  const [board, setBoard] = useState<BoardId>("active");
  const [city, setCity] = useState("all");

  useEffect(() => {
    fetchLeaderboards().then((r) => { setData(r); setLoading(false); });
  }, []);

  const entries: LeaderboardEntry[] = data ? data[board] : [];
  const cities = useMemo(() => Array.from(new Set(entries.map((e) => e.city).filter(Boolean))), [entries]);
  const shown = city === "all" ? entries : entries.filter((e) => e.city === city);
  const activeBoard = BOARDS.find((b) => b.id === board) ?? BOARDS[0];

  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <Link href="/" className="flex items-center gap-2 text-body-xs text-neutral-400 hover:text-neutral-600 transition-colors mb-2">
            <ArrowLeftIcon size={14} />
            Home
          </Link>
          <div className="flex items-center gap-2">
            <TrophyIcon size={22} className="text-primary-green" />
            <h1 className="text-display-sm font-bold text-neutral-900 font-display">Leaderboards</h1>
          </div>
          <p className="text-body-sm text-neutral-500">Live rankings from real matches, posts, and community activity.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-4 space-y-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {BOARDS.map((b) => (
            <button
              key={b.id}
              onClick={() => { setBoard(b.id); setCity("all"); }}
              className={cn("flex items-center gap-1.5 px-4 py-2 rounded-full text-body-xs font-medium whitespace-nowrap border transition-all", board === b.id ? "bg-primary-green text-white border-primary-green" : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300")}
            >
              <b.Icon size={14} />
              {b.label}
            </button>
          ))}
        </div>

        {cities.length > 0 && (
          <div className="flex items-center gap-2">
            <MapPinIcon size={15} className="text-neutral-400" />
            <select value={city} onChange={(e) => setCity(e.target.value)} className="px-3 py-2 rounded-xl border border-neutral-200 text-body-xs font-medium text-neutral-700 bg-white outline-none focus:border-primary-green">
              <option value="all">All cities</option>
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-neutral-200 shadow-card p-4 mb-1">
          <div className="flex items-center gap-2">
            <activeBoard.Icon size={18} className="text-primary-green" />
            <h2 className="text-body-md font-semibold text-neutral-900 font-display">{activeBoard.label}</h2>
          </div>
          <p className="text-caption text-neutral-400 mt-0.5">{activeBoard.desc}</p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-neutral-200 p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-neutral-100 animate-pulse" />
                <div className="w-10 h-10 rounded-full bg-neutral-100 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-1/3 rounded bg-neutral-100 animate-pulse" />
                  <div className="h-2.5 w-1/4 rounded bg-neutral-100 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : shown.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-3"><TrophyIcon size={26} className="text-neutral-300" /></div>
            <p className="text-body-sm text-neutral-500">No rankings yet for this board.</p>
            <p className="text-caption text-neutral-400 mt-1">Play matches, post moments, and lead teams to climb.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {shown.map((e, rank) => (
              <Link key={e.userId} href={`/${e.username}`}>
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-card p-4 flex items-center gap-3 hover:border-primary-green/30 transition-colors">
                  <span className={cn("w-8 h-8 rounded-lg border flex items-center justify-center text-body-xs font-bold flex-shrink-0", rankCls(rank))}>{rank + 1}</span>
                  <Avatar alt={e.fullName} src={e.avatar} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-body-sm font-semibold text-neutral-900 truncate">{e.fullName}</span>
                      {e.verified && <CheckCircleIcon size={14} className="text-electric-blue flex-shrink-0" />}
                    </div>
                    <div className="flex items-center gap-2 text-caption text-neutral-400">
                      <span className="truncate">@{e.username}</span>
                      {e.city && <span className="flex items-center gap-0.5"><MapPinIcon size={11} />{e.city}</span>}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-display-xs font-bold text-neutral-900">{board === "reliable" ? e.value.toFixed(1) : e.value}</p>
                    <p className="text-caption text-neutral-400">{activeBoard.unit}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}