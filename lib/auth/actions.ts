"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { signUpSchema, signInSchema, type SignUpData, type SignInData } from "./schemas";

export async function signUp(data: SignUpData) {
  const supabase = await createClient();

  // Validate input
  const validatedData = signUpSchema.parse(data);

  // Check if username is already taken
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("username")
    .eq("username", validatedData.username)
    .single();

  if (existingProfile) {
    return { error: "Username is already taken" };
  }

  // Sign up user
  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email: validatedData.email,
    password: validatedData.password,
    options: {
      data: {
        username: validatedData.username,
      },
    },
  });

  if (signUpError) {
    return { error: signUpError.message };
  }

  // Create profile
  if (authData.user) {
    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      username: validatedData.username,
      full_name: "" as string,
    } as never);

    if (profileError) {
      return { error: "Failed to create profile" };
    }
  }

  return { success: true, data: authData };
}

export async function signIn(data: SignInData) {
  const supabase = await createClient();

  // Validate input
  const validatedData = signInSchema.parse(data);

  const { error } = await supabase.auth.signInWithPassword({
    email: validatedData.email,
    password: validatedData.password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function signInWithOAuth(provider: "google" | "github") {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }
}
