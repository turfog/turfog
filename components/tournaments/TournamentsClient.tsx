"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fetchTournaments } from "@/lib/tournaments";
import type { Tournament } from "@/lib/tournaments";
import { TrophyIcon, MapPinIcon, CalendarIcon, UsersIcon, FootballIcon, CricketIcon, PickleballIcon, PadelIcon, BadmintonIcon, ArrowLeftIcon } from "@/components/SvgIcons";

const sportIcon: Record<string, React.ReactNode> = {
  football: <FootballIcon size={20} />,
  "box-cricket": <CricketIcon size={20} />,
  pickleball: <PickleballIcon size={20} />,
  padel: <PadelIcon size={20} />,
  badminton: <BadmintonIcon size={20} />,
};

const statusMeta: Record<string, { label: string; cls: string; dot: string }> = {
  upcoming: { label: "Upcoming", cls: "bg-blue-500/[0.08] text-blue-600 border-blue-500/20", dot: "bg-blue-500" },
  live: { label: "Live Now", cls: "bg-emerald-500/[0.08] text-emerald-600 border-emerald-500/20", dot: "bg-emerald-500 animate-pulse" },
  completed: { label: "Completed", cls: "bg-neutral-500/[0.08] text-neutral-500 border-neutral-500/20", dot: "bg-neutral-400" },
};

export default function TournamentsClient() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTournaments().then((data) => {
      setTournaments(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors mb-4">
          <ArrowLeftIcon size={16} />
          Back to Home
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_8px_24px_-6px_rgba(245,158,11,0.4)]">
            <TrophyIcon size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-[28px] font-bold font-display text-neutral-900 tracking-tight">Tournaments</h1>
            <p className="text-[14px] text-neutral-500">Compete, climb the brackets, and claim the trophy.</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="surface-card p-5 animate-pulse space-y-4">
              <div className="h-4 w-24 bg-black/[0.06] rounded-full" />
              <div className="h-6 w-3/4 bg-black/[0.08] rounded-full" />
              <div className="h-3 w-1/2 bg-black/[0.04] rounded-full" />
            </div>
          ))}
        </div>
      ) : tournaments.length === 0 ? (
        <div className="surface-card p-12 text-center">
          <TrophyIcon size={40} className="mx-auto text-neutral-300 mb-3" />
          <h3 className="text-[16px] font-semibold text-neutral-900 mb-1">No tournaments yet</h3>
          <p className="text-[13px] text-neutral-500">Be the first to organize a local cup.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tournaments.map((t, idx) => {
            const meta = statusMeta[t.status] || statusMeta.upcoming;
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 280, damping: 24, delay: idx * 0.05 }}
              >
                <Link href={`/tournaments/${t.slug}`} className="block group">
                  <div className="surface-card p-5 h-full flex flex-col group-hover:border-emerald-500/30 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider border", meta.cls)}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", meta.dot)} />
                        {meta.label}
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-black/[0.03] border border-black/[0.06] flex items-center justify-center text-neutral-600 group-hover:bg-emerald-500/[0.08] group-hover:text-emerald-600 group-hover:border-emerald-500/20 transition-all">
                        {sportIcon[t.sport] || <TrophyIcon size={18} />}
                      </div>
                    </div>

                    <h3 className="text-[18px] font-bold font-heading text-neutral-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">
                      {t.name}
                    </h3>

                    <div className="flex items-center gap-1.5 text-[12px] text-neutral-500 mb-4">
                      {t.city && (
                        <>
                          <MapPinIcon size={13} />
                          <span>{t.city}</span>
                          <span className="text-neutral-300">•</span>
                        </>
                      )}
                      {t.startDate && (
                        <>
                          <CalendarIcon size={13} />
                          <span>{new Date(t.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                        </>
                      )}
                    </div>

                    <div className="mt-auto pt-4 border-t border-black/[0.05] flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-[12px] font-medium text-neutral-600">
                        <UsersIcon size={14} />
                        {t.teamCount} {t.teamCount === 1 ? "team" : "teams"}
                      </span>
                      <span className="text-[12px] font-semibold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        View Details →
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}