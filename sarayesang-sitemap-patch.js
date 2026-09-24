const fs = require('fs')
const path = require('path')

const root = process.cwd()

function fullPath(file) {
  return path.join(root, file)
}

function read(file) {
  return fs
    .readFileSync(fullPath(file), 'utf8')
    .replace(/\r\n/g, '\n')
}

function write(file, content) {
  const target = fullPath(file)

  fs.mkdirSync(
    path.dirname(target),
    { recursive: true },
  )

  fs.writeFileSync(
    target,
    content.replace(/\r\n/g, '\n'),
    'utf8',
  )
}

function backup(file) {
  const source = fullPath(file)

  if (!fs.existsSync(source)) {
    return
  }

  const backupPath =
    source + '.sitemap-backup'

  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(
      source,
      backupPath,
    )
  }
}

function replaceOnce(
  file,
  pattern,
  replacement,
  flags = '',
) {
  const current =
    read(file)

  const regex =
    pattern instanceof RegExp
      ? pattern
      : new RegExp(
          pattern,
          flags,
        )

  if (!regex.test(current)) {
    throw new Error(
      'Marker not found in ' +
      file,
    )
  }

  write(
    file,
    current.replace(
      regex,
      replacement,
    ),
  )
}

function insertBefore(
  file,
  marker,
  block,
) {
  const current =
    read(file)

  if (
    current.includes(
      block.trim(),
    )
  ) {
    return
  }

  const index =
    current.indexOf(marker)

  if (index === -1) {
    throw new Error(
      'Insert marker not found in ' +
      file,
    )
  }

  write(
    file,
    current.slice(0, index) +
      block +
      '\n\n' +
      current.slice(index),
  )
}

const existingFiles = [
  'lib/woocommerce.ts',
  'lib/repositories/product-repository.ts',
  'lib/queries.ts',
  'lib/repositories/post-repository.ts',
  'app/sitemap.ts',
]

for (
  const file of
  existingFiles
) {
  backup(file)
}

/*
|--------------------------------------------------------------------------
| 1. WooCommerce product sitemap data
|--------------------------------------------------------------------------
*/

insertBefore(
  'lib/woocommerce.ts',
  'export async function getProductCategoriesFromWooCommerce',
  `export interface ProductSitemapEntry {
  slug: string
  lastModified?: string
  categoryIds: string[]
}

export async function getAllProductSitemapEntriesFromWooCommerce(): Promise<
  ProductSitemapEntry[]
> {
  const entries = new Map<
    string,
    ProductSitemapEntry
  >()

  let page = 1

  while (page <= 500) {
    const params =
      new URLSearchParams({
        status: 'publish',
        page: String(page),
        per_page: '100',
        orderby: 'modified',
        order: 'desc',
      })

    const { data } =
      await wcFetch<
        WooCommerceProductList
      >(
        PRODUCTS_ENDPOINT,
        params,
        300,
      )

    if (
      !Array.isArray(data) ||
      data.length === 0
    ) {
      break
    }

    for (
      const product of
      data
    ) {
      const slug =
        normalizeSlug(
          product.slug,
        ).trim()

      if (
        !slug ||
        entries.has(slug)
      ) {
        continue
      }

      entries.set(
        slug,
        {
          slug,
          lastModified:
            product.date_modified?.trim() ||
            undefined,
          categoryIds:
            (
              product.categories ??
              []
            ).map(
              (category) =>
                String(
                  category.id,
                ),
            ),
        },
      )
    }

    if (
      entries.size >
      50000
    ) {
      throw new Error(
        'Product sitemap exceeds the 50,000 URL limit. Split it into multiple sitemaps.',
      )
    }

    if (
      data.length <
      100
    ) {
      break
    }

    if (
      page === 500
    ) {
      throw new Error(
        'Product sitemap reached the 50,000 URL limit. Split it into multiple sitemaps.',
      )
    }

    page += 1
  }

  return Array.from(
    entries.values(),
  )
}`,
)

/*
|--------------------------------------------------------------------------
| 2. Product repository
|--------------------------------------------------------------------------
*/

replaceOnce(
  'lib/repositories/product-repository.ts',
  /  getAllProductSlugsFromWooCommerce,\n  searchWooCommerceProducts,/,
  `  getAllProductSlugsFromWooCommerce,
  getAllProductSitemapEntriesFromWooCommerce,
  searchWooCommerceProducts,`,
)

insertBefore(
  'lib/repositories/product-repository.ts',
  'export async function getAllProductSlugs(): Promise<',
  `export async function getAllProductSitemapEntries() {
  return getAllProductSitemapEntriesFromWooCommerce()
}`,
)

/*
|--------------------------------------------------------------------------
| 3. WordPress article modified timestamps
|--------------------------------------------------------------------------
*/

replaceOnce(
  'lib/queries.ts',
  /export const GET_ALL_POST_SLUGS = `[\s\S]*?`\n/,
  `export const GET_ALL_POST_SLUGS = \`
  query GetAllPostSlugs(
    $first: Int!
    $after: String
  ) {
    posts(
      first: $first
      after: $after
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }

      nodes {
        slug
        modified
      }
    }
  }
\`
`,
)

replaceOnce(
  'lib/repositories/post-repository.ts',
  /  nodes: \{\n    slug: string\n  \}\[\]/,
  `  nodes: {
    slug: string
    modified: string | null
  }[]`,
)

replaceOnce(
  'lib/repositories/post-repository.ts',
  /export const getAllPostSlugs =[\s\S]*$/m,
  `export const getAllPostSitemapEntries =
  cache(
    async (): Promise<
      {
        slug: string
        lastModified?: string
      }[]
    > => {
      const entries: {
        slug: string
        lastModified?: string
      }[] = []

      let hasNextPage = true

      let after:
        | string
        | null = null

      while (
        hasNextPage
      ) {
        const data:
          GetAllPostSlugsQueryResponse =
          await fetchGraphQL<
            GetAllPostSlugsQueryResponse
          >(
            GET_ALL_POST_SLUGS,
            {
              first: 100,
              after,
            },
          )

        for (
          const post of
          data.posts.nodes
        ) {
          if (
            !post.slug
          ) {
            continue
          }

          entries.push({
            slug:
              post.slug,
            lastModified:
              post.modified ||
              undefined,
          })
        }

        if (
          entries.length >
          50000
        ) {
          throw new Error(
            'Article sitemap exceeds the 50,000 URL limit. Split it into multiple sitemaps.',
          )
        }

        hasNextPage =
          data.posts.pageInfo
            .hasNextPage

        after =
          data.posts.pageInfo
            .endCursor
      }

      return entries
    },
  )

export const getAllPostSlugs =
  cache(
    async (): Promise<string[]> => {
      const entries =
        await getAllPostSitemapEntries()

      return entries.map(
        (entry) =>
          entry.slug,
      )
    },
  )
`,
)

/*
|--------------------------------------------------------------------------
| 4. Sitemap XML helpers
|--------------------------------------------------------------------------
*/

write(
  'lib/sitemap.ts',
  `export interface SitemapEntry {
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
  ].join('\\n')
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
  ].join('\\n')
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
`,
)

/*
|--------------------------------------------------------------------------
| 5. Explicit XML routes
|--------------------------------------------------------------------------
*/

const routes = {
  'app/sitemap.xml/route.ts': `import { SITE_URL } from '@/lib/constants'

import { getProductCategories } from '@/lib/repositories/category-repository'

import { getAllPostSitemapEntries } from '@/lib/repositories/post-repository'

import { getAllProductSitemapEntries } from '@/lib/repositories/product-repository'

import {
  buildSitemapIndex,
  maxLastModified,
} from '@/lib/sitemap'

export const revalidate = 300

const siteUrl =
  SITE_URL.replace(
    /\\/+$/,
    '',
  )

export async function GET() {
  const [
    products,
    posts,
    categories,
  ] = await Promise.all([
    getAllProductSitemapEntries(),
    getAllPostSitemapEntries(),
    getProductCategories(),
  ])

  const productLastModified =
    maxLastModified(
      products.map(
        (product) =>
          product.lastModified,
      ),
    )

  const articleLastModified =
    maxLastModified(
      posts.map(
        (post) =>
          post.lastModified,
      ),
    )

  const categoryLastModified =
    maxLastModified(
      categories.map(
        (category) => {
          const categoryId =
            String(
              category.id,
            )

          return maxLastModified(
            products
              .filter(
                (product) =>
                  product.categoryIds.includes(
                    categoryId,
                  ),
              )
              .map(
                (product) =>
                  product.lastModified,
              ),
          )
        },
      ),
    )

  const xml =
    buildSitemapIndex([
      {
        url:
          siteUrl +
          '/product-sitemap.xml',
        lastModified:
          productLastModified,
      },
      {
        url:
          siteUrl +
          '/categories-sitemap.xml',
        lastModified:
          categoryLastModified,
      },
      {
        url:
          siteUrl +
          '/article-sitemap.xml',
        lastModified:
          articleLastModified,
      },
      {
        url:
          siteUrl +
          '/landing-pages-sitemap.xml',
        lastModified:
          maxLastModified([
            productLastModified,
            articleLastModified,
            categoryLastModified,
          ]),
      },
    ])

  return new Response(
    xml,
    {
      headers: {
        'Content-Type':
          'application/xml; charset=utf-8',

        'X-Content-Type-Options':
          'nosniff',
      },
    },
  )
}
`,

  'app/product-sitemap.xml/route.ts': `import { SITE_URL } from '@/lib/constants'

import {
  getAllProductSitemapEntries,
} from '@/lib/repositories/product-repository'

import {
  buildUrlSet,
} from '@/lib/sitemap'

export const revalidate = 300

const siteUrl =
  SITE_URL.replace(
    /\\/+$/,
    '',
  )

export async function GET() {
  const products =
    await getAllProductSitemapEntries()

  const xml =
    buildUrlSet(
      products.map(
        (product) => ({
          url:
            siteUrl +
            '/products/' +
            encodeURIComponent(
              product.slug,
            ),

          lastModified:
            product.lastModified,

          changeFrequency:
            'weekly' as const,

          priority:
            0.9,
        }),
      ),
    )

  return new Response(
    xml,
    {
      headers: {
        'Content-Type':
          'application/xml; charset=utf-8',

        'X-Content-Type-Options':
          'nosniff',
      },
    },
  )
}
`,

  'app/categories-sitemap.xml/route.ts': `import { SITE_URL } from '@/lib/constants'

import {
  getProductCategories,
} from '@/lib/repositories/category-repository'

import {
  getAllProductSitemapEntries,
} from '@/lib/repositories/product-repository'

import {
  buildUrlSet,
  maxLastModified,
} from '@/lib/sitemap'

export const revalidate = 300

const siteUrl =
  SITE_URL.replace(
    /\\/+$/,
    '',
  )

export async function GET() {
  const [
    categories,
    products,
  ] = await Promise.all([
    getProductCategories(),
    getAllProductSitemapEntries(),
  ])

  const xml =
    buildUrlSet(
      categories.map(
        (category) => {
          const categoryId =
            String(
              category.id,
            )

          const lastModified =
            maxLastModified(
              products
                .filter(
                  (product) =>
                    product.categoryIds.includes(
                      categoryId,
                    ),
                )
                .map(
                  (product) =>
                    product.lastModified,
                ),
            )

          return {
            url:
              siteUrl +
              '/categories/' +
              encodeURIComponent(
                category.slug,
              ),

            lastModified,

            changeFrequency:
              'weekly' as const,

            priority:
              0.7,
          }
        },
      ),
    )

  return new Response(
    xml,
    {
      headers: {
        'Content-Type':
          'application/xml; charset=utf-8',

        'X-Content-Type-Options':
          'nosniff',
      },
    },
  )
}
`,

  'app/article-sitemap.xml/route.ts': `import { SITE_URL } from '@/lib/constants'

import {
  getAllPostSitemapEntries,
} from '@/lib/repositories/post-repository'

import {
  buildUrlSet,
} from '@/lib/sitemap'

export const revalidate = 300

const siteUrl =
  SITE_URL.replace(
    /\\/+$/,
    '',
  )

export async function GET() {
  const posts =
    await getAllPostSitemapEntries()

  const xml =
    buildUrlSet(
      posts.map(
        (post) => ({
          url:
            siteUrl +
            '/blog/' +
            encodeURIComponent(
              post.slug,
            ),

          lastModified:
            post.lastModified,

          changeFrequency:
            'weekly' as const,

          priority:
            0.8,
        }),
      ),
    )

  return new Response(
    xml,
    {
      headers: {
        'Content-Type':
          'application/xml; charset=utf-8',

        'X-Content-Type-Options':
          'nosniff',
      },
    },
  )
}
`,

  'app/landing-pages-sitemap.xml/route.ts': `import { SITE_URL } from '@/lib/constants'

import {
  getProductCategories,
} from '@/lib/repositories/category-repository'

import {
  getAllPostSitemapEntries,
} from '@/lib/repositories/post-repository'

import {
  getAllProductSitemapEntries,
} from '@/lib/repositories/product-repository'

import {
  buildUrlSet,
  maxLastModified,
} from '@/lib/sitemap'

export const revalidate = 300

const siteUrl =
  SITE_URL.replace(
    /\\/+$/,
    '',
  )

export async function GET() {
  const [
    products,
    posts,
    categories,
  ] = await Promise.all([
    getAllProductSitemapEntries(),
    getAllPostSitemapEntries(),
    getProductCategories(),
  ])

  const productLastModified =
    maxLastModified(
      products.map(
        (product) =>
          product.lastModified,
      ),
    )

  const articleLastModified =
    maxLastModified(
      posts.map(
        (post) =>
          post.lastModified,
      ),
    )

  const categoryLastModified =
    maxLastModified(
      categories.map(
        (category) => {
          const categoryId =
            String(
              category.id,
            )

          return maxLastModified(
            products
              .filter(
                (product) =>
                  product.categoryIds.includes(
                    categoryId,
                  ),
              )
              .map(
                (product) =>
                  product.lastModified,
              ),
          )
        },
      ),
    )

  const xml =
    buildUrlSet([
      {
        url:
          siteUrl,

        lastModified:
          maxLastModified([
            productLastModified,
            articleLastModified,
            categoryLastModified,
          ]),

        changeFrequency:
          'daily',

        priority:
          1.0,
      },

      {
        url:
          siteUrl +
          '/products',

        lastModified:
          productLastModified,

        changeFrequency:
          'daily',

        priority:
          0.9,
      },

      {
        url:
          siteUrl +
          '/categories',

        lastModified:
          categoryLastModified,

        changeFrequency:
          'weekly',

        priority:
          0.8,
      },

      {
        url:
          siteUrl +
          '/about',

        changeFrequency:
          'monthly',

        priority:
          0.7,
      },

      {
        url:
          siteUrl +
          '/contact',

        changeFrequency:
          'monthly',

        priority:
          0.7,
      },

      {
        url:
          siteUrl +
          '/blog',

        lastModified:
          articleLastModified,

        changeFrequency:
          'daily',

        priority:
          0.8,
      },

      {
        url:
          siteUrl +
          '/tools',

        changeFrequency:
          'monthly',

        priority:
          0.7,
      },
    ])

  return new Response(
    xml,
    {
      headers: {
        'Content-Type':
          'application/xml; charset=utf-8',

        'X-Content-Type-Options':
          'nosniff',
      },
    },
  )
}
`,
}

const routePaths =
  Object.keys(routes)

for (
  const file of
  routePaths
) {
  const target =
    fullPath(file)

  if (
    fs.existsSync(target)
  ) {
    throw new Error(
      'Target sitemap route already exists: ' +
      file,
    )
  }
}

/*
|--------------------------------------------------------------------------
| 6. Replace old app/sitemap.ts
|--------------------------------------------------------------------------
*/

const oldSitemap =
  fullPath(
    'app/sitemap.ts',
  )

if (
  fs.existsSync(
    oldSitemap,
  )
) {
  fs.unlinkSync(
    oldSitemap,
  )
}

/*
|--------------------------------------------------------------------------
| 7. Write new routes
|--------------------------------------------------------------------------
*/

for (
  const [
    file,
    content,
  ] of Object.entries(
    routes,
  )
) {
  write(
    file,
    content,
  )
}

console.log(
  'Professional sitemap architecture created successfully.',
)

console.log(
  'Backups: *.sitemap-backup',
)

console.log(
  'Removed: app/sitemap.ts',
)

for (
  const file of
  routePaths
) {
  console.log(
    'Created: ' +
    file,
  )
}

console.log(
  'Created: lib/sitemap.ts',
)