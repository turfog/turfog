"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import { fetchMatchDetail, fetchMatchDetailStats } from "@/lib/matchDetail";
import type { MatchDetail, MatchDetailPlayerStat } from "@/lib/matchDetail";
import { ArrowLeftIcon, TrophyIcon, MapPinIcon, ClockIcon, StarIcon } from "@/components/SvgIcons";

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function statLine(p: MatchDetailPlayerStat, sport: string): string {
  const parts: string[] = [];
  if (sport === "football") {
    if (p.goals > 0) parts.push(`${p.goals} goal${p.goals === 1 ? "" : "s"}`);
    if (p.assists > 0) parts.push(`${p.assists} assist${p.assists === 1 ? "" : "s"}`);
    if (p.saves > 0) parts.push(`${p.saves} save${p.saves === 1 ? "" : "s"}`);
  } else if (sport === "box-cricket") {
    if (p.runs > 0) parts.push(`${p.runs} run${p.runs === 1 ? "" : "s"}`);
    if (p.wickets > 0) parts.push(`${p.wickets} wicket${p.wickets === 1 ? "" : "s"}`);
  } else {
    if (p.points > 0) parts.push(`${p.points} point${p.points === 1 ? "" : "s"}`);
  }
  return parts.length > 0 ? parts.join(", ") : "played";
}

export default function MatchDetailClient({ matchId }: { matchId: string }) {
  const [match, setMatch] = useState<MatchDetail | null>(null);
  const [stats, setStats] = useState<MatchDetailPlayerStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!matchId) { setLoading(false); return; }
    Promise.all([fetchMatchDetail(matchId), fetchMatchDetailStats(matchId)]).then(([m, s]) => {
      setMatch(m);
      setStats(s);
      setLoading(false);
    });
  }, [matchId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-4">
          <div className="h-4 w-24 rounded bg-neutral-200 animate-pulse" />
          <div className="h-40 rounded-2xl bg-neutral-200 animate-pulse" />
          <div className="h-64 rounded-2xl bg-neutral-200 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-neutral-100 flex flex-col items-center justify-center gap-3">
        <div className="w-14 h-14 rounded-full bg-neutral-200 flex items-center justify-center"><TrophyIcon size={26} className="text-neutral-400" /></div>
        <p className="text-body-md font-semibold text-neutral-900">Match not found</p>
        <Link href="/matches" className="text-body-sm text-electric-blue font-medium hover:underline">Back to matches</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-5">
        <Link href="/matches" className="inline-flex items-center gap-1.5 text-body-sm text-neutral-500 hover:text-neutral-900 transition-colors">
          <ArrowLeftIcon size={16} />
          Matches
        </Link>

        <Card padding="lg">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-green/10 text-primary-green text-caption font-semibold capitalize">
              {match.sport.replace(/-/g, " ")}
            </span>
            <div className="flex items-center justify-center gap-6 mt-5">
              <div className="flex-1 min-w-0">
                <p className="text-body-md font-semibold text-neutral-900 font-display truncate">{match.teamAName}</p>
              </div>
              <p className="text-display-sm font-bold text-neutral-900 font-display flex-shrink-0">
                {match.scoreA} <span className="text-neutral-400">-</span> {match.scoreB}
              </p>
              <div className="flex-1 min-w-0">
                <p className="text-body-md font-semibold text-neutral-900 font-display truncate">{match.teamBName}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 text-caption text-neutral-400 mt-4">
              {match.venue && (
                <span className="flex items-center gap-1"><MapPinIcon size={12} />{match.venue}</span>
              )}
              <span className="flex items-center gap-1"><ClockIcon size={12} />{formatDate(match.playedAt || match.createdAt)}</span>
            </div>
          </div>
        </Card>

        <Card padding="lg">
          <h2 className="text-body-md font-semibold text-neutral-900 font-display mb-4">Player stats</h2>
          {stats.length === 0 ? (
            <p className="text-body-sm text-neutral-400 text-center py-6">No stats recorded for this match yet.</p>
          ) : (
            <div className="space-y-2">
              {stats.map((p) => (
                <Link key={p.userId} href={`/${p.username}`}>
                  <div className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-neutral-50 transition-colors">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar alt={p.name} src={p.avatar} size="sm" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-body-xs font-semibold text-neutral-900 truncate">{p.name}</p>
                          {p.mvp && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber/10 text-amber text-caption font-semibold flex-shrink-0">
                              <StarIcon size={10} />MVP
                            </span>
                          )}
                        </div>
                        <p className="text-caption text-neutral-400">{statLine(p, match.sport)}</p>
                      </div>
                    </div>
                    <ArrowLeftIcon size={14} className="text-neutral-300 rotate-180 flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}