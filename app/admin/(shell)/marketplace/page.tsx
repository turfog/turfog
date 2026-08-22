"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/admin/admin-ui/DataTable";
import { MarketplaceDisputeDrawer } from "@/components/admin/admin-ui/MarketplaceDisputeDrawer";
import { ShoppingBag, DollarSign, TrendingUp, AlertTriangle } from "lucide-react";

interface Order {
  id: string;
  product: string;
  buyer: string;
  seller: string;
  amount: number;
  status: "Completed" | "In Escrow" | "Disputed";
  disputeReason?: string;
}

const mockOrders: Order[] = [
  { id: "ORD-881", product: "Nike Mercurial Vapor 14", buyer: "Rahul S.", seller: "Vikram K.", amount: 4500, status: "Completed" },
  { id: "ORD-882", product: "SG Cricket Bat (English Willow)", buyer: "Priya P.", seller: "Rohan M.", amount: 12000, status: "In Escrow" },
  { id: "ORD-883", product: "Pickleball Paddle Set", buyer: "Aisha K.", seller: "Sports Hub Store", amount: 2800, status: "Disputed", disputeReason: "Item arrived with a cracked handle, seller refuses to return." },
  { id: "ORD-884", product: "Adidas Copa Mundials", buyer: "Dev K.", seller: "Sneha R.", amount: 3200, status: "Completed" },
];

const columns: Column<Order>[] = [
  { key: "id", label: "Order ID", render: (row) => <span className="font-mono font-medium text-neutral-900">{row.id}</span> },
  { key: "product", label: "Item" },
  { 
    key: "amount", 
    label: "Amount", 
    render: (row) => <span className="font-bold text-neutral-900">₹{row.amount.toLocaleString()}</span> 
  },
  { 
    key: "status", 
    label: "Status",
    render: (row) => {
      if (row.status === "Completed") return <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">Completed</span>;
      if (row.status === "In Escrow") return <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold border border-blue-200">In Escrow</span>;
      return <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[11px] font-semibold border border-rose-200 flex items-center gap-1 w-fit"><AlertTriangle size={10}/>Disputed</span>;
    }
  },
];

export default function MarketplacePage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const kpis = [
    { label: "Total GMV (30d)", value: "₹14.2M", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Active Orders", value: "1,204", icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Platform Fee Revenue", value: "₹710K", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Open Disputes", value: "12", icon: AlertTriangle, color: "text-rose-600", bg: "bg-rose-50" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-neutral-900 tracking-tight">Marketplace</h1>
          <p className="text-[13px] text-neutral-500 mt-1">Manage transactions, escrow, and product approvals.</p>
        </div>
        <button className="px-4 py-2 bg-neutral-900 text-white text-[13px] font-semibold rounded-lg hover:bg-neutral-800 transition-colors">
          Export Ledger
        </button>
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

      {/* Orders Table */}
      <DataTable 
        columns={columns} 
        data={mockOrders} 
        pageSize={10} 
        onRowClick={(row) => setSelectedOrder(row)}
        emptyStateMessage="No marketplace orders found."
      />

      {/* The Time-Machine Drawer */}
      <MarketplaceDisputeDrawer order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </div>
  );
}