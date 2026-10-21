import { cache } from 'react'

import {
  getProductBySlugFromWooCommerce,
  getProductsFromWooCommerce,
  getAllProductSlugsFromWooCommerce,
  getAllProductSitemapEntriesFromWooCommerce,
  searchWooCommerceProducts,
} from '@/lib/woocommerce'

import { normalizeSlug } from '@/lib/woocommerce/normalizers'

import {
  getStoreCatalogProductIds,
} from '@/lib/store-api'

import type {
  CatalogFilterSelection,
  ProductSort,
} from '@/types/catalog'

import type {
  GetProductBySlugResponse,
  GetProductsResponse,
  ProductSummary,
} from '@/types/wordpress'

export interface GetProductsOptions {
  first: number
  page?: number
  after?: string
  category?: string
  search?: string
  filters?: CatalogFilterSelection
  sort?: ProductSort
}

export interface SearchProductsOptions {
  search: string
  first?: number
}

const MAX_PAGE_SIZE = 100
const MAX_SEARCH_RESULTS = 20
const MAX_SEARCH_LENGTH = 120
const MAX_FILTER_VALUE_LENGTH = 120
const MAX_SLUG_LENGTH = 200
const MAX_CATALOG_PAGE = 10_000
const MAX_TOTAL_COUNT = Number.MAX_SAFE_INTEGER

const CONTROL_CHARACTERS = /[\u0000-\u001F\u007F]/g
const INVALID_SLUG_CHARACTERS = /[\/\\\u0000-\u001F\u007F]/u

const FILTER_DEFINITIONS = [
  {
    key: 'stoneType',
    taxonomy: 'pa_stone-type',
  },
  {
    key: 'color',
    taxonomy: 'pa_color',
  },
  {
    key: 'application',
    taxonomy: 'pa_application',
  },
  {
    key: 'surfaceFinish',
    taxonomy: 'pa_surface-finish',
  },
] as const

function normalizeInteger(
  value: number | undefined,
  fallback: number,
  minimum: number,
  maximum: number,
): number {
  if (
    typeof value !== 'number' ||
    !Number.isFinite(value)
  ) {
    return fallback
  }

  return Math.min(
    maximum,
    Math.max(minimum, Math.floor(value)),
  )
}

function normalizePageNumber(value?: number): number {
  return normalizeInteger(
    value,
    1,
    1,
    MAX_CATALOG_PAGE,
  )
}

function normalizeCount(
  value: number,
  fallback = 0,
): number {
  if (
    typeof value !== 'number' ||
    !Number.isFinite(value)
  ) {
    return fallback
  }

  return normalizeInteger(
    value,
    fallback,
    0,
    MAX_TOTAL_COUNT,
  )
}

function decodeLegacyAfter(
  after?: string,
): number | undefined {
  if (
    typeof after !== 'string' ||
    !after ||
    after.length > 64
  ) {
    return undefined
  }

  try {
    const decoded = decodeURIComponent(after)

    if (!/^\d+$/.test(decoded)) {
      return undefined
    }

    const page = Number(decoded)

    if (
      !Number.isSafeInteger(page) ||
      page < 1
    ) {
      return undefined
    }

    return normalizePageNumber(page)
  } catch {
    return undefined
  }
}

function resolvePage(
  options: GetProductsOptions,
): number {
  if (typeof options.page === 'number') {
    return normalizePageNumber(options.page)
  }

  return decodeLegacyAfter(options.after) ?? 1
}

function normalizeSearchQuery(
  value?: string,
): string | undefined {
  if (typeof value !== 'string') {
    return undefined
  }

  const normalized = value
    .normalize('NFC')
    .replace(CONTROL_CHARACTERS, ' ')
    .replace(/\s+/gu, ' ')
    .trim()
    .slice(0, MAX_SEARCH_LENGTH)
    .trim()

  return normalized || undefined
}

function normalizeFilterValue(
  value: unknown,
): string | undefined {
  if (typeof value !== 'string') {
    return undefined
  }

  const normalized = value
    .normalize('NFC')
    .replace(CONTROL_CHARACTERS, ' ')
    .replace(/\s+/gu, ' ')
    .trim()

  if (
    !normalized ||
    normalized.length > MAX_FILTER_VALUE_LENGTH
  ) {
    return undefined
  }

  return normalized
}

function normalizeFilters(
  filters?: CatalogFilterSelection,
): CatalogFilterSelection {
  if (
    !filters ||
    typeof filters !== 'object' ||
    Array.isArray(filters)
  ) {
    return {}
  }

  return {
    stoneType: normalizeFilterValue(filters.stoneType),
    color: normalizeFilterValue(filters.color),
    application: normalizeFilterValue(filters.application),
    surfaceFinish: normalizeFilterValue(filters.surfaceFinish),
  }
}

/**
 * WooCommerce category filters expect a numeric category ID.
 *
 * A supplied but invalid value returns null so it cannot silently
 * turn into an unfiltered product query.
 */
function normalizeCategoryId(
  value?: string,
): string | undefined | null {
  if (value === undefined) {
    return undefined
  }

  if (typeof value !== 'string') {
    return null
  }

  const normalized = value.trim()

  if (!normalized) {
    return undefined
  }

  if (!/^\d{1,15}$/.test(normalized)) {
    return null
  }

  const numericId = Number(normalized)

  if (
    !Number.isSafeInteger(numericId) ||
    numericId <= 0
  ) {
    return null
  }

  return String(numericId)
}

function hasAttributeFilters(
  filters: CatalogFilterSelection,
): boolean {
  return FILTER_DEFINITIONS.some(
    ({ key }) => Boolean(filters[key]),
  )
}

function getSortConfig(
  sort?: ProductSort,
): {
  orderby: 'date' | 'price' | 'title'
  order: 'asc' | 'desc'
} {
  switch (sort) {
    case 'price-asc':
      return {
        orderby: 'price',
        order: 'asc',
      }

    case 'price-desc':
      return {
        orderby: 'price',
        order: 'desc',
      }

    case 'name-asc':
      return {
        orderby: 'title',
        order: 'asc',
      }

    default:
      return {
        orderby: 'date',
        order: 'desc',
      }
  }
}

function createEmptyProductsResult():
  GetProductsResponse['products'] {
  return {
    nodes: [],
    pageInfo: {
      hasNextPage: false,
      endCursor: null,
      total: 0,
    },
  }
}

function createPageInfo(
  currentPage: number,
  totalPages: number,
  total: number,
) {
  const safeCurrentPage = normalizePageNumber(currentPage)

  const safeTotalPages = Math.min(
    MAX_CATALOG_PAGE,
    normalizeCount(totalPages),
  )

  const safeTotal = normalizeCount(total)

  const hasNextPage =
    safeCurrentPage < safeTotalPages

  return {
    hasNextPage,
    endCursor: hasNextPage
      ? String(safeCurrentPage + 1)
      : null,
    total: safeTotal,
  }
}

function isValidProductId(
  value: unknown,
): value is string {
  if (
    typeof value !== 'string' ||
    !/^\d{1,15}$/.test(value)
  ) {
    return false
  }

  const id = Number(value)

  return Number.isSafeInteger(id) && id > 0
}

export const getProductBySlug = cache(
  async (
    slug: string,
  ): Promise<GetProductBySlugResponse['product']> => {
    if (
      typeof slug !== 'string' ||
      !slug.trim() ||
      slug.length > MAX_SLUG_LENGTH
    ) {
      return null
    }

    const normalizedSlug = normalizeSlug(slug)
      .normalize('NFC')
      .trim()

    if (
      !normalizedSlug ||
      normalizedSlug.length > MAX_SLUG_LENGTH ||
      INVALID_SLUG_CHARACTERS.test(normalizedSlug)
    ) {
      return null
    }

    return getProductBySlugFromWooCommerce(
      normalizedSlug,
    )
  },
)

export async function getProducts(
  options: GetProductsOptions,
): Promise<GetProductsResponse['products']> {
  if (
    !options ||
    typeof options !== 'object' ||
    Array.isArray(options)
  ) {
    return createEmptyProductsResult()
  }

  const perPage = normalizeInteger(
    options.first,
    12,
    1,
    MAX_PAGE_SIZE,
  )

  const page = resolvePage(options)
  const search = normalizeSearchQuery(options.search)
  const filters = normalizeFilters(options.filters)
  const category = normalizeCategoryId(options.category)

  // Never turn an invalid category into an unfiltered query.
  if (category === null) {
    return createEmptyProductsResult()
  }

  const { orderby, order } = getSortConfig(options.sort)

  /*
   * Attribute filtering uses the Store API.
   * Taxonomy names are controlled by the server.
   */
  if (hasAttributeFilters(filters)) {
    const attributes: {
      taxonomy: string
      slug: string
    }[] = []

    for (const definition of FILTER_DEFINITIONS) {
      const slug = filters[definition.key]

      if (slug) {
        attributes.push({
          taxonomy: definition.taxonomy,
          slug,
        })
      }
    }

    const filtered = await getStoreCatalogProductIds({
      page,
      perPage,
      search,
      category,
      attributes,
      orderby,
      order,
    })

    const filteredIds = [
      ...new Set(
        (Array.isArray(filtered.ids) ? filtered.ids : [])
          .filter(isValidProductId),
      ),
    ]

    if (filteredIds.length === 0) {
      return {
        nodes: [],
        pageInfo: createPageInfo(
          filtered.currentPage,
          filtered.totalPages,
          filtered.total,
        ),
      }
    }

    const hydrated = await getProductsFromWooCommerce({
      page: 1,
      perPage: filteredIds.length,
      include: filteredIds,
      orderby: 'include',
      order: 'asc',
    })

    const productsById = new Map<string, ProductSummary>(
      (Array.isArray(hydrated.products) ? hydrated.products : [])
        .map((product) => [
          String(product.id),
          product,
        ]),
    )

    // Preserve Store API order after loading full product data.
    const products = filteredIds
      .map((id) => productsById.get(id))
      .filter(
        (product): product is ProductSummary =>
          Boolean(product),
      )

    return {
      nodes: products,
      pageInfo: createPageInfo(
        filtered.currentPage,
        filtered.totalPages,
        filtered.total,
      ),
    }
  }

  const result = await getProductsFromWooCommerce({
    page,
    perPage,
    category,
    search,
    orderby,
    order,
  })

  return {
    nodes: Array.isArray(result.products)
      ? result.products
      : [],
    pageInfo: createPageInfo(
      result.currentPage,
      result.totalPages,
      result.total,
    ),
  }
}

export async function searchProducts(
  options: SearchProductsOptions,
): Promise<ProductSummary[]> {
  if (!options || typeof options !== 'object') {
    return []
  }

  const search = normalizeSearchQuery(options.search)

  if (!search || search.length < 2) {
    return []
  }

  const first = normalizeInteger(
    options.first,
    8,
    1,
    MAX_SEARCH_RESULTS,
  )

  return searchWooCommerceProducts(
    search,
    first,
  )
}

export async function getAllProductSitemapEntries() {
  return getAllProductSitemapEntriesFromWooCommerce()
}

export async function getAllProductSlugs(): Promise<string[]> {
  return getAllProductSlugsFromWooCommerce()
}