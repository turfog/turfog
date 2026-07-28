"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/utils";
import { getLevelTitle } from "@/lib/utils";
import type { PublicPlayerProfile } from "@/types/player";
import { MapPinIcon, CheckCircleIcon, ClockIcon } from "@/components/SvgIcons";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";

interface ProfileHeroProps {
  profile: PublicPlayerProfile;
  isOwnProfile: boolean;
}

export default function ProfileHero({ profile, isOwnProfile }: ProfileHeroProps) {
  const levelTitle = getLevelTitle(profile.level);
  const joinedDate = timeAgo(profile.joinedAt);

  return (
    <div className="relative">
      {/* Cover Photo */}
      <div className="relative h-32 sm:h-48 bg-gradient-to-br from-primary-green/20 via-electric-blue/15 to-sunset-orange/10">
        {profile.coverPhoto ? (
          <img
            src={profile.coverPhoto}
            alt={`${profile.fullName} cover`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-green/30 to-electric-blue/20" />
        )}

        {/* Cover gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Profile Photo */}
      <div className="px-4 -mt-12 sm:-mt-16 relative z-10">
        <div className="flex items-end gap-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Avatar
              src={profile.profilePhoto}
              alt={profile.fullName}
              size="2xl"
              isOnline={profile.isOnline}
              className="ring-4 ring-white shadow-lg"
            />
          </motion.div>

          <div className="flex-1 pb-2">
            {/* Online Status Badge */}
            {profile.isOnline && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-1"
              >
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald/10 text-emerald rounded-full text-caption font-medium">
                  <span className="w-1.5 h-1.5 bg-emerald rounded-full animate-pulse-soft" />
                  Online now
                </span>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-4 pt-3 pb-2">
        {/* Name & Verification */}
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-display-xs font-bold text-neutral-900">
            {profile.fullName}
          </h1>
          {profile.verificationStatus === "verified" && (
            <span className="text-electric-blue" title="Verified player">
              <CheckCircleIcon size={20} />
            </span>
          )}
        </div>

        {/* Username */}
        <p className="text-body-sm text-neutral-500 mb-2">
          @{profile.username}
        </p>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-3 text-body-xs text-neutral-500">
          {profile.city && (
            <span className="flex items-center gap-1">
              <MapPinIcon size={14} />
              {profile.city}
            </span>
          )}
          <span className="flex items-center gap-1">
            <ClockIcon size={14} />
            Joined {joinedDate}
          </span>
          <Badge variant="premium" size="sm" animated={false}>
            {levelTitle}
          </Badge>
        </div>
      </div>
    </div>
  );
}

function ClockIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}