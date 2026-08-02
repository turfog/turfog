"use client";

import Link from "next/link";
import Logo from "@/components/Logo";
import Avatar from "@/components/ui/Avatar";
import { SearchIcon, BellIcon } from "@/components/SvgIcons";
import { useSearch } from "@/context/SearchContext";
import type { Player } from "@/types";

export default function TopBar({ player }: { player: Player }) {
  const { setOpen } = useSearch();

  return (
    <header className="sticky top-0 z-50 h-16 bg-white/80 backdrop-blur-xl border-b border-neutral-200">
      <div className="mx-auto max-w-[1400px] h-full px-3 sm:px-4 flex items-center gap-3">
        <Link href="/" className="flex-shrink-0" aria-label="Turfog home">
          <Logo size={30} priority />
        </Link>

        <button
          onClick={() => setOpen(true)}
          className="hidden md:flex flex-1 max-w-md mx-auto items-center gap-2 px-4 py-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-body-sm text-neutral-500 transition-colors"
        >
          <SearchIcon size={16} />
          <span className="flex-1 text-left">Search players, matches, posts...</span>
          <kbd className="inline-flex items-center px-1.5 py-0.5 rounded-md border border-neutral-200 bg-white text-caption text-neutral-400">Ctrl+K</kbd>
        </button>

        <div className="flex items-center gap-1.5 ml-auto">
          <button onClick={() => setOpen(true)} className="md:hidden w-9 h-9 rounded-xl hover:bg-neutral-100 flex items-center justify-center text-neutral-600">
            <SearchIcon size={20} />
          </button>
          <Link href="/notifications" className="relative w-9 h-9 rounded-xl hover:bg-neutral-100 flex items-center justify-center text-neutral-600">
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