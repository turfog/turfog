import type { Metadata } from "next";
import CommunitiesClient from "@/components/communities/CommunitiesClient";

export const metadata: Metadata = {
  title: "Communities - Turfog",
  description: "Join local sports communities. Find players, organize matches, and grow together.",
};

export default function CommunitiesPage() {
  return <CommunitiesClient />;
}
