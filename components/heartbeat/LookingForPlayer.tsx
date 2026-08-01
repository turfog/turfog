"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { SPORTS, SKILL_LEVELS } from "@/lib/constants";
import type { SportId } from "@/types";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import {
  UsersIcon,
  MapPinIcon,
  ZapIcon,
  FootballIcon,
  CricketIcon,
  PickleballIcon,
  PadelIcon,
  BadmintonIcon,
} from "@/components/SvgIcons";

const sportIconMap: Record<SportId, React.ReactNode> = {
  football: <FootballIcon size={18} />,
  "box-cricket": <CricketIcon size={18} />,
  pickleball: <PickleballIcon size={18} />,
  padel: <PadelIcon size={18} />,
  badminton: <BadmintonIcon size={18} />,
};

export default function LookingForPlayer() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSport, setSelectedSport] = useState<SportId | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [playersNeeded, setPlayersNeeded] = useState(1);
  const [note, setNote] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!selectedSport || !selectedSkill) return;
    setIsSearching(true);
  };

  if (isSearching) {
    return (
      <Card className="border-sunset-orange/30 bg-gradient-to-br from-sunset-orange/5 to-white overflow-hidden">
        <div className="text-center py-4">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="inline-flex items-center justify-center w-14 h-14 bg-sunset-orange/10 rounded-2xl mb-3"
          >
            <UsersIcon size={28} className="text-sunset-orange" />
          </motion.div>
          <h3 className="text-body-md font-semibold text-neutral-900 mb-1">
            Searching for players
          </h3>
          <p className="text-body-xs text-neutral-500 mb-3">
            Finding {playersNeeded} player{playersNeeded > 1 ? "s" : ""} near you
          </p>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-sunset-orange/10 text-sunset-orange text-caption font-semibold rounded-full">
              <span className="w-1.5 h-1.5 bg-sunset-orange rounded-full animate-pulse-soft" />
              Searching
            </span>
            <span className="px-2.5 py-1 bg-neutral-100 text-neutral-600 text-caption font-medium rounded-full capitalize">
              {selectedSport}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsSearching(false);
              setIsExpanded(false);
              setSelectedSport(null);
              setSelectedSkill(null);
              setPlayersNeeded(1);
              setNote("");
            }}
          >
            Cancel search
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "transition-all duration-300 cursor-pointer group",
        isExpanded
          ? "border-sunset-orange/40 shadow-glow-orange"
          : "hover:border-sunset-orange/20"
      )}
      onClick={() => !isExpanded && setIsExpanded(true)}
    >
      {/* Collapsed Header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 bg-sunset-orange/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-sunset-orange/15 transition-colors">
          <UsersIcon size={22} className="text-sunset-orange" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-body-sm font-semibold text-neutral-900">
            Looking for a player
          </h3>
          <p className="text-body-xs text-neutral-500">
            Find players for your match
          </p>
        </div>
        <ZapIcon
          size={18}
          className={cn(
            "text-neutral-300 transition-colors",
            isExpanded ? "text-sunset-orange" : "group-hover:text-sunset-orange"
          )}
        />
      </div>

      {/* Expanded Form */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-4 mt-4 border-t border-neutral-100 space-y-4">
              {/* Sport Selection */}
              <div>
                <label className="text-body-xs font-medium text-neutral-700 mb-2 block">
                  Select sport
                </label>
                <div className="flex flex-wrap gap-2">
                  {SPORTS.map((sport) => (
                    <motion.button
                      key={sport.id}
                      whileTap={{ scale: 0.94 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSport(sport.id);
                      }}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-2 rounded-xl text-body-xs font-medium border transition-all",
                        selectedSport === sport.id
                          ? "bg-sunset-orange text-white border-sunset-orange"
                          : "bg-white text-neutral-600 border-neutral-200 hover:border-sunset-orange/40"
                      )}
                    >
                      {sportIconMap[sport.id]}
                      {sport.name}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Skill Level */}
              <div>
                <label className="text-body-xs font-medium text-neutral-700 mb-2 block">
                  Skill level needed
                </label>
                <div className="flex gap-2">
                  {SKILL_LEVELS.map((level) => (
                    <motion.button
                      key={level}
                      whileTap={{ scale: 0.94 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSkill(level);
                      }}
                      className={cn(
                        "flex-1 px-3 py-2 rounded-xl text-body-xs font-medium border capitalize transition-all",
                        selectedSkill === level
                          ? "bg-sunset-orange text-white border-sunset-orange"
                          : "bg-white text-neutral-600 border-neutral-200 hover:border-sunset-orange/40"
                      )}
                    >
                      {level}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Players Needed */}
              <div>
                <label className="text-body-xs font-medium text-neutral-700 mb-2 block">
                  Players needed
                </label>
                <div className="flex items-center gap-3">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPlayersNeeded(Math.max(1, playersNeeded - 1));
                    }}
                    className="w-9 h-9 rounded-xl border border-neutral-200 flex items-center justify-center text-neutral-600 hover:border-sunset-orange/40 transition-colors text-body-md font-bold"
                  >
                    -
                  </motion.button>
                  <span className="text-display-xs font-bold text-neutral-900 w-8 text-center">
                    {playersNeeded}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPlayersNeeded(Math.min(11, playersNeeded + 1));
                    }}
                    className="w-9 h-9 rounded-xl border border-neutral-200 flex items-center justify-center text-neutral-600 hover:border-sunset-orange/40 transition-colors text-body-md font-bold"
                  >
                    +
                  </motion.button>
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="text-body-xs font-medium text-neutral-700 mb-2 block">
                  Match details (optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="5v5 at Andheri sports complex. 6 PM. Bring white jerseys."
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-xs text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-sunset-orange focus:ring-2 focus:ring-sunset-orange/20 resize-none transition-all"
                />
              </div>

              {/* Location */}
              <div className="flex items-center gap-1.5 text-body-xs text-neutral-400">
                <MapPinIcon size={13} />
                <span>Andheri west, Mumbai</span>
              </div>

              {/* Search Button */}
              <Button
                variant="primary"
                fullWidth
                disabled={!selectedSport || !selectedSkill}
                onClick={handleSearch}
                className="bg-sunset-orange hover:bg-sunset-orange/90"
              >
                <UsersIcon size={16} />
                Find players now
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
