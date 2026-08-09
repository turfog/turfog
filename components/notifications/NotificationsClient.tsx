"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn, timeAgo } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";
import { fetchNotifications, markNotificationsRead } from "@/lib/notifications";
import type { NotificationItem } from "@/lib/notifications";
import { HeartIcon, CommentIcon, UsersIcon, RunIcon, BellIcon, ArrowLeftIcon, TrophyIcon } from "@/components/SvgIcons";

function iconFor(t: string): { Icon: (p: { size?: number; className?: string }) => React.ReactNode; cls: string } {
  switch (t) {
    case "like": return { Icon: HeartIcon, cls: "bg-coral/10 text-coral" };
    case "comment": return { Icon: CommentIcon, cls: "bg-electric-blue/10 text-electric-blue" };
    case "follow": return { Icon: UsersIcon, cls: "bg-primary-green/10 text-primary-green" };
    case "team-invite": return { Icon: TrophyIcon, cls: "bg-amber/10 text-amber" };
    case "endorsement": return { Icon: TrophyIcon, cls: "bg-purple-500/10 text-purple-500" };
    case "match-join": return { Icon: RunIcon, cls: "bg-sunset-orange/10 text-sunset-orange" };
    default: return { Icon: RunIcon, cls: "bg-sunset-orange/10 text-sunset-orange" };
  }
}

export default function NotificationsClient() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications().then((r) => {
      setItems(r);
      setLoading(false);
      markNotificationsRead();
    });
  }, []);

  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-2xl mx-auto px-6 py-6">
          <Link href="/" className="flex items-center gap-2 text-body-xs text-neutral-400 hover:text-neutral-600 transition-colors mb-2">
            <ArrowLeftIcon size={14} />
            Home
          </Link>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <BellIcon size={22} className="text-primary-green" />
              <h1 className="text-display-sm font-bold text-neutral-900 font-display">Notifications</h1>
            </div>
            <Link href="/invites">
              <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-200 text-body-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors">
                <TrophyIcon size={15} />
                Team invites
              </span>
            </Link>
          </div>
          <p className="text-body-sm text-neutral-500">Followers, reactions, team invites, and live opportunities near you.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-3">
        {loading ? (
          [0, 1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-neutral-200 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-neutral-100 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-2/3 rounded bg-neutral-100 animate-pulse" />
                <div className="h-2.5 w-1/3 rounded bg-neutral-100 animate-pulse" />
              </div>
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-3"><BellIcon size={26} className="text-neutral-300" /></div>
            <p className="text-body-sm text-neutral-500">You are all caught up</p>
            <p className="text-caption text-neutral-400 mt-1">New followers, reactions, team invites, and nearby matches will appear here.</p>
          </div>
        ) : (
          items.map((n, i) => {
            const { Icon, cls } = iconFor(n.type);
            return (
              <motion.div key={n.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Link href={n.href}>
                  <div className={cn("bg-white rounded-2xl border shadow-card p-4 flex items-start gap-3 hover:border-neutral-300 transition-colors", n.read ? "border-neutral-200" : "border-primary-green/30")}>
                    <div className="relative flex-shrink-0">
                      <Avatar alt={n.actorName} src={n.actorAvatar} size="md" />
                      <span className={cn("absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white", cls)}>
                        <Icon size={11} />
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-body-sm text-neutral-700">
                        <span className="font-semibold text-neutral-900">{n.actorName}</span> {n.text}
                      </p>
                      <p className="text-caption text-neutral-400 mt-0.5">{timeAgo(n.createdAt)}</p>
                    </div>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-primary-green flex-shrink-0 mt-1.5" />}
                  </div>
                </Link>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}