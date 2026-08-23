"use client";

import { useState, useEffect } from "react";
import { DataTable, Column } from "@/components/admin/admin-ui/DataTable";
import { AdvertisingReviewDrawer } from "@/components/admin/admin-ui/AdvertisingReviewDrawer";
import { fetchCampaigns, reviewCampaign } from "./actions";
import { Megaphone, DollarSign, Eye, Clock } from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  advertiser: string;
  status: "Live" | "Pending Review" | "Rejected" | "Paused";
  budget: number;
  spend: number;
  audience: string;
  location: string;
  adCopy: string;
}

const columns: Column<Campaign>[] = [
  { key: "name", label: "Campaign", render: (row) => (
    <div>
      <p className="font-medium text-neutral-900">{row.name}</p>
      <p className="text-[11px] text-neutral-500">{row.advertiser}</p>
    </div>
  )},
  { 
    key: "status", 
    label: "Status",
    render: (row) => {
      if (row.status === "Live") return <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">Live</span>;
      if (row.status === "Pending Review") return <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[11px] font-semibold border border-amber-200 flex items-center gap-1 w-fit"><Clock size={10}/>Pending</span>;
      if (row.status === "Paused") return <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 text-[11px] font-semibold border border-neutral-200">Paused</span>;
      return <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[11px] font-semibold border border-rose-200">Rejected</span>;
    }
  },
  { key: "budget", label: "Budget", render: (row) => <span className="font-medium text-neutral-900">₹{row.budget.toLocaleString()}</span> },
  { key: "spend", label: "Spend", render: (row) => <span className="text-neutral-600">₹{row.spend.toLocaleString()}</span> },
];

export default function AdvertisingPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      const data = await fetchCampaigns();
      setCampaigns(data as Campaign[]);
    } catch (e) {
      console.error("Failed to load campaigns:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (campaignId: string, action: "approve" | "reject") => {
    try {
      await reviewCampaign(campaignId, action);
      await loadCampaigns();
    } catch (e) {
      alert("Failed to update campaign. Check console.");
    }
  };

  const adRevenue = campaigns.reduce((s, c) => s + c.spend, 0);
  const liveCount = campaigns.filter(c => c.status === "Live").length;
  const pendingCount = campaigns.filter(c => c.status === "Pending Review").length;

  const kpis = [
    { label: "Ad Revenue (loaded)", value: `₹${adRevenue.toLocaleString()}`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Active Campaigns", value: liveCount.toLocaleString(), icon: Megaphone, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Total Spend", value: `₹${adRevenue.toLocaleString()}`, icon: Eye, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Pending Approvals", value: pendingCount.toLocaleString(), icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-neutral-200 rounded"></div>
          <div className="h-64 bg-neutral-100 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-neutral-900 tracking-tight">Advertising</h1>
          <p className="text-[13px] text-neutral-500 mt-1">Manage ad campaigns, review creatives, and track revenue.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white border border-neutral-200 rounded-xl p-4">
            <div className={`w-8 h-8 rounded-lg ${kpi.bg} flex items-center justify-center ${kpi.color} mb-3`}>
              <kpi.icon size={16} />
            </div>
            <p className="text-[20px] font-bold text-neutral-900 tracking-tight">{kpi.value}</p>
            <p className="text-[11px] font-medium text-neutral-500 mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      <DataTable 
        columns={columns} 
        data={campaigns} 
        pageSize={10} 
        onRowClick={(row) => setSelectedCampaign(row)}
        emptyStateMessage="No advertising campaigns found in the database yet."
      />

      <AdvertisingReviewDrawer 
        campaign={selectedCampaign} 
        onClose={() => setSelectedCampaign(null)}
        onReview={handleReview}
      />
    </div>
  );
}