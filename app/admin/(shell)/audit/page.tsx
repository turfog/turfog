"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FileText, Shield, UserX, CheckCircle2, XCircle, DollarSign, 
  Megaphone, AlertTriangle, Search, Filter, Download 
} from "lucide-react";

type ActionType = 
  | "user_verified"
  | "user_suspended"
  | "ad_approved"
  | "ad_rejected"
  | "escrow_released"
  | "escrow_refunded"
  | "content_removed";

interface AuditEntry {
  id: string;
  admin: string;
  adminEmail: string;
  action: ActionType;
  target: string;
  details: string;
  reason?: string;
  ip: string;
  timestamp: Date;
}

const actionConfig: Record<ActionType, { icon: any; label: string; color: string; bg: string }> = {
  user_verified:   { icon: CheckCircle2, label: "Verified User",       color: "text-emerald-600", bg: "bg-emerald-50" },
  user_suspended:  { icon: UserX,        label: "Suspended User",      color: "text-rose-600",    bg: "bg-rose-50" },
  ad_approved:     { icon: Megaphone,    label: "Approved Ad",         color: "text-indigo-600",  bg: "bg-indigo-50" },
  ad_rejected:     { icon: XCircle,      label: "Rejected Ad",         color: "text-orange-600",  bg: "bg-orange-50" },
  escrow_released: { icon: DollarSign,   label: "Released Escrow",     color: "text-emerald-600", bg: "bg-emerald-50" },
  escrow_refunded: { icon: DollarSign,   label: "Refunded Escrow",     color: "text-amber-600",   bg: "bg-amber-50" },
  content_removed: { icon: AlertTriangle,label: "Removed Content",     color: "text-rose-600",    bg: "bg-rose-50" },
};

const mockAudit: AuditEntry[] = [
  { id: "AUD-1", admin: "John Carter",  adminEmail: "john@turfog.com",  action: "escrow_released", target: "Order #ORD-883",      details: "Released ₹2,800 to Sports Hub Store",       reason: "GPS evidence confirmed meetup",      ip: "49.208.xx.xx",  timestamp: new Date(Date.now() - 1000 * 60 * 2) },
  { id: "AUD-2", admin: "Sarah Chen",   adminEmail: "sarah@turfog.com", action: "ad_approved",     target: "Campaign #AD-102",    details: "Andheri Turf Weekend Promo",                reason: "Creative meets policy",              ip: "103.52.xx.xx",  timestamp: new Date(Date.now() - 1000 * 60 * 18) },
  { id: "AUD-3", admin: "John Carter",  adminEmail: "john@turfog.com",  action: "user_suspended",  target: "@spammer_99",        details: "Account permanently suspended",             reason: "Bulk spam DMs detected (40 in 5m)",  ip: "49.208.xx.xx",  timestamp: new Date(Date.now() - 1000 * 60 * 45) },
  { id: "AUD-4", admin: "Maya Patel",   adminEmail: "maya@turfog.com",  action: "user_verified",   target: "@rahul_s",            details: "Pro player verification granted",           reason: "FIFA registration confirmed",         ip: "182.71.xx.xx",  timestamp: new Date(Date.now() - 1000 * 60 * 90) },
  { id: "AUD-5", admin: "Sarah Chen",   adminEmail: "sarah@turfog.com", action: "content_removed", target: "Post #8832",          details: "Post by @vikky removed",                    reason: "Hate speech violation",              ip: "103.52.xx.xx",  timestamp: new Date(Date.now() - 1000 * 60 * 120) },
  { id: "AUD-6", admin: "Maya Patel",   adminEmail: "maya@turfog.com",  action: "ad_rejected",     target: "Campaign #AD-103",    details: "Pro Gear Clearance Sale",                   reason: "Misleading discount claims",         ip: "182.71.xx.xx",  timestamp: new Date(Date.now() - 1000 * 60 * 180) },
  { id: "AUD-7", admin: "John Carter",  adminEmail: "john@turfog.com",  action: "escrow_refunded", target: "Order #ORD-871",      details: "Refunded ₹4,500 to buyer @dev_k",           reason: "Seller did not ship within 48h",     ip: "49.208.xx.xx",  timestamp: new Date(Date.now() - 1000 * 60 * 300) },
];

const timeAgo = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

export default function AuditLogsPage() {
  const [query, setQuery] = useState("");
  const [filterAction, setFilterAction] = useState<ActionType | "all">("all");

  const filtered = mockAudit.filter((e) => {
    const matchesQuery = query === "" || 
      e.admin.toLowerCase().includes(query.toLowerCase()) ||
      e.target.toLowerCase().includes(query.toLowerCase()) ||
      e.details.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filterAction === "all" || e.action === filterAction;
    return matchesQuery && matchesFilter;
  });

  const actionCounts = {
    all: mockAudit.length,
    user_verified: mockAudit.filter(e => e.action === "user_verified").length,
    user_suspended: mockAudit.filter(e => e.action === "user_suspended").length,
    ad_approved: mockAudit.filter(e => e.action === "ad_approved").length,
    escrow_released: mockAudit.filter(e => e.action === "escrow_released").length,
    content_removed: mockAudit.filter(e => e.action === "content_removed").length,
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
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

      {/* Search + Filters */}
      <div className="bg-white border border-neutral-200 rounded-xl p-4 space-y-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by admin name, target, or details..."
            className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-[13px] outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={12} className="text-neutral-400" />
          {(["all", "user_verified", "user_suspended", "ad_approved", "escrow_released", "content_removed"] as const).map((key) => (
            <button
              key={key}
              onClick={() => setFilterAction(key)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-colors ${
                filterAction === key
                  ? "bg-neutral-900 text-white border-neutral-900"
                  : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"
              }`}
            >
              {key === "all" ? "All" : actionConfig[key].label}
              <span className="ml-1.5 opacity-60">{actionCounts[key]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-neutral-200 bg-neutral-50/50 flex items-center justify-between">
          <h2 className="text-[13px] font-semibold text-neutral-900">Activity Timeline</h2>
          <span className="text-[11px] text-neutral-500">{filtered.length} entries</span>
        </div>

        <div className="divide-y divide-neutral-100">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-[13px] text-neutral-500">
              No audit entries match your search.
            </div>
          ) : (
            filtered.map((entry) => {
              const config = actionConfig[entry.action];
              const Icon = config.icon;
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-4 p-5 hover:bg-neutral-50/50 transition-colors"
                >
                  {/* Icon */}
                  <div className={`w-9 h-9 rounded-lg ${config.bg} ${config.color} flex items-center justify-center flex-shrink-0 border border-current/10`}>
                    <Icon size={16} />
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[13px] font-semibold text-neutral-900">{entry.admin}</span>
                      <span className="text-[11px] text-neutral-400">•</span>
                      <span className="text-[11px] text-neutral-500">{entry.adminEmail}</span>
                      <span className={`ml-auto px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${config.color} ${config.bg} border border-current/10`}>
                        {config.label}
                      </span>
                    </div>
                    
                    <p className="text-[13px] text-neutral-800 font-medium mb-0.5">
                      {entry.details}
                    </p>
                    
                    <p className="text-[12px] text-neutral-500">
                      Target: <span className="font-mono text-neutral-700">{entry.target}</span>
                    </p>

                    {entry.reason && (
                      <p className="text-[12px] text-neutral-600 italic mt-1">
                        Reason: "{entry.reason}"
                      </p>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="text-right flex-shrink-0 hidden md:block">
                    <p className="text-[11px] font-medium text-neutral-500 tabular-nums">{timeAgo(entry.timestamp)}</p>
                    <p className="text-[10px] font-mono text-neutral-400 mt-0.5">{entry.ip}</p>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* Immutability Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Shield size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[12px] font-semibold text-blue-900">Immutable Audit Trail</p>
          <p className="text-[12px] text-blue-700 mt-0.5">
            These records cannot be edited or deleted. They are stored in a write-once log for compliance, dispute resolution, and security forensics.
          </p>
        </div>
      </div>
    </div>
  );
}