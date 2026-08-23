"use client";

import { useState, useEffect } from "react";
import { DataTable, Column } from "@/components/admin/admin-ui/DataTable";
import { MarketplaceDisputeDrawer } from "@/components/admin/admin-ui/MarketplaceDisputeDrawer";
import { fetchOrders, resolveOrderDispute } from "./actions";
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
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await fetchOrders();
      setOrders(data as Order[]);
    } catch (e) {
      console.error("Failed to load orders:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (orderId: string, action: "release" | "refund") => {
    try {
      await resolveOrderDispute(orderId, action);
      await loadOrders();
    } catch (e) {
      alert("Failed to resolve dispute. Check console.");
    }
  };

  const gmv = orders.reduce((s, o) => s + o.amount, 0);
  const disputed = orders.filter(o => o.status === "Disputed").length;

  const kpis = [
    { label: "Total GMV (loaded)", value: `₹${gmv.toLocaleString()}`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Orders Loaded", value: orders.length.toLocaleString(), icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Platform Fee (5%)", value: `₹${Math.round(gmv * 0.05).toLocaleString()}`, icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Open Disputes", value: disputed.toLocaleString(), icon: AlertTriangle, color: "text-rose-600", bg: "bg-rose-50" },
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
          <h1 className="text-[22px] font-bold text-neutral-900 tracking-tight">Marketplace</h1>
          <p className="text-[13px] text-neutral-500 mt-1">Manage transactions, escrow, and product approvals.</p>
        </div>
        <button className="px-4 py-2 bg-neutral-900 text-white text-[13px] font-semibold rounded-lg hover:bg-neutral-800 transition-colors">
          Export Ledger
        </button>
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
        data={orders} 
        pageSize={10} 
        onRowClick={(row) => setSelectedOrder(row)}
        emptyStateMessage="No marketplace orders found in the database yet."
      />

      <MarketplaceDisputeDrawer 
        order={selectedOrder} 
        onClose={() => setSelectedOrder(null)}
        onResolve={handleResolve}
      />
    </div>
  );
}