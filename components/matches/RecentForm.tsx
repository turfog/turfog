"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import { fetchPlayerMatches } from "@/lib/playerMatches";
import type { PlayerMatchEntry } from "@/lib/playerMatches";
import { ClockIcon, MapPinIcon, StarIcon, TrophyIcon } from "@/components/SvgIcons";

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function statLine(e: PlayerMatchEntry): string {
  const parts: string[] = [];
  if (e.sport === "football") {
    if (e.goals > 0) parts.push(`${e.goals} goal${e.goals === 1 ? "" : "s"}`);
    if (e.assists > 0) parts.push(`${e.assists} assist${e.assists === 1 ? "" : "s"}`);
    if (e.saves > 0) parts.push(`${e.saves} save${e.saves === 1 ? "" : "s"}`);
  } else if (e.sport === "box-cricket") {
    if (e.runs > 0) parts.push(`${e.runs} run${e.runs === 1 ? "" : "s"}`);
    if (e.wickets > 0) parts.push(`${e.wickets} wicket${e.wickets === 1 ? "" : "s"}`);
  } else {
    if (e.points > 0) parts.push(`${e.points} point${e.points === 1 ? "" : "s"}`);
  }
  return parts.length > 0 ? parts.join(", ") : "played";
}

export default function RecentForm({ targetUserId }: { targetUserId: string }) {
  const [entries, setEntries] = useState<PlayerMatchEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!targetUserId) { setLoading(false); return; }
    fetchPlayerMatches(targetUserId).then((e) => { setEntries(e); setLoading(false); });
  }, [targetUserId]);

  if (!targetUserId) return null;

  if (loading) {
    return (
      <section className="max-w-3xl mx-auto px-6 pb-6">
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-card p-6">
          <div className="h-4 w-1/3 rounded bg-neutral-100 animate-pulse mb-4" />
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-14 rounded-xl bg-neutral-100 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (entries.length === 0) return null;

  return (
    <section className="max-w-3xl mx-auto px-6 pb-6">
      <Card padding="lg">
        <div className="flex items-center gap-2 mb-4">
          <TrophyIcon size={18} className="text-primary-green" />
          <h2 className="text-body-md font-semibold text-neutral-900 font-display">Recent form</h2>
        </div>
        <div>
          {entries.map((e) => (
            <div key={e.matchId} className="flex items-center justify-between gap-3 py-3 border-b border-neutral-100 last:border-0 last:pb-0 first:pt-0">
              <div className="flex-1 min-w-0">
                <p className="text-body-sm font-semibold text-neutral-900">
                  {e.teamAName} <span className="text-neutral-400">{e.scoreA} - {e.scoreB}</span> {e.teamBName}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-caption text-neutral-400 mt-0.5">
                  <span className="capitalize">{e.sport.replace(/-/g, " ")}</span>
                  {e.venue && (
                    <span className="flex items-center gap-0.5"><MapPinIcon size={11} />{e.venue}</span>
                  )}
                  <span className="flex items-center gap-0.5"><ClockIcon size={11} />{formatDate(e.playedAt)}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                {e.mvp && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber/10 text-amber text-caption font-semibold mb-0.5">
                    <StarIcon size={11} />MVP
                  </span>
                )}
                <p className="text-caption text-neutral-500">{statLine(e)}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}