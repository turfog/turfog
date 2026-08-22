"use client";

import { useState } from "react";
import { User360Drawer } from "@/components/admin/admin-ui/User360Drawer";

import { DataTable, Column } from "@/components/admin/admin-ui/DataTable";
import { Shield, CheckCircle2, AlertTriangle } from "lucide-react";

// Mock data for demonstration (will be replaced by DB queries)
const mockUsers = [
  { id: "1", name: "Rahul Sharma", username: "rahul_s", email: "rahul@gmail.com", status: "Verified", sport: "Football", joined: "2024-01-12" },
  { id: "2", name: "Priya Patel", username: "priya.p", email: "priya@outlook.com", status: "Pending", sport: "Badminton", joined: "2024-02-05" },
  { id: "3", name: "Vikram Singh", username: "vikky", email: "vikram@yahoo.com", status: "Suspended", sport: "Cricket", joined: "2023-11-20" },
  { id: "4", name: "Aisha Khan", username: "aisha_k", email: "aisha@gmail.com", status: "Verified", sport: "Pickleball", joined: "2024-03-01" },
  { id: "5", name: "Rohan Mehta", username: "rohan.m", email: "rohan@outlook.com", status: "Verified", sport: "Football", joined: "2023-12-15" },
  { id: "6", name: "Sneha Reddy", username: "sneha_r", email: "sneha@gmail.com", status: "Pending", sport: "Badminton", joined: "2024-03-10" },
  { id: "7", name: "Arjun Nair", username: "arjun", email: "arjun@yahoo.com", status: "Verified", sport: "Cricket", joined: "2024-01-22" },
  { id: "8", name: "Kavya Iyer", username: "kavya.i", email: "kavya@gmail.com", status: "Verified", sport: "Pickleball", joined: "2024-02-28" },
  { id: "9", name: "Dev Kapoor", username: "dev_k", email: "dev@outlook.com", status: "Suspended", sport: "Football", joined: "2023-10-05" },
  { id: "10", name: "Meera Joshi", username: "meera.j", email: "meera@gmail.com", status: "Verified", sport: "Badminton", joined: "2024-03-15" },
];

const columns: Column<typeof mockUsers[0]>[] = [
  { 
    key: "name", 
    label: "User", 
    render: (row) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center text-[11px] font-bold text-neutral-600">
          {row.name.split(" ").map(n => n[0]).join("")}
        </div>
        <div>
          <p className="font-medium text-neutral-900">{row.name}</p>
          <p className="text-[11px] text-neutral-500">@{row.username}</p>
        </div>
      </div>
    )
  },
  { key: "email", label: "Email" },
  { key: "sport", label: "Primary Sport" },
  { 
    key: "status", 
    label: "Status",
    render: (row) => {
      if (row.status === "Verified") return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200"><CheckCircle2 size={10}/>Verified</span>;
      if (row.status === "Pending") return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[11px] font-semibold border border-amber-200"><AlertTriangle size={10}/>Pending</span>;
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[11px] font-semibold border border-rose-200"><Shield size={10}/>Suspended</span>;
    }
  },
  { key: "joined", label: "Joined" },
];

export default function UsersPage() {
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
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

      <DataTable columns={columns} data={mockUsers} pageSize={8} onRowClick={(row) => setSelectedUser(row)} />
      
      <User360Drawer user={selectedUser} onClose={() => setSelectedUser(null)} />
    </div>
  );
}