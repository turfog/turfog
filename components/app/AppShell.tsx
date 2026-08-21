import TopBar from "@/components/dashboard/TopBar";
import LeftNav from "@/components/dashboard/LeftNav";
import HomeCenter from "@/components/app/HomeCenter";
import RightRail from "@/components/app/RightRail";
import MobileBottomNav from "@/components/dashboard/MobileBottomNav";
import SearchOverlay from "@/components/search/SearchOverlay";
import { LocationProvider } from "@/context/LocationContext";
import { DiscoveryProvider } from "@/context/DiscoveryContext";
import { SocialProvider } from "@/context/SocialContext";
import { MessagingProvider } from "@/context/MessagingContext";
import { SearchProvider } from "@/context/SearchContext";
import type { Player } from "@/types";

const PREMIUM_CSS = `
  /* ══════════ PREMIUM TOKENS ══════════ */
  :root {
    --ink-950:#0a0a0a; --ink-900:#171717; --ink-800:#262626; --ink-700:#404040;
    --ink-600:#525252; --ink-500:#737373; --ink-400:#a3a3a3; --ink-300:#d4d4d4;
    --ink-200:#e5e5e5; --ink-100:#f5f5f5; --ink-50:#fafafa;
    --brand:#10B981; --brand-600:#059669; --brand-50:#ECFDF5;
    --surface: rgba(255,255,255,0.7);
    --surface-strong: rgba(255,255,255,0.92);
    --hairline: rgba(10,10,10,0.08);
    --shadow-sm: 0 1px 2px 0 rgba(0,0,0,0.04);
    --shadow-md: 0 4px 12px -2px rgba(0,0,0,0.06), 0 2px 4px -2px rgba(0,0,0,0.04);
    --shadow-lg: 0 12px 32px -8px rgba(0,0,0,0.08), 0 4px 12px -4px rgba(0,0,0,0.06);
    --shadow-xl: 0 24px 48px -12px rgba(0,0,0,0.14), 0 8px 16px -6px rgba(0,0,0,0.08);
  }

  /* ══════════ TYPE SYSTEM ══════════ */
  body {
    font-feature-settings: "cv11", "ss01", "ss03";
    -webkit-font-smoothing: antialiased;
    font-synthesis-weight: none;
    text-rendering: optimizeLegibility;
  }
  .font-display { letter-spacing: -0.05em; line-height: 1.05; }
  .font-heading { letter-spacing: -0.03em; line-height: 1.15; }
  .font-body    { letter-spacing: -0.011em; line-height: 1.5; }
  .font-caption { letter-spacing: 0.02em; line-height: 1.3; }

  /* ══════════ APP CANVAS ══════════ */
  .turfog-canvas {
    background:
      radial-gradient(1200px 600px at 15% -10%, rgba(16,185,129,0.06), transparent 60%),
      radial-gradient(900px 500px at 90% 0%, rgba(59,130,246,0.04), transparent 60%),
      linear-gradient(180deg, #fafafa 0%, #f5f5f5 100%);
    min-height: 100vh;
    position: relative;
  }

  /* ══════════ CARD SURFACES ══════════ */
  .surface-card {
    background: #ffffff;
    border: 1px solid var(--hairline);
    border-radius: 20px;
    box-shadow: var(--shadow-sm);
    transition: box-shadow .3s cubic-bezier(.2,.8,.2,1), transform .3s cubic-bezier(.2,.8,.2,1), border-color .3s;
  }
  .surface-card:hover { box-shadow: var(--shadow-md); border-color: rgba(16,185,129,0.15); }

  /* ══════════ GLASS CHROME ══════════ */
  .glass {
    background: var(--surface);
    backdrop-filter: saturate(180%) blur(20px);
    -webkit-backdrop-filter: saturate(180%) blur(20px);
    border: 1px solid var(--hairline);
  }

  /* ══════════ INTERACTIVE STATES ══════════ */
  .turfog-press { transition: transform .2s cubic-bezier(.2,.8,.2,1); }
  .turfog-press:active { transform: scale(0.98); }

  /* ══════════ SCROLL POLISH ══════════ */
  .turfog-scroll { scrollbar-width: thin; scrollbar-color: rgba(0,0,0,0.1) transparent; }
  .turfog-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
  .turfog-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 999px; }
  .turfog-scroll::-webkit-scrollbar-track { background: transparent; }

  /* ══════════ MOBILE NATIVE FEEL ══════════ */
  @media (max-width: 1023px) {
    html, body { overscroll-behavior-y: none; }
    .mobile-safe-top { padding-top: env(safe-area-inset-top, 0px); }
    .mobile-safe-bottom { padding-bottom: env(safe-area-inset-bottom, 0px); }
  }
`;

export default function AppShell({ player }: { player: Player }) {
  return (
    <LocationProvider>
      <DiscoveryProvider>
        <SocialProvider>
          <MessagingProvider>
            <SearchProvider>
              <style>{PREMIUM_CSS}</style>
              <div className="turfog-canvas turfog-scroll">
                <TopBar player={player} />
                <div className="mx-auto max-w-[1440px] grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)_340px] gap-0 lg:gap-6 px-0 lg:px-6 pt-0 lg:pt-6">
                  <LeftNav player={player} />
                  <main className="min-h-[calc(100vh-4rem)] px-4 sm:px-5 lg:px-0 pt-4 lg:pt-0 pb-28 lg:pb-10">
                    <HomeCenter player={player} />
                  </main>
                  <RightRail />
                </div>
                <MobileBottomNav />
                <SearchOverlay />
              </div>
            </SearchProvider>
          </MessagingProvider>
        </SocialProvider>
      </DiscoveryProvider>
    </LocationProvider>
  );
}