import type { Metadata } from "next";
import MarketplaceClient from "@/components/marketplace/MarketplaceClient";

export const metadata: Metadata = {
  title: "Marketplace - Turfog",
  description: "Buy and sell sports gear, find coaches, and book umpires in your local community.",
};

export const dynamic = "force-dynamic";

export default function MarketplacePage() {
  return <MarketplaceClient />;
}