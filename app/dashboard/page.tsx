import { requireAuth } from "@/lib/auth-service";
import { getCurrentPlayerProfile } from "@/lib/auth-service";
import LeftNav from "@/components/dashboard/LeftNav";
import RightPanel from "@/components/dashboard/RightPanel";
import MobileHeader from "@/components/dashboard/MobileHeader";
import MobileBottomNav from "@/components/dashboard/MobileBottomNav";
import IWantToPlay from "@/components/heartbeat/IWantToPlay";
import LookingForPlayer from "@/components/heartbeat/LookingForPlayer";
import SportsFeed from "@/components/feed/SportsFeed";
import LocationBar from "@/components/heartbeat/LocationBar";

/**
 * Dashboard Page - Server Component
 * The master layout wrapper using 15/67/18 CSS Grid on desktop
 * Mobile: Stacked layout with bottom navigation
 */
export default async function DashboardPage() {
  // Ensure user is authenticated
  await requireAuth();

  // Fetch player profile for the sidebar
  const player = await getCurrentPlayerProfile();

  if (!player) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-primary-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-body-md text-neutral-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Mobile Header - Only visible on small screens */}
      <MobileHeader player={player} />

      {/* Desktop Grid Layout */}
      <div className="lg:grid lg:grid-cols-[15%_67%_18%] lg:gap-0 max-w-[1920px] mx-auto">
        {/* Left Navigation - 15% */}
        <aside className="hidden lg:block h-screen sticky top-0 overflow-y-auto border-r border-neutral-200 bg-white">
          <LeftNav player={player} />
        </aside>

        {/* Center Feed - 67% */}
        <main className="min-h-screen pb-20 lg:pb-0">
          {/* Location Bar */}
          <LocationBar />

          {/* Heartbeat Actions */}
          <div className="px-4 pt-4 pb-2 space-y-3">
            <IWantToPlay player={player} />
            <LookingForPlayer player={player} />
          </div>

          {/* Sports Feed */}
          <div className="px-4 py-4">
            <SportsFeed />
          </div>
        </main>

        {/* Right Panel - 18% */}
        <aside className="hidden lg:block h-screen sticky top-0 overflow-y-auto border-l border-neutral-200 bg-white">
          <RightPanel />
        </aside>
      </div>

      {/* Mobile Bottom Navigation - Only visible on small screens */}
      <MobileBottomNav player={player} />
    </div>
  );
}