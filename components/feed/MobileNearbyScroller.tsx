"use client";

import { motion } from "framer-motion";
import Avatar from "@/components/ui/Avatar";
import { MapPinIcon } from "@/components/SvgIcons";

const people = [
  { name: "Rahul S.", dist: "0.8 km", on: true },
  { name: "Priya P.", dist: "1.2 km", on: true },
  { name: "Arjun N.", dist: "2.1 km", on: false },
  { name: "Sneha R.", dist: "3.4 km", on: true },
  { name: "Vikram S.", dist: "4.7 km", on: false },
];

export default function MobileNearbyScroller() {
  return (
    <div className="lg:hidden">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-body-sm font-semibold text-neutral-900">Players near you</h3>
        <span className="flex items-center gap-1 text-caption text-emerald font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse-soft" />
          Live
        </span>
      </div>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
        {people.map((p) => (
          <motion.div
            key={p.name}
            whileTap={{ scale: 0.97 }}
            className="flex-shrink-0 w-[116px] bg-white rounded-xl border border-neutral-200 p-3 text-center"
          >
            <div className="mx-auto w-11 h-11 mb-1.5">
              <Avatar alt={p.name} size="md" online={p.on} />
            </div>
            <p className="text-body-xs font-semibold text-neutral-900 truncate">{p.name}</p>
            <p className="flex items-center justify-center gap-0.5 text-caption text-neutral-400">
              <MapPinIcon size={10} />
              {p.dist}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}