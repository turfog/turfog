"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SKILL_LEVELS, ROUTES } from "@/lib/constants";
import type { SportId, SkillLevelId } from "@/types/heartbeat";
import {
  ChevronLeftIcon,
  FootballIcon,
  CricketIcon,
  BasketballIcon,
  BadmintonIcon,
  RunIcon,
  MapPinIcon,
  ClockIcon,
  PlusIcon,
  MinusIcon,
} from "@/components/SvgIcons";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const sportOptions = [
  { id: "football" as SportId, name: "Football", icon: <FootballIcon size={20} /> },
  { id: "cricket" as SportId, name: "Cricket", icon: <CricketIcon size={20} /> },
  { id: "basketball" as SportId, name: "Basketball", icon: <BasketballIcon size={20} /> },
  { id: "badminton" as SportId, name: "Badminton", icon: <BadmintonIcon size={20} /> },
  { id: "tennis" as SportId, name: "Tennis", icon: <RunIcon size={20} /> },
  { id: "volleyball" as SportId, name: "Volleyball", icon: <RunIcon size={20} /> },
  { id: "table-tennis" as SportId, name: "Table tennis", icon: <RunIcon size={20} /> },
  { id: "hockey" as SportId, name: "Hockey", icon: <RunIcon size={20} /> },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
};

export default function CreateMatchClient() {
  const router = useRouter();
  const [sport, setSport] = useState<SportId>("football");
  const [skillLevel, setSkillLevel] = useState<SkillLevelId>("intermediate");
  const [totalPlayers, setTotalPlayers] = useState(10);
  const [venue, setVenue] = useState("");
  const [matchTime, setMatchTime] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!venue.trim()) newErrors.venue = "Venue is required";
    if (!matchTime) newErrors.matchTime = "Match time is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (description.length < 10) newErrors.description = "Description must be at least 10 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      router.push(ROUTES.DASHBOARD);
    }, 1500);
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-2xl mx-auto">
      {/* Header */}
      <motion.div variants={itemVariants} className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-neutral-200 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-body-sm text-neutral-600 hover:text-neutral-900"
          >
            <ChevronLeftIcon size={18} />
            Back
          </button>
          <h1 className="text-body-lg font-semibold text-neutral-900">Create match</h1>
          <div className="w-16" />
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="p-4 space-y-5">
        {/* Sport Selection */}
        <motion.div variants={itemVariants}>
          <label className="block text-body-sm font-medium text-neutral-700 mb-2">Sport</label>
          <div className="grid grid-cols-4 gap-2">
            {sportOptions.map((option) => (
              <motion.button
                key={option.id}
                whileTap={{ scale: 0.94 }}
                type="button"
                onClick={() => setSport(option.id)}
                className={cn(
                  "flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all",
                  sport === option.id
                    ? "bg-primary-green text-white border-primary-green shadow-sm"
                    : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-neutral-300"
                )}
              >
                {option.icon}
                <span className="text-caption font-medium">{option.name}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Skill Level */}
        <motion.div variants={itemVariants}>
          <label className="block text-body-sm font-medium text-neutral-700 mb-2">Skill level</label>
          <div className="flex gap-2">
            {SKILL_LEVELS.map((level) => (
              <motion.button
                key={level.id}
                whileTap={{ scale: 0.94 }}
                type="button"
                onClick={() => setSkillLevel(level.id)}
                className={cn(
                  "flex-1 py-2.5 rounded-lg text-body-xs font-medium border transition-all",
                  skillLevel === level.id
                    ? "bg-primary-green text-white border-primary-green"
                    : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-neutral-300"
                )}
              >
                {level.name}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Total Players */}
        <motion.div variants={itemVariants}>
          <label className="block text-body-sm font-medium text-neutral-700 mb-2">Total players needed</label>
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={() => setTotalPlayers((prev) => Math.max(2, prev - 1))}
              className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center hover:bg-neutral-200"
            >
              <MinusIcon size={18} />
            </motion.button>
            <span className="text-body-lg font-semibold text-neutral-900 w-8 text-center">{totalPlayers}</span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={() => setTotalPlayers((prev) => Math.min(22, prev + 1))}
              className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center hover:bg-neutral-200"
            >
              <PlusIcon size={18} />
            </motion.button>
            <span className="text-body-xs text-neutral-400">max 22</span>
          </div>
        </motion.div>

        {/* Venue */}
        <motion.div variants={itemVariants}>
          <Input
            label="Venue"
            type="text"
            placeholder="e.g., Andheri sports complex"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            error={errors.venue}
            leftIcon={<MapPinIcon size={18} />}
            required
          />
        </motion.div>

        {/* Match Time */}
        <motion.div variants={itemVariants}>
          <label className="block text-body-sm font-medium text-neutral-700 mb-1.5">Match time</label>
          <div className="relative">
            <input
              type="datetime-local"
              value={matchTime}
              onChange={(e) => setMatchTime(e.target.value)}
              className={cn(
                "w-full bg-white border rounded-lg pl-10 pr-3 py-2.5 text-body-sm focus:outline-none focus:ring-2 transition-all",
                errors.matchTime
                  ? "border-coral focus:ring-coral/20"
                  : "border-neutral-300 focus:border-primary-green focus:ring-primary-green/20"
              )}
            />
            <ClockIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          </div>
          {errors.matchTime && <p className="text-body-xs text-coral mt-1">{errors.matchTime}</p>}
        </motion.div>

        {/* Description */}
        <motion.div variants={itemVariants}>
          <label className="block text-body-sm font-medium text-neutral-700 mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your match, rules, what to bring..."
            rows={4}
            maxLength={500}
            className={cn(
              "w-full bg-white border rounded-lg px-3 py-2.5 text-body-sm focus:outline-none focus:ring-2 transition-all resize-none",
              errors.description
                ? "border-coral focus:ring-coral/20"
                : "border-neutral-300 focus:border-primary-green focus:ring-primary-green/20"
            )}
          />
          <div className="flex items-center justify-between mt-1">
            {errors.description ? (
              <p className="text-body-xs text-coral">{errors.description}</p>
            ) : (
              <p className="text-body-xs text-neutral-400 flex items-center gap-1">
                <InfoIcon size={12} />
                Include details like equipment requirements
              </p>
            )}
            <p className="text-body-xs text-neutral-400">{description.length}/500</p>
          </div>
        </motion.div>

        {/* Info Box */}
        <motion.div variants={itemVariants} className="p-3 bg-electric-blue/5 rounded-xl border border-electric-blue/10">
          <p className="text-body-xs text-neutral-600">
            Your match will be visible to nearby players. You can edit details until the match starts.
          </p>
        </motion.div>

        {/* Submit */}
        <motion.div variants={itemVariants} className="pt-2">
          <Button type="submit" theme="green" size="lg" fullWidth isLoading={isSubmitting}>
            Create match
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}

function InfoIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}