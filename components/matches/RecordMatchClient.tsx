"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { recordMatch, logPlayerStat } from "@/lib/matches";
import { ArrowLeftIcon, CheckCircleIcon, TrophyIcon } from "@/components/SvgIcons";

const SPORTS = ["football", "box-cricket", "badminton", "pickleball", "padel"];

interface TeamOption {
  id: string;
  name: string;
  slug: string;
}

export default function RecordMatchClient() {
  const [sport, setSport] = useState("football");
  const [teamAName, setTeamAName] = useState("");
  const [teamBName, setTeamBName] = useState("");
  const [teamAId, setTeamAId] = useState<string | null>(null);
  const [teamBId, setTeamBId] = useState<string | null>(null);
  const [scoreA, setScoreA] = useState("");
  const [scoreB, setScoreB] = useState("");
  const [goals, setGoals] = useState("");
  const [assists, setAssists] = useState("");
  const [location, setLocation] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const [myTeams, setMyTeams] = useState<TeamOption[]>([]);
  const [showDropdownA, setShowDropdownA] = useState(false);
  const [showDropdownB, setShowDropdownB] = useState(false);

  const dropdownRefA = useRef<HTMLDivElement>(null);
  const dropdownRefB = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("team_members")
        .select("teams(id, name, slug)")
        .eq("user_id", user.id);
      const teams = (data ?? []).map((m: any) => m.teams).filter(Boolean) as TeamOption[];
      setMyTeams(teams);
    };
    fetchTeams();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRefA.current && !dropdownRefA.current.contains(e.target as Node)) {
        setShowDropdownA(false);
      }
      if (dropdownRefB.current && !dropdownRefB.current.contains(e.target as Node)) {
        setShowDropdownB(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredTeamsA = myTeams.filter((t) =>
    t.name.toLowerCase().includes(teamAName.toLowerCase())
  );

  const filteredTeamsB = myTeams.filter((t) =>
    t.name.toLowerCase().includes(teamBName.toLowerCase())
  );

  const selectTeamA = (team: TeamOption) => {
    setTeamAName(team.name);
    setTeamAId(team.id);
    setShowDropdownA(false);
  };

  const selectTeamB = (team: TeamOption) => {
    setTeamBName(team.name);
    setTeamBId(team.id);
    setShowDropdownB(false);
  };

  const onSubmit = async () => {
    if (busy) return;
    setBusy(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setBusy(false); return; }

    const matchId = await recordMatch({
      sport,
      teamAName: teamAName.trim(),
      teamBName: teamBName.trim(),
      scoreA: scoreA === "" ? 0 : Number(scoreA),
      scoreB: scoreB === "" ? 0 : Number(scoreB),
      venue: location.trim(),
      teamAId,
      teamBId,
    });

    if (matchId) {
      await logPlayerStat(matchId, user.id, {
        goals: goals === "" ? 0 : Number(goals),
        assists: assists === "" ? 0 : Number(assists),
      });
    }

    setBusy(false);
    setDone(true);
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
          <h1 className="text-display-sm font-display font-bold text-neutral-900">Record a match</h1>
          <p className="text-body-sm text-neutral-500">Log the result and your performance. Verified by opponents, tracked in team records.</p>
        </div>

        {done ? (
          <div className="surface-card p-6">
            <div className="flex items-center gap-2">
              <CheckCircleIcon size={20} className="text-emerald-600" />
              <p className="text-[16px] font-semibold text-neutral-900">Match recorded!</p>
            </div>
            <p className="text-[13px] text-neutral-600 mt-1">Your performance now shows on your profile. The result will update team records once confirmed by the opponent.</p>
            <Link href="/profile" className="inline-block mt-3 text-[13px] text-emerald-600 font-semibold hover:underline">View my profile</Link>
          </div>
        ) : (
          <div className="surface-card p-6">
            <div className="space-y-5">
              <div>
                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-2">Sport</label>
                <select value={sport} onChange={(e) => setSport(e.target.value)} className="w-full px-3.5 py-3 rounded-xl border border-black/[0.08] bg-white text-[14px] outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/[0.08] transition-all capitalize">
                  {SPORTS.map((s) => <option key={s} value={s}>{s.replace("-", " ")}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div ref={dropdownRefA} className="relative">
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-2">Team A (your team)</label>
                  <div className="relative">
                    <input
                      value={teamAName}
                      onChange={(e) => { setTeamAName(e.target.value); setTeamAId(null); setShowDropdownA(true); }}
                      onFocus={() => setShowDropdownA(true)}
                      placeholder="Start typing team name..."
                      className="w-full px-3.5 py-3 pr-10 rounded-xl border border-black/[0.08] bg-white text-[14px] outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/[0.08] transition-all"
                    />
                    {teamAId && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-md bg-emerald-500/[0.12] border border-emerald-500/20 flex items-center justify-center">
                        <CheckCircleIcon size={12} className="text-emerald-600" />
                      </span>
                    )}
                  </div>
                  <AnimatePresence>
                    {showDropdownA && filteredTeamsA.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 w-full mt-1.5 bg-white border border-black/[0.08] rounded-xl shadow-lg overflow-hidden max-h-48 overflow-y-auto"
                      >
                        {filteredTeamsA.map((team) => (
                          <button
                            key={team.id}
                            onClick={() => selectTeamA(team)}
                            className="w-full text-left px-3.5 py-2.5 hover:bg-emerald-500/[0.06] transition-colors flex items-center gap-2.5"
                          >
                            <TrophyIcon size={16} className="text-neutral-400" />
                            <span className="text-[13px] text-neutral-900 font-medium">{team.name}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div ref={dropdownRefB} className="relative">
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-2">Team B (opponent)</label>
                  <div className="relative">
                    <input
                      value={teamBName}
                      onChange={(e) => { setTeamBName(e.target.value); setTeamBId(null); setShowDropdownB(true); }}
                      onFocus={() => setShowDropdownB(true)}
                      placeholder="Start typing team name..."
                      className="w-full px-3.5 py-3 pr-10 rounded-xl border border-black/[0.08] bg-white text-[14px] outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/[0.08] transition-all"
                    />
                    {teamBId && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-md bg-emerald-500/[0.12] border border-emerald-500/20 flex items-center justify-center">
                        <CheckCircleIcon size={12} className="text-emerald-600" />
                      </span>
                    )}
                  </div>
                  <AnimatePresence>
                    {showDropdownB && filteredTeamsB.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 w-full mt-1.5 bg-white border border-black/[0.08] rounded-xl shadow-lg overflow-hidden max-h-48 overflow-y-auto"
                      >
                        {filteredTeamsB.map((team) => (
                          <button
                            key={team.id}
                            onClick={() => selectTeamB(team)}
                            className="w-full text-left px-3.5 py-2.5 hover:bg-emerald-500/[0.06] transition-colors flex items-center gap-2.5"
                          >
                            <TrophyIcon size={16} className="text-neutral-400" />
                            <span className="text-[13px] text-neutral-900 font-medium">{team.name}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-2">Score A</label>
                  <input type="number" min="0" value={scoreA} onChange={(e) => setScoreA(e.target.value)} placeholder="0" className="w-full px-3.5 py-3 rounded-xl border border-black/[0.08] bg-white text-[14px] outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/[0.08] transition-all" />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-2">Score B</label>
                  <input type="number" min="0" value={scoreB} onChange={(e) => setScoreB(e.target.value)} placeholder="0" className="w-full px-3.5 py-3 rounded-xl border border-black/[0.08] bg-white text-[14px] outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/[0.08] transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-2">Your goals</label>
                  <input type="number" min="0" value={goals} onChange={(e) => setGoals(e.target.value)} placeholder="0" className="w-full px-3.5 py-3 rounded-xl border border-black/[0.08] bg-white text-[14px] outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/[0.08] transition-all" />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-2">Your assists</label>
                  <input type="number" min="0" value={assists} onChange={(e) => setAssists(e.target.value)} placeholder="0" className="w-full px-3.5 py-3 rounded-xl border border-black/[0.08] bg-white text-[14px] outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/[0.08] transition-all" />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-2">Location (optional)</label>
                <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Where was it played?" className="w-full px-3.5 py-3 rounded-xl border border-black/[0.08] bg-white text-[14px] outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/[0.08] transition-all" />
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={onSubmit}
                disabled={busy || !teamAName.trim() || !teamBName.trim()}
                className="w-full py-3.5 rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 text-white text-[14px] font-semibold shadow-[0_8px_24px_-6px_rgba(16,185,129,0.4)] hover:shadow-[0_12px_32px_-8px_rgba(16,185,129,0.5)] disabled:opacity-40 disabled:cursor-not-allowed transition-shadow"
              >
                {busy ? "Recording..." : "Record match"}
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}