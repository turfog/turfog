"use client";

import { useState } from "react";
import { Users, TrendingUp, Repeat, AlertTriangle, Zap, ArrowRight } from "lucide-react";

const funnelStages = [
  { label: "Visitors", value: 120000, pct: 100 },
  { label: "Registrations", value: 48000, pct: 40 },
  { label: "Profile Completion", value: 36000, pct: 30 },
  { label: "First Match", value: 21600, pct: 18 },
  { label: "First Team", value: 12960, pct: 10.8 },
  { label: "First Post", value: 7776, pct: 6.5 },
  { label: "Returning User", value: 5443, pct: 4.5 },
  { label: "Paid User", value: 1088, pct: 0.9 },
];

const cohorts = [
  { month: "Jan 2024", users: 8200, d1: 62, d7: 41, d30: 28, d60: 22, d90: 19 },
  { month: "Feb 2024", users: 9100, d1: 64, d7: 43, d30: 30, d60: 24, d90: 20 },
  { month: "Mar 2024", users: 10400, d1: 66, d7: 45, d30: 32, d60: 26, d90: 22 },
  { month: "Apr 2024", users: 11800, d1: 68, d7: 48, d30: 34, d60: 28, d90: 24 },
  { month: "May 2024", users: 13200, d1: 70, d7: 50, d30: 36, d60: 30, d90: 26 },
];

function cohortColor(pct: number) {
  if (pct >= 50) return "bg-emerald-500 text-white";
  if (pct >= 40) return "bg-emerald-400 text-white";
  if (pct >= 30) return "bg-emerald-300 text-emerald-900";
  if (pct >= 20) return "bg-emerald-200 text-emerald-900";
  if (pct >= 10) return "bg-emerald-100 text-emerald-800";
  return "bg-neutral-100 text-neutral-500";
}

const kpis = [
  { label: "Daily Active (DAU)", value: "12,480", trend: "+8.2%", up: true, icon: Users },
  { label: "Weekly Active (WAU)", value: "34,210", trend: "+5.1%", up: true, icon: TrendingUp },
  { label: "Monthly Active (MAU)", value: "78,940", trend: "+11.4%", up: true, icon: Repeat },
  { label: "D30 Retention", value: "29%", trend: "-1.2%", up: false, icon: AlertTriangle },
];

export default function GrowthPage() {
  const [range, setRange] = useState<"30d" | "90d" | "12m">("90d");

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-neutral-900 tracking-tight">Growth & Retention</h1>
          <p className="text-[13px] text-neutral-500 mt-1">Understand acquisition, activation, and long-term engagement.</p>
        </div>
        <div className="flex items-center gap-1 bg-white border border-neutral-200 rounded-lg p-1">
          {(["30d", "90d", "12m"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 text-[12px] font-semibold rounded-md transition-colors ${
                range === r ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white border border-neutral-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-600">
                <kpi.icon size={16} />
              </div>
              <span className={`text-[11px] font-bold ${kpi.up ? "text-emerald-600" : "text-rose-600"}`}>{kpi.trend}</span>
            </div>
            <p className="text-[20px] font-bold text-neutral-900 tracking-tight">{kpi.value}</p>
            <p className="text-[11px] font-medium text-neutral-500 mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6">
          <h2 className="text-[15px] font-semibold text-neutral-900 mb-1">Activation Funnel</h2>
          <p className="text-[12px] text-neutral-500 mb-6">Visitor → Paid User journey. Width = share of total visitors.</p>
          <div className="space-y-3">
            {funnelStages.map((stage, i) => {
              const prev = i > 0 ? funnelStages[i - 1].value : stage.value;
              const conv = i > 0 ? Math.round((stage.value / prev) * 100) : 100;
              return (
                <div key={stage.label} className="flex items-center gap-4">
                  <div className="w-32 text-right flex-shrink-0">
                    <p className="text-[12px] font-medium text-neutral-700">{stage.label}</p>
                  </div>
                  <div className="flex-1">
                    <div className="h-8 rounded-md bg-neutral-100 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-md transition-all"
                        style={{ width: `${Math.max(stage.pct, 6)}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-24 flex-shrink-0">
                    <p className="text-[12px] font-bold text-neutral-900">{stage.value.toLocaleString()}</p>
                    {i > 0 && (
                      <p className="text-[10px] text-neutral-500 flex items-center gap-0.5">
                        <ArrowRight size={9} /> {conv}%
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Insight */}
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
            <Zap size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[12px] font-semibold text-amber-900">Biggest drop-off detected</p>
              <p className="text-[12px] text-amber-700 mt-0.5">
                Registration → Profile Completion loses 25% of users. Recommendation: simplify onboarding and pre-fill sport interests.
              </p>
            </div>
          </div>
        </div>

        {/* Retention Cohorts */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6">
          <h2 className="text-[15px] font-semibold text-neutral-900 mb-1">Retention Cohorts</h2>
          <p className="text-[12px] text-neutral-500 mb-6">% of users returning N days after signup, by cohort month.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="text-left text-[10px] font-semibold text-neutral-500 uppercase tracking-wider border-b border-neutral-200">
                  <th className="py-2 pr-2">Cohort</th>
                  <th className="py-2 pr-2">Users</th>
                  <th className="py-2 pr-2">Day 1</th>
                  <th className="py-2 pr-2">Day 7</th>
                  <th className="py-2 pr-2">Day 30</th>
                  <th className="py-2 pr-2">Day 60</th>
                  <th className="py-2">Day 90</th>
                </tr>
              </thead>
              <tbody>
                {cohorts.map((c) => (
                  <tr key={c.month} className="border-b border-neutral-100 last:border-0">
                    <td className="py-2.5 pr-2 font-medium text-neutral-900">{c.month}</td>
                    <td className="py-2.5 pr-2 text-neutral-600">{c.users.toLocaleString()}</td>
                    <td className="py-2.5 pr-2"><span className={`inline-block w-12 text-center py-1 rounded ${cohortColor(c.d1)}`}>{c.d1}%</span></td>
                    <td className="py-2.5 pr-2"><span className={`inline-block w-12 text-center py-1 rounded ${cohortColor(c.d7)}`}>{c.d7}%</span></td>
                    <td className="py-2.5 pr-2"><span className={`inline-block w-12 text-center py-1 rounded ${cohortColor(c.d30)}`}>{c.d30}%</span></td>
                    <td className="py-2.5 pr-2"><span className={`inline-block w-12 text-center py-1 rounded ${cohortColor(c.d60)}`}>{c.d60}%</span></td>
                    <td className="py-2.5"><span className={`inline-block w-12 text-center py-1 rounded ${cohortColor(c.d90)}`}>{c.d90}%</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-neutral-400 mt-4">
            Green intensity = retention strength. Notice each cohort improving month-over-month — product changes are working.
          </p>
        </div>
      </div>
    </div>
  );
}