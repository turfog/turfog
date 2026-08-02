"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Logo from "@/components/Logo";
import {
  HomeIcon,
  GamesIcon,
  CommunityIcon,
  BellIcon,
  UserIcon,
  SettingsIcon,
  LogOutIcon,
} from "@/components/SvgIcons";

const navItems = [
  { label: "Home", href: "/dashboard", icon: HomeIcon },
  { label: "Games", href: "/games", icon: GamesIcon },
  { label: "Communities", href: "/communities", icon: CommunityIcon },
  { label: "Notifications", href: "/notifications", icon: BellIcon },
  { label: "Profile", href: "/profile", icon: UserIcon },
];

export default function LeftNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col h-screen sticky top-0 border-r border-neutral-200 bg-white px-3 py-5">
      {/* Logo */}
      <Link href="/dashboard" className="px-3 mb-8 inline-flex" aria-label="Turfog home">
        <Logo size={30} />
      </Link>

      {/* Nav Items */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-body-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary-green/10 text-primary-green"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                )}
              >
                <item.icon size={20} />
                {item.label}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="space-y-1 border-t border-neutral-200 pt-4">
        <Link href="/settings">
          <motion.div
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-body-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-all"
          >
            <SettingsIcon size={20} />
            Settings
          </motion.div>
        </Link>
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-body-sm font-medium text-coral hover:bg-coral/5 w-full transition-all"
        >
          <LogOutIcon size={20} />
          Log out
        </motion.button>
      </div>
    </aside>
  );
}