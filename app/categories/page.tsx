import { createClient } from "@/lib/supabase/server";
import { CategoriesClient } from "./categories-client";
import type { Database } from "@/types/database.types";

type Category = Database["public"]["Tables"]["categories"]["Row"] & {
  product_count: number;
};

export const metadata = {
  title: "AI Product Categories | AIMMT - Browse by Category",
  description: "Explore AI products organized by categories including Productivity, Creative Tools, Development, Marketing, Data Analysis, and more. Find AI tools by use case.",
  keywords: [
    "AI categories",
    "AI tools by category",
    "productivity AI",
    "creative AI tools",
    "AI for developers",
    "marketing AI tools",
    "SaaS categories",
    "SaaS tools by category",
  ],
  openGraph: {
    title: "Browse AI Products by Category | AIMMT",
    description: "Explore AI products organized by categories. Find the perfect AI tool for your use case.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse AI Products by Category | AIMMT",
    description: "Explore AI products organized by categories. Find the perfect AI tool for your use case.",
  },
};

export default async function CategoriesPage() {
  const supabase = await createClient();

  // Fetch all categories with product counts
  const { data: categories, error } = await supabase
    .from("categories")
    .select(`
      *,
      products!inner(id)
    `)
    .order("name");

  if (error) {
    console.error("Error fetching categories:", error);
  }

  // Transform the data to include product counts
  const categoriesWithCounts: Category[] = (categories || []).map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    icon: category.icon,
    created_at: category.created_at,
    product_count: Array.isArray(category.products) ? category.products.length : 0,
  }));

  // Also get total product count
  const { count: totalProducts } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("status", "published");

  return (
    <CategoriesClient
      categories={categoriesWithCounts}
      totalProducts={totalProducts || 0}
    />
  );
}
