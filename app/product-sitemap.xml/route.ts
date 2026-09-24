import { SITE_URL } from '@/lib/constants'

import {
  getAllProductSitemapEntries,
} from '@/lib/repositories/product-repository'

import {
  buildUrlSet,
} from '@/lib/sitemap'

export const revalidate = 300

const siteUrl =
  SITE_URL.replace(
    /\/+$/,
    '',
  )

export async function GET() {
  const products =
    await getAllProductSitemapEntries()

  const xml =
    buildUrlSet(
      products.map(
        (product) => ({
          url:
            siteUrl +
            '/products/' +
            encodeURIComponent(
              product.slug,
            ),

          lastModified:
            product.lastModified,

          changeFrequency:
            'weekly' as const,

          priority:
            0.9,
        }),
      ),
    )

  return new Response(
    xml,
    {
      headers: {
        'Content-Type':
          'application/xml; charset=utf-8',

        'X-Content-Type-Options':
          'nosniff',
      },
    },
  )
}
