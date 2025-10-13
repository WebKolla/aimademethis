import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the Terms of Service for using AIMMT (AI Made Me This). Learn about user responsibilities, content policies, and platform rules.",
  openGraph: {
    title: "Terms of Service | AIMMT",
    description:
      "Read the Terms of Service for using AIMMT (AI Made Me This). Learn about user responsibilities, content policies, and platform rules.",
    url: "/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">

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
            Terms of Service
          </h1>
          <p className="text-muted-foreground text-lg">
            Last updated: October 8, 2025
          </p>
        </div>

        {/* Introduction */}
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-lg leading-relaxed mb-8">
            Welcome to AIMMT (AI Made Me This). These Terms of Service
            (&quot;Terms&quot;) govern your access to and use of our platform at{" "}
            <Link
              href="https://www.aimademethis.com"
              className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
            >
             www.aimademethis.com
            </Link>
            . By accessing or using our platform, you agree to be bound by these
            Terms. If you do not agree, please do not use our platform.
          </p>

          {/* Table of Contents */}
          <div className="bg-muted/50 rounded-lg p-6 mb-12">
            <h2 className="text-xl font-bold mb-4 text-foreground">
              Table of Contents
            </h2>
            <nav className="space-y-2">
              <a
                href="#acceptance"
                className="block text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                1. Acceptance of Terms
              </a>
              <a
                href="#eligibility"
                className="block text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                2. Eligibility
              </a>
              <a
                href="#user-accounts"
                className="block text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                3. User Accounts
              </a>
              <a
                href="#user-content"
                className="block text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                4. User-Generated Content
              </a>
              <a
                href="#acceptable-use"
                className="block text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                5. Acceptable Use Policy
              </a>
              <a
                href="#intellectual-property"
                className="block text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                6. Intellectual Property
              </a>
              <a
                href="#content-moderation"
                className="block text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                7. Content Moderation
              </a>
              <a
                href="#disclaimers"
                className="block text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                8. Disclaimers
              </a>
              <a
                href="#limitation-of-liability"
                className="block text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                9. Limitation of Liability
              </a>
              <a
                href="#indemnification"
                className="block text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                10. Indemnification
              </a>
              <a
                href="#termination"
                className="block text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                11. Termination
              </a>
              <a
                href="#dispute-resolution"
                className="block text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                12. Dispute Resolution
              </a>
              <a
                href="#changes"
                className="block text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                13. Changes to Terms
              </a>
              <a
                href="#contact"
                className="block text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                14. Contact Information
              </a>
            </nav>
          </div>

          {/* Section 1 */}
          <section id="acceptance" className="mb-12 scroll-mt-20">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              1. Acceptance of Terms
            </h2>
            <p className="mb-6">
              By creating an account, accessing, or using AIMMT in any way, you
              acknowledge that you have read, understood, and agree to be bound
              by these Terms and our{" "}
              <Link
                href="/privacy"
                className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
              >
                Privacy Policy
              </Link>
              . These Terms constitute a legally binding agreement between you
              and AIMMT.
            </p>
          </section>

          {/* Section 2 */}
          <section id="eligibility" className="mb-12 scroll-mt-20">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              2. Eligibility
            </h2>
            <p className="mb-4">To use AIMMT, you must:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Be at least 13 years old</li>
              <li>
                Have the legal capacity to enter into binding contracts in your
                jurisdiction
              </li>
              <li>
                Not be prohibited from using the platform under applicable laws
              </li>
              <li>
                Provide accurate and complete registration information if
                creating an account
              </li>
            </ul>
            <p className="mb-6">
              If you are using AIMMT on behalf of an organization, you represent
              that you have authority to bind that organization to these Terms.
            </p>
          </section>

          {/* Section 3 */}
          <section id="user-accounts" className="mb-12 scroll-mt-20">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              3. User Accounts
            </h2>

            <h3 className="text-xl font-semibold mb-4 text-foreground">
              3.1 Account Creation
            </h3>
            <p className="mb-6">
              To access certain features, you must create an account. You can
              register using email and password, or through OAuth providers
              (Google, GitHub). You agree to provide accurate, current, and
              complete information during registration and to update it as
              needed.
            </p>

            <h3 className="text-xl font-semibold mb-4 text-foreground">
              3.2 Account Security
            </h3>
            <p className="mb-4">You are responsible for:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Maintaining the confidentiality of your password</li>
              <li>All activities that occur under your account</li>
              <li>
                Notifying us immediately of any unauthorized access or security
                breaches
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-4 text-foreground">
              3.3 Username Policy
            </h3>
            <p className="mb-4">Usernames must not:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Impersonate others or misrepresent your identity</li>
              <li>Contain offensive, vulgar, or inappropriate language</li>
              <li>Violate trademarks or intellectual property rights</li>
              <li>Be misleading or confusing to other users</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section id="user-content" className="mb-12 scroll-mt-20">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              4. User-Generated Content
            </h2>

            <h3 className="text-xl font-semibold mb-4 text-foreground">
              4.1 Content Ownership
            </h3>
            <p className="mb-6">
              You retain all ownership rights to content you submit to AIMMT
              (product listings, reviews, comments, etc.). However, by
              submitting content, you grant us a worldwide, non-exclusive,
              royalty-free license to use, display, reproduce, distribute, and
              modify your content for the purpose of operating and promoting the
              platform.
            </p>

            <h3 className="text-xl font-semibold mb-4 text-foreground">
              4.2 Content Responsibilities
            </h3>
            <p className="mb-4">You are solely responsible for your content. You warrant that:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>You own or have necessary rights to submit the content</li>
              <li>
                Your content does not violate intellectual property rights,
                privacy rights, or any laws
              </li>
              <li>
                Your content is accurate and not misleading (especially for
                product listings)
              </li>
              <li>
                You will update product information when it becomes inaccurate
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-4 text-foreground">
              4.3 Product Listings
            </h3>
            <p className="mb-4">When submitting AI product listings, you must:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Provide accurate and complete information</li>
              <li>Only list products that you have created, own, or are authorized to represent</li>
              <li>Not submit duplicate or spam listings</li>
              <li>Include appropriate categories and tags</li>
              <li>Disclose any affiliate relationships or commercial interests</li>
            </ul>

            <h3 className="text-xl font-semibold mb-4 text-foreground">
              4.4 Reviews and Comments
            </h3>
            <p className="mb-4">When posting reviews or comments:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Base your opinions on genuine experience with the product</li>
              <li>Be honest and constructive in your feedback</li>
              <li>Do not post fake reviews or engage in review manipulation</li>
              <li>Respect others&apos; opinions and engage in civil discourse</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section id="acceptable-use" className="mb-12 scroll-mt-20">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              5. Acceptable Use Policy
            </h2>
            <p className="mb-4">You agree NOT to:</p>

            <h3 className="text-xl font-semibold mb-4 text-foreground">
              5.1 Prohibited Content
            </h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Post content that is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or invasive of privacy</li>
              <li>Submit false, misleading, or deceptive information</li>
              <li>Post spam, unsolicited promotions, or repetitive content</li>
              <li>Include malware, viruses, or malicious code</li>
              <li>Violate intellectual property rights (copyright, trademark, patents)</li>
              <li>Share private information of others without consent</li>
            </ul>

            <h3 className="text-xl font-semibold mb-4 text-foreground">
              5.2 Prohibited Activities
            </h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Attempt to gain unauthorized access to systems or accounts</li>
              <li>Interfere with or disrupt the platform&apos;s functionality</li>
              <li>Scrape, crawl, or use automated tools without permission</li>
              <li>Circumvent security features or access restrictions</li>
              <li>Manipulate voting systems or engagement metrics</li>
              <li>Create multiple accounts to circumvent bans or restrictions</li>
              <li>Impersonate others or misrepresent affiliation</li>
              <li>Use the platform for commercial purposes without authorization</li>
            </ul>

            <h3 className="text-xl font-semibold mb-4 text-foreground">
              5.3 AI-Specific Guidelines
            </h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Do not list products that generate harmful content (hate speech, violence, illegal activities)</li>
              <li>Clearly disclose if AI products have controversial use cases</li>
              <li>Do not misrepresent AI capabilities or limitations</li>
              <li>Respect AI model licensing terms when listing products</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section id="intellectual-property" className="mb-12 scroll-mt-20">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              6. Intellectual Property
            </h2>

            <h3 className="text-xl font-semibold mb-4 text-foreground">
              6.1 Platform Rights
            </h3>
            <p className="mb-6">
              AIMMT and its original content, features, and functionality are
              owned by AIMMT and are protected by international copyright,
              trademark, and other intellectual property laws. The AIMMT name,
              logo, and branding are trademarks of AIMMT.
            </p>

            <h3 className="text-xl font-semibold mb-4 text-foreground">
              6.2 DMCA Policy
            </h3>
            <p className="mb-4">
              We respect intellectual property rights. If you believe content on
              AIMMT infringes your copyright, please submit a DMCA notice to{" "}
              <a
                href="mailto:dmca@aimademethis.com"
                className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
              >
                dmca@aimademethis.com
              </a>{" "}
              with:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Your contact information</li>
              <li>Description of the copyrighted work</li>
              <li>URL of the infringing content</li>
              <li>Statement of good faith belief</li>
              <li>Statement of accuracy under penalty of perjury</li>
              <li>Your physical or electronic signature</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section id="content-moderation" className="mb-12 scroll-mt-20">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              7. Content Moderation
            </h2>
            <p className="mb-4">AIMMT reserves the right to:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>
                Review, monitor, and moderate content at any time (but we are
                not obligated to do so)
              </li>
              <li>
                Remove or refuse to display content that violates these Terms
              </li>
              <li>
                Suspend or terminate accounts that violate these Terms
              </li>
              <li>
                Report violations to law enforcement when required or appropriate
              </li>
            </ul>
            <p className="mb-6">
              We employ a combination of automated systems and human review for
              moderation. If your content is removed or your account is
              suspended, you may contact us to request a review.
            </p>
          </section>

          {/* Section 8 */}
          <section id="disclaimers" className="mb-12 scroll-mt-20">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              8. Disclaimers
            </h2>

            <h3 className="text-xl font-semibold mb-4 text-foreground">
              8.1 Platform &quot;As Is&quot;
            </h3>
            <p className="mb-6">
              AIMMT IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF
              ANY KIND, EXPRESS OR IMPLIED. We do not guarantee uninterrupted,
              secure, or error-free operation. We make no warranties about the
              accuracy, reliability, or completeness of content on the platform.
            </p>

            <h3 className="text-xl font-semibold mb-4 text-foreground">
              8.2 User Content
            </h3>
            <p className="mb-6">
              We do not endorse, verify, or guarantee the accuracy of
              user-submitted content. Product listings, reviews, and comments
              represent the opinions of individual users, not AIMMT. Use of AI
              products listed on our platform is at your own risk.
            </p>

            <h3 className="text-xl font-semibold mb-4 text-foreground">
              8.3 Third-Party Links
            </h3>
            <p className="mb-6">
              Our platform may contain links to third-party websites and
              services. We are not responsible for the content, accuracy, or
              practices of external sites. Your use of third-party services is
              governed by their own terms and policies.
            </p>
          </section>

          {/* Section 9 */}
          <section id="limitation-of-liability" className="mb-12 scroll-mt-20">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              9. Limitation of Liability
            </h2>
            <p className="mb-6">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, AIMMT SHALL NOT BE LIABLE
              FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
              DAMAGES, OR ANY LOSS OF PROFITS, REVENUE, DATA, OR USE, WHETHER IN
              AN ACTION IN CONTRACT, TORT, OR OTHERWISE, ARISING FROM:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Your use or inability to use the platform</li>
              <li>User-generated content or conduct of other users</li>
              <li>Unauthorized access to your account or data</li>
              <li>Platform errors, interruptions, or security breaches</li>
              <li>Use of AI products discovered through our platform</li>
            </ul>
            <p className="mb-6">
              Our total liability shall not exceed the greater of (a) $100 USD
              or (b) the amount you paid to AIMMT in the 12 months prior to the
              claim.
            </p>
          </section>

          {/* Section 10 */}
          <section id="indemnification" className="mb-12 scroll-mt-20">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              10. Indemnification
            </h2>
            <p className="mb-6">
              You agree to indemnify, defend, and hold harmless AIMMT, its
              officers, directors, employees, and agents from any claims,
              liabilities, damages, losses, and expenses (including legal fees)
              arising from:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Your violation of these Terms</li>
              <li>Your content or conduct on the platform</li>
              <li>Your violation of any laws or rights of third parties</li>
              <li>Your use of the platform or AI products listed thereon</li>
            </ul>
          </section>

          {/* Section 11 */}
          <section id="termination" className="mb-12 scroll-mt-20">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              11. Termination
            </h2>

            <h3 className="text-xl font-semibold mb-4 text-foreground">
              11.1 By You
            </h3>
            <p className="mb-6">
              You may terminate your account at any time through account
              settings. Upon termination, your public content may remain on the
              platform but will be disassociated from your account.
            </p>

            <h3 className="text-xl font-semibold mb-4 text-foreground">
              11.2 By AIMMT
            </h3>
            <p className="mb-4">
              We may suspend or terminate your account immediately, without
              notice, if:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>You violate these Terms</li>
              <li>Your conduct harms other users or the platform</li>
              <li>Required by law or legal process</li>
              <li>We discontinue the platform</li>
            </ul>

            <h3 className="text-xl font-semibold mb-4 text-foreground">
              11.3 Effect of Termination
            </h3>
            <p className="mb-6">
              Upon termination, your right to access the platform ceases
              immediately. Sections of these Terms that by their nature should
              survive (disclaimers, limitations of liability, indemnification)
              will remain in effect.
            </p>
          </section>

          {/* Section 12 */}
          <section id="dispute-resolution" className="mb-12 scroll-mt-20">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              12. Dispute Resolution
            </h2>

            <h3 className="text-xl font-semibold mb-4 text-foreground">
              12.1 Informal Resolution
            </h3>
            <p className="mb-6">
              If you have a dispute, please contact us at{" "}
              <a
                href="mailto:legal@aimademethis.com"
                className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
              >
                legal@aimademethis.com
              </a>{" "}
              first. Most disputes can be resolved informally.
            </p>

            <h3 className="text-xl font-semibold mb-4 text-foreground">
              12.2 Governing Law
            </h3>
            <p className="mb-6">
              These Terms are governed by the laws of [Your Jurisdiction],
              without regard to conflict of law principles. You agree to the
              exclusive jurisdiction of courts in [Your Jurisdiction] for any
              disputes.
            </p>

            <h3 className="text-xl font-semibold mb-4 text-foreground">
              12.3 Arbitration (If Applicable)
            </h3>
            <p className="mb-6">
              For disputes that cannot be resolved informally, you agree to
              binding arbitration in accordance with [Arbitration Rules], except
              where prohibited by law. Class actions and jury trials are waived.
            </p>
          </section>

          {/* Section 13 */}
          <section id="changes" className="mb-12 scroll-mt-20">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              13. Changes to Terms
            </h2>
            <p className="mb-6">
              We may modify these Terms at any time. If we make material
              changes, we will notify you via email or a prominent notice on the
              platform at least 30 days before the changes take effect. Your
              continued use of AIMMT after the changes constitutes acceptance of
              the updated Terms.
            </p>
            <p className="mb-6">
              We encourage you to review these Terms periodically. The &quot;Last
              updated&quot; date at the top indicates when the Terms were last
              revised.
            </p>
          </section>

          {/* Section 14 */}
          <section id="contact" className="mb-12 scroll-mt-20">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              14. Contact Information
            </h2>
            <p className="mb-4">
              For questions about these Terms, please contact us:
            </p>
            <div className="bg-muted/50 rounded-lg p-6">
              <p className="mb-2">
                <strong>General Inquiries:</strong>{" "}
                <a
                  href="mailto:legal@aimademethis.com"
                  className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                >
                  legal@aimademethis.com
                </a>
              </p>
              <p className="mb-2">
                <strong>DMCA Notices:</strong>{" "}
                <a
                  href="mailto:dmca@aimademethis.com"
                  className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                >
                  dmca@aimademethis.com
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

          {/* Additional Provisions */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              Additional Provisions
            </h2>

            <h3 className="text-xl font-semibold mb-4 text-foreground">
              Severability
            </h3>
            <p className="mb-6">
              If any provision of these Terms is found to be unenforceable, the
              remaining provisions will remain in full force and effect.
            </p>

            <h3 className="text-xl font-semibold mb-4 text-foreground">
              Waiver
            </h3>
            <p className="mb-6">
              Our failure to enforce any right or provision of these Terms does
              not constitute a waiver of that right or provision.
            </p>

            <h3 className="text-xl font-semibold mb-4 text-foreground">
              Entire Agreement
            </h3>
            <p className="mb-6">
              These Terms and our Privacy Policy constitute the entire agreement
              between you and AIMMT regarding the platform.
            </p>

            <h3 className="text-xl font-semibold mb-4 text-foreground">
              Assignment
            </h3>
            <p className="mb-6">
              We may assign or transfer these Terms and our rights and
              obligations without restriction. You may not assign or transfer
              your rights without our written consent.
            </p>

            <h3 className="text-xl font-semibold mb-4 text-foreground">
              Force Majeure
            </h3>
            <p className="mb-6">
              We are not liable for delays or failures in performance resulting
              from causes beyond our reasonable control, including acts of God,
              war, terrorism, riots, embargoes, acts of civil or military
              authorities, fire, floods, accidents, network infrastructure
              failures, strikes, or shortages of transportation, facilities,
              fuel, energy, labor, or materials.
            </p>
          </section>

          {/* Acknowledgment */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              Acknowledgment
            </h2>
            <p className="mb-6">
              BY USING AIMMT, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS OF
              SERVICE, UNDERSTAND THEM, AND AGREE TO BE BOUND BY THEM. IF YOU DO
              NOT AGREE TO THESE TERMS, YOU MUST NOT ACCESS OR USE THE PLATFORM.
            </p>
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
