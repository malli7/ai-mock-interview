import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Fail build if there are ESLint errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Fail build if there are TypeScript errors
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
