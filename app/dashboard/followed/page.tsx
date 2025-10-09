import { getUserFollowedProducts } from "@/lib/follows/actions";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import Link from "next/link";
import Image from "next/image";
import { Bell } from "lucide-react";

export const metadata = {
  title: "Followed Products | AIMadeThis",
  description: "Products you're following for updates",
};

export default async function FollowedProductsPage() {
  const { products } = await getUserFollowedProducts();

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Bell className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          <div>
            <h1 className="text-3xl font-bold">Followed Products</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Products you&apos;re following for updates
            </p>
          </div>
        </div>

        {/* Products List */}
        {products.length === 0 ? (
          <div className="text-center py-12 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
            <Bell className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No followed products yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Follow products to get notified about updates
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden transition-all hover:border-purple-400 dark:hover:border-purple-600 hover:shadow-lg"
              >
                {/* Product Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-900">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      <span className="text-4xl">🤖</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4 space-y-3">
                  {/* Title & Pricing */}
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 line-clamp-1">
                      {product.name}
                    </h3>
                    {product.pricing_type && (
                      <span className="inline-flex shrink-0 items-center rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-0.5 text-xs font-medium text-green-800 dark:text-green-300">
                        {product.pricing_type === "free"
                          ? "Free"
                          : product.pricing_type === "freemium"
                          ? "Freemium"
                          : product.pricing_type === "paid"
                          ? "Paid"
                          : "Subscription"}
                      </span>
                    )}
                  </div>

                  {/* Tagline */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {product.tagline}
                  </p>

                  {/* Creator */}
                  {product.profiles && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                      {product.profiles.avatar_url ? (
                        <Image
                          src={product.profiles.avatar_url}
                          alt={product.profiles.username}
                          width={20}
                          height={20}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="h-5 w-5 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-xs">
                          {product.profiles.username?.[0]?.toUpperCase() || "?"}
                        </div>
                      )}
                      <span>@{product.profiles.username}</span>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-3 text-sm text-gray-500 dark:text-gray-500">
                    {/* Category */}
                    {product.categories && (
                      <span className="inline-flex items-center gap-1">
                        <span className="text-xs">📁</span>
                        {product.categories.name}
                      </span>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1">
                        ⬆️ {product.votes_count || 0}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        💬 {product.comments_count || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
