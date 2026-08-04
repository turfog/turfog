"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase";
import { recordMatch, fetchMatches, logPlayerStat } from "@/lib/matches";
import type { Match, StatInput } from "@/lib/matches";
import { fetchMatchStats } from "@/lib/matchHistory";
import type { MatchPlayerStat } from "@/lib/matchHistory";
import { ArrowLeftIcon, TrophyIcon, PlusIcon, XIcon, ClockIcon, MapPinIcon, StarIcon, CheckCircleIcon } from "@/components/SvgIcons";

const SPORTS = ["football", "box-cricket", "badminton", "pickleball", "padel"];

const STAT_FIELDS: Record<string, Array<{ key: Exclude<keyof StatInput, "mvp">; label: string }>> = {
  football: [
    { key: "goals", label: "Goals" },
    { key: "assists", label: "Assists" },
    { key: "saves", label: "Saves" },
  ],
  "box-cricket": [
    { key: "runs", label: "Runs" },
    { key: "wickets", label: "Wickets" },
  ],
  badminton: [{ key: "points", label: "Points" }],
  pickleball: [{ key: "points", label: "Points" }],
  padel: [{ key: "points", label: "Points" }],
};

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatStatLine(s: MatchPlayerStat, sport: string): string {
  const parts: string[] = [];
  if (sport === "football") {
    if (s.goals > 0) parts.push(`${s.goals} goal${s.goals === 1 ? "" : "s"}`);
    if (s.assists > 0) parts.push(`${s.assists} assist${s.assists === 1 ? "" : "s"}`);
    if (s.saves > 0) parts.push(`${s.saves} save${s.saves === 1 ? "" : "s"}`);
  } else if (sport === "box-cricket") {
    if (s.runs > 0) parts.push(`${s.runs} run${s.runs === 1 ? "" : "s"}`);
    if (s.wickets > 0) parts.push(`${s.wickets} wicket${s.wickets === 1 ? "" : "s"}`);
  } else {
    if (s.points > 0) parts.push(`${s.points} point${s.points === 1 ? "" : "s"}`);
  }
  return parts.length > 0 ? parts.join(", ") : "played";
}

export default function MatchesHubClient() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchStats, setMatchStats] = useState<Record<string, MatchPlayerStat[]>>({});
  const [loading, setLoading] = useState(true);
  const [myId, setMyId] = useState<string | null>(null);
  const [showRecord, setShowRecord] = useState(false);
  const [busy, setBusy] = useState(false);

  const [sport, setSport] = useState("football");
  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");
  const [scoreA, setScoreA] = useState("");
  const [scoreB, setScoreB] = useState("");
  const [venue, setVenue] = useState("");

  const refresh = useCallback(async () => {
    const ms = await fetchMatches();
    setMatches(ms);
    const allStats = await fetchMatchStats(ms.map((m) => m.id));
    const grouped: Record<string, MatchPlayerStat[]> = {};
    allStats.forEach((s) => {
      if (!grouped[s.matchId]) grouped[s.matchId] = [];
      grouped[s.matchId].push(s);
    });
    setMatchStats(grouped);
    setLoading(false);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setMyId(data.user?.id ?? null));
    refresh();
  }, [refresh]);

  const onRecord = async () => {
    if (busy || !teamA.trim() || !teamB.trim()) return;
    setBusy(true);
    await recordMatch({
      sport,
      teamAName: teamA.trim(),
      teamBName: teamB.trim(),
      scoreA: scoreA === "" ? 0 : Number(scoreA),
      scoreB: scoreB === "" ? 0 : Number(scoreB),
      venue: venue.trim(),
    });
    setBusy(false);
    setShowRecord(false);
    setTeamA(""); setTeamB(""); setScoreA(""); setScoreB(""); setVenue("");
    await refresh();
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-2xl mx-auto px-6 py-6">
          <Link href="/" className="flex items-center gap-2 text-body-xs text-neutral-400 hover:text-neutral-600 transition-colors mb-2">
            <ArrowLeftIcon size={14} />
            Home
          </Link>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <TrophyIcon size={22} className="text-primary-green" />
              <h1 className="text-display-sm font-bold text-neutral-900 font-display">Matches</h1>
            </div>
            <Button size="sm" variant="primary" onClick={() => setShowRecord((v) => !v)}>
              {showRecord ? <XIcon size={15} /> : <PlusIcon size={15} />}
              {showRecord ? "Close" : "Record match"}
            </Button>
          </div>
          <p className="text-body-sm text-neutral-500">Record results and log your performance.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-4">
        {showRecord && (
          <Card padding="lg">
            <h3 className="text-body-sm font-semibold text-neutral-900 mb-3">Record a completed match</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select value={sport} onChange={(e) => setSport(e.target.value)} className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm bg-white outline-none focus:border-primary-green capitalize">
                {SPORTS.map((s) => <option key={s} value={s}>{s.replace("-", " ")}</option>)}
              </select>
              <input value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Venue" className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm outline-none focus:border-primary-green placeholder:text-neutral-400" />
              <input value={teamA} onChange={(e) => setTeamA(e.target.value)} placeholder="Team A name" className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm outline-none focus:border-primary-green placeholder:text-neutral-400" />
              <input value={teamB} onChange={(e) => setTeamB(e.target.value)} placeholder="Team B name" className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm outline-none focus:border-primary-green placeholder:text-neutral-400" />
              <input type="number" value={scoreA} onChange={(e) => setScoreA(e.target.value)} placeholder="Team A score" className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm outline-none focus:border-primary-green placeholder:text-neutral-400" />
              <input type="number" value={scoreB} onChange={(e) => setScoreB(e.target.value)} placeholder="Team B score" className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm outline-none focus:border-primary-green placeholder:text-neutral-400" />
            </div>
            <Button fullWidth loading={busy} disabled={!teamA.trim() || !teamB.trim()} onClick={onRecord} className="mt-3">Save match</Button>
          </Card>
        )}

        {loading ? (
          <p className="text-center py-12 text-body-sm text-neutral-400">Loading matches...</p>
        ) : matches.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-3"><TrophyIcon size={26} className="text-neutral-300" /></div>
            <p className="text-body-sm text-neutral-500">No matches recorded yet</p>
            <p className="text-caption text-neutral-400 mt-1">Record a result to start tracking performance.</p>
          </div>
        ) : (
          matches.map((m) => (
            <Link key={m.id} href={`/matches/${m.id}`}>
              <MatchRow match={m} myId={myId} stats={matchStats[m.id] ?? []} onStatsSaved={refresh} />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

function MatchRow({ match, myId, stats, onStatsSaved }: { match: Match; myId: string | null; stats: MatchPlayerStat[]; onStatsSaved: () => void }) {
  const [open, setOpen] = useState(false);
  const [statInput, setStatInput] = useState<StatInput>({});
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const fields = STAT_FIELDS[match.sport] ?? [];

  const onSave = async () => {
    if (busy || !myId) return;
    setBusy(true);
    await logPlayerStat(match.id, myId, statInput);
    setBusy(false);
    setSaved(true);
    setOpen(false);
    onStatsSaved();
  };

  return (
    <Card padding="lg">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <p className="text-body-sm font-semibold text-neutral-900">
            {match.teamAName} <span className="text-neutral-400">{match.scoreA} - {match.scoreB}</span> {match.teamBName}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-caption text-neutral-400 mt-0.5">
            <span className="capitalize">{match.sport.replace("-", " ")}</span>
            {match.venue && <span className="flex items-center gap-0.5"><MapPinIcon size={11} />{match.venue}</span>}
            <span className="flex items-center gap-0.5"><ClockIcon size={11} />{formatDate(match.playedAt)}</span>
          </div>
        </div>
        {myId && (
          saved ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald/10 text-emerald text-caption font-semibold"><CheckCircleIcon size={14} />Stats logged</span>
          ) : (
            <Button size="sm" variant="outline" onClick={() => setOpen((v) => !v)}>{open ? "Close" : "Log my stats"}</Button>
          )
        )}
      </div>

      {open && !saved && (
        <div className="mt-4 pt-4 border-t border-neutral-100 space-y-3">
          <div className="flex flex-wrap gap-3">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="text-caption text-neutral-500 mb-1 block">{f.label}</label>
                <input
                  type="number"
                  min={0}
                  value={statInput[f.key] ?? 0}
                  onChange={(e) => setStatInput((prev) => ({ ...prev, [f.key]: Number(e.target.value) }))}
                  className="w-20 px-3 py-2 rounded-xl border border-neutral-200 text-body-sm outline-none focus:border-primary-green"
                />
              </div>
            ))}
            <div>
              <label className="text-caption text-neutral-500 mb-1 block">MVP</label>
              <button
                onClick={() => setStatInput((prev) => ({ ...prev, mvp: !prev.mvp }))}
                className={cn("inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-body-xs font-medium transition-all", statInput.mvp ? "bg-amber/10 text-amber border-amber/30" : "bg-white text-neutral-600 border-neutral-200")}
              >
                <StarIcon size={14} />
                {statInput.mvp ? "MVP" : "Not MVP"}
              </button>
            </div>
          </div>
          <Button size="sm" variant="primary" loading={busy} onClick={onSave}>Save stats</Button>
        </div>
      )}

      {stats.length > 0 && (
        <div className="mt-4 pt-4 border-t border-neutral-100 space-y-2">
          <p className="text-caption font-semibold text-neutral-500 uppercase tracking-wide">Player performance</p>
          {stats.map((s) => (
            <div key={s.userId} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                {s.mvp && <StarIcon size={13} className="text-amber flex-shrink-0" />}
                <Link href={`/${s.username}`} className="text-body-xs font-medium text-neutral-900 hover:text-primary-green truncate">
                  {s.name}
                </Link>
              </div>
              <span className="text-caption text-neutral-400 flex-shrink-0">{formatStatLine(s, match.sport)}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}