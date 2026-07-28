"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLocation } from "@/hooks/useLocation";
import { MapPinIcon, ChevronRightIcon } from "@/components/SvgIcons";
import { cn } from "@/lib/utils";

// ----- Component -----

export default function LocationBar() {
  const { location, isLoading, error, hasPermission, requestLocation } =
    useLocation();

  const displayLocation = location?.city || "Detecting location...";

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="px-4 py-2.5 border-b border-neutral-100 bg-white"
    >
      <div className="flex items-center justify-between">
        {/* Location Display */}
        <div className="flex items-center gap-2 min-w-0">
          <motion.div
            animate={
              isLoading
                ? { scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }
                : { scale: 1, opacity: 1 }
            }
            transition={
              isLoading
                ? { repeat: Infinity, duration: 1.5 }
                : { duration: 0.3 }
            }
          >
            <MapPinIcon
              size={16}
              className={cn(
                "flex-shrink-0",
                isLoading
                  ? "text-neutral-400"
                  : error
                  ? "text-coral"
                  : "text-primary-green"
              )}
            />
          </motion.div>
          <span className="text-body-sm text-neutral-600 truncate">
            {displayLocation}
          </span>
          {!hasPermission && !isLoading && (
            <button
              onClick={requestLocation}
              className="text-body-xs text-electric-blue font-medium hover:underline flex-shrink-0 ml-1"
            >
              Enable location
            </button>
          )}
        </div>

        {/* Nearby Count */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="w-1.5 h-1.5 bg-emerald rounded-full" />
          <span className="text-body-xs text-neutral-500">
            42 players nearby
          </span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="text-body-xs text-coral mt-1"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}