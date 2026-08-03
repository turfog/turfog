"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Card from "@/components/ui/Card";
import { fetchEndorsementSummary, addEndorsement, ENDORSEMENT_CATEGORIES } from "@/lib/endorsements";
import type { EndorsementSummary } from "@/lib/endorsements";
import { ShieldIcon, CheckCircleIcon, UsersIcon } from "@/components/SvgIcons";

export default function EndorsementPanel({ targetUserId, targetUsername, myId }: { targetUserId: string; targetUsername: string; myId: string | null }) {
  const [summary, setSummary] = useState<EndorsementSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!targetUserId) { setLoading(false); return; }
    const s = await fetchEndorsementSummary(targetUserId, myId);
    setSummary(s);
    setLoading(false);
  }, [targetUserId, myId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (!targetUserId) return null;

  if (loading) {
    return (
      <section className="max-w-3xl mx-auto px-6 pb-16">
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

  if (!summary) return null;

  const isSelf = !!myId && myId === targetUserId;
  const catsWithCount = ENDORSEMENT_CATEGORIES.filter((c) => (summary.byCategory[c.id] ?? 0) > 0);

  const onEndorse = async (category: string) => {
    if (busy || !summary.eligible) return;
    setBusy(category);
    await addEndorsement(targetUserId, category);
    await refresh();
    setBusy(null);
  };

  return (
    <section className="max-w-3xl mx-auto px-6 pb-16">
      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShieldIcon size={20} className="text-primary-green" />
            <h2 className="text-body-md font-semibold text-neutral-900 font-display">Reputation & endorsements</h2>
          </div>
          <div className="text-right">
            <p className="text-display-xs font-bold text-neutral-900">{summary.total}</p>
            <p className="text-caption text-neutral-400">endorsements</p>
          </div>
        </div>

        {catsWithCount.length > 0 ? (
          <div className="flex flex-wrap gap-2 mb-4">
            {catsWithCount.map((c) => (
              <span key={c.id} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary-green/10 text-primary-green text-caption font-semibold">
                {c.label} x{summary.byCategory[c.id]}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-body-xs text-neutral-400 mb-4">No endorsements yet.</p>
        )}

        {isSelf ? (
          <p className="text-body-xs text-neutral-500">This is your public reputation. Teammates and co-players can endorse you.</p>
        ) : summary.eligible ? (
          <div>
            <p className="text-body-xs font-semibold text-neutral-700 mb-2">
              Endorse @{targetUsername} ({summary.reason === "teammate" ? "your teammate" : "you played together"})
            </p>
            <div className="flex flex-wrap gap-2">
              {ENDORSEMENT_CATEGORIES.map((c) => {
                const done = summary.myEndorsed.includes(c.id);
                return (
                  <button
                    key={c.id}
                    disabled={done || busy === c.id}
                    onClick={() => onEndorse(c.id)}
                    className={cn(
                      "inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-caption font-medium border transition-all",
                      done
                        ? "bg-emerald/10 text-emerald border-emerald/20 cursor-default"
                        : "bg-white text-neutral-600 border-neutral-200 hover:border-primary-green hover:text-primary-green"
                    )}
                  >
                    {done && <CheckCircleIcon size={12} />}
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="flex items-center gap-1.5 text-body-xs text-neutral-500">
            <UsersIcon size={14} />
            Join the same team or match as @{targetUsername} to endorse them.
          </p>
        )}
      </Card>
    </section>
  );
}