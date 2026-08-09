import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import LandingAuth from "@/components/landing/LandingAuth";
import AppShell from "@/components/app/AppShell";
import type { Player } from "@/types";

export const metadata: Metadata = {
  title: "Turfog - Never cancel a match again",
  description:
    "Turfog is the player-first sports community platform. Find nearby players, join matches, and build your local sports community. Never cancel a match again.",
  openGraph: {
    title: "Turfog - Never cancel a match again",
    description: "Find players, join matches, and build your local sports community, wherever you are.",
    type: "website",
  },
};

export default async function Home() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <LandingAuth />;
  }

  const { data: player } = await supabase
    .from("players")
    .select("*")
    .eq("auth_id", user.id)
    .maybeSingle();

  if (!player || !player.username_set) {
    redirect("/setup-username");
  }

  if (!(player as Record<string, unknown>).onboarded_at) {
    redirect("/onboarding");
  }

  return <AppShell player={player as Player} />;
}