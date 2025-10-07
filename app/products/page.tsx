"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductList } from "@/components/products/product-list";
import { SearchBar } from "@/components/products/search-bar";
import { FilterSidebar } from "@/components/products/filter-sidebar";
import { SortDropdown } from "@/components/products/sort-dropdown";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import {
  searchProducts,
  getCategories,
  getPopularTags,
  type SearchFilters,
} from "@/lib/products/search-actions";
import type { Database } from "@/types/database.types";

type Product = Database["public"]["Tables"]["products"]["Row"] & {
  categories: { name: string; slug: string } | null;
  profiles: { username: string; avatar_url: string | null } | null;
  votes_count: number;
  comments_count: number;
};

function ProductsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [tags, setTags] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filter state from URL
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [pricing, setPricing] = useState(searchParams.get("pricing") || "all");
  const [selectedTags, setSelectedTags] = useState<string[]>(
    searchParams.get("tags")?.split(",").filter(Boolean) || []
  );
  const [sortBy, setSortBy] = useState<"newest" | "votes" | "reviews" | "views">(
    (searchParams.get("sort") as "newest" | "votes" | "reviews" | "views") || "newest"
  );

  // Load categories and tags on mount
  useEffect(() => {
    async function loadFilters() {
      const [categoriesResult, tagsResult] = await Promise.all([
        getCategories(),
        getPopularTags(20),
      ]);

      if (categoriesResult.categories) {
        setCategories(categoriesResult.categories);
      }
      if (tagsResult.tags) {
        setTags(tagsResult.tags);
      }
    }

    loadFilters();
  }, []);

  // Update URL when filters change
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();

    if (query) params.set("q", query);
    if (category !== "all") params.set("category", category);
    if (pricing !== "all") params.set("pricing", pricing);
    if (selectedTags.length > 0) params.set("tags", selectedTags.join(","));
    if (sortBy !== "newest") params.set("sort", sortBy);

    const newURL = params.toString() ? `/products?${params.toString()}` : "/products";
    router.push(newURL, { scroll: false });
  }, [query, category, pricing, selectedTags, sortBy, router]);

  // Search products when filters change
  useEffect(() => {
    async function performSearch() {
      setLoading(true);

      const filters: SearchFilters = {
        query: query || undefined,
        category: category !== "all" ? category : undefined,
        pricingType: pricing !== "all" ? pricing : undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        sortBy,
      };

      const result = await searchProducts(filters);

      if (result.products) {
        // Get vote and comment counts for each product
        const productsWithCounts = result.products as Product[];
        setProducts(productsWithCounts);
        setTotalCount(result.count || 0);
      }

      setLoading(false);
    }

    performSearch();
    updateURL();
  }, [query, category, pricing, selectedTags, sortBy, updateURL]);

  const handleClearFilters = () => {
    setQuery("");
    setCategory("all");
    setPricing("all");
    setSelectedTags([]);
    setSortBy("newest");
  };

  const hasActiveFilters =
    query || category !== "all" || pricing !== "all" || selectedTags.length > 0;

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight">
              Discover AI Products
            </h1>
            <p className="text-muted-foreground mt-2">
              {loading ? (
                "Loading..."
              ) : (
                <>
                  {totalCount} {totalCount === 1 ? "product" : "products"} found
                  {hasActiveFilters && " matching your filters"}
                </>
              )}
            </p>
          </div>
          <Button asChild>
            <Link href="/products/new">Submit Product</Link>
          </Button>
        </div>

        {/* Search Bar */}
        <SearchBar
          initialValue={query}
          onSearch={setQuery}
          placeholder="Search by name, tagline, or description..."
        />

        {/* Sort and Results Count */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <SortDropdown value={sortBy} onChange={(value) => setSortBy(value as typeof sortBy)} />
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <FilterSidebar
            categories={categories}
            tags={tags}
            selectedCategory={category}
            selectedPricing={pricing}
            selectedTags={selectedTags}
            onCategoryChange={setCategory}
            onPricingChange={setPricing}
            onTagsChange={setSelectedTags}
            onClearFilters={handleClearFilters}
          />
        </aside>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <div className="text-6xl">🔍</div>
              <h3 className="text-2xl font-bold">No products found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {hasActiveFilters
                  ? "Try adjusting your filters or search query to find what you're looking for."
                  : "Be the first to submit a product!"}
              </p>
              {hasActiveFilters && (
                <Button variant="outline" onClick={handleClearFilters}>
                  Clear All Filters
                </Button>
              )}
            </div>
          ) : (
            <ProductList products={products} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  );
}
