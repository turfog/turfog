"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Card from "@/components/ui/Card";
import {
  FootballIcon,
  CricketIcon,
  PickleballIcon,
  PadelIcon,
  BadmintonIcon,
  UsersIcon,
  ZapIcon,
} from "@/components/SvgIcons";
import type { SportId } from "@/types";

interface ActivityZone {
  id: string;
  sport: SportId;
  label: string;
  players: number;
  matches: number;
  status: string;
  angle: number;
  distance: number;
  intensity: "high" | "medium" | "low";
}

const sportIconMap: Record<SportId, React.ReactNode> = {
  football: <FootballIcon size={16} />,
  "box-cricket": <CricketIcon size={16} />,
  pickleball: <PickleballIcon size={16} />,
  padel: <PadelIcon size={16} />,
  badminton: <BadmintonIcon size={16} />,
};

const sportBgMap: Record<SportId, string> = {
  football: "bg-primary-green",
  "box-cricket": "bg-electric-blue",
  pickleball: "bg-emerald",
  padel: "bg-amber",
  badminton: "bg-sunset-orange",
};

const initialZones: ActivityZone[] = [
  { id: "z1", sport: "football", label: "Football", players: 12, matches: 3, status: "Match starting in 20 min", angle: 30, distance: 35, intensity: "high" },
  { id: "z2", sport: "box-cricket", label: "Box cricket", players: 8, matches: 2, status: "Night match at 9 PM", angle: 100, distance: 50, intensity: "high" },
  { id: "z3", sport: "badminton", label: "Badminton", players: 8, matches: 1, status: "6 players available", angle: 170, distance: 42, intensity: "medium" },
  { id: "z4", sport: "padel", label: "Padel", players: 4, matches: 1, status: "Court active now", angle: 230, distance: 55, intensity: "medium" },
  { id: "z5", sport: "pickleball", label: "Pickleball", players: 6, matches: 0, status: "Community meetup Sat", angle: 300, distance: 60, intensity: "low" },
  { id: "z6", sport: "football", label: "Football", players: 5, matches: 1, status: "Need 2 more players", angle: 140, distance: 65, intensity: "medium" },
  { id: "z7", sport: "badminton", label: "Badminton", players: 3, matches: 0, status: "Practice session", angle: 260, distance: 70, intensity: "low" },
];

const intensityRing: Record<string, string> = {
  high: "ring-coral/40",
  medium: "ring-amber/40",
  low: "ring-emerald/40",
};

export default function ActivityMap() {
  const [zones, setZones] = useState<ActivityZone[]>(initialZones);
  const [selectedZone, setSelectedZone] = useState<ActivityZone | null>(null);
  const [pulse, setPulse] = useState(1);
  const [activeFilter, setActiveFilter] = useState<SportId | "all">("all");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setPulse((prev) => (prev === 1 ? 1.02 : 1));
      setZones((prev) =>
        prev.map((z) => ({
          ...z,
          players: Math.max(1, z.players + Math.floor(Math.random() * 3) - 1),
        }))
      );
    }, 3000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const filteredZones =
    activeFilter === "all"
      ? zones
      : zones.filter((z) => z.sport === activeFilter);

  const totalPlayers = zones.reduce((sum, z) => sum + z.players, 0);
  const totalMatches = zones.reduce((sum, z) => sum + z.matches, 0);

  const filterOptions: Array<{ id: SportId | "all"; label: string }> = [
    { id: "all", label: "All" },
    { id: "football", label: "Football" },
    { id: "box-cricket", label: "Cricket" },
    { id: "badminton", label: "Badminton" },
    { id: "padel", label: "Padel" },
    { id: "pickleball", label: "Pickleball" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ZapIcon size={18} className="text-sunset-orange" />
          <h2 className="text-body-lg font-semibold text-neutral-900 font-display">
            Live sports radar
          </h2>
        </div>
        <span className="flex items-center gap-1.5 text-body-xs text-emerald font-medium">
          <span className="w-1.5 h-1.5 bg-emerald rounded-full animate-pulse-soft" />
          Live
        </span>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <Card padding="sm" className="text-center">
          <p className="text-display-xs font-bold text-neutral-900">{totalPlayers}</p>
          <p className="text-caption text-neutral-400">Players nearby</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-display-xs font-bold text-neutral-900">{totalMatches}</p>
          <p className="text-caption text-neutral-400">Active matches</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-display-xs font-bold text-neutral-900">5</p>
          <p className="text-caption text-neutral-400">Sports live</p>
        </Card>
      </div>

      {/* Sport Filters */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto scrollbar-hide">
        {filterOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => {
              setActiveFilter(option.id);
              setSelectedZone(null);
            }}
            className={cn(
              "px-3 py-1.5 rounded-full text-caption font-medium whitespace-nowrap border transition-all",
              activeFilter === option.id
                ? "bg-neutral-900 text-white border-neutral-900"
                : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-300"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Radar Visualization */}
      <Card padding="lg" className="overflow-hidden mb-4">
        <div className="relative flex items-center justify-center">
          <motion.div
            animate={{ scale: pulse }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="relative w-64 h-64 md:w-72 md:h-72"
          >
            {/* Range Rings */}
            <div className="absolute inset-0 rounded-full border border-neutral-200" />
            <div className="absolute inset-6 rounded-full border border-neutral-100" />
            <div className="absolute inset-12 rounded-full border border-neutral-100" />
            <div className="absolute inset-[4.5rem] rounded-full border border-neutral-50" />

            {/* Range Labels */}
            <span className="absolute top-1 left-1/2 -translate-x-1/2 text-caption text-neutral-300">5 km</span>
            <span className="absolute top-7 left-1/2 -translate-x-1/2 text-caption text-neutral-300">3 km</span>
            <span className="absolute top-[3.2rem] left-1/2 -translate-x-1/2 text-caption text-neutral-300">1 km</span>

            {/* Center - You */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-4 h-4 bg-electric-blue rounded-full shadow-glow-blue"
              />
              <span className="absolute top-5 left-1/2 -translate-x-1/2 text-caption text-electric-blue font-semibold whitespace-nowrap">
                You
              </span>
            </div>

            {/* Activity Zones */}
            {filteredZones.map((zone, index) => {
              const radian = (zone.angle * Math.PI) / 180;
              const x = 50 + zone.distance * Math.cos(radian) * 0.45;
              const y = 50 + zone.distance * Math.sin(radian) * 0.45;
              const isSelected = selectedZone?.id === zone.id;

              return (
                <motion.button
                  key={zone.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.08, type: "spring", stiffness: 300 }}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => setSelectedZone(isSelected ? null : zone)}
                  className={cn(
                    "absolute z-10 flex items-center justify-center w-8 h-8 rounded-full text-white shadow-md transition-all cursor-pointer",
                    sportBgMap[zone.sport],
                    isSelected && `ring-4 ${intensityRing[zone.intensity]} ring-offset-2`
                  )}
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  aria-label={`${zone.label}: ${zone.players} players`}
                >
                  {sportIconMap[zone.sport]}
                  {zone.intensity === "high" && (
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-coral rounded-full border border-white animate-pulse-soft" />
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </Card>

      {/* Selected Zone Detail */}
      {selectedZone && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <Card padding="md" className="border-neutral-300">
            <div className="flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white", sportBgMap[selectedZone.sport])}>
                {sportIconMap[selectedZone.sport]}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-body-sm font-semibold text-neutral-900">
                  {selectedZone.label}
                </h3>
                <p className="text-body-xs text-neutral-500">{selectedZone.status}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-body-sm font-bold text-neutral-900">
                  {selectedZone.players} players
                </p>
                <p className="text-caption text-neutral-400">
                  {selectedZone.matches} matches
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Activity List */}
      <div className="space-y-2">
        {filteredZones.map((zone) => (
          <motion.button
            key={zone.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedZone(selectedZone?.id === zone.id ? null : zone)}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
              selectedZone?.id === zone.id
                ? "border-neutral-300 bg-white shadow-card"
                : "border-transparent hover:bg-white"
            )}
          >
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0", sportBgMap[zone.sport])}>
              {sportIconMap[zone.sport]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-body-xs font-semibold text-neutral-900">
                {zone.label}
              </p>
              <p className="text-caption text-neutral-400 truncate">
                {zone.status}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="flex items-center gap-1 text-caption text-neutral-500">
                <UsersIcon size={12} />
                {zone.players}
              </span>
              <span
                className={cn(
                  "w-2 h-2 rounded-full",
                  zone.intensity === "high"
                    ? "bg-coral"
                    : zone.intensity === "medium"
                    ? "bg-amber"
                    : "bg-emerald"
                )}
              />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
