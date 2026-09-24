import {
  SITE_NAME,
  SITE_URL,
  TEL_PHONE,
  SOCIAL_LINKS,
} from '@/lib/constants'

import {
  SCHEMA_PRICE_CURRENCY,
  tomansToRials,
} from '@/lib/price'

import type {
  Product,
  Post,
  ProductCategoryNode,
  ProductSummary,
  ProductStockStatus,
} from '@/types/wordpress'

export type JsonLdPrimitive =
  | string
  | number
  | boolean
  | null

export type JsonLdValue =
  | JsonLdPrimitive
  | JsonLdObject
  | JsonLdValue[]

export interface JsonLdObject {
  [key: string]:
    | JsonLdValue
    | undefined
}

interface PropertyValueSchema
  extends JsonLdObject {
  '@type': 'PropertyValue'
  name: string
  value: string
}

interface ProductOfferSchema
  extends JsonLdObject {
  '@type': 'Offer'
  price?: string
  priceCurrency?: string
  availability?: string
  url: string
  seller: {
    '@type': 'Organization'
    name: string
    url: string
  }
}

interface ProductSchema
  extends JsonLdObject {
  '@context': 'https://schema.org'
  '@type': 'Product'
  '@id': string
  name: string
  description: string
  url: string
  brand: {
    '@type': 'Brand'
    name: string
  }
  offers: ProductOfferSchema
  image?: string[]
  sku?: string
  category?: string
  additionalProperty?: PropertyValueSchema[]
  aggregateRating?: {
    '@type': 'AggregateRating'
    ratingValue: number
    reviewCount: number
  }
}

interface BreadcrumbSchema
  extends JsonLdObject {
  '@context': 'https://schema.org'
  '@type': 'BreadcrumbList'
  itemListElement: {
    '@type': 'ListItem'
    position: number
    name: string
    item: string
  }[]
}

interface ArticleSchema
  extends JsonLdObject {
  '@context': 'https://schema.org'
  '@type': 'BlogPosting'
  '@id': string
  headline: string
  description: string
  inLanguage?: string
  mainEntityOfPage: {
    '@type': 'WebPage'
    '@id': string
  }
  author: {
    '@type': 'Organization'
    name: string
    url: string
  }
  publisher: {
    '@type': 'Organization'
    name: string
    url: string
  }
  datePublished?: string
  dateModified?: string
  image?: string[]
}

interface OrganizationSchema
  extends JsonLdObject {
  '@context': 'https://schema.org'
  '@type': 'Organization'
  '@id': string
  name: string
  url: string
  sameAs?: string[]
  logo?: {
    '@type': 'ImageObject'
    url: string
  }
  contactPoint?: {
    '@type': 'ContactPoint'
    telephone?: string
    contactType: string
    areaServed: string
    availableLanguage: string[]
  }
}

interface AboutPageSchema
  extends JsonLdObject {
  '@context': 'https://schema.org'
  '@type': 'AboutPage'
  '@id': string
  name: string
  description: string
  url: string
  inLanguage?: string
  isPartOf: {
    '@id': string
  }
  about: {
    '@id': string
  }
  publisher: {
    '@id': string
  }
  primaryImageOfPage?: {
    '@type': 'ImageObject'
    url: string
  }
}

interface ContactPageSchema
  extends JsonLdObject {
  '@context': 'https://schema.org'
  '@type': 'ContactPage'
  '@id': string
  name: string
  description: string
  url: string
  inLanguage?: string
  isPartOf: {
    '@id': string
  }
  about: {
    '@id': string
  }
  mainEntity: {
    '@id': string
  }
  publisher: {
    '@id': string
  }
}

interface LocalBusinessSchema
  extends JsonLdObject {
  '@context': 'https://schema.org'
  '@type': 'LocalBusiness'
  '@id': string
  name: string
  url: string
  email?: string
  telephone?: string
  sameAs?: string[]
  hasMap?: string
  address: {
    '@type': 'PostalAddress'
    streetAddress: string
    addressLocality: string
    addressCountry: string
  }
  geo: {
    '@type': 'GeoCoordinates'
    latitude: number
    longitude: number
  }
}
interface WebsiteSchema
  extends JsonLdObject {
  '@context': 'https://schema.org'
  '@type': 'WebSite'
  '@id': string
  name: string
  url: string
  publisher: {
    '@id': string
  }
  potentialAction?: {
    '@type': 'SearchAction'
    target: string
    'query-input': string
  }
}

interface ItemListSchema
  extends JsonLdObject {
  '@type': 'ItemList'
  numberOfItems: number
  itemListElement: {
    '@type': 'ListItem'
    position: number
    name: string
    item: string
  }[]
}

interface CollectionPageSchema
  extends JsonLdObject {
  '@context': 'https://schema.org'
  '@type': 'CollectionPage'
  '@id': string
  name: string
  description: string
  url: string
  mainEntity: ItemListSchema
}

function getSiteUrl(): string {
  return SITE_URL.replace(
    /\/+$/,
    '',
  )
}

function getProductUrl(
  slug: string,
): string {
  return `${getSiteUrl()}/products/${encodeURIComponent(
    slug,
  )}`
}

function getPostUrl(
  slug: string,
): string {
  return `${getSiteUrl()}/blog/${encodeURIComponent(
    slug,
  )}`
}

function getCategoryUrl(
  slug: string,
): string {
  return `${getSiteUrl()}/categories/${encodeURIComponent(
    slug,
  )}`
}

function mapStockAvailability(
  status:
    | ProductStockStatus
    | undefined,
): string | undefined {
  switch (status) {
    case 'outofstock':
      return 'https://schema.org/OutOfStock'

    case 'onbackorder':
      return 'https://schema.org/BackOrder'

    case 'instock':
      return 'https://schema.org/InStock'

    default:
      return undefined
  }
}

function getProductImages(
  product: Product,
): string[] {
  const images: string[] = []

  if (product.image?.sourceUrl) {
    images.push(
      product.image.sourceUrl,
    )
  }

  for (
    const image of
      product.galleryImages?.nodes ?? []
  ) {
    if (
      image.sourceUrl &&
      !images.includes(
        image.sourceUrl,
      )
    ) {
      images.push(
        image.sourceUrl,
      )
    }
  }

  return images
}

function addProperty(
  properties: PropertyValueSchema[],
  name: string,
  value?: string,
): void {
  if (!value?.trim()) {
    return
  }

  properties.push({
    '@type': 'PropertyValue',
    name,
    value: value.trim(),
  })
}

function getProductProperties(
  product: Product,
): PropertyValueSchema[] {
  const properties: PropertyValueSchema[] = []

  for (
    const attribute of
      product.attributes?.nodes ?? []
  ) {
    if (
      !attribute.name ||
      attribute.options.length === 0
    ) {
      continue
    }

    addProperty(
      properties,
      attribute.name,
      attribute.options.join('، '),
    )
  }

  addProperty(
    properties,
    'ابعاد',
    product.acf?.dimensions,
  )

  addProperty(
    properties,
    'وزن',
    product.acf?.weight,
  )

  addProperty(
    properties,
    'نوع سنگ',
    product.acf?.stoneType,
  )

  addProperty(
    properties,
    'پرداخت سطح',
    product.acf?.surfaceFinish,
  )

  addProperty(
    properties,
    'خانواده رنگ',
    product.acf?.colorFamily,
  )

  addProperty(
    properties,
    'کاربرد',
    product.acf?.application,
  )

  addProperty(
    properties,
    'کد محصول',
    product.acf?.productCode,
  )

  return properties
}

export function toJsonLdString(
  obj: JsonLdObject,
): string {
  return JSON.stringify(obj)
}

export function generateOrganizationSchema(): OrganizationSchema {
  const siteUrl = getSiteUrl()

  const schema: OrganizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: SITE_NAME,
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: siteUrl + '/logo.png',
    },
    sameAs: Object.values(SOCIAL_LINKS).filter(
      (url) => url.trim().length > 0,
    ),
  }

  if (process.env.NEXT_PUBLIC_TEL?.trim()) {
    schema.contactPoint = {
      '@type': 'ContactPoint',
      telephone: TEL_PHONE,
      contactType: 'customer service',
      areaServed: 'IR',
      availableLanguage: ['fa'],
    }
  }

  return schema
}

export function generateAboutPageSchema(): AboutPageSchema {
  const siteUrl = getSiteUrl()

  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${siteUrl}/about#about-page`,
    name: `درباره ما | ${SITE_NAME}`,
    description: 'سرای سنگ، مرجع تخصصی سنگ‌های ساختمانی با سال‌ها تجربه در تأمین و عرضه سنگ‌های با کیفیت.',
    url: `${siteUrl}/about`,
    inLanguage: 'fa-IR',
    isPartOf: {
      '@id': `${siteUrl}/#website`,
    },
    about: {
      '@id': `${siteUrl}/#organization`,
    },
    publisher: {
      '@id': `${siteUrl}/#organization`,
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: `${siteUrl}/images/home/banner-desktop-1.png`,
    },
  }
}

export function generateContactPageSchema(): ContactPageSchema {
  const siteUrl = getSiteUrl()

  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${siteUrl}/contact#contact-page`,
    name: `تماس با ما | ${SITE_NAME}`,
    description: 'برای استعلام قیمت، مشاوره تخصصی و ارتباط مستقیم با تیم سرای سنگ با ما در تماس باشید.',
    url: `${siteUrl}/contact`,
    inLanguage: 'fa-IR',
    isPartOf: {
      '@id': `${siteUrl}/#website`,
    },
    about: {
      '@id': `${siteUrl}/#organization`,
    },
    mainEntity: {
      '@id': `${siteUrl}/#local-business`,
    },
    publisher: {
      '@id': `${siteUrl}/#organization`,
    },
  }
}

export function generateLocalBusinessSchema({
  streetAddress,
  addressLocality,
  addressCountry,
  latitude,
  longitude,
  email,
  mapUrl,
}: {
  streetAddress: string
  addressLocality: string
  addressCountry: string
  latitude: number
  longitude: number
  email?: string
  mapUrl?: string
}): LocalBusinessSchema {
  const siteUrl = getSiteUrl()

  const schema: LocalBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteUrl}/#local-business`,
    name: SITE_NAME,
    url: siteUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress,
      addressLocality,
      addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude,
      longitude,
    },
    sameAs: Object.values(SOCIAL_LINKS).filter(
      (url) => url.trim().length > 0,
    ),
  }

  if (process.env.NEXT_PUBLIC_TEL?.trim()) {
    schema.telephone = TEL_PHONE
  }

  if (email?.trim()) {
    schema.email = email.trim()
  }

  if (mapUrl?.trim()) {
    schema.hasMap = mapUrl.trim()
  }

  return schema
}
export function generateWebSiteSchema(): WebsiteSchema {
  const siteUrl = getSiteUrl()

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    name: SITE_NAME,
    url: siteUrl,
    publisher: {
      '@id': `${siteUrl}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/search?q={search_term_string}`,
      'query-input':
        'required name=search_term_string',
    },
  }
}

export function generateProductSchema(
  product: Product,
): ProductSchema {
  const productUrl = getProductUrl(
    product.slug,
  )

  const productId =
    `${productUrl}#product`

  const images =
    getProductImages(product)

  const rawPrice =
    product.price ||
    product.salePrice ||
    product.regularPrice

  const schemaPrice =
    tomansToRials(rawPrice)

  const properties =
    getProductProperties(product)

  const firstCategory =
    product.productCategories
      ?.nodes?.[0]

  const sku =
    product.sku ||
    product.acf?.productCode

  const availability =
    mapStockAvailability(
      product.stockStatus,
    )

  const offer: ProductOfferSchema = {
    '@type': 'Offer',
    url: productUrl,
    seller: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: getSiteUrl(),
    },
  }

  if (schemaPrice) {
    offer.price = schemaPrice
    offer.priceCurrency =
      SCHEMA_PRICE_CURRENCY
  }

  if (availability) {
    offer.availability =
      availability
  }

  const schema: ProductSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': productId,
    name: product.name,
    description:
      stripHtmlText(
        product.shortDescription ||
          product.description,
      ) || product.name,
    url: productUrl,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    offers: offer,
  }

  if (images.length > 0) {
    schema.image = images
  }

  if (sku) {
    schema.sku = sku
  }

  if (firstCategory?.name) {
    schema.category =
      firstCategory.name
  }

  if (properties.length > 0) {
    schema.additionalProperty =
      properties
  }

  if (
    product.averageRating &&
    product.averageRating > 0 &&
    product.reviewCount &&
    product.reviewCount > 0
  ) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue:
        product.averageRating,
      reviewCount:
        product.reviewCount,
    }
  }

  return schema
}

function stripHtmlText(
  value?: string | null,
): string {
  if (!value) {
    return ''
  }

  return value
    .replace(
      /<script\b[^>]*>[\s\S]*?<\/script>/gi,
      ' ',
    )
    .replace(
      /<style\b[^>]*>[\s\S]*?<\/style>/gi,
      ' ',
    )
    .replace(/<[^>]*>/g, ' ')
    .replace(/\u00a0/g, ' ')
    .replace(
      /&nbsp;/gi,
      ' ',
    )
    .replace(
      /&amp;/gi,
      '&',
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
      /&#39;/gi,
      "'",
    )
    .replace(
      /&quot;/gi,
      '"',
    )
    .replace(
      /&#(\d+);/g,
      (_match, code: string) =>
        String.fromCharCode(
          Number(code),
        ),
    )
    .replace(
      /&#x([0-9a-f]+);/gi,
      (_match, code: string) =>
        String.fromCharCode(
          parseInt(code, 16),
        ),
    )
    .replace(/\s+/g, ' ')
    .trim()
}

export function generateArticleSchema(
  post: Post,
): ArticleSchema {
  const postUrl = getPostUrl(
    post.slug,
  )

  const postId =
    `${postUrl}#article`

  const image =
    post.featuredImage
      ?.node
      ?.sourceUrl

  const schema: ArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': postId,
    headline: post.title,
    description:
      stripHtmlText(post.excerpt) ||
      post.title,
    inLanguage: 'fa-IR',

    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },

    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: getSiteUrl(),
    },

    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: getSiteUrl(),
    },

    datePublished:
      post.date,

    dateModified:
      post.modified ||
      post.date,
  }

  if (image) {
    schema.image = [image]
  }

  return schema
}

export function generateBreadcrumbSchema(
  items: {
    name: string
    path: string
  }[],
): BreadcrumbSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(
      (item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: `${getSiteUrl()}${item.path}`,
      }),
    ),
  }
}

export function generateCollectionPageSchema(
  category: ProductCategoryNode,
  products: ProductSummary[],
  totalItems = products.length,
): CollectionPageSchema {
  const categoryUrl =
    getCategoryUrl(
      category.slug,
    )

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id':
      `${categoryUrl}#collection`,
    name: category.name,
    description:
      stripHtmlText(
        category.description,
      ) ||
      `محصولات ${category.name}`,
    url: categoryUrl,

    mainEntity: {
      '@type': 'ItemList',
      numberOfItems:
        totalItems,

      itemListElement:
        products.map(
          (product, index) => {
            const productUrl =
              getProductUrl(
                product.slug,
              )

            return {
              '@type': 'ListItem',
              position:
                index + 1,
              name:
                product.name,
              item:
                productUrl,
            }
          },
        ),
    },
  }
}

/**
 * JSON serialization for HTML script tags.
 *
 * Replaces characters that could terminate
 * a script element inside user-controlled text.
 */
function serializeJsonLd(
  data: JsonLdObject,
): string {
  return JSON.stringify(data)
    .replace(
      /</g,
      '\\u003c',
    )
    .replace(
      />/g,
      '\\u003e',
    )
    .replace(
      /&/g,
      '\\u0026',
    )
}

export function JsonLd({
  data,
}: {
  data: JsonLdObject
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html:
          serializeJsonLd(data),
      }}
    />
  )
}