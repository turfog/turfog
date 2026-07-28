"use client";

import { useLocationContext } from "@/context/LocationContext";

/**
 * Location Hook
 * Provides access to geolocation state and controls
 * Wraps LocationContext for cleaner imports
 */
export function useLocation() {
  const locationCtx = useLocationContext();

  return {
    location: locationCtx.location,
    isLoading: locationCtx.isLoading,
    error: locationCtx.error,
    permissionStatus: locationCtx.permissionStatus,
    requestLocation: locationCtx.requestLocation,
    refreshLocation: locationCtx.refreshLocation,
    latitude: locationCtx.location?.latitude ?? null,
    longitude: locationCtx.location?.longitude ?? null,
    city: locationCtx.location?.city ?? null,
    hasLocation: locationCtx.location !== null,
    hasPermission: locationCtx.permissionStatus === "granted",
  };
}