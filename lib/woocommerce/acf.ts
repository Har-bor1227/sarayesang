import type {
  Image,
} from '@/types/wordpress'

import type {
  WooCommerceProduct,
} from './types'

import {
  normalizeText,
} from './normalizers'

import {
  normalizeImageCollection,
} from './images'

function normalizeMetaKey(
  key: unknown,
): string {
  return typeof key ===
    'string'
    ? key
        .trim()
        .toLowerCase()
        .replace(
          /[\s-]+/g,
          '_',
        )
    : ''
}

function getMetaValue(
  product: WooCommerceProduct,
  aliases: string[],
): unknown {
  const aliasSet =
    new Set(
      aliases.map(
        normalizeMetaKey,
      ),
    )

  const directAcf =
    product.acf

  if (
    directAcf &&
    typeof directAcf ===
      'object'
  ) {
    for (
      const [
        key,
        value,
      ] of Object.entries(
        directAcf,
      )
    ) {
      if (
        aliasSet.has(
          normalizeMetaKey(
            key,
          ),
        )
      ) {
        return value
      }
    }
  }

  const metaData =
    product.meta_data

  if (
    Array.isArray(
      metaData,
    )
  ) {
    for (
      const item of
        metaData
    ) {
      const key =
        normalizeMetaKey(
          item.key,
        )

      if (
        key &&
        aliasSet.has(
          key,
        )
      ) {
        return item.value
      }
    }
  }

  return undefined
}

export function getAcfString(
  product: WooCommerceProduct,
  aliases: string[],
): string | undefined {
  return normalizeText(
    getMetaValue(
      product,
      aliases,
    ),
  )
}

export function getAcfImages(
  product: WooCommerceProduct,
  aliases: string[],
  fallbackAlt: string,
): Image[] {
  return normalizeImageCollection(
    getMetaValue(
      product,
      aliases,
    ),
    fallbackAlt,
  )
}


export function getProductAttributeValue(
  product: WooCommerceProduct,
  names: string[],
): string | undefined {
  const wantedNames =
    new Set(
      names.map(
        (
          name,
        ) =>
          name
            .replace(
              /\u200c/g,
              ' ',
            )
            .replace(
              /ي/g,
              'ی',
            )
            .replace(
              /ك/g,
              'ک',
            )
            .replace(
              /\s+/g,
              ' ',
            )
            .trim()
            .toLowerCase(),
      ),
    )

  const attribute =
    product.attributes?.find(
      (
        item,
      ) => {
        const normalizedName =
          item.name
            .replace(
              /\u200c/g,
              ' ',
            )
            .replace(
              /ي/g,
              'ی',
            )
            .replace(
              /ك/g,
              'ک',
            )
            .replace(
              /\s+/g,
              ' ',
            )
            .trim()
            .toLowerCase()

        return wantedNames.has(
          normalizedName,
        )
      },
    )

  if (
    !attribute?.options?.length
  ) {
    return undefined
  }

  return attribute.options
    .map(
      (
        option,
      ) =>
        String(
          option,
        ).trim(),
    )
    .filter(Boolean)
    .join(
      '، ',
    )
}
