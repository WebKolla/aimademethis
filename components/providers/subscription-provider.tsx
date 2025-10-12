"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { UserSubscription } from "@/types/subscription.types";

interface SubscriptionContextType {
  subscription: UserSubscription | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setSubscription(null);
        return;
      }

      // Call the database function
      const { data, error: rpcError } = await supabase.rpc("get_user_subscription", {
        p_user_id: user.id,
      });

      if (rpcError) {
        console.error("Error fetching subscription:", rpcError);
        setError("Failed to load subscription");
        return;
      }

      if (!data || data.length === 0) {
        setSubscription(null);
        return;
      }

      const sub = data[0];
      setSubscription({
        subscriptionId: sub.subscription_id,
        userId: sub.user_id,
        planId: sub.plan_id,
        planName: sub.plan_name as "free" | "pro" | "pro_plus",
        planDisplayName: sub.plan_display_name,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        planFeatures: sub.plan_features as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        planLimits: sub.plan_limits as any,
        status: sub.status as "active" | "canceled" | "past_due" | "trialing" | "incomplete" | "incomplete_expired" | "unpaid",
        billingCycle: sub.billing_cycle as "monthly" | "yearly",
        currentPeriodEnd: sub.current_period_end,
        cancelAtPeriodEnd: sub.cancel_at_period_end,
        trialEnd: sub.trial_end,
        isTrial: sub.is_trial,
      });
    } catch (err) {
      console.error("Error in fetchSubscription:", err);
      setError("Failed to load subscription");
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty deps - function is stable

  useEffect(() => {
    fetchSubscription();

    // Set up real-time subscription updates
    const supabase = createClient();

    const channel = supabase
      .channel("subscription-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "subscriptions",
        },
        () => {
          fetchSubscription();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchSubscription]);

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        isLoading,
        error,
        refetch: fetchSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
}
