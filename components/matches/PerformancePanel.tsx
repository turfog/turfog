"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import { fetchPlayerStats } from "@/lib/matches";
import type { PlayerStats } from "@/lib/matches";
import { TrophyIcon, StarIcon } from "@/components/SvgIcons";

export default function PerformancePanel({ targetUserId }: { targetUserId: string }) {
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!targetUserId) { setLoading(false); return; }
    fetchPlayerStats(targetUserId).then((s) => { setStats(s); setLoading(false); });
  }, [targetUserId]);

  if (!targetUserId) return null;
  if (loading) {
    return (
      <section className="max-w-3xl mx-auto px-6 pb-6">
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-100 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 rounded bg-neutral-100 animate-pulse" />
            <div className="h-2.5 w-1/2 rounded bg-neutral-100 animate-pulse" />
          </div>
        </div>
      </section>
    );
  }
  if (!stats || stats.matchesPlayed === 0) {
    return (
      <section className="max-w-3xl mx-auto px-6 pb-6">
        <Card padding="lg">
          <div className="flex items-center gap-2 mb-2">
            <TrophyIcon size={20} className="text-primary-green" />
            <h2 className="text-body-md font-semibold text-neutral-900 font-display">Performance</h2>
          </div>
          <p className="text-body-xs text-neutral-400 mb-3">No recorded matches yet.</p>
          <Link href="/matches" className="text-body-xs text-electric-blue font-medium hover:underline">Record a match result</Link>
        </Card>
      </section>
    );
  }

  const lines = [
    { label: "Goals", value: stats.goals },
    { label: "Assists", value: stats.assists },
    { label: "Runs", value: stats.runs },
    { label: "Wickets", value: stats.wickets },
    { label: "Saves", value: stats.saves },
    { label: "Points", value: stats.points },
  ].filter((l) => l.value > 0);

  return (
    <section className="max-w-3xl mx-auto px-6 pb-6">
      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrophyIcon size={20} className="text-primary-green" />
            <h2 className="text-body-md font-semibold text-neutral-900 font-display">Performance</h2>
          </div>
          <Link href="/matches" className="text-body-xs text-electric-blue font-medium hover:underline">Match history</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-neutral-50 rounded-xl p-3 text-center">
            <p className="text-display-xs font-bold text-neutral-900">{stats.matchesPlayed}</p>
            <p className="text-caption text-neutral-400">Matches</p>
          </div>
          <div className="bg-neutral-50 rounded-xl p-3 text-center">
            <p className="text-display-xs font-bold text-neutral-900 flex items-center justify-center gap-1"><StarIcon size={14} className="text-amber" />{stats.mvps}</p>
            <p className="text-caption text-neutral-400">MVPs</p>
          </div>
          {lines.slice(0, 2).map((l) => (
            <div key={l.label} className="bg-neutral-50 rounded-xl p-3 text-center">
              <p className="text-display-xs font-bold text-neutral-900">{l.value}</p>
              <p className="text-caption text-neutral-400">{l.label}</p>
            </div>
          ))}
        </div>
        {lines.length > 2 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {lines.slice(2).map((l) => (
              <span key={l.label} className="px-2.5 py-1 rounded-full bg-primary-green/10 text-primary-green text-caption font-semibold">{l.label}: {l.value}</span>
            ))}
          </div>
        )}
      </Card>
    </section>
  );
}