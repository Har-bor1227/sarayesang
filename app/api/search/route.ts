import { NextResponse } from 'next/server'

import { searchProducts } from '@/lib/repositories/product-repository'

const MAX_RESULTS = 8

export async function GET(
  request: Request,
) {
  try {
    const { searchParams } =
      new URL(request.url)

    const query =
      searchParams.get('q')?.trim() || ''

    if (query.length < 2) {
      return NextResponse.json({
        products: [],
      })
    }

    const products = await searchProducts({
      search: query,
      first: MAX_RESULTS,
    })

    return NextResponse.json({
      products,
    })
  } catch (error) {
    console.error(
      '[GET /api/search]',
      error,
    )

    return NextResponse.json(
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