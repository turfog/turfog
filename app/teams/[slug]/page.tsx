import type { Metadata } from "next";
import TeamProfile from "@/components/teams/TeamProfile";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const name = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${name} - Turfog`,
    description: `${name} team on Turfog. Roster, matches, and team feed.`,
  };
}

export default async function TeamPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <TeamProfile slug={slug} />;
}