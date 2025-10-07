"use client";

import Image from "next/image";
import { ExternalLinkIcon, GithubIcon, PlayCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Database } from "@/types/database.types";
import { VoteButton } from "./vote-button";
import { BookmarkButton } from "./bookmark-button";
import { StarRating } from "@/components/reviews/star-rating";

type Product = Database["public"]["Tables"]["products"]["Row"];

interface ProductHeaderProps {
  product: Product;
  voteCount: number;
  bookmarkCount: number;
  userVoted: boolean;
  userBookmarked: boolean;
  averageRating?: number;
  totalReviews?: number;
}

export function ProductHeader({ product, voteCount, bookmarkCount, userVoted, userBookmarked, averageRating, totalReviews }: ProductHeaderProps) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-800 pb-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Product Image */}
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-900">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              <span className="text-8xl">🤖</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-between space-y-6">
          {/* Title & Tagline */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
              {product.name}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">{product.tagline}</p>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-3">
            {/* Pricing Badge */}
            {product.pricing_type && (
              <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-4 py-2 text-sm font-medium text-green-800 dark:text-green-300">
                {product.pricing_type === "free"
                  ? "Free"
                  : product.pricing_type === "freemium"
                  ? "Freemium"
                  : product.pricing_type === "paid"
                  ? "Paid"
                  : "Subscription"}
              </span>
            )}

            {/* Stats */}
            <span className="inline-flex items-center rounded-full bg-teal-100 dark:bg-teal-900/30 px-4 py-2 text-sm font-medium text-teal-800 dark:text-teal-300">
              ⬆️ {voteCount} {voteCount === 1 ? "vote" : "votes"}
            </span>

            <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-2 text-sm font-medium text-blue-800 dark:text-blue-300">
              👁️ {product.views_count || 0} {product.views_count === 1 ? "view" : "views"}
            </span>

            <span className="inline-flex items-center rounded-full bg-orange-100 dark:bg-orange-900/30 px-4 py-2 text-sm font-medium text-orange-800 dark:text-orange-300">
              🔖 {bookmarkCount} {bookmarkCount === 1 ? "bookmark" : "bookmarks"}
            </span>

            {/* Rating Badge */}
            {averageRating !== undefined && totalReviews !== undefined && totalReviews > 0 && (
              <span className="inline-flex items-center gap-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30 px-4 py-2">
                <StarRating rating={averageRating} size="sm" showNumber={false} />
                <span className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                  {averageRating.toFixed(1)} ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
                </span>
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <div className="flex gap-3">
              {/* Vote Button */}
              <VoteButton
                productId={product.id}
                initialVoted={userVoted}
                initialCount={voteCount}
                variant="default"
              />

              {/* Bookmark Button */}
              <BookmarkButton
                productId={product.id}
                initialBookmarked={userBookmarked}
                initialCount={bookmarkCount}
                showCount={false}
              />

              {product.website_url && (
                <a
                  href={product.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button className="w-full" size="lg">
                    <ExternalLinkIcon className="mr-2 h-5 w-5" />
                    Visit Website
                  </Button>
                </a>
              )}
            </div>

            <div className="grid gap-2 grid-cols-2">
              {product.demo_url && (
                <a href={product.demo_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full">
                    <PlayCircleIcon className="mr-2 h-4 w-4" />
                    Try Demo
                  </Button>
                </a>
              )}

              {product.github_url && (
                <a href={product.github_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full">
                    <GithubIcon className="mr-2 h-4 w-4" />
                    View Code
                  </Button>
                </a>
              )}
            </div>
          </div>

          {/* Pricing Details */}
          {product.pricing_details && (
            <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                💰 {product.pricing_details}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
