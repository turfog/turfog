"use client";

import { usePathname } from "next/navigation";
import { Search, Bell, ChevronRight, LogOut } from "lucide-react";
import { logoutAdmin } from "@/app/admin/login/actions";
import { useRouter } from "next/navigation";
import { useCommandPalette } from "./CommandPalette";

export function AdminTopbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { setOpen } = useCommandPalette();

  const handleLogout = async () => {
    await logoutAdmin();
    router.push("/admin/login");
    router.refresh();
  };

  // Generate breadcrumbs from pathname
  const crumbs = pathname.split("/").filter(Boolean).map(c => c.charAt(0).toUpperCase() + c.slice(1));

  return (
    <header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-6">
      <div className="flex items-center gap-2 text-[13px] text-neutral-500">
        <span className="font-medium text-neutral-900">Turfog</span>
        {crumbs.map((crumb, i) => (
          <div key={i} className="flex items-center gap-2">
            <ChevronRight size={14} className="text-neutral-300" />
            <span className={i === crumbs.length - 1 ? "text-neutral-900 font-medium" : ""}>{crumb}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        {/* Global Search Trigger */}
        <button 
          onClick={() => setOpen(true)}
          className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-[13px] text-neutral-500 hover:bg-neutral-100 transition-colors w-64"
        >
          <Search size={14} />
          <span className="flex-1 text-left">Search users, orders, ads...</span>
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-neutral-200 bg-white px-1.5 font-mono text-[10px] font-medium text-neutral-400">
            ⌘K
          </kbd>
        </button>

        <button className="relative p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
        </button>

        <div className="h-6 w-px bg-neutral-200 mx-1" />

        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 p-2 text-neutral-500 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}