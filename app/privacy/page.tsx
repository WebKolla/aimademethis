import { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how AIMMT (AI Made Me This) collects, uses, and protects your personal information. GDPR compliant privacy policy.",
  openGraph: {
    title: "Privacy Policy | AIMMT",
    description:
      "Learn how AIMMT (AI Made Me This) collects, uses, and protects your personal information.",
    url: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground text-lg">
            Last updated: October 8, 2025
          </p>
        </div>

        {/* Introduction */}
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-lg leading-relaxed mb-8">
            At AIMMT (AI Made Me This), we take your privacy seriously. This
            Privacy Policy explains how we collect, use, disclose, and safeguard
            your information when you use our platform at{" "}
            <Link
              href="https://aimademethis.vercel.app"
              className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
            >
              aimademethis.vercel.app
            </Link>
            .
          </p>

          {/* Table of Contents */}
          <div className="bg-muted/50 rounded-lg p-6 mb-12">
            <h2 className="text-xl font-bold mb-4 text-foreground">
              Table of Contents
            </h2>
            <nav className="space-y-2">
              <a
                href="#information-collection"
                className="block text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                1. Information We Collect
              </a>
              <a
                href="#how-we-use"
                className="block text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                2. How We Use Your Information
              </a>
              <a
                href="#information-sharing"
                className="block text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                3. Information Sharing and Disclosure
              </a>
              <a
                href="#data-storage"
                className="block text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                4. Data Storage and Security
              </a>
              <a
                href="#your-rights"
                className="block text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                5. Your Privacy Rights (GDPR)
              </a>
              <a
                href="#cookies"
                className="block text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                6. Cookies and Tracking Technologies
              </a>
              <a
                href="#data-retention"
                className="block text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                7. Data Retention
              </a>
              <a
                href="#childrens-privacy"
                className="block text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                8. Children&apos;s Privacy
              </a>
              <a
                href="#international-transfers"
                className="block text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                9. International Data Transfers
              </a>
              <a
                href="#changes"
                className="block text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                10. Changes to This Privacy Policy
              </a>
              <a
                href="#contact"
                className="block text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                11. Contact Us
              </a>
            </nav>
          </div>

          {/* Section 1 */}
          <section id="information-collection" className="mb-12 scroll-mt-20">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              1. Information We Collect
            </h2>

            <h3 className="text-xl font-semibold mb-4 text-foreground">
              1.1 Information You Provide
            </h3>
            <p className="mb-4">
              When you create an account and use our platform, we collect
              information you provide directly:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>
                <strong>Account Information:</strong> Email address, username,
                password (hashed), and optional profile information (name, bio,
                avatar)
              </li>
              <li>
                <strong>OAuth Information:</strong> When you sign in via Google
                or GitHub, we receive your email, name, and profile picture
              </li>
              <li>
                <strong>User-Generated Content:</strong> Product listings,
                reviews, comments, ratings, votes, and bookmarks
              </li>
              <li>
                <strong>Communications:</strong> Messages you send through
                contact forms or support channels
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-4 text-foreground">
              1.2 Automatically Collected Information
            </h3>
            <p className="mb-4">
              When you access our platform, we automatically collect:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>
                <strong>Usage Data:</strong> Pages visited, time spent on pages,
                click patterns, and feature usage
              </li>
              <li>
                <strong>Device Information:</strong> Browser type, operating
                system, device type, IP address
              </li>
              <li>
                <strong>Analytics Data:</strong> Collected via Google Analytics
                (if enabled) to understand user behavior and improve our service
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section id="how-we-use" className="mb-12 scroll-mt-20">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              2. How We Use Your Information
            </h2>
            <p className="mb-4">We use the collected information to:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>
                <strong>Provide Services:</strong> Create and manage your
                account, enable product submissions, facilitate community
                interactions
              </li>
              <li>
                <strong>Improve Platform:</strong> Analyze usage patterns,
                develop new features, optimize user experience
              </li>
              <li>
                <strong>Communication:</strong> Send notifications about
                activity on your content, platform updates, and security alerts
              </li>
              <li>
                <strong>Security:</strong> Detect fraud, prevent abuse, and
                maintain platform integrity
              </li>
              <li>
                <strong>Legal Compliance:</strong> Comply with legal obligations
                and enforce our Terms of Service
              </li>
              <li>
                <strong>Personalization:</strong> Customize your experience
                based on your preferences and activity
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section id="information-sharing" className="mb-12 scroll-mt-20">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              3. Information Sharing and Disclosure
            </h2>

            <h3 className="text-xl font-semibold mb-4 text-foreground">
              3.1 Public Information
            </h3>
            <p className="mb-6">
              The following information is publicly visible to all users and
              visitors:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Your username, profile picture, and bio</li>
              <li>Product listings you submit</li>
              <li>Reviews, comments, and ratings you post</li>
              <li>Your voting activity may be visible to product creators</li>
            </ul>

            <h3 className="text-xl font-semibold mb-4 text-foreground">
              3.2 Third-Party Services
            </h3>
            <p className="mb-4">We share data with trusted service providers:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>
                <strong>Supabase:</strong> Database, authentication, and file
                storage (EU/US regions)
              </li>
              <li>
                <strong>Vercel:</strong> Hosting and content delivery
              </li>
              <li>
                <strong>Google Analytics:</strong> Anonymous usage analytics (if
                enabled)
              </li>
              <li>
                <strong>OAuth Providers:</strong> Google and GitHub for
                authentication
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-4 text-foreground">
              3.3 Legal Requirements
            </h3>
            <p className="mb-6">
              We may disclose your information if required by law, legal process,
              or to protect our rights, users, or public safety.
            </p>
          </section>

          {/* Section 4 */}
          <section id="data-storage" className="mb-12 scroll-mt-20">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              4. Data Storage and Security
            </h2>
            <p className="mb-4">
              We implement industry-standard security measures to protect your
              data:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>
                <strong>Encryption:</strong> All data is encrypted in transit
                (HTTPS/TLS) and at rest
              </li>
              <li>
                <strong>Password Security:</strong> Passwords are hashed using
                bcrypt
              </li>
              <li>
                <strong>Access Controls:</strong> Row Level Security (RLS)
                policies in Supabase ensure users can only access authorized data
              </li>
              <li>
                <strong>Regular Audits:</strong> We regularly review security
                practices and update dependencies
              </li>
            </ul>
            <p className="mb-6">
              However, no method of transmission over the Internet is 100%
              secure. While we strive to protect your data, we cannot guarantee
              absolute security.
            </p>
          </section>

          {/* Section 5 */}
          <section id="your-rights" className="mb-12 scroll-mt-20">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              5. Your Privacy Rights (GDPR)
            </h2>
            <p className="mb-4">
              If you are in the European Economic Area (EEA), you have the
              following rights under GDPR:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>
                <strong>Right to Access:</strong> Request a copy of your
                personal data
              </li>
              <li>
                <strong>Right to Rectification:</strong> Correct inaccurate or
                incomplete data
              </li>
              <li>
                <strong>Right to Erasure:</strong> Request deletion of your
                personal data (&quot;right to be forgotten&quot;)
              </li>
              <li>
                <strong>Right to Restriction:</strong> Limit how we use your
                data
              </li>
              <li>
                <strong>Right to Data Portability:</strong> Receive your data in
                a structured, machine-readable format
              </li>
              <li>
                <strong>Right to Object:</strong> Object to processing of your
                data for specific purposes
              </li>
              <li>
                <strong>Right to Withdraw Consent:</strong> Withdraw consent at
                any time (does not affect prior processing)
              </li>
            </ul>
            <p className="mb-6">
              To exercise these rights, please contact us at{" "}
              <a
                href="mailto:privacy@aimademethis.com"
                className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
              >
                privacy@aimademethis.com
              </a>
              . We will respond within 30 days.
            </p>
          </section>

          {/* Section 6 */}
          <section id="cookies" className="mb-12 scroll-mt-20">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              6. Cookies and Tracking Technologies
            </h2>
            <p className="mb-4">We use cookies and similar technologies for:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>
                <strong>Essential Cookies:</strong> Authentication and session
                management (required for platform functionality)
              </li>
              <li>
                <strong>Analytics Cookies:</strong> Google Analytics to
                understand usage patterns (can be disabled)
              </li>
              <li>
                <strong>Preference Cookies:</strong> Remember your theme choice
                (dark/light mode)
              </li>
            </ul>
            <p className="mb-6">
              You can control cookies through your browser settings. Note that
              disabling essential cookies may affect platform functionality.
            </p>
          </section>

          {/* Section 7 */}
          <section id="data-retention" className="mb-12 scroll-mt-20">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              7. Data Retention
            </h2>
            <p className="mb-4">We retain your data as follows:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>
                <strong>Account Data:</strong> Retained until you delete your
                account
              </li>
              <li>
                <strong>Content:</strong> Product listings, reviews, and
                comments remain public unless you delete them
              </li>
              <li>
                <strong>Analytics Data:</strong> Aggregated, anonymized data may
                be retained indefinitely
              </li>
              <li>
                <strong>Deleted Accounts:</strong> Personal data is deleted
                within 30 days of account deletion, except where required by law
              </li>
            </ul>
          </section>

          {/* Section 8 */}
          <section id="childrens-privacy" className="mb-12 scroll-mt-20">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              8. Children&apos;s Privacy
            </h2>
            <p className="mb-6">
              Our platform is not intended for children under 13 years of age. We
              do not knowingly collect personal information from children under
              13. If you are a parent or guardian and believe your child has
              provided us with personal information, please contact us, and we
              will delete such information.
            </p>
          </section>

          {/* Section 9 */}
          <section id="international-transfers" className="mb-12 scroll-mt-20">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              9. International Data Transfers
            </h2>
            <p className="mb-6">
              Your data may be transferred to and processed in countries other
              than your country of residence. We use Supabase, which stores data
              in EU and US regions with appropriate safeguards. By using our
              platform, you consent to the transfer of your information to these
              jurisdictions.
            </p>
          </section>

          {/* Section 10 */}
          <section id="changes" className="mb-12 scroll-mt-20">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              10. Changes to This Privacy Policy
            </h2>
            <p className="mb-6">
              We may update this Privacy Policy from time to time. We will notify
              you of significant changes by posting a notice on our platform or
              sending an email to registered users. Your continued use of the
              platform after changes constitutes acceptance of the updated
              policy.
            </p>
          </section>

          {/* Section 11 */}
          <section id="contact" className="mb-12 scroll-mt-20">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              11. Contact Us
            </h2>
            <p className="mb-4">
              If you have questions or concerns about this Privacy Policy, please
              contact us:
            </p>
            <div className="bg-muted/50 rounded-lg p-6">
              <p className="mb-2">
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:privacy@aimademethis.com"
                  className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                >
                  privacy@aimademethis.com
                </a>
              </p>
              <p className="mb-2">
                <strong>Data Protection Officer:</strong>{" "}
                <a
                  href="mailto:dpo@aimademethis.com"
                  className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                >
                  dpo@aimademethis.com
                </a>
              </p>
              <p>
                <strong>Website:</strong>{" "}
                <Link
                  href="/contact"
                  className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                >
                  Contact Form
                </Link>
              </p>
            </div>
          </section>

          {/* Legal Basis (GDPR) */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              Legal Basis for Processing (GDPR)
            </h2>
            <p className="mb-4">We process your personal data based on:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>
                <strong>Contractual Necessity:</strong> To provide services you
                request
              </li>
              <li>
                <strong>Consent:</strong> For analytics and marketing
                communications (you may withdraw anytime)
              </li>
              <li>
                <strong>Legitimate Interests:</strong> Platform security,
                improvement, and fraud prevention
              </li>
              <li>
                <strong>Legal Obligations:</strong> Compliance with applicable
                laws
              </li>
            </ul>
          </section>
        </div>

        {/* Back to Top */}
        <div className="mt-12 pt-8 border-t text-center">
          <a
            href="#"
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 font-medium"
          >
            Back to Top
          </a>
        </div>
      </main>
    </div>
  );
}
