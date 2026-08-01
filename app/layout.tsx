import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Turfog - Never cancel a match again",
  description:
    "Instantly connect with players who want to play and teams looking for players in your area.",
  keywords: ["sports", "matches", "players", "turfog", "football", "cricket"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
