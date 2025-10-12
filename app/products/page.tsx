import type { Metadata } from "next";
import { ProductsPageClient } from "./products-page-client";

export const metadata: Metadata = {
  title: "Browse AI Products | AIMMT - AI Product Directory",
  description: "Discover hundreds of AI products and tools. Filter by category, pricing, AI models, and more. Find the perfect AI solution for your needs.",
  keywords: [
    "AI products",
    "AI tools directory",
    "browse AI products",
    "AI tool finder",
    "search AI tools",
    "AI product catalog",
    "filter AI products",
    "Submit SAAS product to directory",
  ],
  openGraph: {
    title: "Browse AI Products | AIMMT",
    description: "Discover hundreds of innovative AI products. Advanced filtering and search.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse AI Products | AIMMT",
    description: "Discover hundreds of innovative AI products. Advanced filtering and search.",
  },
};

export default function ProductsPage() {
  return <ProductsPageClient />;
}
