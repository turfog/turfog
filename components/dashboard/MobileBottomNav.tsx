"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { HomeIcon, GamesIcon, PlusIcon, CommunityIcon, UserIcon } from "@/components/SvgIcons";

const tabs = [
  { label: "Home", href: "/", icon: HomeIcon },
  { label: "Games", href: "/games", icon: GamesIcon },
  { label: "Create", href: "/#composer", icon: PlusIcon, isAction: true },
  { label: "Communities", href: "/communities", icon: CommunityIcon },
  { label: "Profile", href: "/profile", icon: UserIcon },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-neutral-200 px-2 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          if (tab.isAction) {
            return (
              <Link key={tab.href} href={tab.href} className="-mt-5">
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="w-[52px] h-[52px] bg-primary-green rounded-2xl flex items-center justify-center shadow-glow-green"
                >
                  <PlusIcon size={24} className="text-white" />
                </motion.div>
              </Link>
            );
          }
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center gap-0.5 py-2 px-3 min-w-[60px] transition-colors",
                active ? "text-primary-green" : "text-neutral-400"
              )}
            >
              <tab.icon size={22} />
              <span className="text-caption font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}