"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function followUser(userId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  if (user.id === userId) {
    return { error: "Cannot follow yourself" };
  }

  // Check if already following
  const { data: existing } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", user.id)
    .eq("following_id", userId)
    .single();

  if (existing) {
    return { error: "Already following this user" };
  }

  const { error } = await supabase.from("follows").insert({
    follower_id: user.id,
    following_id: userId,
  });

  if (error) {
    console.error("Error following user:", error);
    return { error: "Failed to follow user" };
  }

  revalidatePath(`/profile/${userId}`);
  return { success: true };
}

export async function unfollowUser(userId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("follows")
    .delete()
    .eq("follower_id", user.id)
    .eq("following_id", userId);

  if (error) {
    console.error("Error unfollowing user:", error);
    return { error: "Failed to unfollow user" };
  }

  revalidatePath(`/profile/${userId}`);
  return { success: true };
}

export async function isFollowing(userId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { isFollowing: false };
  }

  const { data } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", user.id)
    .eq("following_id", userId)
    .single();

  return { isFollowing: !!data };
}

export async function getFollowerCount(userId: string) {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("following_id", userId);

  if (error) {
    console.error("Error getting follower count:", error);
    return { count: 0 };
  }

  return { count: count || 0 };
}

export async function getFollowingCount(userId: string) {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("follower_id", userId)
    .not("following_id", "is", null);

  if (error) {
    console.error("Error getting following count:", error);
    return { count: 0 };
  }

  return { count: count || 0 };
}

export async function getFollowers(userId: string) {
  const supabase = await createClient();

  const { data: follows, error } = await supabase
    .from("follows")
    .select(
      `
      follower_id,
      created_at,
      follower:profiles!follows_follower_id_fkey (
        id,
        username,
        full_name,
        avatar_url,
        bio
      )
    `
    )
    .eq("following_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error getting followers:", error);
    return { followers: [] };
  }

  return { followers: follows || [] };
}

export async function getFollowing(userId: string) {
  const supabase = await createClient();

  const { data: follows, error } = await supabase
    .from("follows")
    .select(
      `
      following_id,
      created_at,
      following:profiles!follows_following_id_fkey (
        id,
        username,
        full_name,
        avatar_url,
        bio
      )
    `
    )
    .eq("follower_id", userId)
    .not("following_id", "is", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error getting following:", error);
    return { following: [] };
  }

  return { following: follows || [] };
}

export async function getUserFollowing() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { following: [], error: "Not authenticated" };
  }

  return getFollowing(user.id);
}

export async function getFollowingFeed(sortBy: "newest" | "trending" = "newest") {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { products: [], error: "Not authenticated" };
  }

  // Check subscription - following feed requires Pro or Pro Plus
  const { data: subscriptionData } = await supabase.rpc("get_user_subscription", {
    p_user_id: user.id,
  });

  const subscription = subscriptionData?.[0];
  if (!subscription || subscription.plan_name === "free") {
    return {
      products: [],
      error: "Following feed requires Pro or Pro Plus subscription",
      requiresUpgrade: true
    };
  }

  // Get list of user IDs that the current user follows
  const { data: followingData, error: followError } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", user.id)
    .not("following_id", "is", null);

  if (followError) {
    console.error("Error getting following list:", followError);
    return { products: [], error: "Failed to fetch following list" };
  }

  if (!followingData || followingData.length === 0) {
    return { products: [] };
  }

  const followingIds = followingData
    .map((f) => f.following_id)
    .filter((id): id is string => id !== null);

  // Fetch products from followed users
  let query = supabase
    .from("products")
    .select(
      `
      *,
      categories (
        name,
        slug
      ),
      profiles (
        username,
        avatar_url,
        full_name
      )
    `
    )
    .eq("status", "published")
    .in("user_id", followingIds);

  // Apply sorting
  if (sortBy === "newest") {
    query = query.order("created_at", { ascending: false });
  } else {
    // For trending, order by upvotes_count (you could make this more sophisticated)
    query = query.order("upvotes_count", { ascending: false });
  }

  query = query.limit(50);

  const { data: products, error: productsError } = await query;

  if (productsError) {
    console.error("Error fetching following feed:", productsError);
    return { products: [], error: "Failed to fetch products" };
  }

  // Get vote counts for each product
  const productsWithVotes = await Promise.all(
    (products || []).map(async (product: (typeof products)[0]) => {
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
    })
  );

  return { products: productsWithVotes };
}

// =============================================
// Product Following Functions
// =============================================

export async function followProduct(productId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Check subscription - following products requires Pro or Pro Plus
  const { data: subscriptionData } = await supabase.rpc("get_user_subscription", {
    p_user_id: user.id,
  });

  const subscription = subscriptionData?.[0];
  if (!subscription || subscription.plan_name === "free") {
    return {
      error: "Following products requires Pro or Pro Plus subscription",
      requiresUpgrade: true
    };
  }

  // Check if already following
  const { data: existing } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", user.id)
    .eq("product_id", productId)
    .single();

  if (existing) {
    return { error: "Already following this product" };
  }

  const { error } = await supabase.from("follows").insert({
    follower_id: user.id,
    product_id: productId,
  });

  if (error) {
    console.error("Error following product:", error);
    return { error: "Failed to follow product" };
  }

  revalidatePath(`/products/[slug]`, "page");
  return { success: true };
}

export async function unfollowProduct(productId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Note: No subscription check - allow users to unfollow even if downgraded
  // This ensures users can manage their existing follows after subscription changes

  const { error } = await supabase
    .from("follows")
    .delete()
    .eq("follower_id", user.id)
    .eq("product_id", productId);

  if (error) {
    console.error("Error unfollowing product:", error);
    return { error: "Failed to unfollow product" };
  }

  revalidatePath(`/products/[slug]`, "page");
  return { success: true };
}

export async function isFollowingProduct(productId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { isFollowing: false };
  }

  const { data } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", user.id)
    .eq("product_id", productId)
    .single();

  return { isFollowing: !!data };
}

export async function getProductFollowerCount(productId: string) {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("product_id", productId);

  if (error) {
    console.error("Error getting product follower count:", error);
    return { count: 0 };
  }

  return { count: count || 0 };
}

export async function getUserFollowedProducts() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { products: [], error: "Not authenticated" };
  }

  // Check subscription - following products requires Pro or Pro Plus
  const { data: subscriptionData } = await supabase.rpc("get_user_subscription", {
    p_user_id: user.id,
  });

  const subscription = subscriptionData?.[0];
  if (!subscription || subscription.plan_name === "free") {
    return {
      products: [],
      error: "Following products requires Pro or Pro Plus subscription",
      requiresUpgrade: true
    };
  }

  const { data: follows, error: followError } = await supabase
    .from("follows")
    .select(
      `
      product_id,
      created_at,
      products (
        id,
        name,
        slug,
        tagline,
        image_url,
        views_count,
        created_at,
        pricing_type,
        categories (
          name,
          slug
        ),
        profiles (
          username,
          avatar_url,
          full_name
        )
      )
    `
    )
    .eq("follower_id", user.id)
    .not("product_id", "is", null)
    .order("created_at", { ascending: false });

  if (followError) {
    console.error("Error getting followed products:", followError);
    return { products: [], error: "Failed to fetch followed products" };
  }

  // Get vote and comment counts for each product
  const productsWithStats = await Promise.all(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (follows || []).map(async (follow: any) => {
      const product = follow.products as {
        id: string;
        name: string;
        slug: string;
        tagline: string | null;
        image_url: string | null;
        views_count: number | null;
        created_at: string | null;
        pricing_type: string | null;
        categories: { name: string; slug: string } | null;
        profiles: { username: string; avatar_url: string | null; full_name: string | null } | null;
      };
      if (!product) return null;

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
        followed_at: follow.created_at,
        votes_count: votesCount || 0,
        comments_count: commentsCount || 0,
      };
    })
  );

  const products = productsWithStats.filter(
    (p): p is NonNullable<typeof p> => p !== null
  );

  return { products };
}
