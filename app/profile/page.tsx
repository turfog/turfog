import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { fetchProfileView } from "@/lib/profile";
import ProfileClient from "@/components/profile/ProfileClient";

export const metadata: Metadata = {
  title: "Your profile - Turfog",
  description: "Your Turfog player profile. Matches, posts, reputation, and achievements.",
};

export default async function ProfilePage() {
  const supa = await createServerSupabaseClient();
  const { data: { user } } = await supa.auth.getUser();
  if (!user) redirect("/");
  const { data: me } = await supa.from("players").select("username").eq("auth_id", user.id).maybeSingle();
  const username = (me as { username: string } | null)?.username;
  if (!username) redirect("/setup-username");
  const payload = await fetchProfileView(username, user.id);
  if (!payload) redirect("/setup-username");
  return <ProfileClient payload={payload} />;
}