"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { SPORTS, SKILL_LEVELS } from "@/lib/constants";
import type { SportId } from "@/types";
import { useLocation } from "@/context/LocationContext";
import { goLiveHeartbeat } from "@/lib/discovery";
import {
  RunIcon,
  MapPinIcon,
  ZapIcon,
  ArrowRightIcon,
  FootballIcon,
  CricketIcon,
  PickleballIcon,
  PadelIcon,
  BadmintonIcon,
} from "@/components/SvgIcons";

const sportIconMap: Record<SportId, React.ReactNode> = {
  football: <FootballIcon size={18} />,
  "box-cricket": <CricketIcon size={18} />,
  pickleball: <PickleballIcon size={18} />,
  padel: <PadelIcon size={18} />,
  badminton: <BadmintonIcon size={18} />,
};

export default function IWantToPlay() {
  const { lat, lng, label } = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSport, setSelectedSport] = useState<SportId | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  const handleGoLive = async () => {
    setError("");
    if (!selectedSport || !selectedSkill) {
      setError("Pick a sport and skill level");
      return;
    }
    setPosting(true);
    const { error: liveError } = await goLiveHeartbeat({
      type: "i-want-to-play",
      sport: selectedSport,
      skill: selectedSkill,
      note,
      location: label,
      lat,
      lng,
      minutes: 180,
    });
    setPosting(false);
    if (liveError) {
      setError(liveError);
      return;
    }
    setIsLive(true);
  };

  const reset = () => {
    setIsLive(false);
    setIsExpanded(false);
    setSelectedSport(null);
    setSelectedSkill(null);
    setNote("");
    setError("");
  };

  if (isLive) {
    return (
      <div className="surface-card overflow-hidden border-emerald-500/30">
        <div className="bg-gradient-to-br from-emerald-500/[0.08] to-transparent p-6">
          <div className="text-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl mb-4 shadow-[0_8px_24px_-6px_rgba(16,185,129,0.4)]"
            >
              <RunIcon size={32} className="text-white" />
            </motion.div>
            <h3 className="text-[18px] font-bold text-neutral-900 mb-2">You're live!</h3>
            <p className="text-[13px] text-neutral-600 mb-4">Nearby captains can now see you in Available Players</p>
            <div className="flex items-center justify-center gap-2 mb-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/[0.12] text-emerald-700 text-[11px] font-bold uppercase tracking-wider rounded-full border border-emerald-500/20">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
                Live
              </span>
              <span className="px-3 py-1.5 bg-black/[0.04] text-neutral-700 text-[11px] font-bold uppercase tracking-wider rounded-full border border-black/[0.06] capitalize">
                {selectedSport}
              </span>
              <span className="px-3 py-1.5 bg-black/[0.04] text-neutral-700 text-[11px] font-bold uppercase tracking-wider rounded-full border border-black/[0.06] capitalize">
                {selectedSkill}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Link
                href="/i-want-to-play"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 text-white text-[13px] font-semibold shadow-[0_8px_24px_-6px_rgba(16,185,129,0.4)] hover:shadow-[0_12px_32px_-8px_rgba(16,185,129,0.5)] transition-shadow"
              >
                <RunIcon size={15} />
                View all players
              </Link>
              <button
                onClick={reset}
                className="px-5 py-2.5 rounded-xl border border-black/[0.08] text-neutral-700 text-[13px] font-semibold hover:bg-black/[0.02] transition-colors"
              >
                Go offline
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="surface-card overflow-hidden">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-emerald-500/[0.06] to-transparent p-6 pb-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-[0_6px_16px_-4px_rgba(16,185,129,0.4)]">
              <RunIcon size={24} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[17px] font-bold text-neutral-900 mb-0.5">I want to play</h3>
              <p className="text-[12px] text-neutral-600">Go live and get discovered by nearby captains</p>
            </div>
          </div>
          <Link
            href="/i-want-to-play"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/[0.08] text-emerald-700 text-[11px] font-bold uppercase tracking-wider border border-emerald-500/20 hover:bg-emerald-500/[0.12] transition-colors"
          >
            View all
            <ArrowRightIcon size={12} />
          </Link>
        </div>

        {/* Expand Trigger */}
        {!isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 text-white text-[13px] font-semibold shadow-[0_8px_24px_-6px_rgba(16,185,129,0.4)] hover:shadow-[0_12px_32px_-8px_rgba(16,185,129,0.5)] transition-shadow"
          >
            <ZapIcon size={15} />
            Go live now
          </button>
        )}
      </div>

      {/* Expanded Form */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-5 space-y-5 border-t border-black/[0.06]">
              <div>
                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-2">
                  Select sport
                </label>
                <div className="flex flex-wrap gap-2">
                  {SPORTS.map((sport) => (
                    <motion.button
                      key={sport.id}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => setSelectedSport(sport.id)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold border transition-all",
                        selectedSport === sport.id
                          ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white border-emerald-500 shadow-sm"
                          : "bg-white text-neutral-600 border-black/[0.08] hover:border-emerald-500/40"
                      )}
                    >
                      {sportIconMap[sport.id]}
                      {sport.name}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-2">
                  Skill level
                </label>
                <div className="flex gap-2">
                  {SKILL_LEVELS.map((level) => (
                    <motion.button
                      key={level}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => setSelectedSkill(level)}
                      className={cn(
                        "flex-1 px-3 py-2 rounded-xl text-[12px] font-semibold border capitalize transition-all",
                        selectedSkill === level
                          ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white border-emerald-500 shadow-sm"
                          : "bg-white text-neutral-600 border-black/[0.08] hover:border-emerald-500/40"
                      )}
                    >
                      {level}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-2">
                  Note (optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Available after 6 PM. Prefer 5v5."
                  rows={2}
                  className="w-full px-3.5 py-3 rounded-xl border border-black/[0.08] bg-white text-[13px] text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/[0.08] resize-none transition-all"
                />
              </div>

              <div className="flex items-center gap-1.5 text-[12px] text-neutral-500">
                <MapPinIcon size={14} />
                <span>{label}</span>
              </div>

              {error && (
                <p className="text-[12px] text-coral bg-coral/[0.06] border border-coral/20 rounded-lg px-3 py-2.5">
                  {error}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleGoLive}
                  disabled={posting || !selectedSport || !selectedSkill}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 text-white text-[13px] font-semibold shadow-[0_8px_24px_-6px_rgba(16,185,129,0.4)] hover:shadow-[0_12px_32px_-8px_rgba(16,185,129,0.5)] disabled:opacity-40 disabled:cursor-not-allowed transition-shadow"
                >
                  {posting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <RunIcon size={15} />
                  )}
                  Go live now
                </button>
                <button
                  onClick={reset}
                  className="px-5 py-3 rounded-xl border border-black/[0.08] text-neutral-700 text-[13px] font-semibold hover:bg-black/[0.02] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}