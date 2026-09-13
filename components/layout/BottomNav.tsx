'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  Home,
  Grid2X2,
  Search,
  Phone,
  BookOpen,
} from 'lucide-react'

import {
  BOTTOM_NAV_ITEMS,
  TEL_PHONE,
} from '@/lib/constants'

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'

import LiveSearch from '@/components/search/LiveSearch'

const icons = {
  home: Home,
  grid: Grid2X2,
  search: Search,
  phone: Phone,
  book: BookOpen,
} as const

export default function BottomNav() {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href.startsWith('tel:')) {
      return false
    }

    if (href === '/') {
      return pathname === '/'
    }

    return pathname.startsWith(href)
  }

  return (
    <nav
      className="
        pointer-events-none
        fixed
        inset-x-0
        bottom-0
        z-50
        px-3
        pb-[calc(9px+env(safe-area-inset-bottom))]
        pt-2
        md:hidden
      "
      aria-label="ناوبری موبایل"
    >
      <div
        className="
          pointer-events-auto
          mx-auto
          flex
          h-[70px]
          w-full
          max-w-[430px]
          items-center
          rounded-[24px]
          border
          border-[#e4e5e4]/90
          bg-[#fcfcfb]/[0.92]
          px-2
          shadow-[0_16px_45px_rgba(10,25,41,0.13),0_3px_12px_rgba(10,25,41,0.045)]
          backdrop-blur-2xl
          supports-[backdrop-filter]:bg-[#fcfcfb]/[0.76]
        "
      >
        <div
          className="
            flex
            h-full
            w-full
            items-stretch
            gap-1
          "
        >
          {BOTTOM_NAV_ITEMS.map((item) => {
            const active = isActive(item.href)

            /*
             * SEARCH
             */
            if (item.icon === 'search') {
              const Icon = icons.search

              return (
                <Sheet key={item.href}>
                  <SheetTrigger asChild>
                    <button
                      type="button"
                      className="
                        group
                        relative
                        flex
                        min-w-0
                        flex-1
                        flex-col
                        items-center
                        justify-center
                        rounded-[18px]
                        px-1
                        text-[10px]
                        font-semibold
                        text-[#7b838d]
                        transition-all
                        duration-200
                        active:scale-[0.94]
                      "
                      aria-label="جستجوی محصولات"
                    >
                      <span
                        className="
                          mb-0.5
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-[13px]
                          text-[#657180]
                          transition-all
                          duration-200
                          group-hover:bg-[#f3f0e9]
                          group-hover:text-primary
                          group-active:scale-95
                        "
                      >
                        <Icon
                          className="h-[20px] w-[20px]"
                          strokeWidth={1.85}
                          aria-hidden="true"
                        />
                      </span>

                      <span className="leading-none">
                        جستجو
                      </span>
                    </button>
                  </SheetTrigger>

                  <SheetContent
                    side="bottom"
                    className="
                      h-[82vh]
                      rounded-t-[32px]
                      border-0
                      bg-[#fcfcfb]
                      p-4
                      shadow-[0_-14px_55px_rgba(10,25,41,0.14)]
                      sm:p-6
                    "
                  >
                    <div className="mx-auto w-full max-w-xl">
                      <div className="mb-5">
                        <div
                          className="
                            mx-auto
                            mb-5
                            h-1.5
                            w-12
                            rounded-full
                            bg-[#dfe2e3]
                          "
                        />

                        <div className="mb-2 flex items-center gap-2">
                          <span
                            className="
                              flex
                              h-8
                              w-8
                              items-center
                              justify-center
                              rounded-full
                              bg-accent/[0.10]
                              text-accent-dark
                            "
                          >
                            <Search
                              className="h-4 w-4"
                              strokeWidth={1.8}
                            />
                          </span>

                          <span className="text-[10px] font-bold text-accent-dark">
                            جستجوی سرای سنگ
                          </span>
                        </div>

                        <h2
                          className="
                            text-xl
                            font-black
                            tracking-[-0.02em]
                            text-primary
                          "
                        >
                          جستجوی محصولات
                        </h2>

                        <p className="mt-1 text-sm leading-6 text-[#727b85]">
                          نام محصول، سنگ یا مقاله مورد نظر را وارد کنید.
                        </p>
                      </div>

                      <LiveSearch />
                    </div>
                  </SheetContent>
                </Sheet>
              )
            }

            /*
             * PHONE
             */
            if (item.href.startsWith('tel:')) {
              const Icon = icons.phone

              return (
                <a
                  key={item.href}
                  href={`tel:${TEL_PHONE}`}
                  className="
                    group
                    relative
                    flex
                    min-w-0
                    flex-1
                    flex-col
                    items-center
                    justify-center
                    rounded-[18px]
                    px-1
                    text-[10px]
                    font-semibold
                    text-[#7b838d]
                    transition-all
                    duration-200
                    active:scale-[0.94]
                  "
                  aria-label={item.title}
                >
                  <span
                    className="
                      mb-0.5
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-[13px]
                      transition-all
                      duration-200
                      group-hover:bg-accent/[0.09]
                      group-hover:text-accent-dark
                    "
                  >
                    <Icon
                      className="h-[20px] w-[20px]"
                      strokeWidth={1.85}
                      aria-hidden="true"
                    />
                  </span>

                  <span className="leading-none">
                    {item.title}
                  </span>
                </a>
              )
            }

            /*
             * NORMAL ITEMS
             */
            const Icon =
              icons[
                item.icon as keyof typeof icons
              ] || Home

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={
                  active ? 'page' : undefined
                }
                className={[
                  'group relative flex min-w-0 flex-1',
                  'flex-col items-center justify-center',
                  'rounded-[18px] px-1',
                  'text-[10px] font-semibold',
                  'transition-all duration-200',
                  'active:scale-[0.94]',
                  active
                    ? 'text-primary'
                    : 'text-[#7b838d] hover:text-primary',
                ].join(' ')}
              >
                <span
                  className={[
                    'relative mb-0.5 flex h-9 w-9',
                    'items-center justify-center rounded-[13px]',
                    'transition-all duration-200',
                    active
                      ? 'bg-accent/[0.10] text-accent-dark'
                      : 'group-hover:bg-[#f3f0e9]',
                  ].join(' ')}
                >
                  <Icon
                    className={[
                      'h-[20px] w-[20px]',
                      'transition-all duration-200',
                      active
                        ? 'scale-[1.05]'
                        : 'scale-100',
                    ].join(' ')}
                    strokeWidth={active ? 2.1 : 1.85}
                    aria-hidden="true"
                  />

                  {active && (
                    <span
                      className="
                        absolute
                        -bottom-1
                        left-1/2
                        h-1
                        w-1
                        -translate-x-1/2
                        rounded-full
                        bg-accent
                        shadow-[0_0_8px_rgba(183,148,100,0.6)]
                      "
                    />
                  )}
                </span>

                <span
                  className="
                    max-w-full
                    truncate
                    leading-none
                  "
                >
                  {item.title}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}