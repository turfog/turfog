"use client";

import { useState, useEffect } from "react";
import { DataTable, Column } from "@/components/admin/admin-ui/DataTable";
import { User360Drawer } from "@/components/admin/admin-ui/User360Drawer";
import { fetchUsers, verifyUser, suspendUser } from "./actions";
import { CheckCircle2, AlertTriangle, UserX, Calendar } from "lucide-react";

interface User {
  id: string;
  full_name: string;
  username: string;
  email: string;
  profile_photo: string | null;
  verification_status: string;
  created_at: string;
  last_active_at: string | null;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (userId: string) => {
    try {
      await verifyUser(userId);
      await loadUsers();
      alert("User verified successfully!");
    } catch (error) {
      alert("Failed to verify user");
    }
  };

  const handleSuspend = async (userId: string) => {
    const reason = prompt("Reason for suspension:");
    if (!reason) return;
    
    try {
      await suspendUser(userId, reason);
      await loadUsers();
      alert("User suspended successfully!");
    } catch (error) {
      alert("Failed to suspend user");
    }
  };

  const columns: Column<User>[] = [
    { 
      key: "full_name", 
      label: "User", 
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center text-[12px] font-bold text-neutral-600 overflow-hidden">
            {row.profile_photo ? (
              <img src={row.profile_photo} alt={row.full_name} className="w-full h-full object-cover" />
            ) : (
              row.full_name.split(" ").map(n => n[0]).join("")
            )}
          </div>
          <div>
            <p className="font-medium text-neutral-900">{row.full_name}</p>
            <p className="text-[11px] text-neutral-500">@{row.username}</p>
          </div>
        </div>
      )
    },
    { key: "email", label: "Email", render: (row) => <span className="text-[12px] text-neutral-600">{row.email}</span> },
    { 
      key: "verification_status", 
      label: "Status",
      render: (row) => {
        if (row.verification_status === "verified") return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200"><CheckCircle2 size={10}/>Verified</span>;
        if (row.verification_status === "pending") return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[11px] font-semibold border border-amber-200"><AlertTriangle size={10}/>Pending</span>;
        if (row.verification_status === "suspended") return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[11px] font-semibold border border-rose-200"><UserX size={10}/>Suspended</span>;
        return <span className="text-[11px] text-neutral-500">{row.verification_status}</span>;
      }
    },
    { 
      key: "created_at", 
      label: "Joined", 
      render: (row) => (
        <div className="flex items-center gap-1 text-[11px] text-neutral-500">
          <Calendar size={10} />
          {new Date(row.created_at).toLocaleDateString()}
        </div>
      )
    },
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-neutral-200 rounded"></div>
          <div className="h-64 bg-neutral-100 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-neutral-900 tracking-tight">Users</h1>
          <p className="text-[13px] text-neutral-500 mt-1">Manage platform users, permissions, and verification status.</p>
        </div>
        <button className="px-4 py-2 bg-neutral-900 text-white text-[13px] font-semibold rounded-lg hover:bg-neutral-800 transition-colors">
          Export CSV
        </button>
      </div>

      <DataTable columns={columns} data={users} pageSize={10} onRowClick={setSelectedUser} />

      <User360Drawer 
        user={selectedUser} 
        onClose={() => setSelectedUser(null)}
        onVerify={handleVerify}
        onSuspend={handleSuspend}
      />
    </div>
  );
}