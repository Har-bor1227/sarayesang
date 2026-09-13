import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'

import Container from '@/components/ui/container'

import type { ProductCategoryNode } from '@/types/wordpress'

interface StoneCategoryCarouselProps {
  categories: ProductCategoryNode[]
}

export default function StoneCategoryCarousel({
  categories,
}: StoneCategoryCarouselProps) {
  if (!categories.length) {
    return null
  }

  return (
    <section
      aria-label="دسته‌بندی سنگ‌ها"
      className="
        w-full
        overflow-hidden
        bg-[#fcfcfb]
        py-14
        sm:py-16
        md:py-20
      "
    >
      <Container>
        {/* Section heading */}
        <div
          className="
            mb-8
            flex
            flex-col
            gap-4
            sm:mb-10
            md:flex-row
            md:items-end
            md:justify-between
          "
        >
          <div className="max-w-xl">
            <div className="mb-3 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-px w-7 bg-accent"
              />

              <span
                className="
                  text-[10px]
                  font-bold
                  tracking-[0.07em]
                  text-accent-dark
                  sm:text-[11px]
                "
              >
                COLLECTION
              </span>
            </div>

            <h2
              className="
                text-2xl
                font-black
                tracking-[-0.025em]
                text-primary
                sm:text-3xl
              "
            >
              دسته‌بندی سنگ‌ها
            </h2>

            <p
              className="
                mt-2
                text-sm
                leading-7
                text-[#667085]
                sm:text-[15px]
              "
            >
              متریال مناسب پروژه خود را از میان مجموعه سنگ‌های
              منتخب سرای سنگ پیدا کنید.
            </p>
          </div>

          <Link
            href="/categories"
            className="
              group
              inline-flex
              w-fit
              items-center
              gap-2
              text-xs
              font-bold
              text-primary
              transition-colors
              duration-200
              hover:text-accent-dark
            "
          >
            مشاهده همه دسته‌بندی‌ها

            <ArrowLeft
              className="
                h-4
                w-4
                transition-transform
                duration-200
                group-hover:-translate-x-1
              "
              strokeWidth={1.8}
            />
          </Link>
        </div>

        {/* Categories */}
        <div className="relative w-full">
          <div
            className="
              flex
              min-w-0
              snap-x
              snap-mandatory
              items-start
              justify-start
              gap-3.5
              overflow-x-auto
              px-1
              pb-5
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
              sm:justify-center
              sm:gap-5
              md:gap-6
              lg:gap-7
              xl:gap-8
            "
            dir="rtl"
          >
            {categories.map((category) => {
              const imageSrc =
                category.image?.sourceUrl ||
                '/images/home/product-placeholder.webp'

              const imageAlt =
                category.image?.altText ||
                `دسته‌بندی ${category.name}`

              return (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="
                    group
                    flex
                    w-[126px]
                    shrink-0
                    snap-center
                    flex-col
                    items-center
                    outline-none
                    sm:w-[145px]
                    md:w-[165px]
                    lg:w-[182px]
                    xl:w-[195px]
                  "
                >
                  {/* Image */}
                  <div
                    className="
                      relative
                      h-[155px]
                      w-[112px]
                      sm:h-[175px]
                      sm:w-[128px]
                      md:h-[195px]
                      md:w-[140px]
                      lg:h-[215px]
                      lg:w-[154px]
                      xl:h-[230px]
                      xl:w-[166px]
                    "
                  >
                    <Image
                      src={imageSrc}
                      alt={imageAlt}
                      fill
                      sizes="
                        (max-width: 639px) 112px,
                        (max-width: 767px) 128px,
                        (max-width: 1023px) 140px,
                        (max-width: 1279px) 154px,
                        166px
                      "
                      className="
                        object-contain
                        transition-transform
                        duration-500
                        ease-out
                        group-hover:-translate-y-1.5
                        group-hover:scale-[1.035]
                      "
                    />

                    {/* Ground shadow */}
                    <div
                      aria-hidden="true"
                      className="
                        pointer-events-none
                        absolute
                        bottom-[2px]
                        left-1/2
                        h-[10px]
                        w-[72%]
                        -translate-x-1/2
                        rounded-[50%]
                        bg-[#0a1929]/18
                        blur-[5px]
                        transition-all
                        duration-500
                        group-hover:w-[64%]
                        group-hover:bg-[#0a1929]/12
                      "
                    />
                  </div>

                  {/* Label */}
                  <span
                    className="
                      relative
                      z-10
                      -mt-1
                      flex
                      h-10
                      w-full
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-primary/[0.08]
                      bg-primary
                      px-3
                      text-center
                      text-[12px]
                      font-black
                      text-white
                      shadow-[0_7px_18px_rgba(10,25,41,0.12)]
                      transition-all
                      duration-300
                      group-hover:-translate-y-1
                      group-hover:border-accent/15
                      group-hover:bg-[#193f63]
                      group-hover:shadow-[0_11px_24px_rgba(10,25,41,0.18)]
                      sm:h-[42px]
                      sm:text-[13px]
                      md:h-11
                      md:text-sm
                    "
                  >
                    {category.name}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}