import { cache } from 'react'

import type {
  Product,
} from '@/types/wordpress'

import {
  getProductBySlug,
} from '@/lib/repositories/product-repository'

import {
  getProductSeo,
} from '@/lib/repositories/seo-repository'

export interface ProductPageData {
  product: Product | null

  seo: Awaited<
    ReturnType<typeof getProductSeo>
  >
}

function normalizeSlug(
  slug: string,
): string {
  try {
    return decodeURIComponent(
      slug,
    )
  } catch {
    return slug
  }
}

export const getProductPageData =
  cache(
    async (
      rawSlug: string,
    ): Promise<ProductPageData> => {
      const slug =
        normalizeSlug(
          rawSlug,
        ).trim()

      if (!slug) {
        return {
          product: null,
          seo: null,
        }
      }

      const [
        product,
        seo,
      ] = await Promise.all([
        getProductBySlug(
          slug,
        ),

        getProductSeo(
          slug,
        ),
      ])

      return {
        product,
        seo,
      }
    },
  )