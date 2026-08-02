import type { Metadata } from "next";
import NotificationsClient from "@/components/notifications/NotificationsClient";

export const metadata: Metadata = { title: "Notifications - Turfog" };

export default function NotificationsPage() {
  return <NotificationsClient />;
}