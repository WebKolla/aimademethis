"use client";

import { FeaturedProducts } from "@/components/products/featured-products";
import { FilterBadges } from "@/components/products/filter-badges";
import { FilterSidebar } from "@/components/products/filter-sidebar";
import { HorizontalFilters } from "@/components/products/horizontal-filters";
import { ProductList } from "@/components/products/product-list";
import { SearchBar } from "@/components/products/search-bar";
import { SortDropdown } from "@/components/products/sort-dropdown";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  getAvailableAIModels,
  getAvailableAITools,
  getCategories,
  getPopularTags,
  searchProducts,
  type SearchFilters,
} from "@/lib/products/search-actions";
import type { Database } from "@/types/database.types";
import { motion } from "framer-motion";
import { Filter, Loader2, Sparkles, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

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
  const [aiModels, setAIModels] = useState<string[]>([]);
  const [aiTools, setAITools] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter state from URL
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [pricing, setPricing] = useState(searchParams.get("pricing") || "all");
  const [selectedTags, setSelectedTags] = useState<string[]>(
    searchParams.get("tags")?.split(",").filter(Boolean) || []
  );
  const [selectedAIModels, setSelectedAIModels] = useState<string[]>(
    searchParams.get("aiModels")?.split(",").filter(Boolean) || []
  );
  const [selectedAITools, setSelectedAITools] = useState<string[]>(
    searchParams.get("aiTools")?.split(",").filter(Boolean) || []
  );
  const [sortBy, setSortBy] = useState<"newest" | "votes" | "reviews" | "views" | "trending">(
    (searchParams.get("sort") as "newest" | "votes" | "reviews" | "views" | "trending") || "trending"
  );

  // Load categories, tags, AI models, and AI tools on mount
  useEffect(() => {
    async function loadFilters() {
      const [categoriesResult, tagsResult, modelsResult, toolsResult] = await Promise.all([
        getCategories(),
        getPopularTags(20),
        getAvailableAIModels(),
        getAvailableAITools(),
      ]);

      if (categoriesResult.categories) {
        setCategories(categoriesResult.categories);

        // Check if category param is a slug (not a UUID) and resolve it to ID
        const categoryParam = searchParams.get("category");
        if (categoryParam && categoryParam !== "all") {
          // Check if it's a UUID format (contains hyphens)
          const isUUID = categoryParam.includes("-");
          if (!isUUID) {
            // It's a slug, find the category by slug
            const foundCategory = categoriesResult.categories.find(c => c.slug === categoryParam);
            if (foundCategory) {
              setCategory(foundCategory.id);
            }
          }
        }
      }
      if (tagsResult.tags) {
        setTags(tagsResult.tags);
      }
      if (modelsResult.aiModels) {
        setAIModels(modelsResult.aiModels);
      }
      if (toolsResult.aiTools) {
        setAITools(toolsResult.aiTools);
      }
    }

    loadFilters();
  }, [searchParams]);

  // Update URL when filters change
  const updateURL = useCallback(() => {
    // Don't update URL on initial load or if we're already on the correct URL
    const params = new URLSearchParams();

    if (query) params.set("q", query);
    if (category !== "all") {
      // Use slug if available, otherwise use ID for backward compatibility
      const categoryToUse = categories.find(c => c.id === category);
      params.set("category", categoryToUse?.slug || category);
    }
    if (pricing !== "all") params.set("pricing", pricing);
    if (selectedTags.length > 0) params.set("tags", selectedTags.join(","));
    if (selectedAIModels.length > 0) params.set("aiModels", selectedAIModels.join(","));
    if (selectedAITools.length > 0) params.set("aiTools", selectedAITools.join(","));
    if (sortBy !== "trending") params.set("sort", sortBy);

    const newURL = params.toString() ? `/products?${params.toString()}` : "/products";

    // Only update if URL actually changed
    const currentParams = searchParams.toString();
    const newParams = params.toString();
    if (currentParams !== newParams) {
      router.push(newURL, { scroll: false });
    }
  }, [query, category, pricing, selectedTags, selectedAIModels, selectedAITools, sortBy, router, categories, searchParams]);

  // Search products when filters change
  useEffect(() => {
    async function performSearch() {
      setLoading(true);

      const filters: SearchFilters = {
        query: query || undefined,
        category: category !== "all" ? category : undefined,
        pricingType: pricing !== "all" ? pricing : undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        aiModels: selectedAIModels.length > 0 ? selectedAIModels : undefined,
        aiTools: selectedAITools.length > 0 ? selectedAITools : undefined,
        sortBy,
      };

      const result = await searchProducts(filters);

      if (result.products) {
        const productsWithCounts = result.products as Product[];
        setProducts(productsWithCounts);
        setTotalCount(result.count || 0);
      }

      setLoading(false);
    }

    performSearch();
    updateURL();
  }, [query, category, pricing, selectedTags, selectedAIModels, selectedAITools, sortBy, updateURL]);

  const handleClearFilters = () => {
    setQuery("");
    setCategory("all");
    setPricing("all");
    setSelectedTags([]);
    setSelectedAIModels([]);
    setSelectedAITools([]);
    setSortBy("trending");
  };

  const handleRemoveFilter = (type: string, value?: string) => {
    switch (type) {
      case "query":
        setQuery("");
        break;
      case "category":
        setCategory("all");
        break;
      case "pricing":
        setPricing("all");
        break;
      case "tag":
        if (value) setSelectedTags(selectedTags.filter((id) => id !== value));
        break;
      case "aiModel":
        if (value) setSelectedAIModels(selectedAIModels.filter((m) => m !== value));
        break;
      case "aiTool":
        if (value) setSelectedAITools(selectedAITools.filter((t) => t !== value));
        break;
    }
  };

  const hasActiveFilters =
    query ||
    category !== "all" ||
    pricing !== "all" ||
    selectedTags.length > 0 ||
    selectedAIModels.length > 0 ||
    selectedAITools.length > 0;

  // Get first 3-4 products as featured (placeholder - will be replaced with actual featured logic)
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Modern Hero Section */}
      <section className="relative min-h-[60vh] bg-gradient-to-br from-slate-50 via-teal-50/30 to-emerald-50/30 dark:from-slate-950 dark:via-teal-950/20 dark:to-emerald-950/20 overflow-hidden border-b border-gray-200 dark:border-gray-800">

        {/* Animated Background Blobs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 -right-20 w-96 h-96 bg-teal-500/10 dark:bg-teal-500/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            x: [0, -30, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-20 -left-20 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, 45, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/5 dark:bg-cyan-500/3 rounded-full blur-3xl"
        />

        {/* Hero Content */}
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left Column: Headline + Description + CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none">
                  <span className="block text-gray-900 dark:text-white">Discover</span>
                  <span className="block bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                    AI Products
                  </span>
                </h1>

                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">
                  Explore cutting-edge AI tools and applications built by innovators worldwide
                </p>
              </div>

              {/* Search Bar */}
              <div className="max-w-2xl">
                <SearchBar
                  initialValue={query}
                  onSearch={setQuery}
                  placeholder="Search by name, tagline, or description..."
                />
              </div>

              {/* CTA Button */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 text-lg px-8 h-14 rounded-full font-semibold">
                  <Link href="dashboard/products/new">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Submit Your Product
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Right Column: Quick Stats Bento Grid */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 gap-4 lg:gap-6"
            >
              {/* Total Products */}
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                className="col-span-2 p-6 md:p-8 rounded-3xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg border border-white/20 dark:border-gray-800/50 shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                      Total Products
                    </div>
                    <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      {loading ? "..." : totalCount}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                      {hasActiveFilters ? "matching filters" : "and counting"}
                    </div>
                  </div>
                  <div className="text-6xl opacity-80">
                    🚀
                  </div>
                </div>
              </motion.div>

              {/* Trending Products */}
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                className="p-6 rounded-3xl bg-gradient-to-br from-orange-50 to-rose-50 dark:from-orange-950/30 dark:to-rose-950/30 backdrop-blur-lg border border-orange-200/50 dark:border-orange-900/50 shadow-lg"
              >
                <TrendingUp className="h-8 w-8 text-orange-600 dark:text-orange-400 mb-3" />
                <div className="text-3xl font-black text-gray-900 dark:text-white">
                  {Math.floor(totalCount * 0.15)}
                </div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">
                  Trending Now
                </div>
              </motion.div>

              {/* Active Users */}
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                className="p-6 rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 backdrop-blur-lg border border-purple-200/50 dark:border-purple-900/50 shadow-lg"
              >
                <Users className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-3" />
                <div className="text-3xl font-black text-gray-900 dark:text-white">
                  {Math.floor(totalCount * 0.7)}+
                </div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">
                  Creators
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Desktop Horizontal Filters */}
      <div className="hidden lg:block">
        <HorizontalFilters
          categories={categories}
          tags={tags}
          aiModels={aiModels}
          aiTools={aiTools}
          selectedCategory={category}
          selectedPricing={pricing}
          selectedTags={selectedTags}
          selectedAIModels={selectedAIModels}
          selectedAITools={selectedAITools}
          onCategoryChange={setCategory}
          onPricingChange={setPricing}
          onTagsChange={setSelectedTags}
          onAIModelsChange={setSelectedAIModels}
          onAIToolsChange={setSelectedAITools}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Mobile Filter Button */}
      <div className="lg:hidden border-b bg-background sticky top-16 z-40">
        <div className="container mx-auto px-4 py-3">
          <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 text-xs font-medium">
                    Active
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
              <div className="py-4">
                <FilterSidebar
                  categories={categories}
                  tags={tags}
                  aiModels={aiModels}
                  aiTools={aiTools}
                  selectedCategory={category}
                  selectedPricing={pricing}
                  selectedTags={selectedTags}
                  selectedAIModels={selectedAIModels}
                  selectedAITools={selectedAITools}
                  onCategoryChange={setCategory}
                  onPricingChange={setPricing}
                  onTagsChange={setSelectedTags}
                  onAIModelsChange={setSelectedAIModels}
                  onAIToolsChange={setSelectedAITools}
                  onClearFilters={handleClearFilters}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Sort and Filter Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <SortDropdown value={sortBy} onChange={(value) => setSortBy(value as typeof sortBy)} />
          <FilterBadges
            filters={{
              query: query || undefined,
              category: category !== "all" ? categories.find((c) => c.id === category) : undefined,
              pricing: pricing !== "all" ? pricing : undefined,
              tags: tags.filter((t) => selectedTags.includes(t.id)),
              aiModels: selectedAIModels.length > 0 ? selectedAIModels : undefined,
              aiTools: selectedAITools.length > 0 ? selectedAITools : undefined,
            }}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={handleClearFilters}
          />
        </div>

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
          <>
            {/* Featured Products Section */}
            {featuredProducts.length > 0 && !hasActiveFilters && (
              <FeaturedProducts products={featuredProducts} />
            )}

            {/* All Products Grid */}
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white mb-6">
                {hasActiveFilters ? "Search Results" : "All Products"}
              </h2>
              <ProductList products={products} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  );
}
