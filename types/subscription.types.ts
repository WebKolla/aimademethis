import type { Database } from "./database.types";

// ============================================================================
// DATABASE TYPES (from Supabase)
// ============================================================================
export type SubscriptionPlan = Database["public"]["Tables"]["subscription_plans"]["Row"];
export type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];
export type SubscriptionTransaction = Database["public"]["Tables"]["subscription_transactions"]["Row"];
export type UsageTracking = Database["public"]["Tables"]["usage_tracking"]["Row"];

// ============================================================================
// PLAN NAMES (must match database)
// ============================================================================
export type PlanName = "free" | "pro" | "pro_plus";
export type BillingCycle = "monthly" | "yearly";
export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "past_due"
  | "trialing"
  | "incomplete"
  | "incomplete_expired"
  | "unpaid";

// ============================================================================
// FEATURE NAMES
// ============================================================================
// Features included in plans (as array in subscription_plans.features)
export type FeatureName =
  // Free
  | "product_submissions"
  | "discovery"
  | "search"
  | "voting"
  | "bookmarks"
  | "comments"
  | "basic_profile"
  | "community_features"
  // Pro
  | "unlimited_products"
  | "analytics"
  | "priority_ranking"
  | "verified_badge"
  | "early_access"
  | "email_support"
  | "remove_branding"
  // Pro Plus
  | "featured_placement"
  | "custom_url"
  | "api_access"
  | "team_collaboration"
  | "white_label"
  | "priority_support"
  | "advanced_seo"
  | "custom_badges";

// Usage limits (tracked features)
export type LimitFeatureName = "products" | "product_highlights" | "api_calls_daily" | "team_members" | "featured_products_monthly";

// ============================================================================
// ENHANCED SUBSCRIPTION DATA
// ============================================================================
export interface UserSubscription {
  subscriptionId: string | null;
  userId: string;
  planId: string;
  planName: PlanName;
  planDisplayName: string;
  planFeatures: FeatureName[];
  planLimits: Record<LimitFeatureName, number>;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  trialEnd: string | null;
  isTrial: boolean;
}

// ============================================================================
// USAGE TRACKING
// ============================================================================
export interface UsageStatus {
  featureName: LimitFeatureName;
  usageCount: number;
  limitCount: number | null; // null = unlimited
  remaining: number | null; // null = unlimited
  percentage: number; // 0-100
  isOverLimit: boolean;
  periodEnd: string;
}

// ============================================================================
// PRICING CONFIGURATION
// ============================================================================
export interface PricingTier {
  name: PlanName;
  displayName: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[]; // Human-readable feature list
  limits: Record<string, number | string>; // Display format: {"Products": 3, "Highlights": 1}
  popular?: boolean;
  badge?: string;
  cta: string;
}

// ============================================================================
// CHECKOUT SESSION
// ============================================================================
export interface CreateCheckoutSessionInput {
  planName: PlanName;
  billingCycle: BillingCycle;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CheckoutSessionResult {
  sessionId: string;
  url: string;
}

// ============================================================================
// CUSTOMER PORTAL
// ============================================================================
export interface CreatePortalSessionInput {
  returnUrl?: string;
}

export interface PortalSessionResult {
  url: string;
}

// ============================================================================
// FEATURE ACCESS
// ============================================================================
export interface FeatureAccessResult {
  hasAccess: boolean;
  reason?: string; // Why access was denied
  currentPlan: PlanName;
  requiredPlan?: PlanName;
}

// ============================================================================
// SUBSCRIPTION ACTIONS RESULT
// ============================================================================
export interface SubscriptionActionResult {
  success: boolean;
  error?: string;
  data?: unknown;
}

// ============================================================================
// STRIPE WEBHOOKS
// ============================================================================
export type StripeWebhookEvent =
  | "customer.subscription.created"
  | "customer.subscription.updated"
  | "customer.subscription.deleted"
  | "customer.subscription.trial_will_end"
  | "invoice.payment_succeeded"
  | "invoice.payment_failed"
  | "invoice.upcoming"
  | "charge.succeeded"
  | "charge.failed";

export interface WebhookProcessResult {
  received: boolean;
  processed: boolean;
  error?: string;
}

// ============================================================================
// PLAN COMPARISON
// ============================================================================
export const PLAN_HIERARCHY: Record<PlanName, number> = {
  free: 0,
  pro: 1,
  pro_plus: 2,
};

export function isPlanHigherOrEqual(currentPlan: PlanName, requiredPlan: PlanName): boolean {
  return PLAN_HIERARCHY[currentPlan] >= PLAN_HIERARCHY[requiredPlan];
}

export function getRequiredPlanForFeature(feature: FeatureName): PlanName {
  // Free features
  const freeFeatures: FeatureName[] = [
    "product_submissions",
    "discovery",
    "search",
    "voting",
    "bookmarks",
    "comments",
    "basic_profile",
    "community_features",
  ];

  // Pro features
  const proFeatures: FeatureName[] = [
    "unlimited_products",
    "analytics",
    "priority_ranking",
    "verified_badge",
    "early_access",
    "email_support",
    "remove_branding",
  ];

  // Pro Plus features (everything else)
  if (freeFeatures.includes(feature)) return "free";
  if (proFeatures.includes(feature)) return "pro";
  return "pro_plus";
}

// ============================================================================
// PRICING DISPLAY CONFIG (for pricing page)
// ============================================================================
export const PRICING_TIERS: PricingTier[] = [
  {
    name: "free",
    displayName: "Basic",
    description: "Perfect for getting started with AI product discovery",
    priceMonthly: 0,
    priceYearly: 0,
    features: [
      "Up to 3 product submissions",
      "Full discovery & search access",
      "Vote, bookmark & comment",
      "Basic profile (1 highlight)",
      "Community features",
      "Standard listing position",
    ],
    limits: {
      Products: 3,
      Highlights: 1,
    },
    cta: "Get Started",
  },
  {
    name: "pro",
    displayName: "Pro",
    description: "For creators who want to showcase more products with advanced features",
    priceMonthly: 6.99,
    priceYearly: 70,
    features: [
      "All from Basic, and",
      "Everything in Basic, plus:",
      "10 product submissions",
      "Advanced analytics dashboard",
      "Priority product ranking",
      "Profile with 5 highlights",
      "Verified creator badge",
      "Early access to new features",
    ],
    limits: {
      Products: 10,
      Highlights: 5,
    },
    popular: true,
    badge: "Most Popular",
    cta: "Upgrade to Pro",
  },
  {
    name: "pro_plus",
    displayName: "Pro Plus",
    description: "Premium features for serious creators and power users",
    priceMonthly: 16.99,
    priceYearly: 170,
    features: [
      "All from Pro, and",
      "Everything in Pro, plus:",
      "Unlimited product submissions",
      "1 featured product placement per month",
      "Priority support",
      "Advanced SEO tools",
      "Custom profile badges",
      "Featured in newsletter",
    ],
    limits: {
      Products: "Unlimited",
      Highlights: "Unlimited",
      "Featured Products": "1/month",
    },
    badge: "Best Value",
    cta: "Upgrade to Pro Plus",
  },
];
