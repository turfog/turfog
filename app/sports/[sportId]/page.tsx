import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SPORTS, APP_NAME } from "@/lib/constants";
import type { SportId } from "@/types";
import SportPageClient from "@/components/sports/SportPageClient";

export function generateStaticParams() {
  return SPORTS.map((sport) => ({ sportId: sport.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sportId: string }>;
}): Promise<Metadata> {
  const { sportId } = await params;
  const sport = SPORTS.find((s) => s.id === (sportId as SportId));

  if (!sport) {
    return { title: "Sport not found" };
  }

  return {
    title: `${sport.name} - ${APP_NAME}`,
    description: `Find ${sport.name} players, join matches, and build your local ${sport.name} community. ${sport.tagline}. Never cancel a match again.`,
    keywords: [
      sport.name.toLowerCase(),
      `${sport.name.toLowerCase()} players`,
      `${sport.name.toLowerCase()} matches`,
      "turfog",
      "sports community",
    ],
    openGraph: {
      title: `${sport.name} - ${APP_NAME}`,
      description: `Find ${sport.name} players and join matches near you. ${sport.tagline}.`,
      type: "website",
    },
  };
}

export default async function SportPage({
  params,
}: {
  params: Promise<{ sportId: string }>;
}) {
  const { sportId } = await params;
  const sport = SPORTS.find((s) => s.id === (sportId as SportId));

  if (!sport) {
    notFound();
  }

  return <SportPageClient sport={sport} />;
}
