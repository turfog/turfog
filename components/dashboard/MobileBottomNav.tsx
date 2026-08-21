"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { HomeIcon, GamesIcon, PlusIcon, CommunityIcon, UserIcon } from "@/components/SvgIcons";

const tabs = [
  { label: "Home", href: "/", icon: HomeIcon },
  { label: "Discover", href: "/games", icon: GamesIcon },
  { label: "Create", href: "/#composer", icon: PlusIcon, isAction: true },
  { label: "Communities", href: "/communities", icon: CommunityIcon },
  { label: "Profile", href: "/profile", icon: UserIcon },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 mobile-safe-bottom">
      <div className="mx-3 mb-3 rounded-2xl glass shadow-[var(--shadow-xl)] border border-white/60">
        <div className="flex items-center justify-around px-1 pt-2 pb-1">
          {tabs.map((tab) => {
            const active = pathname === tab.href;

            if (tab.isAction) {
              return (
                <Link key={tab.href} href={tab.href} className="relative -mt-5" aria-label={tab.label}>
                  <motion.div
                    whileTap={{ scale: 0.86 }}
                    transition={{ type: "spring", stiffness: 500, damping: 22 }}
                    className="w-14 h-14 bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-[0_10px_25px_-5px_rgba(16,185,129,0.5)] ring-4 ring-white"
                  >
                    <PlusIcon size={26} className="text-white" />
                  </motion.div>
                </Link>
              );
            }

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex flex-col items-center justify-end min-w-[56px] py-1.5"
                aria-label={tab.label}
              >
                <motion.div
                  whileTap={{ scale: 0.88 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  className="flex flex-col items-center gap-0.5 relative"
                >
                  <div className="relative flex items-center justify-center w-11 h-8">
                    {active && (
                      <motion.div
                        layoutId="nav-active-pill"
                        className="absolute inset-0 bg-emerald-500/10 rounded-xl"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <motion.div
                      className="relative z-10 flex items-center justify-center"
                      animate={{ scale: active ? 1.1 : 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 16 }}
                    >
                      <tab.icon
                        size={22}
                        className={cn("transition-colors", active ? "text-emerald-600" : "text-neutral-500")}
                      />
                    </motion.div>
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-semibold tracking-wide transition-colors",
                      active ? "text-emerald-600" : "text-neutral-500"
                    )}
                  >
                    {tab.label}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}