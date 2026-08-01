import LeftNav from "@/components/dashboard/LeftNav";
import RightPanel from "@/components/dashboard/RightPanel";
import MobileHeader from "@/components/dashboard/MobileHeader";
import MobileBottomNav from "@/components/dashboard/MobileBottomNav";
import DashboardCenter from "@/components/dashboard/DashboardCenter";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-neutral-100">
      <MobileHeader />
      <div className="grid grid-cols-1 lg:grid-cols-[15%_1fr] xl:grid-cols-[15%_1fr_18%] max-w-[1600px] mx-auto">
        <LeftNav />
        <main className="min-h-screen pb-24 lg:pb-8 px-4 lg:px-6 py-4 lg:py-6">
          <DashboardCenter />
        </main>
        <RightPanel />
      </div>
      <MobileBottomNav />
    </div>
  );
}
