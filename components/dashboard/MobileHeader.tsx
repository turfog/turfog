"use client";

import React from "react";
import Link from "next/link";
import { BellIcon, ZapIcon } from "@/components/SvgIcons";

export default function MobileHeader() {
  return (
    <header className="lg:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-neutral-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-green rounded-lg flex items-center justify-center">
            <ZapIcon size={18} className="text-white" />
          </div>
          <span className="text-body-md font-bold text-neutral-900 font-display">
            Turfog
          </span>
        </Link>
        <Link
          href="/notifications"
          className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-neutral-100 transition-colors"
        >
          <BellIcon size={20} className="text-neutral-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-coral rounded-full" />
        </Link>
      </div>
    </header>
  );
}
