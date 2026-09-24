import {
  normalizeText,
  splitFacetValues,
} from '../stone-finder/utils'
import { FALLBACK_IMAGE } from '../stone-finder/config'
import type { FinderProduct } from '../stone-finder/types'

function toLatinDigits(
  value: string,
): string {
  return value.replace(
    /[۰-۹]/g,
    (digit) =>
      String(
        '۰۱۲۳۴۵۶۷۸۹'.indexOf(digit),
      ),
  )
}

export function formatPrice(
  value?: string,
): string {
  if (!value) return 'استعلامی'

  const numeric = Number.parseFloat(
    toLatinDigits(value).replace(
      /,/g,
      '',
    ),
  )

  if (!Number.isFinite(numeric)) {
    return value
  }

  return new Intl.NumberFormat(
    'fa-IR',
  ).format(numeric)
}

export function formatPriceWithUnit(
  value?: string,
): string {
  const formatted =
    formatPrice(value)

  return formatted === 'استعلامی'
    ? formatted
    : `${formatted} تومان`
}

export function getCategoryText(
  product: FinderProduct,
): string | undefined {
  const categories =
    product.productCategories?.nodes ??
    []

  const names = categories
    .map((category) =>
      category.name?.trim(),
    )
    .filter(Boolean)

  return names.length > 0
    ? names.join('، ')
    : undefined
}

export function getImage(
  product: FinderProduct,
): string {
  return (
    product.image?.sourceUrl ||
    FALLBACK_IMAGE
  )
}

export function getSearchIndexText(
  product: FinderProduct,
): string {
  return [
    product.name,
    product.slug,
    product.acf.application,
    product.acf.stoneType,
    product.acf.colorFamily,
    product.acf.surfaceFinish,
    product.acf.dimensions,
    product.acf.weight,
    getCategoryText(product),
  ]
    .filter(Boolean)
    .map((value) =>
      normalizeText(String(value)),
    )
    .join(' ')
}

export function matchesQuery(
  product: FinderProduct,
  query: string,
): boolean {
  const normalizedQuery =
    normalizeText(query)

  if (!normalizedQuery) return true

  return getSearchIndexText(
    product,
  ).includes(normalizedQuery)
}

export function getValue(
  product: FinderProduct,
  getter: (
    product: FinderProduct,
  ) => string | undefined,
): string {
  const value = getter(product)

  if (!value) return '—'

  const parts = splitFacetValues(value)

  return parts.length > 1
    ? parts.join('، ')
    : value
}