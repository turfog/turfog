"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle, AlertCircle, Info, CheckCircle2, Clock,
  Activity, Bell, Zap, ShieldCheck
} from "lucide-react";

type Severity = "critical" | "warning" | "info";
type Status = "active" | "acknowledged";

interface AlertItem {
  id: string;
  severity: Severity;
  title: string;
  description: string;
  metric: string;
  source: string;
  timestamp: Date;
  status: Status;
}

const severityConfig: Record<Severity, { icon: any; color: string; bg: string; border: string; label: string }> = {
  critical: { icon: AlertTriangle, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200", label: "Critical" },
  warning: { icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", label: "Warning" },
  info: { icon: Info, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", label: "Info" },
};

const initialAlerts: AlertItem[] = [
  {
    id: "AL-1",
    severity: "critical",
    title: "Marketplace orders dropped 31% in the last 2 hours",
    description: "Order volume fell from 142/hr to 98/hr. Payment gateway latency may be the cause.",
    metric: "-31% orders",
    source: "Marketplace Monitor",
    timestamp: new Date(Date.now() - 1000 * 60 * 12),
    status: "active",
  },
  {
    id: "AL-2",
    severity: "critical",
    title: "Payment failure rate exceeded threshold",
    description: "Failure rate at 6.8% (threshold 3%). UPI provider degradation suspected.",
    metric: "6.8% failures",
    source: "Finance Monitor",
    timestamp: new Date(Date.now() - 1000 * 60 * 25),
    status: "active",
  },
  {
    id: "AL-3",
    severity: "warning",
    title: "Match cancellation rate increased 22%",
    description: "Cancellations up in Mumbai region. Weather and low player count are top factors.",
    metric: "+22% cancellations",
    source: "Match Reliability",
    timestamp: new Date(Date.now() - 1000 * 60 * 48),
    status: "active",
  },
  {
    id: "AL-4",
    severity: "warning",
    title: "Video processing queue exceeded normal levels",
    description: "Queue depth at 340 items (normal < 100). Worker scaling recommended.",
    metric: "340 queued",
    source: "Media Pipeline",
    timestamp: new Date(Date.now() - 1000 * 60 * 70),
    status: "active",
  },
  {
    id: "AL-5",
    severity: "info",
    title: "Advertising rejection rate increased",
    description: "Creative policy rejections up 8%. Reviewers may need updated guidelines.",
    metric: "+8% rejections",
    source: "Ad Policy",
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    status: "active",
  },
];

const timeAgo = (date: Date) => {
  const m = Math.floor((new Date().getTime() - date.getTime()) / 60000);
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertItem[]>(initialAlerts);
  const [resolvedCount, setResolvedCount] = useState(0);

  const acknowledge = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: "acknowledged" } : a));
  };

  const resolve = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    setResolvedCount(c => c + 1);
  };

  const activeCount = alerts.length;
  const criticalCount = alerts.filter(a => a.severity === "critical").length;
  const systemHealthy = criticalCount === 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-neutral-900 tracking-tight flex items-center gap-2">
            <Bell size={24} className="text-neutral-700" />
            Alerts & Incidents
          </h1>
          <p className="text-[13px] text-neutral-500 mt-1">Proactive detection of platform anomalies before users complain.</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[12px] font-bold ${
          systemHealthy ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"
        }`}>
          <span className={`relative flex h-2 w-2`}>
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${systemHealthy ? "bg-emerald-400" : "bg-rose-400"}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${systemHealthy ? "bg-emerald-500" : "bg-rose-500"}`}></span>
          </span>
          {systemHealthy ? "System Operational" : "Degraded — Act Now"}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-neutral-500 mb-2"><AlertTriangle size={14} /><p className="text-[11px] font-semibold uppercase tracking-wider">Active Alerts</p></div>
          <p className="text-[20px] font-bold text-neutral-900">{activeCount}</p>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-rose-600 mb-2"><AlertTriangle size={14} /><p className="text-[11px] font-semibold uppercase tracking-wider">Critical</p></div>
          <p className="text-[20px] font-bold text-rose-600">{criticalCount}</p>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-neutral-500 mb-2"><Clock size={14} /><p className="text-[11px] font-semibold uppercase tracking-wider">Mean Time To Resolve</p></div>
          <p className="text-[20px] font-bold text-neutral-900">14m</p>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-neutral-500 mb-2"><Activity size={14} /><p className="text-[11px] font-semibold uppercase tracking-wider">Uptime (30d)</p></div>
          <p className="text-[20px] font-bold text-emerald-600">99.98%</p>
        </div>
      </div>

      {/* AI Anomaly Detection */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-4 flex items-start gap-3">
        <Zap size={16} className="text-indigo-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[12px] font-semibold text-indigo-900">AI Anomaly Detection</p>
          <p className="text-[12px] text-indigo-700 mt-0.5">
            The Oracle predicts a likely spike in match cancellations this weekend in Chennai due to forecasted heavy rain. Consider pre-enabling the geo-fenced "Reschedule Assist" automation.
          </p>
        </div>
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {alerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white border border-neutral-200 rounded-xl p-12 text-center"
            >
              <ShieldCheck size={32} className="mx-auto text-emerald-500 mb-3" />
              <p className="text-[14px] font-semibold text-neutral-900">All clear</p>
              <p className="text-[12px] text-neutral-500">No active incidents. {resolvedCount} resolved this session.</p>
            </motion.div>
          ) : (
            alerts.map((alert) => {
              const config = severityConfig[alert.severity];
              const Icon = config.icon;
              return (
                <motion.div
                  key={alert.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -60, transition: { duration: 0.2 } }}
                  className={`bg-white border ${config.border} rounded-xl p-4`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg ${config.bg} ${config.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${config.color} ${config.bg} border ${config.border}`}>
                          {config.label}
                        </span>
                        {alert.status === "acknowledged" && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-neutral-600 bg-neutral-100 border border-neutral-200">
                            Acknowledged
                          </span>
                        )}
                        <span className="text-[11px] text-neutral-400">{alert.source} • {timeAgo(alert.timestamp)}</span>
                        <span className="ml-auto text-[12px] font-bold text-neutral-900">{alert.metric}</span>
                      </div>
                      <p className="text-[14px] font-semibold text-neutral-900 mb-0.5">{alert.title}</p>
                      <p className="text-[12px] text-neutral-600">{alert.description}</p>

                      <div className="flex items-center gap-2 mt-3">
                        {alert.status === "active" && (
                          <button
                            onClick={() => acknowledge(alert.id)}
                            className="px-3 py-1.5 bg-white border border-neutral-200 text-neutral-700 text-[12px] font-semibold rounded-md hover:bg-neutral-50 transition-colors"
                          >
                            Acknowledge
                          </button>
                        )}
                        <button
                          onClick={() => resolve(alert.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-[12px] font-semibold rounded-md hover:bg-emerald-700 transition-colors"
                        >
                          <CheckCircle2 size={12} /> Resolve
                        </button>
                        <button className="px-3 py-1.5 bg-white border border-neutral-200 text-neutral-700 text-[12px] font-semibold rounded-md hover:bg-neutral-50 transition-colors">
                          Escalate
                        </button>
                        <button className="px-3 py-1.5 bg-white border border-neutral-200 text-neutral-700 text-[12px] font-semibold rounded-md hover:bg-neutral-50 transition-colors">
                          Snooze 1h
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}