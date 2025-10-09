import { createClient } from "@/lib/supabase/server";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Package, TrendingUp, Eye, Plus } from "lucide-react";
import { getActivityFeed } from "@/lib/activity/actions";
import { ActivityFeed } from "@/components/activity/activity-feed";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

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

  // Get total votes
  let totalVotes = 0;
  if (products && products.length > 0) {
    const productIds = products.map((p) => p.id);
    const { count } = await supabase
      .from("votes")
      .select("id", { count: "exact", head: true })
      .in("product_id", productIds);
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
