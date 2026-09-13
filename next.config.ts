import type { NextConfig } from 'next'

const wordpressUrl =
  process.env.NEXT_PUBLIC_WORDPRESS_URL ||
  process.env.WORDPRESS_URL ||
  'https://sarayesang.com'

const wordpressHostname = (() => {
  try {
    return new URL(wordpressUrl).hostname
  } catch {
    return 'sarayesang.com'
  }
})()

const isProduction =
  process.env.NODE_ENV === 'production'

const contentSecurityPolicy = [
  "default-src 'self'",

  isProduction
    ? "script-src 'self' 'unsafe-inline'"
    : "script-src 'self' 'unsafe-inline' 'unsafe-eval'",

  "style-src 'self' 'unsafe-inline'",

  "img-src 'self' data: blob: https:",

  "font-src 'self' data:",

  "connect-src 'self' https:",

  "frame-src 'self' https://www.google.com https://maps.google.com",

  "object-src 'none'",

  "base-uri 'self'",

  "form-action 'self'",

  "frame-ancestors 'self'",

  "upgrade-insecure-requests",
].join('; ')

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: wordpressHostname,
        pathname: '/**',
      },
    ],

    formats: [
      'image/avif',
      'image/webp',
    ],

    deviceSizes: [
      640,
      750,
      828,
      1080,
      1200,
      1920,
    ],

    imageSizes: [
      16,
      32,
      48,
      64,
      96,
      128,
      256,
      384,
    ],

    minimumCacheTTL: 86400,
  },

  poweredByHeader: false,

  compress: true,

  reactStrictMode: true,

  experimental: {
    optimizePackageImports: [
      'lucide-react',
    ],
  },

  async headers() {
    return [
      {
        source: '/(.*)',

        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },

          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },

          {
            key: 'Referrer-Policy',
            value:
              'strict-origin-when-cross-origin',
          },

          {
            key: 'Permissions-Policy',
            value:
              'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },

          {
            key: 'Strict-Transport-Security',
            value:
              'max-age=63072000; includeSubDomains; preload',
          },

          {
            key: 'Cross-Origin-Opener-Policy',
            value:
              'same-origin-allow-popups',
          },

          {
            key: 'Content-Security-Policy',
            value:
              contentSecurityPolicy,
          },
        ],
      },
    ]
  },
}

export default nextConfig