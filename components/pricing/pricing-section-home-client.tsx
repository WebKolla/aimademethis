"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Crown, Zap } from "lucide-react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

// Icon mapping for pricing plans
const iconComponents: Record<string, LucideIcon> = {
  Zap: Zap,
  Sparkles: Sparkles,
  Crown: Crown,
};

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

interface PricingSectionHomeClientProps {
  plans: PlanData[];
}

export function PricingSectionHomeClient({ plans }: PricingSectionHomeClientProps) {
  if (plans.length === 0) {
    return null;
  }

  // Transform plans to include icon components
  const plansWithIcons = plans.map(plan => ({
    ...plan,
    icon: iconComponents[plan.iconName] || Sparkles,
  }));

  return (
    <section id="pricing" className="py-24 md:py-32 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-48 -right-48 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [180, 0, 180],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-48 -left-48 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={container}
          className="space-y-16"
        >
          {/* Header */}
          <motion.div variants={item} className="text-center space-y-6 max-w-3xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-black tracking-tight text-gray-900 dark:text-white">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Start free, upgrade as you grow. No hidden fees, cancel anytime.
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plansWithIcons.map((plan) => (
              <motion.div
                key={plan.name}
                variants={item}
                whileHover={{ scale: 1.02, y: -5 }}
                className={cn(
                  "relative p-8 rounded-3xl transition-all duration-300",
                  plan.popular
                    ? "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-2 border-emerald-500 shadow-2xl shadow-emerald-500/20"
                    : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl hover:shadow-2xl"
                )}
              >
                {/* Popular Badge */}
                {plan.popular && plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-bold shadow-lg">
                      <Sparkles className="h-3.5 w-3.5" />
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Icon & Name */}
                  <div className="space-y-4">
                    <div
                      className={cn(
                        "inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br shadow-lg",
                        plan.iconColor
                      )}
                    >
                      <plan.icon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                        {plan.displayName}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                        {plan.description}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-slate-900 dark:text-white">
                      {plan.price}
                    </span>
                    <span className="text-lg text-slate-600 dark:text-slate-400">
                      {plan.period}
                    </span>
                  </div>

                  {/* CTA Button */}
                  <Button
                    asChild
                    size="lg"
                    className={cn(
                      "w-full font-semibold text-base py-6",
                      plan.popular
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg"
                        : "bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900"
                    )}
                  >
                    <Link href={plan.href}>{plan.cta}</Link>
                  </Button>

                  {/* Features */}
                  <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check
                            className={cn(
                              "h-5 w-5 shrink-0 mt-0.5",
                              plan.popular
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-slate-600 dark:text-slate-400"
                            )}
                          />
                          <span className="text-sm text-slate-700 dark:text-slate-300">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div variants={item} className="text-center pt-8">
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Need a custom plan for your team or enterprise?
            </p>
            <Button variant="outline" size="lg" asChild>
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
