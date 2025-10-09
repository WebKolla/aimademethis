"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUp, MessageCircle, Folder, Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="h-full"
    >
      <Link href={`/products/${slug}`} className="group block h-full">
        <div className="relative h-full overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 transition-all duration-300 hover:border-transparent hover:ring-2 hover:ring-emerald-400 dark:hover:ring-emerald-600 hover:shadow-2xl hover:shadow-emerald-500/20">

          {/* Image with Overlay Elements */}
          <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800">
            {image_url ? (
              <Image
                src={image_url}
                alt={name}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="text-6xl opacity-50">🤖</span>
              </div>
            )}

            {/* Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Quick Action Buttons - Appear on Hover */}
            <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
              <Button
                size="icon"
                variant="secondary"
                className="h-9 w-9 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md hover:bg-white dark:hover:bg-gray-900 shadow-lg"
                onClick={(e) => {
                  e.preventDefault();
                  // TODO: Implement bookmark functionality
                }}
              >
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>

            {/* Pricing Badge - Top Right Overlay */}
            {pricing_type && pricing_type in pricingBadgeClasses && (
              <div className="absolute top-4 right-4">
                <Badge className={cn(pricingBadgeClasses[pricing_type as keyof typeof pricingBadgeClasses], "backdrop-blur-md shadow-lg")}>
                  {pricingLabels[pricing_type as keyof typeof pricingLabels]}
                </Badge>
              </div>
            )}

            {/* Category Badge - Bottom Left Overlay */}
            {categories && (
              <div className="absolute bottom-4 left-4">
                <Badge variant="secondary" className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg">
                  <Folder className="h-3 w-3 mr-1" />
                  {categories.name}
                </Badge>
              </div>
            )}
          </div>

          {/* Card Content */}
          <div className="p-6 space-y-4">

            {/* Title with Gradient Effect on Hover */}
            <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight tracking-tight transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-emerald-600 group-hover:to-teal-600 group-hover:bg-clip-text group-hover:text-transparent">
              {name}
            </h3>

            {/* Tagline */}
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
              {tagline}
            </p>

            {/* Footer: Creator + Stats */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">

              {/* Creator */}
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="relative h-7 w-7 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-gray-100 dark:ring-gray-800">
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
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {profiles?.username}
                </span>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  <ArrowUp className="h-4 w-4" />
                  <span className="text-sm font-semibold">{upvotes_count}</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-500 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm font-semibold">{comments_count}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
