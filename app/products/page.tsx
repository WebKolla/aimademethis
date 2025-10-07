import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { ProductList } from "@/components/products/product-list";
import { ProductListSkeleton } from "@/components/products/product-card-skeleton";
import { ProductControls } from "@/components/products/product-controls";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";
import type { Database } from "@/types/database.types";

export const metadata: Metadata = {
  title: "Discover AI Products | AIMadeThis",
  description: "Browse and discover the latest AI-powered tools and applications",
};

const PRODUCTS_PER_PAGE = 18;

interface ProductsPageProps {
  searchParams: Promise<{
    sort?: string;
    page?: string;
  }>;
}

async function ProductListWrapper({ sort, page }: { sort?: string; page?: string }) {
  const supabase = await createClient();
  const currentPage = parseInt(page || "1", 10);
  const offset = (currentPage - 1) * PRODUCTS_PER_PAGE;

  // Build query based on sort parameter
  let query = supabase
    .from("products")
    .select(
      `
      *,
      categories (name, slug),
      profiles (username, avatar_url)
    `,
      { count: "exact" }
    )
    .eq("status", "published");

  // Apply sorting
  switch (sort) {
    case "popular":
      query = query.order("upvotes_count", { ascending: false, nullsFirst: false });
      break;
    case "trending":
      query = query.order("created_at", { ascending: false });
      break;
    case "most-viewed":
      query = query.order("views_count", { ascending: false, nullsFirst: false });
      break;
    case "newest":
    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

  // Apply pagination
  query = query.range(offset, offset + PRODUCTS_PER_PAGE - 1);

  const { data: products, error, count } = await query;

  if (error) {
    console.error("Error fetching products:", error);
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load products. Please try again.</p>
      </div>
    );
  }

  // For each product, get vote and comment counts
  const productsWithCounts = await Promise.all(
    (products || []).map(async (product) => {
      const [votesResult, commentsResult] = await Promise.all([
        supabase
          .from("votes")
          .select("id", { count: "exact", head: true })
          .eq("product_id", product.id),
        supabase
          .from("comments")
          .select("id", { count: "exact", head: true })
          .eq("product_id", product.id),
      ]);

      return {
        ...product,
        votes_count: votesResult.count || 0,
        comments_count: commentsResult.count || 0,
      } as unknown as Database["public"]["Tables"]["products"]["Row"] & {
        categories: { name: string; slug: string } | null;
        profiles: { username: string; avatar_url: string | null } | null;
        votes_count: number;
        comments_count: number;
      };
    })
  );

  const totalPages = Math.ceil((count || 0) / PRODUCTS_PER_PAGE);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  return (
    <>
      <ProductList products={productsWithCounts} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-4">
          {hasPrevPage && (
            <Link href={`/products?sort=${sort || "newest"}&page=${currentPage - 1}`}>
              <Button variant="outline">Previous</Button>
            </Link>
          )}

          <span className="text-sm text-gray-600 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </span>

          {hasNextPage && (
            <Link href={`/products?sort=${sort || "newest"}&page=${currentPage + 1}`}>
              <Button variant="outline">Next</Button>
            </Link>
          )}
        </div>
      )}
    </>
  );
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;

  return (
    <div className="container mx-auto px-4 py-12">
      <ProductControls />

      <Suspense fallback={<ProductListSkeleton />}>
        <ProductListWrapper sort={params.sort} page={params.page} />
      </Suspense>
    </div>
  );
}
