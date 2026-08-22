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

export async function fetchUserTeams(): Promise<Array<{ id: string; name: string; slug: string }>> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from("team_members")
    .select("teams(id, name, slug)")
    .in("role", ["owner", "captain"])
    .eq("user_id", user.id);
  return (data ?? []).map((m: any) => m.teams).filter(Boolean) as Array<{ id: string; name: string; slug: string }>;
}

export async function registerTeamForTournament(tournamentId: string, teamId: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase.from("tournament_teams").insert({
    tournament_id: tournamentId,
    team_id: teamId,
  });
  return !error;
}