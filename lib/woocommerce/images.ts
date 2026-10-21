import type {
  Image,
} from '@/types/wordpress'

import type {
  WooCommerceImage,
} from './types'

import {
  normalizeText,
  normalizeUrl,
} from './normalizers'

export function normalizeImage(
  image:
    | WooCommerceImage
    | null
    | undefined,
  fallbackAlt: string,
): Image | null {
  if (!image) {
    return null
  }

  const sourceUrl =
    normalizeUrl(
      image.src,
    )

  if (!sourceUrl) {
    return null
  }

  const altText =
    normalizeText(
      image.alt,
    ) ||
    fallbackAlt

  const hasDimensions =
    typeof image.width ===
      'number' &&
    Number.isFinite(
      image.width,
    ) &&
    image.width > 0 &&
    typeof image.height ===
      'number' &&
    Number.isFinite(
      image.height,
    ) &&
    image.height > 0

  return {
    sourceUrl,

    altText,

    mediaDetails:
      hasDimensions
        ? {
            width:
              image.width!,
            height:
              image.height!,
          }
        : undefined,
  }
}

export function normalizeGenericImage(
  value: unknown,
  fallbackAlt: string,
): Image | null {
  if (
    typeof value ===
    'string'
  ) {
    const sourceUrl =
      normalizeUrl(
        value,
      )

    return sourceUrl
      ? {
          sourceUrl,

          altText:
            fallbackAlt,
        }
      : null
  }

  if (
    !value ||
    typeof value !==
      'object' ||
    Array.isArray(
      value,
    )
  ) {
    return null
  }

  const object =
    value as Record<
      string,
      unknown
    >

  const sourceUrl =
    normalizeUrl(
      object.sourceUrl,
    ) ||
    normalizeUrl(
      object.source_url,
    ) ||
    normalizeUrl(
      object.url,
    ) ||
    normalizeUrl(
      object.src,
    )

  if (!sourceUrl) {
    return null
  }

  const altText =
    normalizeText(
      object.altText,
    ) ||
    normalizeText(
      object.alt,
    ) ||
    fallbackAlt

  const width =
    typeof object.width ===
      'number' &&
    Number.isFinite(
      object.width,
    ) &&
    object.width > 0
      ? object.width
      : undefined

  const height =
    typeof object.height ===
      'number' &&
    Number.isFinite(
      object.height,
    ) &&
    object.height > 0
      ? object.height
      : undefined

  return {
    sourceUrl,

    altText,

    mediaDetails:
      width &&
      height
        ? {
            width,
            height,
          }
        : undefined,
  }
}

export function normalizeImageCollection(
  value: unknown,
  fallbackAlt: string,
): Image[] {
  if (
    Array.isArray(
      value,
    )
  ) {
    return value
      .map(
        (
          item,
        ) =>
          normalizeGenericImage(
            item,
            fallbackAlt,
          ),
      )
      .filter(
        (
          item,
        ): item is Image =>
          Boolean(item),
      )
  }

  if (
    value &&
    typeof value ===
      'object' &&
    !Array.isArray(
      value,
    )
  ) {
    const object =
      value as Record<
        string,
        unknown
      >

    const nestedCandidates = [
      object.nodes,
      object.items,
      object.images,
      object.gallery,
      object.value,
    ]

    for (
      const candidate of
        nestedCandidates
    ) {
      const normalized =
        normalizeImageCollection(
          candidate,
          fallbackAlt,
        )

      if (
        normalized.length >
        0
      ) {
        return normalized
      }
    }

    const single =
      normalizeGenericImage(
        object,
        fallbackAlt,
      )

    return single
      ? [single]
      : []
  }

  if (
    typeof value ===
    'string'
  ) {
    const urls =
      value
        .split(',')
        .map(
          (
            item,
          ) =>
            item.trim(),
        )
        .filter(Boolean)

    return urls
      .map(
        (
          item,
        ) =>
          normalizeGenericImage(
            item,
            fallbackAlt,
          ),
      )
      .filter(
        (
          item,
        ): item is Image =>
          Boolean(item),
      )
  }

  return []
}

export function uniqueImages(
  images: Image[],
): Image[] {
  const seen =
    new Set<string>()

  const result: Image[] =
    []

  for (
    const image of
      images
  ) {
    const key =
      image.sourceUrl.trim()

    if (!key) {
      continue
    }

    if (
      seen.has(
        key,
      )
    ) {
      continue
    }

    seen.add(
      key,
    )

    result.push(
      image,
    )
  }

  return result
}
