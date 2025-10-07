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
