import { cache } from 'react'

import {
  getAllProductsForSmartSearchFromWooCommerce,
} from '@/lib/woocommerce'

const QUESTION_KEYS = [
  'application',
  'stoneType',
  'colorFamily',
  'surfaceFinish',
] as const

type QuestionKey =
  typeof QUESTION_KEYS[number]

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

function normalizeFacetValue(
  value: string,
): string {
  return value
    .replace(/\u200c/g, ' ')
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[ـ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

export const getStoneFinderData = cache(
  async () => {
    const products =
      await getAllProductsForSmartSearchFromWooCommerce()

    const facets: Record<
      QuestionKey,
      string[]
    > = {
      application: [],
      stoneType: [],
      colorFamily: [],
      surfaceFinish: [],
    }

    for (const product of products) {
      for (const key of QUESTION_KEYS) {
        facets[key].push(
          ...splitFacetValues(
            product.acf?.[key],
          ),
        )
      }
    }

    for (const key of QUESTION_KEYS) {
      const uniqueValues =
        new Map<string, string>()

      for (const value of facets[key]) {
        const normalized =
          normalizeFacetValue(value)

        if (
          !normalized ||
          uniqueValues.has(normalized)
        ) {
          continue
        }

        uniqueValues.set(
          normalized,
          value,
        )
      }

      facets[key] =
        Array.from(
          uniqueValues.values(),
        ).sort(
          new Intl.Collator('fa', {
            sensitivity: 'base',
            numeric: true,
          }).compare,
        )
    }

    return {
      products,
      facets,
    }
  },
)