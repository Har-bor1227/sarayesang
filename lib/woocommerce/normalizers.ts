import type {
  ProductStockStatus,
} from '@/types/wordpress'

export function normalizeSlug(
  slug: string,
): string {
  try {
    return decodeURIComponent(
      slug,
    )
  } catch {
    return slug
  }
}

export function normalizeText(
  value: unknown,
): string | undefined {
  if (
    typeof value !==
    'string'
  ) {
    return undefined
  }

  const normalized =
    value.trim()

  return normalized
    ? normalized
    : undefined
}

export function normalizeUrl(
  value: unknown,
): string | undefined {
  const normalized =
    normalizeText(
      value,
    )

  if (!normalized) {
    return undefined
  }

  if (
    normalized.startsWith(
      'http://',
    ) ||
    normalized.startsWith(
      'https://',
    )
  ) {
    return normalized
  }

  return undefined
}

export function normalizePositiveDimension(
  value: unknown,
): string | undefined {
  return normalizeText(
    value,
  )
}

export function normalizeStockStatus(
  value: unknown,
): ProductStockStatus {
  switch (
    normalizeText(
      value,
    )?.toLowerCase()
  ) {
    case 'instock':
      return 'instock'

    case 'outofstock':
      return 'outofstock'

    case 'onbackorder':
      return 'onbackorder'

    default:
      return 'unknown'
  }
}
