import type { Metadata } from "next";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy policy | Turfog",
  description: "Turfog privacy policy - how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-body-sm text-neutral-500 hover:text-neutral-700 transition-colors mb-6"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to home
          </Link>
          <h1 className="text-display-sm font-bold text-neutral-900 mb-2">
            Privacy policy
          </h1>
          <p className="text-body-sm text-neutral-500">
            Last updated: January 2026
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-neutral max-w-none space-y-6 text-body-md text-neutral-700 leading-relaxed">
          <section>
            <h2 className="text-display-xs font-semibold text-neutral-900 mb-3">
              1. Information we collect
            </h2>
            <p>
              When you use Turfog, we collect information to provide and improve
              our services. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>
                <strong>Account information:</strong> Your name, email address,
                phone number, and profile photo when you create an account.
              </li>
              <li>
                <strong>Location data:</strong> With your permission, we collect
                your device location to show nearby players, matches, and
                communities. You can disable location access at any time.
              </li>
              <li>
                <strong>Usage data:</strong> Information about how you interact
                with Turfog, including matches played, communities joined, and
                features used.
              </li>
              <li>
                <strong>Device information:</strong> Device type, operating
                system, and browser type to optimize your experience.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-display-xs font-semibold text-neutral-900 mb-3">
              2. How we use your information
            </h2>
            <p>We use the collected information for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>To create and manage your Turfog account</li>
              <li>
                To connect you with nearby players and matches based on your
                location
              </li>
              <li>To display your profile to other players as per your settings</li>
              <li>
                To send notifications about matches, invitations, and platform
                updates
              </li>
              <li>
                To improve our platform based on usage patterns and feedback
              </li>
              <li>To ensure platform safety and prevent misuse</li>
            </ul>
          </section>

          <section>
            <h2 className="text-display-xs font-semibold text-neutral-900 mb-3">
              3. Location data
            </h2>
            <p>
              Turfog is a location-based sports platform. Location data is
              essential for core features like finding nearby players and
              matches. We only collect your location:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>When the app is in use (foreground)</li>
              <li>When you activate a heartbeat (I want to play)</li>
              <li>With your explicit permission</li>
            </ul>
            <p className="mt-2">
              Your precise location is never shared with other players. Only
              your city or approximate area is displayed publicly. You can
              revoke location permissions through your device settings at any
              time.
            </p>
          </section>

          <section>
            <h2 className="text-display-xs font-semibold text-neutral-900 mb-3">
              4. Data sharing
            </h2>
            <p>
              We do not sell your personal data to third parties. We may share
              your information only in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>
                <strong>With other Turfog users:</strong> Your profile
                information (name, username, profile photo, city, sports
                preferences, and match history) is visible to other users as
                part of the platform functionality.
              </li>
              <li>
                <strong>Service providers:</strong> We use Supabase for
                database hosting and authentication. Your data is stored
                securely on their infrastructure.
              </li>
              <li>
                <strong>Legal requirements:</strong> If required by law, court
                order, or government regulation.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-display-xs font-semibold text-neutral-900 mb-3">
              5. Data security
            </h2>
            <p>
              We implement industry-standard security measures to protect your
              data:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>
                All data is encrypted in transit using TLS/SSL protocols
              </li>
              <li>
                Authentication is handled by Supabase with secure token-based
                sessions
              </li>
              <li>
                Database access is protected by Row Level Security (RLS)
                policies
              </li>
              <li>
                We regularly review our security practices and update them as
                needed
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-display-xs font-semibold text-neutral-900 mb-3">
              6. Your rights
            </h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>
                Access and download your personal data stored on Turfog
              </li>
              <li>Update or correct your profile information at any time</li>
              <li>Delete your account and all associated data</li>
              <li>Opt out of non-essential communications</li>
              <li>Withdraw consent for location tracking</li>
            </ul>
            <p className="mt-2">
              To exercise any of these rights, contact us at{" "}
              <a
                href="mailto:privacy@turfog.com"
                className="text-electric-blue hover:underline"
              >
                privacy@turfog.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-display-xs font-semibold text-neutral-900 mb-3">
              7. Cookies
            </h2>
            <p>
              Turfog uses essential cookies for authentication and session
              management. We do not use tracking cookies or third-party
              analytics cookies. You can disable cookies in your browser
              settings, but this may affect platform functionality.
            </p>
          </section>

          <section>
            <h2 className="text-display-xs font-semibold text-neutral-900 mb-3">
              8. Changes to this policy
            </h2>
            <p>
              We may update this privacy policy from time to time. We will
              notify you of any significant changes via email or through the
              platform. Continued use of Turfog after changes constitutes
              acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-display-xs font-semibold text-neutral-900 mb-3">
              9. Contact us
            </h2>
            <p>
              If you have any questions about this privacy policy or how your
              data is handled, please contact us:
            </p>
            <ul className="list-none space-y-1 mt-2">
              <li>
                Email:{" "}
                <a
                  href="mailto:privacy@turfog.com"
                  className="text-electric-blue hover:underline"
                >
                  privacy@turfog.com
                </a>
              </li>
              <li>
                Website:{" "}
                <a
                  href="https://turfog.com"
                  className="text-electric-blue hover:underline"
                >
                  turfog.com
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}