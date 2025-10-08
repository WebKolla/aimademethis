import { getUserBookmarks } from "@/lib/bookmarks/actions";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import Link from "next/link";
import Image from "next/image";
import { BookmarkIcon } from "lucide-react";
import type { Database } from "@/types/database.types";

export const metadata = {
  title: "My Bookmarks | AIMadeThis",
  description: "View your bookmarked AI products",
};

type Product = Database["public"]["Tables"]["products"]["Row"] & {
  categories: { name: string; slug: string } | null;
  profiles: { username: string; avatar_url: string | null } | null;
};

export default async function BookmarksPage() {
  const { bookmarks } = await getUserBookmarks();

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <BookmarkIcon className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          <div>
            <h1 className="text-3xl font-bold">My Bookmarks</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Products you&apos;ve saved for later
            </p>
          </div>
        </div>

        {/* Bookmarks List */}
        {bookmarks.length === 0 ? (
          <div className="text-center py-12 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
            <BookmarkIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No bookmarks yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Start bookmarking products to save them for later
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bookmarks.map((bookmark) => {
              const product = bookmark.products as unknown as Product;
              if (!product) return null;

              return (
                <Link
                  key={bookmark.id}
                  href={`/products/${product.slug}`}
                  className="group rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden transition-all hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-lg"
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
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 line-clamp-1">
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

                    {/* Metadata */}
                    <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-3 text-sm text-gray-500 dark:text-gray-500">
                      {/* Category */}
                      {product.categories && (
                        <span className="inline-flex items-center gap-1">
                          <span className="text-xs">📁</span>
                          {product.categories.name}
                        </span>
                      )}

                      {/* Upvotes */}
                      <span className="inline-flex items-center gap-1">
                        ⬆️ {product.upvotes_count || 0}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
