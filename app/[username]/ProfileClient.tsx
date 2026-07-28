"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import type { PublicPlayerProfile } from "@/types/player";
import ProfileHero from "@/components/profile/ProfileHero";
import ProfileStats from "@/components/profile/ProfileStats";
import ReputationBadge from "@/components/profile/ReputationBadge";
import MatchHistory from "@/components/profile/MatchHistory";
import Button from "@/components/ui/Button";
import {
  ChevronLeftIcon,
  SettingsIcon,
  PlusIcon,
} from "@/components/SvgIcons";

interface ProfileClientProps {
  profile: PublicPlayerProfile;
  isOwnProfile: boolean;
  currentUserId?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
};

export default function ProfileClient({
  profile,
  isOwnProfile,
    currentUserId: _currentUserId,
}: ProfileClientProps) {
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `${profile.fullName} on Turfog`,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="px-4 py-3">
        <Link
          href={ROUTES.DASHBOARD}
          className="inline-flex items-center gap-1 text-body-sm text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          <ChevronLeftIcon size={18} />
          Back to feed
        </Link>
      </motion.div>

      <motion.div variants={itemVariants}>
        <ProfileHero profile={profile} isOwnProfile={isOwnProfile} />
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="px-4 py-3 flex items-center gap-2"
      >
        {isOwnProfile ? (
          <>
            <Link href={ROUTES.EDIT_PROFILE} className="flex-1">
              <Button
                variant="outline"
                theme="neutral"
                size="md"
                fullWidth
                leftIcon={<SettingsIcon size={18} />}
              >
                Edit profile
              </Button>
            </Link>
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={handleShare}
              className="w-10 h-10 flex items-center justify-center border border-neutral-300 rounded-lg text-neutral-600 hover:bg-neutral-50 transition-colors"
              aria-label="Share profile"
            >
              <ShareIcon size={18} />
            </motion.button>
          </>
        ) : (
          <>
            <Button
              theme="green"
              size="md"
              fullWidth
              leftIcon={<PlusIcon size={18} />}
            >
              Invite to match
            </Button>
            <motion.button
              whileTap={{ scale: 0.94 }}
              className="w-10 h-10 flex items-center justify-center border border-neutral-300 rounded-lg text-neutral-600 hover:bg-neutral-50 transition-colors"
              aria-label="Send message"
            >
              <MessageCircleIcon size={18} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={handleShare}
              className="w-10 h-10 flex items-center justify-center border border-neutral-300 rounded-lg text-neutral-600 hover:bg-neutral-50 transition-colors"
              aria-label="Share profile"
            >
              <ShareIcon size={18} />
            </motion.button>
          </>
        )}
      </motion.div>

      <motion.div variants={itemVariants} className="px-4 py-2">
        <ReputationBadge
          reliabilityScore={profile.reliabilityScore}
          level={profile.level}
          streak={profile.streak}
          xpPoints={profile.xpPoints}
        />
      </motion.div>

      <motion.div variants={itemVariants} className="px-4 py-4">
        <ProfileStats
          totalMatches={profile.totalMatches}
          totalWins={profile.totalWins}
          totalMvps={profile.totalMvps}
          winRate={
            profile.totalMatches > 0
              ? Math.round((profile.totalWins / profile.totalMatches) * 100)
              : 0
          }
        />
      </motion.div>

      {profile.bio && (
        <motion.div variants={itemVariants} className="px-4 py-3">
          <h3 className="text-body-sm font-semibold text-neutral-900 mb-2">
            About
          </h3>
          <p className="text-body-sm text-neutral-600 leading-relaxed">
            {profile.bio}
          </p>
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="px-4 py-4">
        <h3 className="text-body-sm font-semibold text-neutral-900 mb-3">
          Recent matches
        </h3>
        <MatchHistory playerId={profile.id} />
      </motion.div>
    </motion.div>
  );
}

// ----- Local SVG Icons -----

function ShareIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function MessageCircleIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}