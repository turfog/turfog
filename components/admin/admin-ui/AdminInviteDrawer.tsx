"use client";

import { useState } from "react";
import { Drawer } from "./Drawer";
import { X, Mail, ShieldCheck, Send } from "lucide-react";

interface AdminInviteDrawerProps {
  open: boolean;
  onClose: () => void;
}

const roles = [
  { id: "super_admin", label: "Super Admin", desc: "Full unrestricted access to all systems and billing." },
  { id: "moderator", label: "Trust & Safety", desc: "Can review reports, suspend users, and remove content." },
  { id: "ad_reviewer", label: "Ad Reviewer", desc: "Can approve, reject, and manage advertising campaigns." },
  { id: "marketplace", label: "Marketplace Ops", desc: "Can manage products, sellers, and resolve escrow disputes." },
  { id: "finance", label: "Finance", desc: "View-only access to revenue, payouts, and ledgers." },
  { id: "viewer", label: "Viewer", desc: "Read-only access to analytics and dashboards." },
];

export function AdminInviteDrawer({ open, onClose }: AdminInviteDrawerProps) {
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("moderator");
  const [sending, setSending] = useState(false);

  const handleInvite = () => {
    setSending(true);
    setTimeout(() => {
      console.log(`[AUDIT LOG] Invited ${email} as ${selectedRole}`);
      alert(`Invitation sent to ${email}!`);
      setSending(false);
      setEmail("");
      onClose();
    }, 1000);
  };

  return (
    <Drawer open={open} onClose={onClose}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-purple-600" size={18} />
            <h2 className="text-[15px] font-semibold text-neutral-900">Invite Administrator</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-neutral-200 rounded-md text-neutral-500 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Email Input */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">
              Work Email Address
            </label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@turfog.com"
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-neutral-200 rounded-lg text-[13px] outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">
              Assign Permission Role
            </label>
            <div className="space-y-2">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedRole === role.id
                      ? "bg-purple-50 border-purple-300 ring-2 ring-purple-500/20"
                      : "bg-white border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <p className={`text-[13px] font-semibold ${selectedRole === role.id ? "text-purple-900" : "text-neutral-900"}`}>
                    {role.label}
                  </p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">{role.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="border-t border-neutral-200 p-4 bg-neutral-50">
          <button
            onClick={handleInvite}
            disabled={!email || sending}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 text-white text-[13px] font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {sending ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send size={14} />
                Send Secure Invitation
              </>
            )}
          </button>
        </div>
      </div>
    </Drawer>
  );
}