"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import Avatar from "@/components/ui/Avatar";
import { SearchIcon, BellIcon } from "@/components/SvgIcons";
import type { Player } from "@/types";

export default function TopBar({ player }: { player: Player }) {
  const [q, setQ] = useState("");

  return (
    <header className="sticky top-0 z-50 h-16 bg-white/80 backdrop-blur-xl border-b border-neutral-200">
      <div className="mx-auto max-w-[1400px] h-full px-3 sm:px-4 flex items-center gap-3">
        <Link href="/" className="flex-shrink-0" aria-label="Turfog home">
          <Logo size={30} priority />
        </Link>

        <div className="hidden md:flex flex-1 max-w-md mx-auto">
          <div className="relative w-full">
            <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search players, matches, communities"
              className="w-full pl-9 pr-3 py-2 rounded-full bg-neutral-100 text-body-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:bg-white focus:ring-2 focus:ring-electric-blue/20 border border-transparent focus:border-electric-blue transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          <Link
            href="/notifications"
            className="relative w-9 h-9 rounded-xl hover:bg-neutral-100 flex items-center justify-center text-neutral-600"
          >
            <BellIcon size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-coral rounded-full" />
          </Link>
          <Link href="/profile" className="flex-shrink-0">
            <Avatar alt={player.full_name ?? player.username ?? "Profile"} src={player.profile_photo} size="sm" />
          </Link>
        </div>
      </div>
    </header>
  );
}