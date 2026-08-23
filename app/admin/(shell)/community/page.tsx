"use client";

import { DataTable, Column } from "@/components/admin/admin-ui/DataTable";
import { MessageSquare, Eye, Heart, Flag, Pin, Zap } from "lucide-react";

interface Post {
  id: string;
  author: string;
  content: string;
  likes: number;
  comments: number;
  views: number;
  flags: number;
  status: "Active" | "Pinned" | "Boosted" | "Hidden";
  postedAt: string;
}

const mockPosts: Post[] = [
  { id: "PST-881", author: "@rahul_s", content: "Just won the 5v5 tournament at Champions Turf! Amazing vibes 🔥", likes: 234, comments: 42, views: 1800, flags: 0, status: "Pinned", postedAt: "2h ago" },
  { id: "PST-882", author: "@priya.p", content: "Looking for 2 more players for tomorrow's box cricket match in Andheri", likes: 18, comments: 8, views: 340, flags: 0, status: "Active", postedAt: "4h ago" },
  { id: "PST-883", author: "@vikky", content: "Spam message with inappropriate content", likes: 2, comments: 1, views: 45, flags: 12, status: "Hidden", postedAt: "6h ago" },
  { id: "PST-884", author: "@aisha_k", content: "New pickleball courts opening in Koramangala! Who's interested?", likes: 156, comments: 34, views: 2100, flags: 0, status: "Boosted", postedAt: "1d ago" },
];

const statusColors: Record<string, string> = {
  "Active": "bg-neutral-100 text-neutral-700 border-neutral-200",
  "Pinned": "bg-amber-50 text-amber-700 border-amber-200",
  "Boosted": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Hidden": "bg-rose-50 text-rose-700 border-rose-200",
};

export default function CommunityPage() {
  const columns: Column<Post>[] = [
    { key: "content", label: "Post", render: (row) => (
      <div>
        <p className="font-medium text-neutral-900 truncate max-w-md">{row.content}</p>
        <p className="text-[11px] text-neutral-500 mt-0.5">{row.author} • {row.postedAt}</p>
      </div>
    )},
    { key: "likes", label: "Likes", render: (row) => (
      <span className="inline-flex items-center gap-1 text-[12px]"><Heart size={12}/>{row.likes}</span>
    )},
    { key: "views", label: "Views", render: (row) => (
      <span className="inline-flex items-center gap-1 text-[12px]"><Eye size={12}/>{row.views.toLocaleString()}</span>
    )},
    { key: "flags", label: "Flags", render: (row) => (
      row.flags > 0 ? <span className="inline-flex items-center gap-1 text-rose-600 text-[12px] font-semibold"><Flag size={12}/>{row.flags}</span> : <span className="text-neutral-400">—</span>
    )},
    { key: "status", label: "Status", render: (row) => (
      <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold border ${statusColors[row.status]}`}>
        {row.status}
      </span>
    )},
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-neutral-900 tracking-tight flex items-center gap-2">
          <MessageSquare size={24} className="text-neutral-700" />
          Community & Feed
        </h1>
        <p className="text-[13px] text-neutral-500 mt-1">Moderate posts, boost content, and manage feed distribution.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-neutral-500 mb-2"><MessageSquare size={14}/><p className="text-[11px] font-semibold uppercase">Total Posts</p></div>
          <p className="text-[20px] font-bold text-neutral-900">12,847</p>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-amber-600 mb-2"><Pin size={14}/><p className="text-[11px] font-semibold uppercase">Pinned</p></div>
          <p className="text-[20px] font-bold text-amber-600">24</p>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-indigo-600 mb-2"><Zap size={14}/><p className="text-[11px] font-semibold uppercase">Boosted</p></div>
          <p className="text-[20px] font-bold text-indigo-600">142</p>
        </div>
        <div className="bg-white border border-rose-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-rose-600 mb-2"><Flag size={14}/><p className="text-[11px] font-semibold uppercase">Flagged</p></div>
          <p className="text-[20px] font-bold text-rose-600">8</p>
        </div>
      </div>

      <DataTable columns={columns} data={mockPosts} pageSize={10} emptyStateMessage="No posts found." />
    </div>
  );
}