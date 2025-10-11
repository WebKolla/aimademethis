"use client";

import { useMemo } from "react";
import { useSubscription } from "@/components/providers/subscription-provider";
import type { FeatureName, PlanName } from "@/types/subscription.types";
import { getRequiredPlanForFeature, isPlanHigherOrEqual } from "@/types/subscription.types";

export interface UseFeatureAccessResult {
  hasAccess: boolean;
  isLoading: boolean;
  currentPlan: PlanName;
  requiredPlan: PlanName;
  reason?: string;
}

/**
 * Hook to check if the current user has access to a specific feature
 * @param feature - The feature to check access for
 * @returns Object containing access status and related information
 */
export function useFeatureAccess(feature: FeatureName): UseFeatureAccessResult {
  const { subscription, isLoading } = useSubscription();

  const result = useMemo(() => {
    if (isLoading) {
      return {
        hasAccess: false,
        isLoading: true,
        currentPlan: "free" as PlanName,
        requiredPlan: getRequiredPlanForFeature(feature),
      };
    }

    const currentPlan = subscription?.planName || "free";
    const requiredPlan = getRequiredPlanForFeature(feature);
    const hasAccess = isPlanHigherOrEqual(currentPlan, requiredPlan);

    return {
      hasAccess,
      isLoading: false,
      currentPlan,
      requiredPlan,
      reason: hasAccess ? undefined : `This feature requires ${requiredPlan} plan or higher`,
    };
  }, [feature, subscription, isLoading]);

  return result;
}

/**
 * Hook to check if user's plan is at least the specified level
 * @param minPlan - Minimum required plan
 * @returns Boolean indicating if user has the required plan or higher
 */
export function useHasPlan(minPlan: PlanName): boolean {
  const { subscription, isLoading } = useSubscription();

  return useMemo(() => {
    if (isLoading) return false;
    const currentPlan = subscription?.planName || "free";
    return isPlanHigherOrEqual(currentPlan, minPlan);
  }, [subscription, isLoading, minPlan]);
}

/**
 * Hook to check if user is on a specific plan
 * @param planName - Plan name to check
 * @returns Boolean indicating if user is on the specified plan
 */
export function useIsPlan(planName: PlanName): boolean {
  const { subscription } = useSubscription();
  return subscription?.planName === planName;
}

/**
 * Hook to check if user is on a trial
 * @returns Boolean indicating if user is on trial
 */
export function useIsTrial(): boolean {
  const { subscription } = useSubscription();
  return subscription?.isTrial || false;
}

/**
 * Hook to check if user has an active subscription (not free)
 * @returns Boolean indicating if user has paid subscription
 */
export function useHasActiveSubscription(): boolean {
  const { subscription } = useSubscription();
  return subscription !== null && subscription.planName !== "free";
}
