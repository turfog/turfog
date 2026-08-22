import type { Metadata } from "next";
import TournamentDetailClient from "@/components/tournaments/TournamentDetailClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const name = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${name} - Tournaments - Turfog`,
    description: `Follow the ${name} tournament. Brackets, fixtures, and team standings.`,
  };
}

export default async function TournamentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <TournamentDetailClient slug={slug} />;
}