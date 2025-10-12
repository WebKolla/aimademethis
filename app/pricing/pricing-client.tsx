"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Sparkles, Zap, Crown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PRICING_TIERS } from "@/types/subscription.types";
import type { BillingCycle } from "@/types/subscription.types";
import { redirectToCheckout } from "@/lib/subscription/actions";
import { useSubscription } from "@/components/providers/subscription-provider";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function PricingPageClient() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [isPending, startTransition] = useTransition();
  const { subscription, isLoading } = useSubscription();

  const handleUpgrade = (planName: "free" | "pro" | "pro_plus") => {
    if (planName === "free") {
      toast.info("You're already on the free plan!");
      return;
    }

    // Check if user is authenticated
    if (!subscription && !isLoading) {
      toast.error("Please sign in to upgrade your plan");
      router.push("/login?redirect=/pricing");
      return;
    }

    if (subscription?.planName === planName) {
      toast.info("You're already on this plan!");
      return;
    }

    startTransition(async () => {
      try {
        await redirectToCheckout(planName, billingCycle);
      } catch (error) {
        toast.error("Failed to start checkout. Please try again.");
        console.error(error);
      }
    });
  };

  const yearlyDiscount = (monthly: number, yearly: number) => {
    if (monthly === 0) return 0;
    const monthlyCost = monthly * 12;
    const savings = monthlyCost - yearly;
    return Math.round((savings / monthlyCost) * 100);
  };

  // Calculate the maximum savings across all paid plans
  const maxYearlySavings = Math.max(
    ...PRICING_TIERS.filter((tier) => tier.priceMonthly > 0).map((tier) =>
      yearlyDiscount(tier.priceMonthly, tier.priceYearly)
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 max-w-3xl mx-auto"
        >
          <Badge className="px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <Sparkles className="h-4 w-4 mr-2" />
            Simple, Transparent Pricing
          </Badge>

          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
            Choose Your Perfect Plan
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Start for free, upgrade as you grow. No hidden fees, cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 pt-8">
            <span
              className={cn(
                "text-sm font-medium transition-colors",
                billingCycle === "monthly"
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-500 dark:text-slate-400"
              )}
            >
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
              className={cn(
                "relative w-14 h-7 rounded-full transition-colors",
                billingCycle === "yearly"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                  : "bg-slate-200 dark:bg-slate-700"
              )}
            >
              <motion.div
                className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
                initial={false}
                animate={{
                  left: billingCycle === "yearly" ? "calc(100% - 1.5rem)" : "0.25rem",
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span
              className={cn(
                "text-sm font-medium transition-colors",
                billingCycle === "yearly"
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-500 dark:text-slate-400"
              )}
            >
              Yearly
            </span>
            {billingCycle === "yearly" && maxYearlySavings > 0 && (
              <Badge className="bg-emerald-500 text-white">
                Save up to {maxYearlySavings}%
              </Badge>
            )}
          </div>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 pb-24">
        <div className="grid gap-8 lg:grid-cols-3 lg:gap-8 max-w-7xl mx-auto">
          {PRICING_TIERS.map((tier, index) => {
            const isCurrentPlan = subscription?.planName === tier.name;
            const price = billingCycle === "yearly" ? tier.priceYearly : tier.priceMonthly;
            const savings = yearlyDiscount(tier.priceMonthly, tier.priceYearly);

            const icons = {
              free: Sparkles,
              pro: Zap,
              pro_plus: Crown,
            };
            const Icon = icons[tier.name];

            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={cn(
                  "relative",
                  tier.popular && "lg:-mt-4"
                )}
              >
                <Card
                  className={cn(
                    "relative overflow-hidden border-2 transition-all duration-300 hover:shadow-2xl",
                    tier.popular
                      ? "border-emerald-500 shadow-xl"
                      : "border-slate-200 dark:border-slate-800",
                    isCurrentPlan && "ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-950"
                  )}
                >
                  {/* Popular Badge */}
                  {tier.popular && (
                    <div className="absolute top-0 right-0 left-0 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-center py-2 text-sm font-bold">
                      {tier.badge}
                    </div>
                  )}

                  {/* Current Plan Badge */}
                  {isCurrentPlan && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-emerald-500 text-white">Current Plan</Badge>
                    </div>
                  )}

                  <CardHeader className={cn("space-y-4", tier.popular && "pt-12")}>
                    {/* Icon */}
                    <div
                      className={cn(
                        "inline-flex p-3 rounded-xl",
                        tier.name === "free" && "bg-slate-100 dark:bg-slate-800",
                        tier.name === "pro" &&
                          "bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg",
                        tier.name === "pro_plus" &&
                          "bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-6 w-6",
                          tier.name === "free"
                            ? "text-slate-600 dark:text-slate-400"
                            : "text-white"
                        )}
                      />
                    </div>

                    {/* Plan Name */}
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                        {tier.displayName}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                        {tier.description}
                      </p>
                    </div>

                    {/* Pricing */}
                    <div className="pt-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black text-slate-900 dark:text-white">
                          ${price}
                        </span>
                        {price > 0 && (
                          <span className="text-slate-600 dark:text-slate-400">
                            /{billingCycle === "yearly" ? "year" : "month"}
                          </span>
                        )}
                      </div>
                      {billingCycle === "yearly" && savings > 0 && (
                        <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
                          Save {savings}% vs monthly
                        </p>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Features List */}
                    <ul className="space-y-3">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-700 dark:text-slate-300">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter>
                    <Button
                      onClick={() => handleUpgrade(tier.name)}
                      disabled={isPending || isCurrentPlan}
                      className={cn(
                        "w-full h-12 text-base font-bold",
                        tier.popular
                          ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg"
                          : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100"
                      )}
                    >
                      {isCurrentPlan ? (
                        "Current Plan"
                      ) : tier.name === "free" ? (
                        "Get Started"
                      ) : (
                        <>
                          {tier.cta}
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-24 text-center space-y-4"
        >
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">
            Questions? We`ve got answers.
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Need help choosing a plan? Contact us at
            <a
              href="mailto:support@aimademethis.com"
              className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
            >
              <p>support@aimademethis.com</p>
            </a>
          </p>
        </motion.div>
      </section>
    </div>
  );
}
