"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Card from "@/components/ui/Card";
import { fetchAchievementStats, computeAchievements } from "@/lib/achievements";
import type { Achievement } from "@/lib/achievements";
import { TrophyIcon, StarIcon, ShieldIcon, UsersIcon, CheckCircleIcon } from "@/components/SvgIcons";

const ICONS = {
  users: UsersIcon,
  shield: ShieldIcon,
  trophy: TrophyIcon,
  star: StarIcon,
};

export default function AchievementsPanel({ targetUserId }: { targetUserId: string }) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!targetUserId) { setLoading(false); return; }
    fetchAchievementStats(targetUserId).then((s) => {
      setAchievements(computeAchievements(s));
      setLoading(false);
    });
  }, [targetUserId]);

  if (!targetUserId) return null;

  if (loading) {
    return (
      <section className="max-w-3xl mx-auto px-6 pb-6">
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-card p-6">
          <div className="h-4 w-1/3 rounded bg-neutral-100 animate-pulse mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-28 rounded-xl bg-neutral-100 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const earnedCount = achievements.filter((a) => a.earned).length;
  const sorted = [...achievements].sort((a, b) => {
    if (a.earned !== b.earned) return a.earned ? -1 : 1;
    return (b.current / b.target) - (a.current / a.target);
  });

  return (
    <section className="max-w-3xl mx-auto px-6 pb-6">
      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrophyIcon size={18} className="text-primary-green" />
            <h2 className="text-body-md font-semibold text-neutral-900 font-display">Achievements</h2>
          </div>
          <span className="text-caption font-semibold text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full">
            {earnedCount} / {achievements.length}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {sorted.map((a) => {
            const Icon = ICONS[a.icon as keyof typeof ICONS] ?? StarIcon;
            const pct = Math.min(100, Math.round((a.current / a.target) * 100));
            return (
              <div
                key={a.id}
                className={cn(
                  "rounded-xl border p-3 text-center transition-colors",
                  a.earned ? "bg-amber/5 border-amber/30" : "bg-white border-neutral-200"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2",
                    a.earned ? "bg-amber/15 text-amber" : "bg-neutral-100 text-neutral-300"
                  )}
                >
                  <Icon size={20} />
                </div>
                <p className={cn("text-body-xs font-semibold", a.earned ? "text-neutral-900" : "text-neutral-400")}>{a.title}</p>
                <p className="text-caption text-neutral-400 mt-0.5">{a.description}</p>
                {a.earned ? (
                  <span className="inline-flex items-center gap-1 mt-2 text-caption font-semibold text-amber">
                    <CheckCircleIcon size={12} />Earned
                  </span>
                ) : (
                  <div className="mt-2">
                    <div className="h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                      <div className="h-full rounded-full bg-primary-green" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-caption text-neutral-400 mt-1">{a.current} / {a.target}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </section>
  );
}