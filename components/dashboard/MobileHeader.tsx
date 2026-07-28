"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import type { Player } from "@/types/database";
import { getInitials } from "@/lib/utils";
import {
  MenuIcon,
  XIcon,
  NotificationIcon,
  SearchIcon,
} from "@/components/SvgIcons";

// ----- Types -----

interface MobileHeaderProps {
  player: Player;
}

// ----- Component -----

export default function MobileHeader({ player }: MobileHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const playerInitials = getInitials(
    player.full_name || player.username || "Player"
  );

  return (
    <>
      {/* Header Bar */}
      <header className="lg:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-neutral-200">
        <div className="flex items-center justify-between px-4 h-14">
          {/* Logo */}
          <Link href={ROUTES.DASHBOARD} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-green rounded-lg flex items-center justify-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="5" r="2" />
                <path d="M10 22l.5-5 1.5 2 1.5-3" />
              </svg>
            </div>
            <span className="font-display text-lg font-bold text-neutral-900">
              Turfog
            </span>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              className="w-9 h-9 flex items-center justify-center text-neutral-500 hover:text-neutral-700 transition-colors rounded-lg hover:bg-neutral-100"
              aria-label="Search"
            >
              <SearchIcon size={20} />
            </motion.button>

            {/* Notifications */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              className="relative w-9 h-9 flex items-center justify-center text-neutral-500 hover:text-neutral-700 transition-colors rounded-lg hover:bg-neutral-100"
              aria-label="Notifications"
            >
              <NotificationIcon size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-coral rounded-full border border-white" />
            </motion.button>

            {/* Menu Toggle */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-9 h-9 flex items-center justify-center text-neutral-500 hover:text-neutral-700 transition-colors rounded-lg hover:bg-neutral-100"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
            </motion.button>
          </div>
        </div>
      </header>

      {/* Slide-out Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-white shadow-2xl z-50 lg:hidden"
            >
              <div className="p-4 pt-14">
                {/* User Info */}
                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl mb-4">
                  {player.profile_photo ? (
                    <img
                      src={player.profile_photo}
                      alt={player.full_name || "Player"}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center">
                      <span className="text-body-md font-semibold text-neutral-500">
                        {playerInitials}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="text-body-sm font-semibold text-neutral-900">
                      {player.full_name || "Player"}
                    </p>
                    <p className="text-body-xs text-neutral-500">
                      @{player.username || "username"}
                    </p>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="space-y-1">
                  <MobileMenuLink
                    href={ROUTES.DASHBOARD}
                    label="Home"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <MobileMenuLink
                    href="/discover"
                    label="Discover"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <MobileMenuLink
                    href={ROUTES.COMMUNITIES}
                    label="Communities"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <MobileMenuLink
                    href="/matches"
                    label="Matches"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <MobileMenuLink
                    href={`/${player.username || ROUTES.EDIT_PROFILE}`}
                    label="Profile"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <MobileMenuLink
                    href="/settings"
                    label="Settings"
                    onClick={() => setIsMenuOpen(false)}
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ----- Mobile Menu Link -----

function MobileMenuLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-3 py-3 text-body-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-colors"
    >
      {label}
    </Link>
  );
}