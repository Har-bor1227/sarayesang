import type { Metadata } from 'next'
import Link from 'next/link'

import Container from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import ProductGrid from '@/components/product/ProductGrid'

import {
  getProducts,
} from '@/lib/repositories/product-repository'

import {
  SITE_NAME,
  SITE_URL,
} from '@/lib/constants'

export const revalidate = 3600

interface ProductsPageProps {
  searchParams?: Promise<{
    [key: string]:
      | string
      | string[]
      | undefined
  }>
}

export async function generateMetadata({
  searchParams,
}: ProductsPageProps): Promise<Metadata> {
  const resolvedSearchParams =
    await searchParams

  const hasPagination =
    typeof resolvedSearchParams?.after === 'string' &&
    resolvedSearchParams.after.length > 0

  return {
    title: `محصولات | ${SITE_NAME}`,

    description:
      'مشاهده مجموعه سنگ‌های ساختمانی سرای سنگ شامل سنگ نما، کف، پله و انواع سنگ‌های ساختمانی.',

    alternates: {
      canonical: `${SITE_URL}/products`,
    },

    robots: {
      index: !hasPagination,
      follow: true,
    },

    openGraph: {
      title: `محصولات | ${SITE_NAME}`,
      description:
        'مشاهده مجموعه سنگ‌های ساختمانی سرای سنگ.',
      type: 'website',
      url: `${SITE_URL}/products`,
    },
  }
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const resolvedSearchParams =
    await searchParams

  const after =
    typeof resolvedSearchParams?.after === 'string'
      ? resolvedSearchParams.after
      : undefined

  const productsConnection =
    await getProducts({
      first: 12,
      after,
    })

  const products =
    productsConnection.nodes ?? []

  const pageInfo =
    productsConnection.pageInfo

  const hasProducts =
    products.length > 0

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
              محصولات
            </li>
          </ol>
        </nav>

        {/* =========================================================
            PAGE INTRO
        ========================================================== */}
        <header className="mb-9 sm:mb-11 lg:mb-14">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[760px]">
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-[#B79464] sm:w-10" />

                <span className="text-[9px] font-black uppercase tracking-[0.22em] text-[#B79464] sm:text-[10px]">
                  Stone Collection
                </span>
              </div>

              <h1 className="text-[30px] font-black leading-[1.45] tracking-[-0.035em] text-[#112F50] sm:text-[38px] sm:leading-[1.4] lg:text-[46px]">
                مجموعه سنگ‌های
                <span className="text-[#B79464]">
                  {' '}
                  سرای سنگ
                </span>
              </h1>

              <p className="mt-4 max-w-[650px] text-[11px] font-medium leading-7 text-[#667085] sm:text-[13px] sm:leading-8">
                مجموعه‌ای از سنگ‌های ساختمانی با
                انتخابی متنوع برای نما، کف، پله و
                پروژه‌های معماری.
              </p>
            </div>

            {hasProducts && (
              <div className="hidden shrink-0 items-center gap-3 rounded-full border border-[#112F50]/[0.07] bg-white px-4 py-2.5 shadow-[0_6px_20px_rgba(10,25,41,0.04)] sm:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-[#B79464]" />

                <span className="text-[9px] font-bold text-[#667085]">
                  {products.length} محصول در این صفحه
                </span>
              </div>
            )}
          </div>

          <div className="mt-7 h-px w-full bg-[#112F50]/[0.07]" />
        </header>

        {/* =========================================================
            PRODUCTS
        ========================================================== */}
        {hasProducts ? (
          <ProductGrid
            products={products}
            priorityCount={1}
          />
        ) : (
          <div className="rounded-[26px] border border-dashed border-[#112F50]/[0.10] bg-white px-6 py-20 text-center shadow-[0_10px_35px_rgba(10,25,41,0.035)]">
            <div className="mx-auto max-w-[420px]">
              <span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#FBF8F2] text-[#B79464]">
                <span className="h-2 w-2 rounded-full bg-current" />
              </span>

              <h2 className="text-[17px] font-black text-[#112F50]">
                محصولی یافت نشد
              </h2>

              <p className="mt-2 text-[10px] font-medium leading-6 text-[#667085] sm:text-[11px]">
                در حال حاضر محصولی برای نمایش
                در این بخش وجود ندارد.
              </p>

              <Link
                href="/"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-[#112F50] px-5 py-2.5 text-[9px] font-black text-white shadow-[0_8px_22px_rgba(17,47,80,0.14)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0A1929]"
              >
                بازگشت به صفحه اصلی
              </Link>
            </div>
          </div>
        )}

        {/* =========================================================
            PAGINATION
        ========================================================== */}
        {pageInfo.hasNextPage &&
          pageInfo.endCursor && (
            <div className="mt-10 flex justify-center sm:mt-12">
              <Button
                asChild
                variant="outline"
                className="h-11 rounded-full border-[#112F50]/[0.10] bg-white px-6 text-[10px] font-black text-[#112F50] shadow-[0_6px_20px_rgba(10,25,41,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#B79464]/40 hover:bg-[#FBF8F2] hover:text-[#9E7F50]"
              >
                <Link
                  href={`/products?after=${encodeURIComponent(
                    pageInfo.endCursor,
                  )}`}
                >
                  مشاهده محصولات بیشتر
                </Link>
              </Button>
            </div>
          )}
      </Container>
    </main>
  )
}