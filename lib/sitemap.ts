export interface SitemapEntry {
  url: string

  lastModified?: string

  changeFrequency?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never'

  priority?: number
}

function escapeXml(
  value: string,
): string {
  return value
    .replace(
      /&/g,
      '&amp;',
    )
    .replace(
      /</g,
      '&lt;',
    )
    .replace(
      />/g,
      '&gt;',
    )
    .replace(
      /"/g,
      '&quot;',
    )
    .replace(
      /'/g,
      '&apos;',
    )
}

export function normalizeLastModified(
  value?: string,
): string | undefined {
  if (!value) {
    return undefined
  }

  const date =
    new Date(value)

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return undefined
  }

  return date.toISOString()
}

function renderUrl(
  entry: SitemapEntry,
): string {
  const parts = [
    '<url>',
    '<loc>' +
      escapeXml(
        entry.url,
      ) +
      '</loc>',
  ]

  const lastModified =
    normalizeLastModified(
      entry.lastModified,
    )

  if (
    lastModified
  ) {
    parts.push(
      '<lastmod>' +
        lastModified +
        '</lastmod>',
    )
  }

  if (
    entry.changeFrequency
  ) {
    parts.push(
      '<changefreq>' +
        entry.changeFrequency +
        '</changefreq>',
    )
  }

  if (
    typeof entry.priority ===
    'number'
  ) {
    parts.push(
      '<priority>' +
        entry.priority.toFixed(1) +
        '</priority>',
    )
  }

  parts.push(
    '</url>',
  )

  return parts.join('')
}

export function buildUrlSet(
  entries: SitemapEntry[],
): string {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map(
      renderUrl,
    ),
    '</urlset>',
  ].join('\n')
}

export function buildSitemapIndex(
  entries: {
    url: string
    lastModified?: string
  }[],
): string {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map(
      (entry) => {
        const lastModified =
          normalizeLastModified(
            entry.lastModified,
          )

        return [
          '<sitemap>',
          '<loc>' +
            escapeXml(
              entry.url,
            ) +
            '</loc>',
          lastModified
            ? '<lastmod>' +
                lastModified +
                '</lastmod>'
            : '',
          '</sitemap>',
        ].join('')
      },
    ),
    '</sitemapindex>',
  ].join('\n')
}

export function maxLastModified(
  values:
    (
      | string
      | undefined
    )[],
): string | undefined {
  let latestTimestamp:
    | number
    | undefined

  let latestValue:
    | string
    | undefined

  for (
    const value of
    values
  ) {
    const normalized =
      normalizeLastModified(
        value,
      )

    if (
      !normalized
    ) {
      continue
    }

    const timestamp =
      Date.parse(
        normalized,
      )

    if (
      latestTimestamp ===
        undefined ||
      timestamp >
        latestTimestamp
    ) {
      latestTimestamp =
        timestamp

      latestValue =
        normalized
    }
  }

  return latestValue
}
