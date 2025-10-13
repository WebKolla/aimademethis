"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ProductList } from "@/components/products/product-list";
import Link from "next/link";
import {
  TrendingUp,
  Sparkles,
  Clock,
  Calendar,
  CalendarDays,
  Infinity as InfinityIcon,
  Loader2,
  Info,
} from "lucide-react";
import { getTrendingProducts, type TimePeriod } from "@/lib/products/trending-actions";
import type { Database } from "@/types/database.types";

type Product = Database["public"]["Tables"]["products"]["Row"] & {
  categories: { name: string; slug: string } | null;
  profiles: { username: string; avatar_url: string | null } | null;
  votes_count: number;
  comments_count: number;
  trendingScore?: number;
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const timePeriods = [
  { value: "today" as TimePeriod, label: "Today", icon: Clock },
  { value: "week" as TimePeriod, label: "This Week", icon: Calendar },
  { value: "month" as TimePeriod, label: "This Month", icon: CalendarDays },
  { value: "all" as TimePeriod, label: "All Time", icon: InfinityIcon },
];

function TrendingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(
    (searchParams.get("period") as TimePeriod) || "week"
  );

  useEffect(() => {
    async function loadTrendingProducts() {
      setLoading(true);
      const result = await getTrendingProducts(timePeriod);
      if (result.products) {
        setProducts(result.products as Product[]);
      }
      setLoading(false);
    }

    loadTrendingProducts();

    // Update URL
    const params = new URLSearchParams();
    if (timePeriod !== "week") {
      params.set("period", timePeriod);
    }
    const newURL = params.toString() ? `/trending?${params.toString()}` : "/trending";
    router.push(newURL, { scroll: false });
  }, [timePeriod, router]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-slate-50 via-teal-50/30 to-emerald-50/30 dark:from-slate-950 dark:via-teal-950/20 dark:to-slate-950">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-1/4 -left-48 w-96 h-96 bg-teal-500/10 dark:bg-teal-500/5 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute bottom-1/4 -right-48 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block"
            >
              <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-sm font-semibold shadow-lg shadow-teal-500/30">
                <TrendingUp className="w-5 h-5" />
                Trending Products
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight">
              <span className="block text-gray-900 dark:text-white">What&apos;s Hot in</span>
              <span className="block mt-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                AI Right Now
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto">
              Discover the most popular AI products based on community engagement,
              recent activity, and overall interest.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Trending Algorithm Explanation */}
      <section className="py-8 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 border border-teal-200 dark:border-teal-800">
              <Info className="w-6 h-6 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h3 className="font-bold text-gray-900 dark:text-white">
                  How Trending Works
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Our trending algorithm combines <strong>recency</strong> (recently launched products),
                  <strong> community engagement</strong> (upvotes and reviews), and <strong>views</strong> to
                  surface the most exciting AI products. The algorithm is completely transparent and
                  applies equally to all products - no paid promotions.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Time Period Filter */}
      <section className="py-8 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {loading ? (
                "Loading trending products..."
              ) : (
                <>
                  Showing {products.length} trending {products.length === 1 ? "product" : "products"}
                </>
              )}
            </div>

            {/* Time Period Buttons */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {timePeriods.map((period) => {
                const IconComponent = period.icon;
                const isActive = timePeriod === period.value;

                return (
                  <Button
                    key={period.value}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimePeriod(period.value)}
                    className={
                      isActive
                        ? "bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
                        : ""
                    }
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {period.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 space-y-4">
                <div className="text-6xl">📈</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  No trending products yet
                </h3>
                <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                  {timePeriod === "today"
                    ? "No products have gained traction today. Check back tomorrow or try a different time period."
                    : "Be the first to submit a product and start trending!"}
                </p>
                {timePeriod === "today" && (
                  <Button
                    variant="outline"
                    onClick={() => setTimePeriod("week")}
                  >
                    View This Week Instead
                  </Button>
                )}
              </div>
            ) : (
              <motion.div
                initial="hidden"
                animate="show"
                variants={container}
              >
                <ProductList products={products} />
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-teal-600 via-emerald-600 to-cyan-600">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Want to See Your Product Here?
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Submit your AI product and let the community decide what&apos;s trending.
              Get featured based on merit, not money.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <Button
                size="lg"
                asChild
                className="text-lg px-8 py-7 rounded-full bg-white text-emerald-600 hover:bg-slate-100 shadow-2xl"
              >
                <Link href="/products/new">
                  <Sparkles className="mr-2 w-5 h-5" />
                  Submit Your Product
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export function TrendingPageClient() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        </div>
      }
    >
      <TrendingPageContent />
    </Suspense>
  );
}
