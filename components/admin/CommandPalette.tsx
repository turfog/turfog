"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Users, Shield, AlertTriangle, X, Zap, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

interface CommandPaletteContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CommandPaletteContext = createContext<CommandPaletteContextType>({ open: false, setOpen: () => {} });

export const useCommandPalette = () => useContext(CommandPaletteContext);

const commands = [
  { id: "1", label: "Go to User 360°", icon: Users, action: "/admin/users", category: "Navigation" },
  { id: "2", label: "Review Pending Ads", icon: Zap, action: "/admin/approvals", category: "Action" },
  { id: "3", label: "Investigate Fraud Reports", icon: Shield, action: "/admin/moderation", category: "Trust & Safety" },
  { id: "4", label: "View Critical Alerts", icon: AlertTriangle, action: "/admin/alerts", category: "System" },
  { id: "5", label: "Manage Marketplace Escrow", icon: ShoppingBag, action: "/admin/finance", category: "Finance" },
];

export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const filtered = commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));

  const execute = (action: string) => {
    router.push(action);
    setOpen(false);
    setQuery("");
  };

  return (
    <CommandPaletteContext.Provider value={{ open, setOpen }}>
      {children}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden"
            >
              <div className="flex items-center gap-3 px-4 border-b border-neutral-200">
                <Search size={18} className="text-neutral-400" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type a command, search users, or jump to..."
                  className="flex-1 h-12 bg-transparent text-[14px] text-neutral-900 outline-none placeholder:text-neutral-400"
                />
                <button onClick={() => setOpen(false)} className="p-1 hover:bg-neutral-100 rounded text-neutral-400">
                  <X size={16} />
                </button>
              </div>
              
              <div className="max-h-[300px] overflow-y-auto p-2">
                {filtered.length === 0 ? (
                  <div className="px-4 py-8 text-center text-[13px] text-neutral-500">No commands match "{query}"</div>
                ) : (
                  <div className="space-y-1">
                    <p className="px-3 py-1.5 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Quick Actions</p>
                    {filtered.map((cmd) => (
                      <button
                        key={cmd.id}
                        onClick={() => execute(cmd.action)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-emerald-50 text-left transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-md bg-neutral-100 group-hover:bg-emerald-100 flex items-center justify-center text-neutral-600 group-hover:text-emerald-600 transition-colors">
                          <cmd.icon size={16} />
                        </div>
                        <div className="flex-1">
                          <p className="text-[13px] font-medium text-neutral-900">{cmd.label}</p>
                          <p className="text-[11px] text-neutral-500">{cmd.category}</p>
                        </div>
                        <span className="text-[11px] text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity">Jump ↵</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </CommandPaletteContext.Provider>
  );
}