import { createClient } from "@/lib/supabase/server";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Plus, Edit, Eye, ExternalLink, Award, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default async function MyProductsPage() {
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

  // Get all user's products with stats
  const { data: products } = await supabase
    .from("products")
    .select(`
      *,
      categories (name, slug)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Get vote counts and badge clicks for each product
  const productsWithStats = await Promise.all(
    (products || []).map(async (product) => {
      const { count: voteCount } = await supabase
        .from("votes")
        .select("id", { count: "exact", head: true })
        .eq("product_id", product.id);

      const { count: commentCount } = await supabase
        .from("comments")
        .select("id", { count: "exact", head: true })
        .eq("product_id", product.id);

      const { count: badgeClickCount } = await supabase
        .from("badge_clicks")
        .select("id", { count: "exact", head: true })
        .eq("product_id", product.id);

      return {
        ...product,
        votes_count: voteCount || 0,
        comments_count: commentCount || 0,
        badge_clicks_count: badgeClickCount || 0,
      };
    })
  );

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Products</h1>
            <p className="text-gray-400">
              Manage and edit your AI-generated products
            </p>
          </div>
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
            <Link href="/dashboard/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Add New Product
            </Link>
          </Button>
        </div>

        {/* Products Grid */}
        {productsWithStats && productsWithStats.length > 0 ? (
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {productsWithStats.map((product) => (
              <div
                key={product.id}
                className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-purple-600 transition-colors"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-gray-800">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-600">
                      <Eye className="h-12 w-12" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        product.status === "published"
                          ? "bg-green-600 text-white"
                          : "bg-yellow-600 text-white"
                      }`}
                    >
                      {product.status}
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-white mb-2 truncate">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                    {product.tagline}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {product.views_count || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      ▲ {product.votes_count}
                    </span>
                    <span className="flex items-center gap-1">
                      💬 {product.comments_count}
                    </span>
                  </div>

                  {/* Badge Status */}
                  {product.status === "published" && userTier !== "free" && product.badge_clicks_count > 0 && (
                    <div className="mb-3">
                      <Badge variant="secondary" className="text-xs">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Badge Active ({product.badge_clicks_count} clicks)
                      </Badge>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                        asChild
                      >
                        <Link href={`/dashboard/products/${product.id}/edit`}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Link>
                      </Button>
                      {product.status === "published" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-700 text-gray-300 hover:bg-gray-800"
                          asChild
                        >
                          <Link href={`/products/${product.slug}`} target="_blank">
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                    </div>
                    {/* Get Badge Button */}
                    {product.status === "published" && (
                      <Button
                        size="sm"
                        variant={userTier === "free" ? "outline" : "default"}
                        className={
                          userTier === "free"
                            ? "w-full border-gray-700 text-gray-300 hover:bg-gray-800"
                            : "w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                        }
                        asChild
                      >
                        <Link href={`/dashboard/badges?product=${product.slug}`}>
                          <Award className="h-4 w-4 mr-1" />
                          {userTier === "free" ? "Get Badge (Pro)" : "Get Badge"}
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="h-24 w-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plus className="h-12 w-12 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No products yet
              </h3>
              <p className="text-gray-400 mb-6">
                Start by adding your first AI-generated product to showcase your work
              </p>
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                <Link href="/dashboard/products/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Product
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
