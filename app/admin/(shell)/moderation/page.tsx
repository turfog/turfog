"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchPendingReports, dismissReport, resolveReport } from "./actions";
import { 
  ShieldAlert, User, FileText, Flag, CheckCircle2, XCircle, 
  Gavel, MessageSquare 
} from "lucide-react";

interface Report {
  id: string;
  reporter_id: string | null;
  target_type: string;
  target_id: string;
  reason: string;
  details: string | null;
  severity: string;
  status: string;
  created_at: string;
}

const typeConfig: Record<string, { icon: any; label: string }> = {
  post: { icon: FileText, label: "Post" },
  user: { icon: User, label: "User Profile" },
  match: { icon: Flag, label: "Match Dispute" },
  review: { icon: MessageSquare, label: "Review" },
};

const severityConfig: Record<string, { color: string; bg: string; label: string }> = {
  critical: { color: "text-rose-700", bg: "bg-rose-50 border-rose-200", label: "Critical" },
  high: { color: "text-orange-700", bg: "bg-orange-50 border-orange-200", label: "High" },
  medium: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200", label: "Medium" },
  low: { color: "text-blue-700", bg: "bg-blue-50 border-blue-200", label: "Low" },
};

export default function ModerationPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const data = await fetchPendingReports();
      setReports(data as Report[]);
    } catch (error) {
      console.error("Failed to load reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = async (id: string) => {
    await dismissReport(id);
    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  const handleResolve = async (id: string) => {
    const reason = prompt("Action taken (e.g., 'Banned user', 'Removed post'):");
    if (!reason) return;
    await resolveReport(id, reason);
    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  const criticalCount = reports.filter(r => r.severity === "critical").length;

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-neutral-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="text-rose-600" size={28} />
            Trust & Safety
          </h1>
          <p className="text-[13px] text-neutral-500 mt-1">
            Review and resolve platform reports. High severity items are prioritized.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <span className="px-3 py-1.5 bg-rose-50 text-rose-700 text-[12px] font-bold rounded-full border border-rose-200">
             {criticalCount} Critical
           </span>
           <span className="px-3 py-1.5 bg-neutral-100 text-neutral-700 text-[12px] font-bold rounded-full border border-neutral-200">
             {reports.length} Pending
           </span>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-neutral-200 bg-neutral-50/50 flex items-center justify-between">
          <h2 className="text-[13px] font-semibold text-neutral-900">Moderation Queue</h2>
          <span className="text-[11px] text-neutral-500">Sorted by Severity</span>
        </div>

        <div className="divide-y divide-neutral-100">
          <AnimatePresence initial={false}>
            {reports.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="p-12 text-center text-[13px] text-neutral-500"
              >
                <CheckCircle2 className="mx-auto mb-3 text-emerald-500" size={32} />
                <p className="font-medium text-neutral-900">All caught up!</p>
                <p>No pending reports at this time.</p>
              </motion.div>
            ) : (
              reports.map((report) => {
                const type = typeConfig[report.target_type] || typeConfig.post;
                const severity = severityConfig[report.severity] || severityConfig.medium;
                const Icon = type.icon;

                return (
                  <motion.div
                    key={report.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
                    className="group flex items-start gap-4 p-5 hover:bg-neutral-50/50 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-lg border ${severity.bg} flex items-center justify-center flex-shrink-0 ${severity.color}`}>
                      <Icon size={18} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${severity.color} ${severity.bg}`}>
                          {severity.label}
                        </span>
                        <span className="text-[11px] font-medium text-neutral-500">{type.label}</span>
                        <span className="text-[11px] text-neutral-400">•</span>
                        <span className="text-[11px] text-neutral-400">{report.reason}</span>
                      </div>
                      
                      <p className="text-[14px] font-medium text-neutral-900 mb-1 truncate">
                        Target ID: <span className="font-mono text-neutral-500">{report.target_id}</span>
                      </p>
                      <p className="text-[13px] text-neutral-600 line-clamp-2">
                        "{report.details || report.reason}"
                      </p>
                      
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-neutral-400">
                        <span>Reporter: <span className="font-medium text-neutral-600">{report.reporter_id || "Anonymous"}</span></span>
                        <span>•</span>
                        <span>{new Date(report.created_at).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity md:opacity-100">
                      <button
                        onClick={() => handleResolve(report.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 text-white text-[12px] font-semibold rounded-md hover:bg-rose-700 transition-colors shadow-sm"
                      >
                        <Gavel size={12} /> Take Action
                      </button>
                      <button
                        onClick={() => handleDismiss(report.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-200 text-neutral-700 text-[12px] font-semibold rounded-md hover:bg-neutral-50 transition-colors"
                      >
                        <XCircle size={12} /> Dismiss
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