import { NextResponse } from 'next/server'

import { searchProducts } from '@/lib/repositories/product-repository'

const MIN_QUERY_LENGTH = 2
const MAX_QUERY_LENGTH = 120
const MAX_RESULTS = 8

const SEARCH_CACHE_CONTROL =
  'public, s-maxage=60, stale-while-revalidate=300'

const NO_STORE_CACHE_CONTROL = 'no-store, max-age=0'

const INVALID_CONTROL_CHARACTERS =
  /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/u

function createHeaders(cacheControl: string): Headers {
  const headers = new Headers()

  headers.set('Cache-Control', cacheControl)
  headers.set('X-Content-Type-Options', 'nosniff')

  return headers
}

function jsonResponse(
  data: unknown,
  options: {
    status?: number
    cacheControl?: string
  } = {},
) {
  return NextResponse.json(data, {
    status: options.status ?? 200,
    headers: createHeaders(
      options.cacheControl ?? NO_STORE_CACHE_CONTROL,
    ),
  })
}

function emptySearchResponse() {
  return jsonResponse(
    {
      products: [],
    },
    {
      cacheControl: SEARCH_CACHE_CONTROL,
    },
  )
}

function normalizeQuery(value: string): string {
  return value
    .normalize('NFC')
    .trim()
    .replace(/\s+/gu, ' ')
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const queryValues = url.searchParams.getAll('q')

    // Reject ambiguous requests containing multiple q parameters.
    if (queryValues.length > 1) {
      return jsonResponse(
        {
          products: [],
          error: 'درخواست جستجو معتبر نیست.',
        },
        {
          status: 400,
        },
      )
    }

    const rawQuery = queryValues[0] ?? ''

    // Reject oversized input before passing it to the repository.
    if (rawQuery.length > MAX_QUERY_LENGTH) {
      return emptySearchResponse()
    }

    const query = normalizeQuery(rawQuery)

    // Do not send control characters to the search repository.
    if (INVALID_CONTROL_CHARACTERS.test(query)) {
      return jsonResponse(
        {
          products: [],
          error: 'عبارت جستجو معتبر نیست.',
        },
        {
          status: 400,
        },
      )
    }

    // Preserve the existing behavior for empty and short queries.
    if (
      query.length < MIN_QUERY_LENGTH ||
      query.length > MAX_QUERY_LENGTH
    ) {
      return emptySearchResponse()
    }

    const products = await searchProducts({
      search: query,
      first: MAX_RESULTS,
    })

    return jsonResponse(
      {
        products,
      },
      {
        cacheControl: SEARCH_CACHE_CONTROL,
      },
    )
  } catch (error) {
    // Avoid exposing upstream error details to the client or logs.
    console.error(
      '[GET /api/search] Search request failed.',
      error instanceof Error ? error.name : 'UnknownError',
    )

    return jsonResponse(
      {
        products: [],
        error: 'خطا در جستجوی محصولات',
      },
      {
        status: 500,
      },
    )
  }
}