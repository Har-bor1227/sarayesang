import { cache } from 'react'

import {
  getRankMathSEO,
} from '@/lib/rank-math'

import {
  WORDPRESS_URL,
} from '@/lib/constants'

function normalizeWordPressUrl(
  value: string,
): string {
  if (
    value.startsWith(
      'http://',
    ) ||
    value.startsWith(
      'https://',
    )
  ) {
    return value
  }

  return `${WORDPRESS_URL.replace(
    /\/+$/,
    '',
  )}/${value.replace(
    /^\/+/,
    '',
  )}`
}

function logSeoFallback(
  context: string,
  error: unknown,
): void {
  if (
    process.env.NODE_ENV !==
    'production'
  ) {
    console.error(
      `[SEO fallback] ${context}`,
      error,
    )
  }
}

export const getSeoForWordPressUrl =
  cache(
    async (
      url: string,
    ) => {
      const normalizedUrl =
        normalizeWordPressUrl(
          url,
        )

      try {
        return await getRankMathSEO(
          normalizedUrl,
          3600,
        )
      } catch (error) {
        logSeoFallback(
          `Failed to load SEO for ${normalizedUrl}`,
          error,
        )

        return null
      }
    },
  )

export const getProductSeo =
  cache(
    async (
      slug: string,
    ) => {
      const url =
        `${WORDPRESS_URL.replace(
          /\/+$/,
          '',
        )}/product/${encodeURIComponent(
          slug,
        )}/`

      try {
        return await getRankMathSEO(
          url,
          300,
        )
      } catch (error) {
        logSeoFallback(
          `Failed to load product SEO for slug "${slug}"`,
          error,
        )

        return null
      }
    },
  )

export const getPostSeo =
  cache(
    async (
      uri: string,
    ) => {
      const url =
        normalizeWordPressUrl(
          uri,
        )

      try {
        return await getRankMathSEO(
          url,
          300,
        )
      } catch (error) {
        logSeoFallback(
          `Failed to load post SEO for ${url}`,
          error,
        )

        return null
      }
    },
  )

export const getProductCategorySeo =
  cache(
    async (
      slug: string,
    ) => {
      const url =
        `${WORDPRESS_URL.replace(
          /\/+$/,
          '',
        )}/product-category/${encodeURIComponent(
          slug,
        )}/`

      try {
        return await getRankMathSEO(
          url,
          300,
        )
      } catch (error) {
        logSeoFallback(
          `Failed to load product category SEO for slug "${slug}"`,
          error,
        )

        return null
      }
    },
  )