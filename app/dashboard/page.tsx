import { createClient } from "@/lib/supabase/server";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Package, TrendingUp, Eye, Plus, Award, Sparkles, ArrowRight } from "lucide-react";
import { getActivityFeed } from "@/lib/activity/actions";
import { ActivityFeed } from "@/components/activity/activity-feed";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Get user subscription tier
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select(`
      status,
      plan_id,
      subscription_plans!inner(name)
    `)
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  let userTier: "free" | "pro" | "pro_plus" = "free";
  if (subscription?.subscription_plans) {
    const planName = (subscription.subscription_plans as { name: string }).name;
    userTier = planName === "pro_plus" ? "pro_plus" : planName === "pro" ? "pro" : "free";
  }

  // Get user's product statistics
  const { data: products } = await supabase
    .from("products")
    .select("id, name, status, views_count, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  // Get total stats
  const { count: totalProducts } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { count: publishedProducts } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "published");

  const { count: draftProducts } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "draft");

  // Get total votes across ALL user products (not just recent 5)
  let totalVotes = 0;
  // First get all product IDs
  const { data: allProducts } = await supabase
    .from("products")
    .select("id")
    .eq("user_id", user.id);

  if (allProducts && allProducts.length > 0) {
    const productIds = allProducts.map((p) => p.id);
    const { count } = await supabase
      .from("votes")
      .select("id", { count: "exact", head: true })
      .in("product_id", productIds)
      .eq("vote_type", "upvote"); // Only count upvotes
    totalVotes = count || 0;
  }

  // Get activity feed from followed users
  const { activities } = await getActivityFeed(10);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">
            Welcome back! Here&apos;s an overview of your products.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-600/10 rounded-lg">
                <Package className="h-6 w-6 text-purple-500" />
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-1">Total Products</p>
            <p className="text-3xl font-bold text-white">{totalProducts || 0}</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-600/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-1">Published</p>
            <p className="text-3xl font-bold text-white">{publishedProducts || 0}</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-yellow-600/10 rounded-lg">
                <Eye className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-1">Total Votes</p>
            <p className="text-3xl font-bold text-white">{totalVotes}</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-600/10 rounded-lg">
                <Package className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-1">Drafts</p>
            <p className="text-3xl font-bold text-white">{draftProducts || 0}</p>
          </div>
        </div>

        {/* Badge Feature Callout - Pro/Pro Plus only */}
        {userTier !== "free" && publishedProducts && publishedProducts > 0 && (
          <div className="bg-gradient-to-r from-emerald-600/10 to-teal-600/10 border border-emerald-600/30 rounded-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-600/20 rounded-lg">
                  <Award className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-white">Generate Product Badges</h3>
                    <Badge variant="secondary" className="bg-emerald-600/20 text-emerald-400 border-emerald-600/30">
                      <Sparkles className="h-3 w-3 mr-1" />
                      {userTier === "pro_plus" ? "Pro Plus" : "Pro"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-300 max-w-2xl">
                    Create beautiful, embeddable badges for your products. Share them on your website, README files, or anywhere you want to showcase your AI creations. Track clicks and see where your traffic comes from.
                  </p>
                </div>
              </div>
              <Button asChild className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 flex-shrink-0">
                <Link href="/dashboard/badges">
                  Create Badge
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 md:p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <Link href="/dashboard/products/new">
                <Plus className="h-4 w-4 mr-2" />
                Add New Product
              </Link>
            </Button>
            <Button variant="outline" asChild className="border-gray-700 text-gray-300 hover:bg-gray-800">
              <Link href="/dashboard/products">
                View All Products
              </Link>
            </Button>
          </div>
        </div>

        {/* Recent Products */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 md:p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Products</h2>
          {products && products.length > 0 ? (
            <div className="space-y-3">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/dashboard/products/${product.id}/edit`}
                  className="flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <div>
                    <h3 className="font-medium text-white">{product.name}</h3>
                    <p className="text-sm text-gray-400">
                      {product.created_at ? new Date(product.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        product.status === "published"
                          ? "bg-green-600/20 text-green-400"
                          : "bg-yellow-600/20 text-yellow-400"
                      }`}
                    >
                      {product.status}
                    </span>
                    <span className="text-sm text-gray-400">
                      {product.views_count || 0} views
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No products yet</p>
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                <Link href="/dashboard/products/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Product
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 md:p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
          <ActivityFeed activities={activities || []} />
        </div>
      </div>
    </DashboardLayout>
  );
}
