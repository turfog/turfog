"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import { ArrowLeftIcon, HeartIcon, UsersIcon, RunIcon, TrophyIcon, BellIcon } from "@/components/SvgIcons";

type Kind = "like" | "follow" | "match" | "mvp" | "system";

const items: Array<{ id: string; kind: Kind; name: string; text: string; time: string }> = [
  { id: "1", kind: "match", name: "Mumbai Strikers", text: "invited you to a 5v5 football match tonight", time: "5m ago" },
  { id: "2", kind: "like", name: "Priya Patel", text: "liked your match moment", time: "22m ago" },
  { id: "3", kind: "follow", name: "Arjun Nair", text: "started following you", time: "1h ago" },
  { id: "4", kind: "mvp", name: "Turfog", text: "You earned MVP in Andheri United vs Bandra FC", time: "3h ago" },
  { id: "5", kind: "system", name: "Turfog", text: "3 players nearby want to play badminton now", time: "5h ago" },
];

const iconFor: Record<Kind, React.ReactNode> = {
  like: <HeartIcon size={16} filled />,
  follow: <UsersIcon size={16} />,
  match: <RunIcon size={16} />,
  mvp: <TrophyIcon size={16} />,
  system: <BellIcon size={16} />,
};

const colorFor: Record<Kind, string> = {
  like: "bg-coral/10 text-coral",
  follow: "bg-electric-blue/10 text-electric-blue",
  match: "bg-primary-green/10 text-primary-green",
  mvp: "bg-amber/10 text-amber",
  system: "bg-neutral-100 text-neutral-500",
};

export default function NotificationsClient() {
  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-2xl mx-auto px-6 py-5">
          <Link href="/" className="flex items-center gap-2 text-body-xs text-neutral-400 hover:text-neutral-600 mb-2">
            <ArrowLeftIcon size={14} />
            Home
          </Link>
          <h1 className="text-display-sm font-bold text-neutral-900 font-display">Notifications</h1>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-3">
        {items.map((n, i) => (
          <motion.div key={n.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Card padding="md" className="hover:border-neutral-300">
              <div className="flex items-start gap-3">
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0", colorFor[n.kind])}>
                  {iconFor[n.kind]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-body-sm text-neutral-700">
                    <span className="font-semibold text-neutral-900">{n.name}</span> {n.text}
                  </p>
                  <p className="text-caption text-neutral-400 mt-0.5">{n.time}</p>
                </div>
                <Avatar alt={n.name} size="xs" />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}