import type { Metadata } from "next";
import MyBookingsClient from "@/components/bookings/MyBookingsClient";

export const metadata: Metadata = {
  title: "My bookings - Turfog",
  description: "Track your official hire requests and leave reviews.",
};

export default function BookingsPage() {
  return <MyBookingsClient />;
}