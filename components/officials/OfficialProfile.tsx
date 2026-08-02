"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn, timeAgo } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { createClient } from "@/lib/supabase";
import { fetchOfficialByUsername, fetchOfficialBookings, requestOfficial, respondBooking } from "@/lib/officials";
import type { Official, OfficialBooking } from "@/lib/officials";
import type { SportId } from "@/types";
import {
  ShieldIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  MapPinIcon,
  StarIcon,
  CalendarIcon,
  ClockIcon,
  TrophyIcon,
  XIcon,
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

const coverBySport: Record<SportId, string> = {
  football: "from-primary-green to-emerald",
  "box-cricket": "from-electric-blue to-primary-green",
  pickleball: "from-emerald to-electric-blue",
  padel: "from-amber to-sunset-orange",
  badminton: "from-sunset-orange to-amber",
};

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

function formatMatchDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export default function OfficialProfile({ username }: { username: string }) {
  const [official, setOfficial] = useState<Official | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [bookings, setBookings] = useState<OfficialBooking[]>([]);
  const [showRequest, setShowRequest] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [requested, setRequested] = useState(false);

  const [sport, setSport] = useState("");
  const [matchDate, setMatchDate] = useState("");
  const [teamName, setTeamName] = useState("");
  const [note, setNote] = useState("");

  const refresh = useCallback(async () => {
    const o = await fetchOfficialByUsername(username);
    setOfficial(o);
    if (o) {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const owner = !!user && o.userId === user.id;
      setIsOwner(owner);
      if (owner) setBookings(await fetchOfficialBookings(o.id));
      setSport(o.sport);
    }
    setLoading(false);
  }, [username]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (loading) {
    return <div className="min-h-screen bg-neutral-100 flex items-center justify-center"><p className="text-body-sm text-neutral-400">Loading official...</p></div>;
  }

  if (!official) {
    return (
      <div className="min-h-screen bg-neutral-100 flex flex-col items-center justify-center text-center px-6">
        <div className="w-14 h-14 rounded-full bg-neutral-200 flex items-center justify-center mb-4"><ShieldIcon size={26} className="text-neutral-400" /></div>
        <h1 className="text-display-xs font-bold text-neutral-900 font-display mb-2">Official not found</h1>
        <Link href="/officials" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-green text-white text-body-sm font-semibold rounded-xl"><ArrowLeftIcon size={16} />Browse officials</Link>
      </div>
    );
  }

  const onRequest = async () => {
    if (busy || !matchDate) return;
    setBusy("request");
    const ok = await requestOfficial(official.id, { sport: sport || official.sport, matchDate: new Date(matchDate).toISOString(), note: note.trim(), teamName: teamName.trim() });
    setBusy(null);
    if (ok) {
      setRequested(true);
      setShowRequest(false);
    }
  };

  const onRespond = async (bookingId: string, accept: boolean) => {
    if (busy) return;
    setBusy(bookingId);
    await respondBooking(bookingId, accept);
    setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: accept ? "accepted" : "rejected" } : b)));
    setBusy(null);
  };

  const cover = coverBySport[official.sport];

  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="relative">
        <div className={cn("relative h-40 md:h-52 bg-gradient-to-r overflow-hidden", cover)}>
          <motion.div className="absolute inset-0 opacity-20" style={{ background: "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.6) 50%, transparent 70%)" }} animate={{ x: ["-60%", "120%"] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", repeatDelay: 3 }} />
          <div className="absolute top-4 left-4">
            <Link href="/officials">
              <motion.span whileTap={{ scale: 0.9 }} className="inline-flex items-center gap-2 px-3 py-2 bg-black/20 backdrop-blur-md text-white text-body-xs font-medium rounded-xl hover:bg-black/30 transition-colors"><ArrowLeftIcon size={16} />Officials</motion.span>
            </Link>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6">
          <div className="relative -mt-12 mb-4 flex items-end gap-4">
            <div className="w-20 h-20 rounded-2xl bg-white shadow-card border border-neutral-100 flex items-center justify-center text-primary-green overflow-hidden">
              {official.avatar ? <img src={official.avatar} alt={official.displayName} className="w-full h-full object-cover" /> : <ShieldIcon size={34} />}
            </div>
            <div className="pb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-display-sm font-bold text-neutral-900 font-display">{official.displayName}</h1>
                {official.verified && <CheckCircleIcon size={18} className="text-electric-blue" />}
              </div>
              <div className="flex items-center gap-2 text-body-xs text-neutral-500">
                <span className="inline-flex items-center gap-1">{sportIcon[official.sport]}{sportName[official.sport]}</span>
                <span className="capitalize">{roleLabel(official.officialRole)}</span>
                {official.city && <span className="flex items-center gap-1"><MapPinIcon size={12} />{official.city}</span>}
              </div>
            </div>
          </div>

          {!isOwner && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {!showRequest && !requested && (
                <Button variant="primary" onClick={() => setShowRequest(true)}>Request to hire</Button>
              )}
              {requested && (
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald/10 text-emerald text-body-xs font-semibold"><CheckCircleIcon size={15} />Request sent</span>
              )}
            </div>
          )}

          {showRequest && !isOwner && (
            <Card padding="lg" className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-body-sm font-semibold text-neutral-900">Request to hire</h3>
                <button onClick={() => setShowRequest(false)} className="w-7 h-7 rounded-lg hover:bg-neutral-100 text-neutral-400 flex items-center justify-center"><XIcon size={16} /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input value={sport} onChange={(e) => setSport(e.target.value)} placeholder="Sport" className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm outline-none focus:border-primary-green placeholder:text-neutral-400" />
                <input type="datetime-local" value={matchDate} onChange={(e) => setMatchDate(e.target.value)} className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm outline-none focus:border-primary-green" />
                <input value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Team name (optional)" className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm outline-none focus:border-primary-green placeholder:text-neutral-400 sm:col-span-2" />
                <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Details about the match..." rows={2} className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm outline-none focus:border-primary-green resize-none placeholder:text-neutral-400 sm:col-span-2" />
              </div>
              <Button fullWidth loading={busy === "request"} disabled={!matchDate} onClick={onRequest} className="mt-3">Send request</Button>
            </Card>
          )}

          {official.bio && <p className="text-body-sm text-neutral-600 mb-4">{official.bio}</p>}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { Icon: StarIcon, value: official.rating.toFixed(1), label: `Rating (${official.reviewsCount})`, color: "text-amber" },
            { Icon: TrophyIcon, value: official.matchesOfficiated, label: "Matches", color: "text-primary-green" },
            { Icon: CalendarIcon, value: official.yearsExperience, label: "Years", color: "text-electric-blue" },
            { Icon: ShieldIcon, value: official.price != null ? `₹${official.price}` : "—", label: "Per match", color: "text-sunset-orange" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-neutral-200 shadow-card p-4 text-center">
              <s.Icon size={20} className={cn(s.color, "mx-auto mb-2")} />
              <p className="text-display-xs font-bold text-neutral-900">{s.value}</p>
              <p className="text-caption text-neutral-400">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-16 space-y-6">
        <Card padding="lg">
          <h2 className="text-body-md font-semibold text-neutral-900 font-display mb-3">About</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-caption font-semibold text-neutral-400 uppercase tracking-wide mb-1">Certification</p>
              <p className="text-body-sm text-neutral-700">{official.certification || "—"}</p>
            </div>
            <div>
              <p className="text-caption font-semibold text-neutral-400 uppercase tracking-wide mb-1">Languages</p>
              <p className="text-body-sm text-neutral-700">{official.languages || "—"}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-caption font-semibold text-neutral-400 uppercase tracking-wide mb-1 flex items-center gap-1"><ClockIcon size={12} />Availability</p>
              <p className="text-body-sm text-neutral-700">{official.availability || "—"}</p>
            </div>
          </div>
        </Card>

        {isOwner && (
          <div>
            <h2 className="text-body-md font-semibold text-neutral-900 font-display mb-3">Booking requests ({bookings.length})</h2>
            {bookings.length === 0 ? (
              <p className="text-body-xs text-neutral-400">No booking requests yet.</p>
            ) : (
              <div className="space-y-3">
                {bookings.map((b) => (
                  <Card key={b.id} padding="md">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <p className="text-body-sm font-semibold text-neutral-900">{b.requesterName}{b.teamName ? ` · ${b.teamName}` : ""}</p>
                        <div className="flex flex-wrap items-center gap-2 text-caption text-neutral-400 mt-0.5">
                          <span className="capitalize">{b.sport}</span>
                          <span className="flex items-center gap-0.5"><ClockIcon size={11} />{formatMatchDate(b.matchDate)}</span>
                          <span>requested {timeAgo(b.createdAt)}</span>
                        </div>
                        {b.note && <p className="text-body-xs text-neutral-500 mt-1.5">{b.note}</p>}
                      </div>
                      {b.status === "requested" ? (
                        <div className="flex gap-2">
                          <Button size="sm" variant="primary" loading={busy === b.id} onClick={() => onRespond(b.id, true)}>Accept</Button>
                          <Button size="sm" variant="outline" loading={busy === b.id} onClick={() => onRespond(b.id, false)}>Reject</Button>
                        </div>
                      ) : (
                        <span className={cn("px-3 py-1.5 rounded-xl text-caption font-semibold capitalize", b.status === "accepted" ? "bg-emerald/10 text-emerald" : "bg-coral/10 text-coral")}>{b.status}</span>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}