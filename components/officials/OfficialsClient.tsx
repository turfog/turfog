"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useLocation } from "@/context/LocationContext";
import { haversineKm } from "@/lib/discovery";
import { fetchOfficials, registerOfficial } from "@/lib/officials";
import type { Official } from "@/lib/officials";
import type { SportId } from "@/types";
import {
  ShieldIcon,
  SearchIcon,
  MapPinIcon,
  StarIcon,
  PlusIcon,
  XIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  FootballIcon,
  CricketIcon,
  PickleballIcon,
  PadelIcon,
  BadmintonIcon,
} from "@/components/SvgIcons";

const sportIcon: Record<SportId, React.ReactNode> = {
  football: <FootballIcon size={13} />,
  "box-cricket": <CricketIcon size={13} />,
  pickleball: <PickleballIcon size={13} />,
  padel: <PadelIcon size={13} />,
  badminton: <BadmintonIcon size={13} />,
};

const sportName: Record<SportId, string> = {
  football: "Football",
  "box-cricket": "Box cricket",
  pickleball: "Pickleball",
  padel: "Padel",
  badminton: "Badminton",
};

const ROLES = ["referee", "umpire", "scorer", "timekeeper", "observer"];

function roleLabel(role: string): string {
  switch (role) {
    case "referee": return "Referee";
    case "umpire": return "Umpire";
    case "scorer": return "Scorer";
    case "timekeeper": return "Timekeeper";
    case "observer": return "Match observer";
    default: return role;
  }
}

export default function OfficialsClient() {
  const { lat, lng } = useLocation();
  const [officials, setOfficials] = useState<Official[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sport, setSport] = useState<SportId | "all">("all");
  const [role, setRole] = useState<string>("all");
  const [registering, setRegistering] = useState(false);
  const [busy, setBusy] = useState(false);

  const [rSport, setRSport] = useState<SportId>("football");
  const [rRole, setRRole] = useState("referee");
  const [rCert, setRCert] = useState("");
  const [rYears, setRYears] = useState("");
  const [rPrice, setRPrice] = useState("");
  const [rLangs, setRLangs] = useState("");
  const [rAvail, setRAvail] = useState("");
  const [rCity, setRCity] = useState("");
  const [rBio, setRBio] = useState("");

  const doSearch = useCallback(async (q: string, s: SportId | "all", r: string) => {
    setLoading(true);
    setOfficials(await fetchOfficials({ query: q, sport: s, role: r }));
    setLoading(false);
  }, []);

  useEffect(() => {
    doSearch("", "all", "all");
  }, [doSearch]);

  const withDistance = officials
    .map((o) => ({ ...o, distanceKm: lat != null && lng != null && o.latitude != null && o.longitude != null ? haversineKm(lat, lng, o.latitude, o.longitude) : null }))
    .sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));

  const onRegister = async () => {
    if (busy) return;
    setBusy(true);
    await registerOfficial({
      sport: rSport,
      officialRole: rRole,
      certification: rCert.trim(),
      yearsExperience: rYears === "" ? 0 : Number(rYears),
      price: rPrice === "" ? null : Number(rPrice),
      languages: rLangs.trim(),
      availability: rAvail.trim(),
      city: rCity.trim(),
      bio: rBio.trim(),
    });
    setBusy(false);
    setRegistering(false);
    await doSearch(query, sport, role);
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-1">
            <Link href="/" className="flex items-center gap-2 text-body-xs text-neutral-400 hover:text-neutral-600 transition-colors">
              <ArrowLeftIcon size={14} />
              Home
            </Link>
            <Button size="sm" variant="primary" onClick={() => setRegistering((v) => !v)}>
              {registering ? <XIcon size={15} /> : <PlusIcon size={15} />}
              {registering ? "Close" : "Become an official"}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <ShieldIcon size={22} className="text-primary-green" />
            <h1 className="text-display-sm font-bold text-neutral-900 font-display">Officials</h1>
          </div>
          <p className="text-body-sm text-neutral-500">Find certified referees and umpires near you.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-4 space-y-4">
        {registering && (
          <Card padding="lg">
            <h3 className="text-body-sm font-semibold text-neutral-900 mb-3">Register as an official</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-caption text-neutral-500 mb-1 block">Sport</label>
                <select value={rSport} onChange={(e) => setRSport(e.target.value as SportId)} className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-body-sm bg-white outline-none focus:border-primary-green">
                  {(Object.keys(sportName) as SportId[]).map((s) => <option key={s} value={s}>{sportName[s]}</option>)}
                </select>
              </div>
              <div>
                <label className="text-caption text-neutral-500 mb-1 block">Role</label>
                <select value={rRole} onChange={(e) => setRRole(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-body-sm bg-white outline-none focus:border-primary-green capitalize">
                  {ROLES.map((r) => <option key={r} value={r}>{roleLabel(r)}</option>)}
                </select>
              </div>
              <input value={rCert} onChange={(e) => setRCert(e.target.value)} placeholder="Certification (e.g. AIFF Certified)" className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm outline-none focus:border-primary-green placeholder:text-neutral-400" />
              <input value={rCity} onChange={(e) => setRCity(e.target.value)} placeholder="City" className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm outline-none focus:border-primary-green placeholder:text-neutral-400" />
              <input type="number" value={rYears} onChange={(e) => setRYears(e.target.value)} placeholder="Years of experience" className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm outline-none focus:border-primary-green placeholder:text-neutral-400" />
              <input type="number" value={rPrice} onChange={(e) => setRPrice(e.target.value)} placeholder="Price per match (optional)" className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm outline-none focus:border-primary-green placeholder:text-neutral-400" />
              <input value={rLangs} onChange={(e) => setRLangs(e.target.value)} placeholder="Languages (e.g. English, Hindi)" className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm outline-none focus:border-primary-green placeholder:text-neutral-400" />
              <input value={rAvail} onChange={(e) => setRAvail(e.target.value)} placeholder="Availability (e.g. Weekends)" className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm outline-none focus:border-primary-green placeholder:text-neutral-400" />
            </div>
            <textarea value={rBio} onChange={(e) => setRBio(e.target.value)} placeholder="Short bio" rows={2} className="w-full mt-3 px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm outline-none focus:border-primary-green resize-none placeholder:text-neutral-400" />
            <Button fullWidth loading={busy} onClick={onRegister} className="mt-3">Save official profile</Button>
          </Card>
        )}

        <Card padding="lg">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <SearchIcon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") doSearch(query, sport, role); }}
                placeholder="Search officials by name..."
                className="w-full pl-11 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm outline-none focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 placeholder:text-neutral-400"
              />
            </div>
            <Button onClick={() => doSearch(query, sport, role)}><SearchIcon size={16} />Search</Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <button onClick={() => { setSport("all"); doSearch(query, "all", role); }} className={cn("px-3 py-1.5 rounded-full text-caption font-medium border transition-all", sport === "all" ? "bg-primary-green text-white border-primary-green" : "bg-white text-neutral-600 border-neutral-200")}>All sports</button>
            {(Object.keys(sportName) as SportId[]).map((s) => (
              <button key={s} onClick={() => { setSport(s); doSearch(query, s, role); }} className={cn("inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-caption font-medium border transition-all", sport === s ? "bg-primary-green text-white border-primary-green" : "bg-white text-neutral-600 border-neutral-200")}>
                {sportIcon[s]}{sportName[s]}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <button onClick={() => { setRole("all"); doSearch(query, sport, "all"); }} className={cn("px-3 py-1.5 rounded-full text-caption font-medium border transition-all", role === "all" ? "bg-neutral-900 text-white border-neutral-900" : "bg-white text-neutral-600 border-neutral-200")}>All roles</button>
            {ROLES.map((r) => (
              <button key={r} onClick={() => { setRole(r); doSearch(query, sport, r); }} className={cn("px-3 py-1.5 rounded-full text-caption font-medium border transition-all capitalize", role === r ? "bg-neutral-900 text-white border-neutral-900" : "bg-white text-neutral-600 border-neutral-200")}>{roleLabel(r)}</button>
            ))}
          </div>
        </Card>

        {loading ? (
          <p className="text-center py-12 text-body-sm text-neutral-400">Loading officials...</p>
        ) : withDistance.length === 0 ? (
          <p className="text-center py-12 text-body-sm text-neutral-400">No officials match your filters.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {withDistance.map((o) => (
              <Link key={o.id} href={`/officials/${o.username}`}>
                <Card padding="md" className="hover:border-primary-green/30 h-full">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary-green/10 text-primary-green flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {o.avatar ? <img src={o.avatar} alt={o.displayName} className="w-full h-full object-cover" /> : <ShieldIcon size={22} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-body-sm font-semibold text-neutral-900 truncate">{o.displayName}</span>
                        {o.verified && <CheckCircleIcon size={14} className="text-electric-blue flex-shrink-0" />}
                      </div>
                      <div className="flex items-center gap-2 text-caption text-neutral-400 mt-0.5">
                        <span className="inline-flex items-center gap-1">{sportIcon[o.sport]}{sportName[o.sport]}</span>
                        <span className="capitalize">{roleLabel(o.officialRole)}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-caption text-neutral-500">
                        <span className="inline-flex items-center gap-0.5 text-amber"><StarIcon size={12} />{o.rating.toFixed(1)}</span>
                        <span>{o.matchesOfficiated} matches</span>
                        <span>{o.yearsExperience} yrs</span>
                        {o.price != null && <span>₹{o.price}/match</span>}
                      </div>
                      <div className="flex items-center gap-2 mt-1.5 text-caption text-neutral-400">
                        {o.city && <span className="inline-flex items-center gap-0.5"><MapPinIcon size={11} />{o.city}</span>}
                        {o.distanceKm != null && <span className="inline-flex items-center gap-0.5 text-primary-green"><MapPinIcon size={11} />{o.distanceKm.toFixed(1)} km</span>}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}