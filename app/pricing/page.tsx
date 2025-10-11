import { Metadata } from "next";
import { PricingPageClient } from "./pricing-client";

export const metadata: Metadata = {
  title: "Pricing | AIMMT",
  description:
    "Choose the perfect plan for your AI product journey. Free to start, upgrade as you grow.",
  openGraph: {
    title: "Pricing Plans | AIMMT",
    description: "Free to start, upgrade as you grow. Find the perfect plan for showcasing your AI products.",
    type: "website",
  },
};

export default function PricingPage() {
  return <PricingPageClient />;
}
