"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { fetchTournamentBrackets } from "@/lib/tournaments";
import type { BracketRound } from "@/lib/tournaments";
import { TrophyIcon } from "@/components/SvgIcons";

export default function TournamentBrackets({ tournamentId }: { tournamentId: string }) {
  const [rounds, setRounds] = useState<BracketRound[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTournamentBrackets(tournamentId).then((data) => {
      setRounds(data);
      setLoading(false);
    });
  }, [tournamentId]);

  if (loading) {
    return (
      <div className="surface-card p-6">
        <h2 className="text-[14px] font-bold text-neutral-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <TrophyIcon size={16} className="text-neutral-400" />
          Tournament Bracket
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex-shrink-0 w-64 space-y-3">
              <div className="h-4 w-24 bg-black/[0.06] rounded-full animate-pulse" />
              {[0, 1].map((j) => (
                <div key={j} className="h-20 bg-black/[0.04] rounded-xl animate-pulse" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (rounds.length === 0) {
    return (
      <div className="surface-card p-6">
        <h2 className="text-[14px] font-bold text-neutral-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <TrophyIcon size={16} className="text-neutral-400" />
          Tournament Bracket
        </h2>
        <p className="text-[13px] text-neutral-500 py-8 text-center">Bracket not set up yet. Matches will appear here once the tournament organizer creates the knockout stage.</p>
      </div>
    );
  }

  return (
    <div className="surface-card p-6">
      <h2 className="text-[14px] font-bold text-neutral-900 uppercase tracking-wider mb-6 flex items-center gap-2">
        <TrophyIcon size={16} className="text-neutral-400" />
        Tournament Bracket
      </h2>

      <div className="flex gap-6 overflow-x-auto pb-4 turfog-scroll">
        {rounds.map((round, roundIdx) => (
          <div key={round.id} className="flex-shrink-0 w-64">
            <div className="mb-4 px-1">
              <h3 className="text-[12px] font-bold text-neutral-500 uppercase tracking-wider">{round.name}</h3>
            </div>
            <div className="space-y-4">
              {round.matches.map((match) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: roundIdx * 0.1 + match.position * 0.05 }}
                  className="bg-white border border-black/[0.06] rounded-xl overflow-hidden"
                >
                  {/* Team A */}
                  <div className={`flex items-center gap-2 p-2.5 ${match.winnerId === match.teamA?.id ? "bg-emerald-500/[0.06]" : ""}`}>
                    {match.teamA ? (
                      <Link href={`/teams/${match.teamA.slug}`} className="flex items-center gap-2 flex-1 min-w-0 group">
                        <div className="w-7 h-7 rounded-md bg-black/[0.04] border border-black/[0.06] flex items-center justify-center overflow-hidden flex-shrink-0">
                          {match.teamA.logo ? (
                            <img src={match.teamA.logo} alt={match.teamA.name} className="w-full h-full object-cover" />
                          ) : (
                            <TrophyIcon size={12} className="text-neutral-400" />
                          )}
                        </div>
                        <span className={`text-[13px] font-medium truncate group-hover:text-emerald-600 transition-colors ${match.winnerId === match.teamA.id ? "text-emerald-600 font-bold" : "text-neutral-700"}`}>
                          {match.teamA.name}
                        </span>
                      </Link>
                    ) : (
                      <span className="flex-1 text-[12px] text-neutral-400 italic">TBD</span>
                    )}
                    {match.scoreA !== null && (
                      <span className={`text-[14px] font-bold ${match.winnerId === match.teamA?.id ? "text-emerald-600" : "text-neutral-900"}`}>
                        {match.scoreA}
                      </span>
                    )}
                  </div>

                  <div className="h-px bg-black/[0.06]" />

                  {/* Team B */}
                  <div className={`flex items-center gap-2 p-2.5 ${match.winnerId === match.teamB?.id ? "bg-emerald-500/[0.06]" : ""}`}>
                    {match.teamB ? (
                      <Link href={`/teams/${match.teamB.slug}`} className="flex items-center gap-2 flex-1 min-w-0 group">
                        <div className="w-7 h-7 rounded-md bg-black/[0.04] border border-black/[0.06] flex items-center justify-center overflow-hidden flex-shrink-0">
                          {match.teamB.logo ? (
                            <img src={match.teamB.logo} alt={match.teamB.name} className="w-full h-full object-cover" />
                          ) : (
                            <TrophyIcon size={12} className="text-neutral-400" />
                          )}
                        </div>
                        <span className={`text-[13px] font-medium truncate group-hover:text-emerald-600 transition-colors ${match.winnerId === match.teamB.id ? "text-emerald-600 font-bold" : "text-neutral-700"}`}>
                          {match.teamB.name}
                        </span>
                      </Link>
                    ) : (
                      <span className="flex-1 text-[12px] text-neutral-400 italic">TBD</span>
                    )}
                    {match.scoreB !== null && (
                      <span className={`text-[14px] font-bold ${match.winnerId === match.teamB?.id ? "text-emerald-600" : "text-neutral-900"}`}>
                        {match.scoreB}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        {/* Champion Column */}
        {rounds.length > 0 && (
          <div className="flex-shrink-0 w-64">
            <div className="mb-4 px-1">
              <h3 className="text-[12px] font-bold text-neutral-500 uppercase tracking-wider">Champion</h3>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: rounds.length * 0.15 }}
              className="bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 rounded-xl p-4 text-center shadow-[0_8px_24px_-6px_rgba(245,158,11,0.4)]"
            >
              <TrophyIcon size={32} className="text-white mx-auto mb-2" />
              <p className="text-[13px] font-bold text-white">
                {rounds[rounds.length - 1]?.matches[0]?.winnerId
                  ? "Crowned"
                  : "To be determined"}
              </p>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}