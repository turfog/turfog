"use client";

import { useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase";
import { recordMatch, logPlayerStat } from "@/lib/matches";
import { ArrowLeftIcon, CheckCircleIcon } from "@/components/SvgIcons";

const SPORTS = ["football", "box-cricket", "badminton", "pickleball", "padel"];

export default function RecordMatchClient() {
  const [sport, setSport] = useState("football");
  const [teamAName, setTeamAName] = useState("");
  const [teamBName, setTeamBName] = useState("");
  const [scoreA, setScoreA] = useState("");
  const [scoreB, setScoreB] = useState("");
  const [goals, setGoals] = useState("");
  const [assists, setAssists] = useState("");
  const [location, setLocation] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

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
          <p className="text-body-sm text-neutral-500">Log the result and your performance. It feeds your profile and the Golden Boot.</p>
        </div>

        {done ? (
          <Card padding="lg">
            <div className="flex items-center gap-2">
              <CheckCircleIcon size={20} className="text-primary-green" />
              <p className="text-body-md font-semibold text-neutral-900">Match recorded!</p>
            </div>
            <p className="text-body-sm text-neutral-500 mt-1">Your performance now shows on your profile.</p>
            <Link href="/profile" className="inline-block mt-3 text-body-sm text-electric-blue font-medium hover:underline">View my profile</Link>
          </Card>
        ) : (
          <Card padding="lg">
            <div className="space-y-4">
              <div>
                <label className="text-body-xs font-medium text-neutral-500 block mb-1">Sport</label>
                <select value={sport} onChange={(e) => setSport(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm bg-white outline-none focus:border-primary-green capitalize">
                  {SPORTS.map((s) => <option key={s} value={s}>{s.replace("-", " ")}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-body-xs font-medium text-neutral-500 block mb-1">Team A</label>
                  <input value={teamAName} onChange={(e) => setTeamAName(e.target.value)} placeholder="Team A name" className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm outline-none focus:border-primary-green" />
                </div>
                <div>
                  <label className="text-body-xs font-medium text-neutral-500 block mb-1">Team B</label>
                  <input value={teamBName} onChange={(e) => setTeamBName(e.target.value)} placeholder="Team B name" className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm outline-none focus:border-primary-green" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-body-xs font-medium text-neutral-500 block mb-1">Score A</label>
                  <input type="number" min="0" value={scoreA} onChange={(e) => setScoreA(e.target.value)} placeholder="0" className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm outline-none focus:border-primary-green" />
                </div>
                <div>
                  <label className="text-body-xs font-medium text-neutral-500 block mb-1">Score B</label>
                  <input type="number" min="0" value={scoreB} onChange={(e) => setScoreB(e.target.value)} placeholder="0" className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm outline-none focus:border-primary-green" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-body-xs font-medium text-neutral-500 block mb-1">Your goals</label>
                  <input type="number" min="0" value={goals} onChange={(e) => setGoals(e.target.value)} placeholder="0" className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm outline-none focus:border-primary-green" />
                </div>
                <div>
                  <label className="text-body-xs font-medium text-neutral-500 block mb-1">Your assists</label>
                  <input type="number" min="0" value={assists} onChange={(e) => setAssists(e.target.value)} placeholder="0" className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm outline-none focus:border-primary-green" />
                </div>
              </div>

              <div>
                <label className="text-body-xs font-medium text-neutral-500 block mb-1">Location (optional)</label>
                <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Where was it played?" className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm outline-none focus:border-primary-green" />
              </div>

              <Button variant="primary" loading={busy} onClick={onSubmit} disabled={!teamAName.trim() || !teamBName.trim()}>
                Record match
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}