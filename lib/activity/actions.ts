"use server";

import { createClient } from "@/lib/supabase/server";

export type ActivityType = "new_product" | "review" | "comment";

export interface Activity {
  id: string;
  type: ActivityType;
  created_at: string;
  actor: {
    id: string;
    username: string;
    avatar_url: string | null;
    full_name: string | null;
  };
  product: {
    id: string;
    name: string;
    slug: string;
    image_url: string | null;
  };
  content?: string; // For reviews and comments
  rating?: number; // For reviews
}

export async function getActivityFeed(limit: number = 20) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { activities: [], error: "Not authenticated" };
  }

  // Get list of followed users and products
  const { data: follows } = await supabase
    .from("follows")
    .select("following_id, product_id")
    .eq("follower_id", user.id);

  if (!follows || follows.length === 0) {
    return { activities: [] };
  }

  const followedUserIds = follows
    .filter((f) => f.following_id)
    .map((f) => f.following_id)
    .filter((id): id is string => id !== null);

  const followedProductIds = follows
    .filter((f) => f.product_id)
    .map((f) => f.product_id)
    .filter((id): id is string => id !== null);

  const activities: Activity[] = [];

  // Fetch new products from followed users
  if (followedUserIds.length > 0) {
    const { data: products } = await supabase
      .from("products")
      .select(
        `
        id,
        name,
        slug,
        image_url,
        created_at,
        user_id,
        profiles (
          id,
          username,
          avatar_url,
          full_name
        )
      `
      )
      .in("user_id", followedUserIds)
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (products) {
      products.forEach((product) => {
        if (product.profiles) {
          const profile = product.profiles as {
            id: string;
            username: string;
            avatar_url: string | null;
            full_name: string | null;
          };
          activities.push({
            id: `product-${product.id}`,
            type: "new_product",
            created_at: product.created_at,
            actor: {
              id: profile.id,
              username: profile.username,
              avatar_url: profile.avatar_url,
              full_name: profile.full_name,
            },
            product: {
              id: product.id,
              name: product.name,
              slug: product.slug,
              image_url: product.image_url,
            },
          });
        }
      });
    }
  }

  // Fetch reviews from followed users
  if (followedUserIds.length > 0) {
    const { data: reviews } = await supabase
      .from("reviews")
      .select(
        `
        id,
        content,
        rating,
        created_at,
        user_id,
        product_id,
        profiles (
          id,
          username,
          avatar_url,
          full_name
        ),
        products (
          id,
          name,
          slug,
          image_url
        )
      `
      )
      .in("user_id", followedUserIds)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (reviews) {
      reviews.forEach((review) => {
        if (review.profiles && review.products) {
          const profile = review.profiles as {
            id: string;
            username: string;
            avatar_url: string | null;
            full_name: string | null;
          };
          const product = review.products as {
            id: string;
            name: string;
            slug: string;
            image_url: string | null;
          };
          activities.push({
            id: `review-${review.id}`,
            type: "review",
            created_at: review.created_at,
            actor: {
              id: profile.id,
              username: profile.username,
              avatar_url: profile.avatar_url,
              full_name: profile.full_name,
            },
            product: {
              id: product.id,
              name: product.name,
              slug: product.slug,
              image_url: product.image_url,
            },
            content: review.content,
            rating: review.rating,
          });
        }
      });
    }
  }

  // Fetch comments from followed users
  if (followedUserIds.length > 0) {
    const { data: comments } = await supabase
      .from("comments")
      .select(
        `
        id,
        content,
        created_at,
        user_id,
        product_id,
        profiles (
          id,
          username,
          avatar_url,
          full_name
        ),
        products (
          id,
          name,
          slug,
          image_url
        )
      `
      )
      .in("user_id", followedUserIds)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (comments) {
      comments.forEach((comment) => {
        if (comment.profiles && comment.products) {
          const profile = comment.profiles as {
            id: string;
            username: string;
            avatar_url: string | null;
            full_name: string | null;
          };
          const product = comment.products as {
            id: string;
            name: string;
            slug: string;
            image_url: string | null;
          };
          activities.push({
            id: `comment-${comment.id}`,
            type: "comment",
            created_at: comment.created_at,
            actor: {
              id: profile.id,
              username: profile.username,
              avatar_url: profile.avatar_url,
              full_name: profile.full_name,
            },
            product: {
              id: product.id,
              name: product.name,
              slug: product.slug,
              image_url: product.image_url,
            },
            content: comment.content,
          });
        }
      });
    }
  }

  // Sort all activities by date (most recent first)
  activities.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Limit to specified number
  const limitedActivities = activities.slice(0, limit);

  return { activities: limitedActivities };
}
