import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PublicProfile from "@/components/profile/PublicProfile";

const MOCK_USERNAMES = [
  "rahul_sharma",
  "priya_patel",
  "arjun_nair",
  "sneha_reddy",
  "vikram_singh",
  "ananya_iyer",
];

export function generateStaticParams() {
  return MOCK_USERNAMES.map((username) => ({ username }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const name = username
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title: `${name} - Turfog`,
    description: `${name}'s sports profile on Turfog. Matches, stats, achievements, and sporting journey. Never cancel a match again.`,
    openGraph: {
      title: `${name} - Turfog`,
      description: `View ${name}'s sports profile, match history, and achievements on Turfog.`,
      type: "profile",
    },
  };
}

export default async function UsernamePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  if (!MOCK_USERNAMES.includes(username)) {
    notFound();
  }

  return <PublicProfile username={username} />;
}
