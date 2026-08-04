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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-2xl border-t border-neutral-200/60 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around px-1 pt-1.5">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          if (tab.isAction) {
            return (
              <Link key={tab.href} href={tab.href} className="relative -mt-6" aria-label={tab.label}>
                <motion.div
                  whileTap={{ scale: 0.88 }}
                  className="w-14 h-14 bg-primary-green rounded-full flex items-center justify-center shadow-glow-green ring-4 ring-white"
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
              className="flex flex-col items-center justify-end min-w-[64px] py-1.5"
              aria-label={tab.label}
            >
              <motion.div whileTap={{ scale: 0.85 }} className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "flex items-center justify-center w-12 h-8 rounded-full transition-colors",
                    active ? "bg-primary-green/10" : "bg-transparent"
                  )}
                >
                  <tab.icon size={22} className={cn("transition-colors", active ? "text-primary-green" : "text-neutral-400")} />
                </div>
                <span className={cn("text-caption font-medium transition-colors", active ? "text-primary-green" : "text-neutral-400")}>
                  {tab.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}