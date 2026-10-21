import Link from 'next/link'
import Image from 'next/image'
import {
  PhoneCall,
} from 'lucide-react'

import type { ProductSummary } from '@/types/wordpress'

import {
  getProductAlt,
  getProductImage,
  getProductPrice,
  getProductRegularPrice,
  getProductSlug,
} from './utils'

import { TEL_PHONE } from '@/lib/constants'

export default function ProductShowcaseCard({
  product,
}: {
  product: ProductSummary
  index: number
}) {
  const image = getProductImage(product)
  const alt = getProductAlt(product)
  const slug = getProductSlug(product)

  const price = getProductPrice(product)
  const regularPrice = getProductRegularPrice(product)

  const productHref = slug
    ? `/products/${slug}`
    : '/products'

  const productName = product.name || 'سنگ ساختمانی'

  const normalizedPrice = price
    .replace(/[٬,]/g, '')
    .trim()

  const numericPrice = Number(normalizedPrice)

  const hasPrice =
    normalizedPrice !== '' &&
    Number.isFinite(numericPrice) &&
    numericPrice > 0

  const formatPrice = (value: string) => {
    const normalized = value
      .replace(/[٬,]/g, '')
      .trim()

    const numeric = Number(normalized)

    if (Number.isFinite(numeric)) {
      return new Intl.NumberFormat('fa-IR').format(numeric)
    }

    return value
  }

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
        {/* Product image: zoom stays clipped inside the card */}
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
          <Image
            src={image}
            alt={alt}
            fill
            sizes="
              (max-width: 639px) 76vw,
              (max-width: 767px) 55vw,
              (max-width: 1023px) 30vw,
              260px
            "
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
          {/* Soft gradient and subtle blur */}
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

        {/* Bottom product details */}
        <div
          className="
            absolute
            inset-x-0
            bottom-0
            z-10
            px-3.5
            pb-3.5
            pt-12
            sm:px-4
            sm:pb-4
          "
        >
          {/* Price without a box or background */}
          <div
            className="
              mb-3
              flex
              min-w-0
              flex-col
              items-center
              justify-center
              text-center
              sm:mb-4
            "
          >
            <span
              className="
                mb-1
                text-[10px]
                font-bold
                leading-relaxed
                text-white/80
                drop-shadow-[0_1px_5px_rgba(0,0,0,0.45)]
                sm:text-[11px]
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
                  gap-x-1.5
                  gap-y-1
                "
              >
                <span
                  className="
                    text-[17px]
                    font-black
                    leading-tight
                    tracking-[-0.025em]
                    text-white
                    tabular-nums
                    drop-shadow-[0_2px_7px_rgba(0,0,0,0.4)]
                    sm:text-[19px]
                  "
                >
                  {formatPrice(price)}
                </span>

                <span
                  className="
                    text-[10px]
                    font-bold
                    text-white/85
                    sm:text-[11px]
                  "
                >
                  تومان
                </span>

                {regularPrice && (
                  <span
                    className="
                      text-[10px]
                      font-medium
                      text-white/65
                      line-through
                      decoration-[#D8BC8D]
                      sm:text-[11px]
                    "
                  >
                    {formatPrice(regularPrice)}
                  </span>
                )}
              </div>
            ) : (
              <span
                className="
                  text-[15px]
                  font-black
                  leading-tight
                  text-white
                  drop-shadow-[0_2px_7px_rgba(0,0,0,0.4)]
                  sm:text-[17px]
                "
              >
                تماس بگیرید
              </span>
            )}
          </div>

          {/* Green price inquiry button with white icon and text */}
          <a
            href={`tel:${TEL_PHONE}`}
            aria-label={`تماس برای استعلام قیمت ${productName}`}
            className="
              flex
              h-11
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
              text-[12px]
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
              sm:h-12
              sm:text-[13px]
            "
          >
            <PhoneCall
              aria-hidden="true"
              className="h-4 w-4 shrink-0"
              strokeWidth={1.9}
            />

            <span>استعلام قیمت</span>
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