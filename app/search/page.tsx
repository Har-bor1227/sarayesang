import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  Search,
  Sparkles,
} from 'lucide-react'

import Container from '@/components/ui/container'

import {
  searchProducts,
} from '@/lib/repositories/product-repository'

import { formatPrice } from '@/lib/format'

import {
  SITE_NAME,
  SITE_URL,
} from '@/lib/constants'

export const revalidate = 60

export const metadata: Metadata = {
  title: `جستجو | ${SITE_NAME}`,

  description:
    'جستجوی سنگ‌های ساختمانی و محصولات سرای سنگ.',

  alternates: {
    canonical: `${SITE_URL}/search`,
  },

  robots: {
    index: false,
    follow: true,
  },
}

interface SearchPageProps {
  searchParams?: Promise<{
    q?: string
    [key: string]:
      | string
      | string[]
      | undefined
  }>
}

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const resolvedSearchParams =
    await searchParams

  const query =
    typeof resolvedSearchParams?.q ===
      'string'
      ? resolvedSearchParams.q.trim()
      : ''

  const products =
    query.length >= 2
      ? await searchProducts({
          search: query,
          first: 20,
        })
      : []

  const hasQuery = query.length >= 2
  const hasResults = products.length > 0

  return (
    <main className="min-h-[70vh] bg-[#fcfcfb]">
      <Container className="pb-16 pt-28 sm:pt-32 md:pb-20">
        {/* Breadcrumb */}
        <nav
          className="mb-8 flex items-center gap-2 text-[12px] font-medium sm:text-[13px]"
          aria-label="مسیر راهنما"
        >
          <Link
            href="/"
            className="
              text-[#8b929b]
              transition-colors
              duration-200
              hover:text-primary
            "
          >
            خانه
          </Link>

          <span
            className="text-accent/55"
            aria-hidden="true"
          >
            /
          </span>

          <span className="font-semibold text-primary">
            جستجو
          </span>
        </nav>

        {/* Intro */}
        <header className="mx-auto mb-10 max-w-3xl text-center">
          <div
            className="
              mx-auto
              mb-4
              flex
              w-fit
              items-center
              gap-2
              rounded-full
              border
              border-accent/15
              bg-accent/[0.07]
              px-3
              py-1.5
              text-[10px]
              font-bold
              text-accent-dark
              sm:text-[11px]
            "
          >
            <Sparkles
              className="h-3.5 w-3.5"
              strokeWidth={1.7}
              aria-hidden="true"
            />

            جستجوی سرای سنگ
          </div>

          <h1
            className="
              text-2xl
              font-black
              tracking-[-0.03em]
              text-primary
              sm:text-3xl
              md:text-4xl
            "
          >
            جستجوی محصولات
          </h1>

          <p
            className="
              mx-auto
              mt-3
              max-w-2xl
              text-sm
              leading-7
              text-[#667085]
              sm:text-[15px]
            "
          >
            {query
              ? `نتایج جستجو برای «${query}»`
              : 'نام سنگ، محصول یا نوع متریال مورد نظر خود را جستجو کنید.'}
          </p>
        </header>

        {/* Search form */}
        <form
          action="/search"
          method="get"
          className="mx-auto mb-12 max-w-2xl"
        >
          <div
            className="
              relative
              flex
              gap-2
              rounded-[20px]
              border
              border-[#e5dfd5]
              bg-white
              p-1.5
              shadow-[0_10px_35px_rgba(10,25,41,0.06)]
              transition-shadow
              duration-200
              focus-within:border-accent/40
              focus-within:shadow-[0_14px_40px_rgba(10,25,41,0.08)]
            "
          >
            <div className="pointer-events-none absolute right-4 top-1/2 flex -translate-y-1/2 items-center justify-center text-accent">
              <Search
                className="h-[18px] w-[18px]"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </div>

            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="مثلاً مرمریت، گرانیت..."
              className="
                min-w-0
                flex-1
                rounded-[15px]
                bg-transparent
                px-11
                py-3
                text-sm
                font-medium
                text-primary
                outline-none
                placeholder:text-[#a0a6ae]
              "
              aria-label="عبارت جستجو"
            />

            <button
              type="submit"
              className="
                inline-flex
                h-11
                shrink-0
                items-center
                justify-center
                gap-2
                rounded-[14px]
                bg-primary
                px-5
                text-sm
                font-bold
                text-white
                shadow-[0_5px_14px_rgba(17,47,80,0.13)]
                transition-all
                duration-200
                hover:-translate-y-px
                hover:bg-primary-light
                hover:shadow-[0_8px_19px_rgba(17,47,80,0.16)]
                active:translate-y-0
                sm:px-6
              "
            >
              جستجو

              <ArrowLeft
                className="h-4 w-4"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </button>
          </div>
        </form>

        {/* Results header */}
        {hasQuery && hasResults && (
          <div
            className="
              mb-5
              flex
              items-end
              justify-between
              gap-4
              border-b
              border-[#e9ecef]
              pb-4
            "
          >
            <div>
              <p className="text-[11px] font-semibold text-[#9299a3]">
                نتایج پیدا شده
              </p>

              <h2 className="mt-1 text-lg font-black text-primary sm:text-xl">
                {products.length} محصول
              </h2>
            </div>

            <span className="hidden text-xs font-medium text-[#8d95a0] sm:block">
              برای «{query}»
            </span>
          </div>
        )}

        {/* Products */}
        {hasQuery && hasResults ? (
          <div
            className="
              grid
              grid-cols-2
              gap-3
              sm:grid-cols-2
              sm:gap-5
              md:grid-cols-3
              lg:grid-cols-4
            "
          >
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="
                  group
                  overflow-hidden
                  rounded-[20px]
                  border
                  border-[#e8e3db]
                  bg-white
                  shadow-[0_2px_10px_rgba(10,25,41,0.025)]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-accent/25
                  hover:shadow-[0_14px_35px_rgba(10,25,41,0.09)]
                "
              >
                {/* Image */}
                <div
                  className="
                    relative
                    aspect-square
                    overflow-hidden
                    bg-[#f3f0e9]
                  "
                >
                  {product.image?.sourceUrl ? (
                    <Image
                      src={product.image.sourceUrl}
                      alt={
                        product.image.altText ||
                        product.name
                      }
                      fill
                      sizes="
                        (max-width: 640px) 50vw,
                        (max-width: 1024px) 33vw,
                        25vw
                      "
                      className="
                        object-cover
                        transition-transform
                        duration-500
                        ease-out
                        group-hover:scale-[1.045]
                      "
                    />
                  ) : (
                    <div
                      className="
                        flex
                        h-full
                        w-full
                        items-center
                        justify-center
                        text-xs
                        font-medium
                        text-[#9aa1a9]
                      "
                    >
                      بدون تصویر
                    </div>
                  )}

                  {/* Image overlay */}
                  <div
                    className="
                      pointer-events-none
                      absolute
                      inset-x-0
                      bottom-0
                      h-1/3
                      bg-gradient-to-t
                      from-[#0a1929]/12
                      to-transparent
                      opacity-0
                      transition-opacity
                      duration-300
                      group-hover:opacity-100
                    "
                  />
                </div>

                {/* Content */}
                <div className="p-3.5 sm:p-4">
                  <h2
                    className="
                      line-clamp-2
                      min-h-[44px]
                      text-[13px]
                      font-bold
                      leading-6
                      text-[#24384f]
                      transition-colors
                      duration-200
                      group-hover:text-primary
                      sm:text-sm
                    "
                  >
                    {product.name}
                  </h2>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <p className="text-[12px] font-extrabold text-accent-dark sm:text-[13px]">
                      {formatPrice(product.price)}
                    </p>

                    <span
                      className="
                        flex
                        h-7
                        w-7
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[#f5f1ea]
                        text-accent
                        transition-all
                        duration-200
                        group-hover:bg-primary
                        group-hover:text-white
                      "
                      aria-hidden="true"
                    >
                      <ArrowLeft
                        className="h-3.5 w-3.5"
                        strokeWidth={1.8}
                      />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div
            className="
              mx-auto
              max-w-2xl
              rounded-[24px]
              border
              border-[#e8e3db]
              bg-white
              px-6
              py-14
              text-center
              shadow-[0_5px_25px_rgba(10,25,41,0.035)]
              sm:py-16
            "
          >
            <div
              className="
                mx-auto
                mb-4
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-full
                border
                border-accent/10
                bg-accent/[0.08]
                text-accent-dark
              "
            >
              <Search
                className="h-6 w-6"
                strokeWidth={1.5}
              />
            </div>

            <h2 className="text-base font-black text-primary sm:text-lg">
              {hasQuery
                ? 'محصولی برای این عبارت یافت نشد'
                : 'هنوز چیزی جستجو نکرده‌اید'}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-[12px] leading-6 text-[#8c949e] sm:text-sm">
              {hasQuery
                ? 'عبارت دیگری را امتحان کنید یا نام نوع سنگ مورد نظر را دقیق‌تر وارد کنید.'
                : 'برای شروع، نام سنگ یا محصول مورد نظر خود را در کادر بالا وارد کنید.'}
            </p>
          </div>
        )}
      </Container>
    </main>
  )
}