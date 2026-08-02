"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import {
  fetchTeamBySlug,
  fetchTeamMembers,
  fetchTeamInvites,
  setMemberRole,
  setMemberJersey,
  removeMember,
  inviteToTeam,
  postTeamAnnouncement,
} from "@/lib/teams";
import type { Team, TeamMember } from "@/lib/teams";
import { ArrowLeftIcon, TrophyIcon, UsersIcon, PlusIcon, XIcon } from "@/components/SvgIcons";

function roleMeta(role: string): { label: string; cls: string } {
  switch (role) {
    case "owner": return { label: "Owner", cls: "bg-amber/10 text-amber" };
    case "captain": return { label: "Captain", cls: "bg-electric-blue/10 text-electric-blue" };
    case "vice": return { label: "Vice captain", cls: "bg-purple-500/10 text-purple-500" };
    default: return { label: "Member", cls: "bg-neutral-100 text-neutral-500" };
  }
}

export default function TeamManage({ slug }: { slug: string }) {
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [invites, setInvites] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [inviteUsername, setInviteUsername] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [announceText, setAnnounceText] = useState("");
  const [announceImage, setAnnounceImage] = useState("");
  const [announceDone, setAnnounceDone] = useState(false);

  const refresh = useCallback(async () => {
    const t = await fetchTeamBySlug(slug);
    setTeam(t);
    if (t) {
      const [m, inv] = await Promise.all([fetchTeamMembers(t.id), fetchTeamInvites(t.id)]);
      setMembers(m);
      setInvites(inv);
    }
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    refresh();
  }, [refresh]);

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
        <p className="text-body-sm text-neutral-500 mb-6">Only the owner or captain can manage this team.</p>
        <Link href={`/teams/${team.slug}`} className="px-5 py-2.5 bg-primary-green text-white text-body-sm font-semibold rounded-xl">Back to team</Link>
      </div>
    );
  }

  const onRole = async (memberId: string, role: string) => {
    setBusy(memberId);
    await setMemberRole(memberId, role);
    await refresh();
    setBusy(null);
  };

  const onJersey = async (memberId: string, jersey: number | null, position: string) => {
    setBusy(memberId);
    await setMemberJersey(memberId, jersey, position);
    await refresh();
    setBusy(null);
  };

  const onRemove = async (memberId: string) => {
    setBusy(memberId);
    await removeMember(memberId);
    await refresh();
    setBusy(null);
  };

  const onInvite = async () => {
    if (!inviteUsername.trim() || busy) return;
    setBusy("invite");
    setInviteError("");
    const res = await inviteToTeam(team.id, inviteUsername.trim());
    setBusy(null);
    if (!res.ok) {
      setInviteError(res.error ?? "Could not invite that player");
    } else {
      setInviteUsername("");
      await refresh();
    }
  };

  const onCancelInvite = async (memberId: string) => {
    setBusy(memberId);
    await removeMember(memberId);
    await refresh();
    setBusy(null);
  };

  const onAnnounce = async () => {
    if (!announceText.trim() || busy) return;
    setBusy("announce");
    const ok = await postTeamAnnouncement(team.id, announceText.trim(), announceImage.trim() || undefined);
    setBusy(null);
    if (ok) {
      setAnnounceText("");
      setAnnounceImage("");
      setAnnounceDone(true);
      setTimeout(() => setAnnounceDone(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <Link href={`/teams/${team.slug}`} className="flex items-center gap-2 text-body-xs text-neutral-400 hover:text-neutral-600 transition-colors mb-2">
            <ArrowLeftIcon size={14} />
            Back to {team.name}
          </Link>
          <div className="flex items-center gap-2">
            <TrophyIcon size={22} className="text-primary-green" />
            <h1 className="text-display-sm font-bold text-neutral-900 font-display">Manage team</h1>
            <span className={cn("px-2.5 py-1 rounded-full text-caption font-semibold", roleMeta(team.viewerRole ?? "member").cls)}>
              {roleMeta(team.viewerRole ?? "member").label}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-6 space-y-8">
        {/* Roster */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <UsersIcon size={18} className="text-neutral-500" />
            <h2 className="text-body-md font-semibold text-neutral-900 font-display">Roster ({members.length})</h2>
          </div>
          <div className="space-y-3">
            {members.map((m) => (
              <MemberRow key={m.id} member={m} busy={busy} onRole={onRole} onJersey={onJersey} onRemove={onRemove} />
            ))}
          </div>
        </section>

        {/* Pending invites */}
        <section>
          <h2 className="text-body-md font-semibold text-neutral-900 font-display mb-3">Pending invites ({invites.length})</h2>
          {invites.length === 0 ? (
            <p className="text-body-xs text-neutral-400">No pending invites.</p>
          ) : (
            <div className="space-y-3">
              {invites.map((m) => (
                <Card key={m.id} padding="md">
                  <div className="flex items-center gap-3">
                    <Avatar alt={m.displayName} src={m.avatar} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="text-body-sm font-semibold text-neutral-900 truncate">{m.displayName}</p>
                      <p className="text-caption text-neutral-400">@{m.username || "—"} · invited</p>
                    </div>
                    <button onClick={() => onCancelInvite(m.id)} disabled={busy === m.id} className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-body-xs font-medium text-coral hover:bg-coral/5 disabled:opacity-40 transition-colors">
                      <XIcon size={14} />
                      Cancel
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Invite player */}
        <section>
          <h2 className="text-body-md font-semibold text-neutral-900 font-display mb-3">Invite a player</h2>
          <Card padding="lg">
            <div className="flex items-center gap-2">
              <input
                value={inviteUsername}
                onChange={(e) => setInviteUsername(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") onInvite(); }}
                placeholder="Enter a username (e.g. rahul_sharma)"
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm text-neutral-900 outline-none focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 placeholder:text-neutral-400"
              />
              <Button loading={busy === "invite"} disabled={!inviteUsername.trim()} onClick={onInvite}>
                <PlusIcon size={16} />
                Invite
              </Button>
            </div>
            {inviteError && <p className="text-body-xs text-coral bg-coral/5 rounded-lg px-3 py-2 mt-3">{inviteError}</p>}
            <p className="text-caption text-neutral-400 mt-3">The player must have a Turfog account. They can accept or decline from the team page.</p>
          </Card>
        </section>

        {/* Announcement */}
        <section>
          <h2 className="text-body-md font-semibold text-neutral-900 font-display mb-3">Post an announcement</h2>
          <Card padding="lg">
            <div className="space-y-3">
              <textarea
                value={announceText}
                onChange={(e) => setAnnounceText(e.target.value)}
                placeholder="Share news, results, or a training update with the team..."
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm text-neutral-900 outline-none focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 resize-none placeholder:text-neutral-400"
              />
              <input
                value={announceImage}
                onChange={(e) => setAnnounceImage(e.target.value)}
                placeholder="Image URL (optional)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm text-neutral-900 outline-none focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 placeholder:text-neutral-400"
              />
              <Button loading={busy === "announce"} disabled={!announceText.trim()} onClick={onAnnounce}>
                {announceDone ? "Posted" : "Post to team feed"}
              </Button>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}

function MemberRow({ member, busy, onRole, onJersey, onRemove }: {
  member: TeamMember;
  busy: string | null;
  onRole: (id: string, role: string) => void;
  onJersey: (id: string, jersey: number | null, position: string) => void;
  onRemove: (id: string) => void;
}) {
  const [jersey, setJersey] = useState(member.jerseyNumber != null ? String(member.jerseyNumber) : "");
  const [position, setPosition] = useState(member.position ?? "");
  const isOwner = member.role === "owner";

  return (
    <Card padding="md">
      <div className="flex items-center gap-3 flex-wrap">
        <Avatar alt={member.displayName} src={member.avatar} size="md" />
        <div className="flex-1 min-w-[120px]">
          <p className="text-body-sm font-semibold text-neutral-900 truncate">{member.displayName}</p>
          <p className="text-caption text-neutral-400">{member.username ? `@${member.username}` : "—"}</p>
        </div>
        <select
          value={member.role}
          disabled={isOwner || busy === member.id}
          onChange={(e) => onRole(member.id, e.target.value)}
          className="px-3 py-2 rounded-xl border border-neutral-200 text-body-xs font-medium text-neutral-700 bg-white outline-none focus:border-primary-green disabled:opacity-50"
        >
          <option value="owner">Owner</option>
          <option value="captain">Captain</option>
          <option value="vice">Vice captain</option>
          <option value="member">Member</option>
        </select>
        <input
          type="number"
          value={jersey}
          onChange={(e) => setJersey(e.target.value)}
          placeholder="#"
          className="w-16 px-3 py-2 rounded-xl border border-neutral-200 text-body-xs text-neutral-900 outline-none focus:border-primary-green"
        />
        <input
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          placeholder="Position"
          className="w-28 px-3 py-2 rounded-xl border border-neutral-200 text-body-xs text-neutral-900 outline-none focus:border-primary-green"
        />
        <Button size="sm" variant="outline" loading={busy === member.id} onClick={() => onJersey(member.id, jersey === "" ? null : Number(jersey), position)}>
          Save
        </Button>
        <button
          onClick={() => onRemove(member.id)}
          disabled={isOwner || busy === member.id}
          className="px-3 py-2 rounded-xl text-body-xs font-medium text-coral hover:bg-coral/5 disabled:opacity-40 transition-colors"
        >
          Remove
        </button>
      </div>
    </Card>
  );
}