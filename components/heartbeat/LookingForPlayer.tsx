"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { SPORTS, SKILL_LEVELS } from "@/lib/constants";
import type { SportId, MatchType } from "@/types";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useLocation } from "@/context/LocationContext";
import { createMatchRequest, searchPlaces, reverseGeocode } from "@/lib/discovery";
import {
  UsersIcon,
  MapPinIcon,
  ZapIcon,
  CheckCircleIcon,
  ClockIcon,
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

  const costPerPerson =
    Number(costTotal) > 0 && playersNeeded > 0 ? Math.ceil(Number(costTotal) / playersNeeded) : 0;

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
    setPlayersNeeded(2); setMatchType("casual"); setVenue(""); setNote("");
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
      <Card className="border-sunset-orange/30 bg-gradient-to-br from-sunset-orange/5 to-white">
        <div className="text-center py-4">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald/10 rounded-2xl mb-3">
            <CheckCircleIcon size={28} className="text-emerald" />
          </div>
          <h3 className="text-body-md font-semibold text-neutral-900 mb-1">Request posted</h3>
          <p className="text-body-xs text-neutral-500 mb-2">
            Your request for {playersNeeded} {selectedSport} player{playersNeeded > 1 ? "s" : ""} is live nearby.
          </p>
          {costMode === "split" && costPerPerson > 0 && (
            <p className="text-body-xs font-medium text-neutral-700 mb-2">₹{costPerPerson}/person (₹{Number(costTotal)} ÷ {playersNeeded})</p>
          )}
          {costMode === "organizer_pays" && (
            <p className="text-body-xs font-medium text-emerald mb-2">Free for all players — you're covering it. 🎉</p>
          )}
          <Button variant="outline" size="sm" onClick={reset}>Post another</Button>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={cn("transition-all duration-300 cursor-pointer group", isExpanded ? "border-sunset-orange/40 shadow-glow-orange" : "hover:border-sunset-orange/20")}
      onClick={() => !isExpanded && setIsExpanded(true)}
    >
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 bg-sunset-orange/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-sunset-orange/15 transition-colors">
          <UsersIcon size={22} className="text-sunset-orange" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-body-sm font-semibold text-neutral-900">Looking for a player</h3>
          <p className="text-body-xs text-neutral-500">Post a live request nearby</p>
        </div>
        <ZapIcon size={18} className={cn("text-neutral-300 transition-colors", isExpanded ? "text-sunset-orange" : "group-hover:text-sunset-orange")} />
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="overflow-hidden">
            <div className="pt-4 mt-4 border-t border-neutral-100 space-y-4">
              <div>
                <label className="text-body-xs font-medium text-neutral-700 mb-2 block">Sport</label>
                <div className="flex flex-wrap gap-2">
                  {SPORTS.map((sport) => (
                    <motion.button key={sport.id} whileTap={{ scale: 0.94 }} onClick={(e) => { e.stopPropagation(); setSelectedSport(sport.id); }}
                      className={cn("flex items-center gap-1.5 px-3 py-2 rounded-xl text-body-xs font-medium border transition-all", selectedSport === sport.id ? "bg-sunset-orange text-white border-sunset-orange" : "bg-white text-neutral-600 border-neutral-200 hover:border-sunset-orange/40")}>
                      {sportIconMap[sport.id]}{sport.name}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-body-xs font-medium text-neutral-700 mb-2 block">Skill level needed</label>
                <div className="flex gap-2">
                  {SKILL_LEVELS.map((level) => (
                    <motion.button key={level} whileTap={{ scale: 0.94 }} onClick={(e) => { e.stopPropagation(); setSelectedSkill(level); }}
                      className={cn("flex-1 px-3 py-2 rounded-xl text-body-xs font-medium border capitalize transition-all", selectedSkill === level ? "bg-sunset-orange text-white border-sunset-orange" : "bg-white text-neutral-600 border-neutral-200 hover:border-sunset-orange/40")}>
                      {level}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-body-xs font-medium text-neutral-700 mb-2 block">Match type</label>
                <div className="flex flex-wrap gap-2">
                  {MATCH_TYPES.map((t) => (
                    <button key={t} onClick={(e) => { e.stopPropagation(); setMatchType(t); }}
                      className={cn("px-3 py-1.5 rounded-full text-caption font-medium border capitalize transition-all", matchType === t ? "bg-neutral-900 text-white border-neutral-900" : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-300")}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-body-xs font-medium text-neutral-700 mb-2 block">Total players in match</label>
                <div className="flex items-center gap-3">
                  <motion.button whileTap={{ scale: 0.9 }} onClick={(e) => { e.stopPropagation(); setPlayersNeeded(Math.max(1, playersNeeded - 1)); }} className="w-9 h-9 rounded-xl border border-neutral-200 flex items-center justify-center text-neutral-600 hover:border-sunset-orange/40 transition-colors text-body-md font-bold">-</motion.button>
                  <span className="text-display-xs font-bold text-neutral-900 w-8 text-center">{playersNeeded}</span>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={(e) => { e.stopPropagation(); setPlayersNeeded(Math.min(22, playersNeeded + 1)); }} className="w-9 h-9 rounded-xl border border-neutral-200 flex items-center justify-center text-neutral-600 hover:border-sunset-orange/40 transition-colors text-body-md font-bold">+</motion.button>
                </div>
              </div>

              <div onClick={(e) => e.stopPropagation()}>
                <label className="text-body-xs font-medium text-neutral-700 mb-2 block">Venue / turf name</label>
                <input value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="e.g. Champions Turf"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-xs text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-sunset-orange focus:ring-2 focus:ring-sunset-orange/20 transition-all" />
              </div>

              <div onClick={(e) => e.stopPropagation()}>
                <label className="text-body-xs font-medium text-neutral-700 mb-2 block">Venue location</label>
                <div className="space-y-2">
                  <div className="relative">
                    <MapPinIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input value={venueQuery} onChange={(e) => onVenueQuery(e.target.value)} placeholder="Search address / area on map"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 text-body-xs text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-sunset-orange focus:ring-2 focus:ring-sunset-orange/20 transition-all" />
                    {searching && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-caption text-neutral-400">…</span>}
                  </div>
                  {venueSuggestions.length > 0 && (
                    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-card max-h-40 overflow-y-auto">
                      {venueSuggestions.map((s, i) => (
                        <button key={i} onClick={() => pickSuggestion(s)} className="w-full text-left px-3 py-2 text-caption text-neutral-600 hover:bg-neutral-50 border-b border-neutral-100 last:border-0">
                          {s.name}
                        </button>
                      ))}
                    </div>
                  )}
                  <button onClick={useMyLocation} className="text-caption font-medium text-electric-blue hover:underline">Use my current location</button>
                  {venueLat != null && venueLng != null && (
                    <div className="space-y-1">
                      <iframe title="Venue map" className="w-full h-32 rounded-xl border border-neutral-200" src={osmEmbed(venueLat, venueLng)} />
                      {venueAddress && <p className="text-caption text-neutral-400">{venueAddress}</p>}
                    </div>
                  )}
                </div>
              </div>

              <div onClick={(e) => e.stopPropagation()}>
                <label className="text-body-xs font-medium text-neutral-700 mb-2 block">Turf / venue cost (₹)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-body-xs font-semibold text-neutral-500">₹</span>
                  <input type="number" min={0} value={costTotal} onChange={(e) => onCostChange(e.target.value)} placeholder="e.g. 1000 (0 for free)"
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-xs text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-sunset-orange focus:ring-2 focus:ring-sunset-orange/20 transition-all" />
                </div>
                {Number(costTotal) > 0 && playersNeeded > 0 && (
                  <div className="flex items-center justify-between mt-2 px-1">
                    <span className="text-caption text-neutral-500">₹{Number(costTotal)} ÷ {playersNeeded} players</span>
                    <span className="text-body-xs font-bold text-sunset-orange">= ₹{costPerPerson}/person</span>
                  </div>
                )}
              </div>

              <div onClick={(e) => e.stopPropagation()}>
                <label className="text-body-xs font-medium text-neutral-700 mb-2 block">Who pays?</label>
                <div className="flex gap-2">
                  {COST_MODES.map((m) => (
                    <button key={m.id} onClick={() => setCostMode(m.id)}
                      className={cn("flex-1 px-3 py-2 rounded-xl text-body-xs font-medium border transition-all", costMode === m.id ? "bg-sunset-orange text-white border-sunset-orange" : "bg-white text-neutral-600 border-neutral-200 hover:border-sunset-orange/40")}>
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div onClick={(e) => e.stopPropagation()}>
                <label className="text-body-xs font-medium text-neutral-700 mb-2 block">Kick-off</label>
                <div className="relative">
                  <ClockIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input type="datetime-local" value={kickoff} onChange={(e) => setKickoff(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 text-body-xs text-neutral-900 outline-none focus:border-sunset-orange focus:ring-2 focus:ring-sunset-orange/20 transition-all" />
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-body-xs text-neutral-400">
                <MapPinIcon size={13} /><span>{label}</span>
              </div>

              {error && <p className="text-body-xs text-coral bg-coral/5 rounded-lg px-3 py-2">{error}</p>}

              <Button fullWidth loading={posting} onClick={handlePost} className="bg-sunset-orange hover:bg-sunset-orange/90">
                <UsersIcon size={16} />Post live request
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}