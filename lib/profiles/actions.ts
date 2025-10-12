"use server";

import { createClient } from "@/lib/supabase/server";
import { profileUpdateSchema, type ProfileUpdateData } from "./schemas";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: ProfileUpdateData) {
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "You must be logged in to update your profile" };
  }

  // Validate form data
  const validation = profileUpdateSchema.safeParse(formData);

  if (!validation.success) {
    return {
      error: "Invalid form data",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const validatedData = validation.data;

  // Update profile
  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      full_name: validatedData.full_name || null,
      bio: validatedData.bio || null,
      website: validatedData.website || null,
      twitter: validatedData.twitter || null,
      github: validatedData.github || null,
    })
    .eq("id", user.id);

  if (updateError) {
    console.error("Profile update error:", updateError);
    return { error: "Failed to update profile. Please try again." };
  }

  // Get username for revalidation
  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  // Revalidate profile pages
  if (profile) {
    revalidatePath(`/profile/${(profile as { username: string }).username}`);
  }
  revalidatePath("/profile/settings");
  revalidatePath("/dashboard/profile");

  return { success: true };
}

export async function uploadAvatar(file: File): Promise<{ url?: string; error?: string }> {
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "You must be logged in to upload an avatar" };
  }

  // Generate unique filename
  const fileExt = file.name.split(".").pop();
  const fileName = `${user.id}/avatar-${Date.now()}.${fileExt}`;

  // Delete old avatar if exists
  const { data: oldFiles } = await supabase.storage
    .from("avatars")
    .list(user.id);

  if (oldFiles && oldFiles.length > 0) {
    const filesToDelete = oldFiles.map((file) => `${user.id}/${file.name}`);
    await supabase.storage.from("avatars").remove(filesToDelete);
  }

  // Upload new avatar
  const { data, error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    console.error("Upload error:", uploadError);
    return { error: "Failed to upload avatar. Please try again." };
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(data.path);

  // Update profile with new avatar URL
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: publicUrl })
    .eq("id", user.id);

  if (updateError) {
    console.error("Update error:", updateError);
    return { error: "Failed to update profile with avatar URL" };
  }

  // Get username for revalidation
  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  // Revalidate profile pages
  if (profile) {
    revalidatePath(`/profile/${(profile as { username: string }).username}`);
  }
  revalidatePath("/profile/settings");
  revalidatePath("/dashboard/profile");

  return { url: publicUrl };
}
