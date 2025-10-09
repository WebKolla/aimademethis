"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Star, ArrowUp, MessageCircle } from "lucide-react";
import type { Database } from "@/types/database.types";

type Product = Database["public"]["Tables"]["products"]["Row"] & {
  categories: { name: string; slug: string } | null;
  profiles: { username: string; avatar_url: string | null } | null;
  votes_count?: number;
  comments_count?: number;
};

interface FeaturedProductsProps {
  products: Product[];
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

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="relative mb-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-emerald-600" />
          Featured Products
        </h2>
        <Badge variant="secondary" className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">
          Handpicked
        </Badge>
      </div>

      {/* Horizontal Scrolling Container */}
      <div className="relative -mx-4 px-4">
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {products.map((product) => (
            <FeaturedProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Gradient Fade on Right Edge */}
        <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent pointer-events-none hidden lg:block" />
      </div>
    </section>
  );
}

function FeaturedProductCard({ product }: { product: Product }) {
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
    <div className="flex-shrink-0 w-full sm:w-[380px] snap-start p-4">
      <Link href={`/products/${slug}`} className="group block">
        <div className="relative h-full rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-emerald-950/50 dark:via-gray-900 dark:to-teal-950/50 shadow-lg shadow-emerald-500/10 hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 hover:scale-[1.02] hover:border-emerald-400 dark:hover:border-emerald-600">

          {/* Featured Badge - Positioned at card level for proper visibility */}
          <div className="absolute -top-3 -right-3 z-30">
            <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
              <Star className="h-3 w-3 fill-current" />
              Featured
            </div>
          </div>

        {/* Product Image */}
        <div className="relative aspect-video w-full overflow-hidden rounded-t-2xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800">

          {image_url ? (
            <Image
              src={image_url}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110 rounded-t-2xl"
              sizes="(max-width: 640px) 100vw, 380px"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-6xl opacity-50">🤖</span>
            </div>
          )}

          {/* Pricing Badge Overlay */}
          {pricing_type && pricing_type in pricingBadgeClasses && (
            <div className="absolute top-3 right-3">
              <Badge className={pricingBadgeClasses[pricing_type as keyof typeof pricingBadgeClasses]}>
                {pricingLabels[pricing_type as keyof typeof pricingLabels]}
              </Badge>
            </div>
          )}

          {/* Category Badge Overlay */}
          {categories && (
            <div className="absolute bottom-3 left-3">
              <Badge variant="secondary" className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
                {categories.name}
              </Badge>
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-6 space-y-4">
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 line-clamp-2 leading-tight tracking-tight">
            {name}
          </h3>

          {/* Tagline */}
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
            {tagline}
          </p>

          {/* Footer: Creator + Stats */}
          <div className="flex items-center justify-between pt-4 border-t border-emerald-100 dark:border-emerald-900/50">
            {/* Creator */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="relative h-7 w-7 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-emerald-200 dark:ring-emerald-800">
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
              <span className="text-sm text-gray-600 dark:text-gray-400 truncate font-medium">
                {profiles?.username}
              </span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-500">
                <ArrowUp className="h-4 w-4" />
                <span className="text-sm font-semibold">{upvotes_count}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-500">
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm font-semibold">{comments_count}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
    </div>
  );
}
