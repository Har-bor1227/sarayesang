import type {
  Product,
  ProductSummary,
} from '@/types/wordpress'

import {
  wcFetch,
  PRODUCTS_ENDPOINT,
} from './client'

import type {
  WooCommerceProductList,
  WooCommerceVariation,
} from './types'

import {
  normalizeSlug,
} from './normalizers'

import {
  mapProduct,
  mapProductSummary,
} from './mappers'

export interface WooCommerceProductQueryOptions {
  page?: number
  perPage?: number

  category?: string
  search?: string
  featured?: boolean

  include?: string[]

  orderby?:
    | 'date'
    | 'modified'
    | 'id'
    | 'include'
    | 'title'
    | 'slug'
    | 'price'
    | 'popularity'
    | 'rating'
    | 'menu_order'

  order?:
    | 'asc'
    | 'desc'
}

interface WooCommercePaginatedResult {
  products: ProductSummary[]
  total: number
  totalPages: number
  currentPage: number
}

export async function getProductsFromWooCommerce(
  options: WooCommerceProductQueryOptions = {},
): Promise<WooCommercePaginatedResult> {
  const page =
    Math.max(
      1,
      options.page ?? 1,
    )

  const perPage =
    Math.min(
      100,
      Math.max(
        1,
        options.perPage ?? 12,
      ),
    )

  const params =
    new URLSearchParams({
      status:
        'publish',

      page:
        String(page),

      per_page:
        String(perPage),

      orderby:
        options.orderby ??
        'date',

      order:
        options.order ??
        'desc',
    })

  if (
    options.category
  ) {
    params.set(
      'category',
      options.category,
    )
  }

  if (
    options.search
  ) {
    const normalizedSearch =
      options.search.trim()

    if (
      normalizedSearch.length >
      0
    ) {
      params.set(
        'search',
        normalizedSearch,
      )
    }
  }

  if (
    typeof options.featured ===
    'boolean'
  ) {
    params.set(
      'featured',
      String(
        options.featured,
      ),
    )
  }

  if (
    options.include &&
    options.include.length >
      0
  ) {
    params.set(
      'include',
      options.include.join(','),
    )
  }

  const {
    data,
    headers,
  } =
    await wcFetch<
      WooCommerceProductList
    >(
      PRODUCTS_ENDPOINT,
      params,
      300,
    )

  const rawProducts =
    Array.isArray(
      data,
    )
      ? data
      : []

  const totalHeader =
    headers.get(
      'X-WP-Total',
    )

  const total =
    totalHeader !== null &&
    totalHeader !== ''
      ? Number(
          totalHeader,
        )
      : rawProducts.length

  const totalPagesHeader =
    headers.get(
      'X-WP-TotalPages',
    )

  const totalPages =
    totalPagesHeader !== null &&
    totalPagesHeader !== ''
      ? Number(
          totalPagesHeader,
        )
      : (
          rawProducts.length <
          perPage
            ? page
            : page + 1
        )

  return {
    products:
      rawProducts.map(
        mapProductSummary,
      ),

    total:
      Number.isFinite(
        total,
      )
        ? total
        : rawProducts.length,

    totalPages:
      Number.isFinite(
        totalPages,
      )
        ? totalPages
        : page,

    currentPage:
      page,
  }
}

export async function getProductVariationsFromWooCommerce(
  productId: number,
): Promise<WooCommerceVariation[]> {
  if (
    !Number.isInteger(
      productId,
    ) ||
    productId <= 0
  ) {
    return []
  }

  const endpoint =
    `${PRODUCTS_ENDPOINT}/${productId}/variations`

  const params =
    new URLSearchParams({
      status:
        'publish',

      per_page:
        '100',

      orderby:
        'menu_order',

      order:
        'asc',
    })

  const {
    data,
  } =
    await wcFetch<
      WooCommerceVariation[]
    >(
      endpoint,
      params,
      300,
    )

  return Array.isArray(
    data,
  )
    ? data
    : []
}

export async function getProductBySlugFromWooCommerce(
  slug: string,
): Promise<Product | null> {
  const normalizedSlug =
    normalizeSlug(
      slug,
    )

  if (
    !normalizedSlug
  ) {
    return null
  }

  const params =
    new URLSearchParams({
      status:
        'publish',

      slug:
        normalizedSlug,

      per_page:
        '1',
    })

  const {
    data,
  } =
    await wcFetch<
      WooCommerceProductList
    >(
      PRODUCTS_ENDPOINT,
      params,
      300,
    )

  const product =
    Array.isArray(
      data,
    )
      ? data[0]
      : undefined

  if (!product) {
    return null
  }

  const variations =
    product.type ===
      'variable'
      ? await getProductVariationsFromWooCommerce(
          product.id,
        )
      : undefined

  return mapProduct(
    product,
    variations,
  )
}

export async function searchWooCommerceProducts(
  search: string,
  first = 8,
): Promise<ProductSummary[]> {
  const normalizedSearch =
    search.trim()

  if (
    normalizedSearch.length <
    2
  ) {
    return []
  }

  const params =
    new URLSearchParams({
      status:
        'publish',

      search:
        normalizedSearch,

      per_page:
        String(
          Math.min(
            Math.max(
              first,
              1,
            ),
            20,
          ),
        ),

      orderby:
        'date',

      order:
        'desc',
    })

  const {
    data,
  } =
    await wcFetch<
      WooCommerceProductList
    >(
      PRODUCTS_ENDPOINT,
      params,
      60,
    )

  if (
    !Array.isArray(
      data,
    )
  ) {
    return []
  }

  return data.map(
    mapProductSummary,
  )
}

export async function getAllProductSlugsFromWooCommerce(): Promise<
  string[]
> {
  const slugs: string[] =
    []

  let page = 1

  while (
    true
  ) {
    const params =
      new URLSearchParams({
        status:
          'publish',

        page:
          String(page),

        per_page:
          '100',

        orderby:
          'date',

        order:
          'desc',
      })

    const {
      data,
    } =
      await wcFetch<
        WooCommerceProductList
      >(
        PRODUCTS_ENDPOINT,
        params,
        300,
      )

    if (
      !Array.isArray(
        data,
      ) ||
      data.length ===
        0
    ) {
      break
    }

    slugs.push(
      ...data
        .map(
          (
            product,
          ) =>
            normalizeSlug(
              product.slug,
            ),
        )
        .filter(Boolean),
    )

    if (
      data.length <
      100
    ) {
      break
    }

    page += 1

    if (
      page > 100
    ) {
      break
    }
  }

  return Array.from(
    new Set(
      slugs,
    ),
  )
}

export interface ProductSitemapEntry {
  slug: string
  lastModified?: string
  categoryIds: string[]
}

export async function getAllProductSitemapEntriesFromWooCommerce(): Promise<
  ProductSitemapEntry[]
> {
  const entries = new Map<
    string,
    ProductSitemapEntry
  >()

  let page = 1

  while (
    page <= 500
  ) {
    const params =
      new URLSearchParams({
        status:
          'publish',

        page:
          String(page),

        per_page:
          '100',

        orderby:
          'modified',

        order:
          'desc',
      })

    const {
      data,
    } =
      await wcFetch<
        WooCommerceProductList
      >(
        PRODUCTS_ENDPOINT,
        params,
        300,
      )

    if (
      !Array.isArray(
        data,
      ) ||
      data.length ===
        0
    ) {
      break
    }

    for (
      const product of
        data
    ) {
      const slug =
        normalizeSlug(
          product.slug,
        ).trim()

      if (
        !slug ||
        entries.has(
          slug,
        )
      ) {
        continue
      }

      entries.set(
        slug,
        {
          slug,

          lastModified:
            product.date_modified?.trim() ||
            undefined,

          categoryIds:
            (
              product.categories ??
              []
            ).map(
              (
                category,
              ) =>
                String(
                  category.id,
                ),
            ),
        },
      )
    }

    if (
      entries.size >
      50000
    ) {
      throw new Error(
        'Product sitemap exceeds the 50,000 URL limit. Split it into multiple sitemaps.',
      )
    }

    if (
      data.length <
      100
    ) {
      break
    }

    if (
      page ===
      500
    ) {
      throw new Error(
        'Product sitemap reached the 50,000 URL limit. Split it into multiple sitemaps.',
      )
    }

    page += 1
  }

  return Array.from(
    entries.values(),
  )
}