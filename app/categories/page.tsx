import type { Metadata } from 'next'

import Image from 'next/image'
import Link from 'next/link'

import Container from '@/components/ui/container'

import {
  getProductCategories,
} from '@/lib/repositories/category-repository'

import {
  SITE_NAME,
  SITE_URL,
} from '@/lib/constants'

export const revalidate = 3600

export const metadata: Metadata = {
  title:
    `دسته‌بندی محصولات | ${SITE_NAME}`,

  description:
    'دسته‌بندی‌های سنگ‌های ساختمانی سرای سنگ را مشاهده کنید و سنگ مناسب پروژه خود را پیدا کنید.',

  alternates: {
    canonical:
      `${SITE_URL}/categories`,
  },

  openGraph: {
    title:
      `دسته‌بندی محصولات | ${SITE_NAME}`,

    description:
      'دسته‌بندی‌های سنگ‌های ساختمانی سرای سنگ.',

    type: 'website',

    url:
      `${SITE_URL}/categories`,
  },
}

export default async function CategoriesPage() {
  const categories =
    await getProductCategories()

  return (
    <main
      className="w-full bg-[#FCFCFB]"
      dir="rtl"
    >
      <Container className="pb-16 pt-5 sm:pb-20 sm:pt-7 lg:pb-24">
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

            <li className="shrink-0 font-black text-[#112F50]">
              دسته‌بندی‌ها
            </li>
          </ol>
        </nav>

        {/* =========================================================
            PAGE INTRO
        ========================================================== */}
        <header className="mb-9 sm:mb-12 lg:mb-14">
          <div className="max-w-[780px]">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-[#B79464] sm:w-10" />

              <span className="text-[9px] font-black uppercase tracking-[0.22em] text-[#B79464] sm:text-[10px]">
                Stone Categories
              </span>
            </div>

            <h1 className="text-[30px] font-black leading-[1.45] tracking-[-0.035em] text-[#112F50] sm:text-[38px] sm:leading-[1.4] lg:text-[46px]">
              انتخاب خود را از میان
              <span className="text-[#B79464]">
                {' '}
                مجموعه سنگ‌ها
              </span>
              پیدا کنید
            </h1>

            <p className="mt-4 max-w-[680px] text-[11px] font-medium leading-7 text-[#667085] sm:text-[13px] sm:leading-8">
              دسته‌بندی‌های مختلف سنگ‌های ساختمانی
              را بر اساس نوع، ویژگی و کاربرد بررسی
              کنید و متریال مناسب پروژه خود را
              پیدا کنید.
            </p>
          </div>

          <div className="mt-7 h-px w-full bg-[#112F50]/[0.07]" />
        </header>

        {/* =========================================================
            CATEGORY GALLERY
        ========================================================== */}
        {categories.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-12 lg:gap-5">
            {categories.map(
              (category, index) => {
                const image =
                  category.image?.sourceUrl

                const imageAlt =
                  category.image?.altText ||
                  category.name

                const isFeatured =
                  index === 0

                return (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className={[
                      'group relative overflow-hidden rounded-[24px] bg-[#0A1929]',
                      isFeatured
                        ? 'min-h-[300px] sm:min-h-[360px] lg:col-span-7 lg:row-span-2 lg:min-h-[530px]'
                        : 'min-h-[220px] sm:min-h-[250px] lg:col-span-5 lg:min-h-[255px]',
                    ].join(' ')}
                  >
                    {/* IMAGE */}
                    {image ? (
                      <Image
                        src={image}
                        alt={imageAlt}
                        fill
                        sizes={
                          isFeatured
                            ? '(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 58vw'
                            : '(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 42vw'
                        }
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(135deg,#112F50,#0A1929)]">
                        <span className="text-[13px] font-black text-white/45">
                          سنگ
                        </span>
                      </div>
                    )}

                    {/* OVERLAY */}
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,25,41,0.03)_15%,rgba(10,25,41,0.10)_40%,rgba(10,25,41,0.88)_100%)] transition-opacity duration-500 group-hover:opacity-95" />

                    {/* TOP LABEL */}
                    <div className="absolute right-4 top-4 z-10 sm:right-5 sm:top-5">
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#0A1929]/25 px-3 py-1.5 text-[7px] font-black uppercase tracking-[0.18em] text-white backdrop-blur-md sm:text-[8px]">
                        {isFeatured
                          ? 'Featured Collection'
                          : `Collection 0${index + 1}`}
                      </span>
                    </div>

                    {/* ARROW */}
                    <span className="absolute left-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition-all duration-300 group-hover:border-[#B79464]/60 group-hover:bg-[#B79464] sm:left-5 sm:top-5">
                      <span className="text-[17px] leading-none transition-transform duration-300 group-hover:-translate-x-0.5">
                        ←
                      </span>
                    </span>

                    {/* CONTENT */}
                    <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6 lg:p-7">
                      <div className="mb-3 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#B79464]" />

                        <span className="text-[8px] font-bold text-white/60 sm:text-[9px]">
                          {typeof category.count ===
                          'number'
                            ? `${category.count} محصول`
                            : 'مجموعه سرای سنگ'}
                        </span>
                      </div>

                      <h2
                        className={[
                          'max-w-[90%] font-black leading-[1.5] tracking-[-0.02em] text-white',
                          isFeatured
                            ? 'text-[24px] sm:text-[30px] lg:text-[38px]'
                            : 'text-[20px] sm:text-[24px] lg:text-[27px]',
                        ].join(' ')}
                      >
                        {category.name}
                      </h2>

                      <div className="mt-3 h-px w-10 bg-[#B79464] transition-all duration-500 group-hover:w-16" />
                    </div>
                  </Link>
                )
              },
            )}
          </div>
        ) : (
          /* =======================================================
             EMPTY STATE
          ======================================================== */
          <div className="rounded-[26px] border border-dashed border-[#112F50]/[0.10] bg-white px-6 py-20 text-center shadow-[0_10px_35px_rgba(10,25,41,0.035)]">
            <div className="mx-auto max-w-[420px]">
              <span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#FBF8F2] text-[#B79464]">
                <span className="h-2 w-2 rounded-full bg-current" />
              </span>

              <h2 className="text-[17px] font-black text-[#112F50]">
                دسته‌بندی‌ای یافت نشد
              </h2>

              <p className="mt-2 text-[10px] font-medium leading-6 text-[#667085] sm:text-[11px]">
                در حال حاضر دسته‌بندی‌ای برای
                نمایش وجود ندارد.
              </p>

              <Link
                href="/products"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-[#112F50] px-5 py-2.5 text-[9px] font-black text-white shadow-[0_8px_22px_rgba(17,47,80,0.14)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0A1929]"
              >
                مشاهده محصولات
              </Link>
            </div>
          </div>
        )}

        {/* =========================================================
            FOOTER NOTE
        ========================================================== */}
        {categories.length > 0 && (
          <div className="mt-8 flex items-center gap-4 sm:mt-10">
            <span className="h-px flex-1 bg-[#112F50]/[0.08]" />

            <span className="text-[8px] font-black tracking-[0.24em] text-[#667085]/50 sm:text-[9px]">
              SARAYE SANG / COLLECTIONS
            </span>

            <span className="h-px flex-1 bg-[#112F50]/[0.08]" />
          </div>
        )}
      </Container>
    </main>
  )
}