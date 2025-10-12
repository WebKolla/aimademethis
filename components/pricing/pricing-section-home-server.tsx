import { createClient } from "@/lib/supabase/server";
import { PricingSectionHomeClient } from "./pricing-section-home-client";

interface PlanData {
  name: string;
  displayName: string;
  price: string;
  period: string;
  description: string;
  iconName: string;
  iconColor: string;
  features: string[];
  cta: string;
  href: string;
  popular: boolean;
  badge?: string;
}

// Icon name mapping based on plan name
const iconMap: Record<string, string> = {
  free: "Zap",
  pro: "Sparkles",
  pro_plus: "Crown",
};

// Icon color mapping
const iconColorMap: Record<string, string> = {
  free: "from-slate-500 to-slate-600",
  pro: "from-emerald-500 to-teal-500",
  pro_plus: "from-yellow-400 to-orange-400",
};

// Feature name formatting helper
function formatFeatureName(feature: string): string {
  return feature
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function PricingSectionHomeServer() {
  const supabase = await createClient();

  // Fetch subscription plans from database
  const { data: dbPlans, error } = await supabase
    .from("subscription_plans")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !dbPlans) {
    console.error("Error fetching subscription plans:", error);
    // Return empty array if fetch fails
    return <PricingSectionHomeClient plans={[]} />;
  }

  // Transform database plans to component format
  const plans: PlanData[] = dbPlans.map((plan) => {
    const planName = plan.name as "free" | "pro" | "pro_plus";
    const features = (plan.features as string[]) || [];
    const limits = (plan.limits as Record<string, number>) || {};

    // Build feature list with limits
    const featureList: string[] = [];

    // Add limit-based features
    if (limits.products !== undefined) {
      if (limits.products === 0 || limits.products >= 999) {
        featureList.push("Unlimited products");
      } else {
        featureList.push(`${limits.products} product ${limits.products === 1 ? "submission" : "submissions"}`);
      }
    }

    // Add highlights limit
    if (limits.product_highlights !== undefined) {
      featureList.push(`${limits.product_highlights} product ${limits.product_highlights === 1 ? "highlight" : "highlights"}`);
    }

    // Add other limits
    if (limits.api_calls_daily) {
      featureList.push(`API access (${limits.api_calls_daily.toLocaleString()} calls/day)`);
    }
    if (limits.team_members) {
      featureList.push(`Team collaboration (${limits.team_members} members)`);
    }
    if (limits.featured_products_monthly) {
      featureList.push(`${limits.featured_products_monthly} featured product${limits.featured_products_monthly === 1 ? "" : "s"}/month`);
    }

    // Add text features
    features.forEach((feature) => {
      featureList.push(formatFeatureName(feature));
    });

    // Determine pricing display
    const priceMonthly = Number(plan.price_monthly);
    const priceDisplay = priceMonthly === 0 ? "$0" : `$${priceMonthly}`;
    const period = priceMonthly === 0 ? "forever" : "/month";

    // Determine CTA
    let cta = "Get Started";
    if (planName === "free") {
      cta = "Get Started Free";
    } else if (planName === "pro") {
      cta = "Start 14-Day Trial";
    } else {
      cta = `Go ${plan.display_name}`;
    }

    // Determine href
    const href = planName === "free" ? "/signup" : "/pricing";

    return {
      name: plan.name,
      displayName: plan.display_name,
      price: priceDisplay,
      period,
      description: plan.description || "",
      iconName: iconMap[planName] || "Sparkles",
      iconColor: iconColorMap[planName] || "from-emerald-500 to-teal-500",
      features: featureList,
      cta,
      href,
      popular: planName === "pro", // Pro is most popular
      badge: planName === "pro" ? "Most Popular" : undefined,
    };
  });

  return <PricingSectionHomeClient plans={plans} />;
}
