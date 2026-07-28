/**
 * Feed and Discovery Type Definitions
 */

import type { SportId, SkillLevelId } from "@/types/heartbeat";

// ----- Sports Feed Item -----
export interface FeedItem {
  id: string;
  type: "heartbeat" | "match-result" | "achievement" | "community-join";
  createdAt: string;
  data: FeedHeartbeatData | FeedMatchResultData | FeedAchievementData | FeedCommunityData;
}

// ----- Feed Data Variants -----
export interface FeedHeartbeatData {
  kind: "heartbeat";
  heartbeatType: "i-want-to-play" | "looking-for-player";
  userId: string;
  userName: string;
  userAvatar: string;
  sport: SportId;
  skillLevel: SkillLevelId;
  location: string;
  note: string;
}

export interface FeedMatchResultData {
  kind: "match-result";
  matchId: string;
  sport: SportId;
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  mvpName: string;
  mvpId: string;
}

export interface FeedAchievementData {
  kind: "achievement";
  userId: string;
  userName: string;
  achievementTitle: string;
  achievementDescription: string;
  xpEarned: number;
}

export interface FeedCommunityData {
  kind: "community-join";
  userId: string;
  userName: string;
  communityName: string;
  communityId: string;
}

// ----- Trending Item -----
export interface TrendingItem {
  id: string;
  title: string;
  subtitle: string;
  sport: SportId;
  participantCount: number;
  city: string;
  hotScore: number;
}

// ----- AI Discovery Recommendation -----
export interface AIDiscoveryRecommendation {
  id: string;
  type: "player" | "match" | "community";
  title: string;
  description: string;
  matchScore: number;
  reason: string;
  sport: SportId;
  actionUrl: string;
  imageUrl: string;
}

// ----- Sports Radar Data -----
export interface SportsRadarData {
  activeHeartbeats: number;
  playersNearby: number;
  matchesToday: number;
  trendingSport: {
    sportId: SportId;
    sportName: string;
    count: number;
  };
  hotZones: HotZone[];
}

// ----- Hot Zone (geographic area with high activity) -----
export interface HotZone {
  id: string;
  name: string;
  city: string;
  latitude: number;
  longitude: number;
  activePlayers: number;
  activeMatches: number;
  intensity: "low" | "medium" | "high";
}