import Link from "next/link";
import { ZapIcon, FootballIcon, CricketIcon, PickleballIcon, PadelIcon, BadmintonIcon } from "@/components/SvgIcons";

const sports = [
  { icon: FootballIcon, name: "Football" },
  { icon: CricketIcon, name: "Box cricket" },
  { icon: PickleballIcon, name: "Pickleball" },
  { icon: PadelIcon, name: "Padel" },
  { icon: BadmintonIcon, name: "Badminton" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-green rounded-2xl mb-6 shadow-glow-green">
            <ZapIcon size={32} className="text-white" />
          </div>

          {/* Brand */}
          <h1 className="text-display-lg font-display font-bold text-white mb-2">
            Turfog
          </h1>
          <p className="text-body-md text-white/50 mb-10">
            Never cancel a match again
          </p>

          {/* Auth Buttons */}
          <div className="space-y-3 mb-10">
            <Link href="/auth/sign-up">
              <span className="flex items-center justify-center w-full px-6 py-3.5 bg-primary-green text-white text-body-sm font-semibold rounded-2xl shadow-glow-green hover:bg-primary-green/90 transition-colors">
                Create account
              </span>
            </Link>
            <Link href="/auth/sign-in">
              <span className="flex items-center justify-center w-full px-6 py-3.5 bg-white/10 backdrop-blur-md text-white text-body-sm font-semibold rounded-2xl border border-white/15 hover:bg-white/20 transition-colors">
                Sign in
              </span>
            </Link>
          </div>

          {/* Sports Strip */}
          <div className="flex items-center justify-center gap-4">
            {sports.map((sport) => (
              <div key={sport.name} className="flex flex-col items-center gap-1.5">
                <div className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center text-white/30 border border-white/5">
                  <sport.icon size={17} />
                </div>
                <span className="text-caption text-white/20">{sport.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-caption text-white/20">
          2026 Turfog. Made for players, by players.
        </p>
      </footer>
    </div>
  );
}
