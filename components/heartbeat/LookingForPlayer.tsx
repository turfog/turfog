"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { SPORTS, SKILL_LEVELS, HEARTBEAT_DURATION_MINUTES } from "@/lib/constants";
import type { Player } from "@/types/database";
import type { SportId, SkillLevelId } from "@/types/heartbeat";
import { useHeartbeat } from "@/hooks/useHeartbeat";
import { useLocation } from "@/hooks/useLocation";
import {
  UsersIcon,
  MapPinIcon,
  ChevronRightIcon,
  FootballIcon,
  CricketIcon,
  BasketballIcon,
  BadmintonIcon,
  RunIcon,
  ClockIcon,
  PlusIcon,
  MinusIcon,
} from "@/components/SvgIcons";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

// ----- Types -----

interface LookingForPlayerProps {
  player: Player;
}

interface SportOption {
  id: SportId;
  name: string;
  icon: React.ReactNode;
}

// ----- Sport Options -----

const sportOptions: SportOption[] = [
  { id: "football", name: "Football", icon: <FootballIcon size={20} /> },
  { id: "cricket", name: "Cricket", icon: <CricketIcon size={20} /> },
  { id: "basketball", name: "Basketball", icon: <BasketballIcon size={20} /> },
  { id: "badminton", name: "Badminton", icon: <BadmintonIcon size={20} /> },
  { id: "tennis", name: "Tennis", icon: <RunIcon size={20} /> },
  { id: "volleyball", name: "Volleyball", icon: <RunIcon size={20} /> },
  { id: "table-tennis", name: "Table tennis", icon: <RunIcon size={20} /> },
  { id: "hockey", name: "Hockey", icon: <RunIcon size={20} /> },
];

// ----- Animation Variants -----

const contentVariants = {
  hidden: { opacity: 0, height: 0, overflow: "hidden" },
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.3,
      ease: "easeOut",
      staggerChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

// ----- Component -----

export default function LookingForPlayer({ player }: LookingForPlayerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSport, setSelectedSport] = useState<SportId>("football");
  const [skillLevel, setSkillLevel] = useState<SkillLevelId>("intermediate");
  const [playersNeeded, setPlayersNeeded] = useState(1);
  const [matchTime, setMatchTime] = useState("");
  const [venue, setVenue] = useState("");
  const [note, setNote] = useState("");

  const { activeHeartbeat, isSubmitting, submitHeartbeat, cancelHeartbeat } =
    useHeartbeat();
  const { location } = useLocation();

  const hasActiveHeartbeat = activeHeartbeat?.type === "looking-for-player";

  const handleSubmit = async () => {
    if (!selectedSport) return;

    await submitHeartbeat({
      type: "looking-for-player",
      sports: [selectedSport],
      skillLevel,
      playersNeeded,
      matchTime,
      venue,
      note,
    });

    setIsExpanded(false);
  };

  const handleCancel = () => {
    cancelHeartbeat();
    setNote("");
    setVenue("");
    setMatchTime("");
  };

  // Active heartbeat state
  if (hasActiveHeartbeat) {
    return (
      <motion.div
        layout
        className="bg-sunset-orange text-white rounded-2xl shadow-lg shadow-sunset-orange/20 overflow-hidden"
      >
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"
            >
              <UsersIcon size={22} />
            </motion.div>
            <div className="flex-1">
              <p className="text-body-sm font-semibold">Looking for players</p>
              <p className="text-body-xs text-white/70">
                Available players nearby will see this
              </p>
            </div>
            <Badge variant="warning" size="sm" animated>
              Active
            </Badge>
          </div>

          {/* Details */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            <span className="px-2.5 py-1 bg-white/15 rounded-lg text-body-xs font-medium">
              {sportOptions.find((s) => s.id === activeHeartbeat.sport)?.name}
            </span>
            <span className="px-2.5 py-1 bg-white/15 rounded-lg text-body-xs font-medium">
              Need {activeHeartbeat.playersNeeded} player
              {activeHeartbeat.playersNeeded > 1 ? "s" : ""}
            </span>
          </div>

          {/* Location & Timer */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-body-xs text-white/70">
              <MapPinIcon size={12} />
              {location?.city || "Nearby"}
            </span>
            <span className="text-body-xs text-white/70">
              Expires in {HEARTBEAT_DURATION_MINUTES} min
            </span>
          </div>

          {/* Cancel Button */}
          <button
            onClick={handleCancel}
            className="mt-3 w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-body-xs font-medium transition-colors"
          >
            Cancel request
          </button>
        </div>

        <motion.div
          className="h-0.5 bg-white/30"
          animate={{ scaleX: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ transformOrigin: "left" }}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden"
    >
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center gap-3 hover:bg-neutral-50/50 transition-colors text-left"
      >
        <div className="w-10 h-10 bg-sunset-orange/10 rounded-xl flex items-center justify-center flex-shrink-0">
          <UsersIcon size={22} className="text-sunset-orange" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-body-sm font-semibold text-neutral-900">
            Looking for a player
          </h3>
          <p className="text-body-xs text-neutral-500">
            Find available players nearby for your team
          </p>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-neutral-400"
        >
          <ChevronRightIcon size={20} />
        </motion.div>
      </button>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="px-4 pb-4 space-y-4">
              {/* Sport Selection */}
              <motion.div variants={itemVariants}>
                <label className="block text-body-xs font-medium text-neutral-600 mb-2">
                  Select sport
                </label>
                <div className="flex flex-wrap gap-2">
                  {sportOptions.map((sport) => (
                    <motion.button
                      key={sport.id}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => setSelectedSport(sport.id)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-2 rounded-lg text-body-xs font-medium transition-all duration-200 border",
                        selectedSport === sport.id
                          ? "bg-sunset-orange text-white border-sunset-orange shadow-sm"
                          : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-100"
                      )}
                    >
                      <span
                        className={cn(
                          selectedSport === sport.id
                            ? "text-white"
                            : "text-neutral-400"
                        )}
                      >
                        {sport.icon}
                      </span>
                      {sport.name}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Skill Level */}
              <motion.div variants={itemVariants}>
                <label className="block text-body-xs font-medium text-neutral-600 mb-2">
                  Preferred skill level
                </label>
                <div className="flex gap-2">
                  {SKILL_LEVELS.map((level) => (
                    <motion.button
                      key={level.id}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => setSkillLevel(level.id)}
                      className={cn(
                        "flex-1 py-2 rounded-lg text-body-xs font-medium transition-all duration-200 border",
                        skillLevel === level.id
                          ? "bg-sunset-orange text-white border-sunset-orange"
                          : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-neutral-300"
                      )}
                    >
                      {level.name}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Players Needed Counter */}
              <motion.div variants={itemVariants}>
                <label className="block text-body-xs font-medium text-neutral-600 mb-2">
                  Players needed
                </label>
                <div className="flex items-center gap-3">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() =>
                      setPlayersNeeded((prev) => Math.max(1, prev - 1))
                    }
                    className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors"
                  >
                    <MinusIcon size={18} />
                  </motion.button>
                  <span className="text-body-lg font-semibold text-neutral-900 w-8 text-center">
                    {playersNeeded}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() =>
                      setPlayersNeeded((prev) => Math.min(10, prev + 1))
                    }
                    className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors"
                  >
                    <PlusIcon size={18} />
                  </motion.button>
                  <span className="text-body-xs text-neutral-400">
                    max 10
                  </span>
                </div>
              </motion.div>

              {/* Match Time */}
              <motion.div variants={itemVariants}>
                <label className="block text-body-xs font-medium text-neutral-600 mb-2">
                  Match time (optional)
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    value={matchTime}
                    onChange={(e) => setMatchTime(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg pl-10 pr-3 py-2.5 text-body-sm text-neutral-900 focus:outline-none focus:border-sunset-orange focus:ring-2 focus:ring-sunset-orange/10 transition-all"
                  />
                  <ClockIcon
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                  />
                </div>
              </motion.div>

              {/* Venue */}
              <motion.div variants={itemVariants}>
                <label className="block text-body-xs font-medium text-neutral-600 mb-2">
                  Venue (optional)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="e.g., Andheri sports complex"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg pl-10 pr-3 py-2.5 text-body-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-sunset-orange focus:ring-2 focus:ring-sunset-orange/10 transition-all"
                  />
                  <MapPinIcon
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                  />
                </div>
              </motion.div>

              {/* Note */}
              <motion.div variants={itemVariants}>
                <label className="block text-body-xs font-medium text-neutral-600 mb-2">
                  Add a note (optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g., Need a goalkeeper for 7v7 match..."
                  rows={2}
                  maxLength={200}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-body-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-sunset-orange focus:ring-2 focus:ring-sunset-orange/10 transition-all resize-none"
                />
              </motion.div>

              {/* Info */}
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-2 text-body-xs text-neutral-500"
              >
                <MapPinIcon size={14} />
                Searching in {location?.city || "your area"} &middot; Visible for{" "}
                {HEARTBEAT_DURATION_MINUTES} minutes
              </motion.div>

              {/* Submit */}
              <motion.div variants={itemVariants}>
                <Button
                  onClick={handleSubmit}
                  theme="orange"
                  size="lg"
                  fullWidth
                  isLoading={isSubmitting}
                  leftIcon={<UsersIcon size={20} />}
                >
                  Find players now
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ----- Helper Icons -----

function ClockIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function MinusIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}