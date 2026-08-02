import type { Metadata } from "next";
import ProfileClient from "@/components/profile/ProfileClient";

export const metadata: Metadata = {
  title: "Your profile - Turfog",
  description: "Your Turfog player profile. Matches, stats, reputation, and achievements.",
};

export default function ProfilePage() {
  return <ProfileClient />;
}
