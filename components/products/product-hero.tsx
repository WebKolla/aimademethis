"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ExternalLink,
  Github,
  PlayCircle,
  Sparkles,
  Star,
  Users,
  Bookmark,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Database } from "@/types/database.types";
import { VoteButton } from "./vote-button";
import { BookmarkButton } from "./bookmark-button";
import { FollowProductButton } from "@/components/follows/follow-product-button";

type Product = Database["public"]["Tables"]["products"]["Row"] & {
  categories?: { name: string; slug: string } | null;
};

interface ProductHeroProps {
  product: Product;
  voteCount: number;
  bookmarkCount: number;
  followerCount: number;
  userVoted: boolean;
  userBookmarked: boolean;
  userFollowing: boolean;
  averageRating?: number;
  totalReviews?: number;
}

export function ProductHero({
  product,
  voteCount,
  bookmarkCount,
  followerCount,
  userVoted,
  userBookmarked,
  userFollowing,
  averageRating,
  totalReviews,
}: ProductHeroProps) {
  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-black">
      {/* Animated Background Blobs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          x: [0, 100, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 -left-48 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0],
          x: [0, -100, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-1/4 -right-48 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl"
      />

      {/* Content Container */}
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Left: Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Decorative Gradient Border */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl blur opacity-50" />

            {/* Image Container */}
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                  <span className="text-9xl opacity-50">🤖</span>
                </div>
              )}

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
            </div>

            {/* Floating Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="absolute -bottom-6 -left-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-xl border border-white/20 p-4 shadow-2xl"
            >
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    {voteCount}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    Votes
                  </div>
                </div>
                <div className="w-px bg-slate-200 dark:bg-slate-700" />
                <div className="text-center">
                  <div className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    {product.views_count || 0}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    Views
                  </div>
                </div>
                <div className="w-px bg-slate-200 dark:bg-slate-700" />
                <div className="text-center">
                  <div className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    {averageRating?.toFixed(1) || "N/A"}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    Rating
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Category Badge */}
            {product.categories && (
              <Link href={`/category/${product.categories.slug}`}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors cursor-pointer">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm font-semibold text-emerald-400">
                    {product.categories.name}
                  </span>
                </div>
              </Link>
            )}

            {/* Title & Tagline */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
                {product.name}
              </h1>
              <p className="text-xl lg:text-2xl text-slate-300 leading-relaxed max-w-xl">
                {product.tagline}
              </p>
            </div>

            {/* Badges Row */}
            <div className="flex flex-wrap gap-3">
              {/* Pricing Badge */}
              {product.pricing_type && (
                <Badge className="px-4 py-2 bg-green-500/20 text-green-300 border-green-500/30 text-sm font-semibold">
                  {product.pricing_type === "free"
                    ? "Free"
                    : product.pricing_type === "freemium"
                    ? "Freemium"
                    : product.pricing_type === "paid"
                    ? "Paid"
                    : "Subscription"}
                </Badge>
              )}

              {/* Rating Badge */}
              {averageRating && totalReviews && totalReviews > 0 && (
                <Badge className="px-4 py-2 bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-sm font-semibold flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {averageRating.toFixed(1)} ({totalReviews})
                </Badge>
              )}

              {/* Follower Badge */}
              <Badge className="px-4 py-2 bg-purple-500/20 text-purple-300 border-purple-500/30 text-sm font-semibold">
                <Users className="h-4 w-4 mr-1" />
                {followerCount} Followers
              </Badge>

              {/* Bookmark Badge */}
              <Badge className="px-4 py-2 bg-blue-500/20 text-blue-300 border-blue-500/30 text-sm font-semibold">
                <Bookmark className="h-4 w-4 mr-1" />
                {bookmarkCount} Saved
              </Badge>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Primary CTA */}
              {product.website_url && (
                <Button
                  size="lg"
                  className="flex-1 h-14 text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-2xl shadow-emerald-500/50 hover:shadow-emerald-500/70 transition-all"
                  asChild
                >
                  <a
                    href={product.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-5 w-5" />
                    Launch Product
                  </a>
                </Button>
              )}

              {/* Vote Button */}
              <div className="flex-1">
                <VoteButton
                  productId={product.id}
                  initialVoted={userVoted}
                  initialCount={voteCount}
                  variant="default"
                />
              </div>
            </div>

            {/* Secondary Actions Row */}
            <div className="flex gap-3">
              <div className="flex-1">
                <BookmarkButton
                  productId={product.id}
                  initialBookmarked={userBookmarked}
                  initialCount={bookmarkCount}
                  showCount={true}
                />
              </div>

              <div className="flex-1">
                <FollowProductButton
                  productId={product.id}
                  initialIsFollowing={userFollowing}
                  variant="outline"
                />
              </div>

              {/* Demo Button */}
              {product.demo_url && (
                <Button
                  variant="outline"
                  className="flex-1 bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 text-white"
                  asChild
                >
                  <a
                    href={product.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Demo
                  </a>
                </Button>
              )}

              {/* GitHub Button */}
              {product.github_url && (
                <Button
                  variant="outline"
                  className="flex-1 bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 text-white"
                  asChild
                >
                  <a
                    href={product.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    Code
                  </a>
                </Button>
              )}
            </div>

            {/* Pricing Details */}
            {product.pricing_details && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4"
              >
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {product.pricing_details}
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
