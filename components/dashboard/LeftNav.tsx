"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";
import LiveRail from "@/components/live/LiveRail";
import { useMessaging } from "@/context/MessagingContext";
import {
  HomeIcon,
  GamesIcon,
  CommunityIcon,
  MessageIcon,
  BellIcon,
  UserIcon,
  SettingsIcon,
  LogOutIcon,
  PlusIcon,
  TrophyIcon,
  ShieldIcon,
  StarIcon,
} from "@/components/SvgIcons";
import type { Player } from "@/types";

const navItems = [
  { label: "Home", href: "/", icon: HomeIcon },
  { label: "Games", href: "/games", icon: GamesIcon },
  { label: "Tournaments", href: "/tournaments", icon: TrophyIcon },
  { label: "Communities", href: "/communities", icon: CommunityIcon },
  { label: "Teams", href: "/teams", icon: TrophyIcon },
  { label: "Officials", href: "/officials", icon: ShieldIcon },
  { label: "Leaderboards", href: "/leaderboards", icon: StarIcon },
  { label: "Messages", href: "/messages", icon: MessageIcon },
  { label: "Notifications", href: "/notifications", icon: BellIcon },
  { label: "Profile", href: "/profile", icon: UserIcon },
];

const myCommunities = ["Mumbai weekend warriors", "Bandra box cricket league", "Andheri badminton hub"];

export default function LeftNav({ player }: { player: Player }) {
  const pathname = usePathname();
  const { totalUnread } = useMessaging();

  return (
    <aside className="hidden lg:flex flex-col h-[calc(100vh-6rem)] sticky top-24 overflow-y-auto turfog-scroll px-2 py-4">
      <div className="surface-card p-3 mb-4">
        <Link href="/#composer">
          <motion.span
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 500, damping: 24 }}
            className="flex items-center justify-center gap-2.5 w-full px-4 py-3 bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 text-white text-[14px] font-semibold rounded-xl shadow-[0_8px_24px_-6px_rgba(16,185,129,0.4)] hover:shadow-[0_12px_32px_-8px_rgba(16,185,129,0.5)] transition-shadow"
          >
            <PlusIcon size={18} />
            Create match
          </motion.span>
        </Link>
      </div>

      <nav className="space-y-0.5">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="block">
              <motion.div
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all relative",
                  active ? "text-emerald-700" : "text-neutral-600 hover:text-neutral-900 hover:bg-black/[0.03]"
                )}
              >
                {active && (
                  <motion.div
                    layoutId="leftnav-active-pill"
                    className="absolute inset-0 bg-emerald-500/[0.08] rounded-xl"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <item.icon size={20} className={cn("relative z-10", active && "text-emerald-600")} />
                <span className="relative z-10">{item.label}</span>
                {item.href === "/messages" && totalUnread > 0 && (
                  <motion.span
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    className="relative z-10 ml-auto min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-b from-coral to-rose-600 text-white text-[10px] font-bold flex items-center justify-center shadow-sm"
                  >
                    {totalUnread > 9 ? "9+" : totalUnread}
                  </motion.span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="mt-6">
        <LiveRail />
      </div>

      <div className="mt-6">
        <p className="px-3 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Your communities</p>
        <div className="space-y-0.5">
          {myCommunities.map((c) => (
            <Link key={c} href="/communities" className="block">
              <motion.div
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] text-neutral-600 hover:bg-black/[0.03] hover:text-neutral-900 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 flex-shrink-0" />
                <span className="truncate">{c}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-6 space-y-1">
        <div className="surface-card p-3 mb-2">
          <Link href="/profile" className="block">
            <div className="flex items-center gap-2.5">
              <Avatar alt={player.full_name ?? player.username ?? "You"} src={player.profile_photo} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-neutral-900 truncate">{player.full_name ?? "You"}</p>
                <p className="text-[11px] text-neutral-500 truncate">@{player.username}</p>
              </div>
            </div>
          </Link>
        </div>
        <Link href="/settings" className="block">
          <motion.div
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium text-neutral-600 hover:bg-black/[0.03] hover:text-neutral-900 transition-colors"
          >
            <SettingsIcon size={18} />
            Settings
          </motion.div>
        </Link>
        <button className="flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium text-coral hover:bg-coral/[0.04] w-full transition-colors">
          <LogOutIcon size={18} />
          Log out
        </button>
      </div>
    </aside>
  );
}