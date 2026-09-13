import 'server-only'

import type {
  AcfProductData,
  Image,
  Product,
  ProductCategoryNode,
  ProductStockStatus,
  ProductSummary,
} from '@/types/wordpress'

import { WORDPRESS_URL } from '@/lib/constants'

const WC_API_URL =
  `${WORDPRESS_URL.replace(/\/$/, '')}/index.php?rest_route=/wc/v3`

const CONSUMER_KEY =
  process.env.WORDPRESS_CONSUMER_KEY

const CONSUMER_SECRET =
  process.env.WORDPRESS_CONSUMER_SECRET

const REQUEST_TIMEOUT_MS = 10_000

if (
  !CONSUMER_KEY ||
  !CONSUMER_SECRET
) {
  throw new Error(
    'WooCommerce credentials are missing: WORDPRESS_CONSUMER_KEY / WORDPRESS_CONSUMER_SECRET',
  )
}

interface WooCommerceImage {
  id?: number
  src?: string
  alt?: string
  width?: number
  height?: number
}

interface WooCommerceCategory {
  id: number
  name: string
  slug: string
}

interface WooCommerceAttribute {
  id: number
  name: string
  options?: string[]
  position?: number
  visible?: boolean
  variation?: boolean
}

interface WooCommerceMetaData {
  id?: number
  key?: string
  value?: unknown
}

interface WooCommerceAcfData {
  productCode?: unknown
  product_code?: unknown

  stoneType?: unknown
  stone_type?: unknown

  dimensions?: unknown

  weight?: unknown

  surfaceFinish?: unknown
  surface_finish?: unknown

  colorFamily?: unknown
  color_family?: unknown

  application?: unknown

  imageGallery?: unknown
  image_gallery?: unknown
}

interface WooCommerceProduct {
  id: number
  name: string
  slug: string

  description?: string
  short_description?: string

  sku?: string

  price?: string
  regular_price?: string
  sale_price?: string

  on_sale?: boolean
  featured?: boolean

  average_rating?: string
  rating_count?: number

  weight?: string

  dimensions?: {
    length?: string
    width?: string
    height?: string
  }

  categories?: WooCommerceCategory[]
  images?: WooCommerceImage[]
  attributes?: WooCommerceAttribute[]

  acf?: WooCommerceAcfData | null

  meta_data?: WooCommerceMetaData[]

  stock_status?: string

  date_created?: string
  date_modified?: string

  status?: string
}

interface WooCommerceProductCategory {
  id: number
  name: string
  slug: string

  parent?: number

  description?: string
  count?: number

  image?: {
    id?: number
    src?: string
    alt?: string
    width?: number
    height?: number
  } | null
}

type WooCommerceProductList =
  WooCommerceProduct[]

const PRODUCTS_ENDPOINT =
  `${WC_API_URL}/products`

const PRODUCT_CATEGORIES_ENDPOINT =
  `${WC_API_URL}/products/categories`

function normalizeSlug(
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

function createAuthHeader(): string {
  const credentials =
    `${CONSUMER_KEY}:${CONSUMER_SECRET}`

  return `Basic ${Buffer.from(
    credentials,
  ).toString('base64')}`
}

async function wcFetch<T>(
  endpoint: string,
  searchParams?: URLSearchParams,
  revalidate = 300,
): Promise<{
  data: T
  headers: Headers
}> {
  const queryString =
    searchParams?.toString()

  const url =
    queryString
      ? `${endpoint}&${queryString}`
      : endpoint

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
        url,
        {
          method: 'GET',

          headers: {
            Accept:
              'application/json',

            Authorization:
              createAuthHeader(),
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
      const body =
        await response
          .text()
          .catch(
            () => '',
          )

      throw new Error(
        `WooCommerce request failed with status ${response.status}: ${body.slice(
          0,
          500,
        )}`,
      )
    }

    const data =
      (await response.json()) as T

    return {
      data,

      headers:
        response.headers,
    }
  } catch (error) {
    if (
      error instanceof DOMException &&
      error.name ===
        'AbortError'
    ) {
      throw new Error(
        'WooCommerce request timed out',
      )
    }

    throw error
  } finally {
    clearTimeout(
      timeout,
    )
  }
}

function normalizeText(
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

function normalizeUrl(
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

function normalizePositiveDimension(
  value: unknown,
): string | undefined {
  return normalizeText(
    value,
  )
}

function normalizeStockStatus(
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

function normalizeImage(
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

function normalizeGenericImage(
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

function normalizeImageCollection(
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

function getAcfString(
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

function getAcfImages(
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

function uniqueImages(
  images: Image[],
): Image[] {
  const seen =
    new Set<string>()

  const result: Image[] = []

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

function mapCategory(
  category: WooCommerceProductCategory,
  allProducts?: WooCommerceProduct[],
): ProductCategoryNode {
  const count =
    category.count ??
    (
      allProducts
        ? allProducts.filter(
            (
              product,
            ) =>
              product.categories?.some(
                (
                  item,
                ) =>
                  item.id ===
                  category.id,
              ),
          ).length
        : undefined
    )

  const imageSrc =
    category.image?.src

  return {
    id:
      String(
        category.id,
      ),

    name:
      category.name,

    slug:
      normalizeSlug(
        category.slug,
      ),

    count,

    description:
      category.description ||
      undefined,

    image:
      imageSrc
        ? {
            sourceUrl:
              imageSrc,

            altText:
              category.image
                ?.alt ||
              category.name,

            mediaDetails:
              category.image?.width &&
              category.image?.height
                ? {
                    width:
                      category.image
                        .width,

                    height:
                      category.image
                        .height,
                  }
                : undefined,
          }
        : null,
  }
}

function mapProductSummary(
  product: WooCommerceProduct,
): ProductSummary {
  const normalizedImage =
    normalizeImage(
      product.images?.[0],
      product.name,
    )

  return {
    id:
      String(
        product.id,
      ),

    name:
      product.name,

    slug:
      normalizeSlug(
        product.slug,
      ),

    price:
      normalizeText(
        product.price,
      ),

    regularPrice:
      normalizeText(
        product.regular_price,
      ),

    salePrice:
      normalizeText(
        product.sale_price,
      ),

    onSale:
      Boolean(
        product.on_sale,
      ),

    image:
      normalizedImage,

    productCategories:
      product.categories?.length
        ? {
            nodes:
              product.categories.map(
                (
                  category,
                ) => ({
                  id:
                    String(
                      category.id,
                    ),

                  name:
                    category.name,

                  slug:
                    normalizeSlug(
                      category.slug,
                    ),
                }),
              ),
          }
        : null,
  }
}

function buildProductAcfData(
  product: WooCommerceProduct,
): AcfProductData | null {
  const productCode =
    getAcfString(
      product,
      [
        'productCode',
        'product_code',
        'productcode',
        'code',
        'product-id',
        'product_id',
      ],
    )

  const stoneType =
    getAcfString(
      product,
      [
        'stoneType',
        'stone_type',
        'stonetype',
        'stone',
      ],
    )

  const dimensionsFromAcf =
    getAcfString(
      product,
      [
        'dimensions',
        'dimension',
      ],
    )

  const weight =
    getAcfString(
      product,
      [
        'weight',
        'stone_weight',
      ],
    )

  const surfaceFinish =
    getAcfString(
      product,
      [
        'surfaceFinish',
        'surface_finish',
        'surfacefinish',
        'finish',
      ],
    )

  const colorFamily =
    getAcfString(
      product,
      [
        'colorFamily',
        'color_family',
        'colorfamily',
        'color',
        'colour_family',
      ],
    )

  const application =
    getAcfString(
      product,
      [
        'application',
        'applications',
        'usage',
      ],
    )

  const wooDimensionParts = [
    normalizePositiveDimension(
      product.dimensions?.length,
    ),
    normalizePositiveDimension(
      product.dimensions?.width,
    ),
    normalizePositiveDimension(
      product.dimensions?.height,
    ),
  ].filter(
    (
      value,
    ): value is string =>
      Boolean(value),
  )

  const dimensions =
    dimensionsFromAcf ||
    (
      wooDimensionParts.length >
      0
        ? wooDimensionParts.join(
            ' × ',
          )
        : undefined
    )

  const imageGallery =
    getAcfImages(
      product,
      [
        'imageGallery',
        'image_gallery',
        'imagegallery',
        'gallery',
        'gallery_images',
        'product_gallery',
      ],
      product.name,
    )

  const hasAnyValue =
    Boolean(
      productCode ||
      stoneType ||
      dimensions ||
      weight ||
      surfaceFinish ||
      colorFamily ||
      application ||
      imageGallery.length,
    )

  if (!hasAnyValue) {
    return null
  }

  return {
    productCode,

    stoneType,

    dimensions,

    weight,

    surfaceFinish,

    colorFamily,

    application,

    imageGallery:
      imageGallery.length >
      0
        ? imageGallery
        : null,
  }
}

function mapProduct(
  product: WooCommerceProduct,
): Product {
  const rawImages =
    product.images ?? []

  const mappedWooImages =
    rawImages
      .map(
        (
          image,
        ) =>
          normalizeImage(
            image,
            product.name,
          ),
      )
      .filter(
        (
          image,
        ): image is Image =>
          Boolean(image),
      )

  const primaryImage =
    mappedWooImages[0] ??
    null

  const acf =
    buildProductAcfData(
      product,
    )

  const acfGallery =
    acf?.imageGallery ?? []

  const galleryImages =
    uniqueImages(
      [
        ...mappedWooImages.slice(
          1,
        ),

        ...acfGallery,
      ],
    )

  const categories =
    product.categories ?? []

  const attributes =
    product.attributes ?? []

  const mappedAttributes =
    attributes
      .filter(
        (
          attribute,
        ) =>
          Boolean(
            normalizeText(
              attribute.name,
            ),
          ),
      )
      .map(
        (
          attribute,
        ) => ({
          id:
            String(
              attribute.id,
            ),

          name:
            attribute.name.trim(),

          options:
            Array.isArray(
              attribute.options,
            )
              ? attribute.options
                  .map(
                    (
                      option,
                    ) =>
                      normalizeText(
                        option,
                      ),
                  )
                  .filter(
                    (
                      option,
                    ): option is string =>
                      Boolean(
                        option,
                      ),
                  )
              : [],
        }),
      )
      .filter(
        (
          attribute,
        ) =>
          attribute.options
            .length >
          0,
      )

  return {
    id:
      String(
        product.id,
      ),

    name:
      product.name,

    slug:
      normalizeSlug(
        product.slug,
      ),

    description:
      normalizeText(
        product.description,
      ),

    shortDescription:
      normalizeText(
        product.short_description,
      ),

    sku:
      normalizeText(
        product.sku,
      ),

    price:
      normalizeText(
        product.price,
      ),

    regularPrice:
      normalizeText(
        product.regular_price,
      ),

    salePrice:
      normalizeText(
        product.sale_price,
      ),

    onSale:
      Boolean(
        product.on_sale,
      ),

    averageRating:
      product.average_rating
        ? Number(
            product.average_rating,
          )
        : undefined,

    reviewCount:
      typeof product.rating_count ===
        'number'
        ? product.rating_count
        : undefined,

    stockStatus:
      normalizeStockStatus(
        product.stock_status,
      ),

    image:
      primaryImage,

    galleryImages:
      galleryImages.length >
      0
        ? {
            nodes:
              galleryImages,
          }
        : null,

    productCategories:
      categories.length >
      0
        ? {
            nodes:
              categories.map(
                (
                  category,
                ) =>
                  mapCategory(
                    category,
                  ),
              ),
          }
        : null,

    attributes:
      mappedAttributes.length >
      0
        ? {
            nodes:
              mappedAttributes,
          }
        : null,

    acf,
  }
}

export interface WooCommerceProductQueryOptions {
  page?: number
  perPage?: number
  category?: string
  featured?: boolean
}

interface WooCommercePaginatedResult {
  products: ProductSummary[]
  total: number
  totalPages: number
  currentPage: number
}

export async function getProductsFromWooCommerce(
  options: WooCommerceProductQueryOptions = {},
): Promise<WooCommercePaginatedResult> {
  const page =
    Math.max(
      1,
      options.page ?? 1,
    )

  const perPage =
    Math.min(
      100,
      Math.max(
        1,
        options.perPage ?? 12,
      ),
    )

  const params =
    new URLSearchParams({
      status:
        'publish',

      page:
        String(page),

      per_page:
        String(perPage),

      orderby:
        'date',

      order:
        'desc',
    })

  if (
    options.category
  ) {
    params.set(
      'category',
      options.category,
    )
  }

  if (
    typeof options.featured ===
    'boolean'
  ) {
    params.set(
      'featured',
      String(
        options.featured,
      ),
    )
  }

  const {
    data,
    headers,
  } =
    await wcFetch<
      WooCommerceProductList
    >(
      PRODUCTS_ENDPOINT,
      params,
      300,
    )

  const rawProducts =
    Array.isArray(
      data,
    )
      ? data
      : []

  const totalHeader =
    headers.get(
      'X-WP-Total',
    )

  const total =
    totalHeader !== null &&
    totalHeader !== ''
      ? Number(
          totalHeader,
        )
      : rawProducts.length

  const totalPagesHeader =
    headers.get(
      'X-WP-TotalPages',
    )

  const totalPages =
    totalPagesHeader !== null &&
    totalPagesHeader !== ''
      ? Number(
          totalPagesHeader,
        )
      : (
          rawProducts.length <
          perPage
            ? page
            : page + 1
        )

  return {
    products:
      rawProducts.map(
        mapProductSummary,
      ),

    total:
      Number.isFinite(
        total,
      )
        ? total
        : rawProducts.length,

    totalPages:
      Number.isFinite(
        totalPages,
      )
        ? totalPages
        : page,

    currentPage:
      page,
  }
}

export async function getProductBySlugFromWooCommerce(
  slug: string,
): Promise<Product | null> {
  const normalizedSlug =
    normalizeSlug(
      slug,
    )

  if (
    !normalizedSlug
  ) {
    return null
  }

  const params =
    new URLSearchParams({
      status:
        'publish',

      slug:
        normalizedSlug,

      per_page:
        '1',
    })

  const {
    data,
  } =
    await wcFetch<
      WooCommerceProductList
    >(
      PRODUCTS_ENDPOINT,
      params,
      300,
    )

  const product =
    Array.isArray(
      data,
    )
      ? data[0]
      : undefined

  return product
    ? mapProduct(
        product,
      )
    : null
}

export async function searchWooCommerceProducts(
  search: string,
  first = 8,
): Promise<ProductSummary[]> {
  const normalizedSearch =
    search.trim()

  if (
    normalizedSearch.length <
    2
  ) {
    return []
  }

  const params =
    new URLSearchParams({
      status:
        'publish',

      search:
        normalizedSearch,

      per_page:
        String(
          Math.min(
            Math.max(
              first,
              1,
            ),
            20,
          ),
        ),

      orderby:
        'date',

      order:
        'desc',
    })

  const {
    data,
  } =
    await wcFetch<
      WooCommerceProductList
    >(
      PRODUCTS_ENDPOINT,
      params,
      60,
    )

  if (
    !Array.isArray(
      data,
    )
  ) {
    return []
  }

  return data.map(
    mapProductSummary,
  )
}

export async function getAllProductSlugsFromWooCommerce(): Promise<
  string[]
> {
  const slugs: string[] =
    []

  let page = 1

  while (
    true
  ) {
    const params =
      new URLSearchParams({
        status:
          'publish',

        page:
          String(page),

        per_page:
          '100',

        orderby:
          'date',

        order:
          'desc',
      })

    const {
      data,
    } =
      await wcFetch<
        WooCommerceProductList
      >(
        PRODUCTS_ENDPOINT,
        params,
        300,
      )

    if (
      !Array.isArray(
        data,
      ) ||
      data.length ===
        0
    ) {
      break
    }

    slugs.push(
      ...data
        .map(
          (
            product,
          ) =>
            normalizeSlug(
              product.slug,
            ),
        )
        .filter(Boolean),
    )

    if (
      data.length <
      100
    ) {
      break
    }

    page += 1

    if (
      page > 100
    ) {
      break
    }
  }

  return Array.from(
    new Set(
      slugs,
    ),
  )
}

export async function getProductCategoriesFromWooCommerce(): Promise<
  ProductCategoryNode[]
> {
  const params =
    new URLSearchParams({
      per_page:
        '100',

      page:
        '1',

      hide_empty:
        'true',

      orderby:
        'name',

      order:
        'asc',
    })

  const {
    data,
  } =
    await wcFetch<
      WooCommerceProductCategory[]
    >(
      PRODUCT_CATEGORIES_ENDPOINT,
      params,
      300,
    )

  if (
    !Array.isArray(
      data,
    )
  ) {
    return []
  }

  return data.map(
    (
      category,
    ) =>
      mapCategory(
        category,
      ),
  )
}

export async function getProductCategoryBySlugFromWooCommerce(
  slug: string,
): Promise<ProductCategoryNode | null> {
  const normalizedSlug =
    normalizeSlug(
      slug,
    )

  if (
    !normalizedSlug
  ) {
    return null
  }

  const params =
    new URLSearchParams({
      slug:
        normalizedSlug,

      per_page:
        '1',

      hide_empty:
        'false',
    })

  const {
    data,
  } =
    await wcFetch<
      WooCommerceProductCategory[]
    >(
      PRODUCT_CATEGORIES_ENDPOINT,
      params,
      300,
    )

  const category =
    Array.isArray(
      data,
    )
      ? data[0]
      : undefined

  return category
    ? mapCategory(
        category,
      )
    : null
}

export async function getHomeProductsFromWooCommerce(): Promise<{
  featuredProducts: {
    nodes: ProductSummary[]
  }

  recentProducts: {
    nodes: ProductSummary[]
  }

  productCategories: {
    nodes: ProductCategoryNode[]
  }
}> {
  const [
    featuredResult,
    recentResult,
    categories,
  ] = await Promise.all([
    getProductsFromWooCommerce({
      page: 1,
      perPage: 8,
      featured: true,
    }),

    getProductsFromWooCommerce({
      page: 1,
      perPage: 8,
    }),

    getProductCategoriesFromWooCommerce(),
  ])

  return {
    featuredProducts: {
      nodes:
        featuredResult.products,
    },

    recentProducts: {
      nodes:
        recentResult.products,
    },

    productCategories: {
      nodes:
        categories.slice(
          0,
          10,
        ),
    },
  }
}