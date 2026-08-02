"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type PresenceStatus = "available-now" | "in-30-min" | "today" | "weekend" | "offline";

const presenceOptions: Array<{
  id: PresenceStatus;
  label: string;
  color: string;
  dot: string;
}> = [
  { id: "available-now", label: "Available now", color: "text-emerald", dot: "bg-emerald" },
  { id: "in-30-min", label: "In 30 minutes", color: "text-amber", dot: "bg-amber" },
  { id: "today", label: "Available today", color: "text-electric-blue", dot: "bg-electric-blue" },
  { id: "weekend", label: "This weekend", color: "text-purple-500", dot: "bg-purple-500" },
  { id: "offline", label: "Offline", color: "text-neutral-400", dot: "bg-neutral-300" },
];

export default function PresenceSelector() {
  const [status, setStatus] = useState<PresenceStatus>("available-now");

  const activeOption = presenceOptions.find((o) => o.id === status);

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-card px-4 py-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={cn("w-2.5 h-2.5 rounded-full", activeOption?.dot)} />
          <span className="text-body-xs font-semibold text-neutral-900">
            {activeOption?.label}
          </span>
        </div>
        <span className="text-caption text-neutral-400">
          Visible to nearby players
        </span>
      </div>

      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
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
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                status === option.id ? "bg-white" : option.dot
              )}
            />
            {option.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
