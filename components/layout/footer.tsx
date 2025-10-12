import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Flame } from "lucide-react";

interface FooterCategory {
  slug: string;
  name: string;
}

interface FooterProduct {
  slug: string;
  name: string;
}

interface FooterProps {
  categories?: FooterCategory[];
  products?: FooterProduct[];
}

export function Footer({ categories = [], products = [] }: FooterProps = {}) {

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Logo textClassName="text-lg tracking-tight" variant="gradient" />
            <p className="text-sm text-muted-foreground dark:text-white">
              AI Made Me This - Discover and share AI products built by innovators worldwide.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Explore Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/trending" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  Trending
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/products/new" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Submit Product
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          {categories.length > 0 && (
            <div>
              <h4 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">Popular Categories</h4>
              <ul className="space-y-2 text-sm">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/products?category=${category.slug}`}
                      className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Trending Products */}
          {products.length > 0 && (
            <div>
              <h4 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">Trending Now</h4>
              <ul className="space-y-2 text-sm">
                {products.map((product) => (
                  <li key={product.slug}>
                    <Link
                      href={`/products/${product.slug}`}
                      className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    >
                      {product.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Legal & Resources */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-gray-600 dark:text-gray-400">
          <p>© {new Date().getFullYear()} AIMMT (AI Made Me This). All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
