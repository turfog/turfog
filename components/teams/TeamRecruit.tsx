"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import { useLocation } from "@/context/LocationContext";
import { haversineKm } from "@/lib/discovery";
import { fetchTeamBySlug, fetchTeamInvites, inviteToTeam, removeMember, searchPlayers } from "@/lib/teams";
import type { Team, TeamMember, PlayerSearchResult } from "@/lib/teams";
import {
  ArrowLeftIcon,
  SearchIcon,
  UsersIcon,
  PlusIcon,
  XIcon,
  CheckCircleIcon,
  MapPinIcon,
  ShieldIcon,
  TrophyIcon,
} from "@/components/SvgIcons";

function presenceDot(p: string): string {
  switch (p) {
    case "available-now": return "bg-emerald";
    case "in-30-min": return "bg-amber";
    case "today": return "bg-electric-blue";
    default: return "bg-neutral-300";
  }
}

export default function TeamRecruit({ slug }: { slug: string }) {
  const { lat, lng } = useLocation();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [results, setResults] = useState<PlayerSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [invitees, setInvitees] = useState<TeamMember[]>([]);
  const [invitedLocal, setInvitedLocal] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState<string | null>(null);
  const [inviteError, setInviteError] = useState("");

  const loadTeam = useCallback(async () => {
    const t = await fetchTeamBySlug(slug);
    setTeam(t);
    if (t) setInvitees(await fetchTeamInvites(t.id));
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    loadTeam();
  }, [loadTeam]);

  const doSearch = useCallback(async (q: string, v: boolean) => {
    setSearching(true);
    const res = await searchPlayers({ query: q, verifiedOnly: v });
    setResults(res);
    setSearching(false);
  }, []);

  useEffect(() => {
    doSearch("", false);
  }, [doSearch]);

  if (loading) {
    return <div className="min-h-screen bg-neutral-100 flex items-center justify-center"><p className="text-body-sm text-neutral-400">Loading...</p></div>;
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-neutral-100 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-display-xs font-bold text-neutral-900 font-display mb-4">Team not found</h1>
        <Link href="/teams" className="px-5 py-2.5 bg-primary-green text-white text-body-sm font-semibold rounded-xl">Browse teams</Link>
      </div>
    );
  }

  if (team.viewerRole !== "owner" && team.viewerRole !== "captain") {
    return (
      <div className="min-h-screen bg-neutral-100 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-display-xs font-bold text-neutral-900 font-display mb-2">Not authorized</h1>
        <p className="text-body-sm text-neutral-500 mb-6">Only the owner or captain can recruit.</p>
        <Link href={`/teams/${team.slug}`} className="px-5 py-2.5 bg-primary-green text-white text-body-sm font-semibold rounded-xl">Back to team</Link>
      </div>
    );
  }

  const invitedUsernames = new Set([...invitees.map((i) => i.username).filter(Boolean), ...invitedLocal]);

  const withDistance = results
    .map((r) => ({
      ...r,
      distanceKm: lat != null && lng != null && r.latitude != null && r.longitude != null ? haversineKm(lat, lng, r.latitude, r.longitude) : null,
    }))
    .sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));

  const onInvite = async (username: string) => {
    if (busy || !team || !username) return;
    setBusy(username);
    setInviteError("");
    const res = await inviteToTeam(team.id, username);
    setBusy(null);
    if (!res.ok) {
      setInviteError(res.error ?? "Could not invite that player");
    } else {
      setInvitedLocal((s) => new Set(s).add(username));
      setInvitees(await fetchTeamInvites(team.id));
    }
  };

  const onCancel = async (memberId: string) => {
    if (busy || !team) return;
    setBusy(memberId);
    await removeMember(memberId);
    setInvitees(await fetchTeamInvites(team.id));
    setBusy(null);
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <Link href={`/teams/${team.slug}/manage`} className="flex items-center gap-2 text-body-xs text-neutral-400 hover:text-neutral-600 transition-colors mb-2">
            <ArrowLeftIcon size={14} />
            Back to manage
          </Link>
          <div className="flex items-center gap-2">
            <TrophyIcon size={22} className="text-primary-green" />
            <h1 className="text-display-sm font-bold text-neutral-900 font-display">Recruit players</h1>
          </div>
          <p className="text-body-sm text-neutral-500">Find and invite players to {team.name}.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-6 space-y-8">
        {/* Search */}
        <section>
          <Card padding="lg">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <SearchIcon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") doSearch(query, verifiedOnly); }}
                  placeholder="Search by name or username..."
                  className="w-full pl-11 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm text-neutral-900 outline-none focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 placeholder:text-neutral-400"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { const nv = !verifiedOnly; setVerifiedOnly(nv); doSearch(query, nv); }}
                  className={cn("inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-body-xs font-medium border transition-all", verifiedOnly ? "bg-electric-blue text-white border-electric-blue" : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300")}
                >
                  <CheckCircleIcon size={14} />
                  Verified only
                </button>
                <Button loading={searching} onClick={() => doSearch(query, verifiedOnly)}>
                  <SearchIcon size={16} />
                  Search
                </Button>
              </div>
            </div>
            {inviteError && <p className="text-body-xs text-coral bg-coral/5 rounded-lg px-3 py-2 mt-3">{inviteError}</p>}
          </Card>
        </section>

        {/* Results */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <UsersIcon size={18} className="text-neutral-500" />
            <h2 className="text-body-md font-semibold text-neutral-900 font-display">Players ({withDistance.length})</h2>
          </div>
          {searching ? (
            <p className="text-center py-12 text-body-sm text-neutral-400">Searching players...</p>
          ) : withDistance.length === 0 ? (
            <p className="text-center py-12 text-body-sm text-neutral-400">No players match your search.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {withDistance.map((p) => {
                const invited = invitedUsernames.has(p.username);
                return (
                  <Card key={p.id} padding="md" className="hover:border-primary-green/30">
                    <div className="flex items-start gap-3">
                      <div className="relative flex-shrink-0">
                        <Avatar alt={p.fullName} src={p.avatar} size="md" />
                        <span className={cn("absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white", presenceDot(p.presence))} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <Link href={`/${p.username}`} className="text-body-sm font-semibold text-neutral-900 truncate hover:text-electric-blue transition-colors">{p.fullName}</Link>
                          {p.verified && <CheckCircleIcon size={14} className="text-electric-blue flex-shrink-0" />}
                        </div>
                        <p className="text-caption text-neutral-400 truncate">@{p.username}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5 text-caption text-neutral-400">
                          <span className="inline-flex items-center gap-0.5"><ShieldIcon size={11} />{p.reliability}</span>
                          {p.city && <span className="inline-flex items-center gap-0.5"><MapPinIcon size={11} />{p.city}</span>}
                          {p.distanceKm != null && <span className="inline-flex items-center gap-0.5 text-primary-green"><MapPinIcon size={11} />{p.distanceKm.toFixed(1)} km</span>}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {invited ? (
                          <span className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-neutral-100 text-neutral-500 text-body-xs font-semibold">Invited</span>
                        ) : (
                          <Button size="sm" variant="primary" loading={busy === p.username} onClick={() => onInvite(p.username)}>
                            <PlusIcon size={14} />
                            Invite
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        {/* Invitees */}
        <section>
          <h2 className="text-body-md font-semibold text-neutral-900 font-display mb-3">Pending invites ({invitees.length})</h2>
          {invitees.length === 0 ? (
            <p className="text-body-xs text-neutral-400">No pending invites. Invite players above.</p>
          ) : (
            <div className="space-y-3">
              {invitees.map((m) => (
                <Card key={m.id} padding="md">
                  <div className="flex items-center gap-3">
                    <Avatar alt={m.displayName} src={m.avatar} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="text-body-sm font-semibold text-neutral-900 truncate">{m.displayName}</p>
                      <p className="text-caption text-neutral-400">@{m.username || "—"} · awaiting response</p>
                    </div>
                    <button onClick={() => onCancel(m.id)} disabled={busy === m.id} className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-body-xs font-medium text-coral hover:bg-coral/5 disabled:opacity-40 transition-colors">
                      <XIcon size={14} />
                      Cancel
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}