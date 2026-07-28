"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SPORTS } from "@/lib/constants";
import type { SportsRadarData, HotZone } from "@/types/feed";
import type { SportId } from "@/types/heartbeat";
import {
  MapPinIcon,
  UsersIcon,
  RunIcon,
  FootballIcon,
  CricketIcon,
  BasketballIcon,
  BadmintonIcon,
} from "@/components/SvgIcons";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

// ----- Mock Data -----

const mockRadarData: SportsRadarData = {
  activeHeartbeats: 18,
  playersNearby: 42,
  matchesToday: 7,
  trendingSport: {
    sportId: "football",
    sportName: "Football",
    count: 12,
  },
  hotZones: [
    {
      id: "1",
      name: "Andheri sports complex",
      city: "Mumbai",
      latitude: 19.1136,
      longitude: 72.8697,
      activePlayers: 8,
      activeMatches: 3,
      intensity: "high",
    },
    {
      id: "2",
      name: "Shivaji park",
      city: "Mumbai",
      latitude: 19.0276,
      longitude: 72.8381,
      activePlayers: 6,
      activeMatches: 2,
      intensity: "high",
    },
    {
      id: "3",
      name: "Juhu beach ground",
      city: "Mumbai",
      latitude: 19.0886,
      longitude: 72.8264,
      activePlayers: 4,
      activeMatches: 1,
      intensity: "medium",
    },
    {
      id: "4",
      name: "Powai garden",
      city: "Mumbai",
      latitude: 19.1176,
      longitude: 72.906,
      activePlayers: 3,
      activeMatches: 1,
      intensity: "medium",
    },
  ],
};

// ----- Sport Icons Map -----

const sportIcons: Record<SportId, React.ReactNode> = {
  football: <FootballIcon size={18} />,
  cricket: <CricketIcon size={18} />,
  basketball: <BasketballIcon size={18} />,
  badminton: <BadmintonIcon size={18} />,
  tennis: <RunIcon size={18} />,
  volleyball: <RunIcon size={18} />,
  "table-tennis": <RunIcon size={18} />,
  hockey: <RunIcon size={18} />,
};

// ----- Animation Variants -----

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
};

// ----- Component -----

export default function SportsRadar() {
  const [radarData] = useState<SportsRadarData>(mockRadarData);
  const [selectedZone, setSelectedZone] = useState<HotZone | null>(null);
  const [pulseScale, setPulseScale] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Radar pulse animation
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setPulseScale((prev) => (prev === 1 ? 1.03 : 1));
    }, 2000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const intensityColors: Record<HotZone["intensity"], string> = {
    high: "bg-coral",
    medium: "bg-amber",
    low: "bg-emerald",
  };

  const intensityBorders: Record<HotZone["intensity"], string> = {
    high: "border-coral/30 bg-coral/5",
    medium: "border-amber/30 bg-amber/5",
    low: "border-emerald/30 bg-emerald/5",
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-body-lg font-semibold text-neutral-900">
          Sports radar
        </h2>
        <span className="flex items-center gap-1.5 text-body-xs text-emerald font-medium">
          <span className="w-1.5 h-1.5 bg-emerald rounded-full animate-pulse-soft" />
          Live
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatsCard
          icon={<RunIcon size={20} className="text-electric-blue" />}
          value={radarData.activeHeartbeats}
          label="Active heartbeats"
          color="electric-blue"
          delay={0}
        />
        <StatsCard
          icon={<UsersIcon size={20} className="text-emerald" />}
          value={radarData.playersNearby}
          label="Players nearby"
          color="emerald"
          delay={0.1}
        />
        <StatsCard
          icon={<FootballIcon size={20} className="text-sunset-orange" />}
          value={radarData.matchesToday}
          label="Matches today"
          color="sunset-orange"
          delay={0.2}
        />
        <StatsCard
          icon={sportIcons[radarData.trendingSport.sportId] || <RunIcon size={20} />}
          value={`#${radarData.trendingSport.count}`}
          label={`Trending: ${radarData.trendingSport.sportName}`}
          color="primary-green"
          delay={0.3}
        />
      </div>

      {/* Radar Visualization */}
      <Card padding="lg" className="overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-body-sm font-semibold text-neutral-900">
            Hot zones near you
          </h3>
          <span className="text-body-xs text-neutral-400">
            {radarData.hotZones.length} zones
          </span>
        </div>

        {/* Radar Circle */}
        <div className="relative flex items-center justify-center mb-6">
          <motion.div
            animate={{ scale: pulseScale }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="relative w-48 h-48 md:w-56 md:h-56"
          >
            {/* Outer Rings */}
            <div className="absolute inset-0 rounded-full border border-neutral-200" />
            <div className="absolute inset-4 rounded-full border border-neutral-100" />
            <div className="absolute inset-8 rounded-full border border-neutral-100" />
            <div className="absolute inset-12 rounded-full border border-neutral-50" />

            {/* Center Dot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-4 h-4 bg-electric-blue rounded-full shadow-glow-blue"
              />
            </div>

            {/* Hot Zone Dots */}
            {radarData.hotZones.map((zone, index) => {
              const angle = (index * 360) / radarData.hotZones.length;
              const distance = 55 + (zone.intensity === "high" ? 5 : zone.intensity === "medium" ? 15 : 25);
              const radian = (angle * Math.PI) / 180;
              const x = 50 + distance * Math.cos(radian);
              const y = 50 + distance * Math.sin(radian);

              return (
                <motion.button
                  key={zone.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                  whileHover={{ scale: 1.5 }}
                  onClick={() =>
                    setSelectedZone(selectedZone?.id === zone.id ? null : zone)
                  }
                  className={cn(
                    "absolute w-3 h-3 rounded-full cursor-pointer transition-shadow",
                    intensityColors[zone.intensity],
                    selectedZone?.id === zone.id && "ring-4 ring-offset-2 ring-electric-blue/30"
                  )}
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  aria-label={`${zone.name} - ${zone.intensity} activity`}
                />
              );
            })}
          </motion.div>
        </div>

        {/* Hot Zones List */}
        <div className="space-y-2">
          {radarData.hotZones.map((zone) => (
            <motion.div
              key={zone.id}
              variants={itemVariants}
              whileHover={{ x: 4 }}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer",
                selectedZone?.id === zone.id
                  ? intensityBorders[zone.intensity]
                  : "border-transparent hover:bg-neutral-50"
              )}
              onClick={() =>
                setSelectedZone(selectedZone?.id === zone.id ? null : zone)
              }
            >
              <div
                className={cn(
                  "w-2.5 h-2.5 rounded-full flex-shrink-0",
                  intensityColors[zone.intensity]
                )}
              />

              <div className="flex-1 min-w-0">
                <p className="text-body-sm font-medium text-neutral-900 truncate">
                  {zone.name}
                </p>
                <p className="text-body-xs text-neutral-500">{zone.city}</p>
              </div>

              <div className="flex items-center gap-3 text-body-xs text-neutral-500">
                <span className="flex items-center gap-1">
                  <UsersIcon size={12} />
                  {zone.activePlayers}
                </span>
                <span className="flex items-center gap-1">
                  <RunIcon size={12} />
                  {zone.activeMatches}
                </span>
              </div>

              <Badge
                variant={
                  zone.intensity === "high"
                    ? "danger"
                    : zone.intensity === "medium"
                    ? "warning"
                    : "success"
                }
                size="sm"
                animated={false}
              >
                {zone.intensity === "high"
                  ? "Hot"
                  : zone.intensity === "medium"
                  ? "Warm"
                  : "Active"}
              </Badge>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

// ----- Stats Card Sub-component -----

function StatsCard({
  icon,
  value,
  label,
  color,
  delay,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color: string;
  delay: number;
}) {
  const bgColorMap: Record<string, string> = {
    "electric-blue": "bg-electric-blue/10",
    emerald: "bg-emerald/10",
    "sunset-orange": "bg-sunset-orange/10",
    "primary-green": "bg-primary-green/10",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 300, damping: 25 }}
      className="bg-white rounded-xl border border-neutral-200 p-3"
    >
      <div
        className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center mb-2",
          bgColorMap[color] || "bg-neutral-100"
        )}
      >
        {icon}
      </div>
      <p className="text-display-xs font-bold text-neutral-900">{value}</p>
      <p className="text-body-xs text-neutral-500 mt-0.5">{label}</p>
    </motion.div>
  );
}