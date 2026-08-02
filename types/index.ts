// ----- Sports (Launch: 5 only) -----

export type SportId =
  | "football"
  | "box-cricket"
  | "pickleball"
  | "padel"
  | "badminton";

export interface Sport {
  id: SportId;
  name: string;
  tagline: string;
  formats: string[];
  heroImage: string;
}

// ----- Player / Profile -----

export interface Player {
  id: string;
  auth_id: string;
  full_name: string | null;
  username: string | null;
  username_set: boolean;
  bio: string;
  phone: string;
  city: string;
  profile_photo: string;
  cover_photo: string;
  verification_status: "unverified" | "verified" | "rejected";
  is_online: boolean;
  last_active: string;
  total_matches: number;
  total_wins: number;
  total_mvps: number;
  reliability_score: number;
  xp_points: number;
  level: number;
  streak: number;
  admin_approved: boolean;
  created_at: string;
  updated_at: string;
}

// ----- Heartbeat -----

export type HeartbeatType = "i-want-to-play" | "looking-for-player";

export interface Heartbeat {
  id: string;
  user_id: string;
  type: HeartbeatType;
  sport: SportId;
  skill_level: "beginner" | "intermediate" | "advanced";
  location: string;
  latitude: number | null;
  longitude: number | null;
  note: string;
  is_active: boolean;
  expires_at: string;
  created_at: string;
}

// ----- Feed -----

export type FeedItemType = "heartbeat" | "match-result" | "achievement";

export interface HeartbeatFeedData {
  kind: "heartbeat";
  heartbeatType: HeartbeatType;
  userId: string;
  userName: string;
  userAvatar: string;
  sport: SportId;
  skillLevel: string;
  location: string;
  note: string;
}

export interface MatchResultFeedData {
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

export interface AchievementFeedData {
  kind: "achievement";
  userId: string;
  userName: string;
  achievementTitle: string;
  achievementDescription: string;
  xpEarned: number;
}

export type FeedData =
  | HeartbeatFeedData
  | MatchResultFeedData
  | AchievementFeedData;

export interface FeedItem {
  id: string;
  type: FeedItemType;
  createdAt: string;
  data: FeedData;
}

// ----- Radar -----

export type ZoneIntensity = "high" | "medium" | "low";

export interface HotZone {
  id: string;
  name: string;
  city: string;
  latitude: number;
  longitude: number;
  activePlayers: number;
  activeMatches: number;
  intensity: ZoneIntensity;
}

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

// ----- Trending -----

export interface TrendingItem {
  id: string;
  title: string;
  subtitle: string;
  sport: SportId;
  participantCount: number;
  city: string;
  hotScore: number;
}

// ----- AI Discovery -----

export type RecommendationType = "match" | "player" | "community";

export interface AIDiscoveryRecommendation {
  id: string;
  type: RecommendationType;
  title: string;
  description: string;
  matchScore: number;
  reason: string;
  sport: SportId;
  actionUrl: string;
  imageUrl: string;
}

// ----- Sport Detail Page -----

export interface SportPageData {
  sport: Sport;
  activePlayers: number;
  upcomingMatches: number;
  nearbyVenues: number;
  topPlayers: Player[];
  recentMatches: MatchResultFeedData[];
}

// ----- Social feed -----

export interface PostMedia {
  type: "image" | "video";
  url: string;
  alt: string;
}

export interface PostHeartbeat {
  type: HeartbeatType;
  label: string;
  playersNeeded?: number;
  joinUrl: string;
}

export interface PostComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  createdAt: string;
}

export interface SocialPost {
  id: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  authorVerified: boolean;
  presence: string;
  authorId?: string;
  trustScore: number;
  createdAt: string;
  sport?: SportId;
  location?: string;
  text: string;
  media: PostMedia | null;
  heartbeat: PostHeartbeat | null;
  likes: number;
  comments: PostComment[];
  shares: number;
  likedByMe: boolean;
  savedByMe: boolean;
  nearbyWantToJoin: number;
}
// ----- Live players-wanted requests -----

export type MatchType = "casual" | "practice" | "competitive" | "tournament";

export interface PlayerRequest {
  id: string;
  organizerName: string;
  organizerUsername: string;
  organizerAvatar: string;
  verified: boolean;
  sport: SportId;
  needed: number;
  capacity: number;
  waitlist: number;
  kickoffAt: string;
  venue: string;
  area: string;
  distanceKm: number;
  skill: "beginner" | "intermediate" | "advanced" | "any";
  matchType: MatchType;
  teamName?: string;
  mutuals?: number;
}
// ----- Available players (live "I want to play" heartbeats) -----

export interface AvailablePlayer {
  id: string;
  userId?: string;
  userId?: string;
  name: string;
  username: string;
  avatar: string;
  verified: boolean;
  sport: SportId;
  skill: string;
  note: string;
  location: string;
  distanceKm: number;
  wentLiveAt: string;
}