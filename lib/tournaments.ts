import { createClient } from "@/lib/supabase";

export interface Tournament {
  id: string;
  name: string;
  slug: string;
  sport: string;
  city: string | null;
  startDate: string | null;
  endDate: string | null;
  status: "upcoming" | "live" | "completed";
  teamCount: number;
}

export async function fetchTournaments(): Promise<Tournament[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tournaments")
    .select(`
      id,
      name,
      slug,
      sport,
      city,
      start_date,
      end_date,
      status,
      team_count:tournament_teams(count)
    `)
    .order("start_date", { ascending: false });

  if (error || !data) return [];

  return (data as any[]).map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    sport: t.sport,
    city: t.city,
    startDate: t.start_date,
    endDate: t.end_date,
    status: t.status,
    teamCount: t.team_count?.[0]?.count ?? 0,
  }));
}