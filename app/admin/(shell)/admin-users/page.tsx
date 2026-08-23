"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/admin/admin-ui/DataTable";
import { AdminInviteDrawer } from "@/components/admin/admin-ui/AdminInviteDrawer";
import { Users as UsersIcon, Shield, Plus } from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Trust & Safety" | "Ad Reviewer" | "Marketplace Ops" | "Finance" | "Viewer";
  status: "Active" | "Invited" | "Suspended";
  lastActive: string;
}

const mockAdmins: AdminUser[] = [
  { id: "1", name: "You (Founder)", email: "admin@turfog.com", role: "Super Admin", status: "Active", lastActive: "Just now" },
  { id: "2", name: "Sarah Chen", email: "sarah@turfog.com", role: "Ad Reviewer", status: "Active", lastActive: "18m ago" },
  { id: "3", name: "Maya Patel", email: "maya@turfog.com", role: "Trust & Safety", status: "Active", lastActive: "2h ago" },
  { id: "4", name: "John Carter", email: "john@turfog.com", role: "Finance", status: "Active", lastActive: "1d ago" },
  { id: "5", name: "David Kim", email: "david@turfog.com", role: "Marketplace Ops", status: "Invited", lastActive: "Never" },
];

const roleColors: Record<string, string> = {
  "Super Admin": "bg-purple-50 text-purple-700 border-purple-200",
  "Trust & Safety": "bg-rose-50 text-rose-700 border-rose-200",
  "Ad Reviewer": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Marketplace Ops": "bg-amber-50 text-amber-700 border-amber-200",
  "Finance": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Viewer": "bg-neutral-100 text-neutral-700 border-neutral-200",
};

const statusColors: Record<string, string> = {
  "Active": "bg-emerald-500",
  "Invited": "bg-amber-500",
  "Suspended": "bg-rose-500",
};

export default function AdminUsersPage() {
  const [showInvite, setShowInvite] = useState(false);

  const columns: Column<AdminUser>[] = [
    { key: "name", label: "Administrator", render: (row) => (
      <div>
        <p className="font-medium text-neutral-900">{row.name}</p>
        <p className="text-[11px] text-neutral-500">{row.email}</p>
      </div>
    )},
    { 
      key: "role", 
      label: "Role & Permissions",
      render: (row) => (
        <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold border ${roleColors[row.role]}`}>
          {row.role}
        </span>
      )
    },
    { 
      key: "status", 
      label: "Status",
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${statusColors[row.status]}`} />
          <span className="text-[12px] text-neutral-700 font-medium">{row.status}</span>
        </div>
      )
    },
    { key: "lastActive", label: "Last Active", render: (row) => <span className="text-[12px] text-neutral-500">{row.lastActive}</span> },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-neutral-900 tracking-tight flex items-center gap-2">
            <UsersIcon size={24} className="text-neutral-700" />
            Admin Users & Roles
          </h1>
          <p className="text-[13px] text-neutral-500 mt-1">Manage team access, permissions, and security scopes.</p>
        </div>
        <button 
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-[13px] font-semibold rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
        >
          <Plus size={16} />
          Invite Admin
        </button>
      </div>

      {/* Security Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <Shield size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[12px] font-semibold text-amber-900">Role-Based Access Control (RBAC) Active</p>
          <p className="text-[12px] text-amber-700 mt-0.5">
            Administrators can only access modules assigned to their role. All actions are recorded in the Audit Log.
          </p>
        </div>
      </div>

      {/* Admins Table */}
      <DataTable 
        columns={columns} 
        data={mockAdmins} 
        pageSize={10} 
        emptyStateMessage="No administrators found."
      />

      {/* Invite Drawer */}
      <AdminInviteDrawer open={showInvite} onClose={() => setShowInvite(false)} />
    </div>
  );
}