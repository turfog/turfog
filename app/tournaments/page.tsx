import type { Metadata } from "next";
import TournamentsClient from "@/components/tournaments/TournamentsClient";

export const metadata: Metadata = {
  title: "Tournaments - Turfog",
  description: "Organize sports leagues, register teams, and track live standings.",
};

export default function TournamentsPage() {
  return <TournamentsClient />;
}