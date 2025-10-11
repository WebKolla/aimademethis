"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSubscription } from "@/components/providers/subscription-provider";

export function SubscriptionSuccessClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const { subscription, refetch, isLoading } = useSubscription();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    // Refetch subscription to get the latest data
    const verify = async () => {
      setVerifying(true);
      // Wait a bit for webhooks to process
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await refetch();
      setVerifying(false);
    };

    verify();
  }, [refetch]);

  if (!sessionId) {
    router.push("/pricing");
    return null;
  }

  const isActivating = verifying || isLoading;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <Card className="border-2 border-emerald-500/20 shadow-2xl">
          <CardHeader className="text-center space-y-6 pt-12">
            {isActivating ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center"
              >
                <Loader2 className="h-10 w-10 text-white animate-spin" />
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center"
              >
                <CheckCircle2 className="h-10 w-10 text-white" />
              </motion.div>
            )}

            <div className="space-y-2">
              <CardTitle className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
                {isActivating ? "Activating Your Subscription" : "Welcome to Pro!"}
              </CardTitle>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                {isActivating
                  ? "We're setting up your account with all the premium features..."
                  : "Your subscription has been successfully activated"}
              </p>
            </div>

            {!isActivating && subscription && (
              <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2 text-base">
                <Sparkles className="h-4 w-4 mr-2" />
                {subscription.planDisplayName} Plan Active
              </Badge>
            )}
          </CardHeader>

          <CardContent className="space-y-8 pb-12">
            {!isActivating && subscription && (
              <>
                {/* Subscription Details */}
                <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 space-y-4">
                  <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    What's Included
                  </h3>
                  <ul className="space-y-3">
                    {subscription.planFeatures.slice(0, 5).map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300"
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="capitalize">{feature.replace(/_/g, " ")}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Trial Info */}
                {subscription.isTrial && subscription.trialEnd && (
                  <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                    <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2">
                      14-Day Free Trial Active
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Your trial ends on{" "}
                      {new Date(subscription.trialEnd).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                      . You won't be charged until then.
                    </p>
                  </div>
                )}

                {/* Next Steps */}
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    What's Next?
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Button
                      onClick={() => router.push("/dashboard")}
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white"
                    >
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => router.push("/products/new")}
                      variant="outline"
                      className="border-2"
                    >
                      Submit Your First Product
                    </Button>
                  </div>
                </div>

                {/* Support */}
                <div className="text-center pt-4 border-t border-slate-200 dark:border-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Need help getting started?{" "}
                    <a
                      href="mailto:support@aimademethis.com"
                      className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                    >
                      Contact Support
                    </a>
                  </p>
                </div>
              </>
            )}

            {isActivating && (
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <div className="animate-pulse">Processing payment</div>
                  <div className="flex gap-1">
                    <span className="animate-bounce" style={{ animationDelay: "0ms" }}>
                      .
                    </span>
                    <span className="animate-bounce" style={{ animationDelay: "150ms" }}>
                      .
                    </span>
                    <span className="animate-bounce" style={{ animationDelay: "300ms" }}>
                      .
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  This usually takes just a few seconds
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Session ID for debugging */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-4 text-center">
            <p className="text-xs text-slate-400">
              Session ID: <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{sessionId}</code>
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
