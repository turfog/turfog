"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useLocation } from "@/context/LocationContext";
import { createClient } from "@/lib/supabase";
import {
  fetchActiveRequests,
  fetchMyParticipants,
  fetchActiveHeartbeats,
  joinRequest as apiJoinRequest,
  leaveRequest as apiLeaveRequest,
  subscribeRequests,
  haversineKm,
} from "@/lib/discovery";
import type { MatchRequestRow, HeartbeatRow } from "@/lib/discovery";
import type { PlayerRequest, AvailablePlayer, SportId, MatchType } from "@/types";

const SPORTS_SET = new Set<SportId>(["football", "box-cricket", "pickleball", "padel", "badminton"]);
const MATCH_TYPES_SET = new Set<MatchType>(["casual", "practice", "competitive", "tournament"]);
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

interface DiscoveryState {
  requests: PlayerRequest[];
  heartbeats: AvailablePlayer[];
  myActions: Record<string, "joined" | "waitlist">;
  loading: boolean;
  join: (id: string, isFull: boolean) => Promise<void>;
  leave: (id: string) => Promise<void>;
  dismiss: (id: string) => void;
}

const DEFAULT_STATE: DiscoveryState = {
  requests: [],
  heartbeats: [],
  myActions: {},
  loading: true,
  join: async () => {},
  leave: async () => {},
  dismiss: () => {},
};

const DiscoveryContext = createContext<DiscoveryState | null>(null);

export function DiscoveryProvider({ children }: { children: ReactNode }) {
  const { lat, lng, radius } = useLocation();
  const [requestRows, setRequestRows] = useState<MatchRequestRow[]>([]);
  const [heartbeatRows, setHeartbeatRows] = useState<HeartbeatRow[]>([]);
  const [myActions, setMyActions] = useState<Record<string, "joined" | "waitlist">>({});
  const [myId, setMyId] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const [r, h, m] = await Promise.all([
        fetchActiveRequests(),
        fetchActiveHeartbeats(),
        fetchMyParticipants(),
      ]);
      setMyId(user?.id ?? null);
      setRequestRows(r);
      setHeartbeatRows(h);
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
    const mapped: PlayerRequest[] = requestRows
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
  }, [requestRows, dismissed, lat, lng, radius]);

  const heartbeats = useMemo(() => {
    const mapped: AvailablePlayer[] = heartbeatRows
      .filter((h) => h.user_id !== myId)
      .map((h) => {
        const distanceKm =
          lat != null && lng != null && h.latitude != null && h.longitude != null
            ? Number(haversineKm(lat, lng, h.latitude, h.longitude).toFixed(1))
            : 0;
        return {
          id: h.id,
          name: h.user_name ?? "Player",
          username: h.user_username ?? "player",
          avatar: h.user_avatar ?? "",
          verified: !!h.verified,
          sport: safeSport(h.sport),
          skill: h.skill_level ?? "intermediate",
          note: h.note ?? "",
          location: h.location ?? "",
          distanceKm,
          wentLiveAt: h.created_at,
        };
      });
    if (lat != null && lng != null) {
      return mapped.filter((p) => p.distanceKm <= radius || p.distanceKm === 0);
    }
    return mapped;
  }, [heartbeatRows, myId, lat, lng, radius]);

  const join = useCallback(
    async (id: string, isFull: boolean) => {
      await apiJoinRequest(id, isFull);
      await refresh();
    },
    [refresh]
  );

  const leave = useCallback(
    async (id: string) => {
      await apiLeaveRequest(id);
      await refresh();
    },
    [refresh]
  );

  const dismiss = useCallback((id: string) => {
    setDismissed((s) => new Set(s).add(id));
  }, []);

  return (
    <DiscoveryContext.Provider value={{ requests, heartbeats, myActions, loading, join, leave, dismiss }}>
      {children}
    </DiscoveryContext.Provider>
  );
}

export function useDiscovery(): DiscoveryState {
  return useContext(DiscoveryContext) ?? DEFAULT_STATE;
}