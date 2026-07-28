import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { getAuthenticatedUser } from "@/lib/auth-service";
import { mapToPublicProfile } from "@/types/player";
import type { Player } from "@/types/database";
import ProfileClient from "./ProfileClient";
import MobileHeader from "@/components/dashboard/MobileHeader";
import MobileBottomNav from "@/components/dashboard/MobileBottomNav";
import LeftNav from "@/components/dashboard/LeftNav";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const { username } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: player } = await supabase
    .from("players")
    .select("*")
    .eq("username", username.toLowerCase())
    .single();

  if (!player) {
    return { title: "Profile not found | Turfog" };
  }

  return {
    title: `${player.full_name} (@${player.username}) | Turfog`,
    description: player.bio || `${player.full_name} on Turfog`,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const supabase = await createServerSupabaseClient();
  const currentUser = await getAuthenticatedUser();

  const { data: player, error } = await supabase
    .from("players")
    .select("*")
    .eq("username", username.toLowerCase())
    .single();

  if (error || !player) {
    notFound();
  }

  const profile = mapToPublicProfile(player);
  const isOwnProfile = currentUser?.id === player.auth_id;

  // Fetch own player data for layout components
  let ownPlayer: Player | null = null;
  if (currentUser) {
    const { data: own } = await supabase
      .from("players")
      .select("*")
      .eq("auth_id", currentUser.id)
      .single();
    ownPlayer = own;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {ownPlayer && <MobileHeader player={ownPlayer} />}

      <div className="lg:grid lg:grid-cols-[15%_67%_18%] max-w-[1920px] mx-auto">
        <aside className="hidden lg:block h-screen sticky top-0 overflow-y-auto border-r border-neutral-200 bg-white">
          {ownPlayer ? <LeftNav player={ownPlayer} /> : <LeftNavPlaceholder />}
        </aside>

        <main className="pb-20 lg:pb-0">
          <ProfileClient
            profile={profile}
            isOwnProfile={isOwnProfile}
            currentUserId={currentUser?.id}
          />
        </main>

        <aside className="hidden lg:block h-screen sticky top-0 overflow-y-auto border-l border-neutral-200 bg-white" />
      </div>

      {ownPlayer && <MobileBottomNav player={ownPlayer} />}
    </div>
  );
}

function LeftNavPlaceholder() {
  return (
    <div className="flex flex-col h-full px-3 py-4">
      <div className="flex items-center gap-2.5 px-2 mb-6">
        <div className="w-9 h-9 bg-primary-green rounded-xl flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="5" r="2" />
            <path d="M10 22l.5-5 1.5 2 1.5-3" />
          </svg>
        </div>
        <span className="font-display text-xl font-bold text-neutral-900">Turfog</span>
      </div>
      <div className="flex-1" />
    </div>
  );
}