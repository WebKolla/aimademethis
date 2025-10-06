import Link from "next/link";
import Image from "next/image";
import type { Database } from "@/types/database.types";

type Product = Database["public"]["Tables"]["products"]["Row"] & {
  categories: { name: string; slug: string } | null;
};

interface UserProductsProps {
  products: Product[];
}

export function UserProducts({ products }: UserProductsProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-xl font-semibold mb-2">No products yet</h3>
        <p className="text-gray-500 dark:text-gray-400">
          This user hasn&apos;t submitted any products yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <Link key={product.id} href={`/products/${product.slug}`}>
          <div className="group h-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 transition-all hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-lg">
            {/* Product Image */}
            <div className="relative mb-3 aspect-video w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-900">
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
                  <span className="text-3xl">🤖</span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 line-clamp-1">
                  {product.name}
                </h3>
                {product.status === "draft" && (
                  <span className="inline-flex shrink-0 items-center rounded-full bg-yellow-100 dark:bg-yellow-900/30 px-2 py-0.5 text-xs font-medium text-yellow-800 dark:text-yellow-300">
                    Draft
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {product.tagline}
              </p>

              {product.categories && (
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <span>📁 {product.categories.name}</span>
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
