"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import type { Player } from "@/types/database";
import {
  HomeIcon,
  SearchIcon,
  PlusIcon,
  CommunityIcon,
  ProfileIcon,
} from "@/components/SvgIcons";

// ----- Types -----

interface MobileBottomNavProps {
  player: Player;
}

interface BottomNavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  isCenter?: boolean;
}

// ----- Component -----

export default function MobileBottomNav({ player }: MobileBottomNavProps) {
  const pathname = usePathname();

  const navItems: BottomNavItem[] = [
    {
      label: "Home",
      href: ROUTES.DASHBOARD,
      icon: <HomeIcon size={22} />,
    },
    {
      label: "Discover",
      href: "/discover",
      icon: <SearchIcon size={22} />,
    },
    {
      label: "Create",
      href: ROUTES.MATCHES_CREATE,
      icon: <PlusIcon size={24} />,
      isCenter: true,
    },
    {
      label: "Communities",
      href: ROUTES.COMMUNITIES,
      icon: <CommunityIcon size={22} />,
    },
    {
      label: "Profile",
      href: `/${player.username || ROUTES.EDIT_PROFILE}`,
      icon: <ProfileIcon size={22} />,
    },
  ];

  const isActive = (href: string) => {
    if (href === ROUTES.DASHBOARD) {
      return pathname === ROUTES.DASHBOARD;
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-t border-neutral-200 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const active = isActive(item.href);

          if (item.isCenter) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative -mt-6"
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors",
                    active
                      ? "bg-primary-green text-white shadow-glow-green"
                      : "bg-primary-green text-white hover:bg-primary-green-hover"
                  )}
                >
                  {item.icon}
                </motion.div>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-0.5 min-w-[48px] py-1"
            >
              <motion.div
                whileTap={{ scale: 0.85 }}
                className={cn(
                  "transition-colors",
                  active ? "text-primary-green" : "text-neutral-400"
                )}
              >
                {item.icon}
              </motion.div>
              <span
                className={cn(
                  "text-caption transition-colors",
                  active
                    ? "text-primary-green font-semibold"
                    : "text-neutral-400"
                )}
              >
                {item.label}
              </span>
              {active && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute -top-1 w-8 h-0.5 bg-primary-green rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}