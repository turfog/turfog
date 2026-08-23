"use client";

import { useState } from "react";
import { Drawer } from "./Drawer";
import { X, ShieldCheck, UserX, Eye, Activity, Calendar, AlertTriangle } from "lucide-react";

interface User {
  id: string;
  full_name?: string;
  name?: string;
  username?: string;
  email?: string;
  verification_status?: string;
  status?: string;
  sport?: string;
  joined?: string;
  created_at?: string;
  profile_photo?: string | null;
  [key: string]: any;
}

interface User360DrawerProps {
  user: User | null;
  onClose: () => void;
  onVerify?: (userId: string) => void;
  onSuspend?: (userId: string) => void;
}

export function User360Drawer({ user, onClose, onVerify, onSuspend }: User360DrawerProps) {
  const [tab, setTab] = useState<"overview" | "activity" | "audit">("overview");

  if (!user) return null;

  return (
    <Drawer open={!!user} onClose={onClose}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/50">
          <h2 className="text-[15px] font-semibold text-neutral-900">User 360° Profile</h2>
          <button onClick={onClose} className="p-1 hover:bg-neutral-200 rounded-md text-neutral-500 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Hero */}
          <div className="px-6 py-6 border-b border-neutral-100">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center text-[18px] font-bold text-neutral-600 shadow-sm flex-shrink-0">
                {(user.full_name || user.name || "U").split(" ").map(n => n[0]).join("").substring(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[18px] font-bold text-neutral-900">{user.full_name || user.name}</h3>
                <p className="text-[13px] text-neutral-500 mb-2 truncate">@{user.username} • {user.email}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {(user.verification_status === "verified" || user.status === "Verified") ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
                      <ShieldCheck size={10} /> Verified
                    </span>
                  ) : (user.verification_status === "pending" || user.status === "Pending") ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[11px] font-semibold border border-amber-200">
                      <AlertTriangle size={10} /> Pending Review
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[11px] font-semibold border border-rose-200">
                      <UserX size={10} /> Suspended
                    </span>
                  )}
                  <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                    <Calendar size={10} /> Joined {user.joined || new Date(user.created_at || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 mt-6">
              <button 
                onClick={() => onVerify?.(user.id)}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 text-white text-[12px] font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <ShieldCheck size={14} /> Verify User
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-neutral-200 text-neutral-700 text-[12px] font-semibold rounded-lg hover:bg-neutral-50 transition-colors">
                <Eye size={14} /> Impersonate
              </button>
              <button 
                onClick={() => onSuspend?.(user.id)}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-rose-200 text-rose-600 text-[12px] font-semibold rounded-lg hover:bg-rose-50 transition-colors"
              >
                <UserX size={14} /> Suspend
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-neutral-200 px-6">
            <nav className="flex gap-6">
              {(["overview", "activity", "audit"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`py-3 text-[13px] font-medium border-b-2 transition-colors capitalize ${
                    tab === t
                      ? "border-emerald-600 text-emerald-600"
                      : "border-transparent text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  {t}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {tab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-3">Platform Stats</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3">
                      <p className="text-[18px] font-bold text-neutral-900">42</p>
                      <p className="text-[11px] text-neutral-500">Matches Played</p>
                    </div>
                    <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3">
                      <p className="text-[18px] font-bold text-emerald-600">4.8</p>
                      <p className="text-[11px] text-neutral-500">Trust Score</p>
                    </div>
                    <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3">
                      <p className="text-[18px] font-bold text-rose-600">0</p>
                      <p className="text-[11px] text-neutral-500">Open Reports</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-3">Recent Activity</h4>
                  <div className="space-y-4">
                    {[
                      { icon: Activity, color: "text-blue-600 bg-blue-50", text: 'Joined match "Sunday Football at Turf 5"', time: "2 hours ago" },
                      { icon: Activity, color: "text-emerald-600 bg-emerald-50", text: 'Endorsed "Rohan Mehta" for Fair Play', time: "1 day ago" },
                      { icon: Activity, color: "text-amber-600 bg-amber-50", text: 'Updated profile photo and bio', time: "3 days ago" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3 text-[13px]">
                        <div className={`w-6 h-6 rounded-full ${item.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <item.icon size={12} />
                        </div>
                        <div>
                          <p className="text-neutral-900">{item.text}</p>
                          <p className="text-[11px] text-neutral-400">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {tab === "activity" && <p className="text-[13px] text-neutral-500">Detailed event stream coming in Phase 3...</p>}
            {tab === "audit" && <p className="text-[13px] text-neutral-500">Admin action history coming in Phase 3...</p>}
          </div>
        </div>
      </div>
    </Drawer>
  );
}