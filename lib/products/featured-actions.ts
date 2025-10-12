"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Get the currently featured product with automatic Pro Plus rotation.
 *
 * Algorithm:
 * 1. Check if there's an active featured product (within its featured_until window)
 * 2. If not, select next Pro Plus product that:
 *    - Hasn't been featured this month, OR
 *    - Has been featured least recently
 * 3. Feature each product for 24 hours
 * 4. Ensure all Pro Plus products get featured at least once per month
 */
export async function getFeaturedProduct() {
  const supabase = await createClient();

  // Check for currently active featured product
  const { data: activeFeatured } = await supabase
    .from("featured_product_history")
    .select("product_id, featured_until")
    .gt("featured_until", new Date().toISOString())
    .order("featured_at", { ascending: false })
    .limit(1)
    .single();

  let productId: string | null = null;

  if (activeFeatured && new Date(activeFeatured.featured_until) > new Date()) {
    // Use currently active featured product
    productId = activeFeatured.product_id;
  } else {
    // Need to select next product to feature
    productId = await selectNextFeaturedProduct();

    if (productId) {
      // Record this product as featured for next 24 hours
      const featuredUntil = new Date();
      featuredUntil.setHours(featuredUntil.getHours() + 24);

      await supabase.from("featured_product_history").insert({
        product_id: productId,
        featured_at: new Date().toISOString(),
        featured_until: featuredUntil.toISOString(),
      });
    }
  }

  if (!productId) {
    return null;
  }

  // Fetch the full product details
  const { data: product, error } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      slug,
      tagline,
      description,
      image_url,
      video_url,
      demo_video_url,
      website_url,
      created_at,
      views_count,
      upvotes_count,
      pricing_type,
      categories (
        name,
        slug
      ),
      profiles (
        id,
        username,
        full_name,
        avatar_url
      )
    `
    )
    .eq("id", productId)
    .eq("status", "published")
    .single();

  if (error || !product) {
    return null;
  }

  // Get vote and comment counts
  const { count: votesCount } = await supabase
    .from("votes")
    .select("id", { count: "exact", head: true })
    .eq("product_id", product.id)
    .eq("vote_type", "upvote");

  const { count: commentsCount } = await supabase
    .from("comments")
    .select("id", { count: "exact", head: true })
    .eq("product_id", product.id);

  return {
    ...product,
    votes_count: votesCount || 0,
    comments_count: commentsCount || 0,
  };
}

/**
 * Select the next product to feature based on:
 * 1. Pro Plus subscription status
 * 2. Fair rotation (prioritize products not featured recently)
 * 3. Product quality (published, has image, good stats)
 */
async function selectNextFeaturedProduct(): Promise<string | null> {
  const supabase = await createClient();

  // Get start of current month for rotation tracking
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  // Get all Pro Plus users
  const { data: allSubscriptions } = await supabase.rpc("get_user_subscription");

  if (!allSubscriptions || allSubscriptions.length === 0) {
    return null;
  }

  const proPlusUserIds = allSubscriptions
    .filter((sub) => sub.plan_name === "pro_plus")
    .map((sub) => sub.user_id);

  if (proPlusUserIds.length === 0) {
    return null;
  }

  // Get products from Pro Plus users that are published and have images
  const { data: eligibleProducts } = await supabase
    .from("products")
    .select("id, created_at, upvotes_count, views_count")
    .eq("status", "published")
    .not("image_url", "is", null)
    .in("user_id", proPlusUserIds)
    .order("upvotes_count", { ascending: false })
    .limit(100); // Limit for performance

  if (!eligibleProducts || eligibleProducts.length === 0) {
    return null;
  }

  // Get products featured this month
  const { data: featuredThisMonth } = await supabase
    .from("featured_product_history")
    .select("product_id, featured_at")
    .gte("featured_at", monthStart.toISOString())
    .order("featured_at", { ascending: true });

  const featuredProductIds = new Set(
    (featuredThisMonth || []).map((f) => f.product_id)
  );

  // Prioritize products not featured this month
  const notFeaturedThisMonth = eligibleProducts.filter(
    (p) => !featuredProductIds.has(p.id)
  );

  if (notFeaturedThisMonth.length > 0) {
    // Select product with highest engagement from non-featured
    const bestProduct = notFeaturedThisMonth.reduce((best, current) => {
      const bestScore = (best.upvotes_count || 0) + (best.views_count || 0) * 0.1;
      const currentScore = (current.upvotes_count || 0) + (current.views_count || 0) * 0.1;
      return currentScore > bestScore ? current : best;
    });
    return bestProduct.id;
  }

  // All products have been featured this month, pick least recently featured
  const productFeatureDates = new Map(
    (featuredThisMonth || []).map((f) => [f.product_id, new Date(f.featured_at)])
  );

  const leastRecentlyFeatured = eligibleProducts.reduce((oldest, current) => {
    const oldestDate = productFeatureDates.get(oldest.id) || new Date(0);
    const currentDate = productFeatureDates.get(current.id) || new Date(0);
    return currentDate < oldestDate ? current : oldest;
  });

  return leastRecentlyFeatured.id;
}
