import { SITE_URL } from '@/lib/constants'

import { getProductCategories } from '@/lib/repositories/category-repository'

import { getAllPostSitemapEntries } from '@/lib/repositories/post-repository'

import { getAllProductSitemapEntries } from '@/lib/repositories/product-repository'

import {
  buildSitemapIndex,
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
    buildSitemapIndex([
      {
        url:
          siteUrl +
          '/product-sitemap.xml',
        lastModified:
          productLastModified,
      },
      {
        url:
          siteUrl +
          '/categories-sitemap.xml',
        lastModified:
          categoryLastModified,
      },
      {
        url:
          siteUrl +
          '/article-sitemap.xml',
        lastModified:
          articleLastModified,
      },
      {
        url:
          siteUrl +
          '/landing-pages-sitemap.xml',
        lastModified:
          maxLastModified([
            productLastModified,
            articleLastModified,
            categoryLastModified,
          ]),
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
