import Link from 'next/link'
import Image from 'next/image'

import Container from '@/components/ui/container'

import type { ProductCategoryNode } from '@/types/wordpress'

import StoneCategoryScaleClient from './StoneCategoryScaleClient'

interface StoneCategoryCarouselProps {
  categories: ProductCategoryNode[]
}

const LOOP_GROUPS = 4

const VISIBLE_CATEGORY_SLUGS = [
  'basalt',
  'crystal',
  'granite',
  'onyx',
  'marble',
] as const

export default function StoneCategoryCarousel({
  categories,
}: StoneCategoryCarouselProps) {
  const visibleCategories = VISIBLE_CATEGORY_SLUGS
    .map((slug) =>
      categories.find(
        (category) =>
          category.slug === slug,
      ),
    )
    .filter(
      (
        category,
      ): category is ProductCategoryNode =>
        Boolean(category),
    )

  if (!visibleCategories.length) {
    return null
  }

  const renderCategory = (
    category: ProductCategoryNode,
    index: number,
    groupIndex: number,
  ) => {
    const imageSrc =
      category.image?.sourceUrl ||
      '/images/home/product-placeholder.webp'

    return (
      <Link
        key={`${groupIndex}-${category.id}`}
        href={`/categories/${category.slug}`}
        dir="rtl"
        aria-label={`مشاهده دسته‌بندی ${category.name}`}
        data-stone-category-item="true"
        className="
          group
          flex
          w-[118px]
          shrink-0
          flex-col
          items-center
          outline-none
          sm:w-[132px]
          md:w-[148px]
          lg:w-[164px]
          xl:w-[180px]
        "
        style={{
          '--category-scale': '1',
        } as React.CSSProperties}
      >
        <div
          className="
            relative
            h-[132px]
            w-full
            sm:h-[148px]
            md:h-[166px]
            lg:h-[182px]
            xl:h-[196px]
          "
        >
          <div
            aria-hidden="true"
            className="
              absolute
              inset-x-[10%]
              top-[4%]
              bottom-[5%]
              rounded-[30%]
              bg-white
              opacity-0
              shadow-[0_14px_32px_rgba(10,25,41,0.05)]
              transition-all
              duration-500
              ease-out
              group-hover:scale-[1.02]
              group-hover:opacity-100
            "
          />

          <div
            aria-hidden="true"
            className="
              absolute
              inset-0
              z-10
              origin-center
              will-change-transform
            "
            style={{
              transform:
                'scale(var(--category-scale, 1))',
            }}
          >
            <Image
              src={imageSrc}
              alt=""
              fill
              draggable={false}
              sizes="
                (max-width: 639px) 118px,
                (max-width: 767px) 132px,
                (max-width: 1023px) 148px,
                (max-width: 1279px) 164px,
                180px
              "
              className="
                relative
                object-contain
                transition-transform
                duration-700
                ease-[cubic-bezier(.22,1,.36,1)]
                group-hover:-translate-y-1.5
                group-hover:scale-[1.04]
              "
            />
          </div>

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              bottom-0
              left-1/2
              z-0
              h-[7px]
              w-[52%]
              -translate-x-1/2
              rounded-[50%]
              bg-[#0a1929]/10
              blur-[5px]
              transition-all
              duration-500
              group-hover:w-[44%]
              group-hover:bg-[#0a1929]/7
            "
          />
        </div>

        <div className="mt-1 flex flex-col items-center">
          <span
            className="
              whitespace-nowrap
              text-[12px]
              font-black
              tracking-[-0.02em]
              text-primary
              transition-colors
              duration-300
              group-hover:text-[#76582f]
              sm:text-[13px]
              md:text-[14px]
            "
          >
            {category.name}
          </span>

          <span
            aria-hidden="true"
            className="
              mt-1.5
              h-[2px]
              w-0
              rounded-full
              bg-accent
              transition-all
              duration-300
              ease-out
              group-hover:w-6
              sm:mt-2
            "
          />
        </div>
      </Link>
    )
  }

  const renderCategoryGroup = (
    groupIndex: number,
  ) => (
    <div
      className="
        stone-category-group
        flex
        shrink-0
        items-start
        gap-3.5
        px-2
        sm:gap-5
        sm:px-2.5
        md:gap-6
        md:px-3
        lg:gap-7
        lg:px-3.5
        xl:gap-8
        xl:px-4
      "
    >
      {visibleCategories.map(
        (category, index) =>
          renderCategory(
            category,
            index,
            groupIndex,
          ),
      )}
    </div>
  )

  return (
    <section
      aria-label="دسته‌بندی سنگ‌ها"
      className="
        w-full
        overflow-hidden
        bg-[#fcfcfb]
        py-3
        sm:py-4
        md:py-5
        lg:py-6
      "
      dir="ltr"
    >
      <Container>
        <div
          className="
            mb-4
            text-center
            sm:mb-5
            md:mb-6
          "
          dir="rtl"
        >
          <div className="mb-1.5 flex items-center justify-center gap-2.5">
            <span
              aria-hidden="true"
              className="
                h-px
                w-7
                bg-gradient-to-r
                from-transparent
                to-accent/60
                sm:w-10
              "
            />

            <span
              aria-hidden="true"
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-accent
                shadow-[0_0_0_3px_rgba(183,148,100,0.07)]
              "
            />

            <span
              aria-hidden="true"
              className="
                h-px
                w-7
                bg-gradient-to-l
                from-transparent
                to-accent/60
                sm:w-10
              "
            />
          </div>

          <h2
            className="
              text-[22px]
              font-black
              leading-tight
              tracking-[-0.035em]
              text-primary
              sm:text-[26px]
              md:text-[30px]
            "
          >
            دسته‌بندی سنگ‌ها
          </h2>
        </div>

        <StoneCategoryScaleClient
          itemCount={visibleCategories.length}
        >
          <div
            className="
              relative
              w-full
              overflow-hidden
            "
            dir="ltr"
          >
            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                inset-y-0
                left-0
                z-30
                w-3
                bg-gradient-to-r
                from-[#fcfcfb]
                to-transparent
                sm:w-5
                md:w-6
              "
            />

            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                inset-y-0
                right-0
                z-30
                w-3
                bg-gradient-to-l
                from-[#fcfcfb]
                to-transparent
                sm:w-5
                md:w-6
              "
            />

            <div
              className="
                stone-category-marquee
                flex
                w-max
                items-start
                pl-1
                hover:[animation-play-state:paused]
                sm:pl-2
                md:pl-3
              "
            >
              {Array.from(
                { length: LOOP_GROUPS },
                (_, groupIndex) => (
                  <div
                    key={groupIndex}
                  >
                    {renderCategoryGroup(
                      groupIndex,
                    )}
                  </div>
                ),
              )}
            </div>
          </div>
        </StoneCategoryScaleClient>
      </Container>
    </section>
  )
}