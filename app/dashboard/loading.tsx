import Skeleton from "@/components/ui/Skeleton";

/**
 * Dashboard Loading State
 * Shown while the dashboard page data is being fetched
 */
export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Mobile Header Skeleton */}
      <div className="lg:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-neutral-200">
        <div className="flex items-center justify-between px-4 h-14">
          <Skeleton variant="rectangular" width={80} height={32} className="rounded-lg" />
          <div className="flex items-center gap-2">
            <Skeleton variant="circular" width={36} height={36} />
            <Skeleton variant="circular" width={36} height={36} />
          </div>
        </div>
      </div>

      {/* Desktop Grid Skeleton */}
      <div className="lg:grid lg:grid-cols-[15%_67%_18%] max-w-[1920px] mx-auto">
        {/* Left Nav Skeleton */}
        <aside className="hidden lg:flex flex-col h-screen sticky top-0 border-r border-neutral-200 bg-white p-4 gap-3">
          <Skeleton variant="rectangular" width={120} height={36} className="rounded-xl mb-4" />
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} variant="rectangular" width="100%" height={40} className="rounded-lg" />
          ))}
        </aside>

        {/* Center Feed Skeleton */}
        <main className="p-4 space-y-4">
          <Skeleton variant="rectangular" width="100%" height={40} className="rounded-xl" />
          <Skeleton variant="rectangular" width="100%" height={200} className="rounded-2xl" />
          <Skeleton variant="rectangular" width="100%" height={200} className="rounded-2xl" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rectangular" width="100%" height={100} className="rounded-xl" />
          ))}
        </main>

        {/* Right Panel Skeleton */}
        <aside className="hidden lg:flex flex-col h-screen sticky top-0 border-l border-neutral-200 bg-white p-4 gap-3">
          <Skeleton variant="rectangular" width="100%" height={32} className="rounded-lg" />
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="rectangular" width="100%" height={80} className="rounded-xl" />
          ))}
        </aside>
      </div>

      {/* Mobile Bottom Nav Skeleton */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-t border-neutral-200">
        <div className="flex items-center justify-around h-16 px-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} variant="circular" width={28} height={28} />
          ))}
        </div>
      </nav>
    </div>
  );
}