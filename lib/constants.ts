/**
 * Turfog Application Constants
 * Centralized configuration values used throughout the application
 */

// ----- Application Metadata -----
export const APP_NAME = "Turfog";
export const APP_TAGLINE = "Never cancel a match again";
export const APP_DESCRIPTION =
  "Turfog is a location-based sports operating system that instantly connects players who want to play with teams looking for players. Find matches, join communities, and never cancel a game again.";
export const APP_URL = "https://turfog.com";

// ----- Auth Routes -----
export const ROUTES = {
  HOME: "/",
  SIGN_IN: "/auth/sign-in",
  SIGN_UP: "/auth/sign-up",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  VERIFY_EMAIL: "/auth/verify-email",
  AUTH_CALLBACK: "/auth/callback",
  SETUP_USERNAME: "/setup-username",
  EDIT_PROFILE: "/edit-profile",
  DASHBOARD: "/dashboard",
  COMMUNITIES: "/communities",
  MATCHES_CREATE: "/matches/create",
} as const;

// ----- API Routes -----
export const API_ROUTES = {
  CHECK_USERNAME: "/api/auth/check-username",
  PLAYERS: "/api/players",
  HEARTBEAT: "/api/heartbeat",
} as const;

// ----- Sports Supported -----
export const SPORTS = [
  { id: "football", name: "Football", icon: "Football" },
  { id: "cricket", name: "Cricket", icon: "Cricket" },
  { id: "basketball", name: "Basketball", icon: "Basketball" },
  { id: "badminton", name: "Badminton", icon: "Badminton" },
  { id: "tennis", name: "Tennis", icon: "Tennis" },
  { id: "volleyball", name: "Volleyball", icon: "Volleyball" },
  { id: "table-tennis", name: "Table tennis", icon: "TableTennis" },
  { id: "hockey", name: "Hockey", icon: "Hockey" },
] as const;

// ----- Skill Levels -----
export const SKILL_LEVELS = [
  { id: "beginner", name: "Beginner" },
  { id: "intermediate", name: "Intermediate" },
  { id: "advanced", name: "Advanced" },
  { id: "professional", name: "Professional" },
] as const;

// ----- Heartbeat Types -----
export const HEARTBEAT_TYPES = {
  I_WANT_TO_PLAY: "i-want-to-play",
  LOOKING_FOR_PLAYER: "looking-for-player",
} as const;

// ----- Heartbeat Duration -----
export const HEARTBEAT_DURATION_MINUTES = 60; // Heartbeat expires after 60 minutes

// ----- Location Settings -----
export const LOCATION_REFRESH_INTERVAL_MS = 30000; // Refresh location every 30 seconds
export const NEARBY_RADIUS_KM = 10; // Search radius for nearby players

// ----- XP & Leveling -----
export const XP_PER_MATCH = 50;
export const XP_PER_WIN = 25;
export const XP_PER_MVP = 15;
export const XP_PER_HEARTBEAT = 10;

// ----- Reputation -----
export const INITIAL_RELIABILITY_SCORE = 5.0;
export const MAX_RELIABILITY_SCORE = 10.0;
export const MIN_RELIABILITY_SCORE = 1.0;

// ----- Storage Buckets -----
export const STORAGE_BUCKETS = {
  PROFILE_PHOTOS: "profile-photos",
  COVER_PHOTOS: "cover-photos",
  COMMUNITY_IMAGES: "community-images",
} as const;

// ----- Pagination -----
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 50;

// ----- UI Constants -----
export const SIDEBAR_WIDTH_PERCENT = 15;
export const FEED_WIDTH_PERCENT = 67;
export const RIGHT_PANEL_WIDTH_PERCENT = 18;

// ----- Animation Durations (seconds) -----
export const ANIMATION = {
  FAST: 0.15,
  BASE: 0.2,
  SLOW: 0.3,
  STAGGER_DELAY: 0.05,
} as const;