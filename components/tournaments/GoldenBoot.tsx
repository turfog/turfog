"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchGoldenBoot } from "@/lib/goldenBoot";
import type { Scorer } from "@/lib/goldenBoot";
import Avatar from "@/components/ui/Avatar";
import { TrophyIcon } from "@/components/SvgIcons";

const rankClass = (i: number): string => {
  if (i === 0) return "bg-gold/20 text-gold";
  if (i === 1) return "bg-neutral-300/40 text-neutral-600";
  if (i === 2) return "bg-sunset-orange/20 text-sunset-orange";
  return "bg-neutral-100 text-neutral-500";
};

export default function GoldenBoot() {
  const [scorers, setScorers] = useState<Scorer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGoldenBoot(undefined, 10).then((s) => {
      setScorers(s);
      setLoading(false);
    });
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-card p-5">
      <div className="flex items-center gap-3 mb-4">
        <span className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center">
          <TrophyIcon size={22} className="text-gold" />
        </span>
        <div>
          <h3 className="text-body-lg font-semibold text-neutral-900 font-display">Golden Boot</h3>
          <p className="text-caption text-neutral-400">Top scorers — goals first, assists break ties</p>
        </div>
      </div>

      {loading ? (
        <p className="text-body-sm text-neutral-400 py-6 text-center">Loading scorers...</p>
      ) : scorers.length === 0 ? (
        <p className="text-body-sm text-neutral-400 py-6 text-center">
          No goals recorded yet. Play a match to get on the board.
        </p>
      ) : (
        <div className="space-y-1.5">
          {scorers.map((s, i) => (
            <Link
              key={s.userId}
              href={s.username ? `/${s.username}` : "#"}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-neutral-50 transition-colors"
            >
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-body-sm font-bold ${rankClass(i)}`}>
                {i + 1}
              </span>
              <Avatar alt={s.name} src={s.avatar} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-body-sm font-semibold text-neutral-900 truncate">{s.name}</p>
                <p className="text-caption text-neutral-400">
                  {s.assists} assists · {s.matches} matches
                </p>
              </div>
              <div className="text-right">
                <p className="text-body-lg font-bold text-neutral-900 font-display">{s.goals}</p>
                <p className="text-caption text-neutral-400">goals</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}