"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { haversineKm, reverseGeocode } from "@/lib/discovery";

type LocationStatus = "idle" | "detecting" | "granted" | "denied" | "unavailable";

interface LocationState {
  lat: number | null;
  lng: number | null;
  label: string;
  status: LocationStatus;
  radius: number;
  setRadius: (n: number) => void;
}

const DEFAULT_STATE: LocationState = {
  lat: null,
  lng: null,
  label: "Detecting your location...",
  status: "idle",
  radius: 5,
  setRadius: () => {},
};

const LocationContext = createContext<LocationState | null>(null);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [label, setLabel] = useState("Detecting your location...");
  const [status, setStatus] = useState<LocationStatus>("detecting");
  const [radius, setRadius] = useState(5);
  const lastGeo = useRef<{ lat: number; lng: number } | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    if (!("geolocation" in navigator)) {
      setLat(19.1136);
      setLng(72.8697);
      setLabel("Andheri west, Mumbai");
      setStatus("unavailable");
      return () => {
        mounted.current = false;
      };
    }

    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        if (!mounted.current) return;
        const la = pos.coords.latitude;
        const ln = pos.coords.longitude;
        setLat(la);
        setLng(ln);
        setStatus("granted");
        const last = lastGeo.current;
        const moved = !last || haversineKm(la, ln, last.lat, last.lng) > 0.25;
        if (moved) {
          lastGeo.current = { lat: la, lng: ln };
          const name = await reverseGeocode(la, ln);
          if (mounted.current) setLabel(name ?? "Current location");
        }
      },
      () => {
        if (!mounted.current) return;
        setLat(19.1136);
        setLng(72.8697);
        setLabel("Andheri west, Mumbai");
        setStatus("denied");
      },
      { enableHighAccuracy: true, maximumAge: 300000, timeout: 10000 }
    );

    return () => {
      mounted.current = false;
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return (
    <LocationContext.Provider value={{ lat, lng, label, status, radius, setRadius }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation(): LocationState {
  return useContext(LocationContext) ?? DEFAULT_STATE;
}