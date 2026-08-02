"use client";

import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn, timeAgo } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { createClient } from "@/lib/supabase";
import { fetchTeamBySlug, fetchTeamMembers, fetchTeamPosts, joinTeam, followTeam } from "@/lib/teams";
import type { Team, TeamMember, TeamPost } from "@/lib/teams";
import type { SportId } from "@/types";
import {
  TrophyIcon,
  UsersIcon,
  MapPinIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  CalendarIcon,
  HeartIcon,
  CommentIcon,
  ClockIcon,
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

const rolePriority: Record<string, number> = { owner: 0, captain: 1, vice: 2, member: 3 };

function roleMeta(role: string): { label: string; cls: string } {
  switch (role) {
    case "owner": return { label: "Owner", cls: "bg-amber/10 text-amber" };
    case "captain": return { label: "Captain", cls: "bg-electric-blue/10 text-electric-blue" };
    case "vice": return { label: "Vice captain", cls: "bg-purple-500/10 text-purple-500" };
    default: return { label: "Member", cls: "bg-neutral-100 text-neutral-500" };
  }
}

const tabs = ["Members", "Feed", "About"] as const;
type TabId = (typeof tabs)[number];

export default function TeamProfile({ slug }: { slug: string }) {
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [posts, setPosts] = useState<TeamPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabId>("Members");
  const [busy, setBusy] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const t = await fetchTeamBySlug(slug);
    if (!t) { setTeam(null); setLoading(false); return; }
    const [m, p] = await Promise.all([fetchTeamMembers(t.id), fetchTeamPosts(t.id)]);
    setTeam(t);
    setMembers(m);
    setPosts(p);
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    refresh();
    const supabase = createClient();
    const channel = supabase
      .channel(`team-${slug}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "team_members" }, () => { void refresh(); })
      .on("postgres_changes", { event: "*", schema: "public", table: "team_follows" }, () => { void refresh(); })
      .on("postgres_changes", { event: "*", schema: "public", table: "teams" }, () => { void refresh(); })
      .on("postgres_changes", { event: "*", schema: "public", table: "posts" }, () => { void refresh(); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [slug, refresh]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <p className="text-body-sm text-neutral-400">Loading team...</p>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-neutral-100 flex flex-col items-center justify-center text-center px-6">
        <div className="w-14 h-14 rounded-full bg-neutral-200 flex items-center justify-center mb-4"><TrophyIcon size={26} className="text-neutral-400" /></div>
        <h1 className="text-display-xs font-bold text-neutral-900 font-display mb-2">Team not found</h1>
        <p className="text-body-sm text-neutral-500 mb-6">This team does not exist or was removed.</p>
        <Link href="/teams" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-green text-white text-body-sm font-semibold rounded-xl hover:bg-primary-green/90 transition-colors">
          <ArrowLeftIcon size={16} />
          Browse teams
        </Link>
      </div>
    );
  }

  const onJoin = async () => {
    if (busy) return;
    setBusy("join");
    setTeam((prev) => (prev ? { ...prev, joined: !prev.joined, memberCount: prev.memberCount + (prev.joined ? -1 : 1) } : prev));
    const res = await joinTeam(team.id);
    if (res) setTeam((prev) => (prev ? { ...prev, joined: res.joined, memberCount: res.memberCount, viewerRole: res.joined ? (prev.viewerRole ?? "member") : null } : prev));
    setBusy(null);
    void refresh();
  };

  const onFollow = async () => {
    if (busy) return;
    setBusy("follow");
    setTeam((prev) => (prev ? { ...prev, following: !prev.following, followerCount: prev.followerCount + (prev.following ? -1 : 1) } : prev));
    const res = await followTeam(team.id);
    if (res) setTeam((prev) => (prev ? { ...prev, following: res.following, followerCount: res.followerCount } : prev));
    setBusy(null);
  };

  const sortedMembers = [...members].sort((a, b) => (rolePriority[a.role] ?? 9) - (rolePriority[b.role] ?? 9));
  const cover = coverBySport[team.sport];

  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="relative">
        <div className={cn("relative h-44 md:h-56 bg-gradient-to-r overflow-hidden", cover)}>
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{ background: "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.6) 50%, transparent 70%)" }}
            animate={{ x: ["-60%", "120%"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", repeatDelay: 3 }}
          />
          <div className="absolute top-4 left-4">
            <Link href="/teams">
              <motion.span whileTap={{ scale: 0.9 }} className="inline-flex items-center gap-2 px-3 py-2 bg-black/20 backdrop-blur-md text-white text-body-xs font-medium rounded-xl hover:bg-black/30 transition-colors">
                <ArrowLeftIcon size={16} />
                Teams
              </motion.span>
            </Link>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6">
          <div className="relative -mt-12 mb-4 flex items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <div className="w-20 h-20 rounded-2xl bg-white shadow-card border border-neutral-100 flex items-center justify-center text-primary-green overflow-hidden">
                {team.logo ? <img src={team.logo} alt={team.name} className="w-full h-full object-cover" /> : <TrophyIcon size={34} />}
              </div>
              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-display-sm font-bold text-neutral-900 font-display">{team.name}</h1>
                  {team.verified && <CheckCircleIcon size={18} className="text-electric-blue" />}
                </div>
                <div className="flex items-center gap-2 text-body-xs text-neutral-500">
                  <span className="inline-flex items-center gap-1">{sportIcon[team.sport]}{sportName[team.sport]}</span>
                  {team.city && <span className="flex items-center gap-1"><MapPinIcon size={12} />{team.city}</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Button variant={team.joined ? "outline" : "primary"} loading={busy === "join"} onClick={onJoin}>
              {team.joined ? "Leave team" : "Join team"}
            </Button>
            <Button variant={team.following ? "outline" : "primary"} loading={busy === "follow"} onClick={onFollow}>
              {team.following ? "Following" : "Follow"}
            </Button>
            {team.viewerRole && (
              <span className={cn("px-3 py-2 rounded-xl text-body-xs font-semibold", roleMeta(team.viewerRole).cls)}>
                {roleMeta(team.viewerRole).label}
              </span>
            )}
          </div>

          {team.description && <p className="text-body-sm text-neutral-600 mb-4">{team.description}</p>}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 mb-6">
        <div className="grid grid-cols-3 gap-3">
          {[
            { Icon: UsersIcon, value: team.memberCount, label: "Members", color: "text-primary-green" },
            { Icon: HeartIcon, value: team.followerCount, label: "Followers", color: "text-coral" },
            { Icon: CalendarIcon, value: team.foundedYear || "—", label: "Founded", color: "text-electric-blue" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-neutral-200 shadow-card p-4 text-center">
              <s.Icon size={20} className={cn(s.color, "mx-auto mb-2")} />
              <p className="text-display-xs font-bold text-neutral-900">{s.value}</p>
              <p className="text-caption text-neutral-400">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-16">
        <div className="flex gap-1 border-b border-neutral-200 mb-6">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={cn("px-5 py-3 text-body-sm font-medium border-b-2 transition-all", tab === t ? "border-primary-green text-primary-green" : "border-transparent text-neutral-500 hover:text-neutral-700")}>
              {t}
            </button>
          ))}
        </div>

        {tab === "Members" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            {sortedMembers.length === 0 ? (
              <p className="text-center py-12 text-body-sm text-neutral-400">No members yet. Be the first to join.</p>
            ) : (
              sortedMembers.map((m) => (
                <Card key={m.id} padding="md" className="hover:border-neutral-300">
                  <div className="flex items-center gap-3">
                    {m.userId ? (
                      <Link href={`/${m.username}`}><Avatar alt={m.displayName} src={m.avatar} size="md" /></Link>
                    ) : (
                      <Avatar alt={m.displayName} src={m.avatar} size="md" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {m.userId ? (
                          <Link href={`/${m.username}`} className="text-body-sm font-semibold text-neutral-900 truncate hover:text-electric-blue transition-colors">{m.displayName}</Link>
                        ) : (
                          <span className="text-body-sm font-semibold text-neutral-900 truncate">{m.displayName}</span>
                        )}
                        <span className={cn("px-2 py-0.5 rounded-full text-caption font-semibold", roleMeta(m.role).cls)}>{roleMeta(m.role).label}</span>
                      </div>
                      <p className="text-caption text-neutral-400">{m.position || "Player"}</p>
                    </div>
                    {m.jerseyNumber != null && (
                      <span className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-body-sm font-bold text-neutral-700">#{m.jerseyNumber}</span>
                    )}
                  </div>
                </Card>
              ))
            )}
          </motion.div>
        )}

        {tab === "Feed" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {posts.length === 0 ? (
              <p className="text-center py-12 text-body-sm text-neutral-400">No team posts yet.</p>
            ) : (
              posts.map((p) => (
                <motion.article key={p.id} whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300, damping: 24 }} className="bg-white rounded-2xl border border-neutral-200 shadow-card overflow-hidden">
                  <div className="flex items-center gap-2.5 p-4 pb-2">
                    <Avatar alt={p.authorName} src={p.authorAvatar} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-body-xs font-semibold text-neutral-900 truncate">{p.authorName}</p>
                      <p className="text-caption text-neutral-400 flex items-center gap-1"><ClockIcon size={11} />{timeAgo(p.createdAt)}</p>
                    </div>
                  </div>
                  {p.text && <p className="px-4 pb-3 text-body-sm text-neutral-700 whitespace-pre-line">{p.text}</p>}
                  {p.imageUrl && (
                    <div className="aspect-[16/9] overflow-hidden bg-neutral-100">
                      <img src={p.imageUrl} alt={p.imageAlt} loading="lazy" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex items-center gap-4 px-4 py-3 text-caption text-neutral-400 border-t border-neutral-100">
                    <span className="flex items-center gap-1"><HeartIcon size={13} />{p.likes}</span>
                    <span className="flex items-center gap-1"><CommentIcon size={13} />{p.comments}</span>
                  </div>
                </motion.article>
              ))
            )}
          </motion.div>
        )}

        {tab === "About" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card padding="lg">
              <div className="space-y-4">
                {team.description && (
                  <div>
                    <p className="text-caption font-semibold text-neutral-400 uppercase tracking-wide mb-1">About</p>
                    <p className="text-body-sm text-neutral-700">{team.description}</p>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-caption font-semibold text-neutral-400 uppercase tracking-wide mb-1">Sport</p>
                    <p className="text-body-sm text-neutral-700 inline-flex items-center gap-1.5">{sportIcon[team.sport]}{sportName[team.sport]}</p>
                  </div>
                  <div>
                    <p className="text-caption font-semibold text-neutral-400 uppercase tracking-wide mb-1">Home turf</p>
                    <p className="text-body-sm text-neutral-700 flex items-center gap-1.5"><MapPinIcon size={14} />{team.homeTurf || "—"}</p>
                  </div>
                  <div>
                    <p className="text-caption font-semibold text-neutral-400 uppercase tracking-wide mb-1">City</p>
                    <p className="text-body-sm text-neutral-700">{team.city || "—"}</p>
                  </div>
                  <div>
                    <p className="text-caption font-semibold text-neutral-400 uppercase tracking-wide mb-1">Founded</p>
                    <p className="text-body-sm text-neutral-700 flex items-center gap-1.5"><CalendarIcon size={14} />{team.foundedYear || "—"}</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}