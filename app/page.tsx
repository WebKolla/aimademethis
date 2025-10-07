"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
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
    title: "100% Free",
    description: "No hidden costs, no premium tiers. Share your AI creations without spending a dime.",
  },
];

const features = [
  {
    icon: Rocket,
    title: "Launch Fast",
    description: "Submit your product in minutes with our streamlined submission process",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Award,
    title: "Get Recognition",
    description: "Stand out with upvotes, reviews, and community engagement",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Target,
    title: "Reach Your Audience",
    description: "Connect with developers, founders, and AI enthusiasts worldwide",
    color: "from-orange-500 to-yellow-500",
  },
  {
    icon: Globe,
    title: "Global Visibility",
    description: "Showcase your work to an international community of innovators",
    color: "from-green-500 to-emerald-500",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section with Animated Background */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-gray-950">
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
              className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-300/20 dark:bg-purple-500/10 rounded-full blur-3xl"
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
              className="absolute bottom-1/4 -right-48 w-96 h-96 bg-blue-300/20 dark:bg-blue-500/10 rounded-full blur-3xl"
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
                <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold shadow-lg shadow-purple-500/30">
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
                <span className="block">Where AI Creators</span>
                <span className="block mt-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                  Shine Bright
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed font-medium"
              >
                Amplify your AI products to thousands of potential users.{" "}
                <span className="text-purple-600 dark:text-purple-400 font-bold">
                  Get discovered. Get feedback. Get traction.
                </span>{" "}
                All for free.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-5 justify-center items-center pt-6"
              >
                <Button size="lg" asChild className="text-lg px-8 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Link href="/products/new">
                    <Rocket className="mr-2 w-5 h-5" />
                    Launch Your Product
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6 rounded-full border-2 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-all duration-300">
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
                className="flex flex-wrap items-center justify-center gap-8 pt-8 text-sm text-gray-500 dark:text-gray-400"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-medium">100% Free Forever</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="font-medium">No Credit Card Required</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                  <span className="font-medium">Instant Publishing</span>
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
            <div className="w-6 h-10 border-2 border-purple-600 dark:border-purple-400 rounded-full p-1">
              <motion.div
                animate={{ y: [0, 16, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-3 bg-purple-600 dark:bg-purple-400 rounded-full mx-auto"
              />
            </div>
          </motion.div>
        </section>

        {/* Why Advertise Section */}
        <section className="py-24 md:py-32 bg-white dark:bg-gray-950 relative overflow-hidden">
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
                <h2 className="text-5xl md:text-6xl font-black tracking-tight">
                  Why Showcase Here?
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  Join hundreds of AI creators who are already getting the visibility they deserve
                </p>
              </motion.div>

              {/* Benefits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    variants={item}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="group p-8 rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-300 shadow-lg hover:shadow-2xl"
                  >
                    <div className="space-y-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg group-hover:shadow-purple-500/50 transition-all duration-300">
                        <benefit.icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-bold">{benefit.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
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
        <section className="py-24 md:py-32 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-950/20 dark:to-gray-900 relative overflow-hidden">
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
                <h2 className="text-5xl md:text-6xl font-black tracking-tight">
                  Simple. Fast. Effective.
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  Get your AI product live in minutes, not hours
                </p>
              </motion.div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    variants={item}
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    className="group relative overflow-hidden p-8 rounded-3xl bg-white dark:bg-gray-900 border-2 border-transparent hover:border-purple-500 transition-all duration-300 shadow-xl hover:shadow-2xl"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    <div className="relative space-y-4">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 group-hover:from-purple-500 group-hover:to-blue-500 transition-all duration-300">
                        <feature.icon className="w-7 h-7 text-gray-700 dark:text-gray-300 group-hover:text-white transition-colors duration-300" />
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-4xl font-black text-gray-200 dark:text-gray-800">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h3 className="text-xl font-bold flex-1">{feature.title}</h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="py-24 bg-white dark:bg-gray-950 border-y border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={container}
              className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-5xl mx-auto"
            >
              {[
                { value: "1,000+", label: "AI Products" },
                { value: "5,000+", label: "Active Users" },
                { value: "10,000+", label: "Monthly Visitors" },
                { value: "50+", label: "New This Week" },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={item}
                  className="text-center space-y-2"
                >
                  <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 md:py-32 bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 relative overflow-hidden">
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
                <Button size="lg" asChild className="text-lg px-8 py-6 rounded-full bg-white text-purple-600 hover:bg-gray-100 shadow-2xl hover:shadow-white/20 transition-all duration-300">
                  <Link href="/products/new">
                    <Rocket className="mr-2 w-5 h-5" />
                    Submit Your Product
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6 rounded-full border-2 border-white text-white hover:bg-white/10 transition-all duration-300">
                  <Link href="/products">
                    Browse Products
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
