"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleVote(productId: string) {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to vote" };
  }

  // Check if user has already voted
  const { data: existingVote } = await supabase
    .from("votes")
    .select("id, vote_type")
    .eq("product_id", productId)
    .eq("user_id", user.id)
    .single();

  if (existingVote) {
    // Remove vote (toggle off)
    const { error: deleteError } = await supabase
      .from("votes")
      .delete()
      .eq("id", existingVote.id);

    if (deleteError) {
      return { error: "Failed to remove vote" };
    }

    // Decrement upvotes_count
    const { error: updateError } = await supabase.rpc("decrement_upvotes", {
      product_id: productId,
    });

    if (updateError) {
      console.error("Failed to decrement upvotes:", updateError);
    }

    revalidatePath("/products");
    revalidatePath(`/products/${productId}`);
    return { success: true, voted: false };
  } else {
    // Add upvote
    const { error: insertError } = await supabase.from("votes").insert({
      product_id: productId,
      user_id: user.id,
      vote_type: "upvote",
    });

    if (insertError) {
      return { error: "Failed to add vote" };
    }

    // Increment upvotes_count
    const { error: updateError } = await supabase.rpc("increment_upvotes", {
      product_id: productId,
    });

    if (updateError) {
      console.error("Failed to increment upvotes:", updateError);
    }

    revalidatePath("/products");
    revalidatePath(`/products/${productId}`);
    return { success: true, voted: true };
  }
}

export async function getVoteStatus(productId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { voted: false };
  }

  const { data: vote } = await supabase
    .from("votes")
    .select("id")
    .eq("product_id", productId)
    .eq("user_id", user.id)
    .single();

  return { voted: !!vote };
}
