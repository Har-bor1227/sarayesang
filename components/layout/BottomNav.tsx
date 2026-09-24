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

  /*
   * خانه همیشه در مرکز قرار می‌گیرد،
   * بدون اینکه ترتیب اصلی BOTTOM_NAV_ITEMS را تغییر دهیم.
   */
  const homeItemIndex = BOTTOM_NAV_ITEMS.findIndex(
    (item) =>
      item.href === '/' ||
      item.icon === 'home',
  )

  const navigationItems =
    homeItemIndex >= 0
      ? [
          ...BOTTOM_NAV_ITEMS.filter(
            (_, index) => index !== homeItemIndex,
          ).slice(
            0,
            Math.floor(
              (BOTTOM_NAV_ITEMS.length - 1) / 2,
            ),
          ),
          BOTTOM_NAV_ITEMS[homeItemIndex],
          ...BOTTOM_NAV_ITEMS.filter(
            (_, index) => index !== homeItemIndex,
          ).slice(
            Math.floor(
              (BOTTOM_NAV_ITEMS.length - 1) / 2,
            ),
          ),
        ]
      : BOTTOM_NAV_ITEMS

  return (
    <nav
      className="
        pointer-events-none
        fixed
        inset-x-0
        bottom-0
        z-50
        px-3
        pb-[calc(8px+env(safe-area-inset-bottom))]
        pt-2
        md:hidden
      "
      aria-label="ناوبری موبایل"
    >
      <div
        className="
          pointer-events-auto
          relative
          mx-auto
          flex
          h-[72px]
          w-full
          max-w-[430px]
          items-center
          rounded-[24px]
          border
          border-[#E4E5E4]/90
          bg-[#FCFCFB]/[0.94]
          px-2
          shadow-[0_14px_42px_rgba(10,25,41,0.12),0_3px_12px_rgba(10,25,41,0.04)]
          backdrop-blur-2xl
          supports-[backdrop-filter]:bg-[#FCFCFB]/[0.78]
        "
      >
        {/* Very subtle inner highlight */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-x-5
            top-0
            h-px
            bg-gradient-to-r
            from-transparent
            via-[#B79464]/30
            to-transparent
          "
        />

        <div
          className="
            flex
            h-full
            w-full
            items-center
          "
        >
          {navigationItems.map((item) => {
            const active = isActive(item.href)
            const isHome =
              item.href === '/' ||
              item.icon === 'home'

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
                        text-[9px]
                        font-bold
                        text-[#667085]
                        transition-all
                        duration-200
                        active:scale-[0.94]
                      "
                      aria-label="جستجوی محصولات"
                    >
                      <span
                        aria-hidden="true"
                        className="
                          mb-0.5
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center
                          rounded-[13px]
                          transition-all
                          duration-200
                          group-hover:bg-[#F3F0E9]
                          group-hover:text-primary
                        "
                      >
                        <Icon
                          className="h-[19px] w-[19px]"
                          strokeWidth={1.8}
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
                      rounded-t-[30px]
                      border-0
                      bg-[#FCFCFB]
                      p-4
                      shadow-[0_-14px_55px_rgba(10,25,41,0.14)]
                      sm:p-6
                    "
                  >
                    <div className="mx-auto w-full max-w-xl">
                      <div className="mb-5">
                        <div
                          aria-hidden="true"
                          className="
                            mx-auto
                            mb-5
                            h-1.5
                            w-11
                            rounded-full
                            bg-[#D1D5DB]
                          "
                        />

                        <div className="mb-2 flex items-center gap-2">
                          <span
                            aria-hidden="true"
                            className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-full
                              bg-accent/[0.10]
                              text-[#76582F]
                            "
                          >
                            <Search
                              className="h-4 w-4"
                              strokeWidth={1.8}
                            />
                          </span>

                          <span className="text-[10px] font-bold text-[#76582F]">
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

                        <p className="mt-1 text-sm leading-6 text-[#475467]">
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
                    text-[9px]
                    font-bold
                    text-[#667085]
                    transition-all
                    duration-200
                    active:scale-[0.94]
                  "
                  aria-label={item.title}
                >
                  <span
                    aria-hidden="true"
                    className="
                      mb-0.5
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-[13px]
                      transition-all
                      duration-200
                      group-hover:bg-accent/[0.09]
                      group-hover:text-[#76582F]
                    "
                  >
                    <Icon
                      className="h-[19px] w-[19px]"
                      strokeWidth={1.8}
                    />
                  </span>

                  <span className="leading-none">
                    {item.title}
                  </span>
                </a>
              )
            }
/*
 * HOME
 */
if (isHome) {
  const Icon = icons.home

  return (
    <Link
      key={item.href}
      href="/"
      aria-current={active ? 'page' : undefined}
      aria-label="صفحه اصلی"
      className="
        group
        relative
        flex
        min-w-0
        flex-1
        self-stretch
        items-center
        justify-center
        px-1
        outline-none
      "
    >
      {/* Floating home button */}
      <span
        className={[
          `
            absolute
            bottom-[20px]
            flex
            h-[56px]
            w-[56px]
            items-center
            justify-center
            rounded-full
            border
            transition-all
            duration-300
            ease-[cubic-bezier(.22,1,.36,1)]
            group-hover:-translate-y-1
            group-active:scale-95
            group-focus-visible:ring-2
            group-focus-visible:ring-[#B79464]/60
            group-focus-visible:ring-offset-2
            group-focus-visible:ring-offset-[#FCFCFB]
          `,
          active
            ? `
              border-white/60
              bg-gradient-to-br
              from-[#D8BC8D]
              via-[#B79464]
              to-[#9E7B4F]
              text-[#112F50]
              shadow-[0_9px_24px_rgba(17,47,80,0.18),0_3px_10px_rgba(183,148,100,0.20)]
              group-hover:shadow-[0_12px_28px_rgba(17,47,80,0.22),0_4px_14px_rgba(183,148,100,0.24)]
            `
            : `
              border-[#DCE2E7]
              bg-white
              text-[#112F50]
              shadow-[0_7px_18px_rgba(17,47,80,0.10)]
              group-hover:border-[#C8D0D7]
              group-hover:bg-[#F9FAFA]
              group-hover:shadow-[0_10px_22px_rgba(17,47,80,0.14)]
            `,
        ].join(' ')}
      >
        {/* Active inner shine */}
        {active && (
          <span
            aria-hidden="true"
            className="
              absolute
              inset-[3px]
              rounded-full
              border
              border-white/20
              bg-gradient-to-br
              from-white/15
              via-transparent
              to-[#112F50]/[0.08]
            "
          />
        )}

        <Icon
          className="
            relative
            z-10
            h-[23px]
            w-[23px]
            transition-transform
            duration-300
            group-hover:scale-105
          "
          strokeWidth={active ? 2.35 : 2}
        />
      </span>

      {/* Home label */}
      <span
        className={[
          `
            absolute
            bottom-[6px]
            text-[9px]
            font-black
            leading-none
            transition-colors
            duration-200
          `,
          active
            ? 'text-[#112F50]'
            : 'text-[#667085] group-hover:text-[#112F50]',
        ].join(' ')}
      >
        خانه
      </span>

      {/* Active indicator */}
      {active && (
        <span
          aria-hidden="true"
          className="
            absolute
            bottom-[1px]
            left-1/2
            h-[3px]
            w-5
            -translate-x-1/2
            rounded-full
            bg-[#B79464]
          "
        />
      )}
    </Link>
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
                  'text-[9px] font-bold',
                  'transition-all duration-200',
                  'active:scale-[0.94]',
                  active
                    ? 'text-primary'
                    : 'text-[#667085] hover:text-primary',
                ].join(' ')}
              >
                <span
                  aria-hidden="true"
                  className={[
                    'relative mb-0.5 flex h-10 w-10',
                    'items-center justify-center rounded-[13px]',
                    'transition-all duration-200',
                    active
                      ? 'bg-accent/[0.10] text-[#76582F]'
                      : 'group-hover:bg-[#F3F0E9]',
                  ].join(' ')}
                >
                  <Icon
                    className="h-[19px] w-[19px]"
                    strokeWidth={
                      active ? 2.05 : 1.8
                    }
                  />
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