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
  index,
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

  return (
    <article
      id={`featured-product-${index}`}
      className="
        group
        flex
        w-[min(76vw,245px)]
        min-w-[min(76vw,245px)]
        shrink-0
        snap-start
        flex-col
        overflow-hidden
        rounded-[20px]
        border
        border-[#e7e8e6]
        bg-white
        p-2.5
        shadow-[0_7px_24px_rgba(10,25,41,0.08)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-[0_14px_34px_rgba(10,25,41,0.13)]
        sm:w-[250px]
        sm:min-w-[250px]
        sm:rounded-[21px]
        sm:p-3
        lg:w-[235px]
        lg:min-w-[235px]
        xl:w-[245px]
        xl:min-w-[245px]
      "
      dir="rtl"
    >
      {/* Product image */}
      <Link
        href={productHref}
        className="block"
        aria-label={`مشاهده ${product.name || 'محصول'}`}
      >
        <div
          className="
            relative
            aspect-[1.02]
            overflow-hidden
            rounded-[16px]
            bg-[#efeeea]
            sm:rounded-[17px]
          "
        >
          <Image
            src={image}
            alt={alt}
            fill
            sizes="
              (max-width: 639px) 76vw,
              250px
            "
            className="
              object-cover
              transition-transform
              duration-500
              ease-out
              group-hover:scale-[1.035]
            "
          />

          {/* Image overlay */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-x-0
              bottom-0
              h-1/3
              bg-gradient-to-t
              from-[#0a1929]/10
              to-transparent
            "
          />

          {/* Detail affordance */}
          <span
            className="
              absolute
              bottom-2.5
              left-2.5
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              bg-white/90
              text-primary
              opacity-0
              shadow-[0_4px_12px_rgba(10,25,41,0.08)]
              backdrop-blur-sm
              transition-all
              duration-250
              group-hover:opacity-100
              max-sm:opacity-100
            "
            aria-hidden="true"
          >
            <ArrowLeft
              className="h-3.5 w-3.5"
              strokeWidth={1.8}
            />
          </span>
        </div>
      </Link>

      {/* Product info */}
      <div className="flex flex-1 flex-col px-1 pb-0.5 pt-3">
        <Link
          href={productHref}
          className="
            line-clamp-2
            min-h-[44px]
            text-right
            text-[13px]
            font-black
            leading-[1.7]
            tracking-[-0.01em]
            text-primary
            transition-colors
            duration-200
            hover:text-accent-dark
            sm:text-[14px]
          "
        >
          {product.name || 'سنگ ساختمانی'}
        </Link>

        {/* Price */}
        <div className="mt-2.5">
          <div className="flex flex-wrap items-end gap-x-2 gap-y-1">
            <span
              className="
                text-[14px]
                font-black
                text-primary
                sm:text-[15px]
              "
            >
              {price}
            </span>

            {regularPrice && (
              <span
                className="
                  text-[10px]
                  font-medium
                  text-[#98a0a8]
                  line-through
                "
              >
                {regularPrice}
              </span>
            )}
          </div>

          <span
            className="
              mt-0.5
              block
              text-[9px]
              font-medium
              text-[#8b949d]
            "
          >
            تومان / متر مربع
          </span>
        </div>

        {/* Actions */}
        <div
          className="
            mt-3
            grid
            grid-cols-[1.1fr_0.9fr]
            gap-1.5
          "
        >
          {/* Product */}
          <Link
            href={productHref}
            className="
              group/view
              flex
              h-9
              min-w-0
              items-center
              justify-center
              gap-1.5
              rounded-[10px]
              bg-primary
              px-2
              text-[10px]
              font-bold
              text-white
              transition-all
              duration-200
              hover:bg-primary-light
              active:scale-[0.98]
              sm:h-10
              sm:text-[11px]
            "
          >
            <span className="truncate">
              مشاهده محصول
            </span>

            <ArrowLeft
              className="
                h-3.5
                w-3.5
                shrink-0
                transition-transform
                duration-200
                group-hover/view:-translate-x-0.5
              "
              strokeWidth={1.8}
            />
          </Link>

          {/* Consultation */}
          <a
            href={`tel:${TEL_PHONE}`}
            className="
              flex
              h-9
              min-w-0
              items-center
              justify-center
              gap-1.5
              rounded-[10px]
              border
              border-accent/30
              bg-accent/[0.07]
              px-2
              text-[10px]
              font-bold
              text-accent-dark
              transition-all
              duration-200
              hover:border-accent/50
              hover:bg-accent/[0.12]
              active:scale-[0.98]
              sm:h-10
              sm:text-[11px]
            "
          >
            <PhoneCall
              className="h-3.5 w-3.5 shrink-0"
              strokeWidth={1.8}
            />

            <span className="truncate">
              استعلام
            </span>
          </a>
        </div>
      </div>
    </article>
  )
}