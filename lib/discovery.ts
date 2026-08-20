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
  cost_total: number;
  cost_split_mode: "none" | "split" | "organizer_pays";
  currency: string;
}

export interface HeartbeatRow {
  id: string;
  user_id: string | null;
  user_name: string;
  user_username: string;
  user_avatar: string;
  verified: boolean;
  type: string;
  sport: string;
  skill_level: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  note: string;
  is_active: boolean;
  expires_at: string;
  created_at: string;
}

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
      { headers: { Accept: "application/json" } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const a = data.address ?? {};
    const name = a.suburb || a.neighbourhood || a.city_district || a.city || a.town || a.village || a.state;
    return name ? String(name) : null;
  } catch {
    return null;
  }
}

export async function updateMyLocation(lat: number, lng: number, label: string): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("players").update({ latitude: lat, longitude: lng, location_label: label }).eq("auth_id", user.id);
}

export async function setMyPresence(status: string, minutes: number): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase
    .from("players")
    .update({ presence_status: status, presence_expires_at: new Date(Date.now() + minutes * 60000).toISOString() })
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
}): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in to go live" };
  const { data: player } = await supabase
    .from("players")
    .select("full_name, username, profile_photo, verification_status")
    .eq("auth_id", user.id)
    .maybeSingle();
  const { error } = await supabase.from("heartbeats").insert({
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
  if (error) return { error: error.message };
  return { error: null };
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
  totalPlayers?: number;
  playersInHand?: number;
  costTotal?: number;
  costSplitMode?: "none" | "split" | "organizer_pays";
  currency?: string;
}): Promise<{ data: MatchRequestRow | null; error: string | null }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: "You must be signed in to post a request" };
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
      capacity: input.totalPlayers ?? input.playersNeeded,
      players_in_hand: input.playersInHand ?? 0,
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
      cost_total: input.costTotal ?? 0,
      cost_split_mode: input.costSplitMode ?? "none",
      currency: input.currency ?? "INR",
    })
    .select()
    .single();
  if (error) return { data: null, error: error.message };
  return { data: data as MatchRequestRow, error: null };
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

export async function fetchActiveHeartbeats(): Promise<HeartbeatRow[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("heartbeats")
    .select("*")
    .eq("is_active", true)
    .eq("type", "i-want-to-play")
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false });
  return (data ?? []) as HeartbeatRow[];
}

export async function fetchMyParticipants(): Promise<Record<string, "joined" | "waitlist">> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
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

export async function joinRequest(requestId: string, isFull: boolean): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const status = isFull ? "waitlist" : "joined";
  await supabase
    .from("match_request_participants")
    .insert({ request_id: requestId, user_id: user.id, status });
  // Slot counts (needed / waitlist_count) are maintained by the adjust_match_slots DB trigger.
}

export async function leaveRequest(requestId: string): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const { data: mine } = await supabase
    .from("match_request_participants")
    .select("id, status")
    .eq("request_id", requestId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!mine) return;
  await supabase.from("match_request_participants").delete().eq("id", mine.id);
  // Counts are maintained by the trigger. If a joined slot freed up, promote the oldest waitlist.
  if (mine.status === "joined") {
    const { data: wl } = await supabase
      .from("match_request_participants")
      .select("id")
      .eq("request_id", requestId)
      .eq("status", "waitlist")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (wl) {
      await supabase.from("match_request_participants").update({ status: "joined" }).eq("id", wl.id);
    }
  }
}

// ----- Shared, ref-counted Realtime subscription: discovery tables -----
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
      .on("postgres_changes", { event: "*", schema: "public", table: "match_requests" }, () => notifyRequestListeners())
      .on("postgres_changes", { event: "*", schema: "public", table: "match_request_participants" }, () => notifyRequestListeners())
      .on("postgres_changes", { event: "*", schema: "public", table: "heartbeats" }, () => notifyRequestListeners())
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

// ----- Shared, ref-counted Realtime subscription: social tables -----
type SocialListener = () => void;
const socialListeners = new Set<SocialListener>();
let socialChannel: RealtimeChannel | null = null;
let socialClient: SupabaseClient | null = null;

function notifySocialListeners(): void {
  socialListeners.forEach((listener) => listener());
}

export function subscribeSocial(onChange: SocialListener): () => void {
  socialListeners.add(onChange);
  if (!socialChannel) {
    const client = createClient();
    socialClient = client;
    socialChannel = client
      .channel("discovery-social")
      .on("postgres_changes", { event: "*", schema: "public", table: "posts" }, () => notifySocialListeners())
      .on("postgres_changes", { event: "*", schema: "public", table: "post_likes" }, () => notifySocialListeners())
      .on("postgres_changes", { event: "*", schema: "public", table: "post_comments" }, () => notifySocialListeners())
      .on("postgres_changes", { event: "*", schema: "public", table: "follows" }, () => notifySocialListeners())
      .subscribe();
  }
  return () => {
    socialListeners.delete(onChange);
    if (socialListeners.size === 0 && socialChannel && socialClient) {
      socialClient.removeChannel(socialChannel);
      socialChannel = null;
      socialClient = null;
    }
  };
}

export async function searchPlaces(q: string): Promise<Array<{ name: string; lat: number; lng: number }>> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(q)}`,
      { headers: { Accept: "application/json" } }
    );
    if (!res.ok) return [];
    const data = (await res.json()) as Array<{ display_name: string; lat: string; lon: string }>;
    return data.map((d) => ({ name: d.display_name, lat: parseFloat(d.lat), lng: parseFloat(d.lon) }));
  } catch {
    return [];
  }
}