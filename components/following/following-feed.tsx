"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, MessageCircle, ArrowUp, Clock, TrendingUp } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  image_url: string | null;
  created_at: string;
  views_count: number;
  votes_count: number;
  comments_count: number;
  categories: {
    name: string;
    slug: string;
  } | null;
  profiles: {
    username: string;
    avatar_url: string | null;
    full_name: string | null;
  } | null;
}

interface FollowingFeedProps {
  products: Product[];
  initialSort: "newest" | "trending";
}

export function FollowingFeed({ products, initialSort }: FollowingFeedProps) {
  const router = useRouter();
  const [sortBy, setSortBy] = useState(initialSort);

  const handleSortChange = (value: string) => {
    setSortBy(value as "newest" | "trending");
    router.push(`/dashboard/following?sort=${value}`);
  };

  return (
    <div>
      {/* Sort Controls */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-400">
          {products.length} {products.length === 1 ? "product" : "products"}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Sort by:</span>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[140px] bg-gray-900 border-gray-800">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Newest
                </div>
              </SelectItem>
              <SelectItem value="trending">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Trending
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-emerald-600 transition-all duration-200 group"
          >
            {/* Product Image */}
            <div className="relative h-48 bg-gray-800">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-600">
                  <Eye className="h-12 w-12" />
                </div>
              )}
              {product.categories && (
                <div className="absolute top-2 left-2">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-900/80 backdrop-blur-sm text-emerald-400 border border-emerald-600/30">
                    {product.categories.name}
                  </span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-5">
              {/* Creator Info */}
              {product.profiles && (
                <div className="flex items-center gap-2 mb-3">
                  {product.profiles.avatar_url ? (
                    <Image
                      src={product.profiles.avatar_url}
                      alt={product.profiles.username}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white text-xs font-medium">
                      {product.profiles.username?.[0]?.toUpperCase() || "?"}
                    </div>
                  )}
                  <span className="text-sm text-gray-400">
                    @{product.profiles.username}
                  </span>
                </div>
              )}

              <h3 className="text-lg font-semibold text-white mb-2 truncate group-hover:text-emerald-400 transition-colors">
                {product.name}
              </h3>
              <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                {product.tagline}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <ArrowUp className="h-4 w-4" />
                  {product.votes_count || 0}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  {product.comments_count || 0}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {product.views_count || 0}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
