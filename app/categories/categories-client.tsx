"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ArrowRight,
  Layers,
  Code,
  Image,
  MessageSquare,
  Music,
  Video,
  Palette,
  Database as DatabaseIcon,
  Cpu,
  Brain,
  Search,
  TrendingUp,
} from "lucide-react";
import type { Database } from "@/types/database.types";

type Category = Database["public"]["Tables"]["categories"]["Row"] & {
  product_count: number;
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

// Icon mapping for categories (fallback icons)
const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  code: Code,
  image: Image,
  text: MessageSquare,
  audio: Music,
  video: Video,
  design: Palette,
  data: DatabaseIcon,
  automation: Cpu,
  ml: Brain,
  search: Search,
  analytics: TrendingUp,
  default: Layers,
};

function getCategoryIcon(iconName: string | null): React.ComponentType<{ className?: string }> {
  if (!iconName) return categoryIcons.default;
  const icon = categoryIcons[iconName.toLowerCase()];
  return icon || categoryIcons.default;
}

interface CategoriesClientProps {
  categories: Category[];
  totalProducts: number;
}

export function CategoriesClient({ categories, totalProducts }: CategoriesClientProps) {
  // Sort categories by product count (descending)
  const sortedCategories = [...categories].sort((a, b) => b.product_count - a.product_count);

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
                <Sparkles className="w-5 h-5" />
                Browse by Category
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight">
              <span className="block text-gray-900 dark:text-white">Explore AI Products</span>
              <span className="block mt-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                By Category
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto">
              Discover {totalProducts.toLocaleString()}+ AI products organized into categories.
              Find the perfect tool for your specific needs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <Button size="lg" variant="outline" asChild className="text-lg px-8 py-7 rounded-full border-2">
                <Link href="/products">
                  <Search className="mr-2 w-5 h-5" />
                  Browse All Products
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          {sortedCategories.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <div className="text-6xl">📂</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                No categories yet
              </h3>
              <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                Categories will appear here once products are added to the platform.
              </p>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="show"
              variants={container}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto"
            >
              {sortedCategories.map((category) => {
                const IconComponent = getCategoryIcon(category.icon);

                return (
                  <motion.div key={category.id} variants={item}>
                    <Link
                      href={`/products?category=${category.id}`}
                      className="group block h-full"
                    >
                      <div className="h-full p-8 rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-2 border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-teal-500/10 hover:-translate-y-1">
                        <div className="space-y-4">
                          {/* Icon */}
                          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-lg group-hover:shadow-teal-500/50 group-hover:scale-110 transition-all duration-300">
                            <IconComponent className="w-8 h-8" />
                          </div>

                          {/* Category Name */}
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                              {category.name}
                            </h3>
                            {category.description && (
                              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                                {category.description}
                              </p>
                            )}
                          </div>

                          {/* Product Count & Arrow */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                              {category.product_count} {category.product_count === 1 ? "product" : "products"}
                            </span>
                            <ArrowRight className="w-5 h-5 text-teal-600 dark:text-teal-400 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
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
              Don&apos;t See Your Category?
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Submit your AI product and help us expand our categories. We&apos;re always
              growing to accommodate new innovations in AI.
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
              <Button
                size="lg"
                variant="outline"
                asChild
                className="text-lg px-8 py-7 rounded-full border-2 border-white text-white hover:bg-white/10"
              >
                <Link href="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
