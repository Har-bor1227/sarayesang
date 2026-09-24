import {
  getAllProductsForSmartSearchFromWooCommerce,
} from '@/lib/woocommerce'

export interface SmartSearchFacets {
  applications: string[]
  colors: string[]
}

export interface SmartSearchOptions {
  application: string
  color: string
}

function normalizeFacetText(
  value: string,
): string {
  return value
    .replace(/\u200c/g, ' ')
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

function splitFacetValues(
  value?: string,
): string[] {
  if (!value) {
    return []
  }

  return value
    .replace(/\u200c/g, ' ')
    .split(/[,،|/;؛\n]+/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function uniqueFacetValues(
  values: string[],
): string[] {
  const map =
    new Map<string, string>()

  for (const value of values) {
    const normalized =
      normalizeFacetText(
        value,
      )

    if (!normalized) {
      continue
    }

    if (!map.has(normalized)) {
      map.set(
        normalized,
        value.trim(),
      )
    }
  }

  const result =
    Array.from(
      map.values(),
    )

  const collator =
    new Intl.Collator(
      'fa',
      {
        sensitivity: 'base',
        numeric: true,
      },
    )

  return result.sort(
    (
      a,
      b,
    ) =>
      collator.compare(
        a,
        b,
      ),
  )
}

function matchesFacet(
  source: string | undefined,
  selected: string,
): boolean {
  const normalizedSelected =
    normalizeFacetText(
      selected,
    )

  if (!normalizedSelected) {
    return false
  }

  return splitFacetValues(
    source,
  ).some(
    (value) =>
      normalizeFacetText(
        value,
      ) === normalizedSelected,
  )
}

export async function getSmartSearchFacets(): Promise<SmartSearchFacets> {
  const products =
    await getAllProductsForSmartSearchFromWooCommerce()

  const applications: string[] = []
  const colors: string[] = []

  for (const product of products) {
    applications.push(
      ...splitFacetValues(
        product.acf.application,
      ),
    )

    colors.push(
      ...splitFacetValues(
        product.acf.colorFamily,
      ),
    )
  }

  return {
    applications:
      uniqueFacetValues(
        applications,
      ),

    colors:
      uniqueFacetValues(
        colors,
      ),
  }
}

export async function getSmartSearchResults(
  options: SmartSearchOptions,
) {
  const application =
    options.application.trim()

  const color =
    options.color.trim()

  if (
    !application ||
    !color
  ) {
    return []
  }

  const products =
    await getAllProductsForSmartSearchFromWooCommerce()

  return products.filter(
    (product) =>
      matchesFacet(
        product.acf.application,
        application,
      ) &&
      matchesFacet(
        product.acf.colorFamily,
        color,
      ),
  )
}