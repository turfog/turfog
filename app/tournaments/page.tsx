import type { Metadata } from "next";
import TournamentsClient from "@/components/tournaments/TournamentsClient";

export const metadata: Metadata = {
  title: "Tournaments - Turfog",
  description: "Discover local sports tournaments, register your team, and follow the brackets.",
};

export const dynamic = "force-dynamic";

export default function TournamentsPage() {
  return <TournamentsClient />;
}