"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import { createClient } from "@/lib/supabase";
import { fetchPlayersToEndorse, fetchEndorsements, endorsePlayer, ENDORSEMENT_CATEGORIES } from "@/lib/endorsements";
import type { EndorsablePlayer, EndorsementRecord } from "@/lib/endorsements";
import { ArrowLeftIcon, ShieldIcon } from "@/components/SvgIcons";

export default function EndorseClient() {
  const [players, setPlayers] = useState<EndorsablePlayer[]>([]);
  const [endorsements, setEndorsements] = useState<EndorsementRecord[]>([]);
  const [myId, setMyId] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    setMyId(user?.id ?? null);
    const [p, e] = await Promise.all([fetchPlayersToEndorse(), fetchEndorsements()]);
    setPlayers(p);
    setEndorsements(e);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const onEndorse = async (playerId: string, category: string) => {
    const key = playerId + ":" + category;
    if (busy) return;
    setBusy(key);
    await endorsePlayer(playerId, category);
    await refresh();
    setBusy(null);
  };

  return (
    <div className="min-h-screen bg-neutral-100 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div>
          <Link href="/" className="inline-flex items-center gap-1.5 text-body-sm text-neutral-500 hover:text-neutral-900 transition-colors">
            <ArrowLeftIcon size={16} />
            Home
          </Link>
        </div>

        <div>
          <h1 className="text-display-sm font-display font-bold text-neutral-900 flex items-center gap-2">
            <ShieldIcon size={20} className="text-primary-green" />
            Endorse players
          </h1>
          <p className="text-body-sm text-neutral-500">Recognize players for their skills and character. One endorsement per category per player.</p>
        </div>

        {loading ? (
          <p className="text-body-sm text-neutral-400 text-center py-8">Loading players...</p>
        ) : players.length === 0 ? (
          <p className="text-body-sm text-neutral-400 text-center py-8">No other players to endorse yet.</p>
        ) : (
          <div className="space-y-4">
            {players.map((player) => {
              const playerEndorsements = endorsements.filter((e) => e.endorseeId === player.id);
              const myCategories = new Set(
                playerEndorsements.filter((e) => e.endorserId === myId).map((e) => e.category)
              );
              const totalCount = playerEndorsements.length;
              return (
                <Card key={player.id} padding="lg">
                  <div className="flex items-center gap-3">
                    <Avatar alt={player.name} src={player.avatar} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="text-body-sm font-semibold text-neutral-900">{player.name}</p>
                      <p className="text-body-xs text-neutral-500">@{player.username}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-body-lg font-display font-bold text-neutral-900">{totalCount}</p>
                      <p className="text-caption text-neutral-400">endorsements</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {ENDORSEMENT_CATEGORIES.map((category) => {
                      const endorsed = myCategories.has(category);
                      const categoryCount = playerEndorsements.filter((e) => e.category === category).length;
                      const key = player.id + ":" + category;
                      return (
                        <button
                          key={category}
                          disabled={endorsed || busy === key}
                          onClick={() => onEndorse(player.id, category)}
                          className={`px-3 py-1.5 rounded-full text-body-xs font-medium border transition-colors ${
                            endorsed
                              ? "bg-primary-green text-white border-primary-green"
                              : "bg-white text-neutral-600 border-neutral-200 hover:border-primary-green"
                          }`}
                        >
                          {category}
                          {categoryCount > 0 ? ` (${categoryCount})` : ""}
                        </button>
                      );
                    })}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}