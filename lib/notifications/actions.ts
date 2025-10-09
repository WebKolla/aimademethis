"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

export type UserNotification = Database["public"]["Tables"]["notifications"]["Row"] & {
  actor?: {
    username: string;
    avatar_url: string | null;
  } | null;
};

export async function getNotifications(limit = 20) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { notifications: null, error: "Not authenticated" };
  }

  const { data: notifications, error } = await supabase
    .from("notifications")
    .select(
      `
      *,
      actor:profiles!notifications_actor_id_fkey (
        username,
        avatar_url
      )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return { notifications: null, error: error.message };
  }

  return { notifications: notifications as unknown as UserNotification[], error: null };
}

export async function getUnreadCount() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { count: 0, error: "Not authenticated" };
  }

  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("is_read", false);

  if (error) {
    return { count: 0, error: error.message };
  }

  return { count: count || 0, error: null };
}

export async function markAsRead(notificationId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

export async function markAllAsRead() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", user.id)
    .eq("is_read", false);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

export async function deleteNotification(notificationId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("id", notificationId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

export async function deleteAllNotifications() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

// Notification creation helpers

export async function createProductUpdateNotification(params: {
  productId: string;
  productName: string;
  productSlug: string;
  actorId: string;
}) {
  const supabase = await createClient();

  // Get all followers of this product
  const { data: followers } = await supabase
    .from("follows")
    .select("follower_id")
    .eq("product_id", params.productId)
    .not("follower_id", "is", null);

  if (!followers || followers.length === 0) {
    return { success: true }; // No followers to notify
  }

  // Create notifications for all followers
  const notifications = followers.map((follow) => ({
    user_id: follow.follower_id!,
    actor_id: params.actorId,
    product_id: params.productId,
    type: "product_update",
    title: "Product Updated",
    message: `${params.productName} has been updated`,
    link: `/products/${params.productSlug}`,
    is_read: false,
  }));

  const { error } = await supabase.from("notifications").insert(notifications);

  if (error) {
    console.error("Error creating product update notifications:", error);
    return { error: error.message };
  }

  return { success: true };
}

export async function createCommentReplyNotification(params: {
  parentCommentId: string;
  parentCommentAuthorId: string;
  replyAuthorId: string;
  replyAuthorUsername: string;
  productId: string;
  productName: string;
  productSlug: string;
  commentId: string;
}) {
  const supabase = await createClient();

  // Don't notify if replying to own comment
  if (params.parentCommentAuthorId === params.replyAuthorId) {
    return { success: true };
  }

  const { error } = await supabase.from("notifications").insert({
    user_id: params.parentCommentAuthorId,
    actor_id: params.replyAuthorId,
    product_id: params.productId,
    comment_id: params.commentId,
    type: "comment_reply",
    title: "New Reply",
    message: `${params.replyAuthorUsername} replied to your comment on ${params.productName}`,
    link: `/products/${params.productSlug}#comment-${params.commentId}`,
    is_read: false,
  });

  if (error) {
    console.error("Error creating comment reply notification:", error);
    return { error: error.message };
  }

  return { success: true };
}
