import { createClient } from "@/lib/supabase";

type Row = Record<string, unknown>;
const str = (v: unknown, d = ""): string => (v == null ? d : String(v));
const num = (v: unknown, d = 0): number => (typeof v === "number" ? v : Number(v) || d);

export interface LeaderboardEntry {
  userId: string;
  username: string;
  fullName: string;
  avatar: string;
  verified: boolean;
  city: string;
  value: number;
  presence: string;
}

export interface Leaderboards {
  active: LeaderboardEntry[];
  favorites: LeaderboardEntry[];
  reliable: LeaderboardEntry[];
  matchmakers: LeaderboardEntry[];
  leaders: LeaderboardEntry[];
}

interface Base {
  username: string;
  fullName: string;
  avatar: string;
  verified: boolean;
  city: string;
  followers: number;
  reliability: number;
  presence: string;
}

export async function fetchLeaderboards(): Promise<Leaderboards> {
  const supabase = createClient();
  const [playersRes, postsRes, partsRes, reqsRes, membersRes, verifiedMatchesRes, verifiedOrgRes] = await Promise.all([
    supabase.from("players").select("auth_id, username, full_name, profile_photo, verification_status, city, followers_count, reliability_score, presence_status").limit(500),
    supabase.from("posts").select("author_id").limit(2000),
    supabase.from("match_request_participants").select("user_id").eq("status", "joined").limit(2000),
    supabase.from("match_requests").select("organizer_id").limit(2000),
    supabase.from("team_members").select("user_id, role").in("role", ["captain", "owner"]).limit(2000),
    // Verified match participation (from player_match_stats joined with verified matches)
    supabase.from("player_match_stats").select("user_id, matches!inner(verification_status)").eq("matches.verification_status", "verified").limit(5000),
    // Verified matches organized (creator of a verified completed match)
    supabase.from("matches").select("created_by").eq("verification_status", "verified").limit(2000),
  ]);

  const base = new Map<string, Base>();
  ((playersRes.data ?? []) as Row[]).forEach((p) => {
    const id = str(p.auth_id);
    if (!id) return;
    base.set(id, {
      username: str(p.username),
      fullName: str(p.full_name, "Player"),
      avatar: str(p.profile_photo),
      verified: p.verification_status === "verified",
      city: str(p.city),
      followers: num(p.followers_count),
      reliability: num(p.reliability_score, 0),
      presence: str(p.presence_status),
    });
  });

  const postCount = new Map<string, number>();
  ((postsRes.data ?? []) as Row[]).forEach((r) => {
    const id = str(r.author_id);
    if (id) postCount.set(id, (postCount.get(id) ?? 0) + 1);
  });

  const joinedCount = new Map<string, number>();
  ((partsRes.data ?? []) as Row[]).forEach((r) => {
    const id = str(r.user_id);
    if (id) joinedCount.set(id, (joinedCount.get(id) ?? 0) + 1);
  });

  const orgCount = new Map<string, number>();
  ((reqsRes.data ?? []) as Row[]).forEach((r) => {
    const id = str(r.organizer_id);
    if (id) orgCount.set(id, (orgCount.get(id) ?? 0) + 1);
  });

  const leaderCount = new Map<string, number>();
  ((membersRes.data ?? []) as Row[]).forEach((r) => {
    const id = str(r.user_id);
    if (id) leaderCount.set(id, (leaderCount.get(id) ?? 0) + 1);
  });

  // Verified match participation (count distinct matches per user).
  // The query already filters to verified matches, so each row counts as one.
  const verifiedParticipation = new Map<string, number>();
  ((verifiedMatchesRes.data ?? []) as Row[]).forEach((r) => {
    const id = str(r.user_id);
    if (id) verifiedParticipation.set(id, (verifiedParticipation.get(id) ?? 0) + 1);
  });

  // Verified matches organized
  const verifiedOrgCount = new Map<string, number>();
  ((verifiedOrgRes.data ?? []) as Row[]).forEach((r) => {
    const id = str(r.created_by);
    if (id) verifiedOrgCount.set(id, (verifiedOrgCount.get(id) ?? 0) + 1);
  });

  const entry = (id: string, value: number): LeaderboardEntry | null => {
    const b = base.get(id);
    if (!b) return null;
    return { userId: id, username: b.username, fullName: b.fullName, avatar: b.avatar, verified: b.verified, city: b.city, presence: b.presence, value };
  };

  const active: LeaderboardEntry[] = [];
  new Set([...postCount.keys(), ...joinedCount.keys(), ...verifiedParticipation.keys()]).forEach((id) => {
    const v = (postCount.get(id) ?? 0) + (joinedCount.get(id) ?? 0) + (verifiedParticipation.get(id) ?? 0);
    const e = entry(id, v);
    if (e) active.push(e);
  });
  active.sort((a, b) => b.value - a.value);

  const favorites: LeaderboardEntry[] = [];
  base.forEach((b, id) => {
    if (b.followers > 0) {
      const e = entry(id, b.followers);
      if (e) favorites.push(e);
    }
  });
  favorites.sort((a, b) => b.value - a.value);

  const reliable: LeaderboardEntry[] = [];
  base.forEach((b, id) => {
    if (b.reliability > 0) {
      const e = entry(id, Number(b.reliability.toFixed(1)));
      if (e) reliable.push(e);
    }
  });
  reliable.sort((a, b) => b.value - a.value);

  const matchmakers: LeaderboardEntry[] = [];
  // Use verified match organizers (primary) + fall back to request organizers who also got their matches verified
  new Set([...orgCount.keys(), ...verifiedOrgCount.keys()]).forEach((id) => {
    const v = verifiedOrgCount.get(id) ?? 0;
    if (v > 0) {
      const e = entry(id, v);
      if (e) matchmakers.push(e);
    }
  });
  matchmakers.sort((a, b) => b.value - a.value);

  const leaders: LeaderboardEntry[] = [];
  leaderCount.forEach((v, id) => {
    const e = entry(id, v);
    if (e) leaders.push(e);
  });
  leaders.sort((a, b) => b.value - a.value);

  return {
    active: active.slice(0, 10),
    favorites: favorites.slice(0, 10),
    reliable: reliable.slice(0, 10),
    matchmakers: matchmakers.slice(0, 10),
    leaders: leaders.slice(0, 10),
  };
}