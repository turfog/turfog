"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, Users, MessageSquare, Trophy, ShoppingBag, 
  Megaphone, Shield, Activity, ChevronRight, Zap,
  DollarSign, Flag, Video, BarChart3, FileText, Settings, Users as UsersIcon, TrendingUp, Sparkles
} from "lucide-react";

const navSections = [
  {
    title: "Command Center",
    items: [
      { label: "Executive Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Platform Pulse", href: "/admin/pulse", icon: Activity },
      { label: "Approvals & Queue", href: "/admin/approvals", icon: Zap },
      { label: "Alerts & Incidents", href: "/admin/alerts", icon: Flag },
    ]
  },
  {
    title: "Operations",
    items: [
      { label: "Users & 360°", href: "/admin/users", icon: Users },
      { label: "Community & Feed", href: "/admin/community", icon: MessageSquare },
      { label: "Sports & Matches", href: "/admin/sports", icon: Trophy },
      { label: "Video Management", href: "/admin/videos", icon: Video },
    ]
  },
  {
    title: "Monetization",
    items: [
      { label: "Marketplace", href: "/admin/marketplace", icon: ShoppingBag },
      { label: "Advertising", href: "/admin/advertising", icon: Megaphone },
      { label: "Finance & Payouts", href: "/admin/finance", icon: DollarSign },
    ]
  },
  {
    title: "Intelligence",
    items: [
      { label: "Analytics & Growth", href: "/admin/analytics", icon: BarChart3 },
      { label: "Growth & Retention", href: "/admin/growth", icon: TrendingUp },
      { label: "Platform Copilot", href: "/admin/copilot", icon: Sparkles },
      { label: "Trust & Safety", href: "/admin/moderation", icon: Shield },
    ]
  },
  {
    title: "Administration",
    items: [
      { label: "Audit Logs", href: "/admin/audit", icon: FileText },
      { label: "Admin Users & Roles", href: "/admin/admin-users", icon: UsersIcon },
      { label: "System Settings", href: "/admin/settings", icon: Settings },
    ]
  }
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 flex-col bg-[#0A0A0B] border-r border-neutral-800 text-neutral-300">
      {/* Logo Area */}
      <div className="flex h-16 items-center gap-2 px-6 border-b border-neutral-800">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Zap size={16} className="text-white" fill="white" />
        </div>
        <div className="flex flex-col">
          <span className="text-[13px] font-bold text-white tracking-tight">Turfog OS</span>
          <span className="text-[10px] text-neutral-500 font-medium uppercase tracking-wider">Command Center</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
        {navSections.map((section) => (
          <div key={section.title}>
            <h3 className="px-3 mb-2 text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
              {section.title}
            </h3>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-150",
                        isActive 
                          ? "bg-white/10 text-white shadow-sm" 
                          : "text-neutral-400 hover:bg-white/5 hover:text-neutral-200"
                      )}
                    >
                      <item.icon size={16} className={isActive ? "text-emerald-400" : "text-neutral-500"} />
                      {item.label}
                      {isActive && <ChevronRight size={14} className="ml-auto text-neutral-500" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer / Environment */}
      <div className="p-4 border-t border-neutral-800">
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-semibold text-emerald-400">System Operational</span>
        </div>
      </div>
    </aside>
  );
}