import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ArrowRight, Sparkles, Users, TrendingUp } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-block">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Community-Driven AI Discovery
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Discover AI Products{" "}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Built by Innovators
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore, share, and discover AI tools and applications created by developers,
              researchers, and enthusiasts from around the world.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button size="lg" asChild>
                <Link href="/products">
                  Explore Products
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/products/new">Submit Your Product</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-y bg-muted/50">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mb-2">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold">1,000+</div>
                <div className="text-sm text-muted-foreground">AI Products</div>
              </div>
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-2">
                  <Users className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold">5,000+</div>
                <div className="text-sm text-muted-foreground">Community Members</div>
              </div>
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-2">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold">50+</div>
                <div className="text-sm text-muted-foreground">New This Week</div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">Featured Products</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover the best AI tools and applications handpicked by our community
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Placeholder cards - will be replaced with actual data */}
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="border rounded-xl p-6 space-y-4 hover:shadow-lg transition-shadow"
                >
                  <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-lg" />
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Product Name</h3>
                    <p className="text-sm text-muted-foreground">
                      A brief description of what this AI product does and how it helps users.
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-muted-foreground">Category</span>
                    <span className="text-sm font-medium">👍 125</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center pt-8">
              <Button variant="outline" size="lg" asChild>
                <Link href="/products">View All Products</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t bg-muted/50">
          <div className="container mx-auto px-4 py-20">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to Share Your AI Creation?
              </h2>
              <p className="text-lg text-muted-foreground">
                Join our community of innovators and showcase your AI products to the world
              </p>
              <Button size="lg" asChild>
                <Link href="/products/new">
                  Submit Your Product
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
