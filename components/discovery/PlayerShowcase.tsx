"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TrophyIcon, MapPinIcon, ZapIcon } from "@/components/SvgIcons";

interface ShowcasePlayer {
  name: string;
  username: string;
  sport: string;
  position: string;
  rating: number;
  photo: string;
  location: string;
  live: boolean;
}

const SHOWCASE_PLAYERS: ShowcasePlayer[] = [
  { name: "Rahul Sharma", username: "rahul_sharma", sport: "Football", position: "Striker", rating: 87, photo: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&q=80", location: "Andheri", live: true },
  { name: "Priya Patel", username: "priya_patel", sport: "Badminton", position: "Doubles", rating: 84, photo: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80", location: "Powai", live: true },
  { name: "Arjun Nair", username: "arjun_nair", sport: "Box Cricket", position: "All-rounder", rating: 89, photo: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80", location: "Bandra", live: false },
  { name: "Sneha Reddy", username: "sneha_reddy", sport: "Padel", position: "Right court", rating: 82, photo: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&q=80", location: "Juhu", live: true },
  { name: "Vikram Singh", username: "vikram_singh", sport: "Football", position: "Goalkeeper", rating: 85, photo: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&q=80", location: "Worli", live: false },
  { name: "Ananya Iyer", username: "ananya_iyer", sport: "Pickleball", position: "Singles", rating: 81, photo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80", location: "Dadar", live: true },
  { name: "Karan Mehta", username: "karan_mehta", sport: "Box Cricket", position: "Bowler", rating: 86, photo: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80", location: "Malad", live: false },
  { name: "Meera Nair", username: "meera_nair", sport: "Badminton", position: "Singles", rating: 83, photo: "https://images.unsplash.com/photo-1594882645126-14020914d58d?w=600&q=80", location: "Colaba", live: true },
];

export default function PlayerShowcase() {
  return (
    <section className="rounded-3xl overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 border border-neutral-800 p-5 md:p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <span className="w-10 h-10 rounded-xl bg-primary-green/15 border border-primary-green/30 flex items-center justify-center">
            <TrophyIcon size={20} className="text-primary-green" />
          </span>
          <div>
            <h2 className="text-display-xs font-display font-bold text-white">Top players near you</h2>
            <p className="text-caption text-white/50 mt-0.5">Rated by the community, ready to play</p>
          </div>
        </div>
        <Link href="/leaderboards" className="text-body-xs font-semibold text-primary-green hover:text-primary-green/80 transition-colors">
          View rankings
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
        {SHOWCASE_PLAYERS.map((p, i) => (
          <motion.div
            key={p.username}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            whileHover={{ y: -6 }}
            className="group relative flex-shrink-0 w-[190px] sm:w-[210px] aspect-[3/4] rounded-2xl overflow-hidden"
          >
            <img
              src={p.photo}
              alt={p.name}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

            {/* FIFA-style rating + position */}
            <div className="absolute top-3 left-3">
              <p className="text-display-xs font-display font-bold text-white leading-none">{p.rating}</p>
              <p className="text-caption text-white/70 uppercase tracking-wide mt-1">{p.position}</p>
            </div>

            {/* live indicator */}
            {p.live && (
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald/20 backdrop-blur-sm border border-emerald/40">
                <ZapIcon size={11} className="text-emerald" />
                <span className="text-caption text-emerald font-semibold">Live</span>
              </div>
            )}

            {/* bottom info */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-caption font-semibold text-primary-green uppercase tracking-wide">{p.sport}</p>
              <p className="text-body-sm font-display font-bold text-white truncate mt-0.5">{p.name}</p>
              <p className="text-caption text-white/60 flex items-center gap-1 mt-1">
                <MapPinIcon size={11} />
                {p.location}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}