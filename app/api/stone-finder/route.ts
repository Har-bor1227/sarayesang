import { NextResponse } from 'next/server'

import { getStoneFinderData } from '@/lib/repositories/stone-finder-repository'

export const revalidate = 600

export async function GET() {
  try {
    const data = await getStoneFinderData()

    return NextResponse.json(data, {
      headers: {
        'Cache-Control':
          'public, s-maxage=600, stale-while-revalidate=1800',
      },
    })
  } catch (error) {
    console.error(
      '[GET /api/stone-finder]',
      error,
    )

    return NextResponse.json(
      {
        products: [],
        facets: {
          application: [],
          stoneType: [],
          colorFamily: [],
          surfaceFinish: [],
        },
        error: 'خطا در دریافت اطلاعات سنگ‌ها',
      },
      { status: 500 },
    )
  }
}
