import {
  wcFetch,
  PRODUCTS_ENDPOINT,
} from './client'

import type {
  WooCommerceProduct,
  WooCommerceProductList,
} from './types'

const CATALOG_PAGE_SIZE = 100
const CATALOG_MAX_PAGES = 100
const CATALOG_REVALIDATE = 600

export async function getAllPublishedProductsFromWooCommerce(): Promise<
  WooCommerceProduct[]
> {
  const products: WooCommerceProduct[] = []

  let page = 1
  let totalPages = 1

  do {
    const params =
      new URLSearchParams({
        status:
          'publish',

        page:
          String(page),

        per_page:
          String(
            CATALOG_PAGE_SIZE,
          ),

        orderby:
          'date',

        order:
          'desc',
      })

    const {
      data,
      headers,
    } =
      await wcFetch<
        WooCommerceProductList
      >(
        PRODUCTS_ENDPOINT,
        params,
        CATALOG_REVALIDATE,
      )

    if (
      !Array.isArray(
        data,
      ) ||
      data.length === 0
    ) {
      break
    }

    products.push(
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
        CATALOG_PAGE_SIZE
          ? page
          : page + 1
    }

    page += 1
  } while (
    page <= totalPages &&
    page <= CATALOG_MAX_PAGES
  )

  return products
}