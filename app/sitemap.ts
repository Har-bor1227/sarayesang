import type { MetadataRoute } from 'next'

import {
  getAllProductSlugs,
} from '@/lib/repositories/product-repository'

import {
  getAllPostSlugs,
} from '@/lib/repositories/post-repository'

import {
  getProductCategories,
} from '@/lib/repositories/category-repository'

import { SITE_URL } from '@/lib/constants'

function getSiteUrl(): string {
  return SITE_URL.replace(/\/+$/, '')
}

const siteUrl = getSiteUrl()

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [
    productSlugs,
    postSlugs,
    categories,
  ] = await Promise.all([
    getAllProductSlugs(),
    getAllPostSlugs(),
    getProductCategories(),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      changeFrequency: 'daily',
      priority: 1.0,
    },

    {
      url: `${siteUrl}/products`,
      changeFrequency: 'daily',
      priority: 0.9,
    },

    {
      url: `${siteUrl}/categories`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },

    {
      url: `${siteUrl}/about`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },

    {
      url: `${siteUrl}/contact`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },

    {
      url: `${siteUrl}/blog`,
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]

  const productUrls: MetadataRoute.Sitemap =
    productSlugs.map(
      (slug) => ({
        url:
          `${siteUrl}/products/${slug}`,

        changeFrequency:
          'weekly',

        priority:
          0.9,
      }),
    )

  const postUrls: MetadataRoute.Sitemap =
    postSlugs.map(
      (slug) => ({
        url:
          `${siteUrl}/blog/${slug}`,

        changeFrequency:
          'weekly',

        priority:
          0.8,
      }),
    )

  const categoryUrls: MetadataRoute.Sitemap =
    categories.map(
      (category) => ({
        url:
          `${siteUrl}/categories/${category.slug}`,

        changeFrequency:
          'weekly',

        priority:
          0.7,
      }),
    )

  return [
    ...staticPages,
    ...productUrls,
    ...postUrls,
    ...categoryUrls,
  ]
}