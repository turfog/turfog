"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "@/context/LocationContext";
import {
  fetchActiveRequests,
  fetchMyParticipants,
  joinRequest,
  leaveRequest,
  subscribeRequests,
  haversineKm,
} from "@/lib/discovery";
import type { MatchRequestRow } from "@/lib/discovery";
import type { PlayerRequest, SportId, MatchType } from "@/types";

const SPORTS_SET = new Set<SportId>([
  "football",
  "box-cricket",
  "pickleball",
  "padel",
  "badminton",
]);
const MATCH_TYPES_SET = new Set<MatchType>([
  "casual",
  "practice",
  "competitive",
  "tournament",
]);
const SKILLS_SET = new Set(["beginner", "intermediate", "advanced", "any"]);

function safeSport(v: string | null | undefined): SportId {
  return v && SPORTS_SET.has(v as SportId) ? (v as SportId) : "football";
}
function safeMatchType(v: string | null | undefined): MatchType {
  return v && MATCH_TYPES_SET.has(v as MatchType) ? (v as MatchType) : "casual";
}
function safeSkill(v: string | null | undefined): PlayerRequest["skill"] {
  return v && SKILLS_SET.has(v) ? (v as PlayerRequest["skill"]) : "any";
}

export function useMatchRequests() {
  const { lat, lng, radius } = useLocation();
  const [rows, setRows] = useState<MatchRequestRow[]>([]);
  const [myActions, setMyActions] = useState<Record<string, "joined" | "waitlist">>({});
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const [r, m] = await Promise.all([fetchActiveRequests(), fetchMyParticipants()]);
      setRows(r);
      setMyActions(m);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const unsub = subscribeRequests(() => refresh());
    return unsub;
  }, [refresh]);

  const requests = useMemo(() => {
    const mapped: PlayerRequest[] = rows
      .filter((r) => !dismissed.has(r.id))
      .map((r) => {
        const distanceKm =
          lat != null && lng != null && r.latitude != null && r.longitude != null
            ? Number(haversineKm(lat, lng, r.latitude, r.longitude).toFixed(1))
            : 0;
        return {
          id: r.id,
          organizerName: r.organizer_name ?? "Player",
          organizerUsername: r.organizer_username ?? "player",
          organizerAvatar: r.organizer_avatar ?? "",
          verified: !!r.verified,
          sport: safeSport(r.sport),
          needed: typeof r.needed === "number" ? r.needed : 1,
          capacity: typeof r.capacity === "number" && r.capacity > 0 ? r.capacity : 1,
          waitlist: typeof r.waitlist_count === "number" ? r.waitlist_count : 0,
          kickoffAt: r.kickoff_at ? r.kickoff_at : new Date().toISOString(),
          venue: r.venue ?? "",
          area: r.area ?? "",
          distanceKm,
          skill: safeSkill(r.skill),
          matchType: safeMatchType(r.match_type),
          teamName: r.team_name ?? undefined,
          mutuals: undefined,
        };
      });
    if (lat != null && lng != null) {
      return mapped.filter((m) => m.distanceKm <= radius || m.distanceKm === 0);
    }
    return mapped;
  }, [rows, dismissed, lat, lng, radius]);

  const join = useCallback(
    async (id: string, isFull: boolean) => {
      await joinRequest(id, isFull);
      await refresh();
    },
    [refresh]
  );

  const leave = useCallback(
    async (id: string) => {
      await leaveRequest(id);
      await refresh();
    },
    [refresh]
  );

  const dismiss = useCallback((id: string) => {
    setDismissed((s) => new Set(s).add(id));
  }, []);

  return { requests, myActions, loading, join, leave, dismiss };
}