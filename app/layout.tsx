import type { Metadata, Viewport } from "next";
import Providers from "@/components/Providers";
import { APP_NAME, APP_TAGLINE, APP_DESCRIPTION, APP_URL } from "@/lib/constants";
import "./globals.css";

// ----- Metadata -----

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} - ${APP_TAGLINE}`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    "sports",
    "matchmaking",
    "football",
    "cricket",
    "basketball",
    "badminton",
    "tennis",
    "find players",
    "sports community",
    "never cancel match",
  ],
  authors: [{ name: "Turfog" }],
  creator: "Turfog",
  publisher: "Turfog",
  metadataBase: new URL(APP_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: APP_URL,
    siteName: APP_NAME,
    title: `${APP_NAME} - ${APP_TAGLINE}`,
    description: APP_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: APP_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} - ${APP_TAGLINE}`,
    description: APP_DESCRIPTION,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// ----- Viewport -----

export const viewport: Viewport = {
  themeColor: "#3F9142",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// ----- Root Layout -----

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to Supabase for faster API calls */}
        <link rel="preconnect" href="https://api.supabase.com" />
        <link
          rel="preconnect"
          href="https://api.supabase.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased">
        <Providers>
          {/* Skip to main content for accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-electric-blue focus:text-white focus:rounded-lg focus:shadow-lg"
          >
            Skip to main content
          </a>

          <main id="main-content" className="min-h-screen">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}