import { createClient } from "@/lib/supabase";

export interface AvailablePlayer {
  id: string;
  userId: string | null;
  name: string;
  username: string;
  avatar: string;
  verified: boolean;
  sport: string;
  skillLevel: string;
  note: string;
  location: string;
  distanceKm: number | null;
  createdAt: string;
  presenceStatus: string | null;
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

export async function fetchAvailablePlayers(opts?: {
  sport?: string;
  lat?: number | null;
  lng?: number | null;
  radiusKm?: number;
}): Promise<AvailablePlayer[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("heartbeats")
    .select(`
      id,
      user_id,
      sport,
      skill_level,
      note,
      location,
      latitude,
      longitude,
      created_at,
      verified,
      players!user_id(full_name, username, profile_photo, presence_status)
    `)
    .order("created_at", { ascending: false })
    .limit(200);

  if (!data) return [];

  return (data as any[])
    .filter((h) => {
      if (!opts?.sport || opts.sport === "all") return true;
      return h.sport === opts.sport;
    })
    .map((h) => {
      const player = h.players as any;
      let distanceKm: number | null = null;
      if (opts?.lat != null && opts?.lng != null && h.latitude && h.longitude) {
        distanceKm = Number(haversineKm(opts.lat, opts.lng, h.latitude, h.longitude).toFixed(1));
      }
      return {
        id: h.id,
        userId: h.user_id,
        name: player?.full_name || "Player",
        username: player?.username || "player",
        avatar: player?.profile_photo || "",
        verified: !!h.verified,
        sport: h.sport,
        skillLevel: h.skill_level || "intermediate",
        note: h.note || "",
        location: h.location || "",
        distanceKm,
        createdAt: h.created_at,
        presenceStatus: player?.presence_status || null,
      };
    })
    .filter((p) => {
      if (opts?.lat == null || opts?.radiusKm == null) return true;
      return p.distanceKm === null || p.distanceKm <= opts.radiusKm;
    });
}