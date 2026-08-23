import { Activity, Users, DollarSign, TrendingUp, TrendingDown, Zap, Megaphone } from "lucide-react";
import { fetchDashboardStats } from "./stats-actions";

export default async function AdminDashboard() {
  const stats = await fetchDashboardStats();

  const kpis = [
    { label: "Total Users", value: stats.totalUsers.toLocaleString(), change: `+${stats.newUsers7d} this week`, trend: "up", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Matches", value: stats.matches.toLocaleString(), change: "all time", trend: "up", icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Marketplace GMV", value: `₹${stats.gmv.toLocaleString()}`, change: stats.gmv > 0 ? "live" : "no orders yet", trend: stats.gmv > 0 ? "up" : "down", icon: DollarSign, color: "text-rose-600", bg: "bg-rose-50" },
    { label: "Ad Revenue", value: `₹${stats.adRevenue.toLocaleString()}`, change: stats.adRevenue > 0 ? "live" : "no spend yet", trend: stats.adRevenue > 0 ? "up" : "down", icon: Megaphone, color: "text-indigo-600", bg: "bg-indigo-50" },
  ];

  const attention = [
    { id: 1, type: "Trust & Safety", title: `${stats.pendingReports} report${stats.pendingReports === 1 ? "" : "s"} pending review`, severity: stats.pendingReports > 0 ? "high" : "low", time: "live" },
    { id: 2, type: "Growth", title: `${stats.newUsers7d} new users joined in the last 7 days`, severity: "medium", time: "7d" },
    { id: 3, type: "Monetization", title: `Marketplace GMV at ₹${stats.gmv.toLocaleString()}`, severity: "low", time: "live" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-[28px] font-bold text-neutral-900 tracking-tight">Good morning, Admin</h1>
        <p className="text-[14px] text-neutral-500 mt-1">Live overview of the Turfog platform, straight from your database.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white border border-neutral-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg ${kpi.bg} flex items-center justify-center ${kpi.color}`}>
                <kpi.icon size={20} />
              </div>
              {kpi.trend === "up" ? <TrendingUp size={16} className="text-emerald-500" /> : <TrendingDown size={16} className="text-rose-500" />}
            </div>
            <p className="text-[24px] font-bold text-neutral-900 tracking-tight">{kpi.value}</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-[12px] font-medium text-neutral-500">{kpi.label}</p>
              <p className={`text-[11px] font-bold ${kpi.trend === "up" ? "text-emerald-600" : "text-rose-600"}`}>{kpi.change}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-xl p-6 min-h-[300px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[15px] font-semibold text-neutral-900">Platform Growth (30 Days)</h2>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-[11px] font-semibold bg-neutral-100 text-neutral-700 rounded-md">Users</button>
              <button className="px-3 py-1 text-[11px] font-semibold text-neutral-500 hover:bg-neutral-50 rounded-md">Revenue</button>
              <button className="px-3 py-1 text-[11px] font-semibold text-neutral-500 hover:bg-neutral-50 rounded-md">Matches</button>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-neutral-200 rounded-lg bg-neutral-50/50">
            <p className="text-[13px] text-neutral-400">[ Analytics chart renders here in Phase 3 ]</p>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-semibold text-neutral-900">Requires Attention</h2>
            <Zap size={16} className="text-amber-500" />
          </div>
          <div className="space-y-3">
            {attention.map((action) => (
              <div key={action.id} className="p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${action.severity === "high" ? "bg-rose-500" : action.severity === "medium" ? "bg-amber-500" : "bg-blue-500"}`} />
                  <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">{action.type}</p>
                </div>
                <p className="text-[13px] font-medium text-neutral-900 leading-snug">{action.title}</p>
                <p className="text-[11px] text-neutral-400 mt-1">{action.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}