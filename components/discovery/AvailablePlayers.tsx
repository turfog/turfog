"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn, timeAgo } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";
import { useDiscovery } from "@/context/DiscoveryContext";
import { useSocial } from "@/context/SocialContext";
import type { AvailablePlayer, SportId } from "@/types";
import {
  MapPinIcon,
  CheckCircleIcon,
  ZapIcon,
  UsersIcon,
  MessageIcon,
  FootballIcon,
  CricketIcon,
  PickleballIcon,
  PadelIcon,
  BadmintonIcon,
} from "@/components/SvgIcons";

const sportIcon: Record<SportId, React.ReactNode> = {
  football: <FootballIcon size={12} />,
  "box-cricket": <CricketIcon size={12} />,
  pickleball: <PickleballIcon size={12} />,
  padel: <PadelIcon size={12} />,
  badminton: <BadmintonIcon size={12} />,
};

const sportName: Record<SportId, string> = {
  football: "Football",
  "box-cricket": "Box cricket",
  pickleball: "Pickleball",
  padel: "Padel",
  badminton: "Badminton",
};

const sportText: Record<SportId, string> = {
  football: "text-primary-green",
  "box-cricket": "text-electric-blue",
  pickleball: "text-emerald",
  padel: "text-amber",
  badminton: "text-sunset-orange",
};

export default function AvailablePlayers({ variant }: { variant: "rail" | "scroller" }) {
  const { heartbeats, loading } = useDiscovery();
  const social = useSocial();

  const card = (p: AvailablePlayer) => {
    const following = !!p.userId && social.isFollowing(p.username);
    return (
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-card transition-all duration-200 hover:shadow-card-hover p-3.5 h-full flex flex-col">
        <div className="flex items-start gap-2.5">
          <Link href={`/${p.username}`} className="flex-shrink-0">
            <Avatar alt={p.name} src={p.avatar} size="sm" online />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <Link href={`/${p.username}`} className="text-body-xs font-semibold text-neutral-900 hover:text-electric-blue truncate">{p.name}</Link>
              {p.verified && <CheckCircleIcon size={13} className="text-electric-blue flex-shrink-0" />}
            </div>
            <Link href={`/${p.username}`} className="text-caption text-neutral-400 hover:text-electric-blue truncate block">@{p.username}</Link>
          </div>
          <span className="flex items-center gap-0.5 text-caption text-neutral-400 flex-shrink-0">
            <MapPinIcon size={11} />
            {p.distanceKm > 0 ? `${p.distanceKm} km` : "nearby"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-100 text-caption text-neutral-600 font-medium">
            <span className={cn("flex items-center", sportText[p.sport])}>{sportIcon[p.sport]}</span>
            {sportName[p.sport]}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-caption text-neutral-600 font-medium capitalize">{p.skill}</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald/10 text-caption text-emerald font-semibold">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald opacity-70" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald" />
            </span>
            Live now
          </span>
        </div>

        {p.note && <p className="text-body-xs text-neutral-600 mt-2 line-clamp-2">{p.note}</p>}

        <p className="flex items-center gap-1 text-caption text-neutral-400 mt-2">
          <MapPinIcon size={11} />
          {p.location} · {timeAgo(p.wentLiveAt)}
        </p>

        <div className="flex items-center gap-2 mt-3">
          {p.userId ? (
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => social.follow(p.userId as string, p.username)}
              className={cn(
                "flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-body-xs font-semibold transition-colors",
                following ? "bg-neutral-100 text-neutral-600 border border-neutral-200" : "bg-primary-green text-white hover:bg-primary-green/90"
              )}
            >
              {following ? <><CheckCircleIcon size={14} />Following</> : <><UsersIcon size={14} />Follow</>}
            </motion.button>
          ) : (
            <Link href={`/${p.username}`} className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-body-xs font-semibold bg-primary-green text-white hover:bg-primary-green/90 transition-colors">
              View profile
            </Link>
          )}
          {p.userId && (
            <Link href={`/messages?to=${p.userId}`} className="px-3 py-2 rounded-xl border border-neutral-200 text-neutral-500 text-body-xs font-medium hover:bg-neutral-50 inline-flex items-center gap-1 transition-colors">
              <MessageIcon size={14} />
              Message
            </Link>
          )}
        </div>
      </div>
    );
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ZapIcon size={16} className="text-emerald" />
          <h2 className="text-body-sm font-semibold text-neutral-900 font-display">Available now</h2>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-emerald/10 text-caption font-semibold text-emerald">{heartbeats.length} live</span>
      </div>
      {variant === "rail" && <p className="text-caption text-neutral-400 -mt-1 mb-3">Players ready to play near you</p>}

      {loading ? (
        <div className="text-center py-8 text-body-xs text-neutral-400">Loading live players...</div>
      ) : heartbeats.length === 0 ? (
        <div className="text-center py-8 text-body-xs text-neutral-400">No one is live right now. Be the first to go live.</div>
      ) : variant === "rail" ? (
        <div className="flex flex-col gap-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {heartbeats.map((p) => (
              <motion.div key={p.id} layout initial={{ opacity: 0, y: 8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, x: 40, scale: 0.96 }} transition={{ type: "spring", stiffness: 320, damping: 28 }}>
                {card(p)}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
          {heartbeats.map((p) => (
            <div key={p.id} className="w-[268px] flex-shrink-0">{card(p)}</div>
          ))}
        </div>
      )}
    </section>
  );
}