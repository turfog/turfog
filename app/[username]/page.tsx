import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { fetchProfileView } from "@/lib/profile";
import PublicProfile from "@/components/profile/PublicProfile";
import PerformancePanel from "@/components/matches/PerformancePanel";
import EndorsementPanel from "@/components/endorsements/EndorsementPanel";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  const name = username.replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${name} - Turfog`,
    description: `${name}'s sports identity on Turfog. Live status, matches, performance, reputation, and endorsements.`,
    openGraph: { title: `${name} - Turfog`, description: `${name}'s public sports profile on Turfog.`, type: "profile" },
  };
}

export default async function UsernamePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const supa = await createServerSupabaseClient();
  const { data: { user } } = await supa.auth.getUser();
  const payload = await fetchProfileView(username, user?.id ?? null);
  if (!payload) notFound();
  return (
    <div className="bg-neutral-100">
      <PublicProfile payload={payload} />
      <PerformancePanel targetUserId={payload.view.id ?? ""} />
      <EndorsementPanel
        targetUserId={payload.view.id ?? ""}
        targetUsername={payload.view.username}
        myId={payload.viewer.myId}
      />
    </div>
  );
}