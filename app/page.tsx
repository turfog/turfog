import type { Metadata } from "next";
import LandingAuth from "@/components/landing/LandingAuth";

export const metadata: Metadata = {
  title: "Turfog - Never cancel a match again",
  description:
    "Turfog is the player-first sports community platform. Find nearby players, join matches, and build your local sports community. Never cancel a match again.",
  openGraph: {
    title: "Turfog - Never cancel a match again",
    description:
      "Find players, join matches, and build your local sports community, wherever you are.",
    type: "website",
  },
};

export default function Home() {
  return <LandingAuth />;
}