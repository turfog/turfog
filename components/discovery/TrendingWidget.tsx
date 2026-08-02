"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import Card from "@/components/ui/Card";
import { FireIcon, UsersIcon } from "@/components/SvgIcons";

const items = [
  { sport: "Football", count: 128, tag: "5v5 tonight" },
  { sport: "Box cricket", count: 96, tag: "Night league" },
  { sport: "Badminton", count: 74, tag: "Doubles open" },
];

export default function TrendingWidget() {
  return (
    <Card padding="md">
      <div className="flex items-center gap-2 mb-3">
        <FireIcon size={16} className="text-coral" />
        <h3 className="text-body-sm font-semibold text-neutral-900">Trending near you</h3>
      </div>
      <div className="space-y-2.5">
        {items.map((it, i) => (
          <Link key={it.sport} href="/games" className="flex items-center gap-3 group">
            <span
              className={cn(
                "w-6 h-6 rounded-lg flex items-center justify-center text-caption font-bold",
                i === 0 ? "bg-coral/10 text-coral" : i === 1 ? "bg-amber/10 text-amber" : "bg-emerald/10 text-emerald"
              )}
            >
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-body-xs font-semibold text-neutral-900 truncate group-hover:text-electric-blue transition-colors">
                {it.sport}
              </p>
              <p className="text-caption text-neutral-400">{it.tag}</p>
            </div>
            <span className="flex items-center gap-1 text-caption text-neutral-400">
              <UsersIcon size={11} />
              {it.count}
            </span>
          </Link>
        ))}
      </div>
    </Card>
  );
}