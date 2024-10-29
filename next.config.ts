import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["pbs.twimg.com", "assets.aceternity.com"],
  },
};

export default nextConfig;
