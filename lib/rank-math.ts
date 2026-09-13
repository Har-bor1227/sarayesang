import 'server-only'

import type { Metadata } from 'next'

import { WORDPRESS_URL } from '@/lib/constants'

export interface RankMathSeoData {
  title?: string
  description?: string
  canonical?: string
  robots?: string

  openGraph?: {
    locale?: string
    type?: string
    title?: string
    description?: string
    url?: string
    siteName?: string
    image?: {
      url: string
      width?: number
      height?: number
      alt?: string
      type?: string
    }
  }

  twitter?: {
    card?: string
    title?: string
    description?: string
    image?: string
  }

  jsonLd: Record<string, unknown>[]
}

interface RankMathApiResponse {
  success?: boolean
  head?: string
}

interface MetaTag {
  name?: string
  property?: string
  content?: string
}

const REQUEST_TIMEOUT_MS = 7_000

function decodeHtmlEntities(
  value: string,
): string {
  return value
    .replace(
      /&amp;/gi,
      '&',
    )
    .replace(
      /&quot;/gi,
      '"',
    )
    .replace(
      /&#39;/gi,
      "'",
    )
    .replace(
      /&lt;/gi,
      '<',
    )
    .replace(
      /&gt;/gi,
      '>',
    )
    .replace(
      /&#(\d+);/g,
      (
        _match,
        code: string,
      ) =>
        String.fromCharCode(
          Number(code),
        ),
    )
    .replace(
      /&#x([0-9a-f]+);/gi,
      (
        _match,
        code: string,
      ) =>
        String.fromCharCode(
          parseInt(
            code,
            16,
          ),
        ),
    )
}

function getAttribute(
  tag: string,
  attribute: string,
): string | undefined {
  const regex =
    new RegExp(
      `${attribute}\\s*=\\s*["']([^"']*)["']`,
      'i',
    )

  const match =
    tag.match(regex)

  if (!match?.[1]) {
    return undefined
  }

  return decodeHtmlEntities(
    match[1],
  )
}

function extractMetaTags(
  head: string,
): MetaTag[] {
  const results: MetaTag[] = []

  const tags =
    head.match(
      /<meta\b[^>]*>/gi,
    ) ?? []

  for (
    const tag of tags
  ) {
    const name =
      getAttribute(
        tag,
        'name',
      )

    const property =
      getAttribute(
        tag,
        'property',
      )

    const content =
      getAttribute(
        tag,
        'content',
      )

    if (
      content !==
      undefined
    ) {
      results.push({
        name,
        property,
        content,
      })
    }
  }

  return results
}

function getMetaValue(
  metas: MetaTag[],
  key: string,
): string | undefined {
  const normalizedKey =
    key.toLowerCase()

  const match =
    metas.find(
      (
        meta,
      ) =>
        meta.name?.toLowerCase() ===
          normalizedKey ||
        meta.property?.toLowerCase() ===
          normalizedKey,
    )

  return match?.content
}

function extractTitle(
  head: string,
): string | undefined {
  const match =
    head.match(
      /<title\b[^>]*>([\s\S]*?)<\/title>/i,
    )

  if (!match?.[1]) {
    return undefined
  }

  return decodeHtmlEntities(
    match[1].trim(),
  )
}

function extractCanonical(
  head: string,
): string | undefined {
  const links =
    head.match(
      /<link\b[^>]*>/gi,
    ) ?? []

  for (
    const link of links
  ) {
    const rel =
      getAttribute(
        link,
        'rel',
      )

    if (
      rel?.toLowerCase() ===
      'canonical'
    ) {
      return getAttribute(
        link,
        'href',
      )
    }
  }

  return undefined
}

function extractJsonLd(
  head: string,
): Record<string, unknown>[] {
  const schemas:
    Record<string, unknown>[] = []

  const regex =
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi

  let match:
    RegExpExecArray | null

  while (
    (match =
      regex.exec(
        head,
      )) !== null
  ) {
    const raw =
      match[1]?.trim()

    if (!raw) {
      continue
    }

    try {
      const parsed =
        JSON.parse(
          raw,
        ) as unknown

      if (
        Array.isArray(
          parsed,
        )
      ) {
        for (
          const item of
            parsed
        ) {
          if (
            item &&
            typeof item ===
              'object' &&
            !Array.isArray(
              item,
            )
          ) {
            schemas.push(
              item as Record<
                string,
                unknown
              >,
            )
          }
        }

        continue
      }

      if (
        parsed &&
        typeof parsed ===
          'object'
      ) {
        schemas.push(
          parsed as Record<
            string,
            unknown
          >,
        )
      }
    } catch {
      // Ignore malformed JSON-LD.
    }
  }

  return schemas
}

function extractSchemaValue(
  schema: Record<
    string,
    unknown
  >,
  field: string,
): string | undefined {
  const direct =
    schema[field]

  return typeof direct ===
    'string'
    ? direct
    : undefined
}

function extractSchemaField(
  jsonLd: Record<
    string,
    unknown
  >[],
  field: string,
): string | undefined {
  for (
    const schema of
      jsonLd
  ) {
    const direct =
      extractSchemaValue(
        schema,
        field,
      )

    if (direct) {
      return direct
    }

    const graph =
      schema['@graph']

    if (
      Array.isArray(
        graph,
      )
    ) {
      for (
        const item of
          graph
      ) {
        if (
          !item ||
          typeof item !==
            'object' ||
          Array.isArray(
            item,
          )
        ) {
          continue
        }

        const value =
          extractSchemaValue(
            item as Record<
              string,
              unknown
            >,
            field,
          )

        if (value) {
          return value
        }
      }
    }
  }

  return undefined
}

function normalizeUrl(
  value: string,
): string {
  const trimmed =
    value.trim()

  if (
    trimmed.startsWith(
      'http://',
    ) ||
    trimmed.startsWith(
      'https://',
    )
  ) {
    return trimmed
  }

  return `${WORDPRESS_URL.replace(
    /\/+$/,
    '',
  )}/${trimmed.replace(
    /^\/+/,
    '',
  )}`
}

function getAllowedOpenGraphType(
  value?: string,
): 'website' | 'article' | 'book' | 'profile' {
  switch (
    value
      ?.trim()
      .toLowerCase()
  ) {
    case 'article':
      return 'article'

    case 'book':
      return 'book'

    case 'profile':
      return 'profile'

    case 'website':
      return 'website'

    default:
      return 'website'
  }
}

function getAllowedTwitterCard(
  value?: string,
): 'summary' | 'summary_large_image' | 'player' | 'app' {
  switch (
    value
      ?.trim()
      .toLowerCase()
  ) {
    case 'summary':
      return 'summary'

    case 'summary_large_image':
      return 'summary_large_image'

    case 'player':
      return 'player'

    case 'app':
      return 'app'

    default:
      return 'summary_large_image'
  }
}

function getComparablePath(
  value: string,
): string | null {
  try {
    const parsed =
      new URL(
        value,
        WORDPRESS_URL,
      )

    const pathname =
      parsed.pathname.replace(
        /\/+$/,
        '',
      )

    return decodeURIComponent(
      pathname,
    )
  } catch {
    return null
  }
}

function normalizeExactSchemaUrl(
  value: string,
  wordpressSourceUrl: string,
  frontendUrl: string,
): string {
  try {
    const wordpressBase =
      new URL(
        WORDPRESS_URL,
      )

    const parsed =
      new URL(
        value,
        wordpressBase,
      )

    if (
      parsed.origin !==
      wordpressBase.origin
    ) {
      return value
    }

    const sourcePath =
      getComparablePath(
        wordpressSourceUrl,
      )

    const valuePath =
      getComparablePath(
        value,
      )

    if (
      !sourcePath ||
      !valuePath ||
      sourcePath !==
        valuePath
    ) {
      return value
    }

    return (
      frontendUrl +
      parsed.search +
      parsed.hash
    )
  } catch {
    return value
  }
}

export function normalizeRankMathSchemaUrls(
  value: unknown,
  wordpressSourceUrl: string,
  frontendUrl: string,
): unknown {
  if (
    typeof value ===
    'string'
  ) {
    return normalizeExactSchemaUrl(
      value,
      wordpressSourceUrl,
      frontendUrl,
    )
  }

  if (
    Array.isArray(
      value,
    )
  ) {
    return value.map(
      (
        item,
      ) =>
        normalizeRankMathSchemaUrls(
          item,
          wordpressSourceUrl,
          frontendUrl,
        ),
    )
  }

  if (
    value &&
    typeof value ===
      'object'
  ) {
    const normalized:
      Record<
        string,
        unknown
      > = {}

    for (
      const [
        key,
        childValue,
      ] of Object.entries(
        value as Record<
          string,
          unknown
        >,
      )
    ) {
      normalized[key] =
        normalizeRankMathSchemaUrls(
          childValue,
          wordpressSourceUrl,
          frontendUrl,
        )
    }

    return normalized
  }

  return value
}

export async function getRankMathHead(
  url: string,
  revalidate = 3600,
): Promise<string | null> {
  const endpoint =
    `${WORDPRESS_URL.replace(
      /\/+$/,
      '',
    )}/index.php?rest_route=/rankmath/v1/getHead`

  const requestUrl =
    new URL(
      endpoint,
    )

  requestUrl.searchParams.set(
    'url',
    normalizeUrl(url),
  )

  const controller =
    new AbortController()

  const timeout =
    setTimeout(
      () => {
        controller.abort()
      },
      REQUEST_TIMEOUT_MS,
    )

  try {
    const response =
      await fetch(
        requestUrl.toString(),
        {
          method: 'GET',

          headers: {
            Accept:
              'application/json',
          },

          signal:
            controller.signal,

          next: {
            revalidate,
          },
        },
      )

    if (
      !response.ok
    ) {
      throw new Error(
        `Rank Math request failed with status ${response.status}`,
      )
    }

    const data =
      (await response.json()) as RankMathApiResponse

    if (
      !data.success ||
      !data.head
    ) {
      return null
    }

    return data.head
  } catch (error) {
    if (
      error instanceof DOMException &&
      error.name ===
        'AbortError'
    ) {
      throw new Error(
        'Rank Math request timed out',
      )
    }

    throw error
  } finally {
    clearTimeout(
      timeout,
    )
  }
}

export function parseRankMathHead(
  head: string,
): RankMathSeoData {
  const metas =
    extractMetaTags(
      head,
    )

  const jsonLd =
    extractJsonLd(
      head,
    )

  const result:
    RankMathSeoData = {
    title:
      extractTitle(
        head,
      ),

    description:
      getMetaValue(
        metas,
        'description',
      ),

    canonical:
      extractCanonical(
        head,
      ),

    robots:
      getMetaValue(
        metas,
        'robots',
      ),

    jsonLd,
  }

  const ogTitle =
    getMetaValue(
      metas,
      'og:title',
    )

  const ogDescription =
    getMetaValue(
      metas,
      'og:description',
    )

  const ogUrl =
    getMetaValue(
      metas,
      'og:url',
    )

  const ogSiteName =
    getMetaValue(
      metas,
      'og:site_name',
    )

  const ogLocale =
    getMetaValue(
      metas,
      'og:locale',
    )

  const ogType =
    getMetaValue(
      metas,
      'og:type',
    )

  const ogImage =
    getMetaValue(
      metas,
      'og:image',
    )

  const ogImageWidth =
    getMetaValue(
      metas,
      'og:image:width',
    )

  const ogImageHeight =
    getMetaValue(
      metas,
      'og:image:height',
    )

  const ogImageAlt =
    getMetaValue(
      metas,
      'og:image:alt',
    )

  const ogImageType =
    getMetaValue(
      metas,
      'og:image:type',
    )

  if (
    ogTitle ||
    ogDescription ||
    ogUrl ||
    ogSiteName ||
    ogLocale ||
    ogType ||
    ogImage
  ) {
    result.openGraph = {
      locale:
        ogLocale,

      type:
        ogType,

      title:
        ogTitle,

      description:
        ogDescription,

      url:
        ogUrl,

      siteName:
        ogSiteName,

      image:
        ogImage
          ? {
              url:
                ogImage,

              width:
                ogImageWidth &&
                Number.isFinite(
                  Number(
                    ogImageWidth,
                  ),
                )
                  ? Number(
                      ogImageWidth,
                    )
                  : undefined,

              height:
                ogImageHeight &&
                Number.isFinite(
                  Number(
                    ogImageHeight,
                  ),
                )
                  ? Number(
                      ogImageHeight,
                    )
                  : undefined,

              alt:
                ogImageAlt,

              type:
                ogImageType,
            }
          : undefined,
    }
  }

  const twitterCard =
    getMetaValue(
      metas,
      'twitter:card',
    )

  const twitterTitle =
    getMetaValue(
      metas,
      'twitter:title',
    )

  const twitterDescription =
    getMetaValue(
      metas,
      'twitter:description',
    )

  const twitterImage =
    getMetaValue(
      metas,
      'twitter:image',
    )

  if (
    twitterCard ||
    twitterTitle ||
    twitterDescription ||
    twitterImage
  ) {
    result.twitter = {
      card:
        twitterCard,

      title:
        twitterTitle,

      description:
        twitterDescription,

      image:
        twitterImage,
    }
  }

  return result
}

export async function getRankMathSEO(
  url: string,
  revalidate = 3600,
): Promise<RankMathSeoData | null> {
  const head =
    await getRankMathHead(
      url,
      revalidate,
    )

  if (!head) {
    return null
  }

  return parseRankMathHead(
    head,
  )
}

/**
 * Converts Rank Math SEO data into Next.js metadata.
 *
 * When a frontend canonical is supplied, it is always
 * authoritative over the WordPress canonical.
 */
export function rankMathToMetadata(
  seo: RankMathSeoData,
  canonicalOverride?: string,
): Metadata {
  const canonical =
    canonicalOverride ||
    seo.canonical ||
    seo.openGraph?.url

  const openGraphType =
    getAllowedOpenGraphType(
      seo.openGraph?.type,
    )

  const twitterCard =
    getAllowedTwitterCard(
      seo.twitter?.card,
    )

  const title =
    seo.title?.trim() ||
    undefined

  const description =
    seo.description?.trim() ||
    undefined

  const openGraphTitle =
    seo.openGraph?.title?.trim() ||
    title

  const openGraphDescription =
    seo.openGraph?.description?.trim() ||
    description

  const openGraphSiteName =
    seo.openGraph?.siteName?.trim() ||
    undefined

  const openGraphLocale =
    seo.openGraph?.locale?.trim() ||
    'fa_IR'

  const openGraphImage =
    seo.openGraph?.image

  const twitterTitle =
    seo.twitter?.title?.trim() ||
    title

  const twitterDescription =
    seo.twitter?.description?.trim() ||
    description

  const twitterImage =
    seo.twitter?.image?.trim() ||
    openGraphImage?.url

  return {
    title,

    description,

    alternates:
      canonical
        ? {
            canonical,
          }
        : undefined,

    robots:
      seo.robots?.trim() ||
      undefined,

    openGraph: {
      type:
        openGraphType,

      title:
        openGraphTitle,

      description:
        openGraphDescription,

      url:
        canonical,

      siteName:
        openGraphSiteName,

      locale:
        openGraphLocale,

      images:
        openGraphImage
          ? [
              {
                url:
                  openGraphImage.url,

                width:
                  openGraphImage.width,

                height:
                  openGraphImage.height,

                alt:
                  openGraphImage.alt,
              },
            ]
          : undefined,
    },

    twitter: {
      card:
        twitterCard,

      title:
        twitterTitle,

      description:
        twitterDescription,

      images:
        twitterImage
          ? [
              twitterImage,
            ]
          : undefined,
    },
  }
}

export function getRankMathSchema(
  seo: RankMathSeoData,
): Record<string, unknown>[] {
  return seo.jsonLd
}

export function getRankMathProductSchema(
  seo: RankMathSeoData,
  wordpressProductUrl: string,
  frontendProductUrl: string,
): Record<string, unknown>[] {
  return seo.jsonLd.map(
    (
      schema,
    ) =>
      normalizeRankMathSchemaUrls(
        schema,
        wordpressProductUrl,
        frontendProductUrl,
      ) as Record<
        string,
        unknown
      >,
  )
}

export function getRankMathPostSchema(
  seo: RankMathSeoData,
  wordpressPostUrl: string,
  frontendPostUrl: string,
): Record<string, unknown>[] {
  return seo.jsonLd.map(
    (
      schema,
    ) =>
      normalizeRankMathSchemaUrls(
        schema,
        wordpressPostUrl,
        frontendPostUrl,
      ) as Record<
        string,
        unknown
      >,
  )
}

export function getRankMathSchemaDate(
  seo: RankMathSeoData,
  field:
    | 'datePublished'
    | 'dateModified',
): string | undefined {
  return extractSchemaField(
    seo.jsonLd,
    field,
  )
}