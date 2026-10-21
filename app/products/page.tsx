import type { Metadata } from 'next'

import Link from 'next/link'

import {
  ArrowLeft,
  Gem,
} from 'lucide-react'

import Container from '@/components/ui/container'
import ProductCategoryRail from '@/components/product/ProductCategoryRail'
import ProductGrid from '@/components/product/ProductGrid'
import ProductFilters from '@/components/product/ProductFilters'

import {
  getProducts,
} from '@/lib/repositories/product-repository'

import {
  getProductCategories,
} from '@/lib/repositories/category-repository'

import {
  getCatalogFilters,
} from '@/lib/repositories/catalog-filter-repository'

import {
  generateBreadcrumbSchema,
  JsonLd,
} from '@/lib/seo'

import {
  DEFAULT_SOCIAL_IMAGE,
  SITE_NAME,
  SITE_URL,
} from '@/lib/constants'

import type {
  CatalogFilterSelection,
  ProductSort,
} from '@/types/catalog'

export const revalidate = 300

type ProductsSearchParams = {
  page?: string | string[]
  q?: string | string[]
  after?: string | string[]
  stoneType?: string | string[]
  color?: string | string[]
  application?: string | string[]
  surfaceFinish?: string | string[]
  sort?: string | string[]
}

interface ProductsPageProps {
  searchParams?: Promise<ProductsSearchParams>
}

/* =========================================================
   PARAM HELPERS
========================================================= */

function getSingleSearchParam(
  value: string | string[] | undefined,
): string {
  if (Array.isArray(value)) {
    return value[0] ?? ''
  }

  return value ?? ''
}

function normalizeQuery(
  value: string,
): string {
  return value
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, 80)
}

function normalizePage(
  value: string,
): number {
  const number = Number(value)

  if (!Number.isFinite(number)) {
    return 1
  }

  return Math.max(
    1,
    Math.floor(number),
  )
}

function normalizeSort(
  value: string,
): ProductSort {
  switch (value) {
    case 'price-asc':
      return 'price-asc'

    case 'price-desc':
      return 'price-desc'

    case 'name-asc':
      return 'name-asc'

    default:
      return 'newest'
  }
}

function normalizeFilter(
  value: string,
): string | undefined {
  const normalized =
    value.trim()

  return normalized || undefined
}

/* =========================================================
   FILTER HELPERS
========================================================= */

function getFilterSelection(
  params:
    | ProductsSearchParams
    | undefined,
): CatalogFilterSelection {
  return {
    stoneType: normalizeFilter(
      getSingleSearchParam(
        params?.stoneType,
      ),
    ),

    color: normalizeFilter(
      getSingleSearchParam(
        params?.color,
      ),
    ),

    application: normalizeFilter(
      getSingleSearchParam(
        params?.application,
      ),
    ),

    surfaceFinish: normalizeFilter(
      getSingleSearchParam(
        params?.surfaceFinish,
      ),
    ),
  }
}

function hasActiveFilters(
  selection: CatalogFilterSelection,
): boolean {
  return Boolean(
    selection.stoneType ||
      selection.color ||
      selection.application ||
      selection.surfaceFinish,
  )
}

/* =========================================================
   URL BUILDERS
========================================================= */

function getProductsUrl(
  page: number,
  query: string,
  selection: CatalogFilterSelection,
  sort: ProductSort,
): string {
  const params =
    new URLSearchParams()

  if (query) {
    params.set(
      'q',
      query,
    )
  }

  if (selection.stoneType) {
    params.set(
      'stoneType',
      selection.stoneType,
    )
  }

  if (selection.color) {
    params.set(
      'color',
      selection.color,
    )
  }

  if (selection.application) {
    params.set(
      'application',
      selection.application,
    )
  }

  if (selection.surfaceFinish) {
    params.set(
      'surfaceFinish',
      selection.surfaceFinish,
    )
  }

  if (sort !== 'newest') {
    params.set(
      'sort',
      sort,
    )
  }

  if (page > 1) {
    params.set(
      'page',
      String(page),
    )
  }

  const value =
    params.toString()

  return value
    ? `/products?${value}`
    : '/products'
}

function getCanonicalUrl(
  page: number,
  query: string,
  selection: CatalogFilterSelection,
  sort: ProductSort,
): string {
  const base =
    `${SITE_URL.replace(
      /\/+$/,
      '',
    )}/products`

  const filtered =
    Boolean(
      query ||
        hasActiveFilters(
          selection,
        ) ||
        sort !== 'newest',
    )

  if (filtered) {
    return base
  }

  if (page > 1) {
    return `${base}?page=${page}`
  }

  return base
}

/* =========================================================
   METADATA
========================================================= */

export async function generateMetadata({
  searchParams,
}: ProductsPageProps): Promise<Metadata> {
  const params =
    await searchParams

  const query =
    normalizeQuery(
      getSingleSearchParam(
        params?.q,
      ),
    )

  const rawPage =
    getSingleSearchParam(
      params?.page,
    )

  const legacyAfter =
    getSingleSearchParam(
      params?.after,
    )

  const page = rawPage
    ? normalizePage(rawPage)
    : legacyAfter
      ? normalizePage(
          legacyAfter,
        )
      : 1

  const selection =
    getFilterSelection(
      params,
    )

  const sort =
    normalizeSort(
      getSingleSearchParam(
        params?.sort,
      ),
    )

  const hasQuery =
    query.length > 0

  const hasFilters =
    hasActiveFilters(
      selection,
    ) ||
    sort !== 'newest'

  const canonicalUrl =
    getCanonicalUrl(
      page,
      query,
      selection,
      sort,
    )

  const shouldIndex =
    !hasQuery &&
    !hasFilters

  const title =
    hasQuery
      ? `جستجوی ${query}`
      : 'همه سنگ‌ها'

  const description =
    hasQuery
      ? `نتایج جستجوی ${query} در مجموعه سنگ‌های سرای سنگ.`
      : 'مجموعه کامل سنگ‌های ساختمانی سرای سنگ شامل تراورتن، مرمریت، گرانیت، مرمر، چینی، بازالت و سایر سنگ‌ها.'

  return {
    title,

    description,

    alternates: {
      canonical:
        canonicalUrl,
    },

    robots: {
      index:
        shouldIndex,
      follow: true,
    },

    openGraph: {
      title,

      description,

      type: 'website',

      url:
        canonicalUrl,

      siteName:
        SITE_NAME,

      locale:
        'fa_IR',

      images: [
        {
          url:
            DEFAULT_SOCIAL_IMAGE,

          width:
            1920,

          height:
            758,

          alt:
            SITE_NAME,
        },
      ],
    },

    twitter: {
      card:
        'summary_large_image',

      title,

      description,

      images: [
        DEFAULT_SOCIAL_IMAGE,
      ],
    },
  }
}

/* =========================================================
   PAGE
========================================================= */

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params =
    await searchParams

  const query =
    normalizeQuery(
      getSingleSearchParam(
        params?.q,
      ),
    )

  const rawPage =
    getSingleSearchParam(
      params?.page,
    )

  const legacyAfter =
    getSingleSearchParam(
      params?.after,
    )

  const page = rawPage
    ? normalizePage(
        rawPage,
      )
    : legacyAfter
      ? normalizePage(
          legacyAfter,
        )
      : 1

  const selection =
    getFilterSelection(
      params,
    )

  const sort =
    normalizeSort(
      getSingleSearchParam(
        params?.sort,
      ),
    )

  const [
    productsConnection,
    categories,
    filterGroups,
  ] = await Promise.all([
    getProducts({
      first: 12,
      page,
      search:
        query || undefined,
      filters:
        selection,
      sort,
    }),

    getProductCategories(),

    getCatalogFilters(),
  ])

  const products =
    productsConnection.nodes ??
    []

  const pageInfo =
    productsConnection.pageInfo

  const hasProducts =
    products.length > 0

  const rootCategories =
    categories.filter(
      (category) =>
        !category.parentId ||
        category.parentId === '0',
    )

  const breadcrumbSchema =
    generateBreadcrumbSchema([
      {
        name: 'خانه',
        path: '/',
      },
      {
        name: 'همه سنگ‌ها',
        path: '/products',
      },
    ])

  return (
    <div
      dir="rtl"
      className="
        min-h-screen
        w-full
        overflow-x-clip
        bg-[#F3F1EC]
      "
    >
      {/* =====================================================
          PAGE BACKDROP
      ====================================================== */}

      <div
        className="
          pointer-events-none
          fixed
          inset-0
          -z-10
          overflow-hidden
        "
        aria-hidden="true"
      >
        <div
          className="
            absolute
            -right-32
            -top-32
            h-[420px]
            w-[420px]
            rounded-full
            bg-[#B79464]/[0.055]
            blur-[100px]
          "
        />

        <div
          className="
            absolute
            -left-40
            top-[35%]
            h-[480px]
            w-[480px]
            rounded-full
            bg-[#112F50]/[0.035]
            blur-[120px]
          "
        />

        <div
          className="
            absolute
            bottom-[-180px]
            right-[25%]
            h-[420px]
            w-[420px]
            rounded-full
            bg-[#B79464]/[0.035]
            blur-[110px]
          "
        />
      </div>

      <Container
        className="
          pb-20
          pt-4
          sm:pb-24
          sm:pt-6
          lg:pb-28
          lg:pt-7
        "
      >
        <JsonLd
          data={breadcrumbSchema}
        />

        {/* =====================================================
            BREADCRUMB
        ====================================================== */}

        <nav
          className="
            mb-3
            px-1
            pt-6
            sm:mb-4
            sm:pt-5
            lg:mb-5
            lg:pt-2
          "
          aria-label="مسیر راهنما"
        >
          <ol
            className="
              flex
              min-w-0
              items-center
              gap-2.5
              overflow-hidden
              text-[9px]
              sm:text-[10px]
            "
          >
            <li className="shrink-0">
              <Link
                href="/"
                className="
                  inline-flex
                  min-h-7
                  items-center
                  rounded-full
                  px-2.5
                  font-bold
                  text-[#667085]
                  transition-all
                  duration-300
                  hover:bg-white/60
                  hover:text-[#76582F]
                "
              >
                خانه
              </Link>
            </li>

            <li
              className="
                shrink-0
                text-[#B79464]/50
              "
              aria-hidden="true"
            >
              /
            </li>

            <li
              aria-current="page"
              className="
                flex
                min-w-0
                shrink-0
                items-center
                gap-2
                rounded-full
                bg-white/55
                px-3
                py-1.5
                font-black
                text-[#112F50]
                shadow-[0_4px_14px_rgba(17,47,80,0.035)]
              "
            >
              <Gem
                className="
                  h-3
                  w-3
                  shrink-0
                  text-[#B79464]
                "
                aria-hidden="true"
              />

              <span>
                همه سنگ‌ها
              </span>
            </li>
          </ol>
        </nav>

        {/* =====================================================
            MAIN CATALOG ARCHITECTURE

            MOBILE:
            Filters
              ↓
            Categories
              ↓
            Products

            DESKTOP:
            ┌────────────────────────────┬─────────────┐
            │ Category + Products        │ Filters     │
            └────────────────────────────┴─────────────┘
        ====================================================== */}
        <div
          className="
            mt-3
            grid
            gap-4
            lg:mt-5
            lg:grid-cols-[288px_minmax(0,1fr)]
            lg:items-start
            lg:gap-6
          "
        >
          {/* ===================================================
              PRODUCT AREA
          ==================================================== */}

          <main
            id="product-catalog"
            className="
              order-2
              min-w-0
              lg:order-2
            "
          >
            {/* Category rail */}

            <ProductCategoryRail
              categories={
                rootCategories
              }
            />

            {/* =================================================
                PRODUCT GRID
            ================================================== */}

            <div className="mt-3 sm:mt-4">
              {hasProducts ? (
                <ProductGrid
                  products={products}
                  priorityCount={2}
                />
              ) : (
                <section
                  className="
                    relative
                    overflow-hidden
                    rounded-[30px]
                    border
                    border-dashed
                    border-[#112F50]/[0.12]
                    bg-white/[0.88]
                    px-6
                    py-20
                    text-center
                    shadow-[0_16px_42px_rgba(10,25,41,0.045),inset_0_1px_0_rgba(255,255,255,0.95)]
                    backdrop-blur-xl
                  "
                >
                  <div
                    className="
                      pointer-events-none
                      absolute
                      -right-20
                      -top-20
                      h-44
                      w-44
                      rounded-full
                      bg-[#B79464]/[0.07]
                      blur-3xl
                    "
                    aria-hidden="true"
                  />

                  <div
                    className="
                      pointer-events-none
                      absolute
                      -bottom-16
                      -left-16
                      h-36
                      w-36
                      rounded-full
                      bg-[#112F50]/[0.035]
                      blur-3xl
                    "
                    aria-hidden="true"
                  />

                  <div className="relative mx-auto max-w-[450px]">
                    <div
                      className="
                        mx-auto
                        mb-6
                        flex
                        h-16
                        w-16
                        items-center
                        justify-center
                        rounded-[20px]
                        border
                        border-[#B79464]/15
                        bg-[linear-gradient(145deg,#fffdf9,#f0e9de)]
                        text-[#B79464]
                        shadow-[0_10px_24px_rgba(183,148,100,0.11)]
                      "
                    >
                      <span
                        className="
                          h-2.5
                          w-2.5
                          rounded-full
                          bg-current
                          shadow-[0_0_16px_rgba(183,148,100,0.48)]
                        "
                        aria-hidden="true"
                      />
                    </div>

                    <span
                      className="
                        text-[8px]
                        font-black
                        uppercase
                        tracking-[0.20em]
                        text-[#B79464]
                      "
                    >
                      No results
                    </span>

                    <h2
                      className="
                        mt-2
                        text-[21px]
                        font-black
                        tracking-[-0.025em]
                        text-[#112F50]
                      "
                    >
                      محصولی پیدا نشد
                    </h2>

                    <p
                      className="
                        mt-3
                        text-[11px]
                        font-medium
                        leading-8
                        text-[#667085]
                        sm:text-[12px]
                      "
                    >
                      نتیجه‌ای با ترکیب جستجو و فیلترهای فعلی پیدا نشد.
                      فیلترها را کمی بازتر کنید یا همه سنگ‌ها را ببینید.
                    </p>

                    <Link
                      href="/products"
                      className="
                        group
                        mt-7
                        inline-flex
                        min-h-12
                        items-center
                        justify-center
                        gap-2
                        rounded-full
                        bg-[linear-gradient(135deg,#112F50,#193F63)]
                        px-6
                        text-[10px]
                        font-black
                        text-white
                        shadow-[0_12px_26px_rgba(17,47,80,0.16)]
                        transition-all
                        duration-300
                        hover:-translate-y-0.5
                        hover:shadow-[0_16px_30px_rgba(17,47,80,0.20)]
                      "
                    >
                      <span>
                        مشاهده همه سنگ‌ها
                      </span>

                      <ArrowLeft
                        className="
                          h-3.5
                          w-3.5
                          transition-transform
                          duration-300
                          group-hover:-translate-x-1
                        "
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                </section>
              )}
            </div>

            {/* =================================================
                PAGINATION
            ================================================== */}

            {pageInfo.hasNextPage &&
              pageInfo.endCursor && (
                <nav
                  className="
                    mt-11
                    flex
                    justify-center
                    sm:mt-13
                  "
                  aria-label="صفحات محصولات"
                >
                  <Link
                    href={getProductsUrl(
                      Number(
                        pageInfo.endCursor,
                      ),
                      query,
                      selection,
                      sort,
                    )}
                    className="
                      group
                      relative
                      inline-flex
                      min-h-12
                      items-center
                      justify-center
                      gap-2
                      overflow-hidden
                      rounded-full
                      border
                      border-[#112F50]/[0.09]
                      bg-white/82
                      px-6
                      text-[10px]
                      font-black
                      text-[#112F50]
                      shadow-[0_9px_24px_rgba(10,25,41,0.04),inset_0_1px_0_rgba(255,255,255,0.95)]
                      backdrop-blur-xl
                      transition-all
                      duration-300
                      hover:-translate-y-0.5
                      hover:border-[#B79464]/35
                      hover:bg-[#FBF8F2]
                      hover:shadow-[0_13px_30px_rgba(10,25,41,0.075)]
                    "
                  >
                    <span
                      className="
                        pointer-events-none
                        absolute
                        -left-6
                        -top-8
                        h-16
                        w-16
                        rounded-full
                        bg-[#B79464]/[0.08]
                        blur-xl
                        transition-transform
                        duration-500
                        group-hover:scale-125
                      "
                      aria-hidden="true"
                    />

                    <span className="relative">
                      مشاهده محصولات بیشتر
                    </span>

                    <ArrowLeft
                      className="
                        relative
                        h-3.5
                        w-3.5
                        transition-transform
                        duration-300
                        group-hover:-translate-x-1
                      "
                      aria-hidden="true"
                    />
                  </Link>
                </nav>
              )}
          </main>

          {/* ===================================================
              FILTER CONSOLE

              MOBILE:
              appears BEFORE main because of order.

              DESKTOP:
              becomes the right/side column.
          ==================================================== */}

          <aside
            className="
              order-1
              min-w-0
              lg:sticky
              lg:top-24
              lg:order-1
            "
            aria-label="فیلترها و مرتب‌سازی"
          >
            <ProductFilters
              groups={filterGroups}
              selection={selection}
              sort={sort}
            />
          </aside>
        </div>

        {/* =====================================================
            FOOTER CATALOG SIGNATURE
        ====================================================== */}

        <div
          className="
            mt-14
            flex
            items-center
            gap-4
            sm:mt-16
          "
        >
          <span
            className="
              h-px
              flex-1
              bg-gradient-to-r
              from-transparent
              to-[#112F50]/[0.08]
            "
          />
          <span
            className="
              h-px
              flex-1
              bg-gradient-to-l
              from-transparent
              to-[#112F50]/[0.08]
            "
          />
        </div>
      </Container>
    </div>
  )
}