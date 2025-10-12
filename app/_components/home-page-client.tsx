"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Rocket,
  TrendingUp,
  Users,
  Eye,
  Star,
  MessageSquare,
  Zap,
  Award,
  Target,
  Globe,
  Check,
  Mail,
  CheckCircle2,
  Crown,
} from "lucide-react";
import { NewsletterSignup } from "@/components/newsletter/newsletter-signup";
import { PricingSectionHomeClient } from "@/components/pricing/pricing-section-home-client";
import { FeaturedProductHero } from "@/components/featured/featured-product-hero";
import type { LucideIcon } from "lucide-react";

// Icon mapping for pricing plans
const iconComponents: Record<string, LucideIcon> = {
  Zap: Zap,
  Sparkles: Sparkles,
  Crown: Crown,
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

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const benefits = [
  {
    icon: Eye,
    title: "Massive Exposure",
    description: "Get your AI product in front of thousands of tech enthusiasts, developers, and potential users.",
  },
  {
    icon: Users,
    title: "Engaged Community",
    description: "Connect with a passionate community that provides feedback, upvotes, and meaningful discussions.",
  },
  {
    icon: Star,
    title: "Credibility Boost",
    description: "Build trust through authentic reviews and ratings from real users in the AI community.",
  },
  {
    icon: MessageSquare,
    title: "Direct Feedback",
    description: "Receive valuable insights and suggestions to improve your product from engaged users.",
  },
  {
    icon: TrendingUp,
    title: "SEO Benefits",
    description: "High-quality backlinks and increased discoverability through our optimized platform.",
  },
  {
    icon: Zap,
    title: "Free to Start",
    description: "Begin with our free tier and upgrade as you grow. Flexible plans for every creator.",
  },
];

const features = [
  {
    icon: Rocket,
    title: "Launch Fast",
    description: "Submit your product in minutes with our streamlined submission process",
  },
  {
    icon: Award,
    title: "Get Recognition",
    description: "Stand out with upvotes, reviews, and community engagement",
  },
  {
    icon: Target,
    title: "Reach Your Audience",
    description: "Connect with developers, founders, and AI enthusiasts worldwide",
  },
  {
    icon: Globe,
    title: "Global Visibility",
    description: "Showcase your work to an international community of innovators",
  },
];

interface PlanData {
  name: string;
  displayName: string;
  priceMonthly: number;
  priceYearly: number;
  description: string;
  iconName: string;
  iconColor: string;
  features: string[];
  cta: string;
  href: string;
  popular: boolean;
  badge?: string;
}

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

interface HomePageClientProps {
  plans: PlanData[];
  featuredProduct: FeaturedProduct | null;
}

export function HomePageClient({ plans, featuredProduct }: HomePageClientProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  // Transform plans to include icon components
  const plansWithIcons = plans.map(plan => ({
    ...plan,
    icon: iconComponents[plan.iconName] || Sparkles,
  }));
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/* Animated Background Elements */}
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

          <div className="container mx-auto px-4 py-20 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-5xl mx-auto text-center space-y-10"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-block"
              >
                <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-sm font-semibold shadow-lg shadow-teal-500/30 dark:shadow-teal-500/20">
                  <Sparkles className="w-5 h-5" />
                  The Ultimate AI Product Showcase Platform
                </span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-6xl md:text-8xl font-black tracking-tight leading-tight"
              >
                <span className="block text-gray-900 dark:text-white">Where AI Creators</span>
                <span className="block mt-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                  Shine Bright
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium"
              >
                Amplify your AI products to thousands of potential users.{" "}
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  Get discovered. Get feedback. Get traction.
                </span>{" "}
                Start free today.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-5 justify-center items-center pt-6"
              >
                <Button size="lg" asChild className="text-lg px-8 py-7 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700">
                  <Link href="/dashboard/products/new">
                    <Rocket className="mr-2 w-5 h-5" />
                    Launch Your Product
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-lg px-8 py-7 rounded-full border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300">
                  <Link href="/products">
                    Explore Products
                  </Link>
                </Button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="flex flex-wrap items-center justify-center gap-8 pt-8 text-sm text-slate-500 dark:text-slate-400"
              >
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-medium">Free Tier Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-medium">No Credit Card Required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-medium">Upgrade Anytime</span>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <div className="w-6 h-10 border-2 border-teal-600 dark:border-teal-400 rounded-full p-1">
              <motion.div
                animate={{ y: [0, 16, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-3 bg-teal-600 dark:bg-teal-400 rounded-full mx-auto"
              />
            </div>
          </motion.div>
        </section>

        {/* Featured Product Hero Section */}
        {featuredProduct && <FeaturedProductHero product={featuredProduct} />}

        {/* SEO Content Section */}
        <section className="py-16 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
                The Ultimate AI Product Discovery Platform
              </h2>

              <div className="space-y-6 text-lg text-slate-700 dark:text-slate-300">
                <p>
                  <strong>AIMMT (AI Made Me This)</strong> is the premier platform for discovering,
                  sharing, and reviewing <strong>AI products and SaaS tools</strong>. Whether you&apos;re searching for
                  <strong> AI productivity tools</strong>, <strong>creative AI applications</strong>,
                  or <strong>developer AI solutions</strong>, our community-driven <strong>SaaS product directory</strong> helps
                  you find exactly what you need.
                </p>

                <p>
                  Explore thousands of <strong>AI and SaaS products</strong> curated by developers and innovators
                  worldwide. Our transparent <strong>trending algorithm</strong> surfaces the best AI tools
                  based on real community engagement—no paid promotions, just genuine user feedback.
                  <strong> Submit your SaaS product to our directory</strong> for free and reach thousands of potential users.
                </p>

                <div className="grid md:grid-cols-3 gap-6 my-8">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20">
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                      Discover AI & SaaS Tools
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Search and filter through hundreds of AI and SaaS products by category, pricing,
                      and technology stack. Browse our comprehensive SaaS product directory.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                      Read Authentic Reviews
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Make informed decisions with genuine user reviews and 5-star ratings
                      from the AI community.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-rose-50 dark:from-orange-900/20 dark:to-rose-900/20">
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                      Showcase Your Product
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Submit your AI or SaaS product to our directory for free and reach thousands of potential users
                      actively searching for solutions. Easy SaaS product submission process.
                    </p>
                  </div>
                </div>

                <h3 className="text-2xl font-bold mt-12 mb-4 text-gray-900 dark:text-white">
                  Why Choose AIMMT for AI &amp; SaaS Product Discovery?
                </h3>

                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 dark:text-emerald-400 mt-1">✅</span>
                    <span><strong>Free to start</strong> - Submit unlimited AI and SaaS products on our free tier</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 dark:text-emerald-400 mt-1">✅</span>
                    <span><strong>Fair rankings</strong> - Algorithm-based trending, not pay-to-win, just like Product Hunt</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 dark:text-emerald-400 mt-1">✅</span>
                    <span><strong>Active community</strong> - Thousands of AI enthusiasts and SaaS builders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 dark:text-emerald-400 mt-1">✅</span>
                    <span><strong>Advanced filtering</strong> - Find AI and SaaS tools by use case, pricing, and tech stack</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 dark:text-emerald-400 mt-1">✅</span>
                    <span><strong>Detailed insights</strong> - See what AI models and technologies products use</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 dark:text-emerald-400 mt-1">✅</span>
                    <span><strong>Alternative to Product Hunt</strong> - Focused specifically on AI and SaaS products</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Why Showcase Section */}
        <section className="py-24 md:py-32 bg-white dark:bg-slate-900 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={container}
              className="space-y-16"
            >
              {/* Section Header */}
              <motion.div variants={item} className="text-center space-y-6 max-w-3xl mx-auto">
                <h2 className="text-5xl md:text-6xl font-black tracking-tight text-gray-900 dark:text-white">
                  Why Showcase Here?
                </h2>
                <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                  Join hundreds of AI creators who are already getting the visibility they deserve
                </p>
              </motion.div>

              {/* Benefits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {benefits.map((benefit) => (
                  <motion.div
                    key={benefit.title}
                    variants={item}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="group p-8 rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-teal-500/10"
                  >
                    <div className="space-y-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-lg group-hover:shadow-teal-500/50 transition-all duration-300">
                        <benefit.icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{benefit.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 md:py-32 bg-gradient-to-br from-slate-50 via-teal-50/30 to-emerald-50/30 dark:from-slate-950 dark:via-teal-950/20 dark:to-slate-950 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={container}
              className="space-y-16"
            >
              {/* Section Header */}
              <motion.div variants={item} className="text-center space-y-6 max-w-3xl mx-auto">
                <h2 className="text-5xl md:text-6xl font-black tracking-tight text-gray-900 dark:text-white">
                  Simple. Fast. Effective.
                </h2>
                <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                  Get your AI product live in minutes, not hours
                </p>
              </motion.div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    variants={item}
                    whileHover={{ scale: 1.05, rotate: 1 }}
                    className="group relative overflow-hidden p-8 rounded-3xl bg-white dark:bg-slate-800 border-2 border-transparent hover:border-teal-500 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-teal-500/10"
                  >
                    <div className="relative space-y-4">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 group-hover:from-teal-500 group-hover:to-emerald-500 transition-all duration-300">
                        <feature.icon className="w-7 h-7 text-slate-700 dark:text-slate-300 group-hover:text-white transition-colors duration-300" />
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-4xl font-black text-slate-200 dark:text-slate-700">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h3 className="text-xl font-bold flex-1 text-slate-900 dark:text-slate-100">{feature.title}</h3>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Pricing Section */}
        <PricingSectionHomeClient
          plans={plansWithIcons}
          billingCycle={billingCycle}
          onBillingCycleChange={setBillingCycle}
        />

        {/* Newsletter Section */}
        <section className="py-20 md:py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 relative overflow-hidden">
          {/* Subtle animated background element */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-teal-500/10 to-emerald-500/10 rounded-full blur-3xl"
            />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <div className="relative rounded-3xl border-2 border-transparent bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-8 md:p-12 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                {/* Gradient border effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-cyan-500/20 -z-10 blur-lg" />

                <div className="text-center space-y-6">
                  {/* Icon Badge */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="inline-block"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/30 dark:shadow-teal-500/20">
                      <Mail className="w-8 h-8" aria-hidden="true" />
                    </div>
                  </motion.div>

                  {/* Heading */}
                  <div className="space-y-3">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
                      Stay in the AI Loop
                    </h2>
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
                      Get weekly updates on trending AI products, exclusive launches, and community highlights delivered to your inbox.
                    </p>
                  </div>

                  {/* Newsletter Form */}
                  <div className="pt-4">
                    <NewsletterSignup
                      placeholder="Enter your email address"
                      buttonText="Subscribe"
                    />
                  </div>

                  {/* Trust Indicators */}
                  <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500 dark:text-slate-400 pt-2">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                      <span>Always free</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                      <span>No spam</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                      <span>Unsubscribe anytime</span>
                    </div>
                  </div>

                  {/* Privacy Policy Link */}
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    By subscribing, you agree to our{" "}
                    <Link href="/privacy" className="text-emerald-600 dark:text-emerald-400 hover:underline underline-offset-2">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 md:py-32 bg-gradient-to-br from-teal-600 via-emerald-600 to-cyan-600 relative overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-center space-y-10"
            >
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight">
                Ready to Get Discovered?
              </h2>
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
                Join the growing community of AI innovators. Share your creation with the world today.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center items-center pt-6">
                <Button size="lg" asChild className="text-lg px-8 py-7 rounded-full bg-white text-emerald-600 hover:bg-slate-100 shadow-2xl hover:shadow-white/20 transition-all duration-300">
                  <Link href="/dashboard/products/new">
                    <Rocket className="mr-2 w-5 h-5" />
                    Submit Your Product
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-lg px-8 py-7 rounded-full border-2 border-white text-white hover:bg-white/10 transition-all duration-300">
                  <Link href="/products">
                    Browse Products
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
