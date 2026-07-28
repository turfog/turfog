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
  RunIcon,
  MapPinIcon,
  XIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  FootballIcon,
  CricketIcon,
  BasketballIcon,
  BadmintonIcon,
} from "@/components/SvgIcons";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";

// ----- Types -----

interface IWantToPlayProps {
  player: Player;
}

interface SportOption {
  id: SportId;
  name: string;
  icon: React.ReactNode;
}

// ----- Sport Options with Icons -----

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

const cardVariants = {
  collapsed: {
    height: "auto",
    transition: { duration: 0.3, ease: "easeInOut" },
  },
  expanded: {
    height: "auto",
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

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

export default function IWantToPlay({ player }: IWantToPlayProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSports, setSelectedSports] = useState<SportId[]>([]);
  const [skillLevel, setSkillLevel] = useState<SkillLevelId>("intermediate");
  const [note, setNote] = useState("");

  const { activeHeartbeat, isSubmitting, submitHeartbeat, cancelHeartbeat } =
    useHeartbeat();
  const { location } = useLocation();

  const hasActiveHeartbeat = activeHeartbeat?.type === "i-want-to-play";

  const toggleSport = (sportId: SportId) => {
    setSelectedSports((prev) =>
      prev.includes(sportId)
        ? prev.filter((id) => id !== sportId)
        : [...prev, sportId]
    );
  };

  const handleSubmit = async () => {
    if (selectedSports.length === 0) return;

    await submitHeartbeat({
      type: "i-want-to-play",
      sports: selectedSports,
      skillLevel,
      note,
    });

    setIsExpanded(false);
  };

  const handleCancel = () => {
    cancelHeartbeat();
    setSelectedSports([]);
    setNote("");
  };

  // Active heartbeat state
  if (hasActiveHeartbeat) {
    return (
      <motion.div
        layout
        className="bg-electric-blue text-white rounded-2xl shadow-lg shadow-electric-blue/20 overflow-hidden"
      >
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"
            >
              <RunIcon size={22} />
            </motion.div>
            <div className="flex-1">
              <p className="text-body-sm font-semibold">You are live now</p>
              <p className="text-body-xs text-white/70">
                Captains nearby can see you
              </p>
            </div>
            <Badge variant="success" size="sm" animated>
              Active
            </Badge>
          </div>

          {/* Sports Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {activeHeartbeat.sports.map((sportId) => (
              <span
                key={sportId}
                className="px-2.5 py-1 bg-white/15 rounded-lg text-body-xs font-medium"
              >
                {sportOptions.find((s) => s.id === sportId)?.name || sportId}
              </span>
            ))}
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
            End session
          </button>
        </div>

        {/* Pulse Animation */}
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
        <div className="w-10 h-10 bg-electric-blue/10 rounded-xl flex items-center justify-center flex-shrink-0">
          <RunIcon size={22} className="text-electric-blue" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-body-sm font-semibold text-neutral-900">
            I want to play
          </h3>
          <p className="text-body-xs text-neutral-500">
            Go live so nearby captains can discover you
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
                  Select sports you want to play
                </label>
                <div className="flex flex-wrap gap-2">
                  {sportOptions.map((sport) => {
                    const isSelected = selectedSports.includes(sport.id);
                    return (
                      <motion.button
                        key={sport.id}
                        whileTap={{ scale: 0.94 }}
                        onClick={() => toggleSport(sport.id)}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-2 rounded-lg text-body-xs font-medium transition-all duration-200 border",
                          isSelected
                            ? "bg-electric-blue text-white border-electric-blue shadow-sm"
                            : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-100"
                        )}
                      >
                        <span
                          className={cn(
                            isSelected ? "text-white" : "text-neutral-400"
                          )}
                        >
                          {sport.icon}
                        </span>
                        {sport.name}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>

              {/* Skill Level */}
              <motion.div variants={itemVariants}>
                <label className="block text-body-xs font-medium text-neutral-600 mb-2">
                  Your skill level
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
                          ? "bg-electric-blue text-white border-electric-blue"
                          : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-neutral-300"
                      )}
                    >
                      {level.name}
                    </motion.button>
                  ))}
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
                  placeholder="e.g., Available after 6 PM, prefer turf ground..."
                  rows={2}
                  maxLength={200}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-body-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/10 transition-all resize-none"
                />
              </motion.div>

              {/* Location */}
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-2 text-body-xs text-neutral-500"
              >
                <MapPinIcon size={14} />
                Going live in {location?.city || "your area"} &middot; Visible
                for {HEARTBEAT_DURATION_MINUTES} minutes
              </motion.div>

              {/* Submit */}
              <motion.div variants={itemVariants}>
                <Button
                  onClick={handleSubmit}
                  theme="blue"
                  size="lg"
                  fullWidth
                  isLoading={isSubmitting}
                  disabled={selectedSports.length === 0}
                  leftIcon={<RunIcon size={20} />}
                >
                  Go live now
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}