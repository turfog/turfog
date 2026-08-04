import type { Metadata } from "next";
import MatchDetailClient from "@/components/matches/MatchDetailClient";

export const metadata: Metadata = {
  title: "Match - Turfog",
  description: "Match result and player performance on Turfog.",
};

export default async function MatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MatchDetailClient matchId={id} />;
}