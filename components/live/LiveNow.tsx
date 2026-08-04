"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import { createClient } from "@/lib/supabase";
import { fetchLivePlayers } from "@/lib/liveNow";
import type { LivePlayer } from "@/lib/liveNow";
import { MapPinIcon, CheckCircleIcon } from "@/components/SvgIcons";

function sportLabel(sport: string): string {
  if (!sport) return "";
  return sport.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function LiveNow() {
  const [players, setPlayers] = useState<LivePlayer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async (showLoading: boolean) => {
      if (showLoading && mounted) setLoading(true);
      const p = await fetchLivePlayers();
      if (mounted) {
        setPlayers(p);
        if (showLoading) setLoading(false);
      }
    };

    load(true);

    // Realtime push: refetch the moment any heartbeat changes.
    const supabase = createClient();
    const channel = supabase
      .channel("live-now-presence")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "heartbeats" },
        () => {
          void load(false);
        }
      )
      .subscribe();

    // Fallback poll in case realtime is unavailable.
    const timer = setInterval(() => load(false), 60000);

    return () => {
      mounted = false;
      clearInterval(timer);
      void supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <section className="max-w-3xl mx-auto px-6 pb-6">
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-card p-6">
          <div className="h-4 w-1/3 rounded bg-neutral-100 animate-pulse mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-20 rounded-xl bg-neutral-100 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-3xl mx-auto px-6 pb-6">
      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-coral" />
            </span>
            <h2 className="text-body-md font-semibold text-neutral-900 font-display">Live now</h2>
          </div>
          {players.length > 0 && (
            <span className="text-caption font-semibold text-coral">{players.length} active</span>
          )}
        </div>

        {players.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-body-sm font-medium text-neutral-500">No one else is live right now.</p>
            <p className="text-caption text-neutral-400 mt-1">Set your presence above to let nearby players know you are ready.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {players.map((p) => (
              <Link key={p.id} href={`/${p.username}`}>
                <div className="bg-neutral-50 rounded-xl p-3 hover:bg-neutral-100 transition-colors h-full">
                  <div className="flex items-center gap-2.5">
                    <div className="relative flex-shrink-0">
                      <Avatar alt={p.name} src={p.avatar} size="md" />
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald border-2 border-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <p className="text-body-xs font-semibold text-neutral-900 truncate">{p.name}</p>
                        {p.verified && <CheckCircleIcon size={12} className="text-electric-blue flex-shrink-0" />}
                      </div>
                      {p.sport && <p className="text-caption text-neutral-400 truncate">{sportLabel(p.sport)}</p>}
                    </div>
                  </div>
                  {p.location && (
                    <p className="text-caption text-neutral-400 mt-2 flex items-center gap-1 truncate">
                      <MapPinIcon size={11} />
                      {p.location}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </section>
  );
}