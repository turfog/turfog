import type { Metadata } from "next";
import TeamManage from "@/components/teams/TeamManage";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const name = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return { title: `Manage ${name} - Turfog` };
}

export default async function TeamManagePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <TeamManage slug={slug} />;
}