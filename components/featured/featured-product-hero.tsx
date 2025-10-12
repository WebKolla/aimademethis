"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Crown,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  Eye,
  ExternalLink,
  Play,
} from "lucide-react";

interface FeaturedProduct {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  image_url: string | null;
  video_url: string | null;
  demo_video_url: string | null;
  website_url: string | null;
  created_at: string | null;
  views_count: number | null;
  votes_count: number;
  comments_count: number;
  pricing_type: string | null;
  categories: {
    name: string;
    slug: string;
  } | null;
  profiles: {
    id: string;
    username: string;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

interface FeaturedProductHeroProps {
  product: FeaturedProduct;
}

export function FeaturedProductHero({ product }: FeaturedProductHeroProps) {
  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950/20 dark:via-orange-950/10 dark:to-slate-950 overflow-hidden border-y-4 border-amber-400 dark:border-amber-600">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 45, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-48 -right-48 w-96 h-96 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [45, 0, 45],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-48 -left-48 w-96 h-96 bg-gradient-to-br from-yellow-400/20 to-amber-400/20 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto"
        >
          {/* Featured Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-white text-sm font-bold shadow-2xl shadow-amber-500/50 animate-pulse">
              <Crown className="w-5 h-5" />
              Featured Pro Plus Product
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Product Image/Video */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative group"
            >
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 dark:border-slate-700/50 group-hover:scale-[1.02] transition-transform duration-500">
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
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900">
                    <Crown className="w-24 h-24 text-amber-500" />
                  </div>
                )}

                {/* Video Badge if available */}
                {(product.video_url || product.demo_video_url) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center justify-center w-20 h-20 rounded-full bg-white/90 text-amber-600 shadow-2xl">
                      <Play className="w-10 h-10 ml-1" />
                    </div>
                  </div>
                )}

                {/* Category Badge */}
                {product.categories && (
                  <div className="absolute top-4 left-4">
                    <span className="inline-block px-4 py-2 rounded-full text-xs font-bold bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white backdrop-blur-sm shadow-lg border border-amber-400/50">
                      {product.categories.name}
                    </span>
                  </div>
                )}

                {/* Pricing Badge */}
                {product.pricing_type && (
                  <div className="absolute top-4 right-4">
                    <span className="inline-block px-4 py-2 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-lg">
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

              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-400/30 to-orange-400/30 blur-3xl -z-10 group-hover:blur-2xl transition-all duration-500" />
            </motion.div>

            {/* Right: Product Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="space-y-6"
            >
              {/* Creator Info */}
              {product.profiles && (
                <div className="flex items-center gap-3">
                  {product.profiles.avatar_url ? (
                    <Image
                      src={product.profiles.avatar_url}
                      alt={product.profiles.username}
                      width={48}
                      height={48}
                      className="rounded-full border-2 border-amber-400"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-lg font-bold border-2 border-amber-400">
                      {product.profiles.username?.[0]?.toUpperCase() || "?"}
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Created by
                    </p>
                    <Link
                      href={`/profile/${product.profiles.username}`}
                      className="text-base font-semibold text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                    >
                      {product.profiles.full_name || `@${product.profiles.username}`}
                    </Link>
                  </div>
                </div>
              )}

              {/* Product Name */}
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-3 leading-tight">
                  {product.name}
                </h2>
                {product.tagline && (
                  <p className="text-xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                    {product.tagline}
                  </p>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {product.description}
                </p>
              )}

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                    <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {product.votes_count}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Upvotes
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {product.comments_count}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Comments
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30">
                    <Eye className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {product.views_count || 0}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Views
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  asChild
                  className="text-base px-8 py-6 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-600 hover:via-orange-600 hover:to-amber-600 text-white shadow-2xl shadow-amber-500/50 hover:shadow-amber-500/70 transition-all duration-300"
                >
                  <Link href={`/products/${product.slug}`}>
                    View Product
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>

                {product.website_url && (
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="text-base px-8 py-6 rounded-full border-2 border-amber-400 dark:border-amber-600 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-all duration-300"
                  >
                    <Link
                      href={product.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit Website
                      <ExternalLink className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                )}
              </div>

              {/* Pro Plus Badge */}
              <div className="pt-4 border-t border-amber-200 dark:border-amber-800">
                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-500" />
                  This product is featured with{" "}
                  <Link
                    href="/pricing"
                    className="font-bold text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    Pro Plus
                  </Link>
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
