import { createClient } from "@/lib/supabase";

export interface Scorer {
  userId: string;
  name: string;
  username: string;
  avatar: string;
  sport: string;
  goals: number;
  assists: number;
  matches: number;
}

// Golden Boot ranking: most goals; tie-break by most assists (FIFA rule) [[8]][[9]].
export async function fetchGoldenBoot(sport?: string, limit = 10): Promise<Scorer[]> {
  const supabase = createClient();
  let statsQuery = supabase
    .from("player_match_stats")
    .select("user_id, goals, assists, match_id")
    .limit(2000);
  const { data: stats } = await statsQuery;
  const rows = (stats ?? []) as Array<Record<string, unknown>>;
  if (rows.length === 0) return [];

  const agg = new Map<string, { goals: number; assists: number; matches: Set<string> }>();
  rows.forEach((r) => {
    const uid = String(r.user_id ?? "");
    if (!uid) return;
    if (!agg.has(uid)) agg.set(uid, { goals: 0, assists: 0, matches: new Set() });
    const a = agg.get(uid)!;
    a.goals += Number(r.goals ?? 0);
    a.assists += Number(r.assists ?? 0);
    if (r.match_id) a.matches.add(String(r.match_id));
  });

  const userIds = Array.from(agg.keys());
  const { data: players } = await supabase
    .from("players")
    .select("auth_id, full_name, username, profile_photo")
    .in("auth_id", userIds);
  const pmap = new Map(
    ((players ?? []) as Array<Record<string, unknown>>).map((p) => [
      String(p.auth_id),
      { name: String(p.full_name ?? "Player"), username: String(p.username ?? ""), avatar: String(p.profile_photo ?? "") },
    ])
  );

  const scorers: Scorer[] = Array.from(agg.entries()).map(([uid, a]) => {
    const p = pmap.get(uid) ?? { name: "Player", username: "", avatar: "" };
    return {
      userId: uid,
      name: p.name,
      username: p.username,
      avatar: p.avatar,
      sport: sport ?? "all",
      goals: a.goals,
      assists: a.assists,
      matches: a.matches.size,
    };
  });

  // Sort by goals desc, then assists desc (FIFA Golden Boot tie-break) [[9]].
  scorers.sort((x, y) => y.goals - x.goals || y.assists - x.assists);
  return scorers.slice(0, limit);
}