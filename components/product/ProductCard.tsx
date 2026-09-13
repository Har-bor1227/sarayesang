import Image from 'next/image'
import Link from 'next/link'

import {
  ArrowLeft,
  Phone,
} from 'lucide-react'

import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card'

import { formatPrice } from '@/lib/format'
import { TEL_PHONE } from '@/lib/constants'

import type {
  ProductSummary,
} from '@/types/wordpress'

interface ProductCardProps {
  product: ProductSummary
  priority?: boolean
}

export default function ProductCard({
  product,
  priority = false,
}: ProductCardProps) {
  const category =
    product.productCategories?.nodes?.[0]

  const imageUrl =
    product.image?.sourceUrl

  const hasSalePrice = Boolean(
    product.onSale &&
      product.salePrice &&
      product.regularPrice &&
      product.salePrice !==
        product.regularPrice,
  )

  const displayPrice = hasSalePrice
    ? product.salePrice
    : product.price

  return (
    <article className="h-full">
      <Card
        className="
          group
          flex
          h-full
          flex-col
          overflow-hidden
          rounded-[24px]
          border
          border-[#112F50]/[0.07]
          bg-white
          shadow-[0_8px_28px_rgba(10,25,41,0.045)]
          ring-0
          transition-all
          duration-500
          hover:-translate-y-1
          hover:border-[#B79464]/25
          hover:shadow-[0_18px_48px_rgba(10,25,41,0.10)]
        "
      >
        {/* =========================================================
            IMAGE
        ========================================================== */}
        <Link
          href={`/products/${product.slug}`}
          className="block"
          aria-label={`مشاهده ${product.name}`}
        >
          <div className="relative aspect-[1.08] w-full overflow-hidden bg-[#F0EFEC]">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={
                  product.image?.altText ||
                  product.name
                }
                fill
                priority={priority}
                sizes="(max-width: 640px) 47vw, (max-width: 1024px) 31vw, (max-width: 1280px) 23vw, 20vw"
                quality={80}
                className="
                  object-cover
                  transition-transform
                  duration-700
                  ease-out
                  group-hover:scale-[1.045]
                "
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-[#F2F1EE] text-[10px] font-bold text-[#667085] sm:text-[11px]">
                بدون تصویر
              </div>
            )}

            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,25,41,0.02)_0%,transparent_62%,rgba(10,25,41,0.18)_100%)]" />

            {/* COLLECTION */}
            <div className="absolute right-3 top-3">
              <span className="inline-flex rounded-full border border-white/20 bg-[#0A1929]/30 px-2.5 py-1.5 text-[7px] font-black uppercase tracking-[0.16em] text-white backdrop-blur-md sm:text-[8px]">
                Saraye Sang
              </span>
            </div>

            {/* SALE */}
            {product.onSale && (
              <div className="absolute left-3 top-3">
                <span className="inline-flex rounded-full bg-[#B79464] px-2.5 py-1.5 text-[8px] font-black text-white shadow-[0_7px_20px_rgba(183,148,100,0.22)] sm:text-[9px]">
                  ویژه
                </span>
              </div>
            )}

            {/* IMAGE ARROW */}
            <span className="absolute bottom-3 left-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-[#0A1929]/25 text-white opacity-0 backdrop-blur-md transition-all duration-400 group-hover:opacity-100">
              <ArrowLeft className="h-3.5 w-3.5" />
            </span>
          </div>
        </Link>

        {/* =========================================================
            CONTENT
        ========================================================== */}
        <CardContent className="flex-1 p-4 sm:p-5">
          {/* CATEGORY */}
          {category && (
            <Link
              href={`/categories/${category.slug}`}
              className="group/category mb-2.5 inline-flex max-w-full items-center gap-2"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#B79464]" />

              <span className="truncate text-[8px] font-black text-[#667085] transition-colors duration-200 group-hover/category:text-[#B79464] sm:text-[9px]">
                {category.name}
              </span>
            </Link>
          )}

          {/* TITLE */}
          <Link
            href={`/products/${product.slug}`}
            className="block"
          >
            <h2
              className="
                line-clamp-2
                min-h-[3.2rem]
                text-[14px]
                font-black
                leading-[1.75]
                tracking-[-0.015em]
                text-[#112F50]
                transition-colors
                duration-300
                group-hover:text-[#B79464]
                sm:text-[15px]
                sm:leading-[1.7]
              "
            >
              {product.name}
            </h2>
          </Link>

          {/* DIVIDER */}
          <div className="mt-4 h-px w-full bg-[#112F50]/[0.06]" />
        </CardContent>

        {/* =========================================================
            FOOTER
        ========================================================== */}
        <CardFooter className="mt-auto flex min-w-0 items-end justify-between gap-3 px-4 pb-4 pt-0 sm:px-5 sm:pb-5">
          {/* PRICE */}
          <div className="min-w-0">
            {displayPrice ? (
              <>
                <span className="block text-[8px] font-semibold text-[#667085] sm:text-[9px]">
                  قیمت
                </span>

                <div className="mt-1 flex min-w-0 items-end gap-2">
                  <span className="block truncate text-[14px] font-black tracking-[-0.02em] text-[#112F50] sm:text-[16px]">
                    {formatPrice(
                      displayPrice,
                    )}
                  </span>

                  {hasSalePrice && (
                    <span className="block shrink-0 pb-0.5 text-[9px] font-semibold text-[#667085]/55 line-through sm:text-[10px]">
                      {formatPrice(
                        product.regularPrice,
                      )}
                    </span>
                  )}
                </div>
              </>
            ) : (
              <>
                <span className="block text-[8px] font-semibold text-[#667085] sm:text-[9px]">
                  قیمت
                </span>

                <span className="mt-1 block text-[11px] font-black text-[#112F50] sm:text-[12px]">
                  برای استعلام
                </span>
              </>
            )}
          </div>

          {/* CONSULTATION */}
          <a
            href={`tel:${TEL_PHONE}`}
            aria-label={`تماس برای مشاوره درباره ${product.name}`}
            className="
              group/cta
              inline-flex
              shrink-0
              items-center
              gap-1.5
              rounded-full
              border
              border-[#B79464]/20
              bg-[#FBF8F2]
              px-3
              py-2
              text-[8px]
              font-black
              text-[#9E7F50]
              transition-all
              duration-300
              hover:border-[#B79464]
              hover:bg-[#B79464]
              hover:text-white
              sm:px-3.5
              sm:text-[9px]
            "
          >
            <Phone className="h-3 w-3" />

            <span>مشاوره</span>
          </a>
        </CardFooter>
      </Card>
    </article>
  )
}