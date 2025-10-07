/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable Turbopack for faster builds (Next.js 15+)
  turbopack: {
    // Turbopack configuration
  },
  // Enable TypeScript strict mode
  typescript: {
    ignoreBuildErrors: false,
  },
  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Output configuration - can be 'standalone' for Docker deployment
  output: 'standalone',
  // Image optimization settings
  images: {
    domains: ['image.pollinations.ai'],
    unoptimized: false,
  },
  // Enable React strict mode
  reactStrictMode: true,
  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
}

export default nextConfig