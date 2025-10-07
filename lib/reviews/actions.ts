"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addReview(productId: string, rating: number, comment?: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to leave a review" };
  }

  if (rating < 1 || rating > 5) {
    return { error: "Rating must be between 1 and 5" };
  }

  if (comment && comment.length > 1000) {
    return { error: "Review comment is too long (max 1000 characters)" };
  }

  // Check if user already reviewed this product
  const { data: existingReview } = await supabase
    .from("reviews")
    .select("id")
    .eq("product_id", productId)
    .eq("user_id", user.id)
    .single();

  if (existingReview) {
    return { error: "You have already reviewed this product. You can edit your existing review." };
  }

  // Insert the review
  const { data: review, error } = await supabase
    .from("reviews")
    .insert({
      product_id: productId,
      user_id: user.id,
      rating,
      comment: comment?.trim() || null,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error adding review:", error);
    return { error: "Failed to add review" };
  }

  revalidatePath("/products/[slug]", "page");

  return { success: true, reviewId: review.id };
}

export async function editReview(reviewId: string, rating: number, comment?: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to edit reviews" };
  }

  if (rating < 1 || rating > 5) {
    return { error: "Rating must be between 1 and 5" };
  }

  if (comment && comment.length > 1000) {
    return { error: "Review comment is too long (max 1000 characters)" };
  }

  // Check if user owns the review
  const { data: existingReview, error: fetchError } = await supabase
    .from("reviews")
    .select("user_id")
    .eq("id", reviewId)
    .single();

  if (fetchError || !existingReview) {
    return { error: "Review not found" };
  }

  if (existingReview.user_id !== user.id) {
    return { error: "You can only edit your own reviews" };
  }

  // Update the review
  const { error } = await supabase
    .from("reviews")
    .update({
      rating,
      comment: comment?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", reviewId);

  if (error) {
    console.error("Error editing review:", error);
    return { error: "Failed to edit review" };
  }

  revalidatePath("/products/[slug]", "page");

  return { success: true };
}

export async function deleteReview(reviewId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to delete reviews" };
  }

  // Check if user owns the review
  const { data: existingReview, error: fetchError } = await supabase
    .from("reviews")
    .select("user_id")
    .eq("id", reviewId)
    .single();

  if (fetchError || !existingReview) {
    return { error: "Review not found" };
  }

  if (existingReview.user_id !== user.id) {
    return { error: "You can only delete your own reviews" };
  }

  // Delete the review
  const { error } = await supabase.from("reviews").delete().eq("id", reviewId);

  if (error) {
    console.error("Error deleting review:", error);
    return { error: "Failed to delete review" };
  }

  revalidatePath("/products/[slug]", "page");

  return { success: true };
}

export async function getProductReviews(productId: string) {
  const supabase = await createClient();

  // Fetch all reviews for the product with user profiles
  const { data: reviews, error } = await supabase
    .from("reviews")
    .select(
      `
      *,
      profiles (
        id,
        username,
        avatar_url,
        full_name
      )
    `
    )
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reviews:", error);
    return { error: "Failed to load reviews", reviews: [] };
  }

  return { success: true, reviews: reviews || [] };
}

export async function getAverageRating(productId: string) {
  const supabase = await createClient();

  const { data: reviews, error } = await supabase
    .from("reviews")
    .select("rating")
    .eq("product_id", productId);

  if (error || !reviews || reviews.length === 0) {
    return { averageRating: 0, totalReviews: 0 };
  }

  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  const average = sum / reviews.length;

  return {
    averageRating: Math.round(average * 10) / 10, // Round to 1 decimal place
    totalReviews: reviews.length,
  };
}

export async function getUserReview(productId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { review: null };
  }

  const { data: review } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .eq("user_id", user.id)
    .single();

  return { review: review || null };
}
