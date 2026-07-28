/**
 * Player-Related TypeScript Interfaces
 */

import type { Player as DatabasePlayer } from "@/types/database";

// ----- Base Player (from database) -----
export type Player = DatabasePlayer;

// ----- Public Player Profile (safe to expose) -----
export interface PublicPlayerProfile {
  id: string;
  username: string;
  fullName: string;
  bio: string;
  city: string;
  profilePhoto: string;
  coverPhoto: string;
  verificationStatus: "unverified" | "verified" | "pending";
  isOnline: boolean;
  lastActive: string;
  totalMatches: number;
  totalWins: number;
  totalMvps: number;
  reliabilityScore: number;
  xpPoints: number;
  level: number;
  streak: number;
  joinedAt: string;
}

// ----- Player Stats -----
export interface PlayerStats {
  totalMatches: number;
  totalWins: number;
  totalMvps: number;
  winRate: number;
  reliabilityScore: number;
  xpPoints: number;
  level: number;
  levelTitle: string;
  streak: number;
  rank: number;
}

// ----- Nearby Player (discovery) -----
export interface NearbyPlayer {
  id: string;
  username: string;
  fullName: string;
  profilePhoto: string;
  city: string;
  isOnline: boolean;
  lastActive: string;
  reliabilityScore: number;
  level: number;
  distanceKm: number;
}

// ----- Player Search Result -----
export interface PlayerSearchResult {
  id: string;
  username: string;
  fullName: string;
  profilePhoto: string;
  city: string;
  reliabilityScore: number;
  level: number;
  isOnline: boolean;
}

// ----- Convert database player to public profile -----
export function mapToPublicProfile(player: Player): PublicPlayerProfile {
  return {
    id: player.id,
    username: player.username || "",
    fullName: player.full_name,
    bio: player.bio,
    city: player.city,
    profilePhoto: player.profile_photo,
    coverPhoto: player.cover_photo,
    verificationStatus: player.verification_status as PublicPlayerProfile["verificationStatus"],
    isOnline: player.is_online,
    lastActive: player.last_active,
    totalMatches: player.total_matches,
    totalWins: player.total_wins,
    totalMvps: player.total_mvps,
    reliabilityScore: player.reliability_score,
    xpPoints: player.xp_points,
    level: player.level,
    streak: player.streak,
    joinedAt: player.created_at,
  };
}