import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of service | Turfog",
  description: "Turfog terms of service - rules and guidelines for using the platform.",
};

export default function TermsPage() {
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
            Terms of service
          </h1>
          <p className="text-body-sm text-neutral-500">
            Last updated: January 2026
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-neutral max-w-none space-y-6 text-body-md text-neutral-700 leading-relaxed">
          <section>
            <h2 className="text-display-xs font-semibold text-neutral-900 mb-3">
              1. Acceptance of terms
            </h2>
            <p>
              By accessing or using Turfog (&quot;the platform&quot;), you agree
              to be bound by these terms of service. If you do not agree to
              these terms, you may not use the platform. Turfog is operated by
              Turfog and its affiliates.
            </p>
          </section>

          <section>
            <h2 className="text-display-xs font-semibold text-neutral-900 mb-3">
              2. Eligibility
            </h2>
            <p>To use Turfog, you must:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Be at least 13 years of age</li>
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Not have been previously banned from the platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-display-xs font-semibold text-neutral-900 mb-3">
              3. User accounts
            </h2>
            <p>
              You are responsible for all activity that occurs under your
              account. You must:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Keep your password secure and confidential</li>
              <li>Notify us immediately of any unauthorized account use</li>
              <li>
                Provide truthful and up-to-date profile information
              </li>
              <li>Not impersonate any person or entity</li>
              <li>Not create multiple accounts for deceptive purposes</li>
            </ul>
            <p className="mt-2">
              Turfog reserves the right to suspend or terminate accounts that
              violate these terms.
            </p>
          </section>

          <section>
            <h2 className="text-display-xs font-semibold text-neutral-900 mb-3">
              4. Platform usage guidelines
            </h2>
            <p>When using Turfog, you agree not to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>
                Harass, abuse, or threaten other users
              </li>
              <li>
                Post false, misleading, or fraudulent content
              </li>
              <li>
                Use the platform for any illegal activity
              </li>
              <li>
                Attempt to bypass or manipulate the platform&apos;s matching or
                reputation systems
              </li>
              <li>
                Collect or harvest other users&apos; data without consent
              </li>
              <li>
                Upload malicious code or interfere with platform operation
              </li>
              <li>
                Use automated tools or bots without written permission
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-display-xs font-semibold text-neutral-900 mb-3">
              5. Match participation
            </h2>
            <p>
              Turfog connects players and facilitates match discovery. We do not
              organize, supervise, or take responsibility for the actual matches
              played. By participating in matches arranged through Turfog, you
              acknowledge that:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>
                Sports activities carry inherent physical risks
              </li>
              <li>
                You participate at your own risk and judgment
              </li>
              <li>
                Turfog is not liable for injuries, damages, or disputes arising
                from matches
              </li>
              <li>
                You are responsible for your own safety and conduct during
                matches
              </li>
              <li>
                You should verify match details with the organizer before
                attending
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-display-xs font-semibold text-neutral-900 mb-3">
              6. Reliability score
            </h2>
            <p>
              Turfog uses a reliability scoring system to encourage
              accountability. Your reliability score is affected by:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Match attendance and punctuality</li>
              <li>Cancelation history</li>
              <li>Feedback from other players</li>
              <li>Overall platform activity</li>
            </ul>
            <p className="mt-2">
              Turfog reserves the right to adjust scores to maintain platform
              integrity. Repeated no-shows or cancelations may result in account
              restrictions.
            </p>
          </section>

          <section>
            <h2 className="text-display-xs font-semibold text-neutral-900 mb-3">
              7. Content ownership
            </h2>
            <p>
              You retain ownership of content you post on Turfog, including
              profile information, photos, and messages. By posting content, you
              grant Turfog a non-exclusive, royalty-free license to display and
              distribute your content within the platform.
            </p>
            <p className="mt-2">
              Turfog owns all rights to the platform itself, including its code,
              design, branding, and proprietary features.
            </p>
          </section>

          <section>
            <h2 className="text-display-xs font-semibold text-neutral-900 mb-3">
              8. Termination
            </h2>
            <p>
              You may delete your account at any time through your profile
              settings. Turfog may suspend or terminate your account for
              violation of these terms, with or without notice. Upon
              termination, your profile data will be removed from the platform
              in accordance with our privacy policy.
            </p>
          </section>

          <section>
            <h2 className="text-display-xs font-semibold text-neutral-900 mb-3">
              9. Limitation of liability
            </h2>
            <p>
              To the maximum extent permitted by law, Turfog and its affiliates
              shall not be liable for any indirect, incidental, special, or
              consequential damages arising from your use of the platform.
              Turfog is provided &quot;as is&quot; without warranties of any
              kind.
            </p>
          </section>

          <section>
            <h2 className="text-display-xs font-semibold text-neutral-900 mb-3">
              10. Changes to terms
            </h2>
            <p>
              We may update these terms from time to time. We will notify users
              of significant changes via email or platform notification.
              Continued use of Turfog after changes constitutes acceptance of
              the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-display-xs font-semibold text-neutral-900 mb-3">
              11. Governing law
            </h2>
            <p>
              These terms shall be governed by the laws of India. Any disputes
              arising from these terms or your use of Turfog shall be subject to
              the exclusive jurisdiction of the courts in Mumbai, India.
            </p>
          </section>

          <section>
            <h2 className="text-display-xs font-semibold text-neutral-900 mb-3">
              12. Contact
            </h2>
            <p>
              For questions about these terms, please contact us:
            </p>
            <ul className="list-none space-y-1 mt-2">
              <li>
                Email:{" "}
                <a
                  href="mailto:legal@turfog.com"
                  className="text-electric-blue hover:underline"
                >
                  legal@turfog.com
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