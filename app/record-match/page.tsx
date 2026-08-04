import type { Metadata } from "next";
import RecordMatchClient from "@/components/matches/RecordMatchClient";

export const metadata: Metadata = {
  title: "Record a match - Turfog",
  description: "Record your match result and performance.",
};

export default function RecordMatchPage() {
  return <RecordMatchClient />;
}