
import Link from 'next/link'
import {
  ArrowLeft,
} from 'lucide-react'

import type { ProductSummary } from '@/types/wordpress'

import ProductShowcaseCard from './ProductShowcaseCard'
import ProductCarouselControls from './ProductCarouselControls'

export default function ProductCarousel({
  products,
  theme,
}: {
  products: ProductSummary[]
  theme: 'navy' | 'gold'
}) {
  if (!products.length) {
    return null
  }

  const isNavy = theme === 'navy'

  const title = isNavy
    ? 'انتخاب‌های محبوب'
    : 'تازه‌ترین محصولات'

  const description = isNavy
    ? 'چند انتخاب محبوب از میان محصولات سرای‌سنگ'
    : 'تازه‌ترین سنگ‌های اضافه‌شده به مجموعه'

  const carouselId = isNavy
    ? 'product-carousel-navy'
    : 'product-carousel-gold'

  return (
    <section
      dir="rtl"
      className="
        relative
        isolate
        w-full
        overflow-hidden
        rounded-[24px]
        border
        border-white/[0.08]
        bg-[#091827]
        p-1.5
        shadow-[0_14px_38px_rgba(10,25,41,0.12)]
        sm:rounded-[28px]
        sm:p-2
        lg:rounded-[32px]
      "
    >
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          -z-10
          overflow-hidden
          rounded-[inherit]
        "
      >
        <div
          className="
            absolute
            -right-24
            -top-24
            h-64
            w-64
            rounded-full
            bg-[#B79464]/[0.09]
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -bottom-28
            -left-24
            h-72
            w-72
            rounded-full
            bg-[#31567D]/[0.08]
            blur-3xl
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.035),transparent_30%)]
          "
        />
      </div>

      {/* Main surface */}
      <div
        className="
          relative
          overflow-hidden
          rounded-[21px]
          border
          border-white/[0.07]
          bg-white/[0.035]
          px-3
          py-3
          shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]
          backdrop-blur-xl
          sm:rounded-[24px]
          sm:px-4
          sm:py-4
          md:px-5
          md:py-4.5
          lg:rounded-[27px]
          lg:px-6
          lg:py-5
        "
      >
        {/* Top gloss */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-x-[8%]
            top-0
            h-px
            bg-gradient-to-r
            from-transparent
            via-white/20
            to-transparent
          "
        />

        {/* Gold accent */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            right-6
            top-0
            h-[2px]
            w-14
            rounded-b-full
            bg-gradient-to-r
            from-[#8E6F45]
            via-[#D8BD90]
            to-transparent
            sm:right-8
            sm:w-20
          "
        />

        {/* Header */}
        <header
          className="
            mb-3
            flex
            items-center
            justify-between
            gap-3
            sm:mb-4
            md:mb-5
          "
        >
          {/* Title */}
          <div className="min-w-0">
            <h2
              className="
                truncate
                text-[22px]
                font-black
                leading-none
                tracking-[-0.04em]
                text-white
                sm:text-[26px]
                md:text-[30px]
                lg:text-[32px]
              "
            >
              <span className="text-[#D8BC8D]">
                {title.split(' ')[0]}
              </span>

              <span className="mr-1.5">
                {title
                  .split(' ')
                  .slice(1)
                  .join(' ')}
              </span>
            </h2>

            <p
              className="
                mt-1.5
                hidden
                text-[9px]
                font-medium
                leading-5
                text-white/45
                sm:block
                sm:text-[10px]
                md:text-[11px]
              "
            >
              {description}
            </p>
          </div>

          {/* Actions */}
          <div
            className="
              flex
              shrink-0
              items-center
              gap-1.5
            "
          >
            <ProductCarouselControls
              carouselId={carouselId}
            />

            {/* Single CTA */}
            <Link
              href="/products"
              className="
                group
                inline-flex
                min-h-9
                items-center
                gap-1.5
                rounded-full
                border
                border-[#B79464]/25
                bg-[#B79464]/[0.09]
                px-3
                text-[9px]
                font-black
                text-[#E1CAA5]
                transition-all
                duration-200
                hover:border-[#B79464]/45
                hover:bg-[#B79464]/[0.15]
                hover:text-white
                sm:min-h-10
                sm:px-3.5
                sm:text-[10px]
              "
            >
              <span>مشاهده همه</span>

              <ArrowLeft
                aria-hidden="true"
                className="
                  h-3
                  w-3
                  transition-transform
                  duration-200
                  group-hover:-translate-x-0.5
                "
                strokeWidth={1.9}
              />
            </Link>
          </div>
        </header>

        {/* Products */}
        <div className="relative">
          <div
            id={carouselId}
            className="
              flex
              w-full
              snap-x
              snap-mandatory
              gap-2.5
              overflow-x-auto
              overflow-y-hidden
              px-0.5
              pb-0.5
              pt-0
              scroll-smooth
              overscroll-x-contain
              [scrollbar-width:none]
              [-ms-overflow-style:none]
              [&::-webkit-scrollbar]:hidden
              sm:gap-3
              md:gap-4
              lg:gap-4
            "
          >
            {products.map(
              (product, index) => (
                <div
                  key={
                    product.id ||
                    product.slug ||
                    index
                  }
                  className="
                    min-w-0
                    shrink-0
                    snap-start
                    basis-[79%]
                    xs:basis-[64%]
                    sm:basis-[46%]
                    md:basis-[31%]
                    lg:basis-[30%]
                    xl:basis-[23.5%]
                  "
                >
                  <ProductShowcaseCard
                    product={product}
                    index={index}
                  />
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

