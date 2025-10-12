import Script from "next/script";
import type { Metadata } from "next";
import { ContactPageClient } from "./contact-client";

export const metadata: Metadata = {
  title: "Contact Us | AIMMT - Get in Touch",
  description: "Have questions or feedback? Contact the AIMMT team. We typically respond within 24-48 hours during business days.",
  keywords: [
    "contact AIMMT",
    "AI product support",
    "get in touch",
    "feedback",
    "support",
    "help",
    "questions",
    "SaaS support",
  ],
  openGraph: {
    title: "Contact Us | AIMMT",
    description: "Have questions or feedback? Get in touch with the AIMMT team.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | AIMMT",
    description: "Have questions or feedback? Get in touch with the AIMMT team.",
  },
};

// FAQ data for schema markup
const faqs = [
  {
    question: "How long does it take to get a response?",
    answer: "We typically respond to all inquiries within 24-48 hours during business days.",
  },
  {
    question: "Can I suggest a new feature?",
    answer: "Absolutely! We love hearing ideas from our community. Use the contact form to share your suggestions.",
  },
  {
    question: "How do I report a bug?",
    answer: "Please use the contact form and select 'Bug Report' as the subject. Include as much detail as possible.",
  },
  {
    question: "Can I advertise on AIMMT?",
    answer: "AIMMT offers a generous free tier with premium plans for advanced features. We remain ad-free and focus on organic, community-driven discovery.",
  },
];

// Generate FAQ schema for rich snippets
function generateFAQSchema() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aimademethis.com";

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export default function ContactPage() {
  const faqSchema = generateFAQSchema();

  return (
    <>
      {/* JSON-LD Schema for FAQs */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <ContactPageClient />
    </>
  );
}
