"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ShieldIcon, ChevronRightIcon } from "@/components/SvgIcons";

type LocationSharing = "precise" | "approximate" | "area-only" | "hidden";
type Visibility = "everyone" | "friends" | "invisible";

const sharingOptions: Array<{ id: LocationSharing; label: string; desc: string }> = [
  { id: "precise", label: "Precise location", desc: "Share exact GPS coordinates" },
  { id: "approximate", label: "Approximate", desc: "Share within 500m radius" },
  { id: "area-only", label: "Area only", desc: "Share locality name only" },
  { id: "hidden", label: "Hidden", desc: "Do not share location" },
];

const visibilityOptions: Array<{ id: Visibility; label: string }> = [
  { id: "everyone", label: "Everyone" },
  { id: "friends", label: "Friends only" },
  { id: "invisible", label: "Invisible" },
];

export default function PrivacyPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [sharing, setSharing] = useState<LocationSharing>("approximate");
  const [visibility, setVisibility] = useState<Visibility>("everyone");
  const [hideStatus, setHideStatus] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-card overflow-hidden">
      {/* Toggle Header */}
      <motion.button
        whileTap={{ scale: 0.99 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-2.5">
          <ShieldIcon size={18} className="text-neutral-500" />
          <div className="text-left">
            <p className="text-body-xs font-semibold text-neutral-900">
              Privacy controls
            </p>
            <p className="text-caption text-neutral-400">
              {sharing === "hidden" ? "Location hidden" : `Sharing: ${sharing}`} / {visibility}
            </p>
          </div>
        </div>
        <ChevronRightIcon
          size={16}
          className={cn("text-neutral-300 transition-transform duration-200", isOpen && "rotate-90")}
        />
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4 border-t border-neutral-100 pt-3">
              {/* Location Sharing */}
              <div>
                <p className="text-caption font-medium text-neutral-700 mb-2">
                  Location sharing
                </p>
                <div className="space-y-1.5">
                  {sharingOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSharing(option.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-xl border text-left transition-all",
                        sharing === option.id
                          ? "border-primary-green bg-primary-green/5"
                          : "border-neutral-200 hover:border-neutral-300"
                      )}
                    >
                      <span
                        className={cn(
                          "w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                          sharing === option.id
                            ? "border-primary-green"
                            : "border-neutral-300"
                        )}
                      >
                        {sharing === option.id && (
                          <span className="w-1.5 h-1.5 bg-primary-green rounded-full" />
                        )}
                      </span>
                      <div>
                        <p className="text-body-xs font-medium text-neutral-900">
                          {option.label}
                        </p>
                        <p className="text-caption text-neutral-400">{option.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Visibility */}
              <div>
                <p className="text-caption font-medium text-neutral-700 mb-2">
                  Who can see you
                </p>
                <div className="flex gap-2">
                  {visibilityOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setVisibility(option.id)}
                      className={cn(
                        "flex-1 px-3 py-2 rounded-xl text-caption font-medium border transition-all text-center",
                        visibility === option.id
                          ? "border-primary-green bg-primary-green/5 text-primary-green"
                          : "border-neutral-200 text-neutral-500 hover:border-neutral-300"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hide Status Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-body-xs font-medium text-neutral-900">
                    Hide online status
                  </p>
                  <p className="text-caption text-neutral-400">
                    Appear offline to everyone
                  </p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setHideStatus(!hideStatus)}
                  className={cn(
                    "w-11 h-6 rounded-full transition-colors duration-200 relative",
                    hideStatus ? "bg-primary-green" : "bg-neutral-200"
                  )}
                >
                  <motion.span
                    animate={{ x: hideStatus ? 20 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                  />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
