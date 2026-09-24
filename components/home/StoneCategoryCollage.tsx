
import Image from 'next/image'
import Link from 'next/link'

import Container from '@/components/ui/container'

import { stoneCategories } from './data'

const items = [
  {
    href: '/categories/marble',
    title: 'مرمر',
    dataIndex: 0,
    tone: 'light',
  },
  {
    href: '/categories/granite',
    title: 'گرانیت',
    dataIndex: 1,
    tone: 'dark',
  },
  {
    href: '/categories/marmarite',
    title: 'مرمریت',
    dataIndex: 3,
    tone: 'dark',
  },
  {
    href: '/categories/crystal',
    title: 'کریستال',
    dataIndex: 2,
    tone: 'light',
  },
  {
    href: '/categories/travertine',
    title: 'تراورتن',
    dataIndex: 4,
    tone: 'light',
  },
] as const

export default function StoneCategoryCollage() {
  return (
    <section
      className="
        w-full
        bg-[#fcfcfb]
        py-6
        sm:py-8
        md:py-10
        lg:py-12
      "
    >
      <Container>
        <div
          className="
            grid
            min-w-0
            grid-cols-2
            gap-3
            sm:gap-4
            md:grid-cols-12
            md:grid-rows-[200px_200px]
            lg:grid-rows-[220px_220px]
            lg:gap-5
            xl:grid-rows-[235px_235px]
          "
        >
          {items.map((item, index) => {
            const stone =
              stoneCategories[item.dataIndex]

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={`مشاهده دسته‌بندی ${item.title}`}
                className={[
                  'group relative overflow-hidden',
                  'min-w-0 rounded-[20px]',
                  'border border-black/[0.04]',
                  'bg-[#e9e6df]',
                  'shadow-[0_8px_24px_rgba(17,47,80,0.05)]',
                  'transition-all duration-500',
                  'ease-[cubic-bezier(.22,1,.36,1)]',
                  'hover:-translate-y-1',
                  'hover:shadow-[0_15px_34px_rgba(17,47,80,0.10)]',
                  'sm:rounded-[22px]',
                  'md:rounded-[24px]',
                  index === 0
                    ? 'col-span-2 min-h-[260px] sm:min-h-[320px] md:col-span-4 md:row-span-2 md:min-h-0'
                    : index === 1
                      ? 'col-span-1 min-h-[180px] md:col-span-5 md:row-span-1 md:min-h-0'
                      : index === 2
                        ? 'col-span-1 min-h-[180px] md:col-span-3 md:row-span-1 md:min-h-0'
                        : index === 3
                          ? 'col-span-1 min-h-[180px] md:col-span-3 md:row-span-1 md:min-h-0'
                          : 'col-span-1 min-h-[180px] md:col-span-5 md:row-span-1 md:min-h-0',
                ].join(' ')}
              >
                {/* Image */}
                <Image
                  src={stone.image}
                  alt={item.title}
                  fill
                  sizes={
                    index === 0
                      ? '(max-width: 767px) 100vw, 34vw'
                      : '(max-width: 767px) 50vw, 42vw'
                  }
                  className="
                    object-cover
                    object-center
                    transition-transform
                    duration-1000
                    ease-[cubic-bezier(.22,1,.36,1)]
                    group-hover:scale-[1.045]
                  "
                />

                {/* Overall image depth */}
                <div
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/[0.08]
                    via-transparent
                    to-white/[0.02]
                    transition-opacity
                    duration-500
                    group-hover:opacity-90
                  "
                />

                {/* Bottom readability gradient */}
                <div
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute
                    inset-x-0
                    bottom-0
                    h-[42%]
                    bg-gradient-to-t
                    from-[#081522]/75
                    via-[#081522]/35
                    to-transparent
                    transition-all
                    duration-500
                    group-hover:h-[48%]
                    group-hover:from-[#081522]/82
                    group-hover:via-[#081522]/42
                  "
                />

                {/* Content */}
                <div
                  className="
                    absolute
                    inset-x-0
                    bottom-0
                    flex
                    items-end
                    justify-between
                    gap-3
                    p-3.5
                    sm:p-5
                  "
                >
                  {/* Title */}
                  <div className="min-w-0">
                    <h2
                      className="
                        text-[18px]
                        font-black
                        leading-tight
                        tracking-[-0.035em]
                        text-white
                        drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]
                        sm:text-[21px]
                        md:text-[24px]
                      "
                    >
                      {item.title}
                    </h2>

                    {/* Short gold accent */}
                    <span
                      aria-hidden="true"
                      className="
                        mt-2
                        block
                        h-[2px]
                        w-7
                        rounded-full
                        bg-[#D8BC8D]
                        opacity-90
                        transition-all
                        duration-400
                        group-hover:w-11
                      "
                    />
                  </div>

                  {/* Arrow */}
                  <span
                    className="
                      hidden
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/20
                      bg-black/15
                      text-white
                      backdrop-blur-md
                      transition-all
                      duration-300
                      group-hover:-translate-x-1
                      group-hover:border-[#D8BC8D]/45
                      group-hover:bg-[#B79464]
                      sm:flex
                    "
                    aria-hidden="true"
                  >
                    <span
                      className="
                        text-base
                        leading-none
                        transition-transform
                        duration-300
                        group-hover:-translate-x-0.5
                      "
                    >
                      ←
                    </span>
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

