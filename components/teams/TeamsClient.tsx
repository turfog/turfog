"use client";

import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import { createClient } from "@/lib/supabase";
import { fetchTeams, joinTeam, createTeam } from "@/lib/teams";
import type { Team } from "@/lib/teams";
import type { SportId } from "@/types";
import {
  TrophyIcon,
  UsersIcon,
  MapPinIcon,
  PlusIcon,
  XIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  HeartIcon,
  FootballIcon,
  CricketIcon,
  PickleballIcon,
  PadelIcon,
  BadmintonIcon,
} from "@/components/SvgIcons";

const sportIconMap: Record<SportId, React.ReactNode> = {
  football: <FootballIcon size={16} />,
  "box-cricket": <CricketIcon size={16} />,
  pickleball: <PickleballIcon size={16} />,
  padel: <PadelIcon size={16} />,
  badminton: <BadmintonIcon size={16} />,
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

const SPORT_OPTIONS: Array<{ id: SportId; name: string }> = [
  { id: "football", name: "Football" },
  { id: "box-cricket", name: "Box cricket" },
  { id: "badminton", name: "Badminton" },
  { id: "pickleball", name: "Pickleball" },
  { id: "padel", name: "Padel" },
];

function TeamSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-card overflow-hidden">
      <Skeleton className="h-20 w-full rounded-none" />
      <div className="p-4 pt-7 space-y-3">
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-2.5 w-full" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-2.5 w-2/5" />
          <Skeleton className="h-8 w-16 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default function TeamsClient() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<SportId | "all">("all");
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [sport, setSport] = useState<SportId>("football");
  const [city, setCity] = useState("");
  const [homeTurf, setHomeTurf] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setTeams(await fetchTeams());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const supabase = createClient();
    const channel = supabase
      .channel("teams-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "teams" }, () => { void refresh(); })
      .on("postgres_changes", { event: "*", schema: "public", table: "team_members" }, () => { void refresh(); })
      .on("postgres_changes", { event: "*", schema: "public", table: "team_follows" }, () => { void refresh(); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [refresh]);

  const filtered = filter === "all" ? teams : teams.filter((t) => t.sport === filter);

  const onJoin = async (t: Team) => {
    if (busy) return;
    setBusy(t.id);
    setTeams((prev) => prev.map((x) => (x.id === t.id ? { ...x, joined: !x.joined, memberCount: x.memberCount + (x.joined ? -1 : 1) } : x)));
    const res = await joinTeam(t.id);
    if (res) setTeams((prev) => prev.map((x) => (x.id === t.id ? { ...x, joined: res.joined, memberCount: res.memberCount } : x)));
    setBusy(null);
  };

  const onCreate = async () => {
    if (!name.trim() || busy) return;
    setBusy("create");
    const slug = await createTeam({ name: name.trim(), sport, city: city.trim(), homeTurf: homeTurf.trim(), description: description.trim() });
    setBusy(null);
    if (slug) {
      setName(""); setCity(""); setHomeTurf(""); setDescription("");
      setCreating(false);
      await refresh();
    }
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
            <Button size="sm" variant="primary" onClick={() => setCreating((v) => !v)}>
              {creating ? <XIcon size={15} /> : <PlusIcon size={15} />}
              {creating ? "Close" : "Create team"}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <TrophyIcon size={22} className="text-primary-green" />
            <h1 className="text-display-sm font-bold text-neutral-900 font-display">Teams</h1>
          </div>
          <p className="text-body-sm text-neutral-500">Join a squad, build your roster, and compete.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-4">
        {creating && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="overflow-hidden mb-4">
            <Card padding="lg">
              <h3 className="text-body-sm font-semibold text-neutral-900 mb-3">Create a team</h3>
              <div className="space-y-3">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Team name" className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm text-neutral-900 outline-none focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 placeholder:text-neutral-400" />
                <div className="flex flex-wrap gap-2">
                  {SPORT_OPTIONS.map((s) => (
                    <button key={s.id} onClick={() => setSport(s.id)} className={cn("flex items-center gap-1.5 px-3 py-2 rounded-xl text-body-xs font-medium border transition-all", sport === s.id ? "bg-primary-green text-white border-primary-green" : "bg-white text-neutral-600 border-neutral-200 hover:border-primary-green/40")}>
                      {sportIconMap[s.id]}
                      {s.name}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City / area" className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm text-neutral-900 outline-none focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 placeholder:text-neutral-400" />
                  <input value={homeTurf} onChange={(e) => setHomeTurf(e.target.value)} placeholder="Home turf" className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm text-neutral-900 outline-none focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 placeholder:text-neutral-400" />
                </div>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What is your team about?" rows={2} className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm text-neutral-900 outline-none focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 resize-none placeholder:text-neutral-400" />
                <Button fullWidth loading={busy === "create"} disabled={!name.trim()} onClick={onCreate}>Create team</Button>
              </div>
            </Card>
          </motion.div>
        )}

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mb-4">
          {(["all", "football", "box-cricket", "badminton", "pickleball", "padel"] as const).map((sportId) => (
            <button key={sportId} onClick={() => setFilter(sportId)} className={cn("px-4 py-2 rounded-full text-body-xs font-medium whitespace-nowrap border transition-all", filter === sportId ? "bg-primary-green text-white border-primary-green" : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300")}>
              {sportId === "all" ? "All" : sportName[sportId]}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TeamSkeleton />
            <TeamSkeleton />
            <TeamSkeleton />
            <TeamSkeleton />
          </div>
        ) : filtered.length === 0 ? (
          <Card padding="lg">
            <EmptyState
              icon={<TrophyIcon size={24} />}
              title="No teams for this sport yet"
              description="Create the first one and start building your roster."
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((t) => (
              <motion.div key={t.id} whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 300, damping: 24 }}>
                <Card padding="none" className="overflow-hidden hover:border-primary-green/30 hover:shadow-card-hover">
                  <div className={cn("relative h-20 bg-gradient-to-r", coverBySport[t.sport])}>
                    <div className="absolute -bottom-5 left-4 w-12 h-12 rounded-xl bg-white shadow-card flex items-center justify-center text-primary-green border border-neutral-100">
                      {t.logo ? <img src={t.logo} alt={t.name} className="w-full h-full object-cover rounded-xl" /> : <TrophyIcon size={22} />}
                    </div>
                  </div>
                  <div className="p-4 pt-7">
                    <div className="flex items-center gap-2 mb-1">
                      <Link href={`/teams/${t.slug}`} className="text-body-sm font-semibold text-neutral-900 truncate hover:text-electric-blue transition-colors">{t.name}</Link>
                      {t.verified && <CheckCircleIcon size={15} className="text-electric-blue flex-shrink-0" />}
                    </div>
                    <p className="text-caption text-neutral-500 line-clamp-2 mb-3 min-h-[2rem]">{t.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-caption text-neutral-400">
                        <span className="inline-flex items-center gap-1">{sportIconMap[t.sport]}{sportName[t.sport]}</span>
                        <span className="flex items-center gap-0.5"><MapPinIcon size={11} />{t.city || "—"}</span>
                        <span className="flex items-center gap-0.5"><UsersIcon size={11} />{t.memberCount}</span>
                        <span className="flex items-center gap-0.5"><HeartIcon size={11} />{t.followerCount}</span>
                      </div>
                      <Button size="sm" variant={t.joined ? "outline" : "primary"} loading={busy === t.id} onClick={() => onJoin(t)}>
                        {t.joined ? "Joined" : "Join"}
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}