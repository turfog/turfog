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
import type { Tournament, TournamentTeam, Fixture } from "@/lib/tournaments";
import { ArrowLeftIcon, TrophyIcon, UsersIcon, PlusIcon, CheckCircleIcon, MapPinIcon } from "@/components/SvgIcons";

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
    return <div className="min-h-screen bg-neutral-100 flex items-center justify-center"><p className="text-body-sm text-neutral-400">Loading tournament...</p></div>;
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-neutral-100 flex flex-col items-center justify-center text-center px-6">
        <div className="w-14 h-14 rounded-full bg-neutral-200 flex items-center justify-center mb-4"><TrophyIcon size={26} className="text-neutral-400" /></div>
        <h1 className="text-display-xs font-bold text-neutral-900 font-display mb-2">Tournament not found</h1>
        <Link href="/tournaments" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-green text-white text-body-sm font-semibold rounded-xl"><ArrowLeftIcon size={16} />Browse tournaments</Link>
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
    await generateRoundRobin(tournament.id);
    setBusy(false);
    await refresh();
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <Link href="/tournaments" className="flex items-center gap-2 text-body-xs text-neutral-400 hover:text-neutral-600 transition-colors mb-2">
            <ArrowLeftIcon size={14} />
            Tournaments
          </Link>
          <div className="flex items-center gap-2">
            <TrophyIcon size={22} className="text-primary-green" />
            <h1 className="text-display-sm font-bold text-neutral-900 font-display">{tournament.name}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-body-xs text-neutral-500 mt-1">
            <span className="capitalize">{tournament.sport.replace("-", " ")}</span>
            <span className="capitalize">· {tournament.format}</span>
            {tournament.city && <span className="flex items-center gap-0.5"><MapPinIcon size={12} />{tournament.city}</span>}
          </div>
          {tournament.description && <p className="text-body-sm text-neutral-600 mt-2">{tournament.description}</p>}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Registration + generate */}
        {tournament.status === "registration" && (
          <Card padding="lg">
            <h3 className="text-body-sm font-semibold text-neutral-900 mb-3">Register a team</h3>
            {availableToRegister.length === 0 ? (
              <p className="text-body-xs text-neutral-400">No eligible teams left to register (or you are not a member of any team).</p>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2">
                <select value={registerTeamId} onChange={(e) => setRegisterTeamId(e.target.value)} className="flex-1 px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm bg-white outline-none focus:border-primary-green">
                  <option value="">Select a team</option>
                  {availableToRegister.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                <Button loading={busy} disabled={!registerTeamId} onClick={onRegister}><PlusIcon size={16} />Register</Button>
              </div>
            )}
            {isCreator && teams.length >= 2 && (
              <Button variant="outline" loading={busy} onClick={onGenerate} className="mt-3">Generate round-robin fixtures</Button>
            )}
            {isCreator && teams.length < 2 && (
              <p className="text-caption text-neutral-400 mt-2">Register at least 2 teams to generate fixtures.</p>
            )}
          </Card>
        )}

        {/* Teams */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <UsersIcon size={18} className="text-neutral-500" />
            <h2 className="text-body-md font-semibold text-neutral-900 font-display">Teams ({teams.length})</h2>
          </div>
          {teams.length === 0 ? (
            <p className="text-body-xs text-neutral-400">No teams registered yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {teams.map((t) => (
                <Link key={t.id} href={`/teams/${t.teamSlug}`}>
                  <Card padding="md" className="hover:border-primary-green/30">
                    <div className="flex items-center gap-2">
                      <CheckCircleIcon size={16} className="text-primary-green" />
                      <span className="text-body-sm font-semibold text-neutral-900 truncate">{t.teamName}</span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Fixtures */}
        <section>
          <h2 className="text-body-md font-semibold text-neutral-900 font-display mb-3">Fixtures ({fixtures.length})</h2>
          {fixtures.length === 0 ? (
            <p className="text-body-xs text-neutral-400">No fixtures yet.{tournament.status === "registration" ? " Generate them once teams are registered." : ""}</p>
          ) : (
            <div className="space-y-3">
              {fixtures.map((f) => <FixtureRow key={f.id} fixture={f} canEdit={isCreator} onSaved={refresh} />)}
            </div>
          )}
        </section>

        {/* League table */}
        {tournament.format === "league" && table.length > 0 && (
          <section>
            <h2 className="text-body-md font-semibold text-neutral-900 font-display mb-3">League table</h2>
            <Card padding="md">
              <div className="overflow-x-auto">
                <table className="w-full text-body-xs">
                  <thead>
                    <tr className="text-neutral-400 border-b border-neutral-100">
                      <th className="text-left py-2 pr-2 font-medium">#</th>
                      <th className="text-left py-2 pr-2 font-medium">Team</th>
                      <th className="text-center py-2 px-1 font-medium">P</th>
                      <th className="text-center py-2 px-1 font-medium">W</th>
                      <th className="text-center py-2 px-1 font-medium">D</th>
                      <th className="text-center py-2 px-1 font-medium">L</th>
                      <th className="text-center py-2 px-1 font-medium">GD</th>
                      <th className="text-center py-2 pl-2 font-medium">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.map((r, i) => (
                      <tr key={r.teamId} className="border-b border-neutral-50 last:border-0">
                        <td className="py-2 pr-2 text-neutral-500">{i + 1}</td>
                        <td className="py-2 pr-2 font-semibold text-neutral-900">{teamNameById.get(r.teamId) ?? "Team"}</td>
                        <td className="text-center py-2 px-1 text-neutral-600">{r.played}</td>
                        <td className="text-center py-2 px-1 text-neutral-600">{r.won}</td>
                        <td className="text-center py-2 px-1 text-neutral-600">{r.drawn}</td>
                        <td className="text-center py-2 px-1 text-neutral-600">{r.lost}</td>
                        <td className="text-center py-2 px-1 text-neutral-600">{r.gd > 0 ? `+${r.gd}` : r.gd}</td>
                        <td className="text-center py-2 pl-2 font-bold text-neutral-900">{r.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </section>
        )}
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
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <p className="text-body-sm font-semibold text-neutral-900">
            {fixture.teamAName} <span className="text-neutral-400">vs</span> {fixture.teamBName}
          </p>
          <p className="text-caption text-neutral-400 mt-0.5">Round {fixture.round}</p>
        </div>
        {fixture.status === "completed" ? (
          <span className="text-body-sm font-bold text-neutral-900">{fixture.scoreA} - {fixture.scoreB}</span>
        ) : canEdit ? (
          <div className="flex items-center gap-2">
            <input type="number" min={0} value={scoreA} onChange={(e) => setScoreA(e.target.value)} placeholder="0" className="w-14 px-2 py-1.5 rounded-lg border border-neutral-200 text-body-xs text-center outline-none focus:border-primary-green" />
            <span className="text-neutral-400">-</span>
            <input type="number" min={0} value={scoreB} onChange={(e) => setScoreB(e.target.value)} placeholder="0" className="w-14 px-2 py-1.5 rounded-lg border border-neutral-200 text-body-xs text-center outline-none focus:border-primary-green" />
            <Button size="sm" variant="primary" loading={busy} onClick={save}>Save</Button>
          </div>
        ) : (
          <span className="px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-500 text-caption font-semibold">Upcoming</span>
        )}
      </div>
    </Card>
  );
}