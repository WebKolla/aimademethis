"use client";

import { useFeatureAccess } from "@/hooks/use-feature-access";
import type { FeatureName } from "@/types/subscription.types";
import { UpgradePrompt } from "./upgrade-prompt";

interface FeatureGateProps {
  feature: FeatureName;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgradePrompt?: boolean;
  loadingFallback?: React.ReactNode;
}

/**
 * Component that conditionally renders children based on feature access
 * Shows upgrade prompt if user doesn't have access
 */
export function FeatureGate({
  feature,
  children,
  fallback,
  showUpgradePrompt = true,
  loadingFallback,
}: FeatureGateProps) {
  const { hasAccess, isLoading, requiredPlan, reason } = useFeatureAccess(feature);

  if (isLoading) {
    return loadingFallback ? <>{loadingFallback}</> : null;
  }

  if (!hasAccess) {
    if (showUpgradePrompt) {
      return (
        <UpgradePrompt
          title={`Upgrade to ${requiredPlan === "pro" ? "Pro" : "Pro Plus"}`}
          description={reason || `This feature requires ${requiredPlan} plan`}
          requiredPlan={requiredPlan}
        />
      );
    }

    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}
