"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Zap, User, FileText, Megaphone, ShoppingBag } from "lucide-react";

type ApprovalType = "user" | "ad" | "product" | "seller";

interface ApprovalItem {
  id: string;
  type: ApprovalType;
  title: string;
  submittedBy: string;
  submittedAt: string;
  priority: "high" | "medium" | "low";
}

const typeConfig: Record<ApprovalType, { icon: any; color: string; bg: string; label: string }> = {
  user: { icon: User, color: "text-blue-600", bg: "bg-blue-50", label: "User Verification" },
  ad: { icon: Megaphone, color: "text-indigo-600", bg: "bg-indigo-50", label: "Ad Campaign" },
  product: { icon: FileText, color: "text-purple-600", bg: "bg-purple-50", label: "Product Listing" },
  seller: { icon: ShoppingBag, color: "text-amber-600", bg: "bg-amber-50", label: "Seller Application" },
};

const initialApprovals: ApprovalItem[] = [
  { id: "APR-1", type: "seller", title: "Pro Sports Hub - Store Application", submittedBy: "prosports@store.com", submittedAt: "2h ago", priority: "high" },
  { id: "APR-2", type: "user", title: "@rahul_s - Pro Player Verification", submittedBy: "rahul@gmail.com", submittedAt: "4h ago", priority: "medium" },
  { id: "APR-3", type: "ad", title: "Nike Mumbai Campaign - Creative Review", submittedBy: "marketing@nike.in", submittedAt: "6h ago", priority: "medium" },
  { id: "APR-4", type: "product", title: "SG English Willow Bat - Premium Listing", submittedBy: "sports@store.com", submittedAt: "1d ago", priority: "low" },
];

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<ApprovalItem[]>(initialApprovals);

  const handleAction = (id: string, action: "approve" | "reject") => {
    console.log(`[AUDIT LOG] Admin ${action.toUpperCase()} item ${id}`);
    setApprovals(prev => prev.filter(a => a.id !== id));
  };

  const highCount = approvals.filter(a => a.priority === "high").length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-neutral-900 tracking-tight flex items-center gap-2">
          <Zap size={24} className="text-amber-600" />
          Approvals & Queue
        </h1>
        <p className="text-[13px] text-neutral-500 mt-1">Centralized approval center for users, ads, products, and sellers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <p className="text-[20px] font-bold text-neutral-900">{approvals.length}</p>
          <p className="text-[11px] text-neutral-500">Total Pending</p>
        </div>
        <div className="bg-white border border-rose-200 rounded-xl p-4">
          <p className="text-[20px] font-bold text-rose-600">{highCount}</p>
          <p className="text-[11px] text-neutral-500">High Priority</p>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <p className="text-[20px] font-bold text-neutral-900">4.2h</p>
          <p className="text-[11px] text-neutral-500">Avg Review Time</p>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <p className="text-[20px] font-bold text-emerald-600">94%</p>
          <p className="text-[11px] text-neutral-500">SLA Compliance</p>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-neutral-200 bg-neutral-50/50">
          <h2 className="text-[13px] font-semibold text-neutral-900">Pending Approvals</h2>
        </div>
        <div className="divide-y divide-neutral-100">
          <AnimatePresence initial={false}>
            {approvals.length === 0 ? (
              <div className="p-12 text-center text-[13px] text-neutral-500">
                <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-3" />
                <p className="font-medium text-neutral-900">All caught up!</p>
              </div>
            ) : (
              approvals.map((item) => {
                const config = typeConfig[item.type];
                const Icon = config.icon;
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="flex items-center gap-4 p-5 hover:bg-neutral-50/50"
                  >
                    <div className={`w-10 h-10 rounded-lg ${config.bg} ${config.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${config.color} ${config.bg}`}>
                          {config.label}
                        </span>
                        {item.priority === "high" && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200">
                            High Priority
                          </span>
                        )}
                      </div>
                      <p className="text-[14px] font-medium text-neutral-900">{item.title}</p>
                      <p className="text-[12px] text-neutral-500 mt-0.5">
                        {item.submittedBy} • {item.submittedAt}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleAction(item.id, "reject")}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-rose-200 text-rose-600 text-[12px] font-semibold rounded-lg hover:bg-rose-50"
                      >
                        <XCircle size={14} /> Reject
                      </button>
                      <button
                        onClick={() => handleAction(item.id, "approve")}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-[12px] font-semibold rounded-lg hover:bg-emerald-700"
                      >
                        <CheckCircle2 size={14} /> Approve
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}