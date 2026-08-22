"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Avatar from "@/components/ui/Avatar";
import { createClient } from "@/lib/supabase";
import { fetchPlayersToEndorse, fetchEndorsements, endorsePlayer, ENDORSEMENT_CATEGORIES } from "@/lib/endorsements";
import type { EndorsablePlayer, EndorsementRecord } from "@/lib/endorsements";
import { ArrowLeftIcon, ShieldIcon, StarIcon, HeartIcon, UsersIcon, ZapIcon, AwardIcon } from "@/components/SvgIcons";

const categoryMeta: Record<string, { icon: any; color: string; bg: string; border: string }> = {
  "Playmaker": { icon: ZapIcon, color: "text-emerald-600", bg: "bg-emerald-500/[0.08]", border: "border-emerald-500/20" },
  "Fair Play": { icon: HeartIcon, color: "text-blue-600", bg: "bg-blue-500/[0.08]", border: "border-blue-500/20" },
  "Team Player": { icon: UsersIcon, color: "text-purple-600", bg: "bg-purple-500/[0.08]", border: "border-purple-500/20" },
  "Always on Time": { icon: AwardIcon, color: "text-amber-600", bg: "bg-amber-500/[0.08]", border: "border-amber-500/20" },
  "MVP": { icon: StarIcon, color: "text-rose-600", bg: "bg-rose-500/[0.08]", border: "border-rose-500/20" },
};

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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors mb-4">
          <ArrowLeftIcon size={16} />
          Home
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-[0_8px_24px_-6px_rgba(16,185,129,0.4)]">
            <ShieldIcon size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-[28px] font-bold font-display text-neutral-900 tracking-tight">Endorse players</h1>
            <p className="text-[14px] text-neutral-500">Recognize teammates for their skills and character. One endorsement per category per player.</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="surface-card p-5 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-black/[0.06]" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-black/[0.08] rounded-full" />
                  <div className="h-3 w-24 bg-black/[0.04] rounded-full" />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {[0, 1, 2, 3].map((j) => (
                  <div key={j} className="h-8 w-24 bg-black/[0.04] rounded-lg" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : players.length === 0 ? (
        <div className="surface-card p-12 text-center">
          <ShieldIcon size={40} className="mx-auto text-neutral-300 mb-3" />
          <h3 className="text-[16px] font-semibold text-neutral-900 mb-1">No players to endorse yet</h3>
          <p className="text-[13px] text-neutral-500">Play a verified match with someone, then come back to endorse them.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {players.map((player, idx) => {
            const playerEndorsements = endorsements.filter((e) => e.endorseeId === player.id);
            const myCategories = new Set(
              playerEndorsements.filter((e) => e.endorserId === myId).map((e) => e.category)
            );
            const totalCount = playerEndorsements.length;

            return (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 280, damping: 24, delay: idx * 0.04 }}
              >
                <div className="surface-card p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <Link href={`/${player.username}`} className="turfog-press">
                      <Avatar alt={player.name} src={player.avatar} size="md" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link href={`/${player.username}`} className="text-[15px] font-semibold text-neutral-900 hover:text-emerald-600 transition-colors">
                        {player.name}
                      </Link>
                      <p className="text-[12px] text-neutral-500">@{player.username}</p>
                    </div>
                    {totalCount > 0 && (
                      <div className="text-right">
                        <p className="text-[20px] font-bold font-display text-neutral-900">{totalCount}</p>
                        <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">endorsements</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {ENDORSEMENT_CATEGORIES.map((category) => {
                      const endorsed = myCategories.has(category);
                      const categoryCount = playerEndorsements.filter((e) => e.category === category).length;
                      const key = player.id + ":" + category;
                      const meta = categoryMeta[category] || categoryMeta["Playmaker"];
                      const Icon = meta.icon;

                      return (
                        <motion.button
                          key={category}
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          disabled={endorsed || busy === key}
                          onClick={() => onEndorse(player.id, category)}
                          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold border transition-all ${
                            endorsed
                              ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white border-emerald-500 shadow-[0_4px_12px_-2px_rgba(16,185,129,0.4)]"
                              : `${meta.bg} ${meta.color} ${meta.border} hover:shadow-sm`
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          <Icon size={14} />
                          {category}
                          {categoryCount > 0 && !endorsed && (
                            <span className="ml-0.5 px-1.5 py-0.5 rounded-md bg-black/[0.08] text-[10px] font-bold">
                              {categoryCount}
                            </span>
                          )}
                          {endorsed && <span className="text-[10px] font-bold">✓</span>}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}