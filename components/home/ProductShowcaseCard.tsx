
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
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
  const regularPrice =
    getProductRegularPrice(product)

  const productHref = slug
    ? `/products/${slug}`
    : '/products'

  const productName =
    product.name || 'سنگ ساختمانی'

  const formatPrice = (value: string) => {
    const normalized = value
      .replace(/[٬,]/g, '')
      .trim()

    const numeric = Number(normalized)

    if (Number.isFinite(numeric)) {
      return new Intl.NumberFormat(
        'fa-IR',
      ).format(numeric)
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
        max-w-[245px]
        min-w-0
      "
    >
      <div
        className="
          relative
          overflow-hidden
          rounded-[20px]
          border
          border-[#E4E0D8]
          bg-gradient-to-b
          from-white
          to-[#FCFBF9]
          p-1.5
          shadow-[0_7px_22px_rgba(17,47,80,0.055)]
          transition-all
          duration-400
          ease-[cubic-bezier(.22,1,.36,1)]
          group-hover:-translate-y-1
          group-hover:border-[#D8CCBA]
          group-hover:shadow-[0_14px_32px_rgba(17,47,80,0.10)]
        "
      >
        {/* Gold accent */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            right-5
            top-0
            z-20
            h-[2px]
            w-9
            rounded-b-full
            bg-gradient-to-l
            from-[#D8BC8D]
            via-[#B79464]
            to-transparent
            transition-all
            duration-400
            group-hover:w-14
          "
        />

        {/* Image */}
        <Link
          href={productHref}
          aria-label={`مشاهده محصول ${productName}`}
          className="block outline-none"
        >
          <div
            className="
              relative
              aspect-[1.12]
              overflow-hidden
              rounded-[15px]
              bg-[#F0EEE9]
            "
          >
            <Image
              src={image}
              alt={alt}
              fill
              sizes="
                (max-width: 639px) 72vw,
                (max-width: 767px) 55vw,
                (max-width: 1023px) 30vw,
                245px
              "
              draggable={false}
              className="
                object-cover
                transition-transform
                duration-800
                ease-[cubic-bezier(.22,1,.36,1)]
                group-hover:scale-[1.045]
              "
            />

            {/* Soft image depth */}
            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                inset-0
                bg-gradient-to-br
                from-white/[0.06]
                via-transparent
                to-[#112F50]/[0.08]
                opacity-70
              "
            />

            {/* Image border */}
            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                inset-0
                rounded-[15px]
                ring-1
                ring-inset
                ring-black/[0.035]
              "
            />
          </div>
        </Link>

        {/* Content */}
        <div className="px-2.5 pb-2.5 pt-2.5">
          {/* Product name */}
          <Link
            href={productHref}
            className="block outline-none"
          >
            <h3
              className="
                line-clamp-2
                text-center
                text-[13px]
                font-black
                leading-[1.55]
                tracking-[-0.02em]
                text-[#112F50]
                transition-colors
                duration-300
                group-hover:text-[#8A6A42]
                sm:text-[14px]
              "
            >
              {productName}
            </h3>
          </Link>

          {/* Gold divider */}
          <div
            aria-hidden="true"
            className="
              mx-auto
              my-1.5
              h-px
              w-[30%]
              bg-gradient-to-r
              from-transparent
              via-[#B79464]
              to-transparent
              opacity-55
              transition-all
              duration-300
              group-hover:w-[38%]
              group-hover:opacity-80
            "
          />

          {/* Price */}
          <div
            className="
              flex
              flex-col
              items-center
            "
          >
            <span
              className="
                mb-1
                text-[8px]
                font-bold
                text-[#98A1A9]
                sm:text-[9px]
              "
            >
              قیمت هر متر مربع
            </span>

            <div
              className="
                flex
                items-baseline
                justify-center
                gap-1.5
              "
            >
              <span
                className="
                  text-[18px]
                  font-black
                  leading-none
                  tracking-[-0.035em]
                  text-[#112F50]
                  sm:text-[19px]
                "
              >
                {formatPrice(price)}
              </span>

              <span
                className="
                  text-[8px]
                  font-bold
                  text-[#707B86]
                  sm:text-[9px]
                "
              >
                تومان
              </span>

              {regularPrice && (
                <span
                  className="
                    mr-0.5
                    text-[8px]
                    text-[#A18B70]
                    line-through
                  "
                >
                  {formatPrice(
                    regularPrice,
                  )}
                </span>
              )}
            </div>
          </div>

          {/* CTA */}
          <a
            href={`tel:${TEL_PHONE}`}
            aria-label={`استعلام قیمت ${productName}`}
            className="
              mt-3
              flex
              h-10
              w-full
              items-center
              justify-between
              rounded-[11px]
              bg-[#112F50]
              px-3
              text-[10px]
              font-black
              text-white
              shadow-[0_6px_16px_rgba(17,47,80,0.10)]
              transition-all
              duration-300
              hover:bg-[#0C2239]
              hover:shadow-[0_9px_21px_rgba(17,47,80,0.16)]
              active:scale-[0.985]
              sm:h-11
              sm:px-3.5
              sm:text-[11px]
            "
          >
            <span className="flex items-center gap-2">
              <span
                className="
                  flex
                  h-6.5
                  w-6.5
                  items-center
                  justify-center
                  rounded-full
                  bg-[#B79464]/15
                  text-[#D8BC8D]
                  transition-all
                  duration-300
                  group-hover:bg-[#B79464]/25
                "
              >
                <PhoneCall
                  aria-hidden="true"
                  className="h-3.5 w-3.5"
                  strokeWidth={1.9}
                />
              </span>

              <span>
                استعلام قیمت
              </span>
            </span>

            <span
              aria-hidden="true"
              className="
                flex
                h-6
                w-6
                items-center
                justify-center
                rounded-full
                bg-white/[0.06]
                transition-all
                duration-300
                group-hover:bg-white/[0.11]
              "
            >
              <ArrowLeft
                className="
                  h-3
                  w-3
                  transition-transform
                  duration-300
                  group-hover:-translate-x-0.5
                "
                strokeWidth={1.9}
              />
            </span>
          </a>
        </div>
      </div>
    </article>
  )
}

