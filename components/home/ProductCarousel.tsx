import Link from 'next/link'
import {
  ArrowLeft,
  Gem,
  Phone,
} from 'lucide-react'

import type { ProductSummary } from '@/types/wordpress'

import ProductShowcaseCard from './ProductShowcaseCard'

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
    ? 'چند انتخاب محبوب از میان محصولات سرای سنگ'
    : 'تازه‌ترین سنگ‌های اضافه‌شده به مجموعه'

  return (
    <section
      className={[
        'w-full overflow-hidden rounded-[30px]',
        'p-3 sm:p-4 md:p-5 lg:p-6',
        isNavy
          ? 'bg-[#112f50]'
          : 'bg-[#b79464]',
      ].join(' ')}
    >
      <div
        className="
          grid
          min-w-0
          items-stretch
          gap-5
          lg:grid-cols-[250px_minmax(0,1fr)]
          xl:grid-cols-[275px_minmax(0,1fr)]
          lg:gap-6
        "
      >
        {/* Feature panel */}
        <aside
          className="
            flex
            min-w-0
            flex-col
            justify-between
            px-1
            py-1
            sm:px-2
            sm:py-2
            lg:px-2
            lg:py-2
          "
          dir="rtl"
        >
          <div>
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
                className={[
                  'inline-flex items-center gap-2',
                  'rounded-full px-3 py-1.5',
                  'text-[10px] font-bold',
                  isNavy
                    ? 'bg-white/[0.07] text-white/65'
                    : 'bg-white/20 text-[#112f50]/70',
                ].join(' ')}
              >
                <Gem
                  className={[
                    'h-3.5 w-3.5',
                    isNavy
                      ? 'text-[#c6a87e]'
                      : 'text-[#112f50]',
                  ].join(' ')}
                  strokeWidth={1.7}
                />

                {isNavy
                  ? 'پرفروش‌ترین‌ها'
                  : 'تازه اضافه شده'}
              </span>
            </div>

            <h2
              className="
                text-[28px]
                font-black
                leading-[1.3]
                tracking-[-0.035em]
                sm:text-[34px]
                lg:text-[38px]
                xl:text-[40px]
              "
            >
              <span
                className={[
                  'block',
                  isNavy
                    ? 'text-[#c6a87e]'
                    : 'text-[#112f50]',
                ].join(' ')}
              >
                {title.split(' ')[0]}
              </span>

              <span className="mt-1 block text-white">
                {title.split(' ').slice(1).join(' ')}
              </span>
            </h2>

            <p
              className={[
                'mt-4 max-w-[230px]',
                'text-[12px] leading-7',
                isNavy
                  ? 'text-white/60'
                  : 'text-[#112f50]/65',
              ].join(' ')}
            >
              {description}
            </p>
          </div>

          <div className="mt-7 hidden lg:block">
            <div
              className={[
                'mb-4 h-px w-full',
                isNavy
                  ? 'bg-white/10'
                  : 'bg-[#112f50]/10',
              ].join(' ')}
            />

            <Link
              href="/products"
              className={[
                'group inline-flex items-center gap-2',
                'text-xs font-bold',
                isNavy
                  ? 'text-[#c6a87e]'
                  : 'text-[#112f50]',
              ].join(' ')}
            >
              مشاهده همه محصولات

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
        </aside>

        {/* Products */}
        <div className="min-w-0">
          <div
            className="
              flex
              min-w-0
              w-full
              snap-x
              snap-mandatory
              gap-3
              overflow-x-auto
              overscroll-x-contain
              px-0.5
              pb-1
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
              sm:gap-4
            "
            dir="rtl"
          >
            {products.map((product, index) => (
              <ProductShowcaseCard
                key={
                  product.id ||
                  product.slug ||
                  index
                }
                product={product}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile all products CTA */}
      <div className="mt-4 lg:hidden">
        <Link
          href="/products"
          className={[
            'group flex h-10 items-center justify-center gap-2',
            'rounded-full border text-xs font-bold',
            isNavy
              ? 'border-white/12 bg-white/[0.05] text-white/80'
              : 'border-[#112f50]/10 bg-white/10 text-[#112f50]',
          ].join(' ')}
        >
          مشاهده همه محصولات

          <ArrowLeft
            className="
              h-3.5
              w-3.5
              transition-transform
              duration-200
              group-hover:-translate-x-1
            "
            strokeWidth={1.8}
          />
        </Link>
      </div>
    </section>
  )
}