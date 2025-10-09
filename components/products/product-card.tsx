"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUp, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Database } from "@/types/database.types";

type Product = Database["public"]["Tables"]["products"]["Row"] & {
  categories: { name: string; slug: string } | null;
  profiles: { username: string; avatar_url: string | null } | null;
  votes_count?: number;
  comments_count?: number;
};

interface ProductCardProps {
  product: Product;
}

const pricingBadgeClasses = {
  free: "bg-green-100 dark:bg-green-900/90 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800 backdrop-blur-sm",
  freemium: "bg-blue-100 dark:bg-blue-900/90 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800 backdrop-blur-sm",
  paid: "bg-purple-100 dark:bg-purple-900/90 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-800 backdrop-blur-sm",
  subscription: "bg-orange-100 dark:bg-orange-900/90 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-800 backdrop-blur-sm",
};

const pricingLabels = {
  free: "Free",
  freemium: "Freemium",
  paid: "Paid",
  subscription: "Subscription",
};

export function ProductCard({ product }: ProductCardProps) {
  const {
    slug,
    name,
    tagline,
    image_url,
    pricing_type,
    categories,
    profiles,
    upvotes_count = 0,
    comments_count = 0,
  } = product;

  return (
    <Link href={`/products/${slug}`} className="group block h-full">
      <div className="h-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 transition-all duration-300 hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1">

        {/* Image with Overlay Elements */}
        <div className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800">
          {image_url ? (
            <Image
              src={image_url}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-6xl opacity-50">🤖</span>
            </div>
          )}

          {/* Pricing Badge - Top Right Overlay */}
          {pricing_type && pricing_type in pricingBadgeClasses && (
            <div className="absolute top-3 right-3">
              <Badge className={pricingBadgeClasses[pricing_type as keyof typeof pricingBadgeClasses]}>
                {pricingLabels[pricing_type as keyof typeof pricingLabels]}
              </Badge>
            </div>
          )}

          {/* Category Badge - Bottom Left Overlay */}
          {categories && (
            <div className="absolute bottom-3 left-3">
              <Badge variant="secondary" className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
                {categories.name}
              </Badge>
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-5 space-y-4">

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 line-clamp-2 leading-tight tracking-tight">
            {name}
          </h3>

          {/* Tagline */}
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {tagline}
          </p>

          {/* Footer: Creator + Stats */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">

            {/* Creator */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="relative h-6 w-6 rounded-full overflow-hidden flex-shrink-0">
                {profiles?.avatar_url ? (
                  <Image
                    src={profiles.avatar_url}
                    alt={profiles.username}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-emerald-400 to-teal-400" />
                )}
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                {profiles?.username}
              </span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-500">
                <ArrowUp className="h-4 w-4" />
                <span className="text-sm font-medium">{upvotes_count}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-500">
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm font-medium">{comments_count}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
