import { createClient } from "@/lib/supabase";
import type { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js";

export interface MatchRequestRow {
  id: string;
  organizer_id: string | null;
  organizer_name: string;
  organizer_username: string;
  organizer_avatar: string;
  verified: boolean;
  sport: string;
  needed: number;
  capacity: number;
  waitlist_count: number;
  kickoff_at: string;
  venue: string;
  area: string;
  latitude: number | null;
  longitude: number | null;
  skill: string;
  match_type: string;
  team_name: string | null;
  is_active: boolean;
  created_at: string;
}

export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<string | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
      { headers: { Accept: "application/json" } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const a = data.address ?? {};
    const name =
      a.suburb ||
      a.neighbourhood ||
      a.city_district ||
      a.city ||
      a.town ||
      a.village ||
      a.state;
    return name ? String(name) : null;
  } catch {
    return null;
  }
}

export async function updateMyLocation(
  lat: number,
  lng: number,
  label: string
): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase
    .from("players")
    .update({ latitude: lat, longitude: lng, location_label: label })
    .eq("auth_id", user.id);
}

export async function setMyPresence(
  status: string,
  minutes: number
): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase
    .from("players")
    .update({
      presence_status: status,
      presence_expires_at: new Date(Date.now() + minutes * 60000).toISOString(),
    })
    .eq("auth_id", user.id);
}

export async function goLiveHeartbeat(input: {
  type: "i-want-to-play" | "looking-for-player";
  sport: string;
  skill: string;
  note: string;
  location: string;
  lat: number | null;
  lng: number | null;
  minutes: number;
}): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  const { data: player } = await supabase
    .from("players")
    .select("full_name, username, profile_photo, verification_status")
    .eq("auth_id", user.id)
    .maybeSingle();
  await supabase.from("heartbeats").insert({
    user_id: user.id,
    user_name: player?.full_name ?? "Player",
    user_username: player?.username ?? "player",
    user_avatar: player?.profile_photo ?? "",
    verified: player?.verification_status === "verified",
    type: input.type,
    sport: input.sport,
    skill_level: input.skill,
    location: input.location,
    latitude: input.lat,
    longitude: input.lng,
    note: input.note,
    is_active: true,
    expires_at: new Date(Date.now() + input.minutes * 60000).toISOString(),
  });
}

export async function createMatchRequest(input: {
  sport: string;
  playersNeeded: number;
  skill: string;
  matchType: string;
  venue: string;
  area: string;
  teamName?: string;
  note?: string;
  kickoffAt: string;
  lat: number | null;
  lng: number | null;
}): Promise<MatchRequestRow | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: player } = await supabase
    .from("players")
    .select("full_name, username, profile_photo, verification_status")
    .eq("auth_id", user.id)
    .maybeSingle();
  const { data, error } = await supabase
    .from("match_requests")
    .insert({
      organizer_id: user.id,
      organizer_name: player?.full_name ?? "Player",
      organizer_username: player?.username ?? "player",
      organizer_avatar: player?.profile_photo ?? "",
      verified: player?.verification_status === "verified",
      sport: input.sport,
      needed: input.playersNeeded,
      capacity: input.playersNeeded,
      waitlist_count: 0,
      kickoff_at: input.kickoffAt,
      venue: input.venue,
      area: input.area,
      latitude: input.lat,
      longitude: input.lng,
      skill: input.skill,
      match_type: input.matchType,
      team_name: input.teamName ?? null,
      is_active: true,
    })
    .select()
    .single();
  if (error) return null;
  return data as MatchRequestRow;
}

export async function fetchActiveRequests(): Promise<MatchRequestRow[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("match_requests")
    .select("*")
    .eq("is_active", true)
    .order("kickoff_at", { ascending: true });
  return (data ?? []) as MatchRequestRow[];
}

export async function fetchMyParticipants(): Promise<
  Record<string, "joined" | "waitlist">
> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return {};
  const { data } = await supabase
    .from("match_request_participants")
    .select("request_id, status")
    .eq("user_id", user.id);
  const map: Record<string, "joined" | "waitlist"> = {};
  (data ?? []).forEach((p) => {
    map[p.request_id] = p.status as "joined" | "waitlist";
  });
  return map;
}

export async function joinRequest(
  requestId: string,
  isFull: boolean
): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  const status = isFull ? "waitlist" : "joined";
  const { error } = await supabase
    .from("match_request_participants")
    .insert({ request_id: requestId, user_id: user.id, status });
  if (error) return;
  const { data: req } = await supabase
    .from("match_requests")
    .select("needed, waitlist_count")
    .eq("id", requestId)
    .single();
  if (!req) return;
  if (isFull) {
    await supabase
      .from("match_requests")
      .update({ waitlist_count: (req.waitlist_count ?? 0) + 1 })
      .eq("id", requestId);
  } else {
    await supabase
      .from("match_requests")
      .update({ needed: Math.max(0, req.needed - 1) })
      .eq("id", requestId);
  }
}

export async function leaveRequest(requestId: string): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  const { data: mine } = await supabase
    .from("match_request_participants")
    .select("id, status")
    .eq("request_id", requestId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!mine) return;
  await supabase.from("match_request_participants").delete().eq("id", mine.id);
  const { data: req } = await supabase
    .from("match_requests")
    .select("needed, waitlist_count")
    .eq("id", requestId)
    .single();
  if (!req) return;
  if (mine.status === "joined") {
    let needed = req.needed + 1;
    let waitlist = req.waitlist_count ?? 0;
    if (waitlist > 0) {
      const { data: wl } = await supabase
        .from("match_request_participants")
        .select("id")
        .eq("request_id", requestId)
        .eq("status", "waitlist")
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();
      if (wl) {
        await supabase
          .from("match_request_participants")
          .update({ status: "joined" })
          .eq("id", wl.id);
        needed = Math.max(0, needed - 1);
        waitlist = Math.max(0, waitlist - 1);
      }
    }
    await supabase
      .from("match_requests")
      .update({ needed, waitlist_count: waitlist })
      .eq("id", requestId);
  } else {
    await supabase
      .from("match_requests")
      .update({ waitlist_count: Math.max(0, (req.waitlist_count ?? 0) - 1) })
      .eq("id", requestId);
  }
}

// ----- Shared, ref-counted Realtime subscription -----
// One channel for the whole app, no matter how many widgets subscribe.

type RequestListener = () => void;
const requestListeners = new Set<RequestListener>();
let sharedChannel: RealtimeChannel | null = null;
let sharedClient: SupabaseClient | null = null;

function notifyRequestListeners(): void {
  requestListeners.forEach((listener) => listener());
}

export function subscribeRequests(onChange: RequestListener): () => void {
  requestListeners.add(onChange);

  if (!sharedChannel) {
    const client = createClient();
    sharedClient = client;
    sharedChannel = client
      .channel("discovery-requests")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "match_requests" },
        () => notifyRequestListeners()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "match_request_participants" },
        () => notifyRequestListeners()
      )
      .subscribe();
  }

  return () => {
    requestListeners.delete(onChange);
    if (requestListeners.size === 0 && sharedChannel && sharedClient) {
      sharedClient.removeChannel(sharedChannel);
      sharedChannel = null;
      sharedClient = null;
    }
  };
}