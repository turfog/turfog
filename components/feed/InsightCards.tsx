"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import { fetchInsights } from "@/lib/insights";
import type { Insight } from "@/lib/insights";
import { UsersIcon, TrophyIcon, PlusIcon, ChevronRightIcon } from "@/components/SvgIcons";

const iconFor = {
  players: UsersIcon,
  match: UsersIcon,
  market: PlusIcon,
  trophy: TrophyIcon,
};

export default function InsightCards() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights().then((i) => {
      setInsights(i);
      setLoading(false);
    });
  }, []);

  if (loading || insights.length === 0) return null;

  return (
    <div className="space-y-3">
      {insights.map((ins) => {
        const Icon = iconFor[ins.icon];
        return (
          <Link key={ins.id} href={ins.href}>
            <Card padding="md" className="hover:border-primary-green/40 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-green/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-primary-green" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-body-sm font-semibold text-neutral-900">{ins.title}</p>
                  <p className="text-body-xs text-neutral-500">{ins.detail}</p>
                </div>
                <ChevronRightIcon size={16} className="text-neutral-300 flex-shrink-0" />
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}