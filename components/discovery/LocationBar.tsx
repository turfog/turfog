"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLocation } from "@/context/LocationContext";
import { MapPinIcon, ChevronRightIcon } from "@/components/SvgIcons";

const RADIUS_OPTIONS = [1, 3, 5, 10, 25, 50] as const;

export default function LocationBar() {
  const { label, status, radius, setRadius } = useLocation();
  const [open, setOpen] = useState(false);

  const subtitle =
    status === "detecting"
      ? "Getting GPS signal..."
      : status === "denied"
      ? "Location off - showing default area"
      : status === "unavailable"
      ? "Geolocation unavailable - default area"
      : "Live location active";

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-card px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative flex-shrink-0">
            <MapPinIcon size={18} className="text-primary-green" />
            {status === "detecting" && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber rounded-full animate-pulse-soft" />
            )}
            {status === "granted" && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald rounded-full" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-body-xs font-semibold text-neutral-900 truncate">{label}</p>
            <p className="text-caption text-neutral-400">{subtitle}</p>
          </div>
        </div>

        <div className="relative flex-shrink-0">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1 px-3 py-1.5 bg-neutral-100 rounded-full text-body-xs font-medium text-neutral-700 hover:bg-neutral-200 transition-colors"
          >
            {radius} km
            <ChevronRightIcon
              size={13}
              className={cn("transition-transform duration-200", open && "rotate-90")}
            />
          </motion.button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 bg-white rounded-xl border border-neutral-200 shadow-card-hover py-1.5 z-50 min-w-[120px]"
              >
                <p className="px-3 py-1.5 text-caption text-neutral-400 font-medium">Discovery radius</p>
                {RADIUS_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setRadius(option);
                      setOpen(false);
                    }}
                    className={cn(
                      "w-full px-3 py-2 text-left text-body-xs font-medium transition-colors",
                      radius === option
                        ? "text-primary-green bg-primary-green/5"
                        : "text-neutral-600 hover:bg-neutral-50"
                    )}
                  >
                    {option} km
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}