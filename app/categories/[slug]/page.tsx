import type { Metadata } from 'next'

import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import {
  ArrowLeft,
} from 'lucide-react'

import Container from '@/components/ui/container'

import { Button } from '@/components/ui/button'

import ProductGrid from '@/components/product/ProductGrid'

import {
  getProducts,
} from '@/lib/repositories/product-repository'

import {
  getProductCategoryBySlug,
} from '@/lib/repositories/category-repository'

import {
  getProductCategorySeo,
} from '@/lib/repositories/seo-repository'

import {
  rankMathToMetadata,
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

export const revalidate = 3600

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
  searchParams?: Promise<{
    [key: string]:
      | string
      | string[]
      | undefined
  }>
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

function getFallbackCategoryMetadata(
  category: {
    name: string
    slug: string
    description?: string
    image?: {
      sourceUrl: string
      altText?: string
    } | null
  },
  frontendCategoryUrl: string,
  hasPagination: boolean,
): Metadata {
  const description =
    category.description ||
    `محصولات ${category.name}`

  const image =
    category.image?.sourceUrl

  return {
    title:
      `${category.name} | دسته‌بندی محصولات`,

    description,

    alternates: {
      canonical:
        frontendCategoryUrl,
    },

    robots: hasPagination
      ? {
          index: false,
          follow: true,
        }
      : {
          index: true,
          follow: true,
        },

    openGraph: {
      type: 'website',

      title:
        `${category.name} | دسته‌بندی محصولات`,

      description,

      url:
        frontendCategoryUrl,

      siteName:
        SITE_NAME,

      locale:
        'fa_IR',

      images: image
        ? [
            {
              url: image,
              alt:
                category.image
                  ?.altText ||
                category.name,
            },
          ]
        : undefined,
    },

    twitter: {
      card:
        'summary_large_image',

      title:
        `${category.name} | دسته‌بندی محصولات`,

      description,

      images: image
        ? [image]
        : undefined,
    },
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } =
    await params

  const resolvedSearchParams =
    await searchParams

  const hasPagination =
    typeof resolvedSearchParams?.after ===
      'string' &&
    resolvedSearchParams.after.length > 0

  const category =
    await getProductCategoryBySlug(
      slug,
    )

  if (!category) {
    return {
      title:
        `دسته‌بندی یافت نشد | ${SITE_NAME}`,

      description:
        'دسته‌بندی مورد نظر پیدا نشد.',

      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const frontendCategoryUrl =
    getFrontendCategoryUrl(
      category.slug,
    )

  const rankMath =
    await getProductCategorySeo(
      category.slug,
    )

  if (rankMath) {
    const metadata =
      rankMathToMetadata(
        rankMath,
        frontendCategoryUrl,
      )

    if (hasPagination) {
      metadata.robots = {
        index: false,
        follow: true,
      }
    }

    return metadata
  }

  return getFallbackCategoryMetadata(
    category,
    frontendCategoryUrl,
    hasPagination,
  )
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } =
    await params

  const resolvedSearchParams =
    await searchParams

  const after =
    typeof resolvedSearchParams?.after ===
      'string'
      ? resolvedSearchParams.after
      : undefined

  const category =
    await getProductCategoryBySlug(
      slug,
    )

  if (!category) {
    notFound()
  }

  const productsConnection =
    await getProducts({
      first: 12,
      after,
      category: category.id,
    })

  const products =
    productsConnection.nodes ?? []

  const pageInfo =
    productsConnection.pageInfo

  const collectionSchema =
    generateCollectionPageSchema(
      category,
      products,
    )

  const breadcrumbItems = [
    {
      name: 'خانه',
      path: '/',
    },
    {
      name: 'دسته‌بندی‌ها',
      path: '/categories',
    },
    {
      name: category.name,
      path:
        `/categories/${category.slug}`,
    },
  ]

  const breadcrumbSchema =
    generateBreadcrumbSchema(
      breadcrumbItems,
    )

  const categoryImage =
    category.image?.sourceUrl

  return (
    <main
      className="w-full bg-[#FCFCFB]"
      dir="rtl"
    >
      <Container className="pb-16 pt-5 sm:pb-20 sm:pt-7 lg:pb-24">
        {/* =========================================================
            SEO / STRUCTURED DATA
        ========================================================== */}
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

        {/* =========================================================
            BREADCRUMB
        ========================================================== */}
        <nav
          className="mb-8 pt-16 sm:pt-12 md:pt-5"
          aria-label="مسیر راهنما"
        >
          <ol className="flex min-w-0 items-center gap-2 overflow-hidden text-[10px] sm:text-[11px]">
            <li className="shrink-0">
              <Link
                href="/"
                className="font-semibold text-[#667085] transition-colors duration-200 hover:text-[#B79464]"
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
                className="font-semibold text-[#667085] transition-colors duration-200 hover:text-[#B79464]"
              >
                دسته‌بندی‌ها
              </Link>
            </li>

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

        {/* =========================================================
            CATEGORY HERO
        ========================================================== */}
        <section className="relative mb-10 min-h-[310px] overflow-hidden rounded-[28px] bg-[#0A1929] sm:min-h-[370px] lg:mb-14 lg:min-h-[430px]">
          {categoryImage ? (
            <Image
              src={categoryImage}
              alt={
                category.image?.altText ||
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

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,25,41,0.12)_0%,rgba(10,25,41,0.20)_38%,rgba(10,25,41,0.92)_100%)]" />

          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 sm:p-7 lg:p-9">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.2em] text-white backdrop-blur-md sm:text-[9px]">
              Stone Collection
            </span>

            <span className="text-[8px] font-semibold tracking-[0.2em] text-white/40 sm:text-[9px]">
              SARAYE SANG
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-7 lg:p-10">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-[#B79464] sm:w-11" />

              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#D4B27D] sm:text-[9px]">
                Collection
              </span>
            </div>

            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-[760px]">
                <h1 className="text-[29px] font-black leading-[1.45] tracking-[-0.035em] text-white sm:text-[38px] sm:leading-[1.4] lg:text-[48px] lg:leading-[1.35]">
                  {category.name}
                </h1>

                {category.description && (
                  <p className="mt-3 max-w-[700px] text-[10px] font-medium leading-7 text-white/65 sm:text-[12px] sm:leading-8">
                    {category.description}
                  </p>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#B79464]" />

                <span className="text-[9px] font-bold text-white/70 sm:text-[10px]">
                  {products.length} محصول
                  در این صفحه
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            PRODUCTS HEADER
        ========================================================== */}
        <div className="mb-7 flex items-end justify-between gap-4 sm:mb-9">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <span className="h-px w-7 bg-[#B79464] sm:w-9" />

              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#B79464] sm:text-[9px]">
                Selected Stones
              </span>
            </div>

            <h2 className="text-[20px] font-black text-[#112F50] sm:text-[24px]">
              محصولات این دسته
            </h2>
          </div>

          {products.length > 0 && (
            <span className="hidden text-[9px] font-medium text-[#667085] sm:block">
              انتخاب‌شده برای پروژه‌های معماری
            </span>
          )}
        </div>

        {/* =========================================================
            PRODUCTS
        ========================================================== */}
        <ProductGrid
          products={products}
          priorityCount={1}
        />

        {/* =========================================================
            PAGINATION
        ========================================================== */}
        {pageInfo.hasNextPage &&
          pageInfo.endCursor && (
            <div className="mt-10 flex justify-center sm:mt-12">
              <Button
                asChild
                variant="outline"
                className="group h-11 rounded-full border-[#112F50]/[0.10] bg-white px-6 text-[10px] font-black text-[#112F50] shadow-[0_6px_20px_rgba(10,25,41,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#B79464]/40 hover:bg-[#FBF8F2] hover:text-[#9E7F50]"
              >
                <Link
                  href={
                    `/categories/${category.slug}?after=${encodeURIComponent(
                      pageInfo.endCursor,
                    )}`
                  }
                >
                  <span>
                    مشاهده محصولات بیشتر
                  </span>

                  <ArrowLeft className="mr-2 h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
                </Link>
              </Button>
            </div>
          )}

        {/* =========================================================
            EMPTY STATE
        ========================================================== */}
        {products.length === 0 && (
          <div className="mt-2 rounded-[26px] border border-dashed border-[#112F50]/[0.10] bg-white px-6 py-20 text-center shadow-[0_10px_35px_rgba(10,25,41,0.035)]">
            <div className="mx-auto max-w-[420px]">
              <span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#FBF8F2] text-[#B79464]">
                <span className="h-2 w-2 rounded-full bg-current" />
              </span>

              <h2 className="text-[17px] font-black text-[#112F50]">
                محصولی در این دسته‌بندی یافت نشد
              </h2>

              <p className="mt-2 text-[10px] font-medium leading-6 text-[#667085] sm:text-[11px]">
                در حال حاضر محصولی برای نمایش
                در این مجموعه وجود ندارد.
              </p>

              <Link
                href="/products"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-[#112F50] px-5 py-2.5 text-[9px] font-black text-white shadow-[0_8px_22px_rgba(17,47,80,0.14)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0A1929]"
              >
                مشاهده همه محصولات
              </Link>
            </div>
          </div>
        )}

        {/* =========================================================
            BOTTOM BRAND LINE
        ========================================================== */}
        {products.length > 0 && (
          <div className="mt-10 flex items-center gap-4 sm:mt-12">
            <span className="h-px flex-1 bg-[#112F50]/[0.08]" />

            <span className="text-[8px] font-black tracking-[0.24em] text-[#667085]/50 sm:text-[9px]">
              SARAYE SANG / {category.name}
            </span>

            <span className="h-px flex-1 bg-[#112F50]/[0.08]" />
          </div>
        )}
      </Container>
    </main>
  )
}