import { createClient } from "@/lib/supabase";

export interface LookingForMatch {
  id: string;
  organizerId: string | null;
  organizerName: string;
  organizerUsername: string;
  organizerAvatar: string;
  verified: boolean;
  sport: string;
  skill: string;
  matchType: string;
  teamName: string | null;
  area: string;
  venue: string;
  capacity: number;
  needed: number;
  waitlistCount: number;
  kickoffAt: string;
  createdAt: string;
  distanceKm: number | null;
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export async function fetchLookingForMatches(opts?: {
  sport?: string;
  lat?: number | null;
  lng?: number | null;
  radiusKm?: number;
}): Promise<LookingForMatch[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("match_requests")
    .select(`
      id,
      organizer_id,
      sport,
      skill,
      match_type,
      team_name,
      area,
      venue,
      capacity,
      needed,
      waitlist_count,
      kickoff_at,
      created_at,
      latitude,
      longitude,
      is_active,
      players!organizer_id(full_name, username, profile_photo, verification_status)
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(200);

  if (!data) return [];

  const now = new Date().getTime();

  return (data as any[])
    .filter((m) => {
      // Only future matches
      if (m.kickoff_at) {
        const ko = new Date(m.kickoff_at).getTime();
        if (ko < now) return false;
      }
      // Sport filter
      if (opts?.sport && opts.sport !== "all" && m.sport !== opts.sport) return false;
      return true;
    })
    .map((m) => {
      const org = m.players as any;
      let distanceKm: number | null = null;
      if (opts?.lat != null && opts?.lng != null && m.latitude && m.longitude) {
        distanceKm = Number(haversineKm(opts.lat, opts.lng, m.latitude, m.longitude).toFixed(1));
      }
      return {
        id: m.id,
        organizerId: m.organizer_id,
        organizerName: org?.full_name || "Player",
        organizerUsername: org?.username || "player",
        organizerAvatar: org?.profile_photo || "",
        verified: org?.verification_status === "verified",
        sport: m.sport,
        skill: m.skill || "any",
        matchType: m.match_type || "casual",
        teamName: m.team_name,
        area: m.area || "",
        venue: m.venue || "",
        capacity: m.capacity || 1,
        needed: m.needed || 0,
        waitlistCount: m.waitlist_count || 0,
        kickoffAt: m.kickoff_at,
        createdAt: m.created_at,
        distanceKm,
      };
    })
    .filter((m) => {
      if (opts?.lat == null || opts?.radiusKm == null) return true;
      return m.distanceKm === null || m.distanceKm <= opts.radiusKm;
    });
}