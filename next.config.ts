import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Fail build if there are ESLint errors
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Fail build if there are TypeScript errors
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
