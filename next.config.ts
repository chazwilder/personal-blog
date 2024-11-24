import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  experimental: {
    optimizePackageImports: ["@clerk/nextjs", "@sentry/nextjs"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: "standalone",
  outputFileTracingIncludes: {
    "/app/public/uploads": ["**/*"],
  },
  webpack: (config, { isServer }) => {
    // Handle MessageEvent polyfill for Clerk
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }

    // Exclude specific packages from Edge runtime
    if (isServer) {
      config.externals = [...(config.externals || []), "@clerk/shared"];
    }

    return config;
  },
  // Add runtime configuration
  serverRuntimeConfig: {
    // Runtime config for server-side
    nodeEnv: process.env.NODE_ENV,
  },
  publicRuntimeConfig: {
    // Runtime config for client-side
    environment: process.env.NODE_ENV,
  },
};

// Additional Sentry configuration options
const sentryWebpackPluginOptions = {
  org: "chaz-wilder",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  reactComponentAnnotation: {
    enabled: true,
  },
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
  // Add these additional Sentry options
  include: ".",
  ignore: ["node_modules", "next.config.js"],
  dryRun: process.env.NODE_ENV !== "production",
  disableServerWebpackPlugin: false,
  disableClientWebpackPlugin: false,
};

// Create the middleware-aware configuration
const config = withSentryConfig(nextConfig, sentryWebpackPluginOptions);

export default config;
