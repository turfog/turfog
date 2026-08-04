import type { Metadata } from "next";
import MarketplaceClient from "@/components/marketplace/MarketplaceClient";

export const metadata: Metadata = {
  title: "Marketplace - Turfog",
  description: "Coaches, equipment, venues, and more from your local sports community.",
};

export default function MarketplacePage() {
  return <MarketplaceClient />;
}