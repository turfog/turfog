"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase";
import { fetchUserTeams, registerTeamForTournament } from "@/lib/tournaments";
import { TrophyIcon, MapPinIcon, CalendarIcon, UsersIcon, ArrowLeftIcon, XIcon, CheckCircleIcon } from "@/components/SvgIcons";

interface TournamentDetail {
  id: string;
  name: string;
  slug: string;
  sport: string;
  city: string | null;
  start_date: string | null;
  end_date: string | null;
  status: string;
  teams: Array<{ id: string; name: string; slug: string; logo: string | null }>;
}

interface UserTeam { id: string; name: string; slug: string }

export default function TournamentDetailClient({ slug }: { slug: string }) {
  const [tournament, setTournament] = useState<TournamentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [myTeams, setMyTeams] = useState<UserTeam[]>([]);
  const [registeringId, setRegisteringId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("tournaments")
        .select(`id, name, slug, sport, city, start_date, end_date, status, teams:tournament_teams(teams(id, name, slug, logo))`)
        .eq("slug", slug)
        .single();
      if (data) {
        setTournament({ ...data, teams: (data.teams || []).map((t: any) => t.teams) });
      }
      setLoading(false);
    };
    load();
  }, [slug]);

  const openRegister = async () => {
    setShowRegister(true);
    const teams = await fetchUserTeams();
    setMyTeams(teams);
  };

  const handleRegister = async (team: UserTeam) => {
    if (!tournament || registeringId) return;
    setRegisteringId(team.id);
    const ok = await registerTeamForTournament(tournament.id, team.id);
    setRegisteringId(null);
    if (ok) {
      setSuccessMsg(`${team.name} successfully registered!`);
      setTournament((prev) => prev ? { ...prev, teams: [...prev.teams, { ...team, logo: null }] } : prev);
      setTimeout(() => { setShowRegister(false); setSuccessMsg(""); }, 1500);
    } else {
      setSuccessMsg("Failed to register. You might already be registered.");
    }
  };

  if (loading) return <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-neutral-500">Loading tournament...</div>;

  if (!tournament) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <TrophyIcon size={40} className="mx-auto text-neutral-300 mb-3" />
        <h3 className="text-[16px] font-semibold text-neutral-900 mb-1">Tournament not found</h3>
        <Link href="/tournaments" className="text-[13px] text-emerald-600 font-semibold hover:underline">Back to Tournaments</Link>
      </div>
    );
  }

  const statusMeta = tournament.status === "live"
    ? { label: "Live Now", cls: "bg-emerald-500/[0.08] text-emerald-600 border-emerald-500/20" }
    : tournament.status === "completed"
    ? { label: "Completed", cls: "bg-neutral-500/[0.08] text-neutral-500 border-neutral-500/20" }
    : { label: "Upcoming", cls: "bg-blue-500/[0.08] text-blue-600 border-blue-500/20" };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/tournaments" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors mb-6">
        <ArrowLeftIcon size={16} />All Tournaments
      </Link>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="surface-card p-6 md:p-8 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider border mb-3 ${statusMeta.cls}`}>{statusMeta.label}</span>
            <h1 className="text-[32px] font-bold font-display text-neutral-900 tracking-tight mb-2">{tournament.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-[13px] text-neutral-500">
              <span className="flex items-center gap-1.5 capitalize">{tournament.sport.replace("-", " ")}</span>
              {tournament.city && <span className="flex items-center gap-1.5"><MapPinIcon size={14} />{tournament.city}</span>}
              {tournament.start_date && <span className="flex items-center gap-1.5"><CalendarIcon size={14} />{new Date(tournament.start_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>}
            </div>
          </div>
          {tournament.status !== "completed" && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={openRegister}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 text-white text-[13px] font-semibold shadow-[0_8px_24px_-6px_rgba(16,185,129,0.4)] hover:shadow-[0_12px_32px_-8px_rgba(16,185,129,0.5)] transition-shadow"
            >
              Register Team
            </motion.button>
          )}
        </div>
        <div className="grid grid-cols-3 gap-4 border-t border-black/[0.05] pt-6">
          <div className="text-center"><p className="text-[24px] font-bold font-display text-neutral-900">{tournament.teams.length}</p><p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mt-1">Teams</p></div>
          <div className="text-center"><p className="text-[24px] font-bold font-display text-neutral-900">0</p><p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mt-1">Matches</p></div>
          <div className="text-center"><p className="text-[24px] font-bold font-display text-neutral-900">—</p><p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mt-1">Champion</p></div>
        </div>
      </motion.div>

      <div className="surface-card p-6">
        <h2 className="text-[14px] font-bold text-neutral-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <UsersIcon size={16} className="text-neutral-400" />Participating Teams
        </h2>
        {tournament.teams.length === 0 ? (
          <p className="text-[13px] text-neutral-500 py-8 text-center">No teams registered yet. Be the first to enter!</p>
        ) : (
          <div className="space-y-2">
            {tournament.teams.map((team) => (
              <Link key={team.id} href={`/teams/${team.slug}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-black/[0.03] transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-black/[0.04] border border-black/[0.06] flex items-center justify-center text-neutral-600 group-hover:border-emerald-500/30 transition-colors overflow-hidden">
                  {team.logo ? <img src={team.logo} alt={team.name} className="w-full h-full object-cover" /> : <TrophyIcon size={18} />}
                </div>
                <span className="text-[14px] font-semibold text-neutral-900 group-hover:text-emerald-600 transition-colors">{team.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Premium Registration Modal */}
      <AnimatePresence>
        {showRegister && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowRegister(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md surface-card p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[18px] font-bold font-display text-neutral-900">Register a Team</h3>
                <button onClick={() => setShowRegister(false)} className="w-8 h-8 rounded-lg hover:bg-black/[0.04] flex items-center justify-center text-neutral-400 transition-colors">
                  <XIcon size={18} />
                </button>
              </div>

              {successMsg ? (
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center py-8">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/[0.12] flex items-center justify-center mx-auto mb-3">
                    <CheckCircleIcon size={28} className="text-emerald-600" />
                  </div>
                  <p className="text-[14px] font-semibold text-neutral-900">{successMsg}</p>
                </motion.div>
              ) : (
                <>
                  <p className="text-[13px] text-neutral-500 mb-4">Select a team you manage to enter into <span className="font-semibold text-neutral-700">{tournament.name}</span>.</p>
                  <div className="space-y-2 max-h-60 overflow-y-auto turfog-scroll">
                    {myTeams.length === 0 ? (
                      <div className="text-center py-8 border border-dashed border-black/[0.08] rounded-xl">
                        <p className="text-[13px] text-neutral-500 mb-2">You aren't a captain or owner of any teams yet.</p>
                        <Link href="/teams" className="text-[13px] text-emerald-600 font-semibold hover:underline">Create or join a team</Link>
                      </div>
                    ) : (
                      myTeams.map((team) => {
                        const alreadyIn = tournament.teams.some(t => t.id === team.id);
                        return (
                          <button
                            key={team.id}
                            onClick={() => !alreadyIn && handleRegister(team)}
                            disabled={alreadyIn || !!registeringId}
                            className="w-full flex items-center gap-3 p-3 rounded-xl border border-black/[0.06] hover:border-emerald-500/30 hover:bg-emerald-500/[0.04] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <div className="w-10 h-10 rounded-lg bg-black/[0.04] flex items-center justify-center text-neutral-500">
                              <TrophyIcon size={18} />
                            </div>
                            <span className="text-[14px] font-semibold text-neutral-900 flex-1 text-left">{team.name}</span>
                            {alreadyIn ? (
                              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-500/[0.1] px-2 py-1 rounded-md">Entered</span>
                            ) : registeringId === team.id ? (
                              <span className="text-[11px] font-semibold text-neutral-500">Registering...</span>
                            ) : (
                              <span className="text-[12px] font-semibold text-emerald-600">Select</span>
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}