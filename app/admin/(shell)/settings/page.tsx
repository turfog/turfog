"use client";

import { useState } from "react";
import { Settings, Shield, Bell, Globe, Save } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "notifications" | "security">("general");

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-neutral-900 tracking-tight flex items-center gap-2">
          <Settings size={24} className="text-neutral-700" />
          System Settings
        </h1>
        <p className="text-[13px] text-neutral-500 mt-1">Configure platform behavior, notifications, and security policies.</p>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        <div className="flex border-b border-neutral-200">
          <button
            onClick={() => setActiveTab("general")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-[13px] font-semibold transition-colors ${
              activeTab === "general" ? "bg-neutral-50 text-neutral-900 border-b-2 border-neutral-900" : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            <Globe size={16} /> General
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-[13px] font-semibold transition-colors ${
              activeTab === "notifications" ? "bg-neutral-50 text-neutral-900 border-b-2 border-neutral-900" : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            <Bell size={16} /> Notifications
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-[13px] font-semibold transition-colors ${
              activeTab === "security" ? "bg-neutral-50 text-neutral-900 border-b-2 border-neutral-900" : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            <Shield size={16} /> Security
          </button>
        </div>

        <div className="p-6">
          {activeTab === "general" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-[14px] font-semibold text-neutral-900 mb-4">Platform Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[12px] font-medium text-neutral-700 mb-2">Platform Name</label>
                    <input
                      type="text"
                      defaultValue="Turfog"
                      className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg text-[13px] outline-none focus:border-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-neutral-700 mb-2">Default Currency</label>
                    <select className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg text-[13px] outline-none focus:border-neutral-900">
                      <option>INR (₹)</option>
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-neutral-700 mb-2">Timezone</label>
                    <select className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg text-[13px] outline-none focus:border-neutral-900">
                      <option>Asia/Kolkata (IST)</option>
                      <option>UTC</option>
                    </select>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-neutral-900 mb-4">Feature Flags</h3>
                <div className="space-y-3">
                  {[
                    { label: "Enable Video Uploads", desc: "Allow users to upload match highlights", enabled: true },
                    { label: "Marketplace Escrow", desc: "Hold funds until buyer confirms delivery", enabled: true },
                    { label: "AI Content Moderation", desc: "Auto-flag inappropriate content", enabled: false },
                  ].map((flag) => (
                    <div key={flag.label} className="flex items-center justify-between p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
                      <div>
                        <p className="text-[13px] font-medium text-neutral-900">{flag.label}</p>
                        <p className="text-[11px] text-neutral-500 mt-0.5">{flag.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={flag.enabled} className="sr-only peer" />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-neutral-900/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-900"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-[14px] font-semibold text-neutral-900 mb-4">Email Notifications</h3>
                <div className="space-y-3">
                  {["New user registration", "Match completion", "Payment received", "Report filed"].map((notif) => (
                    <div key={notif} className="flex items-center justify-between p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
                      <p className="text-[13px] font-medium text-neutral-900">{notif}</p>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-neutral-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-900"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-[14px] font-semibold text-neutral-900 mb-4">Authentication</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[13px] font-medium text-neutral-900">Two-Factor Authentication</p>
                        <p className="text-[11px] text-neutral-500 mt-0.5">Require 2FA for all admin accounts</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-neutral-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-900"></div>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-neutral-700 mb-2">Session Timeout (minutes)</label>
                    <input
                      type="number"
                      defaultValue="60"
                      className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg text-[13px] outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-neutral-200 flex justify-end">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-neutral-900 text-white text-[13px] font-semibold rounded-lg hover:bg-neutral-800">
              <Save size={14} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}