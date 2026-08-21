"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchTeamVerifiedStats } from "@/lib/teamStats";
import type { TeamVerifiedStats } from "@/lib/teamStats";
import { ShieldIcon } from "@/components/SvgIcons";

export default function TeamStatsCard({ teamId }: { teamId: string }) {
  const [stats, setStats] = useState<TeamVerifiedStats | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchTeamVerifiedStats(teamId).then((s) => { if (mounted) setStats(s); });
    return () => { mounted = false; };
  }, [teamId]);

  if (!stats) {
    return (
      <div className="surface-card p-5 animate-pulse">
        <div className="h-3 w-32 bg-black/[0.06] rounded-full mb-4" />
        <div className="grid grid-cols-4 gap-3">
          {[0, 1, 2, 3].map((i) => <div key={i} className="h-14 bg-black/[0.04] rounded-xl" />)}
        </div>
      </div>
    );
  }

  const tiles = [
    { label: "Played", value: stats.played, cls: "text-neutral-900" },
    { label: "Won", value: stats.wins, cls: "text-emerald-600" },
    { label: "Drawn", value: stats.draws, cls: "text-neutral-500" },
    { label: "Lost", value: stats.losses, cls: "text-coral" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
      className="surface-card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[12px] font-semibold text-neutral-500 uppercase tracking-wider">Team record</h3>
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100/60 border border-emerald-200/60 text-[10px] font-bold text-emerald-700 uppercase tracking-wide">
          <ShieldIcon size={11} />
          Verified only
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2.5">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-xl bg-black/[0.02] border border-black/[0.05] px-2 py-3 text-center">
            <p className={`text-[22px] font-bold font-display ${t.cls}`}>{t.value}</p>
            <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mt-0.5">{t.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-[11px] font-medium text-neutral-500 mb-1.5">
          <span>Win rate</span>
          <span className="text-emerald-600 font-bold">{stats.winRate}%</span>
        </div>
        <div className="h-2 rounded-full bg-black/[0.05] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stats.winRate}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.15 }}
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-black/[0.05] text-[12px]">
        <span className="text-neutral-500">Goals for <span className="font-bold text-neutral-900">{stats.goalsFor}</span></span>
        <span className="text-neutral-500">Goals against <span className="font-bold text-neutral-900">{stats.goalsAgainst}</span></span>
        <span className="text-neutral-500">Diff <span className={`font-bold ${stats.goalsFor - stats.goalsAgainst >= 0 ? "text-emerald-600" : "text-coral"}`}>{stats.goalsFor - stats.goalsAgainst >= 0 ? "+" : ""}{stats.goalsFor - stats.goalsAgainst}</span></span>
      </div>

      {stats.played === 0 && (
        <p className="text-[11px] text-neutral-400 mt-3">No verified matches yet. Records update automatically once opponents confirm results.</p>
      )}
    </motion.div>
  );
}