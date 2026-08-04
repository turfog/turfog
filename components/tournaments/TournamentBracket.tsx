"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { recordKnockoutResult } from "@/lib/knockout";

type Row = Record<string, unknown>;

interface BracketFixture {
  id: string;
  round: number;
  position: number;
  teamAName: string;
  teamBName: string;
  scoreA: number | null;
  scoreB: number | null;
  status: string;
}

export default function TournamentBracket({
  tournamentId,
  canEdit,
}: {
  tournamentId: string;
  canEdit: boolean;
}) {
  const [rounds, setRounds] = useState<BracketFixture[][]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [scores, setScores] = useState<Record<string, { a: string; b: string }>>({});

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("tournament_fixtures")
      .select("*")
      .eq("tournament_id", tournamentId)
      .order("round", { ascending: true })
      .order("position", { ascending: true });
    const rows = (data ?? []) as Row[];
    const teamIds = Array.from(
      new Set(rows.flatMap((r) => [r.team_a_id, r.team_b_id].filter(Boolean).map(String)))
    );
    const teamNames = new Map<string, string>();
    if (teamIds.length > 0) {
      const { data: teams } = await supabase.from("teams").select("id, name").in("id", teamIds);
      ((teams ?? []) as Row[]).forEach((t) => teamNames.set(String(t.id), String(t.name ?? "Team")));
    }
    const byRound = new Map<number, BracketFixture[]>();
    rows.forEach((r) => {
      const round = Number(r.round ?? 1);
      if (!byRound.has(round)) byRound.set(round, []);
      byRound.get(round)!.push({
        id: String(r.id),
        round,
        position: Number(r.position ?? 0),
        teamAName: r.team_a_id ? teamNames.get(String(r.team_a_id)) ?? "TBD" : "—",
        teamBName: r.team_b_id ? teamNames.get(String(r.team_b_id)) ?? "TBD" : "—",
        scoreA: r.score_a != null ? Number(r.score_a) : null,
        scoreB: r.score_b != null ? Number(r.score_b) : null,
        status: String(r.status ?? "upcoming"),
      });
    });
    const grouped = Array.from(byRound.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([, f]) => f);
    setRounds(grouped);
    setLoading(false);
  }, [tournamentId]);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (fx: BracketFixture) => {
    const s = scores[fx.id];
    if (!s || s.a === "" || s.b === "") return;
    setBusy(fx.id);
    await recordKnockoutResult(fx.id, Number(s.a), Number(s.b));
    setBusy(null);
    await load();
  };

  if (loading) {
    return <p className="text-body-sm text-neutral-400 py-6 text-center">Loading bracket...</p>;
  }
  if (rounds.length === 0) {
    return <p className="text-body-sm text-neutral-400 py-6 text-center">No bracket yet.</p>;
  }

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-6 min-w-max pb-2">
        {rounds.map((round, ri) => (
          <div key={ri} className="flex flex-col gap-4 min-w-[220px]">
            <p className="text-caption font-semibold text-neutral-400 uppercase tracking-wide text-center">
              {ri === rounds.length - 1 ? "Final" : `Round ${ri + 1}`}
            </p>
            <div className="flex flex-col gap-4 flex-1 justify-around">
              {round.map((fx) => (
                <div key={fx.id} className="bg-white rounded-xl border border-neutral-200 shadow-card p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-body-sm truncate ${fx.status === "completed" && (fx.scoreA ?? 0) > (fx.scoreB ?? 0) ? "font-bold text-neutral-900" : "text-neutral-700"}`}>
                      {fx.teamAName}
                    </span>
                    {fx.status === "completed" ? (
                      <span className="text-body-sm font-bold text-neutral-900">{fx.scoreA}</span>
                    ) : canEdit && fx.teamAName !== "—" && fx.teamBName !== "—" ? (
                      <input
                        type="number"
                        min={0}
                        value={scores[fx.id]?.a ?? ""}
                        onChange={(e) => setScores((p) => ({ ...p, [fx.id]: { a: e.target.value, b: p[fx.id]?.b ?? "" } }))}
                        className="w-12 px-2 py-1 rounded-lg border border-neutral-200 text-body-sm text-center outline-none focus:border-electric-blue"
                      />
                    ) : null}
                  </div>
                  <div className="h-px bg-neutral-100 my-2" />
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-body-sm truncate ${fx.status === "completed" && (fx.scoreB ?? 0) > (fx.scoreA ?? 0) ? "font-bold text-neutral-900" : "text-neutral-700"}`}>
                      {fx.teamBName}
                    </span>
                    {fx.status === "completed" ? (
                      <span className="text-body-sm font-bold text-neutral-900">{fx.scoreB}</span>
                    ) : canEdit && fx.teamAName !== "—" && fx.teamBName !== "—" ? (
                      <input
                        type="number"
                        min={0}
                        value={scores[fx.id]?.b ?? ""}
                        onChange={(e) => setScores((p) => ({ ...p, [fx.id]: { a: p[fx.id]?.a ?? "", b: e.target.value } }))}
                        className="w-12 px-2 py-1 rounded-lg border border-neutral-200 text-body-sm text-center outline-none focus:border-electric-blue"
                      />
                    ) : null}
                  </div>
                  {canEdit && fx.status === "upcoming" && fx.teamAName !== "—" && fx.teamBName !== "—" && (
                    <button
                      onClick={() => save(fx)}
                      disabled={busy === fx.id || !scores[fx.id] || scores[fx.id].a === "" || scores[fx.id].b === ""}
                      className="mt-2 w-full px-3 py-1.5 rounded-lg bg-primary-green text-white text-body-sm font-semibold hover:bg-primary-green/90 transition-colors disabled:opacity-40"
                    >
                      {busy === fx.id ? "Saving..." : "Save result"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}