"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldAlert, User, FileText, Flag, CheckCircle2, XCircle, 
  Gavel, Star
} from "lucide-react";

type ReportType = "post" | "user" | "match" | "review";
type Severity = "critical" | "high" | "medium" | "low";

interface Report {
  id: string;
  type: ReportType;
  reason: string;
  severity: Severity;
  reporter: string;
  reportedUser: string;
  contentSnippet: string;
  timestamp: Date;
  status: "pending" | "resolved";
}

const typeConfig: Record<ReportType, { icon: any; label: string }> = {
  post: { icon: FileText, label: "Post" },
  user: { icon: User, label: "User Profile" },
  match: { icon: Flag, label: "Match Dispute" },
  review: { icon: Star, label: "Review" },
};

const severityConfig: Record<Severity, { color: string; bg: string; label: string }> = {
  critical: { color: "text-rose-700", bg: "bg-rose-50 border-rose-200", label: "Critical" },
  high: { color: "text-orange-700", bg: "bg-orange-50 border-orange-200", label: "High" },
  medium: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200", label: "Medium" },
  low: { color: "text-blue-700", bg: "bg-blue-50 border-blue-200", label: "Low" },
};

const initialReports: Report[] = [
  {
    id: "R-992",
    type: "user",
    reason: "Fake Account / Bot",
    severity: "critical",
    reporter: "System Auto-Flag",
    reportedUser: "@spammer_99",
    contentSnippet: "Account created 5 mins ago, sent 40 identical DMs.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    status: "pending",
  },
  {
    id: "R-991",
    type: "post",
    reason: "Hate Speech",
    severity: "high",
    reporter: "@rahul_s",
    reportedUser: "@angry_guy",
    contentSnippet: "Post contains discriminatory language regarding...",
    timestamp: new Date(Date.now() - 1000 * 60 * 12),
    status: "pending",
  },
  {
    id: "R-990",
    type: "match",
    reason: "No-Show / Cancellation",
    severity: "medium",
    reporter: "@captain_priya",
    reportedUser: "@vikky",
    contentSnippet: "User did not show up for verified match #4412.",
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    status: "pending",
  },
];

export default function ModerationPage() {
  const [reports, setReports] = useState<Report[]>(initialReports);

  const handleResolve = (id: string, action: "dismiss" | "ban") => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    console.log(`[AUDIT LOG] Admin resolved report ${id} with action: ${action}`);
  };

  const pendingCount = reports.length;
  const criticalCount = reports.filter(r => r.severity === "critical").length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
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
             {pendingCount} Pending
           </span>
        </div>
      </div>

      {/* Queue */}
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
                const type = typeConfig[report.type];
                const severity = severityConfig[report.severity];
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
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-lg border ${severity.bg} flex items-center justify-center flex-shrink-0 ${severity.color}`}>
                      <Icon size={18} />
                    </div>

                    {/* Content */}
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
                        Reported: <span className="text-neutral-500">@{report.reportedUser.replace("@","")}</span>
                      </p>
                      <p className="text-[13px] text-neutral-600 line-clamp-2">
                        "{report.contentSnippet}"
                      </p>
                      
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-neutral-400">
                        <span>Reported by: <span className="font-medium text-neutral-600">{report.reporter}</span></span>
                        <span>•</span>
                        <span>{report.timestamp.toLocaleTimeString()}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity md:opacity-100">
                      <button
                        onClick={() => handleResolve(report.id, "ban")}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 text-white text-[12px] font-semibold rounded-md hover:bg-rose-700 transition-colors shadow-sm"
                      >
                        <Gavel size={12} /> Remove/Ban
                      </button>
                      <button
                        onClick={() => handleResolve(report.id, "dismiss")}
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