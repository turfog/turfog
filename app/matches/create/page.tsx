import { requireAuth, getCurrentPlayerProfile } from "@/lib/auth-service";
import MobileHeader from "@/components/dashboard/MobileHeader";
import MobileBottomNav from "@/components/dashboard/MobileBottomNav";
import LeftNav from "@/components/dashboard/LeftNav";
import CreateMatchClient from "./CreateMatchClient";

export const metadata = {
  title: "Create match | Turfog",
  description: "Create a new match and find players near you.",
};

export default async function CreateMatchPage() {
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
          <CreateMatchClient />
        </main>

        <aside className="hidden lg:block h-screen sticky top-0 overflow-y-auto border-l border-neutral-200 bg-white" />
      </div>

      <MobileBottomNav player={player} />
    </div>
  );
}