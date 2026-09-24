import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  SearchX,
} from 'lucide-react'

import Container from '@/components/ui/container'
import ProductGrid from '@/components/product/ProductGrid'

import {
  getSmartSearchResults,
} from '@/lib/repositories/smart-search-repository'

import {
  SITE_NAME,
  SITE_URL,
} from '@/lib/constants'

export const revalidate = 600

export const metadata: Metadata = {
  title: 'جستجوی هوشمند',

  description:
    'جستجوی هوشمند سنگ‌های ساختمانی بر اساس کاربرد و رنگ در سرای سنگ.',

  alternates: {
    canonical: `${SITE_URL}/smart-search`,
  },

  robots: {
    index: false,
    follow: true,
  },
}

interface SmartSearchPageProps {
  searchParams?: Promise<{
    application?:
      | string
      | string[]
      | undefined

    color?:
      | string
      | string[]
      | undefined
  }>
}

function readParam(
  value:
    | string
    | string[]
    | undefined,
): string {
  if (typeof value !== 'string') {
    return ''
  }

  return value
    .trim()
    .slice(0, 80)
}

export default async function SmartSearchPage({
  searchParams,
}: SmartSearchPageProps) {
  const params =
    await searchParams

  const application =
    readParam(
      params?.application,
    )

  const color =
    readParam(
      params?.color,
    )

  const hasSelection =
    Boolean(
      application &&
      color,
    )

  const products =
    hasSelection
      ? await getSmartSearchResults({
          application,
          color,
        })
      : []

  return (
    <div
      dir="rtl"
      className="
        min-h-screen
        w-full
        bg-[#FCFCFB]
      "
    >
      <Container
        className="
          pb-14
          pt-7
          sm:pb-18
          sm:pt-9
          lg:pb-20
          lg:pt-10
        "
      >
        {/* Header */}
        <header
          className="
            mb-7
            text-center
            sm:mb-9
          "
        >
          <Link
            href="/#smart-search"
            className="
              mb-4
              inline-flex
              items-center
              gap-1.5
              rounded-full
              border
              border-[#B79464]/20
              bg-[#B79464]/[0.06]
              px-3
              py-1.5
              text-[9px]
              font-black
              text-[#8A6A42]
              transition-all
              duration-200
              hover:border-[#B79464]/35
              hover:bg-[#B79464]/[0.10]
            "
          >
            <ArrowRight
              aria-hidden="true"
              className="h-3 w-3"
              strokeWidth={1.9}
            />

            تغییر انتخاب‌ها
          </Link>

          <h1
            className="
              text-[28px]
              font-black
              tracking-[-0.04em]
              text-[#112F50]
              sm:text-[36px]
              lg:text-[42px]
            "
          >
            نتایج جستجوی
            <span className="text-[#B79464]">
              {' '}
              هوشمند
            </span>
          </h1>

          {hasSelection ? (
            <div
              className="
                mt-3
                flex
                flex-wrap
                items-center
                justify-center
                gap-2
              "
            >
              <span
                className="
                  rounded-full
                  border
                  border-[#DDE3E8]
                  bg-white
                  px-3
                  py-1.5
                  text-[9px]
                  font-bold
                  text-[#4A5968]
                  shadow-[0_4px_12px_rgba(17,47,80,0.035)]
                "
              >
                کاربرد: {application}
              </span>

              <span
                className="
                  rounded-full
                  border
                  border-[#B79464]/20
                  bg-[#B79464]/[0.06]
                  px-3
                  py-1.5
                  text-[9px]
                  font-bold
                  text-[#8A6A42]
                "
              >
                رنگ: {color}
              </span>
            </div>
          ) : (
            <p
              className="
                mx-auto
                mt-2
                max-w-[500px]
                text-[11px]
                font-medium
                leading-6
                text-[#667085]
              "
            >
              برای نمایش نتایج، یک کاربرد و یک رنگ
              انتخاب کنید.
            </p>
          )}
        </header>

        {/* Results */}
        {hasSelection ? (
          products.length > 0 ? (
            <>
              <div
                className="
                  mb-4
                  flex
                  items-center
                  justify-between
                  gap-3
                "
              >
                <span
                  className="
                    text-[10px]
                    font-bold
                    text-[#7B8794]
                  "
                >
                  {products.length} محصول
                </span>

                <span
                  className="
                    h-px
                    flex-1
                    bg-[#112F50]/[0.07]
                  "
                />
              </div>

              <ProductGrid
                products={products}
                priorityCount={2}
              />
            </>
          ) : (
            <div
              className="
                rounded-[24px]
                border
                border-dashed
                border-[#112F50]/[0.10]
                bg-white
                px-5
                py-16
                text-center
                shadow-[0_8px_28px_rgba(17,47,80,0.035)]
              "
            >
              <div
                className="
                  mx-auto
                  mb-4
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  bg-[#FBF7F0]
                  text-[#B79464]
                "
              >
                <SearchX
                  className="h-5 w-5"
                  strokeWidth={1.5}
                />
              </div>

              <h2
                className="
                  text-[17px]
                  font-black
                  text-[#112F50]
                "
              >
                محصولی با این ویژگی‌ها پیدا نشد
              </h2>

              <p
                className="
                  mx-auto
                  mt-2
                  max-w-[400px]
                  text-[10px]
                  font-medium
                  leading-6
                  text-[#7C8793]
                "
              >
                کاربرد یا رنگ دیگری را انتخاب کنید
                تا گزینه‌های بیشتری ببینید.
              </p>

              <Link
                href="/#smart-search"
                className="
                  mt-5
                  inline-flex
                  items-center
                  justify-center
                  rounded-full
                  bg-[#112F50]
                  px-5
                  py-2.5
                  text-[9px]
                  font-black
                  text-white
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:bg-[#0A1929]
                "
              >
                تغییر جستجو
              </Link>
            </div>
          )
        ) : (
          <div
            className="
              mx-auto
              max-w-[620px]
              rounded-[24px]
              border
              border-[#E5E0D7]
              bg-white
              px-5
              py-14
              text-center
              shadow-[0_8px_28px_rgba(17,47,80,0.035)]
            "
          >
            <p
              className="
                text-[14px]
                font-black
                text-[#112F50]
              "
            >
              آماده‌ایم سنگ مناسب پروژه‌ات را پیدا کنیم.
            </p>

            <Link
              href="/#smart-search"
              className="
                mt-5
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-[#112F50]
                px-5
                py-2.5
                text-[9px]
                font-black
                text-white
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:bg-[#0A1929]
              "
            >
              رفتن به جستجوی هوشمند
            </Link>
          </div>
        )}
      </Container>
    </div>
  )
}