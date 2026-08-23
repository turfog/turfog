"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/admin/admin-ui/DataTable";
import { Drawer } from "@/components/admin/admin-ui/Drawer";
import { Trophy, Users, MapPin, Clock, AlertTriangle, CheckCircle2, XCircle, X } from "lucide-react";

interface Match {
  id: string;
  sport: string;
  teams: string;
  venue: string;
  date: string;
  status: "Scheduled" | "Live" | "Completed" | "Cancelled";
  players: number;
  flags: number;
}

const mockMatches: Match[] = [
  { id: "MTH-881", sport: "Football", teams: "Warriors vs Titans", venue: "Champions Turf, Andheri", date: "Today, 6 PM", status: "Scheduled", players: 10, flags: 0 },
  { id: "MTH-882", sport: "Box Cricket", teams: "Strikers vs Kings", venue: "Sports Hub, Bandra", date: "Yesterday, 8 PM", status: "Completed", players: 12, flags: 0 },
  { id: "MTH-883", sport: "Pickleball", teams: "Doubles Match", venue: "Smash Club, Koramangala", date: "Today, 4 PM", status: "Live", players: 4, flags: 0 },
  { id: "MTH-884", sport: "Football", teams: "United vs City", venue: "Goal Arena, Chennai", date: "Tomorrow, 7 PM", status: "Cancelled", players: 0, flags: 2 },
];

const statusColors: Record<string, string> = {
  "Scheduled": "bg-blue-50 text-blue-700 border-blue-200",
  "Live": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Completed": "bg-neutral-100 text-neutral-700 border-neutral-200",
  "Cancelled": "bg-rose-50 text-rose-700 border-rose-200",
};

const sportIcons: Record<string, string> = {
  "Football": "⚽",
  "Box Cricket": "🏏",
  "Pickleball": "🏓",
  "Badminton": "🏸",
};

export default function SportsPage() {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  const columns: Column<Match>[] = [
    { key: "teams", label: "Match", render: (row) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-[20px] flex-shrink-0">
          {sportIcons[row.sport] || "🏆"}
        </div>
        <div>
          <p className="font-medium text-neutral-900">{row.teams}</p>
          <p className="text-[11px] text-neutral-500">{row.sport} • {row.id}</p>
        </div>
      </div>
    )},
    { key: "venue", label: "Venue", render: (row) => (
      <div className="flex items-center gap-1 text-[12px] text-neutral-600">
        <MapPin size={12} />
        <span className="truncate max-w-xs">{row.venue}</span>
      </div>
    )},
    { key: "date", label: "Date" },
    { key: "players", label: "Players", render: (row) => (
      <span className="inline-flex items-center gap-1 text-[12px]"><Users size={12}/>{row.players}</span>
    )},
    { key: "status", label: "Status", render: (row) => (
      <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold border ${statusColors[row.status]}`}>
        {row.status}
      </span>
    )},
    { key: "flags", label: "Flags", render: (row) => (
      row.flags > 0 ? <span className="inline-flex items-center gap-1 text-rose-600 text-[12px] font-semibold"><AlertTriangle size={12}/>{row.flags}</span> : <span className="text-neutral-400">—</span>
    )},
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-neutral-900 tracking-tight flex items-center gap-2">
            <Trophy size={24} className="text-neutral-700" />
            Sports & Matches
          </h1>
          <p className="text-[13px] text-neutral-500 mt-1">Manage matches, track reliability, and resolve disputes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-neutral-500 mb-2"><Trophy size={14}/><p className="text-[11px] font-semibold uppercase">Total Matches</p></div>
          <p className="text-[20px] font-bold text-neutral-900">8,431</p>
        </div>
        <div className="bg-white border border-emerald-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-emerald-600 mb-2"><Clock size={14}/><p className="text-[11px] font-semibold uppercase">Live Now</p></div>
          <p className="text-[20px] font-bold text-emerald-600">42</p>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-neutral-500 mb-2"><CheckCircle2 size={14}/><p className="text-[11px] font-semibold uppercase">Completion Rate</p></div>
          <p className="text-[20px] font-bold text-neutral-900">94%</p>
        </div>
        <div className="bg-white border border-rose-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-rose-600 mb-2"><AlertTriangle size={14}/><p className="text-[11px] font-semibold uppercase">Cancellations</p></div>
          <p className="text-[20px] font-bold text-rose-600">6%</p>
        </div>
      </div>

      <DataTable columns={columns} data={mockMatches} pageSize={10} onRowClick={setSelectedMatch} />

      {/* Match Details Drawer */}
      <Drawer open={!!selectedMatch} onClose={() => setSelectedMatch(null)}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/50">
            <h2 className="text-[15px] font-semibold text-neutral-900">Match Details</h2>
            <button onClick={() => setSelectedMatch(null)} className="p-1 hover:bg-neutral-200 rounded-md text-neutral-500">
              <X size={18} />
            </button>
          </div>
          {selectedMatch && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="text-center py-6 bg-neutral-50 rounded-xl">
                <div className="text-[48px] mb-2">{sportIcons[selectedMatch.sport] || "🏆"}</div>
                <h3 className="text-[18px] font-bold text-neutral-900">{selectedMatch.teams}</h3>
                <p className="text-[13px] text-neutral-500 mt-1">{selectedMatch.sport} • {selectedMatch.id}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3">
                  <p className="text-[11px] text-neutral-500 uppercase">Venue</p>
                  <p className="text-[13px] font-medium mt-1">{selectedMatch.venue}</p>
                </div>
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3">
                  <p className="text-[11px] text-neutral-500 uppercase">Date</p>
                  <p className="text-[13px] font-medium mt-1">{selectedMatch.date}</p>
                </div>
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3">
                  <p className="text-[11px] text-neutral-500 uppercase">Players</p>
                  <p className="text-[18px] font-bold">{selectedMatch.players}</p>
                </div>
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3">
                  <p className="text-[11px] text-neutral-500 uppercase">Status</p>
                  <p className="text-[13px] font-bold mt-1">{selectedMatch.status}</p>
                </div>
              </div>
              {selectedMatch.flags > 0 && (
                <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
                  <p className="text-[12px] font-semibold text-rose-900 flex items-center gap-2">
                    <AlertTriangle size={14} /> {selectedMatch.flags} flags reported
                  </p>
                  <p className="text-[12px] text-rose-700 mt-1">Review in Trust & Safety queue</p>
                </div>
              )}
            </div>
          )}
          <div className="border-t border-neutral-200 p-4 bg-neutral-50 flex items-center gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600 text-white text-[13px] font-semibold rounded-lg hover:bg-rose-700">
              <XCircle size={16} /> Cancel Match
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-[13px] font-semibold rounded-lg hover:bg-emerald-700">
              <CheckCircle2 size={16} /> Verify Result
            </button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}