import { cache } from 'react'

import {
  getProductBySlugFromWooCommerce,
  getProductsFromWooCommerce,
  getAllProductSlugsFromWooCommerce,
  searchWooCommerceProducts,
} from '@/lib/woocommerce'

import type {
  GetProductBySlugResponse,
  GetProductsResponse,
  ProductSummary,
} from '@/types/wordpress'

export interface GetProductsOptions {
  first: number
  after?: string
  category?: string
}

export interface SearchProductsOptions {
  search: string
  first?: number
}

function decodePageCursor(
  after?: string,
): number {
  if (!after) {
    return 1
  }

  const decoded =
    decodeURIComponent(
      after,
    )

  const page =
    Number(decoded)

  return Number.isFinite(page) &&
    page >= 1
    ? page
    : 1
}

export const getProductBySlug =
  cache(
    async (
      slug: string,
    ): Promise<
      GetProductBySlugResponse['product']
    > => {
      return getProductBySlugFromWooCommerce(
        slug,
      )
    },
  )

export async function getProducts(
  options: GetProductsOptions,
): Promise<
  GetProductsResponse['products']
> {
  const perPage =
    Math.max(
      1,
      Math.min(
        options.first,
        100,
      ),
    )

  const page =
    decodePageCursor(
      options.after,
    )

  const result =
    await getProductsFromWooCommerce({
      page,

      perPage,

      category:
        options.category,
    })

  const endCursor =
    result.currentPage <
    result.totalPages
      ? String(
          result.currentPage + 1,
        )
      : null

  return {
    nodes:
      result.products,

    pageInfo: {
      hasNextPage:
        Boolean(
          endCursor,
        ),

      endCursor,

      total:
        result.total,
    },
  }
}

export async function searchProducts(
  options: SearchProductsOptions,
): Promise<ProductSummary[]> {
  const search =
    options.search.trim()

  if (
    search.length < 2
  ) {
    return []
  }

  const first =
    Math.min(
      Math.max(
        options.first ?? 8,
        1,
      ),
      20,
    )

  return searchWooCommerceProducts(
    search,
    first,
  )
}

export async function getAllProductSlugs(): Promise<
  string[]
> {
  return getAllProductSlugsFromWooCommerce()
}