"use client";

import { useHeartbeatContext } from "@/context/HeartbeatContext";

/**
 * Heartbeat Hook
 * Provides access to heartbeat state and actions
 * Wraps HeartbeatContext for cleaner imports
 */
export function useHeartbeat() {
  const heartbeatCtx = useHeartbeatContext();

  return {
    activeHeartbeat: heartbeatCtx.activeHeartbeat,
    isSubmitting: heartbeatCtx.isSubmitting,
    submitHeartbeat: heartbeatCtx.submitHeartbeat,
    cancelHeartbeat: heartbeatCtx.cancelHeartbeat,
    error: heartbeatCtx.error,
    hasActiveHeartbeat: heartbeatCtx.activeHeartbeat !== null,
    heartbeatType: heartbeatCtx.activeHeartbeat?.type ?? null,
    isActive: heartbeatCtx.activeHeartbeat?.isActive ?? false,
  };
}