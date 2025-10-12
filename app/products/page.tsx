import type { Metadata } from "next";
import Script from "next/script";
import { ProductsPageClient } from "./products-page-client";
import { createClient } from "@/lib/supabase/server";

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
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://aimademethis.com'}/products`,
  },
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

// Generate ItemList schema for product listings
function generateItemListSchema(products: Array<{
  name: string;
  slug: string;
  tagline: string | null;
  image_url: string | null;
}>) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aimademethis.com';

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.name,
        description: product.tagline || product.name,
        image: product.image_url || undefined,
        url: `${siteUrl}/products/${product.slug}`,
      },
    })),
  };
}

export default async function ProductsPage() {
  // Fetch initial products for ItemList schema (limit to 20 for performance)
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("name, slug, tagline, image_url")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(20);

  const itemListSchema = generateItemListSchema(products || []);

  return (
    <>
      {/* JSON-LD Schema for Product List */}
      <Script
        id="itemlist-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <ProductsPageClient />
    </>
  );
}
