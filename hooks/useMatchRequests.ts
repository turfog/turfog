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

export function useMatchRequests() {
  const { lat, lng, radius } = useLocation();
  const [rows, setRows] = useState<MatchRequestRow[]>([]);
  const [myActions, setMyActions] = useState<Record<string, "joined" | "waitlist">>({});
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [r, m] = await Promise.all([fetchActiveRequests(), fetchMyParticipants()]);
    setRows(r);
    setMyActions(m);
    setLoading(false);
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
          organizerName: r.organizer_name,
          organizerUsername: r.organizer_username,
          organizerAvatar: r.organizer_avatar,
          verified: r.verified,
          sport: r.sport as SportId,
          needed: r.needed,
          capacity: r.capacity,
          waitlist: r.waitlist_count ?? 0,
          kickoffAt: r.kickoff_at,
          venue: r.venue,
          area: r.area,
          distanceKm,
          skill: r.skill as PlayerRequest["skill"],
          matchType: r.match_type as MatchType,
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