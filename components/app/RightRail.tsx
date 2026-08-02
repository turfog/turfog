import PlayersWanted from "@/components/discovery/PlayersWanted";
import RadarMini from "@/components/discovery/RadarMini";
import NearbyPlayers from "@/components/discovery/NearbyPlayers";
import TrendingWidget from "@/components/discovery/TrendingWidget";

export default function RightRail() {
  return (
    <div className="hidden xl:block">
      <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-hide px-4 py-5 space-y-4">
        <PlayersWanted variant="rail" />
        <RadarMini />
        <NearbyPlayers limit={4} />
        <TrendingWidget />
      </div>
    </div>
  );
}