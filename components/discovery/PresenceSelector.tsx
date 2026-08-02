"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { setMyPresence } from "@/lib/discovery";

type PresenceStatus =
  | "available-now"
  | "in-30-min"
  | "today"
  | "tonight"
  | "weekend"
  | "practice"
  | "looking-for-team"
  | "need-players"
  | "need-opponents"
  | "tournament-ready"
  | "offline";

const presenceOptions: Array<{ id: PresenceStatus; label: string; dot: string }> = [
  { id: "available-now", label: "Available now", dot: "bg-emerald" },
  { id: "in-30-min", label: "In 30 min", dot: "bg-amber" },
  { id: "today", label: "Today", dot: "bg-electric-blue" },
  { id: "tonight", label: "Tonight", dot: "bg-purple-500" },
  { id: "weekend", label: "Weekend", dot: "bg-sunset-orange" },
  { id: "practice", label: "Practice only", dot: "bg-neutral-400" },
  { id: "looking-for-team", label: "Looking for team", dot: "bg-electric-blue" },
  { id: "need-players", label: "Need players", dot: "bg-coral" },
  { id: "need-opponents", label: "Need opponents", dot: "bg-sunset-orange" },
  { id: "tournament-ready", label: "Tournament ready", dot: "bg-amber" },
  { id: "offline", label: "Offline", dot: "bg-neutral-300" },
];

const DURATION_OPTIONS = [30, 60, 120, 240, 480] as const;

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  return `${minutes / 60}h`;
}

export default function PresenceSelector() {
  const [status, setStatus] = useState<PresenceStatus>("available-now");
  const [duration, setDuration] = useState<number>(120);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(120 * 60);

  useEffect(() => {
    if (status === "offline") return;
    setRemainingSeconds(duration * 60);
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setStatus("offline");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [status, duration]);

  useEffect(() => {
    void setMyPresence(status, duration);
  }, [status, duration]);

  const activeOption = presenceOptions.find((o) => o.id === status);
  const hours = Math.floor(remainingSeconds / 3600);
  const mins = Math.floor((remainingSeconds % 3600) / 60);
  const secs = remainingSeconds % 60;

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-card px-4 py-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={cn("w-2.5 h-2.5 rounded-full", activeOption?.dot)} />
          <span className="text-body-xs font-semibold text-neutral-900">{activeOption?.label}</span>
        </div>
        {status !== "offline" && (
          <span className="text-caption text-neutral-400 font-mono">
            {hours > 0 ? `${hours}h ` : ""}
            {mins}m {secs}s remaining
          </span>
        )}
      </div>

      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-2 mb-2">
        {presenceOptions.map((option) => (
          <motion.button
            key={option.id}
            whileTap={{ scale: 0.94 }}
            onClick={() => setStatus(option.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-caption font-medium whitespace-nowrap border transition-all",
              status === option.id
                ? "border-neutral-900 bg-neutral-900 text-white"
                : "border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300"
            )}
          >
            <span className={cn("w-1.5 h-1.5 rounded-full", status === option.id ? "bg-white" : option.dot)} />
            {option.label}
          </motion.button>
        ))}
      </div>

      {status !== "offline" && (
        <div className="flex items-center gap-2">
          <span className="text-caption text-neutral-400">Auto-expire:</span>
          <div className="flex gap-1">
            {DURATION_OPTIONS.map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-caption font-medium border transition-all",
                  duration === d
                    ? "border-primary-green bg-primary-green/5 text-primary-green"
                    : "border-neutral-200 text-neutral-400 hover:border-neutral-300"
                )}
              >
                {formatDuration(d)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}