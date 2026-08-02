import type { Metadata } from "next";
import { LocationProvider } from "@/context/LocationContext";
import OfficialsClient from "@/components/officials/OfficialsClient";

export const metadata: Metadata = {
  title: "Officials - Turfog",
  description: "Find certified referees and umpires near you. Football, cricket, badminton, padel, pickleball.",
};

export default function OfficialsPage() {
  return (
    <LocationProvider>
      <OfficialsClient />
    </LocationProvider>
  );
}