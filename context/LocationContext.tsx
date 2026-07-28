"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { LOCATION_REFRESH_INTERVAL_MS } from "@/lib/constants";

// ----- Types -----

interface LocationState {
  latitude: number;
  longitude: number;
  accuracy: number;
  city: string;
}

interface LocationContextValue {
  location: LocationState | null;
  isLoading: boolean;
  error: string | null;
  permissionStatus: PermissionState | null;
  requestLocation: () => void;
  refreshLocation: () => void;
}

// ----- Default Location (Mumbai, India) -----
const DEFAULT_LOCATION: LocationState = {
  latitude: 19.076,
  longitude: 72.8777,
  accuracy: 0,
  city: "Mumbai",
};

// ----- Context -----
const LocationContext = createContext<LocationContextValue | undefined>(
  undefined
);

// ----- Provider -----
export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<LocationState | null>(DEFAULT_LOCATION);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] =
    useState<PermissionState | null>(null);
  const watchIdRef = useRef<number | null>(null);

  // Check permission status on mount
  useEffect(() => {
    checkPermissionStatus();
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkPermissionStatus = useCallback(async () => {
    try {
      if ("permissions" in navigator) {
        const result = await navigator.permissions.query({
          name: "geolocation",
        });
        setPermissionStatus(result.state);

        result.addEventListener("change", () => {
          setPermissionStatus(result.state);
          if (result.state === "granted") {
            startWatchingLocation();
          }
        });
      }
    } catch {
      setPermissionStatus("prompt");
    }
  }, []);

  const handlePositionSuccess = useCallback((position: GeolocationPosition) => {
    const newLocation: LocationState = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      city: "", // Will be filled by reverse geocoding
    };

    setLocation(newLocation);
    setError(null);
    setIsLoading(false);

    // Attempt reverse geocoding
    fetchCityFromCoordinates(position.coords.latitude, position.coords.longitude)
      .then((city) => {
        setLocation((prev) => (prev ? { ...prev, city } : prev));
      })
      .catch(() => {
        // City lookup failed, coordinates are still valid
      });
  }, []);

  const handlePositionError = useCallback(
    (err: GeolocationPositionError) => {
      setIsLoading(false);

      switch (err.code) {
        case err.PERMISSION_DENIED:
          setError("Location access was denied. Using default location.");
          setPermissionStatus("denied");
          break;
        case err.POSITION_UNAVAILABLE:
          setError("Location information is unavailable.");
          break;
        case err.TIMEOUT:
          setError("Location request timed out.");
          break;
        default:
          setError("An unknown error occurred getting your location.");
          break;
      }
    },
    []
  );

  const startWatchingLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setIsLoading(false);
      return;
    }

    // Clear any existing watch
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    // Start watching position
    watchIdRef.current = navigator.geolocation.watchPosition(
      handlePositionSuccess,
      handlePositionError,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: LOCATION_REFRESH_INTERVAL_MS,
      }
    );
  }, [handlePositionSuccess, handlePositionError]);

  const requestLocation = useCallback(() => {
    setIsLoading(true);
    setError(null);
    startWatchingLocation();
  }, [startWatchingLocation]);

  const refreshLocation = useCallback(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      handlePositionSuccess,
      handlePositionError,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [handlePositionSuccess, handlePositionError]);

  // Auto-start watching if permission already granted
  useEffect(() => {
    if (permissionStatus === "granted") {
      startWatchingLocation();
    }
  }, [permissionStatus, startWatchingLocation]);

  const value: LocationContextValue = {
    location,
    isLoading,
    error,
    permissionStatus,
    requestLocation,
    refreshLocation,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

// ----- Hook -----
export function useLocationContext(): LocationContextValue {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error(
      "useLocationContext must be used within a LocationProvider"
    );
  }
  return context;
}

// ----- Helper: Reverse Geocoding -----

interface NominatimResponse {
  address?: {
    city?: string;
    town?: string;
    village?: string;
    suburb?: string;
    county?: string;
    state?: string;
    country?: string;
  };
}

async function fetchCityFromCoordinates(
  latitude: number,
  longitude: number
): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
      {
        headers: {
          "Accept-Language": "en",
          "User-Agent": "Turfog/1.0 (turfog.com)",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch city");
    }

    const data: NominatimResponse = await response.json();

    const city =
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      data.address?.suburb ||
      data.address?.county ||
      data.address?.state ||
      data.address?.country ||
      "Unknown";

    return city;
  } catch {
    return "Unknown";
  }
}