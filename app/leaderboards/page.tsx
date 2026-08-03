import type { Metadata } from "next";
import LeaderboardsClient from "@/components/leaderboards/LeaderboardsClient";

export const metadata: Metadata = {
  title: "Leaderboards - Turfog",
  description: "Live sports rankings: most active, community favorites, most reliable, top matchmakers, and leaders.",
};

export default function LeaderboardsPage() {
  return <LeaderboardsClient />;
}