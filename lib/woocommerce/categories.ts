import type {
  ProductCategoryNode,
} from '@/types/wordpress'

import {
  wcFetch,
  PRODUCT_CATEGORIES_ENDPOINT,
} from './client'

import type {
  WooCommerceProductCategory,
} from './types'

import {
  normalizeSlug,
} from './normalizers'

import {
  mapCategory,
} from './mappers'

export async function getProductCategoriesFromWooCommerce(): Promise<
  ProductCategoryNode[]
> {
  const perPage =
    20

  const categories:
    WooCommerceProductCategory[] =
    []

  let page = 1
  let totalPages = 1

  do {
    const params =
      new URLSearchParams({
        per_page:
          String(perPage),

        page:
          String(page),

        hide_empty:
          'true',

        orderby:
          'name',

        order:
          'asc',
      })

    const {
      data,
      headers,
    } =
      await wcFetch<
        WooCommerceProductCategory[]
      >(
        PRODUCT_CATEGORIES_ENDPOINT,
        params,
        300,
      )

    if (
      !Array.isArray(
        data,
      )
    ) {
      break
    }

    categories.push(
      ...data,
    )

    const headerTotalPages =
      Number(
        headers.get(
          'X-WP-TotalPages',
        ),
      )

    if (
      Number.isFinite(
        headerTotalPages,
      ) &&
      headerTotalPages > 0
    ) {
      totalPages =
        headerTotalPages
    } else {
      totalPages =
        data.length <
          perPage
          ? page
          : page + 1
    }

    page += 1
  } while (
    page <=
    totalPages
  )

  return categories.map(
    (
      category,
    ) =>
      mapCategory(
        category,
      ),
  )
}

export async function getProductCategoryBySlugFromWooCommerce(
  slug: string,
): Promise<ProductCategoryNode | null> {
  const normalizedSlug =
    normalizeSlug(
      slug,
    )

  if (
    !normalizedSlug
  ) {
    return null
  }

  const params =
    new URLSearchParams({
      slug:
        normalizedSlug,

      per_page:
        '1',

      hide_empty:
        'false',
    })

  const {
    data,
  } =
    await wcFetch<
      WooCommerceProductCategory[]
    >(
      PRODUCT_CATEGORIES_ENDPOINT,
      params,
      300,
    )

  const category =
    Array.isArray(
      data,
    )
      ? data[0]
      : undefined

  return category
    ? mapCategory(
        category,
      )
    : null
}
