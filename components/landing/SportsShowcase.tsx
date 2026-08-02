"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SPORTS } from "@/lib/constants";
import type { SportId } from "@/types";
import {
  FootballIcon,
  CricketIcon,
  PickleballIcon,
  PadelIcon,
  BadmintonIcon,
  UsersIcon,
  CalendarIcon,
  MapPinIcon,
  ChevronRightIcon,
} from "@/components/SvgIcons";

const sportIconMap: Record<SportId, React.ReactNode> = {
  football: <FootballIcon size={24} />,
  "box-cricket": <CricketIcon size={24} />,
  pickleball: <PickleballIcon size={24} />,
  padel: <PadelIcon size={24} />,
  badminton: <BadmintonIcon size={24} />,
};

const sportImages: Record<SportId, string> = {
  football:
    "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&q=80",
  "box-cricket":
    "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80",
  pickleball:
    "https://images.unsplash.com/photo-1554068696-82a4e2d1a5a4?w=800&q=80",
  padel:
    "https://images.unsplash.com/photo-1612534847738-b3af3b1f283d?w=800&q=80",
  badminton:
    "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80",
};

const sportStats: Record<
  SportId,
  { players: number; matches: number; venues: number }
> = {
  football: { players: 860, matches: 42, venues: 18 },
  "box-cricket": { players: 640, matches: 35, venues: 14 },
  pickleball: { players: 320, matches: 20, venues: 8 },
  padel: { players: 280, matches: 16, venues: 6 },
  badminton: { players: 540, matches: 28, venues: 12 },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 24 },
  },
};

export default function SportsShowcase() {
  return (
    <section className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-primary-green/10 text-primary-green text-body-xs font-semibold rounded-full mb-4">
            Launch sports
          </span>
          <h2 className="text-display-lg font-display font-bold text-white mb-3">
            Choose your sport
          </h2>
          <p className="text-body-md text-white/50 max-w-lg mx-auto">
            Five sports. One platform. Find players, join matches, and build
            your local community.
          </p>
        </motion.div>

        {/* Sport Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {SPORTS.map((sport, index) => {
            const stats = sportStats[sport.id];
            return (
              <motion.div
                key={sport.id}
                variants={cardVariants}
                className={cn(
                  index === 0 && "md:col-span-2 lg:col-span-1"
                )}
              >
                <Link href={`/sports/${sport.id}`}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="group relative h-[380px] rounded-3xl overflow-hidden cursor-pointer"
                  >
                    {/* Background Image */}
                    {/* Placeholder - replace with original Turfog photography */}
                    <img
                      src={sportImages[sport.id]}
                      alt={`${sport.name} players in action`}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />

                    {/* Glass Morphism Content */}
                    <div className="absolute inset-x-4 bottom-4">
                      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/15 p-5">
                        {/* Icon + Name */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-11 h-11 bg-white/15 rounded-xl flex items-center justify-center text-white">
                            {sportIconMap[sport.id]}
                          </div>
                          <div>
                            <h3 className="text-body-md font-bold text-white font-display">
                              {sport.name}
                            </h3>
                            <p className="text-caption text-white/60">
                              {sport.tagline}
                            </p>
                          </div>
                        </div>

                        {/* Stats Row */}
                        <div className="flex items-center gap-4 mb-4">
                          <span className="flex items-center gap-1.5 text-caption text-white/70">
                            <UsersIcon size={13} />
                            {stats.players}
                          </span>
                          <span className="flex items-center gap-1.5 text-caption text-white/70">
                            <CalendarIcon size={13} />
                            {stats.matches} matches
                          </span>
                          <span className="flex items-center gap-1.5 text-caption text-white/70">
                            <MapPinIcon size={13} />
                            {stats.venues}
                          </span>
                        </div>

                        {/* Join Button */}
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-green text-white text-body-xs font-semibold rounded-xl group-hover:bg-primary-green/90 transition-colors">
                            Join now
                            <ChevronRightIcon size={14} />
                          </span>
                          <span className="text-caption text-white/40">
                            {sport.formats.join(" / ")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
