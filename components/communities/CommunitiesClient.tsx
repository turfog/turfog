"use client";

import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase";
import { fetchCommunities, joinCommunity, createCommunity } from "@/lib/communities";
import type { Community } from "@/lib/communities";
import type { SportId } from "@/types";
import {
  CommunityIcon,
  UsersIcon,
  MapPinIcon,
  PlusIcon,
  XIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  FootballIcon,
  CricketIcon,
  PickleballIcon,
  PadelIcon,
  BadmintonIcon,
} from "@/components/SvgIcons";

const sportIconMap: Record<SportId, React.ReactNode> = {
  football: <FootballIcon size={14} />,
  "box-cricket": <CricketIcon size={14} />,
  pickleball: <PickleballIcon size={14} />,
  padel: <PadelIcon size={14} />,
  badminton: <BadmintonIcon size={14} />,
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

export default function CommunitiesClient() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<SportId | "all">("all");
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [sport, setSport] = useState<SportId>("football");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setCommunities(await fetchCommunities());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const supabase = createClient();
    const channel = supabase
      .channel("communities-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "communities" }, () => { void refresh(); })
      .on("postgres_changes", { event: "*", schema: "public", table: "community_members" }, () => { void refresh(); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [refresh]);

  const filtered = filter === "all" ? communities : communities.filter((c) => c.sport === filter);

  const onJoin = async (c: Community) => {
    if (busy) return;
    setBusy(c.id);
    setCommunities((prev) => prev.map((x) => (x.id === c.id ? { ...x, joined: !x.joined, memberCount: x.memberCount + (x.joined ? -1 : 1) } : x)));
    const res = await joinCommunity(c.id);
    if (res) setCommunities((prev) => prev.map((x) => (x.id === c.id ? { ...x, joined: res.joined, memberCount: res.memberCount } : x)));
    setBusy(null);
  };

  const onCreate = async () => {
    if (!name.trim() || busy) return;
    setBusy("create");
    const id = await createCommunity({ name: name.trim(), sport, city: city.trim(), description: description.trim() });
    setBusy(null);
    if (id) {
      setName("");
      setCity("");
      setDescription("");
      setCreating(false);
      await refresh();
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-1">
            <Link href="/" className="flex items-center gap-2 text-body-xs text-neutral-400 hover:text-neutral-600 transition-colors">
              <ArrowLeftIcon size={14} />
              Home
            </Link>
            <Button size="sm" variant="primary" onClick={() => setCreating((v) => !v)}>
              {creating ? <XIcon size={15} /> : <PlusIcon size={15} />}
              {creating ? "Close" : "Create community"}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <CommunityIcon size={22} className="text-primary-green" />
            <h1 className="text-display-sm font-bold text-neutral-900 font-display">Communities</h1>
          </div>
          <p className="text-body-sm text-neutral-500">Join local sports communities and never play alone.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-4">
        {creating && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="overflow-hidden mb-4">
            <Card padding="lg">
              <h3 className="text-body-sm font-semibold text-neutral-900 mb-3">Create a community</h3>
              <div className="space-y-3">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Community name" className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm text-neutral-900 outline-none focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 placeholder:text-neutral-400" />
                <div className="flex flex-wrap gap-2">
                  {SPORT_OPTIONS.map((s) => (
                    <button key={s.id} onClick={() => setSport(s.id)} className={cn("flex items-center gap-1.5 px-3 py-2 rounded-xl text-body-xs font-medium border transition-all", sport === s.id ? "bg-primary-green text-white border-primary-green" : "bg-white text-neutral-600 border-neutral-200 hover:border-primary-green/40")}>
                      {sportIconMap[s.id]}
                      {s.name}
                    </button>
                  ))}
                </div>
                <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City / area" className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm text-neutral-900 outline-none focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 placeholder:text-neutral-400" />
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What is this community about?" rows={2} className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm text-neutral-900 outline-none focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 resize-none placeholder:text-neutral-400" />
                <Button fullWidth loading={busy === "create"} disabled={!name.trim()} onClick={onCreate}>Create community</Button>
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
          <p className="text-center py-12 text-body-sm text-neutral-400">Loading communities...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-3"><CommunityIcon size={22} className="text-neutral-300" /></div>
            <p className="text-body-sm text-neutral-500">No communities for this sport yet.</p>
            <p className="text-caption text-neutral-400 mt-1">Be the first to create one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((c) => (
              <motion.div key={c.id} whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 300, damping: 24 }}>
                <Card padding="none" className="overflow-hidden hover:border-primary-green/30">
                  <div className={cn("h-20 bg-gradient-to-r", coverBySport[c.sport])} />
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-body-sm font-semibold text-neutral-900 truncate">{c.name}</h3>
                      {c.verified && <CheckCircleIcon size={15} className="text-electric-blue flex-shrink-0" />}
                    </div>
                    <p className="text-caption text-neutral-500 line-clamp-2 mb-3 min-h-[2rem]">{c.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-caption text-neutral-400">
                        <span className="inline-flex items-center gap-1">{sportIconMap[c.sport]}{sportName[c.sport]}</span>
                        <span className="flex items-center gap-0.5"><MapPinIcon size={11} />{c.city || "—"}</span>
                        <span className="flex items-center gap-0.5"><UsersIcon size={11} />{c.memberCount}</span>
                      </div>
                      <Button size="sm" variant={c.joined ? "outline" : "primary"} loading={busy === c.id} onClick={() => onJoin(c)}>
                        {c.joined ? "Joined" : "Join"}
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