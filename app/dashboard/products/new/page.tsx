import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { getCategories } from "@/lib/products/actions";
import { ProductSubmissionForm } from "@/components/products/product-submission-form";
import { getUserSubscription } from "@/lib/subscription/actions";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import { ArrowLeft, AlertCircle, Crown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Add New Product | AIMadeThis",
  description: "Submit your AI-powered product to AIMadeThis",
};

export default async function NewProductPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user's subscription
  const subscription = await getUserSubscription();

  // Count user's current products
  const { count: productCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const currentProductCount = productCount ?? 0;

  // Check if user has reached their product limit
  const productLimit = subscription?.planLimits?.products ?? 3; // Free plan default: 3
  const hasReachedLimit = currentProductCount >= productLimit && subscription?.planName === "free";

  // Fetch categories
  const { categories } = await getCategories();

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="mb-4 text-gray-400 hover:text-white"
          >
            <Link href="/dashboard/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Products
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-white mb-2">Add New Product</h1>
          <p className="text-gray-400">
            Share your AI-powered product with the community. Fields marked with * are
            required.
          </p>
        </div>

        {/* Limit Reached Alert */}
        {hasReachedLimit ? (
          <div className="max-w-4xl">
            <Alert className="border-amber-500 bg-amber-500/10">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <AlertTitle className="text-amber-500 font-bold text-lg">
                Product Limit Reached
              </AlertTitle>
              <AlertDescription className="text-amber-200 mt-2 space-y-4">
                <p>
                  You&apos;ve reached the maximum of {productLimit} {productLimit === 1 ? "product" : "products"} on the Free plan.
                  Upgrade to Pro to submit unlimited products and unlock premium features!
                </p>
                <div className="flex gap-3 mt-4">
                  <Button asChild className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500">
                    <Link href="/pricing">
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade to Pro
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/dashboard/products">
                      View My Products
                    </Link>
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <>
            {/* Usage Indicator */}
            {subscription?.planName === "free" && (
              <div className="max-w-4xl mb-6">
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-300">
                      Products Used: {currentProductCount} / {productLimit}
                    </span>
                    <Link href="/pricing" className="text-sm text-emerald-400 hover:text-emerald-300 font-medium">
                      Upgrade for unlimited →
                    </Link>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all"
                      style={{ width: `${(currentProductCount / productLimit) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Form Container */}
            <div className="max-w-4xl">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 md:p-8">
                <ProductSubmissionForm categories={categories} />
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
