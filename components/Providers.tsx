"use client";

import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import { LocationProvider } from "@/context/LocationContext";
import { HeartbeatProvider } from "@/context/HeartbeatContext";

/**
 * Global Providers Wrapper
 * Wraps the entire application with all context providers
 * Must be a client component since contexts use hooks
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LocationProvider>
        <HeartbeatProvider>
          {children}
        </HeartbeatProvider>
      </LocationProvider>
    </AuthProvider>
  );
}