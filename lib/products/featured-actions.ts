"use server";

import { createClient } from "@/lib/supabase/server";

export async function getFeaturedProduct() {
  const supabase = await createClient();

  // Get a Pro Plus product that is marked as featured (highest sort_order)
  // In future, you can add a 'featured_until' date field for rotation
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
    .eq("status", "published")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(1)
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
