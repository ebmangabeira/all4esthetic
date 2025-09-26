import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["all4esthetic.com"],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
