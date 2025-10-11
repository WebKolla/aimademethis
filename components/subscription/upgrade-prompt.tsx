"use client";

import { motion } from "framer-motion";
import { Lock, Sparkles, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import type { PlanName } from "@/types/subscription.types";

interface UpgradePromptProps {
  title: string;
  description: string;
  requiredPlan: PlanName;
  compact?: boolean;
}

export function UpgradePrompt({ title, description, requiredPlan, compact = false }: UpgradePromptProps) {
  const planConfig = {
    pro: {
      icon: Zap,
      color: "from-emerald-500 to-teal-500",
      badge: "Pro",
      href: "/pricing",
    },
    pro_plus: {
      icon: Crown,
      color: "from-purple-500 to-pink-500",
      badge: "Pro Plus",
      href: "/pricing",
    },
    free: {
      icon: Sparkles,
      color: "from-gray-500 to-gray-600",
      badge: "Free",
      href: "/pricing",
    },
  };

  const config = planConfig[requiredPlan];
  const Icon = config.icon;

  if (compact) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-4">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${config.color}`}
        >
          <Lock className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{title}</p>
          <p className="text-xs text-slate-600 dark:text-slate-400">{description}</p>
        </div>
        <Button asChild size="sm">
          <Link href={config.href}>Upgrade</Link>
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 overflow-hidden">
        <CardContent className="p-8 sm:p-12 text-center relative">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br ${config.color} rounded-full blur-3xl`}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 space-y-6">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="inline-flex"
            >
              <div
                className={`relative p-6 rounded-2xl bg-gradient-to-br ${config.color} shadow-2xl`}
              >
                <Icon className="h-12 w-12 text-white" />
                <div className="absolute -top-2 -right-2">
                  <div className="bg-white dark:bg-slate-900 rounded-full px-3 py-1 text-xs font-bold text-slate-900 dark:text-white shadow-lg border border-slate-200 dark:border-slate-700">
                    {config.badge}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Text */}
            <div className="space-y-3">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                {description}
              </p>
            </div>

            {/* Features preview (if Pro Plus) */}
            {requiredPlan === "pro_plus" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap justify-center gap-2 pt-4"
              >
                {["Featured Placement", "API Access", "Team Collaboration"].map((feature) => (
                  <div
                    key={feature}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    <Sparkles className="h-3 w-3" />
                    {feature}
                  </div>
                ))}
              </motion.div>
            )}

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button
                asChild
                size="lg"
                className={`bg-gradient-to-r ${config.color} hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all font-bold`}
              >
                <Link href={config.href}>
                  <Sparkles className="mr-2 h-5 w-5" />
                  View Pricing Plans
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
