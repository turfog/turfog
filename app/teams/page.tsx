import type { Metadata } from "next";
import TeamsClient from "@/components/teams/TeamsClient";

export const metadata: Metadata = {
  title: "Teams - Turfog",
  description: "Join a sports team, build your roster, and compete. Football, box cricket, badminton, pickleball, padel.",
};

export default function TeamsPage() {
  return <TeamsClient />;
}