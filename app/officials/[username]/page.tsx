import type { Metadata } from "next";
import OfficialProfile from "@/components/officials/OfficialProfile";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  const name = username.replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return { title: `${name} - Official - Turfog`, description: `${name} is a sports official on Turfog.` };
}

export default async function OfficialPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return <OfficialProfile username={username} />;
}