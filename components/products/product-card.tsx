import Link from "next/link";
import Image from "next/image";
import { ArrowUpIcon, MessageCircleIcon } from "lucide-react";
import type { Database } from "@/types/database.types";

type Product = Database["public"]["Tables"]["products"]["Row"] & {
  categories: { name: string; slug: string } | null;
  profiles: { username: string; avatar_url: string | null } | null;
  votes_count?: number;
  comments_count?: number;
};

interface ProductCardProps {
  product: Product;
  showVotes?: boolean;
}

export function ProductCard({ product, showVotes = true }: ProductCardProps) {
  const {
    slug,
    name,
    tagline,
    image_url,
    pricing_type,
    categories,
    profiles,
    votes_count = 0,
    comments_count = 0,
  } = product;

  return (
    <Link href={`/products/${slug}`}>
      <div className="group h-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 transition-all hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-lg">
        {/* Product Image */}
        <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-900">
          {image_url ? (
            <Image
              src={image_url}
              alt={name}
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
        <div className="space-y-3">
          {/* Title & Pricing */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 line-clamp-1">
              {name}
            </h3>
            {pricing_type && (
              <span className="inline-flex shrink-0 items-center rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-0.5 text-xs font-medium text-green-800 dark:text-green-300">
                {pricing_type === "free"
                  ? "Free"
                  : pricing_type === "freemium"
                  ? "Freemium"
                  : pricing_type === "paid"
                  ? "Paid"
                  : "Subscription"}
              </span>
            )}
          </div>

          {/* Tagline */}
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{tagline}</p>

          {/* Metadata */}
          <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-3 text-sm text-gray-500 dark:text-gray-500">
            {/* Category */}
            {categories && (
              <span className="inline-flex items-center gap-1">
                <span className="text-xs">📁</span>
                {categories.name}
              </span>
            )}

            {/* Stats */}
            <div className="flex items-center gap-3">
              {showVotes && (
                <span className="inline-flex items-center gap-1">
                  <ArrowUpIcon className="h-4 w-4" />
                  {votes_count}
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                <MessageCircleIcon className="h-4 w-4" />
                {comments_count}
              </span>
            </div>
          </div>

          {/* Creator */}
          {profiles && (
            <div className="flex items-center gap-2 border-t border-gray-100 dark:border-gray-800 pt-3">
              {profiles.avatar_url ? (
                <Image
                  src={profiles.avatar_url}
                  alt={profiles.username}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              ) : (
                <div className="h-6 w-6 rounded-full bg-purple-100 dark:bg-purple-900/30" />
              )}
              <span className="text-sm text-gray-600 dark:text-gray-400">
                by {profiles.username}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
