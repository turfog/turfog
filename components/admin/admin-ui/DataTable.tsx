"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, MoreHorizontal, Search } from "lucide-react";

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  onRowClick?: (row: T) => void;
  emptyStateMessage?: string;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  pageSize = 10,
  onRowClick,
  emptyStateMessage = "No records found",
}: DataTableProps<T>) {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const totalPages = Math.ceil(data.length / pageSize);
  const pagedData = data.slice((page - 1) * pageSize, page * pageSize);
  const allSelected = pagedData.length > 0 && pagedData.every(row => selected.has(row.id));

  const toggleAll = () => {
    const newSelected = new Set(selected);
    if (allSelected) {
      pagedData.forEach(row => newSelected.delete(row.id));
    } else {
      pagedData.forEach(row => newSelected.add(row.id));
    }
    setSelected(newSelected);
  };

  const toggleRow = (id: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelected(newSelected);
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 bg-neutral-50/50">
        <div className="flex items-center gap-2">
          <Search size={14} className="text-neutral-400" />
          <input
            placeholder="Search records..."
            className="bg-transparent text-[13px] text-neutral-900 outline-none placeholder:text-neutral-400 w-64"
          />
        </div>
        {selected.size > 0 && (
          <div className="flex items-center gap-2 text-[12px] text-neutral-600">
            <span className="font-medium">{selected.size} selected</span>
            <button className="px-2 py-1 bg-neutral-900 text-white rounded-md hover:bg-neutral-800 transition-colors">
              Bulk Actions
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200 sticky top-0">
            <tr>
              <th className="w-10 px-4 py-2.5">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="w-3.5 h-3.5 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500/20"
                />
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-2.5 text-left text-[11px] font-semibold text-neutral-500 uppercase tracking-wider",
                    col.className
                  )}
                >
                  {col.label}
                </th>
              ))}
              <th className="w-10 px-4 py-2.5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {pagedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2} className="px-4 py-12 text-center text-[13px] text-neutral-500">
                  {emptyStateMessage}
                </td>
              </tr>
            ) : (
              pagedData.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    "group",
                    onRowClick && "cursor-pointer hover:bg-neutral-50 transition-colors",
                    selected.has(row.id) && "bg-emerald-50/30"
                  )}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(row.id)}
                      onChange={() => toggleRow(row.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-3.5 h-3.5 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500/20"
                    />
                  </td>
                  {columns.map((col) => (
                    <td key={col.key} className={cn("px-4 py-3 text-[13px] text-neutral-700", col.className)}>
                      {col.render ? col.render(row) : (row as any)[col.key]}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 hover:bg-neutral-100 rounded text-neutral-400 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-200 bg-neutral-50/50">
          <p className="text-[12px] text-neutral-500">
            Showing <span className="font-medium text-neutral-900">{(page - 1) * pageSize + 1}</span> to{" "}
            <span className="font-medium text-neutral-900">{Math.min(page * pageSize, data.length)}</span> of{" "}
            <span className="font-medium text-neutral-900">{data.length}</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-md border border-neutral-200 text-neutral-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-md border border-neutral-200 text-neutral-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}