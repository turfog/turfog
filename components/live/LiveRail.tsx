"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import { fetchLivePlayers } from "@/lib/liveNow";
import type { LivePlayer } from "@/lib/liveNow";

export default function LiveRail() {
  const [players, setPlayers] = useState<LivePlayer[]>([]);

  useEffect(() => {
    let mounted = true;
    const load = () => {
      fetchLivePlayers().then((p) => { if (mounted) setPlayers(p); });
    };
    load();
    const timer = setInterval(load, 30000);
    return () => { mounted = false; clearInterval(timer); };
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between px-3 mb-2">
        <p className="text-caption font-semibold text-neutral-400 uppercase tracking-wide">Live now</p>
        {players.length > 0 && (
          <span className="flex items-center gap-1.5 text-caption font-semibold text-primary-green">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-green opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary-green" />
            </span>
            {players.length}
          </span>
        )}
      </div>
      {players.length === 0 ? (
        <p className="px-3 text-caption text-neutral-400">No one is live right now.</p>
      ) : (
        <div className="space-y-0.5">
          {players.slice(0, 6).map((p) => (
            <Link key={p.id} href={`/${p.username}`}>
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-neutral-100 transition-colors">
                <div className="relative flex-shrink-0">
                  <Avatar alt={p.name} src={p.avatar} size="sm" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-primary-green border-2 border-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-body-xs font-semibold text-neutral-900 truncate">{p.name}</p>
                  <p className="text-caption text-neutral-400 truncate capitalize">{p.sport.replace(/-/g, " ")}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}