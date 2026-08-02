"use client";

import React from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { BellIcon } from "@/components/SvgIcons";

export default function MobileHeader() {
  return (
    <header className="lg:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-neutral-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <Link href="/dashboard" className="inline-flex" aria-label="Turfog home">
          <Logo size={28} priority />
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