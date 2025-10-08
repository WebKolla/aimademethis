import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { getFollowingFeed, getUserFollowing } from "@/lib/follows/actions";
import Link from "next/link";
import Image from "next/image";
import { Users, Eye, MessageSquare, ArrowUp, Sparkles } from "lucide-react";
import type { Database } from "@/types/database.types";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Following Feed | AIMadeThis Dashboard",
  description: "View products from creators you follow",
};

type Product = Database["public"]["Tables"]["products"]["Row"] & {
  categories: { name: string; slug: string } | null;
  profiles: { username: string; avatar_url: string | null; full_name: string | null } | null;
  votes_count: number;
  comments_count: number;
};

export default async function FollowingFeedPage({
  searchParams,
}: {
  searchParams: { sort?: string };
}) {
  const sortBy = (searchParams.sort as "newest" | "trending") || "newest";
  const { products } = await getFollowingFeed(sortBy);
  const { following } = await getUserFollowing();

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                <Users className="h-8 w-8 text-emerald-500" />
                Following Feed
              </h1>
              <p className="text-gray-400">
                Discover products from {following.length} creator{following.length !== 1 ? "s" : ""} you follow
              </p>
            </div>

            {/* Sort Options */}
            <div className="flex gap-2">
              <Link
                href="/dashboard/following?sort=newest"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === "newest"
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                Newest
              </Link>
              <Link
                href="/dashboard/following?sort=trending"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === "trending"
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                <Sparkles className="inline h-4 w-4 mr-1" />
                Trending
              </Link>
            </div>
          </div>
        </div>

        {/* Products Feed */}
        {products.length > 0 ? (
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product: Product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group rounded-lg border border-gray-800 bg-gray-900 overflow-hidden hover:border-emerald-600 transition-all hover:shadow-lg hover:shadow-emerald-900/20"
              >
                {/* Product Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-gray-800">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-600">
                      <span className="text-4xl">🤖</span>
                    </div>
                  )}
                  {product.pricing_type && (
                    <div className="absolute top-2 right-2">
                      <span className="inline-flex items-center rounded-full bg-green-600 px-2.5 py-0.5 text-xs font-medium text-white">
                        {product.pricing_type === "free"
                          ? "Free"
                          : product.pricing_type === "freemium"
                          ? "Freemium"
                          : product.pricing_type === "paid"
                          ? "Paid"
                          : "Subscription"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4 space-y-3">
                  {/* Creator Info */}
                  {product.profiles && (
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xs font-semibold">
                        {product.profiles.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs text-gray-400">
                        by @{product.profiles.username}
                      </span>
                    </div>
                  )}

                  {/* Title & Category */}
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 line-clamp-1 mb-1">
                      {product.name}
                    </h3>
                    {product.categories && (
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                        <span>📁</span>
                        {product.categories.name}
                      </span>
                    )}
                  </div>

                  {/* Tagline */}
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {product.tagline}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <ArrowUp className="h-3 w-3" />
                      {product.votes_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {product.comments_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {product.views_count || 0}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          // Empty State
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="h-24 w-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-12 w-12 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {following.length === 0 ? "Not following anyone yet" : "No products yet"}
              </h3>
              <p className="text-gray-400 mb-6">
                {following.length === 0
                  ? "Start following creators to see their products here. Discover amazing AI products from talented creators."
                  : "The creators you follow haven't posted any products yet. Check back soon!"}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                  <Link href="/products">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Discover Products
                  </Link>
                </Button>
                {following.length > 0 && (
                  <Button variant="outline" asChild className="border-gray-700 text-gray-300 hover:bg-gray-800">
                    <Link href="/products">
                      Find More Creators
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
