"use server";

import { createClient } from "@/lib/supabase/server";

export interface SearchFilters {
  query?: string;
  category?: string;
  pricingType?: string;
  tags?: string[];
  aiModels?: string[];
  aiTools?: string[];
  sortBy?: "newest" | "votes" | "reviews" | "views" | "trending";
}

export async function searchProducts(filters: SearchFilters = {}) {
  const supabase = await createClient();

  // Start with base query
  let query = supabase
    .from("products")
    .select(
      `
      *,
      categories (id, name, slug),
      profiles (id, username, avatar_url)
    `,
      { count: "exact" }
    )
    .eq("status", "published");

  // Text search on name, tagline, and description
  if (filters.query) {
    const searchTerm = filters.query.trim();
    query = query.or(
      `name.ilike.%${searchTerm}%,tagline.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`
    );
  }

  // Filter by category
  if (filters.category && filters.category !== "all") {
    query = query.eq("category_id", filters.category);
  }

  // Filter by pricing type
  if (filters.pricingType && filters.pricingType !== "all") {
    query = query.eq("pricing_type", filters.pricingType);
  }

  // Filter by AI models (array contains)
  if (filters.aiModels && filters.aiModels.length > 0) {
    query = query.containedBy("ai_models_used", filters.aiModels);
  }

  // Filter by AI tools (array contains)
  if (filters.aiTools && filters.aiTools.length > 0) {
    query = query.containedBy("ai_tools_used", filters.aiTools);
  }

  // Sorting
  switch (filters.sortBy) {
    case "votes":
      query = query.order("upvotes_count", { ascending: false });
      break;
    case "reviews":
      query = query.order("created_at", { ascending: false }); // TODO: Add reviews_count column
      break;
    case "views":
      query = query.order("views_count", { ascending: false });
      break;
    case "trending":
      // Trending: combination of recent + votes + views
      // We'll sort by created_at first, then votes (client-side calculation)
      query = query.order("created_at", { ascending: false });
      break;
    case "newest":
    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

  const { data: products, error, count } = await query;

  if (error) {
    console.error("Error searching products:", error);
    return { products: [], count: 0, error: "Failed to search products" };
  }

  // If tag filtering is requested, filter in memory
  // (Since tags are in a junction table, we need a separate approach)
  let filteredProducts = products || [];

  if (filters.tags && filters.tags.length > 0) {
    // Fetch product IDs that have ALL the requested tags
    const { data: productTagsData } = await supabase
      .from("product_tags")
      .select("product_id, tag_id")
      .in(
        "tag_id",
        filters.tags
      );

    if (productTagsData) {
      // Count tags per product
      const productTagCounts = productTagsData.reduce((acc, pt) => {
        acc[pt.product_id] = (acc[pt.product_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Filter products that have all requested tags
      const matchingProductIds = Object.entries(productTagCounts)
        .filter(([, count]) => count === filters.tags!.length)
        .map(([productId]) => productId);

      filteredProducts = filteredProducts.filter((p) =>
        matchingProductIds.includes(p.id)
      );
    }
  }

  // Apply trending sort if selected (client-side)
  if (filters.sortBy === "trending" && filteredProducts.length > 0) {
    const now = Date.now();
    const DAY_MS = 24 * 60 * 60 * 1000;

    filteredProducts = filteredProducts
      .map((product) => {
        const createdAt = new Date(product.created_at || "").getTime();
        const daysOld = (now - createdAt) / DAY_MS;
        const ageWeight = Math.max(0, 1 - daysOld / 30); // Decay over 30 days
        const votesWeight = (product.upvotes_count || 0) * 2;
        const viewsWeight = (product.views_count || 0) * 0.1;

        return {
          ...product,
          trendingScore: ageWeight * 100 + votesWeight + viewsWeight,
        };
      })
      .sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0));
  }

  return {
    products: filteredProducts,
    count: filteredProducts.length,
    success: true,
  };
}

export async function getCategories() {
  const supabase = await createClient();

  const { data: categories, error } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    return { categories: [], error: "Failed to fetch categories" };
  }

  return { categories: categories || [], success: true };
}

export async function getTags() {
  const supabase = await createClient();

  const { data: tags, error } = await supabase
    .from("tags")
    .select("id, name, slug")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching tags:", error);
    return { tags: [], error: "Failed to fetch tags" };
  }

  return { tags: tags || [], success: true };
}

export async function getPopularTags(limit: number = 10) {
  const supabase = await createClient();

  // Get tags with the most products
  const { data: tagCounts } = await supabase
    .from("product_tags")
    .select("tag_id");

  if (!tagCounts) {
    return { tags: [] };
  }

  // Count occurrences
  const counts = tagCounts.reduce((acc, item) => {
    acc[item.tag_id] = (acc[item.tag_id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get top tag IDs
  const topTagIds = Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([tagId]) => tagId);

  // Fetch tag details
  const { data: tags } = await supabase
    .from("tags")
    .select("id, name, slug")
    .in("id", topTagIds);

  return { tags: tags || [] };
}

export async function getAvailableAIModels() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("ai_models_used")
    .eq("status", "published")
    .not("ai_models_used", "is", null);

  if (!products) return { aiModels: [] };

  // Extract unique AI models
  const modelsSet = new Set<string>();
  products.forEach((product) => {
    if (product.ai_models_used && Array.isArray(product.ai_models_used)) {
      product.ai_models_used.forEach((model: string) => modelsSet.add(model));
    }
  });

  const aiModels = Array.from(modelsSet).sort();
  return { aiModels };
}

export async function getAvailableAITools() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("ai_tools_used")
    .eq("status", "published")
    .not("ai_tools_used", "is", null);

  if (!products) return { aiTools: [] };

  // Extract unique AI tools
  const toolsSet = new Set<string>();
  products.forEach((product) => {
    if (product.ai_tools_used && Array.isArray(product.ai_tools_used)) {
      product.ai_tools_used.forEach((tool: string) => toolsSet.add(tool));
    }
  });

  const aiTools = Array.from(toolsSet).sort();
  return { aiTools };
}
