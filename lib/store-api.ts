import 'server-only'

import {
  WORDPRESS_URL,
} from '@/lib/constants'

const REQUEST_TIMEOUT_MS = 15_000
const MAX_RESPONSE_BYTES = 10 * 1024 * 1024
const MAX_PAGE = 10_000
const MAX_PER_PAGE = 100
const MAX_SEARCH_LENGTH = 120
const MAX_FILTER_SLUG_LENGTH = 120

const STORE_API_ROUTE = '/wc/store/v1/products'

const ALLOWED_ATTRIBUTE_TAXONOMIES = new Set([
  'pa_stone-type',
  'pa_color',
  'pa_application',
  'pa_surface-finish',
])

const ALLOWED_ORDER_BY = new Set([
  'date',
  'price',
  'title',
  'popularity',
  'rating',
  'menu_order',
])

const ALLOWED_ORDER = new Set([
  'asc',
  'desc',
])

export interface StoreCatalogAttributeFilter {
  taxonomy: string
  slug: string
}

export interface StoreCatalogQuery {
  page: number
  perPage: number

  search?: string
  category?: string

  attributes?: StoreCatalogAttributeFilter[]

  orderby?:
    | 'date'
    | 'price'
    | 'title'
    | 'popularity'
    | 'rating'
    | 'menu_order'

  order?: 'asc' | 'desc'
}

export interface StoreCatalogResult {
  ids: string[]
  total: number
  totalPages: number
  currentPage: number
}

interface StoreProductId {
  id: number
}

class StoreApiResponseTooLargeError extends Error {
  constructor() {
    super('WooCommerce Store API response exceeded the size limit.')
    this.name = 'StoreApiResponseTooLargeError'
  }
}

function parseWordPressBaseUrl(value: string): URL {
  let url: URL

  try {
    url = new URL(value)
  } catch {
    throw new Error(
      'WORDPRESS_URL must be a valid absolute URL.',
    )
  }

  const isLocalDevelopmentHost =
    process.env.NODE_ENV !== 'production' &&
    ['localhost', '127.0.0.1', '[::1]'].includes(
      url.hostname,
    )

  if (
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    (
      url.protocol !== 'https:' &&
      !(url.protocol === 'http:' && isLocalDevelopmentHost)
    )
  ) {
    throw new Error(
      'WORDPRESS_URL must use HTTPS, except for local development.',
    )
  }

  return url
}

const WORDPRESS_BASE_URL =
  parseWordPressBaseUrl(WORDPRESS_URL)

function createStoreApiUrl(): URL {
  const url = new URL(WORDPRESS_BASE_URL.toString())

  const basePath =
    url.pathname.replace(/\/+$/, '')

  url.pathname =
    `${basePath}/index.php`

  url.search = ''
  url.hash = ''

  url.searchParams.set(
    'rest_route',
    STORE_API_ROUTE,
  )

  return url
}

const STORE_API_BASE_URL =
  createStoreApiUrl()

function normalizeInteger(
  value: number,
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
    Math.max(
      minimum,
      Math.floor(value),
    ),
  )
}

function normalizeSearch(
  value?: string,
): string | undefined {
  if (typeof value !== 'string') {
    return undefined
  }

  const normalized = value
    .normalize('NFC')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/gu, ' ')
    .trim()
    .slice(0, MAX_SEARCH_LENGTH)
    .trim()

  return normalized || undefined
}

function normalizeCategory(
  value?: string,
): string | undefined {
  if (
    typeof value !== 'string' ||
    !value.trim()
  ) {
    return undefined
  }

  const category = value.trim()

  if (!/^\d{1,15}$/.test(category)) {
    throw new Error(
      'Invalid WooCommerce category identifier.',
    )
  }

  const numericCategory = Number(category)

  if (
    !Number.isSafeInteger(numericCategory) ||
    numericCategory <= 0
  ) {
    throw new Error(
      'Invalid WooCommerce category identifier.',
    )
  }

  return String(numericCategory)
}

function normalizeAttributes(
  attributes?: StoreCatalogAttributeFilter[],
): StoreCatalogAttributeFilter[] {
  if (!attributes?.length) {
    return []
  }

  if (
    !Array.isArray(attributes) ||
    attributes.length > ALLOWED_ATTRIBUTE_TAXONOMIES.size
  ) {
    throw new Error(
      'Invalid WooCommerce attribute filters.',
    )
  }

  const seenTaxonomies = new Set<string>()

  return attributes.map((attribute) => {
    if (
      !attribute ||
      typeof attribute.taxonomy !== 'string' ||
      typeof attribute.slug !== 'string'
    ) {
      throw new Error(
        'Invalid WooCommerce attribute filter.',
      )
    }

    const taxonomy = attribute.taxonomy.trim()
    const slug = attribute.slug
      .normalize('NFC')
      .trim()

    if (
      !ALLOWED_ATTRIBUTE_TAXONOMIES.has(taxonomy) ||
      !slug ||
      slug.length > MAX_FILTER_SLUG_LENGTH ||
      /[\u0000-\u001F\u007F]/u.test(slug) ||
      seenTaxonomies.has(taxonomy)
    ) {
      throw new Error(
        'Invalid WooCommerce attribute filter.',
      )
    }

    seenTaxonomies.add(taxonomy)

    return {
      taxonomy,
      slug,
    }
  })
}

function normalizeOrderBy(
  value: StoreCatalogQuery['orderby'],
): NonNullable<StoreCatalogQuery['orderby']> {
  if (
    typeof value === 'string' &&
    ALLOWED_ORDER_BY.has(value)
  ) {
    return value as NonNullable<
      StoreCatalogQuery['orderby']
    >
  }

  return 'date'
}

function normalizeOrder(
  value: StoreCatalogQuery['order'],
): NonNullable<StoreCatalogQuery['order']> {
  if (
    typeof value === 'string' &&
    ALLOWED_ORDER.has(value)
  ) {
    return value as NonNullable<
      StoreCatalogQuery['order']
    >
  }

  return 'desc'
}

function isStoreProductId(
  value: unknown,
): value is StoreProductId {
  if (
    typeof value !== 'object' ||
    value === null ||
    !('id' in value)
  ) {
    return false
  }

  const id = value.id

  return (
    typeof id === 'number' &&
    Number.isSafeInteger(id) &&
    id > 0
  )
}

async function cancelResponseBody(
  response: Response,
): Promise<void> {
  await response.body
    ?.cancel()
    .catch(() => undefined)
}

async function readResponseTextWithLimit(
  response: Response,
  limit: number,
): Promise<string> {
  const contentLength =
    response.headers.get('content-length')

  if (contentLength !== null) {
    if (!/^\d+$/.test(contentLength)) {
      await cancelResponseBody(response)

      throw new Error(
        'WooCommerce Store API returned an invalid Content-Length header.',
      )
    }

    const declaredLength = Number(contentLength)

    if (
      !Number.isSafeInteger(declaredLength) ||
      declaredLength < 0
    ) {
      await cancelResponseBody(response)

      throw new Error(
        'WooCommerce Store API returned an invalid Content-Length header.',
      )
    }

    if (declaredLength > limit) {
      await cancelResponseBody(response)

      throw new StoreApiResponseTooLargeError()
    }
  }

  if (!response.body) {
    throw new Error(
      'WooCommerce Store API returned an empty response.',
    )
  }

  const reader = response.body.getReader()
  const chunks: Uint8Array[] = []

  let totalBytes = 0

  try {
    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        break
      }

      totalBytes += value.byteLength

      if (totalBytes > limit) {
        await reader.cancel().catch(() => undefined)

        throw new StoreApiResponseTooLargeError()
      }

      chunks.push(value)
    }
  } finally {
    reader.releaseLock()
  }

  const bytes = Buffer.concat(
    chunks,
    totalBytes,
  )

  try {
    return new TextDecoder('utf-8', {
      fatal: true,
    }).decode(bytes)
  } catch {
    throw new Error(
      'WooCommerce Store API returned invalid UTF-8 content.',
    )
  }
}

async function storeFetch<T>(
  searchParams: URLSearchParams,
): Promise<{
  data: T
  headers: Headers
}> {
  const url =
    new URL(STORE_API_BASE_URL.toString())

  for (const [key, value] of searchParams.entries()) {
    if (key === 'rest_route') {
      throw new Error(
        'The REST route cannot be overridden.',
      )
    }

    url.searchParams.append(key, value)
  }

  const controller = new AbortController()

  const timeout = setTimeout(() => {
    controller.abort()
  }, REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(
      url,
      {
        method: 'GET',

        headers: {
          Accept: 'application/json',
        },

        signal: controller.signal,

        redirect: 'error',

        next: {
          revalidate: 300,
        },
      },
    )

    if (!response.ok) {
      await cancelResponseBody(response)

      throw new Error(
        `WooCommerce Store API request failed with status ${response.status}.`,
      )
    }

    const contentType = response.headers
      .get('content-type')
      ?.split(';', 1)[0]
      .trim()
      .toLowerCase()

    if (
      contentType !== 'application/json' &&
      contentType !== 'application/problem+json'
    ) {
      await cancelResponseBody(response)

      throw new Error(
        'WooCommerce Store API returned an unexpected content type.',
      )
    }

    const rawBody = await readResponseTextWithLimit(
      response,
      MAX_RESPONSE_BYTES,
    )

    let data: T

    try {
      data = JSON.parse(rawBody) as T
    } catch {
      throw new Error(
        'WooCommerce Store API returned invalid JSON.',
      )
    }

    return {
      data,
      headers: response.headers,
    }
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error(
        'WooCommerce Store API request timed out.',
      )
    }

    throw error
  } finally {
    clearTimeout(timeout)
  }
}

function parseNonNegativeIntegerHeader(
  value: string | null,
): number | null {
  if (
    value === null ||
    !/^\d+$/.test(value)
  ) {
    return null
  }

  const number = Number(value)

  if (
    !Number.isSafeInteger(number) ||
    number < 0
  ) {
    return null
  }

  return number
}

export async function getStoreCatalogProductIds(
  options: StoreCatalogQuery,
): Promise<StoreCatalogResult> {
  const page = normalizeInteger(
    options.page,
    1,
    1,
    MAX_PAGE,
  )

  const perPage = normalizeInteger(
    options.perPage,
    12,
    1,
    MAX_PER_PAGE,
  )

  const search = normalizeSearch(options.search)
  const category = normalizeCategory(options.category)
  const attributes = normalizeAttributes(options.attributes)

  const orderby = normalizeOrderBy(options.orderby)
  const order = normalizeOrder(options.order)

  const params = new URLSearchParams()

  params.set('page', String(page))
  params.set('per_page', String(perPage))
  params.set('catalog_visibility', 'visible')

  if (search) {
    params.set('search', search)
  }

  if (category) {
    params.set('category', category)
  }

  params.set('orderby', orderby)
  params.set('order', order)

  attributes.forEach((attribute, index) => {
    params.set(
      `attributes[${index}][attribute]`,
      attribute.taxonomy,
    )

    params.set(
      `attributes[${index}][slug]`,
      attribute.slug,
    )
  })

  if (attributes.length > 1) {
    params.set('attribute_relation', 'and')
  }

  const { data, headers } =
    await storeFetch<unknown>(params)

  if (
    !Array.isArray(data) ||
    data.length > perPage ||
    !data.every(isStoreProductId)
  ) {
    throw new Error(
      'WooCommerce Store API returned an invalid product list.',
    )
  }

  const products = data as StoreProductId[]

  const totalHeader = parseNonNegativeIntegerHeader(
    headers.get('X-WP-Total'),
  )

  const totalPagesHeader = parseNonNegativeIntegerHeader(
    headers.get('X-WP-TotalPages'),
  )

  const total =
    totalHeader ?? products.length

  const inferredTotalPages =
    products.length < perPage
      ? page
      : Math.min(MAX_PAGE, page + 1)

  const totalPages =
    totalPagesHeader !== null &&
    totalPagesHeader > 0
      ? Math.min(MAX_PAGE, totalPagesHeader)
      : inferredTotalPages

  return {
    ids: products.map((product) =>
      String(product.id),
    ),

    total,

    totalPages,

    currentPage: page,
  }
}