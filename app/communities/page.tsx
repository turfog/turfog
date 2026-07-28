import { requireAuth, getCurrentPlayerProfile } from "@/lib/auth-service";
import MobileHeader from "@/components/dashboard/MobileHeader";
import MobileBottomNav from "@/components/dashboard/MobileBottomNav";
import LeftNav from "@/components/dashboard/LeftNav";
import CommunitiesClient from "./CommunitiesClient";

export const metadata = {
  title: "Communities | Turfog",
  description: "Join sports communities near you and never cancel a match again.",
};

export default async function CommunitiesPage() {
  const user = await requireAuth();
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
          <CommunitiesClient />
        </main>

        <aside className="hidden lg:block h-screen sticky top-0 overflow-y-auto border-l border-neutral-200 bg-white" />
      </div>

      <MobileBottomNav player={player} />
    </div>
  );
}