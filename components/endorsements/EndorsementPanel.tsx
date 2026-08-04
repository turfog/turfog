"use client";

import { useCallback, useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import { fetchEndorsementsForUser, endorsePlayer, ENDORSEMENT_CATEGORIES } from "@/lib/endorsements";
import type { EndorsementRecord } from "@/lib/endorsements";
import { ShieldIcon } from "@/components/SvgIcons";

export default function EndorsementPanel({
  targetUserId,
  targetUsername,
  myId,
}: {
  targetUserId: string;
  targetUsername: string;
  myId: string | null;
}) {
  const [endorsements, setEndorsements] = useState<EndorsementRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!targetUserId) {
      setLoading(false);
      return;
    }
    setEndorsements(await fetchEndorsementsForUser(targetUserId));
    setLoading(false);
  }, [targetUserId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const isOwnProfile = !!myId && myId === targetUserId;
  const myEndorsed = new Set(
    endorsements.filter((e) => e.endorserId === myId).map((e) => e.category)
  );
  const totalCount = endorsements.length;

  const onEndorse = async (category: string) => {
    if (busy || isOwnProfile || !myId) return;
    setBusy(category);
    await endorsePlayer(targetUserId, category);
    await refresh();
    setBusy(null);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-16">
      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-body-md font-semibold text-neutral-900 flex items-center gap-2">
            <ShieldIcon size={18} className="text-primary-green" />
            Endorsements
          </h2>
          <span className="text-body-sm font-semibold text-neutral-900">{totalCount}</span>
        </div>

        {loading ? (
          <p className="text-body-sm text-neutral-400">Loading endorsements...</p>
        ) : totalCount === 0 ? (
          <p className="text-body-sm text-neutral-400">
            No endorsements yet. Be the first to endorse {targetUsername}.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {ENDORSEMENT_CATEGORIES.map((category) => {
              const count = endorsements.filter((e) => e.category === category).length;
              if (count === 0) return null;
              return (
                <span
                  key={category}
                  className="px-3 py-1.5 rounded-full bg-primary-green/10 text-primary-green text-body-xs font-medium"
                >
                  {category} ({count})
                </span>
              );
            })}
          </div>
        )}

        {!isOwnProfile && myId && (
          <div className="mt-4 pt-4 border-t border-neutral-100">
            <p className="text-body-xs text-neutral-500 mb-2">Endorse {targetUsername}:</p>
            <div className="flex flex-wrap gap-2">
              {ENDORSEMENT_CATEGORIES.map((category) => {
                const endorsed = myEndorsed.has(category);
                return (
                  <button
                    key={category}
                    disabled={endorsed || busy === category}
                    onClick={() => onEndorse(category)}
                    className={`px-3 py-1.5 rounded-full text-body-xs font-medium border transition-colors ${
                      endorsed
                        ? "bg-primary-green text-white border-primary-green"
                        : "bg-white text-neutral-600 border-neutral-200 hover:border-primary-green"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}