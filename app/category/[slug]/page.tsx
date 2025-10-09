"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProductList } from "@/components/products/product-list";
import { SearchBar } from "@/components/products/search-bar";
import { HorizontalFilters } from "@/components/products/horizontal-filters";
import { SortDropdown } from "@/components/products/sort-dropdown";
import { FilterBadges } from "@/components/products/filter-badges";
import { FilterSidebar } from "@/components/products/filter-sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { Loader2, Filter } from "lucide-react";
import {
  searchProducts,
  getCategories,
  getPopularTags,
  getAvailableAIModels,
  getAvailableAITools,
  type SearchFilters,
} from "@/lib/products/search-actions";
import type { Database } from "@/types/database.types";

type Product = Database["public"]["Tables"]["products"]["Row"] & {
  categories: { name: string; slug: string } | null;
  profiles: { username: string; avatar_url: string | null } | null;
  votes_count: number;
  comments_count: number;
};

function CategoryPageContent() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [tags, setTags] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [aiModels, setAIModels] = useState<string[]>([]);
  const [aiTools, setAITools] = useState<string[]>([]);
  const [categoryId, setCategoryId] = useState<string>("");
  const [categoryName, setCategoryName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [notFound, setNotFound] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter state
  const [query, setQuery] = useState("");
  const [pricing, setPricing] = useState("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedAIModels, setSelectedAIModels] = useState<string[]>([]);
  const [selectedAITools, setSelectedAITools] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"newest" | "votes" | "reviews" | "views" | "trending">("trending");

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

        // Find the current category by slug
        const category = categoriesResult.categories.find((c) => c.slug === slug);
        if (category) {
          setCategoryId(category.id);
          setCategoryName(category.name);
        } else {
          setNotFound(true);
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
  }, [slug]);

  // Search products when filters change
  useEffect(() => {
    async function performSearch() {
      if (!categoryId) return; // Wait for category to be loaded

      setLoading(true);

      const filters: SearchFilters = {
        query: query || undefined,
        category: categoryId,
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
  }, [categoryId, query, pricing, selectedTags, selectedAIModels, selectedAITools, sortBy]);

  const handleClearFilters = () => {
    setQuery("");
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
        // Navigate back to all products
        router.push("/products");
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
    pricing !== "all" ||
    selectedTags.length > 0 ||
    selectedAIModels.length > 0 ||
    selectedAITools.length > 0;

  if (notFound) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center space-y-4">
            <div className="text-6xl">🔍</div>
            <h1 className="text-3xl font-bold">Category Not Found</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              The category you&apos;re looking for doesn&apos;t exist.
            </p>
            <Button asChild>
              <Link href="/products">Browse All Products</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
                  {categoryName || "Category"}
                </h1>
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed mt-3">
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
              <Button asChild size="lg">
                <Link href="/products/new">Submit Product</Link>
              </Button>
            </div>

            {/* Search Bar */}
            <SearchBar
              initialValue={query}
              onSearch={setQuery}
              placeholder="Search by name, tagline, or description..."
            />
          </div>
        </div>
      </div>

      {/* Desktop Horizontal Filters */}
      <div className="hidden lg:block">
        <HorizontalFilters
          categories={categories}
          tags={tags}
          aiModels={aiModels}
          aiTools={aiTools}
          selectedCategory={categoryId}
          selectedPricing={pricing}
          selectedTags={selectedTags}
          selectedAIModels={selectedAIModels}
          selectedAITools={selectedAITools}
          onCategoryChange={(catId) => {
            if (catId === "all") {
              router.push("/products");
            } else {
              const cat = categories.find((c) => c.id === catId);
              if (cat) {
                router.push(`/category/${cat.slug}`);
              }
            }
          }}
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
                  selectedCategory={categoryId}
                  selectedPricing={pricing}
                  selectedTags={selectedTags}
                  selectedAIModels={selectedAIModels}
                  selectedAITools={selectedAITools}
                  onCategoryChange={(catId) => {
                    if (catId === "all") {
                      router.push("/products");
                    } else {
                      const cat = categories.find((c) => c.id === catId);
                      if (cat) {
                        router.push(`/category/${cat.slug}`);
                      }
                    }
                  }}
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
              category: categories.find((c) => c.id === categoryId),
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
                : "No products in this category yet. Be the first to submit one!"}
            </p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={handleClearFilters}>
                Clear All Filters
              </Button>
            )}
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white mb-6">
              All Products
            </h2>
            <ProductList products={products} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        </div>
      }
    >
      <CategoryPageContent />
    </Suspense>
  );
}
