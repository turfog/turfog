"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import { fetchTournaments, createTournament } from "@/lib/tournaments";
import type { Tournament } from "@/lib/tournaments";
import { ArrowLeftIcon, TrophyIcon, PlusIcon, XIcon, MapPinIcon, CalendarIcon } from "@/components/SvgIcons";

const SPORTS = ["football", "box-cricket", "badminton", "pickleball", "padel"];

function statusMeta(status: string): { label: string; cls: string } {
  switch (status) {
    case "registration": return { label: "Registration open", cls: "bg-electric-blue/10 text-electric-blue" };
    case "ongoing": return { label: "Ongoing", cls: "bg-emerald/10 text-emerald" };
    case "completed": return { label: "Completed", cls: "bg-neutral-100 text-neutral-500" };
    default: return { label: status, cls: "bg-neutral-100 text-neutral-500" };
  }
}

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function TournamentSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Skeleton className="w-11 h-11 rounded-xl flex-shrink-0" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-2.5 w-40" />
          </div>
        </div>
        <Skeleton className="h-6 w-20 rounded-full flex-shrink-0" />
      </div>
    </div>
  );
}

export default function TournamentsClient() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [busy, setBusy] = useState(false);

  const [name, setName] = useState("");
  const [sport, setSport] = useState("football");
  const [format, setFormat] = useState<"league" | "knockout">("league");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [startsAt, setStartsAt] = useState("");

  const refresh = useCallback(async () => {
    setTournaments(await fetchTournaments());
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const onCreate = async () => {
    if (busy || !name.trim()) return;
    setBusy(true);
    await createTournament({ name: name.trim(), sport, city: city.trim(), description: description.trim(), startsAt, format });
    setBusy(false);
    setShowCreate(false);
    setName(""); setCity(""); setDescription(""); setStartsAt("");
    await refresh();
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <Link href="/" className="flex items-center gap-2 text-body-xs text-neutral-400 hover:text-neutral-600 transition-colors mb-2">
            <ArrowLeftIcon size={14} />
            Home
          </Link>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <TrophyIcon size={22} className="text-primary-green" />
              <h1 className="text-display-sm font-bold text-neutral-900 font-display">Tournaments</h1>
            </div>
            <Button size="sm" variant="primary" onClick={() => setShowCreate((v) => !v)}>
              {showCreate ? <XIcon size={15} /> : <PlusIcon size={15} />}
              {showCreate ? "Close" : "Create tournament"}
            </Button>
          </div>
          <p className="text-body-sm text-neutral-500">Organize leagues, register teams, and track standings.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-4">
        {showCreate && (
          <Card padding="lg">
            <h3 className="text-body-sm font-semibold text-neutral-900 mb-3">Create a tournament</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tournament name" className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm outline-none focus:border-primary-green placeholder:text-neutral-400" />
              <select value={sport} onChange={(e) => setSport(e.target.value)} className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm bg-white outline-none focus:border-primary-green capitalize">
                {SPORTS.map((s) => <option key={s} value={s}>{s.replace("-", " ")}</option>)}
              </select>
              <div className="flex gap-2 sm:col-span-2">
                <button
                  type="button"
                  onClick={() => setFormat("league")}
                  className={`flex-1 px-3.5 py-2.5 rounded-xl border text-body-sm font-medium transition-colors ${format === "league" ? "bg-primary-green text-white border-primary-green" : "bg-white text-neutral-600 border-neutral-200"}`}
                >
                  League
                </button>
                <button
                  type="button"
                  onClick={() => setFormat("knockout")}
                  className={`flex-1 px-3.5 py-2.5 rounded-xl border text-body-sm font-medium transition-colors ${format === "knockout" ? "bg-primary-green text-white border-primary-green" : "bg-white text-neutral-600 border-neutral-200"}`}
                >
                  Knockout
                </button>
              </div>
              <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm outline-none focus:border-primary-green placeholder:text-neutral-400" />
              <input type="date" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm outline-none focus:border-primary-green" />
            </div>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" rows={2} className="w-full mt-3 px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm outline-none focus:border-primary-green resize-none placeholder:text-neutral-400" />
            <Button fullWidth loading={busy} disabled={!name.trim()} onClick={onCreate} className="mt-3">Create tournament</Button>
          </Card>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TournamentSkeleton />
            <TournamentSkeleton />
            <TournamentSkeleton />
            <TournamentSkeleton />
          </div>
        ) : tournaments.length === 0 ? (
          <Card padding="lg">
            <EmptyState
              icon={<TrophyIcon size={24} />}
              title="No tournaments yet"
              description="Create the first league and invite teams to compete."
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tournaments.map((t) => {
              const sm = statusMeta(t.status);
              return (
                <Link key={t.id} href={`/tournaments/${t.slug}`}>
                  <Card padding="md" className="hover:border-primary-green/30 hover:-translate-y-0.5 hover:shadow-card-hover h-full">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-primary-green/10 text-primary-green flex items-center justify-center flex-shrink-0"><TrophyIcon size={22} /></div>
                        <div className="min-w-0">
                          <p className="text-body-sm font-semibold text-neutral-900 truncate">{t.name}</p>
                          <div className="flex flex-wrap items-center gap-2 text-caption text-neutral-400 mt-0.5">
                            <span className="capitalize">{t.sport.replace("-", " ")}</span>
                            {t.city && <span className="flex items-center gap-0.5"><MapPinIcon size={11} />{t.city}</span>}
                            {t.startsAt && <span className="flex items-center gap-0.5"><CalendarIcon size={11} />{formatDate(t.startsAt)}</span>}
                          </div>
                        </div>
                      </div>
                      <span className={cn("px-2.5 py-1 rounded-full text-caption font-semibold flex-shrink-0", sm.cls)}>{sm.label}</span>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}