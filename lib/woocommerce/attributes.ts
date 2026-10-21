import {
  wcFetch,
  PRODUCT_ATTRIBUTES_ENDPOINT,
} from './client'

import type {
  WooCommerceGlobalAttribute,
  WooCommerceProductAttributeTerm,
} from './types'

export async function getProductAttributesFromWooCommerce(): Promise<
  WooCommerceGlobalAttribute[]
> {
  const attributes:
    WooCommerceGlobalAttribute[] =
    []

  let page = 1

  while (
    page <= 100
  ) {
    const params =
      new URLSearchParams({
        per_page:
          '100',

        page:
          String(page),

        orderby:
          'menu_order',

        order:
          'asc',
      })

    const {
      data,
      headers,
    } =
      await wcFetch<
        WooCommerceGlobalAttribute[]
      >(
        PRODUCT_ATTRIBUTES_ENDPOINT,
        params,
        300,
      )

    if (
      !Array.isArray(
        data,
      ) ||
      data.length ===
        0
    ) {
      break
    }

    attributes.push(
      ...data,
    )

    const totalPages =
      Number(
        headers.get(
          'X-WP-TotalPages',
        ),
      )

    if (
      !Number.isFinite(
        totalPages,
      ) ||
      totalPages <=
        page
    ) {
      break
    }

    page += 1
  }

  return attributes
}

export async function getProductAttributeTermsFromWooCommerce(
  attributeId: number,
): Promise<
  WooCommerceProductAttributeTerm[]
> {
  const terms:
    WooCommerceProductAttributeTerm[] =
    []

  const endpoint =
    `${PRODUCT_ATTRIBUTES_ENDPOINT}/${attributeId}/terms`

  let page = 1

  while (
    page <= 100
  ) {
    const params =
      new URLSearchParams({
        per_page:
          '100',

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
        WooCommerceProductAttributeTerm[]
      >(
        endpoint,
        params,
        300,
      )

    if (
      !Array.isArray(
        data,
      ) ||
      data.length ===
        0
    ) {
      break
    }

    terms.push(
      ...data,
    )

    const totalPages =
      Number(
        headers.get(
          'X-WP-TotalPages',
        ),
      )

    if (
      !Number.isFinite(
        totalPages,
      ) ||
      totalPages <=
        page
    ) {
      break
    }

    page += 1
  }

  return terms
}
