"use client";

import { useState } from "react";
import {
  DollarSign, TrendingUp, Users, Activity, ArrowRight,
  MapPin, Trophy, Megaphone
} from "lucide-react";

type MetricId = "revenue" | "gmv" | "users" | "engagement";
type Dimension = "location" | "sport" | "channel";

const metrics = [
  { id: "revenue" as MetricId, label: "Total Revenue", value: "₹2.1M", change: "+12.4%", up: true, icon: DollarSign, color: "#10b981" },
  { id: "gmv" as MetricId, label: "Marketplace GMV", value: "₹14.2M", change: "+8.1%", up: true, icon: TrendingUp, color: "#6366f1" },
  { id: "users" as MetricId, label: "Active Users", value: "78,940", change: "+11.4%", up: true, icon: Users, color: "#3b82f6" },
  { id: "engagement" as MetricId, label: "Feed Engagement", value: "4.6%", change: "-0.8%", up: false, icon: Activity, color: "#f59e0b" },
];

const dimensions: { id: Dimension; label: string; icon: any }[] = [
  { id: "location", label: "By Location", icon: MapPin },
  { id: "sport", label: "By Sport", icon: Trophy },
  { id: "channel", label: "By Channel", icon: Megaphone },
];

// Deterministic series generator (stable across renders)
function genSeries(seed: number, base: number, growth: number, vol: number) {
  const out: number[] = [];
  let v = base;
  for (let i = 0; i < 30; i++) {
    v = v * (1 + growth) + Math.sin(i * 0.7 + seed) * vol;
    out.push(Math.max(0, Math.round(v)));
  }
  return out;
}

const seriesByMetric: Record<MetricId, number[]> = {
  revenue: genSeries(1, 60000, 0.012, 9000),
  gmv: genSeries(2, 420000, 0.008, 40000),
  users: genSeries(3, 2400, 0.011, 300),
  engagement: genSeries(4, 4.2, 0.001, 0.5),
};

const breakdowns: Record<MetricId, Record<Dimension, { label: string; value: string; share: number; change: string; up: boolean }[]>> = {
  revenue: {
    location: [
      { label: "Mumbai", value: "₹840K", share: 40, change: "+14%", up: true },
      { label: "Bangalore", value: "₹520K", share: 25, change: "+9%", up: true },
      { label: "Chennai", value: "₹380K", share: 18, change: "-4%", up: false },
      { label: "Delhi", value: "₹360K", share: 17, change: "+6%", up: true },
    ],
    sport: [
      { label: "Football", value: "₹980K", share: 47, change: "+12%", up: true },
      { label: "Box Cricket", value: "₹610K", share: 29, change: "+8%", up: true },
      { label: "Pickleball", value: "₹300K", share: 14, change: "+22%", up: true },
      { label: "Badminton", value: "₹210K", share: 10, change: "-2%", up: false },
    ],
    channel: [
      { label: "Marketplace Fees", value: "₹1.1M", share: 52, change: "+10%", up: true },
      { label: "Advertising", value: "₹700K", share: 33, change: "+18%", up: true },
      { label: "Turf Booking", value: "₹300K", share: 15, change: "+4%", up: true },
    ],
  },
  gmv: {
    location: [
      { label: "Mumbai", value: "₹5.6M", share: 39, change: "+7%", up: true },
      { label: "Bangalore", value: "₹3.8M", share: 27, change: "+11%", up: true },
      { label: "Delhi", value: "₹2.7M", share: 19, change: "+5%", up: true },
      { label: "Chennai", value: "₹2.1M", share: 15, change: "-3%", up: false },
    ],
    sport: [
      { label: "Football", value: "₹6.4M", share: 45, change: "+9%", up: true },
      { label: "Box Cricket", value: "₹4.3M", share: 30, change: "+6%", up: true },
      { label: "Pickleball", value: "₹2.1M", share: 15, change: "+25%", up: true },
      { label: "Badminton", value: "₹1.4M", share: 10, change: "+2%", up: true },
    ],
    channel: [
      { label: "Peer-to-Peer", value: "₹9.8M", share: 69, change: "+8%", up: true },
      { label: "Pro Stores", value: "₹4.4M", share: 31, change: "+9%", up: true },
    ],
  },
  users: {
    location: [
      { label: "Mumbai", value: "31,200", share: 40, change: "+12%", up: true },
      { label: "Bangalore", value: "19,700", share: 25, change: "+10%", up: true },
      { label: "Chennai", value: "14,200", share: 18, change: "-6%", up: false },
      { label: "Delhi", value: "13,800", share: 17, change: "+8%", up: true },
    ],
    sport: [
      { label: "Football", value: "37,100", share: 47, change: "+11%", up: true },
      { label: "Box Cricket", value: "22,900", share: 29, change: "+7%", up: true },
      { label: "Pickleball", value: "11,000", share: 14, change: "+28%", up: true },
      { label: "Badminton", value: "7,900", share: 10, change: "+3%", up: true },
    ],
    channel: [
      { label: "Organic", value: "34,700", share: 44, change: "+9%", up: true },
      { label: "Instagram Ads", value: "26,000", share: 33, change: "+15%", up: true },
      { label: "Referrals", value: "18,200", share: 23, change: "+12%", up: true },
    ],
  },
  engagement: {
    location: [
      { label: "Bangalore", value: "5.2%", share: 30, change: "+0.4", up: true },
      { label: "Mumbai", value: "4.8%", share: 28, change: "+0.1", up: true },
      { label: "Delhi", value: "4.3%", share: 22, change: "-0.2", up: false },
      { label: "Chennai", value: "3.9%", share: 20, change: "-0.6", up: false },
    ],
    sport: [
      { label: "Pickleball", value: "6.1%", share: 30, change: "+0.8", up: true },
      { label: "Football", value: "4.9%", share: 30, change: "+0.2", up: true },
      { label: "Box Cricket", value: "4.2%", share: 25, change: "-0.3", up: false },
      { label: "Badminton", value: "3.6%", share: 15, change: "-0.4", up: false },
    ],
    channel: [
      { label: "Feed Posts", value: "5.4%", share: 55, change: "+0.3", up: true },
      { label: "Match Updates", value: "4.1%", share: 30, change: "-0.2", up: false },
      { label: "Videos", value: "3.4%", share: 15, change: "-0.5", up: false },
    ],
  },
};

function buildPath(series: number[], w: number, h: number) {
  const max = Math.max(...series);
  const min = Math.min(...series);
  const range = max - min || 1;
  const step = w / (series.length - 1);
  const pts = series.map((v, i) => {
    const x = i * step;
    const y = h - ((v - min) / range) * (h * 0.8) - h * 0.1;
    return [x, y];
  });
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;
  return { line, area };
}

export default function AnalyticsPage() {
  const [activeMetric, setActiveMetric] = useState<MetricId>("revenue");
  const [dimension, setDimension] = useState<Dimension>("location");

  const metric = metrics.find((m) => m.id === activeMetric)!;
  const series = seriesByMetric[activeMetric];
  const { line, area } = buildPath(series, 600, 200);
  const rows = breakdowns[activeMetric][dimension];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[22px] font-bold text-neutral-900 tracking-tight">Executive Analytics</h1>
        <p className="text-[13px] text-neutral-500 mt-1">Click any metric to drill down and explain the trend.</p>
      </div>

      {/* KPI Cards (clickable) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <button
            key={m.id}
            onClick={() => setActiveMetric(m.id)}
            className={`text-left bg-white border rounded-xl p-4 transition-all ${
              activeMetric === m.id ? "border-neutral-900 ring-2 ring-neutral-900/10 shadow-sm" : "border-neutral-200 hover:border-neutral-300"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${m.color}15`, color: m.color }}>
                <m.icon size={16} />
              </div>
              <span className={`text-[11px] font-bold ${m.up ? "text-emerald-600" : "text-rose-600"}`}>{m.change}</span>
            </div>
            <p className="text-[20px] font-bold text-neutral-900 tracking-tight">{m.value}</p>
            <p className="text-[11px] font-medium text-neutral-500 mt-1">{m.label}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[15px] font-semibold text-neutral-900">{metric.label} — Last 30 Days</h2>
              <p className="text-[12px] text-neutral-500">Daily trend with drill-down below</p>
            </div>
            <span className={`text-[12px] font-bold ${metric.up ? "text-emerald-600" : "text-rose-600"}`}>{metric.change}</span>
          </div>
          <svg viewBox="0 0 600 200" className="w-full h-56">
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={metric.color} stopOpacity="0.25" />
                <stop offset="100%" stopColor={metric.color} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={area} fill="url(#areaGrad)" />
            <path d={line} fill="none" stroke={metric.color} strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* Breakdown Panel */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <ArrowRight size={14} className="text-neutral-400" />
            <h2 className="text-[14px] font-semibold text-neutral-900">Why did it move?</h2>
          </div>

          <div className="flex gap-1 mb-5 bg-neutral-100 rounded-lg p-1">
            {dimensions.map((d) => (
              <button
                key={d.id}
                onClick={() => setDimension(d.id)}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-[11px] font-semibold rounded-md transition-colors ${
                  dimension === d.id ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
                }`}
              >
                <d.icon size={12} /> {d.label.replace("By ", "")}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {rows.map((r) => (
              <div key={r.label}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[12px] font-medium text-neutral-800">{r.label}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-[12px] font-bold text-neutral-900">{r.value}</p>
                    <span className={`text-[10px] font-bold ${r.up ? "text-emerald-600" : "text-rose-600"}`}>{r.change}</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${r.share}%`, backgroundColor: metric.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}