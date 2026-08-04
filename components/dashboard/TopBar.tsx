"use client";

import Link from "next/link";
import Logo from "@/components/Logo";
import Avatar from "@/components/ui/Avatar";
import { SearchIcon, BellIcon, MessageIcon } from "@/components/SvgIcons";
import { useSearch } from "@/context/SearchContext";
import { useMessaging } from "@/context/MessagingContext";
import type { Player } from "@/types";

export default function TopBar({ player }: { player: Player }) {
  const { setOpen } = useSearch();
  const { totalUnread } = useMessaging();

  return (
    <header className="sticky top-0 z-50 h-16 bg-white/85 backdrop-blur-2xl border-b border-neutral-200/60">
      <div className="mx-auto max-w-[1400px] h-full px-3 sm:px-5 flex items-center gap-3">
        <Link href="/" className="flex-shrink-0" aria-label="Turfog home">
          <Logo size={32} priority />
        </Link>

        <button
          onClick={() => setOpen(true)}
          className="hidden md:flex flex-1 max-w-lg mx-auto items-center gap-2.5 px-4 py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200/80 text-body-sm text-neutral-500 transition-colors"
        >
          <SearchIcon size={17} className="text-neutral-400" />
          <span className="flex-1 text-left">Search players, matches, posts...</span>
          <kbd className="inline-flex items-center px-2 py-0.5 rounded-lg border border-neutral-200 bg-white text-caption text-neutral-400 font-medium">
            Ctrl K
          </kbd>
        </button>

        <div className="flex items-center gap-1 ml-auto">
          <button
            onClick={() => setOpen(true)}
            aria-label="Search"
            className="md:hidden w-10 h-10 rounded-full hover:bg-neutral-100 active:scale-95 transition-all flex items-center justify-center text-neutral-600"
          >
            <SearchIcon size={21} />
          </button>

          <Link
            href="/messages"
            aria-label="Messages"
            className="relative w-10 h-10 rounded-full hover:bg-neutral-100 active:scale-95 transition-all flex items-center justify-center text-neutral-600"
          >
            <MessageIcon size={21} />
            {totalUnread > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-coral text-white text-caption font-semibold flex items-center justify-center ring-2 ring-white">
                {totalUnread > 9 ? "9+" : totalUnread}
              </span>
            )}
          </Link>

          <Link
            href="/notifications"
            aria-label="Notifications"
            className="relative w-10 h-10 rounded-full hover:bg-neutral-100 active:scale-95 transition-all flex items-center justify-center text-neutral-600"
          >
            <BellIcon size={21} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-coral rounded-full ring-2 ring-white" />
          </Link>

          <div className="w-px h-6 bg-neutral-200 mx-1.5 hidden sm:block" />

          <Link href="/profile" aria-label="Profile" className="relative flex-shrink-0 ml-0.5">
            <Avatar alt={player.full_name ?? player.username ?? "Profile"} src={player.profile_photo} size="sm" />
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-primary-green ring-2 ring-white" />
          </Link>
        </div>
      </div>
    </header>
  );
}