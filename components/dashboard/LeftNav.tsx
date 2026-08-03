"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";
import PresenceSelector from "@/components/discovery/PresenceSelector";
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
  CalendarIcon,
} from "@/components/SvgIcons";
import type { Player } from "@/types";

const navItems = [
  { label: "Home", href: "/", icon: HomeIcon },
  { label: "Games", href: "/games", icon: GamesIcon },
  { label: "Communities", href: "/communities", icon: CommunityIcon },
  { label: "Teams", href: "/teams", icon: TrophyIcon },
  { label: "Officials", href: "/officials", icon: ShieldIcon },
  { label: "Bookings", href: "/bookings", icon: CalendarIcon },
  { label: "Messages", href: "/messages", icon: MessageIcon },
  { label: "Notifications", href: "/notifications", icon: BellIcon },
  { label: "Profile", href: "/profile", icon: UserIcon },
];

const myCommunities = ["Mumbai weekend warriors", "Bandra box cricket league", "Andheri badminton hub"];

export default function LeftNav({ player }: { player: Player }) {
  const pathname = usePathname();
  const { totalUnread } = useMessaging();

  return (
    <aside className="hidden lg:flex flex-col h-[calc(100vh-4rem)] sticky top-16 border-r border-neutral-200 bg-white px-3 py-4 overflow-y-auto scrollbar-hide">
      <Link href="/#composer">
        <motion.span
          whileTap={{ scale: 0.97 }}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-primary-green text-white text-body-sm font-semibold rounded-xl shadow-glow-green hover:bg-primary-green/90 transition-colors mb-4"
        >
          <PlusIcon size={18} />
          Create match
        </motion.span>
      </Link>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-body-sm font-medium transition-all",
                  active ? "bg-primary-green/10 text-primary-green" : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                )}
              >
                <item.icon size={20} />
                {item.label}
                {item.href === "/messages" && totalUnread > 0 && (
                  <span className="ml-auto min-w-[18px] h-[18px] px-1 rounded-full bg-coral text-white text-caption font-semibold flex items-center justify-center">
                    {totalUnread > 9 ? "9+" : totalUnread}
                  </span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="mt-5">
        <PresenceSelector />
      </div>

      <div className="mt-5">
        <p className="px-3 text-caption font-semibold text-neutral-400 uppercase tracking-wide mb-2">Your communities</p>
        <div className="space-y-0.5">
          {myCommunities.map((c) => (
            <Link key={c} href="/communities">
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-body-xs text-neutral-600 hover:bg-neutral-100 transition-colors">
                <span className="w-2 h-2 rounded-full bg-primary-green" />
                <span className="truncate">{c}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-neutral-200 space-y-1">
        <Link href="/profile">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-neutral-100 transition-colors">
            <Avatar alt={player.full_name ?? player.username ?? "You"} src={player.profile_photo} size="sm" />
            <div className="min-w-0">
              <p className="text-body-xs font-semibold text-neutral-900 truncate">{player.full_name ?? "You"}</p>
              <p className="text-caption text-neutral-400 truncate">@{player.username}</p>
            </div>
          </div>
        </Link>
        <Link href="/settings">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl text-body-xs font-medium text-neutral-600 hover:bg-neutral-100">
            <SettingsIcon size={18} />
            Settings
          </div>
        </Link>
        <button className="flex items-center gap-3 px-3 py-2 rounded-xl text-body-xs font-medium text-coral hover:bg-coral/5 w-full">
          <LogOutIcon size={18} />
          Log out
        </button>
      </div>
    </aside>
  );
}