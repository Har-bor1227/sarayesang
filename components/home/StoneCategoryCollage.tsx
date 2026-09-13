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
    <section className="w-full bg-[#fcfcfb] py-12 sm:py-14 md:py-18 lg:py-20">
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
            const stone = stoneCategories[item.dataIndex]

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  'group relative overflow-hidden',
                  'min-w-0 rounded-[20px]',
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
                    duration-700
                    ease-out
                    group-hover:scale-[1.045]
                  "
                />

                <div
                  aria-hidden="true"
                  className={[
                    'absolute inset-0 transition-all duration-500',
                    item.tone === 'dark'
                      ? 'bg-gradient-to-t from-[#0a1929]/42 via-[#0a1929]/8 to-transparent group-hover:from-[#0a1929]/52'
                      : 'bg-gradient-to-t from-[#0a1929]/18 via-transparent to-transparent group-hover:from-[#0a1929]/28',
                  ].join(' ')}
                />

                <div
                  className="
                    absolute inset-x-0 bottom-0
                    flex items-end justify-between
                    gap-3 p-4
                    sm:p-5
                  "
                >
                  <div className="min-w-0">
                    <span
                      className={[
                        'block text-[9px] font-bold tracking-[0.06em]',
                        item.tone === 'dark'
                          ? 'text-accent-light/90'
                          : 'text-accent-dark',
                      ].join(' ')}
                    >
                      COLLECTION
                    </span>

                    <h2
                      className={[
                        'mt-1 text-lg font-black tracking-[-0.02em]',
                        'sm:text-xl md:text-2xl',
                        item.tone === 'dark'
                          ? 'text-white'
                          : 'text-primary',
                      ].join(' ')}
                    >
                      {item.title}
                    </h2>
                  </div>

                  <span
                    className="
                      hidden
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/20
                      bg-white/10
                      text-white
                      backdrop-blur-md
                      transition-all
                      duration-300
                      group-hover:-translate-x-1
                      group-hover:border-accent/40
                      group-hover:bg-accent
                      sm:flex
                    "
                    aria-hidden="true"
                  >
                    ←
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