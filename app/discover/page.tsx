import { requireAuth } from "@/lib/auth-service";
import MobileHeader from "@/components/dashboard/MobileHeader";
import MobileBottomNav from "@/components/dashboard/MobileBottomNav";
import LeftNav from "@/components/dashboard/LeftNav";
import LocationBar from "@/components/heartbeat/LocationBar";
import SportsRadar from "@/components/feed/SportsRadar";
import AIDiscovery from "@/components/feed/AIDiscovery";
import TrendingToday from "@/components/feed/TrendingToday";
import DiscoverFilters from "@/components/discover/DiscoverFilters";
import { getCurrentPlayerProfile } from "@/lib/auth-service";

export const metadata = {
  title: "Discover | Turfog",
  description: "Discover players, matches, and hot zones near you.",
};

export default async function DiscoverPage() {
 await requireAuth();
  const player = await getCurrentPlayerProfile();

  if (!player) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="w-10 h-10 border-3 border-primary-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <MobileHeader player={player} />

      <div className="lg:grid lg:grid-cols-[15%_67%_18%] max-w-[1920px] mx-auto">
        <aside className="hidden lg:block h-screen sticky top-0 overflow-y-auto border-r border-neutral-200 bg-white">
          <LeftNav player={player} />
        </aside>

        <main className="pb-20 lg:pb-0">
          <LocationBar />
          <div className="px-4 py-4 space-y-6">
            <SportsRadar />
            <AIDiscovery />
            <TrendingToday />
          </div>
        </main>

        <aside className="hidden lg:block h-screen sticky top-0 overflow-y-auto border-l border-neutral-200 bg-white">
          <div className="p-4">
            <h3 className="text-body-sm font-semibold text-neutral-900 mb-3">
              Quick filters
            </h3>
            <DiscoverFilters />
          </div>
        </aside>
      </div>

      <MobileBottomNav player={player} />
    </div>
  );
}