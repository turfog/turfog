import PlayersWanted from "@/components/discovery/PlayersWanted";
import AvailablePlayers from "@/components/discovery/AvailablePlayers";
import TrendingWidget from "@/components/discovery/TrendingWidget";

export default function RightRail() {
  return (
    <aside className="hidden xl:block">
      <div className="sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto turfog-scroll space-y-4 py-2 pr-1">
        {/* Live discovery panel */}
        <div className="surface-card p-4">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <h3 className="text-[12px] font-semibold text-neutral-700 uppercase tracking-wider">Live discovery</h3>
            </div>
          </div>
          <PlayersWanted variant="rail" />
        </div>

        {/* Nearby players */}
        <div className="surface-card p-4">
          <div className="flex items-center gap-2 mb-3 px-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <h3 className="text-[12px] font-semibold text-neutral-700 uppercase tracking-wider">Nearby players</h3>
          </div>
          <AvailablePlayers variant="rail" />
        </div>

        {/* Trending */}
        <div className="surface-card p-4">
          <div className="flex items-center gap-2 mb-3 px-1">
            <span className="w-1.5 h-1.5 rounded-full bg-coral" />
            <h3 className="text-[12px] font-semibold text-neutral-700 uppercase tracking-wider">Trending</h3>
          </div>
          <TrendingWidget />
        </div>

        {/* Footer */}
        <div className="px-4 py-3 text-[10px] text-neutral-400 space-y-1">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <a href="#" className="hover:text-neutral-600 transition-colors">About</a>
            <a href="#" className="hover:text-neutral-600 transition-colors">Help</a>
            <a href="#" className="hover:text-neutral-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-neutral-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-neutral-600 transition-colors">API</a>
          </div>
          <p className="tracking-wide">© 2026 Turfog · Never Cancel a Match Again</p>
        </div>
      </div>
    </aside>
  );
}