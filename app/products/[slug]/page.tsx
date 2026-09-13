import type { Metadata } from 'next'

import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import Container from '@/components/ui/container'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { getProductPageData } from '@/lib/repositories/product-page-repository'
import { rankMathToMetadata } from '@/lib/rank-math'
import { formatPrice } from '@/lib/format'

import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Phone,
} from 'lucide-react'

import {
  generateBreadcrumbSchema,
  generateProductSchema,
  JsonLd,
} from '@/lib/seo'

import {
  SITE_NAME,
  SITE_URL,
  TEL_PHONE,
} from '@/lib/constants'

export const revalidate = 3600

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

type ProductData = NonNullable<
  Awaited<
    ReturnType<typeof getProductPageData>
  >['product']
>

function getFrontendProductUrl(slug: string): string {
  return `${SITE_URL.replace(/\/+$/, '')}/products/${encodeURIComponent(slug)}`
}

function getFallbackMetadata(
  product: ProductData,
): Metadata {
  const frontendProductUrl =
    getFrontendProductUrl(product.slug)

  const description =
    product.shortDescription ||
    product.description ||
    ''

  const image =
    product.image?.sourceUrl

  return {
    title: product.name,

    description,

    alternates: {
      canonical: frontendProductUrl,
    },

    openGraph: {
      type: 'website',
      title: product.name,
      description,
      url: frontendProductUrl,
      siteName: SITE_NAME,
      locale: 'fa_IR',

      images: image
        ? [
            {
              url: image,
              alt:
                product.image?.altText ||
                product.name,
            },
          ]
        : undefined,
    },

    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description,
      images: image
        ? [image]
        : undefined,
    },
  }
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params

  const { product, seo } =
    await getProductPageData(slug)

  if (!product) {
    return {
      title: `محصول یافت نشد | ${SITE_NAME}`,

      description:
        'محصول مورد نظر پیدا نشد.',

      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const frontendProductUrl =
    getFrontendProductUrl(product.slug)

  if (seo) {
    return rankMathToMetadata(
      seo,
      frontendProductUrl,
    )
  }

  return getFallbackMetadata(product)
}

function stripHtml(
  value?: string | null,
) {
  if (!value) return ''

  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#39;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

function ProductImage({
  src,
  alt,
  priority = false,
}: {
  src: string
  alt: string
  priority?: boolean
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes="(max-width: 1024px) 100vw, 58vw"
      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
    />
  )
}

function ProductSpec({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="group/spec rounded-[20px] border border-[#112F50]/[0.07] bg-[#FCFCFB] p-4 transition-all duration-300 hover:border-[#B79464]/35 hover:bg-[#FBF8F2]">
      <span className="block text-[9px] font-bold text-[#667085]">
        {label}
      </span>

      <p className="mt-1.5 text-[12px] font-black leading-6 text-[#112F50] sm:text-[13px]">
        {value}
      </p>
    </div>
  )
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params

  const { product } =
    await getProductPageData(slug)

  if (!product) {
    notFound()
  }

  const productSchema =
    generateProductSchema(product)

  const breadcrumbSchema =
    generateBreadcrumbSchema([
      {
        name: 'خانه',
        path: '/',
      },
      {
        name: 'محصولات',
        path: '/products',
      },
      {
        name: product.name,
        path: `/products/${product.slug}`,
      },
    ])

  const mainImage =
    product.image?.sourceUrl ||
    '/images/home/product-placeholder.webp'

  const galleryImages =
    product.galleryImages?.nodes ?? []

  const categories =
    product.productCategories?.nodes ?? []

  const attributes =
    product.attributes?.nodes ?? []

  const hasSpecs =
    Boolean(product.acf?.dimensions) ||
    Boolean(product.acf?.weight) ||
    Boolean(product.acf?.stoneType) ||
    Boolean(product.acf?.surfaceFinish) ||
    Boolean(product.acf?.colorFamily) ||
    Boolean(product.acf?.application)

  const hasPrice =
    Boolean(product.price)

  const shortDescription =
    stripHtml(
      product.shortDescription,
    )

  return (
    <div
      className="w-full bg-[#FCFCFB]"
      dir="rtl"
    >
      <Container className="pb-16 pt-5 sm:pb-20 sm:pt-7 lg:pb-24">
        {/* =========================================================
            SEO / STRUCTURED DATA
        ========================================================== */}
        <JsonLd data={productSchema} />
        <JsonLd data={breadcrumbSchema} />

        {/* =========================================================
            BREADCRUMB
        ========================================================== */}
        <nav
          className="mb-7 pt-16 sm:mb-9 sm:pt-12 md:pt-5"
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
                href="/products"
                className="font-semibold text-[#667085] transition-colors duration-200 hover:text-[#B79464]"
              >
                محصولات
              </Link>
            </li>

            <li
              className="shrink-0 text-[#B79464]/60"
              aria-hidden="true"
            >
              /
            </li>

            <li className="min-w-0 truncate font-black text-[#112F50]">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* =========================================================
            MAIN PRODUCT EXPERIENCE
        ========================================================== */}
        <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start lg:gap-14 xl:gap-18">
          {/* =======================================================
              GALLERY
          ======================================================== */}
          <div className="min-w-0">
            <div className="relative overflow-hidden rounded-[30px] bg-[#ECEDEE]">
              <div className="group relative aspect-[0.98] overflow-hidden rounded-[30px]">
                <ProductImage
                  src={mainImage}
                  alt={
                    product.image?.altText ||
                    product.name
                  }
                  priority
                />

                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,25,41,0.03)_0%,transparent_48%,rgba(10,25,41,0.16)_100%)]" />

                {/* COLLECTION LABEL */}
                <div className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#0A1929]/35 px-3 py-2 text-[8px] font-black uppercase tracking-[0.18em] text-white backdrop-blur-md sm:text-[9px]">
                    Saraye Sang
                  </span>
                </div>

                {/* SALE BADGE */}
                {product.onSale && (
                  <div className="absolute left-4 top-4 z-10 sm:left-6 sm:top-6">
                    <Badge className="rounded-full border-0 bg-[#B79464] px-3 py-1.5 text-[9px] font-black text-white shadow-[0_8px_24px_rgba(183,148,100,0.25)] sm:text-[10px]">
                      ویژه
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* =====================================================
                GALLERY STRIP
            ====================================================== */}
            {galleryImages.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="تصاویر قبلی"
                    className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#112F50]/[0.08] bg-white text-[#112F50] shadow-sm sm:flex"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>

                  <div className="grid min-w-0 flex-1 grid-cols-4 gap-2 sm:grid-cols-5 sm:gap-3">
                    {galleryImages.map(
                      (img, index) => (
                        <div
                          key={`${img.sourceUrl}-${index}`}
                          className="group/thumb relative aspect-square overflow-hidden rounded-[16px] border border-[#112F50]/[0.07] bg-[#F1F0ED] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#B79464]/40"
                        >
                          <Image
                            src={
                              img.sourceUrl
                            }
                            alt={
                              img.altText ||
                              `${product.name} - تصویر ${
                                index + 1
                              }`
                            }
                            fill
                            sizes="(max-width: 640px) 23vw, 120px"
                            className="object-cover transition-transform duration-500 group-hover/thumb:scale-[1.05]"
                          />
                        </div>
                      ),
                    )}
                  </div>

                  <button
                    type="button"
                    aria-label="تصاویر بعدی"
                    className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#112F50]/[0.08] bg-white text-[#112F50] shadow-sm sm:flex"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* =======================================================
              PRODUCT INFO
          ======================================================== */}
          <div className="min-w-0 lg:pt-1">
            <div className="relative">
              {/* GOLD LINE */}
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px w-9 bg-[#B79464] sm:w-11" />

                <span className="text-[8px] font-black uppercase tracking-[0.24em] text-[#B79464] sm:text-[9px]">
                  Natural Stone Collection
                </span>
              </div>

              {/* CATEGORIES */}
              {categories.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {categories.map(
                    (category) => (
                      <Link
                        key={category.id}
                        href={`/categories/${category.slug}`}
                      >
                        <Badge
                          variant="outline"
                          className="rounded-full border-[#B79464]/25 bg-[#FBF8F2] px-3 py-1 text-[9px] font-bold text-[#9E7F50] transition-all duration-200 hover:border-[#B79464] hover:bg-[#B79464] hover:text-white sm:text-[10px]"
                        >
                          {category.name}
                        </Badge>
                      </Link>
                    ),
                  )}
                </div>
              )}

              {/* TITLE */}
              <h1 className="max-w-[760px] text-[29px] font-black leading-[1.48] tracking-[-0.035em] text-[#112F50] sm:text-[38px] sm:leading-[1.4] lg:text-[44px] lg:leading-[1.38]">
                {product.name}
              </h1>

              {/* SHORT DESCRIPTION */}
              {shortDescription && (
                <p className="mt-5 max-w-[720px] text-[12px] font-medium leading-7 text-[#667085] sm:text-[14px] sm:leading-8">
                  {shortDescription}
                </p>
              )}

              {/* PRICE / INQUIRY PANEL */}
              {hasPrice ? (
                <div className="mt-7 rounded-[24px] border border-[#B79464]/15 bg-[#FBF8F2] p-5 sm:p-6">
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <span className="block text-[9px] font-bold text-[#667085]">
                        قیمت محصول
                      </span>

                      <div className="mt-1 flex flex-wrap items-end gap-3">
                        <span className="text-[25px] font-black tracking-[-0.025em] text-[#112F50] sm:text-[30px]">
                          {formatPrice(
                            product.price,
                          )}
                        </span>

                        {product.onSale &&
                          product.regularPrice && (
                            <span className="pb-1 text-[12px] font-semibold text-[#667085]/55 line-through sm:text-[13px]">
                              {formatPrice(
                                product.regularPrice,
                              )}
                            </span>
                          )}
                      </div>
                    </div>

                    <span className="rounded-full bg-[#112F50] px-3 py-1.5 text-[8px] font-black text-white sm:text-[9px]">
                      استعلام نهایی
                    </span>
                  </div>

                  <div className="mt-4 flex items-start gap-2 border-t border-[#112F50]/[0.07] pt-4">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#B79464]" />

                    <p className="text-[9px] font-medium leading-6 text-[#667085] sm:text-[10px]">
                      برای اطلاع از قیمت نهایی،
                      موجودی و شرایط سفارش با
                      کارشناسان سرای سنگ تماس
                      بگیرید.
                    </p>
                  </div>
                </div>
              ) : null}

              {/* =====================================================
                  SPECS
              ====================================================== */}
              {hasSpecs && (
                <section className="mt-8">
                  <div className="mb-4 flex items-end justify-between gap-4">
                    <div>
                      <span className="mb-1.5 block text-[8px] font-black uppercase tracking-[0.18em] text-[#B79464] sm:text-[9px]">
                        Specifications
                      </span>

                      <h2 className="text-[17px] font-black text-[#112F50] sm:text-[18px]">
                        مشخصات محصول
                      </h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                    {product.acf?.dimensions && (
                      <ProductSpec
                        label="ابعاد"
                        value={
                          product.acf
                            .dimensions
                        }
                      />
                    )}

                    {product.acf?.weight && (
                      <ProductSpec
                        label="وزن"
                        value={
                          product.acf.weight
                        }
                      />
                    )}

                    {product.acf?.stoneType && (
                      <ProductSpec
                        label="نوع سنگ"
                        value={
                          product.acf
                            .stoneType
                        }
                      />
                    )}

                    {product.acf
                      ?.surfaceFinish && (
                      <ProductSpec
                        label="پرداخت سطح"
                        value={
                          product.acf
                            .surfaceFinish
                        }
                      />
                    )}

                    {product.acf
                      ?.colorFamily && (
                      <ProductSpec
                        label="خانواده رنگ"
                        value={
                          product.acf
                            .colorFamily
                        }
                      />
                    )}

                    {product.acf
                      ?.application && (
                      <ProductSpec
                        label="کاربرد"
                        value={
                          product.acf
                            .application
                        }
                      />
                    )}
                  </div>
                </section>
              )}

              {/* =====================================================
                  TECHNICAL ATTRIBUTES
              ====================================================== */}
              {attributes.length > 0 && (
                <section className="mt-6 overflow-hidden rounded-[22px] border border-[#112F50]/[0.07] bg-white">
                  <div className="border-b border-[#112F50]/[0.07] bg-[#F7F6F3] px-5 py-4">
                    <span className="mb-1 block text-[8px] font-black uppercase tracking-[0.18em] text-[#B79464]">
                      Technical Data
                    </span>

                    <h2 className="text-[14px] font-black text-[#112F50]">
                      مشخصات فنی
                    </h2>
                  </div>

                  <div className="divide-y divide-[#112F50]/[0.06] px-5">
                    {attributes.map(
                      (attr) => (
                        <div
                          key={attr.id}
                          className="flex items-start justify-between gap-5 py-4"
                        >
                          <span className="shrink-0 text-[10px] font-medium text-[#667085] sm:text-[11px]">
                            {attr.name}
                          </span>

                          <span className="text-left text-[10px] font-black leading-6 text-[#112F50] sm:text-[11px]">
                            {attr.options.join(
                              '، ',
                            )}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </section>
              )}

              {/* =====================================================
                  CTA
              ====================================================== */}
              <div className="mt-8">
                <Button
                  asChild
                  size="lg"
                  variant="accent"
                  className="h-14 w-full rounded-[18px] border-0 text-[14px] font-black text-white shadow-[0_14px_34px_rgba(183,148,100,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(183,148,100,0.24)]"
                >
                  <a
                    href={`tel:${TEL_PHONE}`}
                    className="flex items-center justify-center gap-2.5"
                  >
                    <Phone className="h-5 w-5" />

                    <span>
                      تماس برای استعلام قیمت
                    </span>
                  </a>
                </Button>

                <p className="mt-3 text-center text-[9px] font-medium leading-6 text-[#667085] sm:text-[10px]">
                  برای دریافت اطلاعات موجودی،
                  قیمت و شرایط سفارش با ما در
                  تماس باشید.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            PRODUCT DESCRIPTION
        ========================================================== */}
        {product.description && (
          <section className="mt-14 border-t border-[#112F50]/[0.07] pt-12 sm:mt-18 sm:pt-14 lg:mt-20 lg:pt-16">
            <div className="grid gap-7 lg:grid-cols-[0.3fr_0.7fr] lg:gap-16">
              <div>
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-[#B79464] sm:w-10" />

                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#B79464] sm:text-[9px]">
                    Product Story
                  </span>
                </div>

                <h2 className="mt-4 text-[25px] font-black leading-[1.5] tracking-[-0.03em] text-[#112F50] sm:text-[30px] lg:text-[34px]">
                  توضیحات محصول
                </h2>

                <p className="mt-3 max-w-[320px] text-[10px] font-medium leading-6 text-[#667085] sm:text-[11px] sm:leading-7">
                  جزئیات و ویژگی‌های این
                  محصول را با دقت بررسی کنید
                  تا انتخابی هماهنگ با پروژه
                  خود داشته باشید.
                </p>
              </div>

              <div className="overflow-hidden rounded-[24px] border border-[#112F50]/[0.07] bg-white px-5 py-6 shadow-[0_12px_35px_rgba(10,25,41,0.04)] sm:px-7 sm:py-8 lg:px-10 lg:py-10">
                <div
                  className="wordpress-content"
                  dangerouslySetInnerHTML={{
                    __html:
                      product.description,
                  }}
                />
              </div>
            </div>
          </section>
        )}
      </Container>
    </div>
  )
}