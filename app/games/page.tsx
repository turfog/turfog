import type { Metadata } from "next";
import GamesClient from "@/components/games/GamesClient";

export const metadata: Metadata = {
  title: "Games - Turfog",
  description: "Find and join upcoming sports matches near you. Football, box cricket, pickleball, padel, badminton.",
};

export default function GamesPage() {
  return <GamesClient />;
}
