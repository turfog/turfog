"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase";
import {
  fetchTournamentBySlug,
  fetchTournamentTeams,
  fetchFixtures,
  fetchMyTeams,
  registerTeamForTournament,
  generateRoundRobin,
  recordFixtureResult,
  computeLeagueTable,
} from "@/lib/tournaments";
import { generateKnockout } from "@/lib/knockout";
import TournamentBracket from "@/components/tournaments/TournamentBracket";
import GoldenBoot from "@/components/tournaments/GoldenBoot";
import type { Tournament, TournamentTeam, Fixture } from "@/lib/tournaments";
import { ArrowLeftIcon, TrophyIcon, UsersIcon, CheckCircleIcon, MapPinIcon } from "@/components/SvgIcons";

export default function TournamentDetail({ slug }: { slug: string }) {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [teams, setTeams] = useState<TournamentTeam[]>([]);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [myTeams, setMyTeams] = useState<Array<{ id: string; name: string; slug: string }>>([]);
  const [myId, setMyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [registerTeamId, setRegisterTeamId] = useState("");

  const refresh = useCallback(async () => {
    const t = await fetchTournamentBySlug(slug);
    setTournament(t);
    if (t) {
      const [tm, fx] = await Promise.all([fetchTournamentTeams(t.id), fetchFixtures(t.id)]);
      setTeams(tm);
      setFixtures(fx);
    }
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setMyId(data.user?.id ?? null));
    fetchMyTeams().then(setMyTeams);
    refresh();
  }, [refresh]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <p className="text-body-sm text-neutral-400">Loading tournament...</p>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-neutral-100 flex flex-col items-center justify-center gap-3">
        <p className="text-display-sm font-display font-semibold text-neutral-900">Tournament not found</p>
        <Link href="/tournaments" className="text-electric-blue text-body-sm font-medium">Browse tournaments</Link>
      </div>
    );
  }

  const isCreator = !!myId && tournament.createdBy === myId;
  const registeredTeamIds = new Set(teams.map((t) => t.teamId));
  const availableToRegister = myTeams.filter((t) => !registeredTeamIds.has(t.id));
  const table = tournament.format === "league" ? computeLeagueTable(fixtures) : [];
  const teamNameById = new Map(teams.map((t) => [t.teamId, t.teamName]));

  const onRegister = async () => {
    if (busy || !registerTeamId) return;
    setBusy(true);
    await registerTeamForTournament(tournament.id, registerTeamId);
    setBusy(false);
    setRegisterTeamId("");
    await refresh();
  };

  const onGenerate = async () => {
    if (busy) return;
    setBusy(true);
    if (tournament.format === "knockout") {
      await generateKnockout(tournament.id);
    } else {
      await generateRoundRobin(tournament.id);
    }
    setBusy(false);
    await refresh();
  };

  return (
    <div className="min-h-screen bg-neutral-100 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div>
          <Link href="/tournaments" className="inline-flex items-center gap-1.5 text-body-sm text-neutral-500 hover:text-neutral-900 transition-colors">
            <ArrowLeftIcon size={16} />
            Tournaments
          </Link>
        </div>

        <Card padding="lg">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary-green/10 flex items-center justify-center flex-shrink-0">
              <TrophyIcon size={24} className="text-primary-green" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-display-sm font-display font-bold text-neutral-900">{tournament.name}</h1>
              <p className="text-body-sm text-neutral-500">
                <span className="capitalize">{tournament.sport}</span>
                <span className="capitalize"> · {tournament.format}</span>
                {tournament.city && (
                  <span className="inline-flex items-center gap-1 ml-2">
                    <MapPinIcon size={13} />
                    {tournament.city}
                  </span>
                )}
              </p>
            </div>
          </div>
          {tournament.description && (
            <p className="text-body-sm text-neutral-600 mt-3">{tournament.description}</p>
          )}
        </Card>

        {tournament.status === "registration" && (
          <Card padding="lg">
            <h2 className="text-body-md font-semibold text-neutral-900 font-display mb-3">Register a team</h2>
            {availableToRegister.length === 0 ? (
              <p className="text-body-xs text-neutral-400">No eligible teams left to register (or you are not a member of any team).</p>
            ) : (
              <div className="flex gap-2">
                <select
                  value={registerTeamId}
                  onChange={(e) => setRegisterTeamId(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm bg-white outline-none focus:border-primary-green"
                >
                  <option value="">Select a team</option>
                  {availableToRegister.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                <Button variant="primary" loading={busy} onClick={onRegister}>Register</Button>
              </div>
            )}
            {isCreator && teams.length >= 2 && (
              <Button variant="outline" loading={busy} onClick={onGenerate} className="mt-3">
                {tournament.format === "knockout" ? "Generate bracket" : "Generate round-robin fixtures"}
              </Button>
            )}
            {isCreator && teams.length < 2 && (
              <p className="text-caption text-neutral-400 mt-2">Register at least 2 teams to generate fixtures.</p>
            )}
          </Card>
        )}

        <div>
          <h2 className="text-body-md font-semibold text-neutral-900 font-display mb-3 flex items-center gap-2">
            <UsersIcon size={18} className="text-neutral-500" />
            Teams ({teams.length})
          </h2>
          {teams.length === 0 ? (
            <p className="text-body-xs text-neutral-400">No teams registered yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {teams.map((t) => (
                <Card key={t.id} padding="md">
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon size={16} className="text-primary-green flex-shrink-0" />
                    <p className="text-body-sm font-semibold text-neutral-900 truncate">{t.teamName}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {tournament.format === "knockout" ? (
          <div>
            <h2 className="text-body-md font-semibold text-neutral-900 font-display mb-3">Bracket</h2>
            {fixtures.length === 0 ? (
              <p className="text-body-xs text-neutral-400">No bracket yet.{tournament.status === "registration" ? " Generate it once teams are registered." : ""}</p>
            ) : (
              <TournamentBracket tournamentId={tournament.id} canEdit={isCreator} />
            )}
          </div>
        ) : (
          <div>
            <h2 className="text-body-md font-semibold text-neutral-900 font-display mb-3">Fixtures ({fixtures.length})</h2>
            {fixtures.length === 0 ? (
              <p className="text-body-xs text-neutral-400">No fixtures yet.{tournament.status === "registration" ? " Generate them once teams are registered." : ""}</p>
            ) : (
              <div className="space-y-3">
                {fixtures.map((f) => <FixtureRow key={f.id} fixture={f} canEdit={isCreator} onSaved={refresh} />)}
              </div>
            )}
          </div>
        )}

        {tournament.format === "league" && table.length > 0 && (
          <Card padding="lg">
            <h2 className="text-body-md font-semibold text-neutral-900 font-display mb-3">League table</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-body-sm">
                <thead>
                  <tr className="text-left text-caption text-neutral-400 border-b border-neutral-200">
                    <th className="py-2 pr-2">#</th>
                    <th className="py-2 pr-2">Team</th>
                    <th className="py-2 pr-2">P</th>
                    <th className="py-2 pr-2">W</th>
                    <th className="py-2 pr-2">D</th>
                    <th className="py-2 pr-2">L</th>
                    <th className="py-2 pr-2">GD</th>
                    <th className="py-2 pr-2">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {table.map((r, i) => (
                    <tr key={r.teamId} className="border-b border-neutral-100">
                      <td className="py-2 pr-2">{i + 1}</td>
                      <td className="py-2 pr-2 font-medium text-neutral-900">{teamNameById.get(r.teamId) ?? "Team"}</td>
                      <td className="py-2 pr-2">{r.played}</td>
                      <td className="py-2 pr-2">{r.won}</td>
                      <td className="py-2 pr-2">{r.drawn}</td>
                      <td className="py-2 pr-2">{r.lost}</td>
                      <td className="py-2 pr-2">{r.gd > 0 ? `+${r.gd}` : r.gd}</td>
                      <td className="py-2 pr-2 font-semibold">{r.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        <GoldenBoot />
      </div>
    </div>
  );
}

function FixtureRow({ fixture, canEdit, onSaved }: { fixture: Fixture; canEdit: boolean; onSaved: () => void }) {
  const [scoreA, setScoreA] = useState("");
  const [scoreB, setScoreB] = useState("");
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (busy) return;
    setBusy(true);
    await recordFixtureResult(fixture.id, scoreA === "" ? 0 : Number(scoreA), scoreB === "" ? 0 : Number(scoreB));
    setBusy(false);
    onSaved();
  };

  return (
    <Card padding="md">
      <div className="flex items-center justify-between gap-3">
        <p className="text-body-sm text-neutral-900">
          {fixture.teamAName} vs {fixture.teamBName}
        </p>
        <span className="text-caption text-neutral-400">Round {fixture.round}</span>
      </div>
      {fixture.status === "completed" ? (
        <p className="text-body-sm font-semibold text-neutral-900 mt-2">
          {fixture.scoreA} - {fixture.scoreB}
        </p>
      ) : canEdit ? (
        <div className="flex items-center gap-2 mt-2">
          <input
            type="number"
            value={scoreA}
            onChange={(e) => setScoreA(e.target.value)}
            placeholder="0"
            className="w-14 px-2 py-1.5 rounded-lg border border-neutral-200 text-body-xs text-center outline-none focus:border-primary-green"
          />
          <span className="text-neutral-400">-</span>
          <input
            type="number"
            value={scoreB}
            onChange={(e) => setScoreB(e.target.value)}
            placeholder="0"
            className="w-14 px-2 py-1.5 rounded-lg border border-neutral-200 text-body-xs text-center outline-none focus:border-primary-green"
          />
          <Button size="sm" variant="outline" loading={busy} onClick={save}>Save</Button>
        </div>
      ) : (
        <p className="text-caption text-neutral-400 mt-2">Upcoming</p>
      )}
    </Card>
  );
}