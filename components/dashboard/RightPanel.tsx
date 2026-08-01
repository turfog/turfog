"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import { MapPinIcon, ChevronRightIcon, ZapIcon } from "@/components/SvgIcons";

const liveOpportunities = [
  {
    id: "1",
    title: "Football 5v5 needs 2 more",
    location: "Andheri west",
    time: "Today, 6 PM",
    players: 8,
    needed: 2,
  },
  {
    id: "2",
    title: "Box cricket night match",
    location: "Bandra",
    time: "Tomorrow, 9 PM",
    players: 14,
    needed: 4,
  },
  {
    id: "3",
    title: "Badminton doubles partner",
    location: "Powai",
    time: "Sat, 7 AM",
    players: 3,
    needed: 1,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: 12 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
};

export default function RightPanel() {
  return (
    <aside className="hidden xl:flex flex-col h-screen sticky top-0 border-l border-neutral-200 bg-white px-4 py-5 overflow-y-auto">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center gap-2">
          <ZapIcon size={18} className="text-sunset-orange" />
          <h2 className="text-body-sm font-semibold text-neutral-900">
            Live opportunities
          </h2>
        </motion.div>

        {/* Opportunity Cards */}
        {liveOpportunities.map((opp) => (
          <motion.div key={opp.id} variants={itemVariants}>
            <Link href={`/matches/${opp.id}`}>
              <Card padding="sm" className="hover:border-sunset-orange/30 group">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-body-xs font-semibold text-neutral-900 mb-1 line-clamp-2">
                      {opp.title}
                    </h3>
                    <div className="flex items-center gap-1 text-caption text-neutral-400 mb-1.5">
                      <MapPinIcon size={11} />
                      {opp.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="warning" size="sm" animated={false}>
                        Need {opp.needed}
                      </Badge>
                      <span className="text-caption text-neutral-400">
                        {opp.time}
                      </span>
                    </div>
                  </div>
                  <ChevronRightIcon
                    size={16}
                    className="text-neutral-300 group-hover:text-neutral-500 transition-colors flex-shrink-0 mt-1"
                  />
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}

        {/* Suggested Players */}
        <motion.div variants={itemVariants} className="pt-2 border-t border-neutral-200">
          <h3 className="text-body-xs font-semibold text-neutral-900 mb-3">
            Players near you
          </h3>
          <div className="space-y-3">
            {[
              { name: "Rahul Sharma", sport: "Football", online: true },
              { name: "Priya Patel", sport: "Badminton", online: true },
              { name: "Arjun Nair", sport: "Box cricket", online: false },
            ].map((player) => (
              <div key={player.name} className="flex items-center gap-2.5">
                <Avatar alt={player.name} size="xs" online={player.online} />
                <div className="flex-1 min-w-0">
                  <p className="text-body-xs font-medium text-neutral-900 truncate">
                    {player.name}
                  </p>
                  <p className="text-caption text-neutral-400">{player.sport}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </aside>
  );
}
