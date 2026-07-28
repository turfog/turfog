/**
 * Heartbeat Type Definitions
 * Core mechanic: "I want to play" and "Looking for player"
 */

import type { SPORTS, SKILL_LEVELS, HEARTBEAT_TYPES } from "@/lib/constants";

// ----- Heartbeat Types -----
export type HeartbeatType = (typeof HEARTBEAT_TYPES)[keyof typeof HEARTBEAT_TYPES];

// ----- Sport -----
export type SportId = (typeof SPORTS)[number]["id"];
export type SportName = (typeof SPORTS)[number]["name"];

// ----- Skill Level -----
export type SkillLevelId = (typeof SKILL_LEVELS)[number]["id"];
export type SkillLevelName = (typeof SKILL_LEVELS)[number]["name"];

// ----- I Want to Play Heartbeat -----
export interface IWantToPlayHeartbeat {
  id: string;
  type: "i-want-to-play";
  playerId: string;
  playerName: string;
  playerUsername: string;
  playerPhoto: string;
  sports: SportId[];
  skillLevel: SkillLevelId;
  location: {
    latitude: number;
    longitude: number;
    city: string;
  };
  note: string;
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
}

// ----- Looking for Player Heartbeat -----
export interface LookingForPlayerHeartbeat {
  id: string;
  type: "looking-for-player";
  teamId: string;
  teamName: string;
  teamLogo: string;
  sport: SportId;
  skillLevel: SkillLevelId;
  playersNeeded: number;
  currentPlayers: number;
  location: {
    latitude: number;
    longitude: number;
    city: string;
    venue: string;
  };
  matchTime: string;
  note: string;
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
}

// ----- Union Heartbeat Type -----
export type Heartbeat = IWantToPlayHeartbeat | LookingForPlayerHeartbeat;

// ----- Heartbeat Form Input -----
export interface HeartbeatFormInput {
  type: HeartbeatType;
  sports: SportId[];
  skillLevel: SkillLevelId;
  note: string;
  matchTime?: string;
  playersNeeded?: number;
  venue?: string;
}

// ----- Heartbeat Card Display -----
export interface HeartbeatCardData {
  id: string;
  type: HeartbeatType;
  title: string;
  subtitle: string;
  sportIcons: SportId[];
  skillLevel: SkillLevelId;
  location: string;
  timeInfo: string;
  userAvatar: string;
  userName: string;
  matchTime?: string;
  slotsInfo?: string;
}