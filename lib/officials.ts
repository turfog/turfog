import { createClient } from "@/lib/supabase";
import type { SportId } from "@/types";

const SPORTS = new Set<SportId>(["football", "box-cricket", "pickleball", "padel", "badminton"]);
type Row = Record<string, unknown>;
const str = (v: unknown, d = ""): string => (v == null ? d : String(v));
const num = (v: unknown, d = 0): number => (typeof v === "number" ? v : Number(v) || d);
function safeSport(v: unknown): SportId {
  return typeof v === "string" && SPORTS.has(v as SportId) ? (v as SportId) : "football";
}

export interface Official {
  id: string;
  userId: string | null;
  username: string;
  displayName: string;
  avatar: string;
  verified: boolean;
  sport: SportId;
  officialRole: string;
  certification: string;
  yearsExperience: number;
  matchesOfficiated: number;
  rating: number;
  reviewsCount: number;
  price: number | null;
  languages: string;
  availability: string;
  city: string;
  bio: string;
  latitude: number | null;
  longitude: number | null;
}

export interface OfficialBooking {
  id: string;
  officialId: string;
  requesterId: string;
  requesterName: string;
  teamName: string;
  sport: string;
  matchDate: string;
  note: string;
  status: string;
  createdAt: string;
}

function mapOfficial(r: Row): Official {
  return {
    id: str(r.id),
    userId: r.user_id ? str(r.user_id) : null,
    username: str(r.username),
    displayName: str(r.display_name, "Official"),
    avatar: str(r.avatar),
    verified: r.verified === true,
    sport: safeSport(r.sport),
    officialRole: str(r.official_role, "referee"),
    certification: str(r.certification),
    yearsExperience: num(r.years_experience),
    matchesOfficiated: num(r.matches_officiated),
    rating: num(r.rating),
    reviewsCount: num(r.reviews_count),
    price: r.price == null ? null : num(r.price),
    languages: str(r.languages),
    availability: str(r.availability),
    city: str(r.city),
    bio: str(r.bio),
    latitude: r.latitude != null ? num(r.latitude) : null,
    longitude: r.longitude != null ? num(r.longitude) : null,
  };
}

export async function fetchOfficials(opts: { query: string; sport?: SportId | "all"; role?: string | "all" }): Promise<Official[]> {
  const supabase = createClient();
  let q = supabase.from("officials").select("*").eq("is_active", true).limit(40);
  const term = opts.query.trim();
  if (term) {
    const safe = term.replace(/[,()%_\\]/g, " ");
    q = q.or(`username.ilike.%${safe}%,display_name.ilike.%${safe}%`);
  }
  if (opts.sport && opts.sport !== "all") q = q.eq("sport", opts.sport);
  if (opts.role && opts.role !== "all") q = q.eq("official_role", opts.role);
  const { data } = await q;
  return ((data ?? []) as Row[]).map(mapOfficial);
}

export async function fetchOfficialByUsername(username: string): Promise<Official | null> {
  const supabase = createClient();
  const { data } = await supabase.from("officials").select("*").eq("username", username).maybeSingle();
  return data ? mapOfficial(data as Row) : null;
}

export async function registerOfficial(input: {
  sport: SportId;
  officialRole: string;
  certification: string;
  yearsExperience: number;
  price: number | null;
  languages: string;
  availability: string;
  city: string;
  bio: string;
}): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data: player } = await supabase
    .from("players")
    .select("username, full_name, profile_photo, verification_status, city, latitude, longitude")
    .eq("auth_id", user.id)
    .maybeSingle();
  const p = (player ?? {}) as Row;
  const { error } = await supabase.from("officials").upsert(
    {
      user_id: user.id,
      username: str(p.username, "player"),
      display_name: str(p.full_name, "Player"),
      avatar: str(p.profile_photo),
      verified: p.verification_status === "verified",
      sport: input.sport,
      official_role: input.officialRole,
      certification: input.certification,
      years_experience: input.yearsExperience,
      price: input.price,
      languages: input.languages,
      availability: input.availability,
      city: input.city || str(p.city),
      latitude: p.latitude != null ? num(p.latitude) : null,
      longitude: p.longitude != null ? num(p.longitude) : null,
      bio: input.bio,
      is_active: true,
    },
    { onConflict: "user_id" }
  );
  return !error;
}

export async function requestOfficial(
  officialId: string,
  input: { sport: string; matchDate: string; note: string; teamName: string }
): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data: player } = await supabase.from("players").select("full_name, username").eq("auth_id", user.id).maybeSingle();
  const p = (player ?? {}) as Row;
  const { error } = await supabase.from("official_bookings").insert({
    official_id: officialId,
    requester_id: user.id,
    requester_name: str(p.full_name, str(p.username, "Player")),
    team_name: input.teamName,
    sport: input.sport,
    match_date: input.matchDate,
    note: input.note,
    status: "requested",
  });
  return !error;
}

export async function fetchOfficialBookings(officialId: string): Promise<OfficialBooking[]> {
  const supabase = createClient();
  const { data } = await supabase.from("official_bookings").select("*").eq("official_id", officialId).order("created_at", { ascending: false });
  return ((data ?? []) as Row[]).map((b) => ({
    id: str(b.id),
    officialId: str(b.official_id),
    requesterId: str(b.requester_id),
    requesterName: str(b.requester_name, "Player"),
    teamName: str(b.team_name),
    sport: str(b.sport),
    matchDate: str(b.match_date),
    note: str(b.note),
    status: str(b.status, "requested"),
    createdAt: str(b.created_at),
  }));
}

export async function respondBooking(bookingId: string, accept: boolean): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase.from("official_bookings").update({ status: accept ? "accepted" : "rejected" }).eq("id", bookingId);
  return !error;
}