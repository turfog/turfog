import React from "react";
import Link from "next/link";
import { ZapIcon } from "@/components/SvgIcons";

const footerLinks = [
  {
    title: "Sports",
    links: [
      { label: "Football", href: "/sports/football" },
      { label: "Box cricket", href: "/sports/box-cricket" },
      { label: "Pickleball", href: "/sports/pickleball" },
      { label: "Padel", href: "/sports/padel" },
      { label: "Badminton", href: "/sports/badminton" },
    ],
  },
  {
    title: "Platform",
    links: [
      { label: "How it works", href: "/#how-it-works" },
      { label: "Communities", href: "/communities" },
      { label: "Leaderboard", href: "/leaderboard" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms of service", href: "/terms" },
    ],
  },
];

export default function LandingFooter() {
  return (
    <footer className="border-t border-white/10 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-primary-green rounded-xl flex items-center justify-center">
                <ZapIcon size={20} className="text-white" />
              </div>
              <span className="text-body-md font-bold text-white font-display">
                Turfog
              </span>
            </Link>
            <p className="text-body-sm text-white/40 leading-relaxed">
              Never cancel a match again. The player discovery platform for
              local sports communities.
            </p>
          </div>

          {/* Link Columns */}
          {footerLinks.map((column) => (
            <div key={column.title}>
              <h4 className="text-body-sm font-semibold text-white mb-4">
                {column.title}
              </h4>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-body-sm text-white/40 hover:text-white/70 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-caption text-white/30">
            2026 Turfog. All rights reserved.
          </p>
          <p className="text-caption text-white/30">
            Made for players, by players.
          </p>
        </div>
      </div>
    </footer>
  );
}
