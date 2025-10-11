"use server";

import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe/client";
import { redirect } from "next/navigation";
import type {
  PlanName,
  BillingCycle,
  CreateCheckoutSessionInput,
  CheckoutSessionResult,
  CreatePortalSessionInput,
  PortalSessionResult,
  UserSubscription,
  FeatureAccessResult,
  FeatureName,
  SubscriptionActionResult,
  UsageStatus,
  LimitFeatureName,
} from "@/types/subscription.types";
import { getRequiredPlanForFeature, isPlanHigherOrEqual } from "@/types/subscription.types";

// ============================================================================
// GET USER SUBSCRIPTION
// ============================================================================
/**
 * Fetches the current user's subscription details
 * Returns free plan if user has no active subscription
 */
export async function getUserSubscription(): Promise<UserSubscription | null> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return null;
    }

    // Call the database function that returns subscription details
    const { data, error } = await supabase.rpc("get_user_subscription", {
      p_user_id: user.id,
    });

    if (error) {
      console.error("Error fetching subscription:", error);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    const subscription = data[0];

    return {
      subscriptionId: subscription.subscription_id,
      userId: subscription.user_id,
      planId: subscription.plan_id,
      planName: subscription.plan_name as PlanName,
      planDisplayName: subscription.plan_display_name,
      planFeatures: (subscription.plan_features as string[]) as FeatureName[],
      planLimits: subscription.plan_limits as Record<LimitFeatureName, number>,
      status: subscription.status as "active" | "canceled" | "past_due" | "trialing" | "incomplete" | "incomplete_expired" | "unpaid",
      billingCycle: subscription.billing_cycle as BillingCycle,
      currentPeriodEnd: subscription.current_period_end,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      trialEnd: subscription.trial_end,
      isTrial: subscription.is_trial,
    };
  } catch (error) {
    console.error("Error in getUserSubscription:", error);
    return null;
  }
}

// ============================================================================
// CREATE CHECKOUT SESSION
// ============================================================================
/**
 * Creates a Stripe Checkout session for subscribing to a plan
 */
export async function createCheckoutSession(
  input: CreateCheckoutSessionInput
): Promise<CheckoutSessionResult | { error: string }> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: "You must be logged in to subscribe" };
    }

    // Fetch the plan from database
    const { data: plan, error: planError } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("name", input.planName)
      .eq("is_active", true)
      .single();

    if (planError || !plan) {
      return { error: "Invalid subscription plan" };
    }

    // Get the appropriate Stripe price ID
    const priceId =
      input.billingCycle === "yearly"
        ? plan.stripe_price_id_yearly
        : plan.stripe_price_id_monthly;

    if (!priceId) {
      return { error: "Price not configured for this plan" };
    }

    // Check if user already has a Stripe customer ID and subscription history
    const { data: existingSubscription } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id, trial_start, trial_end")
      .eq("user_id", user.id)
      .single();

    // Determine if user is eligible for trial
    // Trial eligibility rules:
    // 1. Only for Pro plan (not Pro Plus or Free)
    // 2. User has never had a trial before (trial_start is null)
    // 3. User doesn't have an active subscription
    const hasHadTrial = existingSubscription?.trial_start != null;
    const isEligibleForTrial =
      input.planName === "pro" &&
      !hasHadTrial &&
      !existingSubscription;

    // Build base URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const successUrl = input.successUrl || `${baseUrl}/subscription/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = input.cancelUrl || `${baseUrl}/pricing`;

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: existingSubscription?.stripe_customer_id || undefined,
      customer_email: existingSubscription?.stripe_customer_id ? undefined : user.email,
      client_reference_id: user.id,
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      subscription_data: {
        metadata: {
          user_id: user.id,
          plan_name: input.planName,
          billing_cycle: input.billingCycle,
        },
        // 14-day trial only for first-time Pro plan subscribers
        trial_period_days: isEligibleForTrial ? 14 : undefined,
      },
      allow_promotion_codes: true,
    });

    if (!session.url) {
      return { error: "Failed to create checkout session" };
    }

    return {
      sessionId: session.id,
      url: session.url,
    };
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return { error: "Failed to create checkout session" };
  }
}

// ============================================================================
// CREATE CUSTOMER PORTAL SESSION
// ============================================================================
/**
 * Creates a Stripe Customer Portal session for managing subscriptions
 */
export async function createPortalSession(
  input: CreatePortalSessionInput = {}
): Promise<PortalSessionResult | { error: string }> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: "You must be logged in" };
    }

    // Get user's Stripe customer ID
    const { data: subscription, error: subError } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    if (subError || !subscription?.stripe_customer_id) {
      return { error: "No active subscription found" };
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const returnUrl = input.returnUrl || `${baseUrl}/dashboard/subscription`;

    // Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: returnUrl,
    });

    return {
      url: session.url,
    };
  } catch (error) {
    console.error("Error creating portal session:", error);
    return { error: "Failed to create portal session" };
  }
}

// ============================================================================
// CHECK FEATURE ACCESS
// ============================================================================
/**
 * Checks if the current user has access to a specific feature
 */
export async function checkFeatureAccess(feature: FeatureName): Promise<FeatureAccessResult> {
  try {
    const subscription = await getUserSubscription();

    if (!subscription) {
      return {
        hasAccess: false,
        reason: "No subscription found",
        currentPlan: "free",
        requiredPlan: getRequiredPlanForFeature(feature),
      };
    }

    const requiredPlan = getRequiredPlanForFeature(feature);
    const hasAccess = isPlanHigherOrEqual(subscription.planName, requiredPlan);

    return {
      hasAccess,
      reason: hasAccess ? undefined : `This feature requires ${requiredPlan} plan`,
      currentPlan: subscription.planName,
      requiredPlan: hasAccess ? undefined : requiredPlan,
    };
  } catch (error) {
    console.error("Error checking feature access:", error);
    return {
      hasAccess: false,
      reason: "Error checking access",
      currentPlan: "free",
    };
  }
}

// ============================================================================
// CHECK USAGE LIMIT
// ============================================================================
/**
 * Checks if user has remaining usage for a limited feature
 */
export async function checkUsageLimit(featureName: LimitFeatureName): Promise<UsageStatus | null> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return null;
    }

    const subscription = await getUserSubscription();
    if (!subscription) {
      return null;
    }

    const limitCount = subscription.planLimits[featureName];

    // Get current usage
    const periodStart = new Date();
    periodStart.setDate(1); // First day of current month
    periodStart.setHours(0, 0, 0, 0);

    const { data: usage } = await supabase
      .from("usage_tracking")
      .select("*")
      .eq("user_id", user.id)
      .eq("feature_name", featureName)
      .gte("period_end", new Date().toISOString())
      .single();

    const usageCount = usage?.usage_count || 0;
    const remaining = limitCount ? limitCount - usageCount : null;
    const percentage = limitCount ? Math.min((usageCount / limitCount) * 100, 100) : 0;

    return {
      featureName,
      usageCount,
      limitCount,
      remaining,
      percentage,
      isOverLimit: limitCount ? usageCount >= limitCount : false,
      periodEnd: usage?.period_end || new Date(periodStart.getFullYear(), periodStart.getMonth() + 1, 0).toISOString(),
    };
  } catch (error) {
    console.error("Error checking usage limit:", error);
    return null;
  }
}

// ============================================================================
// INCREMENT USAGE
// ============================================================================
/**
 * Increments usage counter for a feature
 */
export async function incrementUsage(
  featureName: LimitFeatureName,
  amount: number = 1
): Promise<SubscriptionActionResult> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "User not authenticated" };
    }

    // Call database function to increment usage
    const { data, error } = await supabase.rpc("increment_usage", {
      p_user_id: user.id,
      p_feature_name: featureName,
      p_increment: amount,
    });

    if (error) {
      console.error("Error incrementing usage:", error);
      return { success: false, error: "Failed to track usage" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error in incrementUsage:", error);
    return { success: false, error: "Failed to track usage" };
  }
}

// ============================================================================
// CANCEL SUBSCRIPTION
// ============================================================================
/**
 * Cancels user's subscription at the end of the current billing period
 */
export async function cancelSubscription(): Promise<SubscriptionActionResult> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "User not authenticated" };
    }

    // Get user's subscription
    const { data: subscription, error: subError } = await supabase
      .from("subscriptions")
      .select("stripe_subscription_id")
      .eq("user_id", user.id)
      .single();

    if (subError || !subscription?.stripe_subscription_id) {
      return { success: false, error: "No active subscription found" };
    }

    // Cancel at period end via Stripe
    await stripe.subscriptions.update(subscription.stripe_subscription_id, {
      cancel_at_period_end: true,
    });

    // Update in database
    await supabase
      .from("subscriptions")
      .update({ cancel_at_period_end: true })
      .eq("user_id", user.id);

    return { success: true };
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return { success: false, error: "Failed to cancel subscription" };
  }
}

// ============================================================================
// REACTIVATE SUBSCRIPTION
// ============================================================================
/**
 * Reactivates a canceled subscription before the period ends
 */
export async function reactivateSubscription(): Promise<SubscriptionActionResult> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "User not authenticated" };
    }

    // Get user's subscription
    const { data: subscription, error: subError } = await supabase
      .from("subscriptions")
      .select("stripe_subscription_id")
      .eq("user_id", user.id)
      .single();

    if (subError || !subscription?.stripe_subscription_id) {
      return { success: false, error: "No subscription found" };
    }

    // Reactivate via Stripe
    await stripe.subscriptions.update(subscription.stripe_subscription_id, {
      cancel_at_period_end: false,
    });

    // Update in database
    await supabase
      .from("subscriptions")
      .update({ cancel_at_period_end: false })
      .eq("user_id", user.id);

    return { success: true };
  } catch (error) {
    console.error("Error reactivating subscription:", error);
    return { success: false, error: "Failed to reactivate subscription" };
  }
}

// ============================================================================
// REDIRECT TO CHECKOUT
// ============================================================================
/**
 * Server action to create checkout and redirect
 */
export async function redirectToCheckout(planName: PlanName, billingCycle: BillingCycle = "monthly") {
  const result = await createCheckoutSession({
    planName,
    billingCycle,
  });

  if ("error" in result) {
    throw new Error(result.error);
  }

  redirect(result.url);
}

// ============================================================================
// REDIRECT TO PORTAL
// ============================================================================
/**
 * Server action to create portal session and redirect
 */
export async function redirectToPortal() {
  const result = await createPortalSession();

  if ("error" in result) {
    throw new Error(result.error);
  }

  redirect(result.url);
}
