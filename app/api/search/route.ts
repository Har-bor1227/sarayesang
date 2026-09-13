import {
    NextRequest,
    NextResponse,
  } from 'next/server'
  
  import {
    searchProducts,
  } from '@/lib/repositories/product-repository'
  
  const MIN_QUERY_LENGTH = 2
  const MAX_QUERY_LENGTH = 80
  const DEFAULT_LIMIT = 8
  
  export const runtime = 'nodejs'
  
  function jsonResponse(
    body: unknown,
    status = 200,
    cacheControl = 'no-store'
  ) {
    return NextResponse.json(
      body,
      {
        status,
  
        headers: {
          'Cache-Control':
            cacheControl,
  
          'X-Content-Type-Options':
            'nosniff',
  
          'X-Frame-Options':
            'SAMEORIGIN',
  
          'Referrer-Policy':
            'strict-origin-when-cross-origin',
        },
      }
    )
  }
  
  function isAllowedOrigin(
    request: NextRequest
  ): boolean {
    const origin =
      request.headers.get('origin')
  
    if (!origin) {
      return true
    }
  
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      'https://sarayesang.com'
  
    try {
      const allowedOrigin =
        new URL(siteUrl).origin
  
      return origin === allowedOrigin
    } catch {
      return false
    }
  }
  
  export async function GET(
    request: NextRequest
  ) {
    if (!isAllowedOrigin(request)) {
      return jsonResponse(
        {
          error:
            'درخواست غیرمجاز است.',
        },
        403
      )
    }
  
    const rawQuery =
      request.nextUrl.searchParams.get(
        'q'
      ) ?? ''
  
    const query =
      rawQuery.trim()
  
    if (
      query.length <
      MIN_QUERY_LENGTH
    ) {
      return jsonResponse({
        products: [],
      })
    }
  
    if (
      query.length >
      MAX_QUERY_LENGTH
    ) {
      return jsonResponse(
        {
          error:
            'عبارت جستجو بیش از حد طولانی است.',
        },
        400
      )
    }
  
    try {
      const products =
        await searchProducts({
          search: query,
          first: DEFAULT_LIMIT,
        })
  
      return jsonResponse(
        {
          products,
        },
        200,
        'public, s-maxage=30, stale-while-revalidate=60'
      )
    } catch (error) {
      console.error(
        'Search API error:',
        error
      )
  
      return jsonResponse(
        {
          error:
            'در جستجوی محصولات خطایی رخ داد.',
        },
        502
      )
    }
  }