"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchUnifiedApprovals, executeApproval, UnifiedApproval } from "./actions";
import { CheckCircle2, XCircle, Zap, User, Megaphone, Flag } from "lucide-react";

const typeConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  user: { icon: User, color: "text-blue-600", bg: "bg-blue-50", label: "User Verification" },
  ad: { icon: Megaphone, color: "text-indigo-600", bg: "bg-indigo-50", label: "Ad Campaign" },
  report: { icon: Flag, color: "text-rose-600", bg: "bg-rose-50", label: "Content Report" },
};

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<UnifiedApproval[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApprovals();
  }, []);

  const loadApprovals = async () => {
    try {
      const data = await fetchUnifiedApprovals();
      setApprovals(data);
    } catch (e) {
      console.error("Failed to load approvals:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: "approve" | "reject") => {
    let reason: string | undefined;
    if (action === "reject" && id.startsWith("user-")) {
      reason = prompt("Reason for rejection/suspension:") || undefined;
      if (!reason) return; // Cancelled
    }
    if (action === "approve" && id.startsWith("report-")) {
      reason = prompt("Action taken (e.g. 'Banned user', 'Removed post'):") || undefined;
      if (!reason) return;
    }

    try {
      await executeApproval(id, action, reason);
      // Optimistically remove from UI
      setApprovals(prev => prev.filter(a => a.id !== id));
    } catch (e) {
      alert("Failed to execute action. Check console.");
    }
  };

  const highCount = approvals.filter(a => a.priority === "high").length;

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-neutral-200 rounded"></div>
          <div className="h-64 bg-neutral-100 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-neutral-900 tracking-tight flex items-center gap-2">
          <Zap size={24} className="text-amber-600" />
          Approvals & Queue
        </h1>
        <p className="text-[13px] text-neutral-500 mt-1">Unified inbox for all pending platform actions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <p className="text-[20px] font-bold text-neutral-900">{approvals.length}</p>
          <p className="text-[11px] text-neutral-500">Total Pending</p>
        </div>
        <div className="bg-white border border-rose-200 rounded-xl p-4">
          <p className="text-[20px] font-bold text-rose-600">{highCount}</p>
          <p className="text-[11px] text-neutral-500">High Priority</p>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <p className="text-[20px] font-bold text-emerald-600">Live</p>
          <p className="text-[11px] text-neutral-500">Real-time Sync</p>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-neutral-200 bg-neutral-50/50">
          <h2 className="text-[13px] font-semibold text-neutral-900">Pending Approvals</h2>
        </div>
        <div className="divide-y divide-neutral-100">
          <AnimatePresence initial={false}>
            {approvals.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="p-12 text-center text-[13px] text-neutral-500"
              >
                <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-3" />
                <p className="font-medium text-neutral-900">All caught up!</p>
                <p>No pending actions across the platform.</p>
              </motion.div>
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
                    exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
                    className="flex items-center gap-4 p-5 hover:bg-neutral-50/50 transition-colors"
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
                        {item.submittedBy} • {new Date(item.submittedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleAction(item.id, "reject")}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-rose-200 text-rose-600 text-[12px] font-semibold rounded-lg hover:bg-rose-50"
                      >
                        <XCircle size={14} /> {item.type === "report" ? "Dismiss" : "Reject"}
                      </button>
                      <button
                        onClick={() => handleAction(item.id, "approve")}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-[12px] font-semibold rounded-lg hover:bg-emerald-700"
                      >
                        <CheckCircle2 size={14} /> {item.type === "report" ? "Take Action" : "Approve"}
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