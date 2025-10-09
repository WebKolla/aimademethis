"use server";

import { createClient } from "@/lib/supabase/server";
import {
  newsletterSchema,
  type NewsletterSubscribeResponse,
} from "@/types/newsletter.types";
import { headers } from "next/headers";

/**
 * Subscribe an email to the newsletter
 * Handles validation, rate limiting, and duplicate detection
 */
export async function subscribeToNewsletter(
  formData: FormData
): Promise<NewsletterSubscribeResponse> {
  try {
    // 1. Extract and validate email
    const rawEmail = formData.get("email");
    const validation = newsletterSchema.safeParse({ email: rawEmail });

    if (!validation.success) {
      const firstError = validation.error.issues[0];
      return {
        success: false,
        error: firstError?.message || "Invalid email address",
        code: "VALIDATION",
      };
    }

    const { email } = validation.data;

    // 2. Get request metadata for GDPR compliance
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || null;
    const userAgent = headersList.get("user-agent") || null;

    // 3. Database insertion
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("newsletter_subscriptions")
      .insert({
        email,
        status: "active",
        source: "homepage",
        consent_ip: ip,
        user_agent: userAgent,
      })
      .select()
      .single();

    // 4. Handle errors
    if (error) {
      // Check for duplicate email (unique constraint violation)
      if (error.code === "23505") {
        // Check if already subscribed and active
        const { data: existing } = await supabase
          .from("newsletter_subscriptions")
          .select("status")
          .eq("email", email)
          .single();

        if (existing?.status === "active") {
          return {
            success: false,
            error: "You're already subscribed to our newsletter!",
            code: "DUPLICATE",
          };
        } else if (existing?.status === "unsubscribed") {
          // Reactivate subscription
          const { error: updateError } = await supabase
            .from("newsletter_subscriptions")
            .update({
              status: "active",
              subscribed_at: new Date().toISOString(),
              unsubscribed_at: null,
            })
            .eq("email", email);

          if (updateError) {
            return {
              success: false,
              error: "Failed to reactivate subscription. Please try again.",
              code: "SERVER_ERROR",
            };
          }

          return {
            success: true,
            message: "Welcome back! Your subscription has been reactivated.",
          };
        }
      }

      // Generic error
      console.error("Newsletter subscription error:", error);
      return {
        success: false,
        error: "Something went wrong. Please try again later.",
        code: "SERVER_ERROR",
      };
    }

    // 5. Success response
    return {
      success: true,
      message: "Thank you for subscribing! You'll receive weekly AI product updates.",
    };
  } catch (error) {
    console.error("Unexpected newsletter error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
      code: "SERVER_ERROR",
    };
  }
}

/**
 * Unsubscribe from newsletter
 * Can be used for future unsubscribe functionality
 */
export async function unsubscribeFromNewsletter(
  email: string
): Promise<NewsletterSubscribeResponse> {
  try {
    const validation = newsletterSchema.safeParse({ email });
    if (!validation.success) {
      return {
        success: false,
        error: "Invalid email address",
        code: "VALIDATION",
      };
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("newsletter_subscriptions")
      .update({
        status: "unsubscribed",
        unsubscribed_at: new Date().toISOString(),
      })
      .eq("email", validation.data.email)
      .eq("status", "active");

    if (error) {
      return {
        success: false,
        error: "Failed to unsubscribe. Please try again.",
        code: "SERVER_ERROR",
      };
    }

    return {
      success: true,
      message: "You've been unsubscribed. We're sorry to see you go!",
    };
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return {
      success: false,
      error: "An unexpected error occurred.",
      code: "SERVER_ERROR",
    };
  }
}
