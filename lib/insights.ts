import { createClient } from "@/lib/supabase";

export interface Insight {
  id: string;
  icon: "players" | "match" | "market" | "trophy";
  title: string;
  detail: string;
  href: string;
}

export async function fetchInsights(): Promise<Insight[]> {
  const supabase = createClient();
  const [reqRes, hbRes, mktRes, tournRes] = await Promise.all([
    supabase.from("match_requests").select("id, sport, area, needed").eq("is_active", true).limit(20),
    supabase.from("heartbeats").select("id, sport").eq("is_active", true).limit(20),
    supabase.from("marketplace_listings").select("id").eq("is_active", true).limit(20),
    supabase.from("tournaments").select("id, status").eq("status", "registration").limit(20),
  ]);

  const insights: Insight[] = [];

  const reqs = (reqRes.data ?? []) as Array<Record<string, unknown>>;
  if (reqs.length > 0) {
    const sportCounts = new Map<string, number>();
    reqs.forEach((r) => {
      const s = String(r.sport ?? "match");
      sportCounts.set(s, (sportCounts.get(s) ?? 0) + 1);
    });
    const top = Array.from(sportCounts.entries()).sort((a, b) => b[1] - a[1])[0];
    if (top) {
      insights.push({
        id: "matches",
        icon: "match",
        title: `${top[1]} ${top[0]} ${top[1] === 1 ? "match needs" : "matches need"} players`,
        detail: "Teams near you are short on players. Jump in.",
        href: "/games",
      });
    }
  }

  const hbs = (hbRes.data ?? []) as Array<Record<string, unknown>>;
  if (hbs.length > 0) {
    insights.push({
      id: "players",
      icon: "players",
      title: `${hbs.length} ${hbs.length === 1 ? "player is" : "players are"} ready to play now`,
      detail: "Nearby players went live and are looking for a game.",
      href: "/games",
    });
  }

  const mkts = (mktRes.data ?? []) as Array<Record<string, unknown>>;
  if (mkts.length > 0) {
    insights.push({
      id: "market",
      icon: "market",
      title: `${mkts.length} ${mkts.length === 1 ? "listing" : "listings"} in the marketplace`,
      detail: "Coaches, gear, and venues from your community.",
      href: "/marketplace",
    });
  }

  const tourns = (tournRes.data ?? []) as Array<Record<string, unknown>>;
  if (tourns.length > 0) {
    insights.push({
      id: "trophy",
      icon: "trophy",
      title: `${tourns.length} ${tourns.length === 1 ? "tournament is" : "tournaments are"} open for registration`,
      detail: "Register your team before slots fill up.",
      href: "/tournaments",
    });
  }

  return insights.slice(0, 3);
}