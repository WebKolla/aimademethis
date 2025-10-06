import { createClient } from "@/lib/supabase/server";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Edit, Eye, ExternalLink } from "lucide-react";
import Image from "next/image";

export default async function MyProductsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Get all user's products with stats
  const { data: products } = await supabase
    .from("products")
    .select(`
      *,
      categories (name, slug)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Get vote counts for each product
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

      return {
        ...product,
        votes_count: voteCount || 0,
        comments_count: commentCount || 0,
      };
    })
  );

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Products</h1>
            <p className="text-gray-400">
              Manage and edit your AI-generated products
            </p>
          </div>
          <Button asChild className="bg-purple-600 hover:bg-purple-700">
            <Link href="/dashboard/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Add New Product
            </Link>
          </Button>
        </div>

        {/* Products Grid */}
        {productsWithStats && productsWithStats.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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

                  {/* Actions */}
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
              <Button asChild className="bg-purple-600 hover:bg-purple-700">
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
