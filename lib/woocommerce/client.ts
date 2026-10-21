import 'server-only'

import {
  WORDPRESS_URL,
} from '@/lib/constants'

const REQUEST_TIMEOUT_MS = 30_000
const MAX_RESPONSE_BYTES = 20 * 1024 * 1024

const JSON_CONTENT_TYPES = new Set([
  'application/json',
  'application/problem+json',
])

type WooCommerceFetchResult<T> = {
  data: T
  headers: Headers
}

class WooCommerceResponseTooLargeError extends Error {
  constructor() {
    super('WooCommerce response exceeded the configured limit.')
    this.name = 'WooCommerceResponseTooLargeError'
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
    (url.protocol !== 'https:' &&
      !(url.protocol === 'http:' && isLocalDevelopmentHost))
  ) {
    throw new Error(
      'WORDPRESS_URL must use HTTPS, except for local development.',
    )
  }

  return url
}

const WORDPRESS_BASE_URL =
  parseWordPressBaseUrl(WORDPRESS_URL)

const WORDPRESS_BASE_PATH =
  WORDPRESS_BASE_URL.pathname.replace(/\/+$/, '')

const WORDPRESS_API_PATH =
  `${WORDPRESS_BASE_PATH}/index.php` || '/index.php'

export const WC_API_URL =
  `${WORDPRESS_BASE_URL.origin}${WORDPRESS_API_PATH}?rest_route=/wc/v3`

const CONSUMER_KEY =
  process.env.WORDPRESS_CONSUMER_KEY?.trim()

const CONSUMER_SECRET =
  process.env.WORDPRESS_CONSUMER_SECRET?.trim()

if (!CONSUMER_KEY || !CONSUMER_SECRET) {
  throw new Error(
    'WooCommerce credentials are missing: WORDPRESS_CONSUMER_KEY / WORDPRESS_CONSUMER_SECRET',
  )
}

export const PRODUCTS_ENDPOINT =
  `${WC_API_URL}/products`

export const PRODUCT_CATEGORIES_ENDPOINT =
  `${WC_API_URL}/products/categories`

export const PRODUCT_ATTRIBUTES_ENDPOINT =
  `${WC_API_URL}/products/attributes`

function createAuthHeader(): string {
  const credentials =
    `${CONSUMER_KEY}:${CONSUMER_SECRET}`

  return `Basic ${Buffer.from(
    credentials,
    'utf8',
  ).toString('base64')}`
}

/**
 * Validate that the endpoint is an expected WooCommerce REST route
 * on the configured WordPress origin.
 */
function createSafeRequestUrl(
  endpoint: string,
  searchParams?: URLSearchParams,
): URL {
  let url: URL

  try {
    url = new URL(endpoint)
  } catch {
    throw new Error(
      'Invalid WooCommerce endpoint configuration.',
    )
  }

  if (
    url.origin !== WORDPRESS_BASE_URL.origin ||
    url.pathname !== WORDPRESS_API_PATH ||
    url.username ||
    url.password ||
    url.hash
  ) {
    throw new Error(
      'WooCommerce endpoint is outside the allowed origin or path.',
    )
  }

  const routes =
    url.searchParams.getAll('rest_route')

  if (routes.length !== 1) {
    throw new Error(
      'Invalid WooCommerce REST route configuration.',
    )
  }

  const route = routes[0]

  const validRoutePattern =
    /^\/wc\/v3(?:\/[A-Za-z0-9._~-]+)*$/u

  if (
    !route ||
    !validRoutePattern.test(route) ||
    route.split('/').some(
      (segment) =>
        segment === '.' ||
        segment === '..',
    )
  ) {
    throw new Error(
      'Invalid WooCommerce REST route configuration.',
    )
  }

  // The endpoint itself may contain only the protected REST route.
  for (const key of url.searchParams.keys()) {
    if (key !== 'rest_route') {
      throw new Error(
        'Unexpected parameter in WooCommerce endpoint configuration.',
      )
    }
  }

  if (searchParams) {
    for (const [key, value] of searchParams.entries()) {
      const normalizedKey = key.toLowerCase()

      // Credentials must never be passed as URL query parameters.
      if (
        normalizedKey === 'rest_route' ||
        normalizedKey === 'consumer_key' ||
        normalizedKey === 'consumer_secret'
      ) {
        throw new Error(
          'A reserved parameter was supplied to WooCommerce.',
        )
      }

      url.searchParams.append(key, value)
    }
  }

  return url
}

async function cancelResponseBody(
  response: Response,
): Promise<void> {
  await response.body?.cancel().catch(() => undefined)
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
        'WooCommerce returned an invalid Content-Length header.',
      )
    }

    const declaredLength = Number(contentLength)

    if (
      !Number.isSafeInteger(declaredLength) ||
      declaredLength < 0
    ) {
      await cancelResponseBody(response)

      throw new Error(
        'WooCommerce returned an invalid Content-Length header.',
      )
    }

    if (declaredLength > limit) {
      await cancelResponseBody(response)
      throw new WooCommerceResponseTooLargeError()
    }
  }

  if (!response.body) {
    throw new Error(
      'WooCommerce returned an empty response body.',
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

        throw new WooCommerceResponseTooLargeError()
      }

      chunks.push(value)
    }
  } finally {
    reader.releaseLock()
  }

  const bytes = Buffer.concat(chunks, totalBytes)

  try {
    return new TextDecoder('utf-8', {
      fatal: true,
    }).decode(bytes)
  } catch {
    throw new Error(
      'WooCommerce returned invalid UTF-8 content.',
    )
  }
}

function parseRevalidate(value: number): number {
  if (
    !Number.isFinite(value) ||
    value < 0
  ) {
    throw new Error(
      'WooCommerce revalidate must be a non-negative number.',
    )
  }

  return Math.floor(value)
}

export async function wcFetch<T>(
  endpoint: string,
  searchParams?: URLSearchParams,
  revalidate = 300,
): Promise<WooCommerceFetchResult<T>> {
  const url = createSafeRequestUrl(
    endpoint,
    searchParams,
  )

  const safeRevalidate =
    parseRevalidate(revalidate)

  const controller =
    new AbortController()

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
          Authorization: createAuthHeader(),
        },

        signal: controller.signal,

        // Never forward credentials through an HTTP redirect.
        redirect: 'error',

        next: {
          revalidate: safeRevalidate,
        },
      },
    )

    if (!response.ok) {
      await cancelResponseBody(response)

      throw new Error(
        `WooCommerce request failed with status ${response.status}.`,
      )
    }

    const contentType = response.headers
      .get('content-type')
      ?.split(';', 1)[0]
      .trim()
      .toLowerCase()

    if (
      !contentType ||
      !JSON_CONTENT_TYPES.has(contentType)
    ) {
      await cancelResponseBody(response)

      throw new Error(
        'WooCommerce returned an unexpected content type.',
      )
    }

    const body = await readResponseTextWithLimit(
      response,
      MAX_RESPONSE_BYTES,
    )

    let data: T

    try {
      data = JSON.parse(body) as T
    } catch {
      throw new Error(
        'WooCommerce returned invalid JSON.',
      )
    }

    return {
      data,
      headers: response.headers,
    }
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error(
        'WooCommerce request timed out.',
      )
    }

    throw error
  } finally {
    clearTimeout(timeout)
  }
}