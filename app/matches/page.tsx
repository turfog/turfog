import type { Metadata } from "next";
import MatchesHubClient from "@/components/matches/MatchesHubClient";

export const metadata: Metadata = {
  title: "Matches - Turfog",
  description: "Record match results and log your performance stats.",
};

export default function MatchesPage() {
  return <MatchesHubClient />;
}