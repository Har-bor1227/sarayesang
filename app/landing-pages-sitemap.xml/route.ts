import { SITE_URL } from '@/lib/constants'

import {
  getProductCategories,
} from '@/lib/repositories/category-repository'

import {
  getAllPostSitemapEntries,
} from '@/lib/repositories/post-repository'

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
    products,
    posts,
    categories,
  ] = await Promise.all([
    getAllProductSitemapEntries(),
    getAllPostSitemapEntries(),
    getProductCategories(),
  ])

  const productLastModified =
    maxLastModified(
      products.map(
        (product) =>
          product.lastModified,
      ),
    )

  const articleLastModified =
    maxLastModified(
      posts.map(
        (post) =>
          post.lastModified,
      ),
    )

  const categoryLastModified =
    maxLastModified(
      categories.map(
        (category) => {
          const categoryId =
            String(
              category.id,
            )

          return maxLastModified(
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
        },
      ),
    )

  const xml =
    buildUrlSet([
      {
        url:
          siteUrl,

        lastModified:
          maxLastModified([
            productLastModified,
            articleLastModified,
            categoryLastModified,
          ]),

        changeFrequency:
          'daily',

        priority:
          1.0,
      },

      {
        url:
          siteUrl +
          '/products',

        lastModified:
          productLastModified,

        changeFrequency:
          'daily',

        priority:
          0.9,
      },

      {
        url:
          siteUrl +
          '/categories',

        lastModified:
          categoryLastModified,

        changeFrequency:
          'weekly',

        priority:
          0.8,
      },

      {
        url:
          siteUrl +
          '/about',

        changeFrequency:
          'monthly',

        priority:
          0.7,
      },

      {
        url:
          siteUrl +
          '/contact',

        changeFrequency:
          'monthly',

        priority:
          0.7,
      },

      {
        url:
          siteUrl +
          '/blog',

        lastModified:
          articleLastModified,

        changeFrequency:
          'daily',

        priority:
          0.8,
      },

      {
        url:
          siteUrl +
          '/tools',

        changeFrequency:
          'monthly',

        priority:
          0.7,
      },
    ])

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
