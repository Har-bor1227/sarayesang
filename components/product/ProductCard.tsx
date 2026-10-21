import Image from 'next/image'
import Link from 'next/link'

import {
  PhoneCall,
} from 'lucide-react'

import {
  formatPrice,
} from '@/lib/format'

import {
  TEL_PHONE,
} from '@/lib/constants'

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
  const imageUrl = product.image?.sourceUrl

  const productName =
    product.name || 'سنگ ساختمانی'

  const productHref = product.slug
    ? `/products/${product.slug}`
    : '/products'

  const hasSalePrice = Boolean(
    product.onSale &&
      product.salePrice &&
      product.regularPrice &&
      product.salePrice !== product.regularPrice,
  )

  const displayPrice = hasSalePrice
    ? product.salePrice
    : product.price

  const normalizedPrice = (displayPrice ?? '')
    .replace(/[٬,]/g, '')
    .trim()

  const numericPrice = Number(normalizedPrice)

  const hasPrice =
    normalizedPrice !== '' &&
    Number.isFinite(numericPrice) &&
    numericPrice > 0

  return (
    <article
      dir="rtl"
      className="
        group
        mx-auto
        w-full
        max-w-[260px]
        min-w-0
      "
    >
      <div
        className="
          relative
          isolate
          aspect-[0.66]
          w-full
          overflow-hidden
          rounded-[26px]
          border
          border-white/70
          bg-[#112F50]
          shadow-[0_10px_26px_rgba(17,47,80,0.12)]
          ring-1
          ring-inset
          ring-[#112F50]/[0.04]
          transition-shadow
          duration-300
          ease-out
          group-hover:shadow-[0_14px_32px_rgba(17,47,80,0.17)]
        "
      >
        {/* Product image with fallback */}
        <Link
          href={productHref}
          aria-label={`مشاهده محصول ${productName}`}
          className="
            absolute
            inset-0
            z-0
            block
            overflow-hidden
            rounded-[inherit]
            outline-none
            focus-visible:ring-2
            focus-visible:ring-inset
            focus-visible:ring-[#D8BC8D]
          "
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={
                product.image?.altText ||
                productName
              }
              fill
              preload={priority}
              sizes="
                (max-width: 639px) 76vw,
                (max-width: 767px) 55vw,
                (max-width: 1023px) 30vw,
                260px
              "
              quality={75}
              draggable={false}
              className="
                rounded-[inherit]
                object-cover
                transition-transform
                duration-500
                ease-out
                group-hover:scale-[1.025]
              "
            />
          ) : (
            <div
              className="
                absolute
                inset-0
                bg-[radial-gradient(circle_at_25%_20%,rgba(216,188,141,0.24),transparent_30%),linear-gradient(145deg,#294763,#112F50_65%,#0A1929)]
              "
            >
              <div
                className="
                  absolute
                  inset-x-0
                  bottom-[43%]
                  flex
                  items-center
                  justify-center
                  px-3
                  text-center
                  text-[11px]
                  font-bold
                  text-white/65
                  sm:text-xs
                "
              >
                تصویر محصول موجود نیست
              </div>
            </div>
          )}
        </Link>

        {/* Image contrast */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            z-[1]
            rounded-[inherit]
            bg-[linear-gradient(180deg,rgba(5,17,30,0.08)_0%,rgba(8,24,44,0.02)_25%,rgba(8,24,44,0.12)_46%,rgba(6,24,34,0.64)_70%,rgba(5,17,26,0.96)_100%)]
          "
        />

        {/* Compact title overlay with soft fading edges */}
        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            top-0
            z-10
            overflow-hidden
            rounded-t-[25px]
            px-3
            pb-2
            pt-3
            sm:px-4
            sm:pb-3
            sm:pt-4
          "
        >
          {/* Subtle dark gradient and blur */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-0
              z-0
              rounded-t-[25px]
              bg-[linear-gradient(180deg,rgba(7,22,38,0.78)_0%,rgba(7,22,38,0.48)_55%,rgba(7,22,38,0)_100%)]
              backdrop-blur-[2px]
              [mask-image:linear-gradient(to_bottom,black_0%,black_65%,transparent_100%)]
            "
          />

          <div className="relative z-10">
            <Link
              href={productHref}
              aria-label={`مشاهده محصول ${productName}`}
              className="
                pointer-events-auto
                block
                rounded-sm
                text-center
                outline-none
                focus-visible:ring-2
                focus-visible:ring-[#D8BC8D]
              "
            >
              <h3
                className="
                  line-clamp-2
                  text-center
                  text-[14px]
                  font-black
                  leading-[1.8]
                  tracking-[-0.02em]
                  text-white
                  drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]
                  transition-colors
                  duration-300
                  group-hover:text-[#F0D7AE]
                  sm:text-[15px]
                "
              >
                {productName}
              </h3>
            </Link>

            {/* Thin gold accent */}
            <div
              aria-hidden="true"
              className="
                mx-auto
                mt-2
                h-px
                w-12
                max-w-full
                bg-gradient-to-r
                from-transparent
                via-[#D8BC8D]
                to-transparent
                transition-[width]
                duration-300
                ease-out
                group-hover:w-16
                sm:mt-2.5
              "
            />
          </div>
        </div>

        {/* Compact bottom product details */}
        <div
          className="
            absolute
            inset-x-0
            bottom-0
            z-10
            px-3.5
            pb-3
            pt-8
            sm:px-4
            sm:pb-3.5
            sm:pt-9
          "
        >
          {/* Compact price without a box or background */}
          <div
            className="
              mb-2
              flex
              min-w-0
              flex-col
              items-center
              justify-center
              text-center
              sm:mb-2.5
            "
          >
            <span
              className="
                mb-0.5
                text-[9px]
                font-bold
                leading-relaxed
                text-white/80
                drop-shadow-[0_1px_4px_rgba(0,0,0,0.45)]
                sm:text-[10px]
              "
            >
              قیمت هر متر مربع
            </span>

            {hasPrice ? (
              <div
                className="
                  flex
                  max-w-full
                  flex-wrap
                  items-baseline
                  justify-center
                  gap-x-1
                  gap-y-0.5
                "
              >
                <span
                  className="
                    text-[14px]
                    font-black
                    leading-tight
                    tracking-[-0.025em]
                    text-white
                    tabular-nums
                    drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)]
                    sm:text-[16px]
                  "
                >
                  {formatPrice(displayPrice)}
                </span>

                {hasSalePrice && product.regularPrice && (
                  <span
                    className="
                      text-[9px]
                      font-medium
                      text-white/65
                      line-through
                      decoration-[#D8BC8D]
                      sm:text-[10px]
                    "
                  >
                    {formatPrice(product.regularPrice)}
                  </span>
                )}
              </div>
            ) : (
              <span
                className="
                  text-[13px]
                  font-black
                  leading-tight
                  text-white
                  drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)]
                  sm:text-[15px]
                "
              >
                تماس بگیرید
              </span>
            )}
          </div>

          {/* Green price inquiry button */}
          <a
            href={`tel:${TEL_PHONE}`}
            aria-label={`تماس برای استعلام قیمت ${productName}`}
            className="
              flex
              h-10
              w-full
              min-w-0
              items-center
              justify-center
              gap-2
              rounded-full
              border
              border-[#48B875]
              bg-[#279B59]
              px-3
              text-[11px]
              font-black
              text-white
              shadow-[0_3px_10px_rgba(0,0,0,0.12)]
              outline-none
              transition-colors
              duration-200
              hover:border-[#58C982]
              hover:bg-[#218A4D]
              focus-visible:ring-2
              focus-visible:ring-[#48B875]
              focus-visible:ring-offset-2
              focus-visible:ring-offset-[#112F50]
              active:bg-[#197743]
              sm:h-11
              sm:text-[12px]
            "
          >
            <PhoneCall
              aria-hidden="true"
              className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4"
              strokeWidth={1.9}
            />

            <span>
              استعلام قیمت
            </span>
          </a>
        </div>

        {/* Inner edge stays within the card */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            z-30
            rounded-[inherit]
            ring-1
            ring-inset
            ring-white/[0.12]
          "
        />
      </div>
    </article>
  )
}