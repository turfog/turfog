import type { Metadata } from "next";
import InvitesClient from "@/components/invites/InvitesClient";

export const metadata: Metadata = {
  title: "Team invites - Turfog",
  description: "Your pending team invitations on Turfog.",
};

export default function InvitesPage() {
  return <InvitesClient />;
}