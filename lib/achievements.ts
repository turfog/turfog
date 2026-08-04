import { createClient } from "@/lib/supabase";

export interface AchievementStats {
  matchesPlayed: number;
  goals: number;
  assists: number;
  runs: number;
  wickets: number;
  saves: number;
  points: number;
  mvps: number;
  maxGoalsInMatch: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  current: number;
  target: number;
  earned: boolean;
}

const EMPTY: AchievementStats = {
  matchesPlayed: 0, goals: 0, assists: 0, runs: 0, wickets: 0, saves: 0, points: 0, mvps: 0, maxGoalsInMatch: 0,
};

export async function fetchAchievementStats(userId: string): Promise<AchievementStats> {
  if (!userId) return EMPTY;
  const supabase = createClient();
  const { data } = await supabase.from("player_match_stats").select("*").eq("user_id", userId);
  const rows = (data ?? []) as Array<Record<string, unknown>>;
  if (rows.length === 0) return EMPTY;

  const matchIds = new Set<string>();
  let goals = 0, assists = 0, runs = 0, wickets = 0, saves = 0, points = 0, mvps = 0, maxGoals = 0;
  rows.forEach((r) => {
    matchIds.add(String(r.match_id));
    const g = Number(r.goals ?? 0);
    goals += g;
    if (g > maxGoals) maxGoals = g;
    assists += Number(r.assists ?? 0);
    runs += Number(r.runs ?? 0);
    wickets += Number(r.wickets ?? 0);
    saves += Number(r.saves ?? 0);
    points += Number(r.points ?? 0);
    if (r.mvp === true) mvps += 1;
  });

  return { matchesPlayed: matchIds.size, goals, assists, runs, wickets, saves, points, mvps, maxGoalsInMatch: maxGoals };
}

export function computeAchievements(s: AchievementStats): Achievement[] {
  const defs: Array<Omit<Achievement, "earned">> = [
    { id: "first-match", title: "First Match", description: "Play your first match", icon: "users", target: 1, current: s.matchesPlayed },
    { id: "regular", title: "Regular", description: "Play 10 matches", icon: "users", target: 10, current: s.matchesPlayed },
    { id: "veteran", title: "Veteran", description: "Play 25 matches", icon: "shield", target: 25, current: s.matchesPlayed },
    { id: "first-goal", title: "First Goal", description: "Score your first goal", icon: "star", target: 1, current: s.goals },
    { id: "goal-scorer", title: "Goal Scorer", description: "Score 10 goals", icon: "star", target: 10, current: s.goals },
    { id: "goal-machine", title: "Goal Machine", description: "Score 25 goals", icon: "trophy", target: 25, current: s.goals },
    { id: "playmaker", title: "Playmaker", description: "Provide 10 assists", icon: "star", target: 10, current: s.assists },
    { id: "hat-trick", title: "Hat-trick Hero", description: "Score 3 goals in one match", icon: "trophy", target: 3, current: s.maxGoalsInMatch },
    { id: "mvp", title: "MVP", description: "Win an MVP award", icon: "star", target: 1, current: s.mvps },
    { id: "mvp-machine", title: "MVP Machine", description: "Win 5 MVP awards", icon: "trophy", target: 5, current: s.mvps },
    { id: "run-scorer", title: "Run Scorer", description: "Score 50 runs", icon: "star", target: 50, current: s.runs },
    { id: "wicket-taker", title: "Wicket Taker", description: "Take 10 wickets", icon: "shield", target: 10, current: s.wickets },
    { id: "guardian", title: "Guardian", description: "Make 10 saves", icon: "shield", target: 10, current: s.saves },
  ];
  return defs.map((d) => ({
    ...d,
    current: Math.min(d.current, d.target),
    earned: d.current >= d.target,
  }));
}