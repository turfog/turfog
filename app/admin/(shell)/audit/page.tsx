"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Shield, Download, Search, CheckCircle2, UserX, Megaphone, XCircle, DollarSign, AlertTriangle } from "lucide-react";
import { fetchAuditLogs } from "./actions";

interface AuditEntry {
  id: string;
  admin_email: string;
  action: string;
  target_type: string;
  target_id: string;
  details: string;
  created_at: string;
}

const actionConfig: Record<string, { icon: any; label: string; color: string; bg: string }> = {
  user_verified:   { icon: CheckCircle2, label: "Verified User",  color: "text-emerald-600", bg: "bg-emerald-50" },
  user_suspended:  { icon: UserX,        label: "Suspended User", color: "text-rose-600",    bg: "bg-rose-50" },
  ad_approved:     { icon: Megaphone,    label: "Approved Ad",    color: "text-indigo-600",  bg: "bg-indigo-50" },
  ad_rejected:     { icon: XCircle,      label: "Rejected Ad",    color: "text-orange-600",  bg: "bg-orange-50" },
  escrow_released: { icon: DollarSign,   label: "Released Escrow",color: "text-emerald-600", bg: "bg-emerald-50" },
  content_removed: { icon: AlertTriangle,label: "Removed Content",color: "text-rose-600",    bg: "bg-rose-50" },
};

const timeAgo = (dateStr: string) => {
  const date = new Date(dateStr);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    // For now, we fetch via a simple API route or standard client if RLS allows.
    // Since we used service_role to insert, we might need a server action to fetch.
    // Let's create a quick inline fetch using the standard supabase client (assuming admin has read access)
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      // Note: If your standard supabase client doesn't have RLS access to admin_audit_logs, 
      // this will return empty. In that case, we'll create a server action next.
      const data = await fetchAuditLogs();
      setLogs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = logs.filter((e) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      e.admin_email.toLowerCase().includes(q) ||
      e.target_id.toLowerCase().includes(q) ||
      e.details.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-neutral-900 tracking-tight flex items-center gap-2">
            <FileText className="text-neutral-700" size={28} />
            Audit Logs
          </h1>
          <p className="text-[13px] text-neutral-500 mt-1">
            Immutable record of every sensitive action taken by administrators.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 text-neutral-700 text-[13px] font-semibold rounded-lg hover:bg-neutral-50 transition-colors">
          <Download size={14} />
          Export CSV
        </button>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl p-4">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by admin email, target ID, or details..."
            className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-[13px] outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
          />
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-neutral-200 bg-neutral-50/50 flex items-center justify-between">
          <h2 className="text-[13px] font-semibold text-neutral-900">Activity Timeline</h2>
          <span className="text-[11px] text-neutral-500">{filtered.length} entries</span>
        </div>

        <div className="divide-y divide-neutral-100">
          {loading ? (
            <div className="p-12 text-center text-[13px] text-neutral-500">Loading audit trail...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-[13px] text-neutral-500">
              {query ? "No audit entries match your search." : "No admin actions recorded yet. Try verifying or suspending a user!"}
            </div>
          ) : (
            filtered.map((entry) => {
              const config = actionConfig[entry.action] || { icon: FileText, label: entry.action, color: "text-neutral-600", bg: "bg-neutral-50" };
              const Icon = config.icon;
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-4 p-5 hover:bg-neutral-50/50 transition-colors"
                >
                  <div className={`w-9 h-9 rounded-lg ${config.bg} ${config.color} flex items-center justify-center flex-shrink-0 border border-current/10`}>
                    <Icon size={16} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[13px] font-semibold text-neutral-900">{entry.admin_email}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${config.color} ${config.bg} border border-current/10`}>
                        {config.label}
                      </span>
                    </div>
                    
                    <p className="text-[13px] text-neutral-800 font-medium mb-0.5">
                      {entry.details}
                    </p>
                    
                    <p className="text-[12px] text-neutral-500">
                      Target: <span className="font-mono text-neutral-700">{entry.target_id}</span> ({entry.target_type})
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0 hidden md:block">
                    <p className="text-[11px] font-medium text-neutral-500 tabular-nums">{timeAgo(entry.created_at)}</p>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Shield size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[12px] font-semibold text-blue-900">Immutable Audit Trail</p>
          <p className="text-[12px] text-blue-700 mt-0.5">
            These records cannot be edited or deleted via the UI. They are stored securely for compliance and dispute resolution.
          </p>
        </div>
      </div>
    </div>
  );
}