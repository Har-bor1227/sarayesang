import { cache } from 'react'

import {
  getProductAttributesFromWooCommerce,
  getProductAttributeTermsFromWooCommerce,
} from '@/lib/woocommerce'

import type {
  CatalogFilterGroup,
  CatalogFilterOption,
} from '@/types/catalog'

interface FilterDefinition {
  key:
    | 'stoneType'
    | 'color'
    | 'application'
    | 'surfaceFinish'

  fallbackLabel: string

  taxonomy: string
}

const FILTER_DEFINITIONS:
  FilterDefinition[] = [
    {
      key:
        'stoneType',

      fallbackLabel:
        'نوع سنگ',

      taxonomy:
        'pa_stone-type',
    },

    {
      key:
        'color',

      fallbackLabel:
        'رنگ',

      taxonomy:
        'pa_color',
    },

    {
      key:
        'application',

      fallbackLabel:
        'کاربرد',

      taxonomy:
        'pa_application',
    },

    {
      key:
        'surfaceFinish',

      fallbackLabel:
        'پرداخت',

      taxonomy:
        'pa_surface-finish',
    },
  ]

function normalizeTermSlug(
  value: string,
): string {
  try {
    return decodeURIComponent(
      value,
    )
  } catch {
    return value
  }
}

export const getCatalogFilters =
  cache(
    async (): Promise<
      CatalogFilterGroup[]
    > => {
      const attributes =
        await getProductAttributesFromWooCommerce()

      const attributeMap =
        new Map(
          attributes.map(
            (
              attribute,
            ) => [
              attribute.slug,
              attribute,
            ],
          ),
        )

      const groups =
        await Promise.all(
          FILTER_DEFINITIONS.map(
            async (
              definition,
            ) => {
              const attribute =
                attributeMap.get(
                  definition.taxonomy,
                )

              if (!attribute) {
                return null
              }

              const terms =
                await getProductAttributeTermsFromWooCommerce(
                  attribute.id,
                )

              const options =
                terms
                  .filter(
                    (
                      term,
                    ) =>
                      Number(
                        term.count ??
                          0,
                      ) > 0,
                  )
                  .map(
                    (
                      term,
                    ): CatalogFilterOption => ({
                      id:
                        String(
                          term.id,
                        ),

                      name:
                        term.name,

                      slug:
                        normalizeTermSlug(
                          term.slug,
                        ),

                      count:
                        Number(
                          term.count ??
                            0,
                        ),
                    }),
                  )

              return {
                key:
                  definition.key,

                label:
                  attribute.name ||
                  definition.fallbackLabel,

                taxonomy:
                  definition.taxonomy,

                options,
              }
            },
          ),
        )

      return groups.filter(
        (
          group,
        ): group is CatalogFilterGroup =>
          Boolean(group),
      )
    },
  )