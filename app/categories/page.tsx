import { createClient } from "@/lib/supabase/server";
import { CategoriesClient } from "./categories-client";
import type { Database } from "@/types/database.types";

type Category = Database["public"]["Tables"]["categories"]["Row"] & {
  product_count: number;
};

export const metadata = {
  title: "Categories | AIMMT - Browse AI Products by Category",
  description: "Explore AI products organized by categories. Find the perfect AI tool for your needs.",
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
