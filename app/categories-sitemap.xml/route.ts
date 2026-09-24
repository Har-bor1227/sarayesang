import { SITE_URL } from '@/lib/constants'

import {
  getProductCategories,
} from '@/lib/repositories/category-repository'

import {
  getAllProductSitemapEntries,
} from '@/lib/repositories/product-repository'

import {
  buildUrlSet,
  maxLastModified,
} from '@/lib/sitemap'

export const revalidate = 300

const siteUrl =
  SITE_URL.replace(
    /\/+$/,
    '',
  )

export async function GET() {
  const [
    categories,
    products,
  ] = await Promise.all([
    getProductCategories(),
    getAllProductSitemapEntries(),
  ])

  const xml =
    buildUrlSet(
      categories.map(
        (category) => {
          const categoryId =
            String(
              category.id,
            )

          const lastModified =
            maxLastModified(
              products
                .filter(
                  (product) =>
                    product.categoryIds.includes(
                      categoryId,
                    ),
                )
                .map(
                  (product) =>
                    product.lastModified,
                ),
            )

          return {
            url:
              siteUrl +
              '/categories/' +
              encodeURIComponent(
                category.slug,
              ),

            lastModified,

            changeFrequency:
              'weekly' as const,

            priority:
              0.7,
          }
        },
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
