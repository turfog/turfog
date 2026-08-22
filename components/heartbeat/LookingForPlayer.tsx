"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { SPORTS, SKILL_LEVELS } from "@/lib/constants";
import type { SportId, MatchType } from "@/types";
import { useLocation } from "@/context/LocationContext";
import { createMatchRequest, searchPlaces, reverseGeocode } from "@/lib/discovery";
import {
  UsersIcon,
  MapPinIcon,
  ZapIcon,
  CheckCircleIcon,
  ClockIcon,
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

const MATCH_TYPES: MatchType[] = ["casual", "practice", "competitive", "tournament"];

type CostMode = "none" | "split" | "organizer_pays";
const COST_MODES: Array<{ id: CostMode; label: string }> = [
  { id: "none", label: "No cost" },
  { id: "split", label: "Split evenly" },
  { id: "organizer_pays", label: "I'll pay" },
];

function toLocalInput(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function osmEmbed(la: number, ln: number): string {
  return `https://www.openstreetmap.org/export/embed.html?bbox=${ln - 0.008},${la - 0.006},${ln + 0.008},${la + 0.006}&layer=mapnik&marker=${la},${ln}`;
}

export default function LookingForPlayer() {
  const { lat, lng, label } = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSport, setSelectedSport] = useState<SportId | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [playersInHand, setPlayersInHand] = useState(0);
  const [playersNeeded, setPlayersNeeded] = useState(2);
  const [matchType, setMatchType] = useState<MatchType>("casual");
  const [venue, setVenue] = useState("");
  const [kickoff, setKickoff] = useState(() => toLocalInput(new Date(Date.now() + 2 * 3600 * 1000)));
  const [note, setNote] = useState("");
  const [posting, setPosting] = useState(false);
  const [posted, setPosted] = useState(false);
  const [error, setError] = useState("");

  const [costMode, setCostMode] = useState<CostMode>("none");
  const [costTotal, setCostTotal] = useState("");

  const [venueQuery, setVenueQuery] = useState("");
  const [venueSuggestions, setVenueSuggestions] = useState<Array<{ name: string; lat: number; lng: number }>>([]);
  const [searching, setSearching] = useState(false);
  const [venueLat, setVenueLat] = useState<number | null>(null);
  const [venueLng, setVenueLng] = useState<number | null>(null);
  const [venueAddress, setVenueAddress] = useState("");
  const searchTimer = useRef<number | null>(null);

  const totalPlayers = playersInHand + playersNeeded;
  const costPerPerson =
    Number(costTotal) > 0 && totalPlayers > 0 ? Math.ceil(Number(costTotal) / totalPlayers) : 0;

  const onCostChange = (v: string) => {
    setCostTotal(v);
    if (Number(v) > 0 && costMode === "none") setCostMode("split");
  };

  const onVenueQuery = (q: string) => {
    setVenueQuery(q);
    if (q.trim().length < 3) { setVenueSuggestions([]); return; }
    setSearching(true);
    if (searchTimer.current) window.clearTimeout(searchTimer.current);
    searchTimer.current = window.setTimeout(async () => {
      const res = await searchPlaces(q);
      setVenueSuggestions(res);
      setSearching(false);
    }, 400);
  };

  const pickSuggestion = (s: { name: string; lat: number; lng: number }) => {
    setVenueLat(s.lat); setVenueLng(s.lng); setVenueAddress(s.name);
    setVenueSuggestions([]); setVenueQuery("");
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const la = pos.coords.latitude, ln = pos.coords.longitude;
      setVenueLat(la); setVenueLng(ln);
      const lbl = await reverseGeocode(la, ln);
      setVenueAddress(lbl ?? "Current location");
    });
  };

  const reset = () => {
    setIsExpanded(false); setSelectedSport(null); setSelectedSkill(null);
    setPlayersInHand(0); setPlayersNeeded(2); setMatchType("casual"); setVenue(""); setNote("");
    setError(""); setPosted(false); setCostMode("none"); setCostTotal("");
    setVenueQuery(""); setVenueSuggestions([]); setVenueLat(null); setVenueLng(null); setVenueAddress("");
    setKickoff(toLocalInput(new Date(Date.now() + 2 * 3600 * 1000)));
  };

  const handlePost = async () => {
    setError("");
    if (!selectedSport || !selectedSkill) { setError("Pick a sport and skill level"); return; }
    if (!venue.trim()) { setError("Add a venue or turf name"); return; }
    if (costMode === "split" && Number(costTotal) <= 0) { setError("Enter the turf cost to split"); return; }
    setPosting(true);
    const { data: created, error: postError } = await createMatchRequest({
      sport: selectedSport,
      playersNeeded,
      totalPlayers,
      playersInHand,
      skill: selectedSkill,
      matchType,
      venue: venue.trim(),
      area: label,
      teamName: undefined,
      note,
      kickoffAt: new Date(kickoff).toISOString(),
      lat: venueLat ?? lat,
      lng: venueLng ?? lng,
      costTotal: costMode === "none" ? 0 : Number(costTotal) || 0,
      costSplitMode: costMode,
      currency: "INR",
    });
    setPosting(false);
    if (postError || !created) { setError(postError ?? "Could not post the request. Please try again."); return; }
    setPosted(true);
  };

  if (posted) {
    return (
      <div className="surface-card overflow-hidden border-orange-500/30">
        <div className="bg-gradient-to-br from-orange-500/[0.08] to-transparent p-6">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl mb-4 shadow-[0_8px_24px_-6px_rgba(16,185,129,0.4)]"
            >
              <CheckCircleIcon size={32} className="text-white" />
            </motion.div>
            <h3 className="text-[18px] font-bold text-neutral-900 mb-2">Request posted!</h3>
            <p className="text-[13px] text-neutral-600 mb-2">
              Looking for {playersNeeded} more {selectedSport} player{playersNeeded > 1 ? "s" : ""} ({totalPlayers} total).
            </p>
            {costMode === "split" && costPerPerson > 0 && (
              <p className="text-[13px] font-semibold text-neutral-700 mb-2">
                ₹{costPerPerson}/person (₹{Number(costTotal)} ÷ {totalPlayers} players)
              </p>
            )}
            {costMode === "organizer_pays" && (
              <p className="text-[13px] font-semibold text-emerald-700 mb-2">
                Free for all players — you're covering it. 🎉
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-2 justify-center mt-5">
              <Link
                href="/looking-for-players"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-orange-500 via-rose-500 to-red-600 text-white text-[13px] font-semibold shadow-[0_8px_24px_-6px_rgba(244,63,94,0.4)] hover:shadow-[0_12px_32px_-8px_rgba(244,63,94,0.5)] transition-shadow"
              >
                <UsersIcon size={15} />
                View all matches
              </Link>
              <button
                onClick={reset}
                className="px-5 py-2.5 rounded-xl border border-black/[0.08] text-neutral-700 text-[13px] font-semibold hover:bg-black/[0.02] transition-colors"
              >
                Post another
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
      <div className="bg-gradient-to-br from-orange-500/[0.06] to-transparent p-6 pb-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 via-rose-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-[0_6px_16px_-4px_rgba(244,63,94,0.4)]">
              <UsersIcon size={24} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[17px] font-bold text-neutral-900 mb-0.5">Looking for a player</h3>
              <p className="text-[12px] text-neutral-600">Post a live request and fill your squad</p>
            </div>
          </div>
          <Link
            href="/looking-for-players"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-500/[0.08] text-orange-700 text-[11px] font-bold uppercase tracking-wider border border-orange-500/20 hover:bg-orange-500/[0.12] transition-colors"
          >
            View all
            <ArrowRightIcon size={12} />
          </Link>
        </div>

        {/* Expand Trigger */}
        {!isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-br from-orange-500 via-rose-500 to-red-600 text-white text-[13px] font-semibold shadow-[0_8px_24px_-6px_rgba(244,63,94,0.4)] hover:shadow-[0_12px_32px_-8px_rgba(244,63,94,0.5)] transition-shadow"
          >
            <ZapIcon size={15} />
            Post live request
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
                  Sport
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
                          ? "bg-gradient-to-br from-orange-500 to-rose-600 text-white border-orange-500 shadow-sm"
                          : "bg-white text-neutral-600 border-black/[0.08] hover:border-orange-500/40"
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
                  Skill level needed
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
                          ? "bg-gradient-to-br from-orange-500 to-rose-600 text-white border-orange-500 shadow-sm"
                          : "bg-white text-neutral-600 border-black/[0.08] hover:border-orange-500/40"
                      )}
                    >
                      {level}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-2">
                  Match type
                </label>
                <div className="flex flex-wrap gap-2">
                  {MATCH_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setMatchType(t)}
                      className={cn(
                        "px-3 py-2 rounded-xl text-[12px] font-semibold border capitalize transition-all",
                        matchType === t
                          ? "bg-neutral-900 text-white border-neutral-900 shadow-sm"
                          : "bg-white text-neutral-600 border-black/[0.08] hover:border-black/[0.15]"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-2">
                    I already have
                  </label>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setPlayersInHand(Math.max(0, playersInHand - 1))}
                      className="w-10 h-10 rounded-xl border border-black/[0.08] flex items-center justify-center text-neutral-600 hover:border-orange-500/40 transition-colors text-[16px] font-bold"
                    >
                      -
                    </motion.button>
                    <span className="text-[20px] font-bold text-neutral-900 w-8 text-center">{playersInHand}</span>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setPlayersInHand(Math.min(21, playersInHand + 1))}
                      className="w-10 h-10 rounded-xl border border-black/[0.08] flex items-center justify-center text-neutral-600 hover:border-orange-500/40 transition-colors text-[16px] font-bold"
                    >
                      +
                    </motion.button>
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-2">
                    Looking for
                  </label>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setPlayersNeeded(Math.max(1, playersNeeded - 1))}
                      className="w-10 h-10 rounded-xl border border-black/[0.08] flex items-center justify-center text-neutral-600 hover:border-orange-500/40 transition-colors text-[16px] font-bold"
                    >
                      -
                    </motion.button>
                    <span className="text-[20px] font-bold text-orange-600 w-8 text-center">{playersNeeded}</span>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setPlayersNeeded(Math.min(22, playersNeeded + 1))}
                      className="w-10 h-10 rounded-xl border border-black/[0.08] flex items-center justify-center text-neutral-600 hover:border-orange-500/40 transition-colors text-[16px] font-bold"
                    >
                      +
                    </motion.button>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-neutral-500 -mt-2">
                Total squad: <span className="font-bold text-neutral-700">{totalPlayers}</span> players
              </p>

              <div>
                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-2">
                  Venue / turf name
                </label>
                <input
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="e.g. Champions Turf"
                  className="w-full px-3.5 py-3 rounded-xl border border-black/[0.08] bg-white text-[13px] text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/[0.08] transition-all"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-2">
                  Venue location
                </label>
                <div className="space-y-2">
                  <div className="relative">
                    <MapPinIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      value={venueQuery}
                      onChange={(e) => onVenueQuery(e.target.value)}
                      placeholder="Search address / area on map"
                      className="w-full pl-9 pr-3 py-3 rounded-xl border border-black/[0.08] bg-white text-[13px] text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/[0.08] transition-all"
                    />
                    {searching && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-neutral-400">…</span>
                    )}
                  </div>
                  {venueSuggestions.length > 0 && (
                    <div className="bg-white border border-black/[0.08] rounded-xl overflow-hidden shadow-lg max-h-40 overflow-y-auto">
                      {venueSuggestions.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => pickSuggestion(s)}
                          className="w-full text-left px-3 py-2.5 text-[12px] text-neutral-600 hover:bg-orange-500/[0.04] border-b border-black/[0.04] last:border-0 transition-colors"
                        >
                          {s.name}
                        </button>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={useMyLocation}
                    className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    Use my current location
                  </button>
                  {venueLat != null && venueLng != null && (
                    <div className="space-y-1.5">
                      <iframe
                        title="Venue map"
                        className="w-full h-32 rounded-xl border border-black/[0.08]"
                        src={osmEmbed(venueLat, venueLng)}
                      />
                      {venueAddress && <p className="text-[11px] text-neutral-500">{venueAddress}</p>}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-2">
                  Total turf / venue cost (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-neutral-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={costTotal}
                    onChange={(e) => onCostChange(e.target.value)}
                    placeholder="e.g. 1000 (0 for free)"
                    className="w-full pl-8 pr-3.5 py-3 rounded-xl border border-black/[0.08] bg-white text-[13px] text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/[0.08] transition-all"
                  />
                </div>
                {Number(costTotal) > 0 && totalPlayers > 0 && (
                  <div className="flex items-center justify-between mt-2 px-1">
                    <span className="text-[11px] text-neutral-500">
                      ₹{Number(costTotal)} ÷ {totalPlayers} players
                    </span>
                    <span className="text-[12px] font-bold text-orange-600">= ₹{costPerPerson}/person</span>
                  </div>
                )}
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-2">
                  Who pays?
                </label>
                <div className="flex gap-2">
                  {COST_MODES.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setCostMode(m.id)}
                      className={cn(
                        "flex-1 px-3 py-2 rounded-xl text-[12px] font-semibold border transition-all",
                        costMode === m.id
                          ? "bg-gradient-to-br from-orange-500 to-rose-600 text-white border-orange-500 shadow-sm"
                          : "bg-white text-neutral-600 border-black/[0.08] hover:border-orange-500/40"
                      )}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-2">
                  Kick-off
                </label>
                <div className="relative">
                  <ClockIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="datetime-local"
                    value={kickoff}
                    onChange={(e) => setKickoff(e.target.value)}
                    className="w-full pl-9 pr-3 py-3 rounded-xl border border-black/[0.08] bg-white text-[13px] text-neutral-900 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/[0.08] transition-all"
                  />
                </div>
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
                  onClick={handlePost}
                  disabled={posting}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-br from-orange-500 via-rose-500 to-red-600 text-white text-[13px] font-semibold shadow-[0_8px_24px_-6px_rgba(244,63,94,0.4)] hover:shadow-[0_12px_32px_-8px_rgba(244,63,94,0.5)] disabled:opacity-40 disabled:cursor-not-allowed transition-shadow"
                >
                  {posting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <UsersIcon size={15} />
                  )}
                  Post live request
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