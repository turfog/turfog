"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import type { Player } from "@/types/database";
import { getInitials } from "@/lib/utils";
import {
  HomeIcon,
  SearchIcon,
  UsersIcon,
  MatchesIcon,
  CommunityIcon,
  ProfileIcon,
  SettingsIcon,
  LogoutIcon,
  PlusIcon,
} from "@/components/SvgIcons";
import { getSupabaseBrowserClient } from "@/lib/supabase";

interface LeftNavProps {
  player: Player;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

export default function LeftNav({ player }: LeftNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const playerInitials = getInitials(player.full_name || player.username || "Player");

  const navItems: NavItem[] = [
    { label: "Home", href: ROUTES.DASHBOARD, icon: <HomeIcon size={22} /> },
    { label: "Discover", href: "/discover", icon: <SearchIcon size={22} /> },
    { label: "Communities", href: ROUTES.COMMUNITIES, icon: <CommunityIcon size={22} /> },
    { label: "Matches", href: "/matches", icon: <MatchesIcon size={22} />, badge: 3 },
    { label: "Players", href: "/players", icon: <UsersIcon size={22} /> },
  ];

  const bottomNavItems: NavItem[] = [
    { label: `@${player.username || "profile"}`, href: `/${player.username || ROUTES.EDIT_PROFILE}`, icon: <ProfileIcon size={22} /> },
    { label: "Settings", href: "/settings", icon: <SettingsIcon size={22} /> },
  ];

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await supabase.auth.signOut();
      router.push(ROUTES.SIGN_IN);
      router.refresh();
    } catch {
      setIsSigningOut(false);
    }
  };

  const isActive = (href: string) => {
    if (href === ROUTES.DASHBOARD) return pathname === ROUTES.DASHBOARD;
    return pathname.startsWith(href);
  };

  return (
    <nav className="flex flex-col h-full px-3 py-4">
      <Link href={ROUTES.DASHBOARD} className="flex items-center gap-2.5 px-2 mb-6">
        <div className="w-9 h-9 bg-primary-green rounded-xl flex items-center justify-center flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="5" r="2" />
            <path d="M10 22l.5-5 1.5 2 1.5-3" />
          </svg>
        </div>
        <span className="font-display text-xl font-bold text-neutral-900">Turfog</span>
      </Link>

      <div className="px-2 mb-4">
        <Link
          href={ROUTES.MATCHES_CREATE}
          className="flex items-center gap-2.5 w-full px-4 py-2.5 bg-primary-green text-white rounded-xl font-semibold text-body-sm hover:bg-primary-green-hover transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
        >
          <PlusIcon size={20} />
          Create match
        </Link>
      </div>

      <div className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} isActive={isActive(item.href)} />
        ))}
      </div>

      <div className="border-t border-neutral-200 my-3" />

      <div className="space-y-1">
        {bottomNavItems.map((item) => (
          <NavLink key={item.href} item={item} isActive={isActive(item.href)} />
        ))}
        <button
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 text-body-sm text-neutral-500 hover:text-coral hover:bg-coral/5 rounded-lg transition-all duration-200 disabled:opacity-50"
        >
          <LogoutIcon size={22} />
          {isSigningOut ? "Signing out..." : "Sign out"}
        </button>
      </div>

      <div className="border-t border-neutral-200 pt-3 mt-3">
        <Link
          href={`/${player.username || ROUTES.EDIT_PROFILE}`}
          className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-neutral-50 transition-colors"
        >
          {player.profile_photo ? (
            <img src={player.profile_photo} alt={player.full_name || "Player"} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm">
              <span className="text-body-sm font-semibold text-neutral-500">{playerInitials}</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-body-sm font-semibold text-neutral-900 truncate">{player.full_name || "Player"}</p>
            <p className="text-body-xs text-neutral-500 truncate">@{player.username || "username"}</p>
          </div>
          <span className="w-2 h-2 bg-emerald rounded-full flex-shrink-0" />
        </Link>
      </div>
    </nav>
  );
}

function NavLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 w-full px-3 py-2.5 text-body-sm rounded-lg transition-all duration-200 relative",
        isActive ? "bg-primary-green/10 text-primary-green font-semibold" : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
      )}
    >
      <motion.span whileTap={{ scale: 0.9 }} className="flex-shrink-0">{item.icon}</motion.span>
      <span className="truncate">{item.label}</span>
      <AnimatePresence>
        {item.badge && item.badge > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className={cn("ml-auto min-w-[20px] h-5 flex items-center justify-center rounded-full text-caption font-bold px-1.5", isActive ? "bg-primary-green text-white" : "bg-coral text-white")}
          >
            {item.badge > 99 ? "99+" : item.badge}
          </motion.span>
        )}
      </AnimatePresence>
      {isActive && (
        <motion.div layoutId="activeNav" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-green rounded-r-full" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
      )}
    </Link>
  );
}