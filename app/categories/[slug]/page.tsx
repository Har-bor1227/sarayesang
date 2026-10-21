import type { Metadata } from 'next'

import { DEFAULT_SOCIAL_IMAGE } from '@/lib/constants'

import Image from 'next/image'
import Link from 'next/link'

import { notFound } from 'next/navigation'

import {
  ArrowLeft,
  ChevronLeft,
  Layers3,
} from 'lucide-react'

import Container from '@/components/ui/container'

import ProductGrid from '@/components/product/ProductGrid'

import {
  getProducts,
} from '@/lib/repositories/product-repository'

import {
  getProductCategoryContext,
} from '@/lib/repositories/category-repository'

import {
  getProductCategorySeo,
} from '@/lib/repositories/seo-repository'

import {
  rankMathToMetadata,
  stripHtmlText,
} from '@/lib/rank-math'

import {
  generateCollectionPageSchema,
  generateBreadcrumbSchema,
  JsonLd,
} from '@/lib/seo'

import {
  SITE_URL,
  SITE_NAME,
} from '@/lib/constants'

export const revalidate = 300

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>

  searchParams?: Promise<{
    page?:
      | string
      | string[]
      | undefined

    after?:
      | string
      | string[]
      | undefined
  }>
}

function getSingleSearchParam(
  value:
    | string
    | string[]
    | undefined,
): string {
  if (
    Array.isArray(
      value,
    )
  ) {
    return value[0] ?? ''
  }

  return value ?? ''
}

function normalizePage(
  value: string,
): number {
  const parsed =
    Number(
      value,
    )

  if (
    !Number.isFinite(
      parsed,
    )
  ) {
    return 1
  }

  return Math.max(
    1,
    Math.floor(
      parsed,
    ),
  )
}

function getFrontendCategoryUrl(
  slug: string,
): string {
  return `${SITE_URL.replace(
    /\/+$/,
    '',
  )}/categories/${encodeURIComponent(
    slug,
  )}`
}

function getCategoryCanonicalUrl(
  slug: string,
  page: number,
): string {
  const baseUrl =
    getFrontendCategoryUrl(
      slug,
    )

  if (
    page <= 1
  ) {
    return baseUrl
  }

  return `${baseUrl}?page=${page}`
}

export async function generateMetadata({
  params,
  searchParams,
}: CategoryPageProps): Promise<Metadata> {
  const {
    slug,
  } = await params

  const resolvedSearchParams =
    await searchParams

  const rawPage =
    getSingleSearchParam(
      resolvedSearchParams?.page,
    )

  const legacyAfter =
    getSingleSearchParam(
      resolvedSearchParams?.after,
    )

  const page =
    rawPage
      ? normalizePage(
          rawPage,
        )
      : legacyAfter
        ? normalizePage(
            legacyAfter,
          )
        : 1

  const context =
    await getProductCategoryContext(
      slug,
    )

  if (!context) {
    return {
      title:
        'دسته‌بندی پیدا نشد',

      robots: {
        index:
          false,

        follow:
          false,
      },
    }
  }

  const {
    category,
  } =
    context

  const categoryDescription =
    stripHtmlText(
      category.description,
    )

  const canonicalUrl =
    getCategoryCanonicalUrl(
      category.slug,
      page,
    )

  const rankMath =
    await getProductCategorySeo(
      category.slug,
    )

  const fallbackTitle =
    category.name

  const fallbackDescription =
    categoryDescription ||
    `مشاهده محصولات و اطلاعات مربوط به ${category.name} در مجموعه سنگ‌های ساختمانی ${SITE_NAME}.`

  if (rankMath) {
    const metadata =
      rankMathToMetadata(
        rankMath,
        canonicalUrl,
        'website',
      )

    return {
      ...metadata,

      title:
        metadata.title ||
        fallbackTitle,

      description:
        categoryDescription ||
        stripHtmlText(
          metadata.description,
        ) ||
        fallbackDescription,

      alternates: {
        canonical:
          canonicalUrl,
      },

      openGraph: {
        ...metadata.openGraph,

        type:
          'website',

        url:
          canonicalUrl,
      },

      robots: {
        index:
          true,

        follow:
          true,
      },
    }
  }

  return {
    title:
      fallbackTitle,

    description:
      fallbackDescription,

    alternates: {
      canonical:
        canonicalUrl,
    },

    robots: {
      index:
        true,

      follow:
        true,
    },

    openGraph: {
      type:
        'website',

      title:
        `${SITE_NAME} | ${fallbackTitle}`,

      description:
        fallbackDescription,

      url:
        canonicalUrl,

      siteName:
        SITE_NAME,

      locale:
        'fa_IR',

      images:
        category.image?.sourceUrl
          ? [
              {
                url:
                  category.image.sourceUrl,

                alt:
                  category.image.altText ||
                  category.name,
              },
            ]
          : [
              {
                url:
                  DEFAULT_SOCIAL_IMAGE,

                alt:
                  SITE_NAME,
              },
            ],
    },

    twitter: {
      card:
        'summary_large_image',

      title:
        `${SITE_NAME} | ${fallbackTitle}`,

      description:
        fallbackDescription,

      images:
        category.image?.sourceUrl
          ? [
              category.image.sourceUrl,
            ]
          : [
              DEFAULT_SOCIAL_IMAGE,
            ],
    },
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const {
    slug,
  } = await params

  const resolvedSearchParams =
    await searchParams

  const rawPage =
    getSingleSearchParam(
      resolvedSearchParams?.page,
    )

  const legacyAfter =
    getSingleSearchParam(
      resolvedSearchParams?.after,
    )

  const page =
    rawPage
      ? normalizePage(
          rawPage,
        )
      : legacyAfter
        ? normalizePage(
            legacyAfter,
          )
        : 1

  const context =
    await getProductCategoryContext(
      slug,
    )

  if (!context) {
    notFound()
  }

  const {
    category,
    parent,
    children,
    siblings,
  } =
    context

  const productsConnection =
    await getProducts({
      first:
        12,

      page,

      category:
        category.id,
    })

  const products =
    productsConnection.nodes ??
    []

  const pageInfo =
    productsConnection.pageInfo

  const total =
    pageInfo.total ??
    products.length

  const collectionSchema =
    generateCollectionPageSchema(
      category,
      products,
      total,
    )

  const breadcrumbItems = [
    {
      name:
        'خانه',
      path:
        '/',
    },
    {
      name:
        'دسته‌بندی‌ها',
      path:
        '/categories',
    },
  ]

  if (parent) {
    breadcrumbItems.push({
      name:
        parent.name,
      path:
        `/categories/${parent.slug}`,
    })
  }

  breadcrumbItems.push({
    name:
      category.name,
    path:
      `/categories/${category.slug}`,
  })

  const breadcrumbSchema =
    generateBreadcrumbSchema(
      breadcrumbItems,
    )

  const categoryImage =
    category.image?.sourceUrl

  const categoryDescription =
    stripHtmlText(
      category.description,
    )

  return (
    <div
      className="w-full bg-[#FCFCFB]"
      dir="rtl"
    >
      <Container className="pb-16 pt-5 sm:pb-20 sm:pt-7 lg:pb-24">
        <JsonLd
          data={
            collectionSchema
          }
        />

        <JsonLd
          data={
            breadcrumbSchema
          }
        />

        {/* =====================================================
            BREADCRUMB
        ====================================================== */}
        <nav
          className="mb-8 pt-16 sm:pt-12 md:pt-5"
          aria-label="مسیر راهنما"
        >
          <ol className="flex min-w-0 items-center gap-2 overflow-hidden text-[10px] sm:text-[11px]">
            <li className="shrink-0">
              <Link
                href="/"
                className="font-semibold text-[#667085] transition-colors hover:text-[#B79464]"
              >
                خانه
              </Link>
            </li>

            <li
              className="shrink-0 text-[#B79464]/60"
              aria-hidden="true"
            >
              /
            </li>

            <li className="shrink-0">
              <Link
                href="/categories"
                className="font-semibold text-[#667085] transition-colors hover:text-[#B79464]"
              >
                دسته‌بندی‌ها
              </Link>
            </li>

            {parent && (
              <>
                <li
                  className="shrink-0 text-[#B79464]/60"
                  aria-hidden="true"
                >
                  /
                </li>

                <li className="min-w-0 max-w-[180px] truncate">
                  <Link
                    href={`/categories/${parent.slug}`}
                    className="font-semibold text-[#667085] transition-colors hover:text-[#B79464]"
                  >
                    {parent.name}
                  </Link>
                </li>
              </>
            )}

            <li
              className="shrink-0 text-[#B79464]/60"
              aria-hidden="true"
            >
              /
            </li>

            <li className="min-w-0 truncate font-black text-[#112F50]">
              {category.name}
            </li>
          </ol>
        </nav>

        {/* =====================================================
            HERO
        ====================================================== */}
        <section className="relative mb-9 min-h-[330px] overflow-hidden rounded-[28px] bg-[#0A1929] sm:min-h-[390px] lg:mb-12 lg:min-h-[450px]">
          {categoryImage ? (
            <Image
              src={
                categoryImage
              }
              alt={
                category.image
                  ?.altText ||
                category.name
              }
              fill
              priority
              sizes="(max-width: 1023px) 100vw, 1200px"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#112F50,#0A1929)]" />
          )}

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,25,41,0.08)_0%,rgba(10,25,41,0.22)_38%,rgba(10,25,41,0.94)_100%)]" />

          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 sm:p-7 lg:p-9">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.2em] text-white backdrop-blur-md sm:text-[9px]">
              {parent
                ? 'Stone Collection'
                : 'Main Collection'}
            </span>

            <span className="text-[8px] font-semibold tracking-[0.2em] text-white/40 sm:text-[9px]">
              SARAYE SANG
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-7 lg:p-10">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-[#B79464] sm:w-11" />

              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#D4B27D] sm:text-[9px]">
                {parent
                  ? parent.name
                  : 'Stone Architecture'}
              </span>
            </div>

            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-[780px]">
                <h1 className="text-[31px] font-black leading-[1.42] tracking-[-0.04em] text-white sm:text-[42px] lg:text-[52px]">
                  {category.name}
                </h1>

                {categoryDescription && (
                  <p className="mt-4 max-w-[720px] text-[11px] font-medium leading-8 text-white/65 sm:text-[12px] sm:leading-9">
                    {
                      categoryDescription
                    }
                  </p>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#B79464]" />

                <span className="text-[9px] font-bold text-white/70 sm:text-[10px]">
                  {total.toLocaleString(
                    'fa-IR',
                  )}{' '}
                  محصول
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            CHILD CATEGORIES
        ====================================================== */}
        {children.length > 0 && (
          <section
            aria-labelledby="subcategory-title"
            className="mb-12"
          >
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Layers3
                    className="h-4 w-4 text-[#B79464]"
                    aria-hidden="true"
                  />

                  <span className="text-[8px] font-black uppercase tracking-[0.18em] text-[#B79464] sm:text-[9px]">
                    Subcategories
                  </span>
                </div>

                <h2
                  id="subcategory-title"
                  className="text-[22px] font-black text-[#112F50] sm:text-[27px]"
                >
                  زیر‌دسته‌های {category.name}
                </h2>
              </div>

              <span className="hidden text-[9px] font-bold text-[#667085] sm:block">
                {children.length.toLocaleString(
                  'fa-IR',
                )}{' '}
                دسته
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {children.map(
                (
                  child,
                ) => (
                  <Link
                    key={
                      child.id
                    }
                    href={`/categories/${child.slug}`}
                    className="group flex min-h-[88px] items-center justify-between gap-4 rounded-[20px] border border-[#112F50]/[0.07] bg-white px-5 py-4 shadow-[0_7px_24px_rgba(10,25,41,0.035)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#B79464]/30 hover:bg-[#FBF8F2]"
                  >
                    <div className="min-w-0">
                      <span className="mb-1 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#B79464]" />

                        <span className="truncate text-[10px] font-black text-[#112F50] sm:text-[11px]">
                          {
                            child.name
                          }
                        </span>
                      </span>

                      <span className="mr-3 text-[8px] font-semibold text-[#667085]">
                        {typeof child.count ===
                        'number'
                          ? `${child.count.toLocaleString('fa-IR')} محصول`
                          : 'مشاهده مجموعه'}
                      </span>
                    </div>

                    <ChevronLeft
                      className="h-4 w-4 shrink-0 text-[#B79464] transition-transform duration-300 group-hover:-translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                ),
              )}
            </div>
          </section>
        )}

        {/* =====================================================
            PRODUCTS
        ====================================================== */}
        <section
          aria-labelledby="category-products-title"
        >
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <span className="h-px w-7 bg-[#B79464] sm:w-9" />

                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#B79464] sm:text-[9px]">
                  Product Collection
                </span>
              </div>

              <h2
                id="category-products-title"
                className="text-[23px] font-black text-[#112F50] sm:text-[28px]"
              >
                محصولات {category.name}
              </h2>

              <p className="mt-2 text-[10px] font-medium text-[#667085] sm:text-[11px]">
                {total.toLocaleString(
                  'fa-IR',
                )}{' '}
                محصول در این مجموعه
              </p>
            </div>

            <Link
              href={`/products`}
              className="inline-flex min-h-10 items-center gap-2 self-start rounded-full border border-[#112F50]/[0.08] bg-white px-4 text-[9px] font-black text-[#112F50] transition hover:border-[#B79464]/40 hover:bg-[#FBF8F2] sm:self-auto"
            >
              مشاهده همه سنگ‌ها

              <ArrowLeft
                className="h-3.5 w-3.5"
                aria-hidden="true"
              />
            </Link>
          </div>

          {products.length > 0 ? (
            <ProductGrid
              products={
                products
              }
              priorityCount={
                2
              }
            />
          ) : (
            <div className="rounded-[24px] border border-dashed border-[#112F50]/[0.10] bg-white px-6 py-16 text-center">
              <h3 className="text-[17px] font-black text-[#112F50]">
                محصولی در این مجموعه پیدا نشد
              </h3>

              <p className="mt-2 text-[10px] font-medium leading-6 text-[#667085]">
                در حال حاضر محصولی برای نمایش در این
                دسته‌بندی ثبت نشده است.
              </p>

              <Link
                href="/products"
                className="mt-6 inline-flex min-h-10 items-center justify-center rounded-full bg-[#112F50] px-5 text-[9px] font-black text-white"
              >
                مشاهده همه محصولات
              </Link>
            </div>
          )}
        </section>

        {/* =====================================================
            PAGINATION
        ====================================================== */}
        {pageInfo.hasNextPage &&
          pageInfo.endCursor && (
            <nav
              className="mt-10 flex justify-center sm:mt-12"
              aria-label="صفحات محصولات"
            >
              <Link
                href={`/categories/${category.slug}?page=${encodeURIComponent(
                  pageInfo.endCursor,
                )}`}
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#112F50]/[0.10] bg-white px-6 text-[10px] font-black text-[#112F50] shadow-[0_7px_22px_rgba(10,25,41,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#B79464]/40 hover:bg-[#FBF8F2]"
              >
                <span>
                  مشاهده محصولات بیشتر
                </span>

                <ArrowLeft
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </nav>
          )}

        {/* =====================================================
            SIBLINGS
        ====================================================== */}
        {siblings.length > 0 && (
          <section
            aria-labelledby="related-categories-title"
            className="mt-14"
          >
            <div className="mb-5">
              <span className="text-[8px] font-black uppercase tracking-[0.18em] text-[#B79464]">
                Related Collections
              </span>

              <h2
                id="related-categories-title"
                className="mt-2 text-[20px] font-black text-[#112F50] sm:text-[24px]"
              >
                دسته‌های مرتبط
              </h2>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {siblings.map(
                (
                  sibling,
                ) => (
                  <Link
                    key={
                      sibling.id
                    }
                    href={`/categories/${sibling.slug}`}
                    className="shrink-0 rounded-full border border-[#112F50]/[0.08] bg-white px-4 py-2.5 text-[9px] font-black text-[#112F50] transition hover:border-[#B79464]/40 hover:bg-[#FBF8F2]"
                  >
                    {sibling.name}
                  </Link>
                ),
              )}
            </div>
          </section>
        )}
      </Container>
    </div>
  )
}