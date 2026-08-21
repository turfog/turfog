"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";
import Avatar from "@/components/ui/Avatar";
import { createClient } from "@/lib/supabase";
import { SearchIcon, BellIcon, MessageIcon } from "@/components/SvgIcons";
import { useSearch } from "@/context/SearchContext";
import { useMessaging } from "@/context/MessagingContext";
import { useLocation } from "@/context/LocationContext";
import { fetchUnreadCount } from "@/lib/notifications";
import type { Player } from "@/types";

export default function TopBar({ player }: { player: Player }) {
  const { setOpen } = useSearch();
  const { totalUnread } = useMessaging();
  const { radius } = useLocation();
  const [notifUnread, setNotifUnread] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = () => fetchUnreadCount().then((n) => { if (mounted) setNotifUnread(n); });
    load();
    const interval = setInterval(load, 30000);
    const onFocus = () => load();
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("focus", onFocus);
    window.addEventListener("scroll", onScroll, { passive: true });

    const supabase = createClient();
    const channel = supabase
      .channel("topbar-notifications")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, load)
      .subscribe();

    return () => {
      mounted = false;
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("scroll", onScroll);
      supabase.removeChannel(channel);
    };
  }, []);

  const countPill = (n: number) => n > 0 ? (
    <motion.span
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 25 }}
      className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-b from-coral to-rose-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white shadow-sm"
    >
      {n > 9 ? "9+" : n}
    </motion.span>
  ) : null;

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 mobile-safe-top ${scrolled ? "glass shadow-[var(--shadow-md)]" : "bg-transparent border-b border-transparent"}`}>
      <div className="mx-auto max-w-[1440px] h-[64px] lg:h-[72px] px-4 lg:px-6 flex items-center gap-3">
        <Link href="/" className="flex-shrink-0 turfog-press" aria-label="Turfog home">
          <Logo size={34} priority />
        </Link>

        <button
          onClick={() => setOpen(true)}
          className="hidden md:flex flex-1 max-w-xl mx-auto items-center gap-3 px-4 py-2.5 rounded-2xl bg-black/[0.04] hover:bg-black/[0.07] text-[14px] text-neutral-500 transition-all border border-transparent hover:border-black/[0.06]"
        >
          <SearchIcon size={17} className="text-neutral-400" />
          <span className="flex-1 text-left font-body">Search players, matches, posts…</span>
          <kbd className="inline-flex items-center px-2 py-0.5 rounded-lg border border-black/10 bg-white text-[11px] text-neutral-400 font-semibold tracking-wide">
            ⌘K
          </kbd>
        </button>

        <div className="flex items-center gap-1 lg:gap-1.5 ml-auto">
          <button
            onClick={() => setOpen(true)}
            aria-label="Search"
            className="md:hidden w-10 h-10 rounded-xl hover:bg-black/[0.04] active:scale-95 transition-all flex items-center justify-center text-neutral-600"
          >
            <SearchIcon size={21} />
          </button>

          <Link
            href="/messages"
            aria-label="Messages"
            className="relative w-10 h-10 rounded-xl hover:bg-black/[0.04] active:scale-95 transition-all flex items-center justify-center text-neutral-700 turfog-press"
          >
            <MessageIcon size={21} />
            {countPill(totalUnread)}
          </Link>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 mx-0.5 rounded-full bg-gradient-to-r from-emerald-50 to-emerald-100/60 border border-emerald-200/60 text-emerald-700 text-[11px] font-semibold tracking-wide">
            <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <span>LIVE</span>
            {radius && <span className="text-emerald-600/80">· {radius} km</span>}
          </div>

          <Link
            href="/notifications"
            aria-label="Notifications"
            onClick={() => setNotifUnread(0)}
            className="relative w-10 h-10 rounded-xl hover:bg-black/[0.04] active:scale-95 transition-all flex items-center justify-center text-neutral-700 turfog-press"
          >
            <BellIcon size={21} />
            {countPill(notifUnread)}
          </Link>

          <div className="w-px h-6 bg-black/[0.08] mx-1.5 hidden sm:block" />

          <Link href="/profile" aria-label="Profile" className="relative flex-shrink-0 ml-0.5 turfog-press">
            <div className="relative">
              <Avatar alt={player.full_name ?? player.username ?? "Profile"} src={player.profile_photo} size="sm" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 ring-2 ring-white shadow-sm" />
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}