"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

export type TimePeriod = "today" | "week" | "month" | "all";

type Product = Database["public"]["Tables"]["products"]["Row"] & {
  categories: { id: string; name: string; slug: string } | null;
  profiles: { id: string; username: string; avatar_url: string | null } | null;
};

export async function getTrendingProducts(timePeriod: TimePeriod = "week") {
  const supabase = await createClient();

  // Calculate date threshold based on time period
  const now = new Date();
  let dateThreshold: Date | null = null;

  switch (timePeriod) {
    case "today":
      dateThreshold = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case "week":
      dateThreshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "month":
      dateThreshold = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case "all":
      dateThreshold = null;
      break;
  }

  // Build query
  let query = supabase
    .from("products")
    .select(
      `
      *,
      categories (id, name, slug),
      profiles (id, username, avatar_url)
    `
    )
    .eq("status", "published");

  // Apply date filter if applicable
  if (dateThreshold) {
    query = query.gte("created_at", dateThreshold.toISOString());
  }

  // Order by created_at to get recent products
  query = query.order("created_at", { ascending: false });

  const { data: products, error } = await query;

  if (error) {
    console.error("Error fetching trending products:", error);
    return { products: [], error: "Failed to fetch trending products" };
  }

  // Calculate trending score for each product
  const nowTime = Date.now();
  const DAY_MS = 24 * 60 * 60 * 1000;

  const productsWithScore = (products || []).map((product) => {
    const createdAt = new Date(product.created_at || "").getTime();
    const daysOld = (nowTime - createdAt) / DAY_MS;

    // Trending algorithm weights:
    // - Recency: Products created recently get higher scores
    // - Engagement: Upvotes have high weight
    // - Views: Secondary indicator of interest
    const ageWeight = Math.max(0, 1 - daysOld / 30); // Decay over 30 days (0-1)
    const votesWeight = (product.upvotes_count || 0) * 2;
    const viewsWeight = (product.views_count || 0) * 0.1;

    const trendingScore = ageWeight * 100 + votesWeight + viewsWeight;

    return {
      ...product,
      trendingScore,
    };
  });

  // Sort by trending score (descending)
  const sortedProducts = productsWithScore.sort(
    (a, b) => b.trendingScore - a.trendingScore
  );

  return {
    products: sortedProducts,
    count: sortedProducts.length,
    success: true,
  };
}
