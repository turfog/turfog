"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { MapPinIcon, ChevronRightIcon } from "@/components/SvgIcons";

const RADIUS_OPTIONS = [1, 3, 5, 10, 25, 50] as const;

interface LocationState {
  label: string;
  lat: number | null;
  lng: number | null;
  status: "detecting" | "granted" | "denied" | "default";
}

export default function LocationBar() {
  const [location, setLocation] = useState<LocationState>({
    label: "Detecting your location...",
    lat: null,
    lng: null,
    status: "detecting",
  });
  const [radius, setRadius] = useState<number>(5);
  const [showRadiusPicker, setShowRadiusPicker] = useState(false);

  const detectLocation = useCallback(() => {
    setLocation((prev) => ({ ...prev, status: "detecting", label: "Detecting your location..." }));

    if (!navigator.geolocation) {
      setLocation({ label: "Andheri west, Mumbai", lat: 19.1136, lng: 72.8697, status: "default" });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          label: "Andheri west, Mumbai",
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          status: "granted",
        });
      },
      () => {
        setLocation({ label: "Andheri west, Mumbai", lat: 19.1136, lng: 72.8697, status: "denied" });
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 }
    );
  }, []);

  useEffect(() => {
    detectLocation();
  }, [detectLocation]);

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-card px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Location */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative flex-shrink-0">
            <MapPinIcon size={18} className="text-primary-green" />
            {location.status === "detecting" && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber rounded-full animate-pulse-soft" />
            )}
            {location.status === "granted" && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald rounded-full" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-body-xs font-semibold text-neutral-900 truncate">
              {location.label}
            </p>
            <p className="text-caption text-neutral-400">
              {location.status === "detecting"
                ? "Getting GPS signal..."
                : location.status === "denied"
                ? "Location off - showing default area"
                : "Live location active"}
            </p>
          </div>
        </div>

        {/* Radius Selector */}
        <div className="relative flex-shrink-0">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowRadiusPicker(!showRadiusPicker)}
            className="flex items-center gap-1 px-3 py-1.5 bg-neutral-100 rounded-full text-body-xs font-medium text-neutral-700 hover:bg-neutral-200 transition-colors"
          >
            {radius} km
            <ChevronRightIcon
              size={13}
              className={cn("transition-transform duration-200", showRadiusPicker && "rotate-90")}
            />
          </motion.button>

          <AnimatePresence>
            {showRadiusPicker && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 bg-white rounded-xl border border-neutral-200 shadow-card-hover py-1.5 z-50 min-w-[120px]"
              >
                <p className="px-3 py-1.5 text-caption text-neutral-400 font-medium">
                  Discovery radius
                </p>
                {RADIUS_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setRadius(option);
                      setShowRadiusPicker(false);
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
