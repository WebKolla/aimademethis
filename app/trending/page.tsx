import type { Metadata } from "next";
import { TrendingPageClient } from "./trending-client";

export const metadata: Metadata = {
  title: "Trending AI Products | AIMMT - What's Hot in AI",
  description: "Discover trending AI products based on community engagement, recent launches, and popularity. See what's hot in the AI world right now.",
  keywords: [
    "trending AI products",
    "popular AI tools",
    "hot AI products",
    "AI trends",
    "latest AI tools",
    "most popular AI",
    "trending SaaS products",
    "popular SaaS tools",
  ],
  openGraph: {
    title: "Trending AI Products | AIMMT",
    description: "See what's trending in AI - based on community votes, engagement, and recency.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trending AI Products | AIMMT",
    description: "See what's trending in AI - based on community votes, engagement, and recency.",
  },
};

export default function TrendingPage() {
  return <TrendingPageClient />;
}
