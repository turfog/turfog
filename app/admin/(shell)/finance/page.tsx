"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/admin/admin-ui/DataTable";
import { Drawer } from "@/components/admin/admin-ui/Drawer";
import { DollarSign, TrendingUp, CreditCard, ArrowUpRight, ArrowDownRight, X, Download } from "lucide-react";

interface Transaction {
  id: string;
  type: "Revenue" | "Payout" | "Refund";
  description: string;
  amount: number;
  status: "Completed" | "Pending" | "Failed";
  date: string;
}

const mockTransactions: Transaction[] = [
  { id: "TXN-881", type: "Revenue", description: "Marketplace Commission - Order #ORD-882", amount: 1200, status: "Completed", date: "Today, 2 PM" },
  { id: "TXN-882", type: "Payout", description: "Seller Payout - Sports Hub Store", amount: 10800, status: "Completed", date: "Today, 10 AM" },
  { id: "TXN-883", type: "Revenue", description: "Ad Campaign - Nike Mumbai", amount: 8400, status: "Completed", date: "Yesterday" },
  { id: "TXN-884", type: "Refund", description: "Buyer Refund - Order #ORD-871", amount: 4500, status: "Pending", date: "Yesterday" },
  { id: "TXN-885", type: "Payout", description: "Turf Owner Payout - Champions Turf", amount: 28000, status: "Failed", date: "2 days ago" },
];

const typeColors: Record<string, { color: string; bg: string; icon: any }> = {
  "Revenue": { color: "text-emerald-600", bg: "bg-emerald-50", icon: ArrowUpRight },
  "Payout": { color: "text-blue-600", bg: "bg-blue-50", icon: ArrowDownRight },
  "Refund": { color: "text-rose-600", bg: "bg-rose-50", icon: ArrowDownRight },
};

const statusColors: Record<string, string> = {
  "Completed": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Pending": "bg-amber-50 text-amber-700 border-amber-200",
  "Failed": "bg-rose-50 text-rose-700 border-rose-200",
};

export default function FinancePage() {
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  const columns: Column<Transaction>[] = [
    { key: "type", label: "Type", render: (row) => {
      const config = typeColors[row.type];
      const Icon = config.icon;
      return (
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg ${config.bg} ${config.color} flex items-center justify-center`}>
            <Icon size={14} />
          </div>
          <span className="font-medium text-[12px]">{row.type}</span>
        </div>
      );
    }},
    { key: "description", label: "Description", render: (row) => (
      <div>
        <p className="font-medium text-neutral-900 truncate max-w-md">{row.description}</p>
        <p className="text-[11px] text-neutral-500">{row.id}</p>
      </div>
    )},
    { key: "amount", label: "Amount", render: (row) => (
      <span className={`font-bold ${row.type === "Revenue" ? "text-emerald-600" : "text-neutral-900"}`}>
        ₹{row.amount.toLocaleString()}
      </span>
    )},
    { key: "status", label: "Status", render: (row) => (
      <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold border ${statusColors[row.status]}`}>
        {row.status}
      </span>
    )},
    { key: "date", label: "Date" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-neutral-900 tracking-tight flex items-center gap-2">
            <DollarSign size={24} className="text-neutral-700" />
            Finance & Payouts
          </h1>
          <p className="text-[13px] text-neutral-500 mt-1">Track revenue, manage payouts, and reconcile transactions.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-[13px] font-semibold rounded-lg hover:bg-neutral-800">
          <Download size={14} /> Export Ledger
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-neutral-500 mb-2"><DollarSign size={14}/><p className="text-[11px] font-semibold uppercase">Revenue (30d)</p></div>
          <p className="text-[20px] font-bold text-emerald-600">₹2.1M</p>
          <p className="text-[11px] text-emerald-600 mt-1">+12.4%</p>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-neutral-500 mb-2"><TrendingUp size={14}/><p className="text-[11px] font-semibold uppercase">GMV (30d)</p></div>
          <p className="text-[20px] font-bold text-neutral-900">₹14.2M</p>
          <p className="text-[11px] text-emerald-600 mt-1">+8.1%</p>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-neutral-500 mb-2"><CreditCard size={14}/><p className="text-[11px] font-semibold uppercase">Pending Payouts</p></div>
          <p className="text-[20px] font-bold text-amber-600">₹142K</p>
          <p className="text-[11px] text-neutral-500 mt-1">24 pending</p>
        </div>
        <div className="bg-white border border-rose-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-rose-600 mb-2"><ArrowDownRight size={14}/><p className="text-[11px] font-semibold uppercase">Refunds</p></div>
          <p className="text-[20px] font-bold text-rose-600">₹38K</p>
          <p className="text-[11px] text-neutral-500 mt-1">12 pending</p>
        </div>
      </div>

      <DataTable columns={columns} data={mockTransactions} pageSize={10} onRowClick={setSelectedTxn} />

      {/* Transaction Details Drawer */}
      <Drawer open={!!selectedTxn} onClose={() => setSelectedTxn(null)}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/50">
            <h2 className="text-[15px] font-semibold text-neutral-900">Transaction Details</h2>
            <button onClick={() => setSelectedTxn(null)} className="p-1 hover:bg-neutral-200 rounded-md text-neutral-500">
              <X size={18} />
            </button>
          </div>
          {selectedTxn && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="text-center py-6 bg-neutral-50 rounded-xl">
                <p className="text-[32px] font-bold text-neutral-900">₹{selectedTxn.amount.toLocaleString()}</p>
                <p className="text-[13px] text-neutral-500 mt-1">{selectedTxn.type} • {selectedTxn.id}</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-neutral-900 mb-3">Transaction Info</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-[13px]">
                    <span className="text-neutral-500">Description</span>
                    <span className="font-medium text-neutral-900">{selectedTxn.description}</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-neutral-500">Status</span>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${statusColors[selectedTxn.status]}`}>
                      {selectedTxn.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-neutral-500">Date</span>
                    <span className="font-medium">{selectedTxn.date}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Drawer>
    </div>
  );
}