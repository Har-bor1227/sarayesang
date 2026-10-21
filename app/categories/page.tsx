import type { Metadata } from 'next'

import Image from 'next/image'
import Link from 'next/link'

import {
  ArrowLeft,
  Layers3,
  Sparkles,
} from 'lucide-react'

import Container from '@/components/ui/container'

import {
  getChildProductCategories,
  getRootProductCategories,
} from '@/lib/repositories/category-repository'

import {
  generateBreadcrumbSchema,
  JsonLd,
} from '@/lib/seo'

import {
  DEFAULT_SOCIAL_IMAGE,
  SITE_NAME,
  SITE_URL,
} from '@/lib/constants'

export const revalidate = 300

export const metadata: Metadata = {
  title:
    'دسته‌بندی سنگ‌های ساختمانی',

  description:
    'دسته‌بندی انواع سنگ‌های ساختمانی سرای سنگ را مشاهده کنید؛ از تراورتن و مرمریت تا گرانیت، مرمر، چینی، بازالت و سایر سنگ‌ها.',

  alternates: {
    canonical:
      `${SITE_URL.replace(
        /\/+$/,
        '',
      )}/categories`,
  },

  openGraph: {
    title:
      `${SITE_NAME} | دسته‌بندی سنگ‌های ساختمانی`,

    description:
      'انواع سنگ‌های ساختمانی سرای سنگ را بر اساس دسته‌بندی بررسی کنید.',

    type:
      'website',

    url:
      `${SITE_URL.replace(
        /\/+$/,
        '',
      )}/categories`,

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

    title:
      `${SITE_NAME} | دسته‌بندی سنگ‌های ساختمانی`,

    description:
      'انواع سنگ‌های ساختمانی سرای سنگ را بر اساس دسته‌بندی بررسی کنید.',

    images: [
      DEFAULT_SOCIAL_IMAGE,
    ],
  },
}

export default async function CategoriesPage() {
  const [
    rootCategories,
  ] = await Promise.all([
    getRootProductCategories(),
  ])

  const rootWithChildren =
    await Promise.all(
      rootCategories.map(
        async (
          root,
        ) => ({
          root,

          children:
            await getChildProductCategories(
              root.id,
            ),
        }),
      ),
    )

  const breadcrumbSchema =
    generateBreadcrumbSchema([
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
    ])

  return (
    <div
      className="w-full bg-[#FCFCFB]"
      dir="rtl"
    >
      <Container className="pb-16 pt-5 sm:pb-20 sm:pt-7 lg:pb-24">
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

            <li
              aria-current="page"
              className="shrink-0 font-black text-[#112F50]"
            >
              دسته‌بندی‌ها
            </li>
          </ol>
        </nav>

        {/* =====================================================
            HERO
        ====================================================== */}
        <header className="mb-10 lg:mb-14">
          <div className="max-w-[820px]">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-9 bg-[#B79464] sm:w-11" />

              <span className="text-[9px] font-black uppercase tracking-[0.22em] text-[#B79464] sm:text-[10px]">
                Stone Architecture
              </span>
            </div>

            <h1 className="text-[32px] font-black leading-[1.4] tracking-[-0.04em] text-[#112F50] sm:text-[42px] lg:text-[54px]">
              دسته‌بندی
              <span className="mr-2 text-[#B79464]">
                {' '}
                سنگ‌های ساختمانی
              </span>
            </h1>

            <p className="mt-5 max-w-[730px] text-[12px] font-medium leading-8 text-[#667085] sm:text-[13px] sm:leading-9">
              برای پیدا کردن سنگ مناسب پروژه، ابتدا نوع
              سنگ موردنظر خود را انتخاب کنید و سپس
              مجموعه محصولات همان دسته را بررسی کنید.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#112F50] px-5 text-[10px] font-black text-white shadow-[0_9px_25px_rgba(17,47,80,0.12)] transition-all hover:-translate-y-0.5 hover:bg-[#0A1929]"
            >
              مشاهده همه سنگ‌ها

              <ArrowLeft
                className="h-3.5 w-3.5"
                aria-hidden="true"
              />
            </Link>

            <Link
              href="/smart-search"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#112F50]/[0.09] bg-white px-5 text-[10px] font-black text-[#112F50] transition-all hover:border-[#B79464]/40 hover:bg-[#FBF8F2]"
            >
              پیدا کردن سنگ مناسب

              <Sparkles
                className="h-3.5 w-3.5 text-[#B79464]"
                aria-hidden="true"
              />
            </Link>
          </div>

          <div className="mt-8 h-px w-full bg-[#112F50]/[0.07]" />
        </header>

        {/* =====================================================
            CATEGORY GROUPS
        ====================================================== */}
        <div className="space-y-14">
          {rootWithChildren.map(
            ({
              root,
              children,
            }) => (
              <section
                key={root.id}
                aria-labelledby={`category-root-${root.id}`}
              >
                {/* ROOT CATEGORY */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <Layers3
                        className="h-4 w-4 text-[#B79464]"
                        aria-hidden="true"
                      />

                      <span className="text-[8px] font-black uppercase tracking-[0.18em] text-[#B79464] sm:text-[9px]">
                        Main Category
                      </span>
                    </div>

                    <h2
                      id={`category-root-${root.id}`}
                      className="text-[25px] font-black tracking-[-0.025em] text-[#112F50] sm:text-[31px]"
                    >
                      {root.name}
                    </h2>

                    {root.description && (
                      <p className="mt-3 max-w-[680px] text-[11px] font-medium leading-7 text-[#667085] sm:text-[12px]">
                        {root.description}
                      </p>
                    )}
                  </div>

                  <Link
                    href={`/categories/${root.slug}`}
                    className="group inline-flex min-h-10 items-center gap-2 self-start rounded-full border border-[#112F50]/[0.08] bg-white px-4 text-[9px] font-black text-[#112F50] transition-all hover:border-[#B79464]/40 hover:bg-[#FBF8F2] sm:self-auto"
                  >
                    مشاهده این دسته

                    <ArrowLeft
                      className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                </div>

                {/* CHILD CATEGORIES */}
                {children.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {children.map(
                      (
                        category,
                        index,
                      ) => {
                        const image =
                          category.image?.sourceUrl

                        const imageAlt =
                          category.image?.altText ||
                          category.name

                        return (
                          <Link
                            key={
                              category.id
                            }
                            href={`/categories/${category.slug}`}
                            className="group relative min-h-[230px] overflow-hidden rounded-[24px] bg-[#0A1929] shadow-[0_10px_35px_rgba(10,25,41,0.06)]"
                          >
                            {image ? (
                              <Image
                                src={
                                  image
                                }
                                alt={
                                  imageAlt
                                }
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                              />
                            ) : (
                              <div className="absolute inset-0 bg-[linear-gradient(135deg,#112F50,#0A1929)]" />
                            )}

                            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,25,41,0.03)_10%,rgba(10,25,41,0.16)_38%,rgba(10,25,41,0.90)_100%)]" />

                            <div className="absolute right-4 top-4">
                              <span className="inline-flex rounded-full border border-white/15 bg-[#0A1929]/25 px-2.5 py-1.5 text-[7px] font-black uppercase tracking-[0.16em] text-white backdrop-blur-md">
                                Stone 0
                                {index +
                                  1}
                              </span>
                            </div>

                            <span
                              aria-hidden="true"
                              className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition-all duration-300 group-hover:border-[#B79464]/60 group-hover:bg-[#B79464]"
                            >
                              <ArrowLeft className="h-3.5 w-3.5" />
                            </span>

                            <div className="absolute inset-x-0 bottom-0 p-5">
                              <div className="mb-3 flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#B79464]" />

                                <span className="text-[8px] font-bold text-white/65">
                                  {typeof category.count ===
                                  'number'
                                    ? `${category.count.toLocaleString('fa-IR')} محصول`
                                    : 'مجموعه سنگ'}
                                </span>
                              </div>

                              <h3 className="text-[21px] font-black leading-[1.45] text-white sm:text-[23px]">
                                {
                                  category.name
                                }
                              </h3>

                              <div className="mt-3 h-px w-10 bg-[#B79464] transition-all duration-500 group-hover:w-16" />
                            </div>
                          </Link>
                        )
                      },
                    )}
                  </div>
                ) : (
                  <div className="rounded-[24px] border border-dashed border-[#112F50]/[0.10] bg-white px-6 py-14 text-center">
                    <p className="text-[11px] font-bold text-[#667085]">
                      هنوز زیر‌دسته‌ای برای این بخش ثبت نشده است.
                    </p>
                  </div>
                )}
              </section>
            ),
          )}
        </div>

        {/* =====================================================
            BOTTOM CTA
        ====================================================== */}
        <section className="mt-16 rounded-[28px] bg-[#112F50] px-6 py-10 text-center shadow-[0_18px_55px_rgba(10,25,41,0.12)] sm:px-10">
          <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#B79464]/15 text-[#D6B67D]">
            <Sparkles
              className="h-4 w-4"
              aria-hidden="true"
            />
          </span>

          <h2 className="mt-4 text-[23px] font-black leading-[1.5] text-white sm:text-[29px]">
            هنوز نمی‌دانید کدام سنگ مناسب پروژه شماست؟
          </h2>

          <p className="mx-auto mt-3 max-w-[620px] text-[11px] font-medium leading-7 text-white/60 sm:text-[12px]">
            از ابزارهای انتخاب و جستجوی سرای سنگ برای
            پیدا کردن گزینه مناسب استفاده کنید.
          </p>

          <Link
            href="/smart-search"
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-6 text-[10px] font-black text-[#112F50] transition hover:-translate-y-0.5"
          >
            شروع انتخاب سنگ

            <ArrowLeft
              className="h-3.5 w-3.5"
              aria-hidden="true"
            />
          </Link>
        </section>
      </Container>
    </div>
  )
}