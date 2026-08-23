"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase";
import { 
  Activity, UserPlus, Trophy, MessageSquare, ShoppingBag, 
  AlertTriangle, Zap, TrendingUp, Globe 
} from "lucide-react";

type EventType = "registration" | "match_created" | "match_completed" | "post_published" | "order_placed" | "report_filed";

interface PlatformEvent {
  id: string;
  type: EventType;
  title: string;
  meta: string;
  timestamp: Date;
  severity: "info" | "success" | "warning" | "critical";
}

const eventConfig: Record<EventType, { icon: any; color: string; bg: string }> = {
  registration: { icon: UserPlus, color: "text-blue-600", bg: "bg-blue-50" },
  match_created: { icon: Trophy, color: "text-emerald-600", bg: "bg-emerald-50" },
  match_completed: { icon: Activity, color: "text-purple-600", bg: "bg-purple-50" },
  post_published: { icon: MessageSquare, color: "text-indigo-600", bg: "bg-indigo-50" },
  order_placed: { icon: ShoppingBag, color: "text-amber-600", bg: "bg-amber-50" },
  report_filed: { icon: AlertTriangle, color: "text-rose-600", bg: "bg-rose-50" },
};

const initialEvents: PlatformEvent[] = [
  { id: "init-1", type: "match_created", title: "System connected to Supabase Realtime", meta: "Listening for live platform events...", timestamp: new Date(), severity: "success" },
];

function timeAgo(date: Date, now: Date) {
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.floor(minutes / 60)}h ago`;
}

export default function PulsePage() {
  const [events, setEvents] = useState<PlatformEvent[]>(initialEvents);
  const [now, setNow] = useState(new Date());

  // Tick the clock every 2.5s to update "timeAgo" strings
  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 2500);
    return () => clearInterval(tick);
  }, []);

  // Supabase Realtime Subscription
  useEffect(() => {
    const supabase = createClient();
    
    const injectEvent = (payload: Omit<PlatformEvent, "id" | "timestamp">) => {
      const newEvent: PlatformEvent = {
        ...payload,
        id: Math.random().toString(36).substring(7),
        timestamp: new Date(),
      };
      setEvents((prev) => [newEvent, ...prev].slice(0, 25));
    };

    const channel = supabase
      .channel("admin-pulse-feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "players" },
        (payload: any) => {
          injectEvent({
            type: "registration",
            title: `New user joined: ${payload.new.full_name || "Player"}`,
            meta: `@${payload.new.username || "new_user"}`,
            severity: "info",
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "reports" },
        (payload: any) => {
          injectEvent({
            type: "report_filed",
            title: `New ${payload.new.severity || "medium"} report filed`,
            meta: `Reason: ${payload.new.reason}`,
            severity: payload.new.severity === "critical" ? "critical" : "warning",
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "matches" },
        (payload: any) => {
          injectEvent({
            type: "match_created",
            title: "New match created",
            meta: `Sport: ${payload.new.sport || "Unknown"}`,
            severity: "success",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const stats = [
    { label: "Events / Min", value: "Live", trend: "Realtime", icon: Zap },
    { label: "Active Users Now", value: "3,841", trend: "+4%", icon: Globe },
    { label: "System Load", value: "24%", trend: "Stable", icon: TrendingUp },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-[24px] font-bold text-neutral-900 tracking-tight">Platform Pulse</h1>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            LIVE (REALTIME)
          </span>
        </div>
        <p className="text-[13px] text-neutral-500 mt-1">Real-time operational activity across the Turfog ecosystem via Supabase WebSockets.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white border border-neutral-200 rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-600">
              <stat.icon size={18} />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-[20px] font-bold text-neutral-900">{stat.value}</p>
                <span className="text-[11px] font-semibold text-emerald-600">{stat.trend}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-3 border-b border-neutral-200 bg-neutral-50/50 flex items-center justify-between">
          <h2 className="text-[13px] font-semibold text-neutral-900">Live Activity Stream</h2>
          <span className="text-[11px] text-neutral-500">Powered by Supabase Realtime</span>
        </div>
        
        <div className="divide-y divide-neutral-100 max-h-[600px] overflow-y-auto">
          <AnimatePresence initial={false}>
            {events.map((event) => {
              const config = eventConfig[event.type];
              const Icon = config.icon;
              return (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, backgroundColor: "rgba(16, 185, 129, 0.08)" }}
                  animate={{ opacity: 1, backgroundColor: "rgba(255, 255, 255, 0)" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="group flex items-center gap-4 px-5 py-3.5 hover:bg-neutral-50 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-full ${config.bg} ${config.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-neutral-900 truncate">{event.title}</p>
                    <p className="text-[11px] text-neutral-500 truncate">{event.meta}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[11px] font-medium text-neutral-400 tabular-nums">{timeAgo(event.timestamp, now)}</p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}