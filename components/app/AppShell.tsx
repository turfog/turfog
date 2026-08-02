import TopBar from "@/components/dashboard/TopBar";
import LeftNav from "@/components/dashboard/LeftNav";
import HomeCenter from "@/components/app/HomeCenter";
import RightRail from "@/components/app/RightRail";
import MobileBottomNav from "@/components/dashboard/MobileBottomNav";
import { LocationProvider } from "@/context/LocationContext";
import { DiscoveryProvider } from "@/context/DiscoveryContext";
import type { Player } from "@/types";

export default function AppShell({ player }: { player: Player }) {
  return (
    <LocationProvider>
      <DiscoveryProvider>
        <div className="min-h-screen bg-neutral-100">
          <TopBar player={player} />
          <div className="mx-auto max-w-[1400px] grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_320px]">
            <LeftNav player={player} />
            <main className="min-h-screen px-3 sm:px-4 lg:px-6 py-4 lg:py-6 pb-24 lg:pb-8">
              <HomeCenter player={player} />
            </main>
            <RightRail />
          </div>
          <MobileBottomNav />
        </div>
      </DiscoveryProvider>
    </LocationProvider>
  );
}