"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/admin/admin-ui/DataTable";
import { AdvertisingReviewDrawer } from "@/components/admin/admin-ui/AdvertisingReviewDrawer";
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

const mockCampaigns: Campaign[] = [
  { id: "AD-101", name: "Nike Mumbai Football Cup", advertiser: "Nike India", status: "Live", budget: 50000, spend: 12400, audience: "Football players", location: "Mumbai", adCopy: "Gear up for the ultimate 5v5 tournament. Register your squad today and win exclusive Nike merch!" },
  { id: "AD-102", name: "Andheri Turf Weekend Promo", advertiser: "Andheri Sports Club", status: "Pending Review", budget: 15000, spend: 0, audience: "Casual players", location: "Andheri West", adCopy: "Book your weekend slots now at 20% off! Premium astroturf, floodlights, and changing rooms available." },
  { id: "AD-103", name: "Pro Gear Clearance Sale", advertiser: "Sports Hub Store", status: "Rejected", budget: 30000, spend: 0, audience: "Cricket enthusiasts", location: "All India", adCopy: "Massive discounts on SG and SS bats. Buy now before stock runs out!" },
  { id: "AD-104", name: "Pickleball Beginner Clinic", advertiser: "Smash Padel Club", status: "Paused", budget: 10000, spend: 4200, audience: "Beginners", location: "Bangalore", adCopy: "Never played Pickleball? Join our free introductory clinic this Saturday." },
];

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
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const kpis = [
    { label: "Ad Revenue (30d)", value: "₹840K", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Active Campaigns", value: "142", icon: Megaphone, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Total Impressions", value: "4.2M", icon: Eye, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Pending Approvals", value: "8", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-neutral-900 tracking-tight">Advertising</h1>
          <p className="text-[13px] text-neutral-500 mt-1">Manage ad campaigns, review creatives, and track revenue.</p>
        </div>
      </div>

      {/* KPIs */}
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

      {/* Campaigns Table */}
      <DataTable 
        columns={columns} 
        data={mockCampaigns} 
        pageSize={10} 
        onRowClick={(row) => setSelectedCampaign(row)}
        emptyStateMessage="No advertising campaigns found."
      />

      {/* Review Drawer */}
      <AdvertisingReviewDrawer campaign={selectedCampaign} onClose={() => setSelectedCampaign(null)} />
    </div>
  );
}