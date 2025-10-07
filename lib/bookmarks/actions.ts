"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleBookmark(productId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to bookmark products" };
  }

  // Check if bookmark already exists
  const { data: existingBookmark } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("product_id", productId)
    .eq("user_id", user.id)
    .single();

  if (existingBookmark) {
    // Remove bookmark
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", existingBookmark.id);

    if (error) {
      console.error("Error removing bookmark:", error);
      return { error: "Failed to remove bookmark" };
    }

    revalidatePath("/products/[slug]", "page");
    revalidatePath("/dashboard/bookmarks");

    return { success: true, bookmarked: false };
  } else {
    // Add bookmark
    const { error } = await supabase.from("bookmarks").insert({
      product_id: productId,
      user_id: user.id,
    });

    if (error) {
      console.error("Error adding bookmark:", error);
      return { error: "Failed to add bookmark" };
    }

    revalidatePath("/products/[slug]", "page");
    revalidatePath("/dashboard/bookmarks");

    return { success: true, bookmarked: true };
  }
}

export async function getUserBookmarks() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to view bookmarks", bookmarks: [] };
  }

  // Fetch user's bookmarks with product details
  const { data: bookmarks, error } = await supabase
    .from("bookmarks")
    .select(
      `
      id,
      created_at,
      products (
        *,
        categories (name, slug),
        profiles (username, avatar_url)
      )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching bookmarks:", error);
    return { error: "Failed to load bookmarks", bookmarks: [] };
  }

  return { success: true, bookmarks: bookmarks || [] };
}

export async function checkUserBookmark(productId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { bookmarked: false };
  }

  const { data: bookmark } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("product_id", productId)
    .eq("user_id", user.id)
    .single();

  return { bookmarked: !!bookmark };
}
