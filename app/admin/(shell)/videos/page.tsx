"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/admin/admin-ui/DataTable";
import { Drawer } from "@/components/admin/admin-ui/Drawer";
import { X, Video, CheckCircle2, XCircle, Flag, Play } from "lucide-react";

interface VideoItem {
  id: string;
  title: string;
  creator: string;
  duration: string;
  views: number;
  status: "Published" | "Pending Review" | "Rejected" | "Processing";
  uploadedAt: string;
  flags: number;
}

const mockVideos: VideoItem[] = [
  { id: "VID-881", title: "Epic 5v5 Football Highlights", creator: "@rahul_s", duration: "2:34", views: 12400, status: "Published", uploadedAt: "2h ago", flags: 0 },
  { id: "VID-882", title: "Box Cricket Tutorial: Perfect Your Grip", creator: "@priya.p", duration: "5:12", views: 0, status: "Pending Review", uploadedAt: "4h ago", flags: 0 },
  { id: "VID-883", title: "Pickleball Doubles Strategy", creator: "@vikky", duration: "8:45", views: 3200, status: "Published", uploadedAt: "1d ago", flags: 3 },
  { id: "VID-884", title: "Match Day Vlog: Champions Turf", creator: "@aisha_k", duration: "12:30", views: 0, status: "Processing", uploadedAt: "6h ago", flags: 0 },
  { id: "VID-885", title: "Copyrighted Music Compilation", creator: "@spam_user", duration: "3:15", views: 0, status: "Rejected", uploadedAt: "2d ago", flags: 8 },
];

const statusColors: Record<string, string> = {
  "Published": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Pending Review": "bg-amber-50 text-amber-700 border-amber-200",
  "Rejected": "bg-rose-50 text-rose-700 border-rose-200",
  "Processing": "bg-blue-50 text-blue-700 border-blue-200",
};

export default function VideosPage() {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  const columns: Column<VideoItem>[] = [
    { key: "title", label: "Video", render: (row) => (
      <div className="flex items-center gap-3">
        <div className="w-16 h-10 rounded-md bg-neutral-100 flex items-center justify-center text-neutral-400 flex-shrink-0">
          <Video size={16} />
        </div>
        <div>
          <p className="font-medium text-neutral-900 truncate max-w-xs">{row.title}</p>
          <p className="text-[11px] text-neutral-500">{row.creator} • {row.duration}</p>
        </div>
      </div>
    )},
    { key: "views", label: "Views", render: (row) => <span className="font-medium">{row.views.toLocaleString()}</span> },
    { key: "status", label: "Status", render: (row) => (
      <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold border ${statusColors[row.status]}`}>
        {row.status}
      </span>
    )},
    { key: "flags", label: "Flags", render: (row) => (
      row.flags > 0 ? <span className="inline-flex items-center gap-1 text-rose-600 text-[12px] font-semibold"><Flag size={12}/>{row.flags}</span> : <span className="text-neutral-400">—</span>
    )},
    { key: "uploadedAt", label: "Uploaded" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-neutral-900 tracking-tight">Video Management</h1>
          <p className="text-[13px] text-neutral-500 mt-1">Review uploads, handle copyright, and manage distribution.</p>
        </div>
      </div>

      <DataTable columns={columns} data={mockVideos} pageSize={10} onRowClick={setSelectedVideo} />

      {/* Video Review Drawer */}
      <Drawer open={!!selectedVideo} onClose={() => setSelectedVideo(null)}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/50">
            <h2 className="text-[15px] font-semibold text-neutral-900">Video Review</h2>
            <button onClick={() => setSelectedVideo(null)} className="p-1 hover:bg-neutral-200 rounded-md text-neutral-500">
              <X size={18} />
            </button>
          </div>
          {selectedVideo && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="aspect-video bg-neutral-900 rounded-xl flex items-center justify-center">
                <Play size={48} className="text-white/50" />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-neutral-900">{selectedVideo.title}</h3>
                <p className="text-[13px] text-neutral-500 mt-1">{selectedVideo.creator} • {selectedVideo.duration}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3">
                  <p className="text-[11px] text-neutral-500 uppercase">Views</p>
                  <p className="text-[18px] font-bold">{selectedVideo.views.toLocaleString()}</p>
                </div>
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3">
                  <p className="text-[11px] text-neutral-500 uppercase">Flags</p>
                  <p className="text-[18px] font-bold text-rose-600">{selectedVideo.flags}</p>
                </div>
              </div>
            </div>
          )}
          <div className="border-t border-neutral-200 p-4 bg-neutral-50 flex items-center gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600 text-white text-[13px] font-semibold rounded-lg hover:bg-rose-700">
              <XCircle size={16} /> Remove
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-[13px] font-semibold rounded-lg hover:bg-emerald-700">
              <CheckCircle2 size={16} /> Approve
            </button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}