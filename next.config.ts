import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Optimize images
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Experimental features
  experimental: {
    optimizePackageImports: [
      "next-themes",
      "framer-motion",
      "lucide-react",
      "@tabler/icons-react"
    ],
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  
  // External packages for server components
  serverExternalPackages: [],
};

export default nextConfig;
