"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import SignInForm from "@/components/auth/SignInForm";
import {
  ZapIcon,
  FootballIcon,
  UsersIcon,
  ShieldIcon,
  ClockIcon,
} from "@/components/SvgIcons";

export default function LandingAuth() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white overflow-x-hidden">
      {/* ---------- Left: brand + tagline + collage ---------- */}
      <div className="relative flex-1 flex flex-col px-6 sm:px-10 lg:px-16 py-8 lg:py-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 self-start">
          <span className="w-10 h-10 bg-primary-green rounded-xl flex items-center justify-center shadow-glow-green">
            <ZapIcon size={22} className="text-white" />
          </span>
          <span className="text-body-md font-bold text-neutral-900 font-display">
            Turfog
          </span>
        </Link>

        {/* Center content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center lg:items-start lg:text-left max-w-xl mx-auto lg:mx-0 w-full py-10 lg:py-0">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-display-md lg:text-display-xl font-display font-bold text-neutral-900 leading-[1.05] mb-4"
          >
            Never cancel
            <br />
            a match <span className="text-primary-green">again</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-body-md text-neutral-500 max-w-md mb-10"
          >
            Find players, join matches, and build your local sports community,
            wherever you are.
          </motion.p>

          {/* Sports collage (desktop only) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block relative w-full max-w-[460px] h-[400px] mx-auto lg:mx-0"
          >
            {/* Placeholder images - replace with original Turfog photography */}
            <div className="absolute left-2 top-2 w-[250px] h-[330px] rounded-3xl overflow-hidden shadow-xl ring-1 ring-black/5 -rotate-3">
              <img
                src="https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600&q=80"
                alt="Football players competing on artificial turf during golden hour"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute right-0 top-12 w-[190px] h-[230px] rounded-3xl overflow-hidden shadow-xl ring-1 ring-black/5 rotate-6">
              <img
                src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500&q=80"
                alt="Badminton players mid-rally on a modern indoor court"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating chip: live match */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute right-6 top-0 flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-neutral-100"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald opacity-70" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald" />
              </span>
              <span className="text-caption font-semibold text-neutral-800">
                Live match
              </span>
              <span className="flex items-center gap-1 text-caption text-neutral-400">
                <ClockIcon size={12} />
                6:00 PM
              </span>
            </motion.div>

            {/* Floating chip: trust */}
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
              className="absolute left-16 top-0 flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-neutral-100"
            >
              <ShieldIcon size={13} className="text-amber" />
              <span className="text-caption font-semibold text-neutral-800">
                4.9 trust
              </span>
            </motion.div>

            {/* Floating chip: players nearby */}
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
              className="absolute left-0 bottom-6 flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-neutral-100"
            >
              <span className="w-6 h-6 bg-electric-blue/10 rounded-lg flex items-center justify-center text-electric-blue">
                <UsersIcon size={14} />
              </span>
              <div className="text-left">
                <p className="text-caption font-semibold text-neutral-800 leading-none">
                  12 players
                </p>
                <p className="text-caption text-neutral-400 leading-none mt-0.5">
                  nearby now
                </p>
              </div>
            </motion.div>

            {/* Floating chip: sport badge */}
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
              className="absolute right-2 bottom-16 w-11 h-11 bg-primary-green rounded-2xl flex items-center justify-center text-white shadow-lg"
            >
              <FootballIcon size={22} />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ---------- Right: embedded auth ---------- */}
      <div className="w-full lg:w-[440px] xl:w-[480px] border-t lg:border-t-0 lg:border-l border-neutral-200 flex items-center justify-center px-6 sm:px-10 py-12 lg:py-10 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-full flex justify-center"
        >
          <SignInForm />
        </motion.div>
      </div>
    </div>
  );
}