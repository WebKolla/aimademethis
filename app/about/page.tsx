"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Target,
  Users,
  Heart,
  Rocket,
  TrendingUp,
  MessageSquare,
  Star,
  Eye,
  Zap,
  Award,
  Globe,
  Shield,
  CheckCircle,
} from "lucide-react";

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

const values = [
  {
    icon: Users,
    title: "Community First",
    description: "We believe in the power of community. Every feature is designed to connect creators with users who appreciate their work.",
  },
  {
    icon: Heart,
    title: "Creator Support",
    description: "Supporting AI creators is at our core. We provide tools and visibility to help innovators succeed.",
  },
  {
    icon: Shield,
    title: "Transparency",
    description: "Honest reviews, authentic engagement, and genuine feedback. No fake metrics, no hidden agendas.",
  },
  {
    icon: Globe,
    title: "Accessible Pricing",
    description: "Free tier to get started, with premium plans as you scale. Everyone deserves a platform to showcase their AI creations.",
  },
];

const features = [
  {
    icon: Rocket,
    title: "Product Showcase",
    description: "Launch your AI products with detailed pages featuring screenshots, demos, and comprehensive information.",
  },
  {
    icon: TrendingUp,
    title: "Trending Algorithm",
    description: "Fair, transparent ranking that surfaces the best products based on community engagement and recency.",
  },
  {
    icon: MessageSquare,
    title: "Discussion Forums",
    description: "Engage in meaningful conversations through comments, reviews, and direct feedback.",
  },
  {
    icon: Star,
    title: "Reviews & Ratings",
    description: "Build credibility through authentic user reviews and 5-star ratings from real users.",
  },
  {
    icon: Eye,
    title: "Discovery Tools",
    description: "Advanced search, filtering by categories, tags, pricing, and AI models used.",
  },
  {
    icon: Award,
    title: "Creator Profiles",
    description: "Build your reputation with detailed profiles, follower counts, and product portfolios.",
  },
];

const stats = [
  { value: "1,000+", label: "AI Products" },
  { value: "5,000+", label: "Active Users" },
  { value: "10,000+", label: "Monthly Visitors" },
  { value: "3", label: "Flexible Plans" },
];

export default function AboutPage() {
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
                About Us
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight">
              <span className="block text-gray-900 dark:text-white">Empowering AI Creators</span>
              <span className="block mt-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                One Product at a Time
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto">
              AIMMT (AI Made Me This) is the premier discovery platform for AI products,
              connecting innovative creators with enthusiastic users worldwide.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={container}
            className="max-w-5xl mx-auto space-y-16"
          >
            <motion.div variants={item} className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-xl">
                <Target className="w-10 h-10" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
                Our Mission
              </h2>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto">
                To democratize AI product discovery by creating an accessible, transparent, and community-driven
                platform where creators get the visibility they deserve and users find the AI tools they need.
              </p>
            </motion.div>

            <motion.div variants={item} className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Why We Exist</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  The AI landscape is exploding with innovation, but great products often go unnoticed.
                  We created AIMMT to solve this problem - giving every AI creator, regardless of budget or
                  marketing resources, a platform to shine.
                </p>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-1" />
                  <p className="text-slate-600 dark:text-slate-300">
                    Fair pricing with generous free tier
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-1" />
                  <p className="text-slate-600 dark:text-slate-300">
                    Fair, algorithm-driven rankings
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-1" />
                  <p className="text-slate-600 dark:text-slate-300">
                    Community-powered feedback and engagement
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">What Makes Us Different</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Unlike other platforms that prioritize paid promotions, we focus on genuine community
                  engagement. Every upvote, review, and comment comes from real users who care about
                  AI innovation.
                </p>
                <div className="flex items-start gap-3">
                  <Zap className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-1" />
                  <p className="text-slate-600 dark:text-slate-300">
                    Instant publishing - no approval delays
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-1" />
                  <p className="text-slate-600 dark:text-slate-300">
                    Detailed product pages with technical insights
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-1" />
                  <p className="text-slate-600 dark:text-slate-300">
                    Built by developers, for developers
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={container}
            className="space-y-16"
          >
            <motion.div variants={item} className="text-center space-y-6">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
                Our Values
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto">
                Principles that guide everything we do
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {values.map((value) => (
                <motion.div
                  key={value.title}
                  variants={item}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-teal-500/10"
                >
                  <div className="space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-lg group-hover:shadow-teal-500/50 transition-all duration-300">
                      <value.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{value.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={container}
            className="space-y-16"
          >
            <motion.div variants={item} className="text-center space-y-6">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
                Platform Features
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto">
                Everything you need to discover and showcase AI products
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {features.map((feature) => (
                <motion.div
                  key={feature.title}
                  variants={item}
                  whileHover={{ scale: 1.03 }}
                  className="p-8 rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-lg">
                      <feature.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{feature.title}</h3>
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

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-teal-600 via-emerald-600 to-cyan-600">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={container}
            className="space-y-12"
          >
            <motion.div variants={item} className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                Growing Every Day
              </h2>
              <p className="text-xl text-white/90">
                Join thousands of creators and users in our community
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={item}
                  className="text-center space-y-2"
                >
                  <div className="text-5xl md:text-6xl font-black text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm md:text-base text-white/90 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
              Ready to Join Our Community?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Whether you&apos;re a creator looking to showcase your AI product or a user
              searching for the perfect AI tool, you belong here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <Button size="lg" asChild className="text-lg px-8 py-7 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 shadow-xl">
                <Link href="/products/new">
                  <Rocket className="mr-2 w-5 h-5" />
                  Submit Your Product
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8 py-7 rounded-full border-2">
                <Link href="/products">
                  Explore Products
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
