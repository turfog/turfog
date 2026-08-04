import type { Metadata } from "next";
import EndorseClient from "@/components/endorsements/EndorseClient";

export const metadata: Metadata = {
  title: "Endorse players - Turfog",
  description: "Recognize players for their skills and character.",
};

export default function EndorsePage() {
  return <EndorseClient />;
}