"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ZapIcon, RunIcon, UsersIcon, MapPinIcon } from "@/components/SvgIcons";

const stats = [
  { icon: RunIcon, value: "2,400+", label: "Active players" },
  { icon: UsersIcon, value: "180+", label: "Weekly matches" },
  { icon: MapPinIcon, value: "45+", label: "Venues covered" },
];

export default function LandingHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        {/* Placeholder image - replace with original Turfog photography */}
        <img
          src="https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1920&q=80"
          alt="Players competing in a football match on artificial turf during golden hour"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/70 via-neutral-900/60 to-neutral-900" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-primary-green rounded-2xl mb-8 shadow-glow-green"
        >
          <ZapIcon size={32} className="text-white" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-display-xl font-display font-bold text-white mb-4 leading-tight"
        >
          Never cancel
          <br />
          a match again
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-body-lg text-white/70 max-w-xl mx-auto mb-10"
        >
          Instantly connect with players who want to play and teams looking
          for players in your area. Football, box cricket, pickleball, padel,
          badminton.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link href="/auth/sign-up">
            <motion.span
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary-green text-white text-body-md font-semibold rounded-2xl shadow-glow-green hover:bg-primary-green/90 transition-colors"
            >
              <RunIcon size={20} />
              Start playing
            </motion.span>
          </Link>
          <Link href="/sports/football">
            <motion.span
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md text-white text-body-md font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transition-colors"
            >
              Explore sports
            </motion.span>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex items-center justify-center gap-10"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon size={20} className="text-primary-green mx-auto mb-2" />
              <p className="text-display-xs font-bold text-white">
                {stat.value}
              </p>
              <p className="text-caption text-white/50">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-white/50 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
