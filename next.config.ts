import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
      },
      {
        protocol: "https",
        hostname: "static.grammarly.com",
      },
      {
        protocol: "https",
        hostname: "ppl-ai-public.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "www.anthropic.com",
      },
      {
        protocol: "https",
        hostname: "www.notion.so",
      },
      {
        protocol: "https",
        hostname: "cdn.midjourney.com",
      },
      {
        protocol: "https",
        hostname: "assets.website-files.com",
      },
    ],
  },
  serverActions: {
    bodySizeLimit: "3mb",
  },
};

export default nextConfig;
