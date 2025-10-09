"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { createCommentReplyNotification } from "@/lib/notifications/actions";

export async function addComment(productId: string, content: string, parentId?: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to comment" };
  }

  if (!content.trim()) {
    return { error: "Comment cannot be empty" };
  }

  if (content.length > 2000) {
    return { error: "Comment is too long (max 2000 characters)" };
  }

  // Insert the comment
  const { data: comment, error } = await supabase
    .from("comments")
    .insert({
      product_id: productId,
      user_id: user.id,
      content: content.trim(),
      parent_id: parentId || null,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error adding comment:", error);
    return { error: "Failed to add comment" };
  }

  // Increment comment count (only for top-level comments)
  if (!parentId) {
    await supabase.rpc("increment_comment_count", { product_id: productId });
  }

  // If this is a reply, send notification to parent comment author
  if (parentId) {
    // Get parent comment details
    const { data: parentComment } = await supabase
      .from("comments")
      .select("user_id")
      .eq("id", parentId)
      .single();

    // Get product details
    const { data: product } = await supabase
      .from("products")
      .select("name, slug")
      .eq("id", productId)
      .single();

    // Get user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();

    if (parentComment && product && profile) {
      await createCommentReplyNotification({
        parentCommentId: parentId,
        parentCommentAuthorId: parentComment.user_id,
        replyAuthorId: user.id,
        replyAuthorUsername: profile.username,
        productId,
        productName: product.name,
        productSlug: product.slug,
        commentId: comment.id,
      });
    }
  }

  revalidatePath(`/products/[slug]`, "page");

  return { success: true, commentId: comment.id };
}

export async function editComment(commentId: string, content: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to edit comments" };
  }

  if (!content.trim()) {
    return { error: "Comment cannot be empty" };
  }

  if (content.length > 2000) {
    return { error: "Comment is too long (max 2000 characters)" };
  }

  // Check if user owns the comment
  const { data: existingComment, error: fetchError } = await supabase
    .from("comments")
    .select("user_id")
    .eq("id", commentId)
    .single();

  if (fetchError || !existingComment) {
    return { error: "Comment not found" };
  }

  if (existingComment.user_id !== user.id) {
    return { error: "You can only edit your own comments" };
  }

  // Update the comment
  const { error } = await supabase
    .from("comments")
    .update({
      content: content.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", commentId);

  if (error) {
    console.error("Error editing comment:", error);
    return { error: "Failed to edit comment" };
  }

  revalidatePath(`/products/[slug]`, "page");

  return { success: true };
}

export async function deleteComment(commentId: string, productId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to delete comments" };
  }

  // Check if user owns the comment
  const { data: existingComment, error: fetchError } = await supabase
    .from("comments")
    .select("user_id, parent_id")
    .eq("id", commentId)
    .single();

  if (fetchError || !existingComment) {
    return { error: "Comment not found" };
  }

  if (existingComment.user_id !== user.id) {
    return { error: "You can only delete your own comments" };
  }

  // Delete the comment (cascade will handle replies)
  const { error } = await supabase.from("comments").delete().eq("id", commentId);

  if (error) {
    console.error("Error deleting comment:", error);
    return { error: "Failed to delete comment" };
  }

  // Decrement comment count (only for top-level comments)
  if (!existingComment.parent_id) {
    await supabase.rpc("decrement_comment_count", { product_id: productId });
  }

  revalidatePath(`/products/[slug]`, "page");

  return { success: true };
}

export async function getComments(productId: string) {
  const supabase = await createClient();

  // Fetch all comments for the product with user profiles
  const { data: comments, error } = await supabase
    .from("comments")
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
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching comments:", error);
    return { error: "Failed to load comments", comments: [] };
  }

  return { success: true, comments: comments || [] };
}
