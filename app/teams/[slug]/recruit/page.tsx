import type { Metadata } from "next";
import { LocationProvider } from "@/context/LocationContext";
import TeamRecruit from "@/components/teams/TeamRecruit";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const name = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return { title: `Recruit - ${name} - Turfog` };
}

export default async function TeamRecruitPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <LocationProvider>
      <TeamRecruit slug={slug} />
    </LocationProvider>
  );
}