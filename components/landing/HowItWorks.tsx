"use client";

import React from "react";
import { motion } from "framer-motion";
import { RunIcon, UsersIcon, TrophyIcon } from "@/components/SvgIcons";

const steps = [
  {
    icon: RunIcon,
    step: "01",
    title: "Go live",
    description:
      "Tap 'I want to play' and choose your sport. Your heartbeat goes live to every player and captain nearby.",
    color: "text-electric-blue",
    bg: "bg-electric-blue/10",
  },
  {
    icon: UsersIcon,
    step: "02",
    title: "Get matched",
    description:
      "Captains looking for players discover you instantly. Or search for teams that need someone with your skill level.",
    color: "text-sunset-orange",
    bg: "bg-sunset-orange/10",
  },
  {
    icon: TrophyIcon,
    step: "03",
    title: "Play and grow",
    description:
      "Show up, play the match, earn XP, build your reliability score, and climb the local leaderboard.",
    color: "text-emerald",
    bg: "bg-emerald/10",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 24 },
  },
};

export default function HowItWorks() {
  return (
    <section className="py-24 px-6 bg-neutral-900">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-electric-blue/10 text-electric-blue text-body-xs font-semibold rounded-full mb-4">
            How it works
          </span>
          <h2 className="text-display-lg font-display font-bold text-white mb-3">
            Three steps to play
          </h2>
          <p className="text-body-md text-white/50 max-w-md mx-auto">
            No more group chats. No more last-minute cancellations. Just play.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {steps.map((item) => (
            <motion.div
              key={item.step}
              variants={itemVariants}
              className="relative text-center"
            >
              {/* Step Number */}
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-display-lg font-bold text-white/5 font-display">
                {item.step}
              </span>

              {/* Icon */}
              <div
                className={`inline-flex items-center justify-center w-16 h-16 ${item.bg} rounded-2xl mb-5`}
              >
                <item.icon size={28} className={item.color} />
              </div>

              <h3 className="text-body-lg font-bold text-white font-display mb-2">
                {item.title}
              </h3>
              <p className="text-body-sm text-white/50 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-16"
        >
          <a
            href="/auth/sign-up"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-green text-white text-body-md font-semibold rounded-2xl shadow-glow-green hover:bg-primary-green/90 transition-colors"
          >
            <RunIcon size={20} />
            Create your free account
          </a>
        </motion.div>
      </div>
    </section>
  );
}
