'use client'

import Image from 'next/image'
import Link from 'next/link'

import {
  Camera,
  ChevronLeft,
  Phone,
  Search,
  X,
} from 'lucide-react'

import {
  useEffect,
  useRef,
} from 'react'

import {
  NAV_LINKS,
  SITE_NAME,
  TEL_PHONE,
} from '@/lib/constants'

interface MobileDrawerProps {
  open: boolean
  onClose: () => void
  pathname: string
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export default function MobileDrawer({
  open,
  onClose,
  pathname,
}: MobileDrawerProps) {
  const closeButtonRef =
    useRef<HTMLButtonElement | null>(
      null,
    )

  const previousFocusedElementRef =
    useRef<HTMLElement | null>(null)

  const isActive = (href: string) =>
    href === '/'
      ? pathname === '/'
      : pathname === href ||
        pathname.startsWith(`${href}/`)

  const isImageSearchPage =
    pathname === '/image-search' ||
    pathname.startsWith(
      '/image-search/',
    )

  useEffect(() => {
    if (!open) {
      return
    }

    previousFocusedElementRef.current =
      document.activeElement instanceof
      HTMLElement
        ? document.activeElement
        : null

    const focusTimer =
      window.setTimeout(() => {
        closeButtonRef.current?.focus()
      }, 0)

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab') {
        return
      }

      const drawer =
        document.getElementById(
          'mobile-navigation-drawer',
        )

      if (!drawer) {
        return
      }

      const focusableElements =
        Array.from(
          drawer.querySelectorAll<HTMLElement>(
            FOCUSABLE_SELECTOR,
          ),
        ).filter(
          (element) =>
            element.offsetParent !==
            null,
        )

      if (!focusableElements.length) {
        event.preventDefault()
        return
      }

      const first =
        focusableElements[0]

      const last =
        focusableElements[
          focusableElements.length - 1
        ]

      if (
        event.shiftKey &&
        document.activeElement ===
          first
      ) {
        event.preventDefault()
        last.focus()
        return
      }

      if (
        !event.shiftKey &&
        document.activeElement ===
          last
      ) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener(
      'keydown',
      handleKeyDown,
    )

    return () => {
      window.clearTimeout(
        focusTimer,
      )

      document.removeEventListener(
        'keydown',
        handleKeyDown,
      )

      const trigger =
        document.querySelector<HTMLButtonElement>(
          'header button[aria-expanded]',
        )

      if (trigger) {
        trigger.focus()
      } else {
        previousFocusedElementRef.current?.focus()
      }

      previousFocusedElementRef.current =
        null
    }
  }, [open, onClose])

  return (
    <div
      dir="rtl"
      className={[
        'fixed inset-0 z-[55] lg:hidden',
        open
          ? 'pointer-events-auto'
          : 'pointer-events-none',
      ].join(' ')}
      aria-hidden={!open}
      inert={!open ? true : undefined}
    >
      {/* Backdrop */}
      <button
        type="button"
        tabIndex={open ? 0 : -1}
        aria-label="بستن منو"
        onClick={onClose}
        className={[
          'absolute inset-0',
          'bg-[#081522]/35 backdrop-blur-[4px]',
          'transition-opacity duration-300',
          open
            ? 'opacity-100'
            : 'opacity-0',
        ].join(' ')}
      />

      {/* Drawer */}
      <aside
        id="mobile-navigation-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="منوی اصلی سرای‌سنگ"
        className={[
          'absolute right-2 top-2 bottom-2',
          'flex w-[calc(100%-16px)] max-w-[400px]',
          'flex-col overflow-hidden',
          'rounded-[25px]',
          'border border-[#E5E6E5]',
          'bg-[#FCFCFB]',
          'shadow-[0_24px_80px_rgba(8,21,34,0.24)]',
          'transition-transform duration-300',
          'ease-[cubic-bezier(.22,1,.36,1)]',
          open
            ? 'translate-x-0'
            : 'translate-x-[108%]',
        ].join(' ')}
      >
        {/* Header */}
        <div
          className="
            flex
            h-[72px]
            shrink-0
            items-center
            justify-between
            border-b
            border-[#E9E9E7]
            px-4
          "
        >
          <Link
            href="/"
            onClick={onClose}
            aria-label={SITE_NAME}
            className="
              relative
              h-9
              w-[104px]
              rounded-md
              outline-none
              focus-visible:ring-2
              focus-visible:ring-[#B79464]
              focus-visible:ring-offset-2
            "
          >
            <Image
              src="/logo.png"
              alt={SITE_NAME}
              fill
              sizes="104px"
              className="object-contain object-right"
            />
          </Link>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="بستن منو"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-[#DCDDDC]
              bg-white
              text-[#112F50]
              outline-none
              transition-all
              duration-200
              hover:border-[#B79464]/35
              hover:bg-[#F8F5EF]
              active:scale-95
              focus-visible:ring-2
              focus-visible:ring-[#B79464]
              focus-visible:ring-offset-2
            "
          >
            <X
              aria-hidden="true"
              className="h-[18px] w-[18px]"
              strokeWidth={1.8}
            />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {/* Text search */}
          <Link
            href="/search"
            onClick={onClose}
            className="
              group
              mb-3
              flex
              min-h-[54px]
              items-center
              gap-3
              rounded-[17px]
              border
              border-[#E5E0D7]
              bg-[#F6F2EB]
              px-3
              outline-none
              transition-all
              duration-200
              hover:border-[#B79464]/35
              hover:bg-[#F3EEE5]
              focus-visible:ring-2
              focus-visible:ring-[#B79464]
              focus-visible:ring-offset-2
            "
          >
            <span
              aria-hidden="true"
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-[11px]
                bg-white
                text-[#76582F]
                shadow-[0_3px_9px_rgba(10,25,41,0.05)]
                transition-transform
                duration-200
                group-hover:scale-105
              "
            >
              <Search
                className="h-[16px] w-[16px]"
                strokeWidth={1.8}
              />
            </span>

            <span className="text-[11px] font-bold text-[#556274]">
              جستجوی محصول، سنگ یا مقاله
            </span>
          </Link>

          {/* Image search CTA */}
          <Link
            href="/image-search"
            onClick={onClose}
            aria-current={
              isImageSearchPage
                ? 'page'
                : undefined
            }
            className={[
              `
                group
                mb-5
                flex
                min-h-[70px]
                items-center
                justify-between
                gap-3
                overflow-hidden
                rounded-[19px]
                border
                px-3.5
                outline-none
                transition-all
                duration-300
                focus-visible:ring-2
                focus-visible:ring-[#B79464]
                focus-visible:ring-offset-2
              `,
              isImageSearchPage
                ? `
                  border-[#B79464]
                  bg-[#112F50]
                  text-white
                  shadow-[0_12px_30px_rgba(17,47,80,0.18)]
                `
                : `
                  border-[#B79464]/25
                  bg-gradient-to-l
                  from-[#FBF4E8]
                  to-white
                  text-[#112F50]
                  shadow-[0_8px_24px_rgba(183,148,100,0.08)]
                  hover:-translate-y-0.5
                  hover:border-[#B79464]/45
                  hover:shadow-[0_12px_30px_rgba(183,148,100,0.12)]
                `,
            ].join(' ')}
          >
            <div className="flex min-w-0 items-center gap-3">
              <span
                aria-hidden="true"
                className={[
                  `
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-[14px]
                    transition-transform
                    duration-300
                    group-hover:scale-105
                  `,
                  isImageSearchPage
                    ? 'bg-[#B79464] text-[#112F50]'
                    : 'bg-[#B79464]/[0.14] text-[#9E7F50]',
                ].join(' ')}
              >
                <Camera
                  className="h-[20px] w-[20px]"
                  strokeWidth={1.9}
                />
              </span>

              <span className="min-w-0">
                <span
                  className={[
                    'block text-[12px] font-black',
                    isImageSearchPage
                      ? 'text-white'
                      : 'text-[#112F50]',
                  ].join(' ')}
                >
                  جستجوی تصویری سنگ
                </span>

                <span
                  className={[
                    'mt-1 block truncate text-[9px] font-medium',
                    isImageSearchPage
                      ? 'text-white/55'
                      : 'text-[#7A8490]',
                  ].join(' ')}
                >
                  سنگ مشابه را از روی عکس پیدا کن
                </span>
              </span>
            </div>

            <span
              aria-hidden="true"
              className={[
                `
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  transition-all
                  duration-200
                `,
                isImageSearchPage
                  ? 'bg-white/[0.08] text-[#D8BC8D]'
                  : 'bg-white text-[#9E7F50] shadow-[0_4px_12px_rgba(10,25,41,0.05)] group-hover:translate-x-0.5',
              ].join(' ')}
            >
              <ChevronLeft
                className="h-4 w-4"
                strokeWidth={1.8}
              />
            </span>
          </Link>

          {/* Navigation label */}
          <div
            className="
              mb-2.5
              flex
              items-center
              gap-2.5
              px-1
            "
            aria-hidden="true"
          >
            <span className="h-px flex-1 bg-gradient-to-l from-[#B79464]/35 to-transparent" />

            <span className="text-[9px] font-black tracking-[0.08em] text-[#76582F]">
              ناوبری
            </span>

            <span className="h-px flex-1 bg-gradient-to-r from-[#B79464]/35 to-transparent" />
          </div>

          {/* Navigation items */}
          <nav
            aria-label="منوی موبایل"
            className="space-y-1"
          >
            {NAV_LINKS.map((item) => {
              const active =
                isActive(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  aria-current={
                    active
                      ? 'page'
                      : undefined
                  }
                  className={[
                    'group flex min-h-[52px] items-center',
                    'justify-between rounded-[15px] px-3.5',
                    'outline-none transition-all duration-200',
                    'focus-visible:ring-2',
                    'focus-visible:ring-[#B79464]',
                    'focus-visible:ring-offset-2',
                    active
                      ? 'bg-[#112F50] text-white shadow-[0_8px_22px_rgba(17,47,80,0.13)]'
                      : 'text-[#1C3044] hover:bg-[#F5F2EC]',
                  ].join(' ')}
                >
                  <div className="flex items-center gap-2.5">
                    {active && (
                      <span
                        aria-hidden="true"
                        className="
                          h-1.5
                          w-1.5
                          rounded-full
                          bg-[#D8BC8D]
                        "
                      />
                    )}

                    <span className="text-[13px] font-bold">
                      {item.title}
                    </span>
                  </div>

                  <span
                    aria-hidden="true"
                    className={[
                      'flex h-8 w-8 items-center justify-center rounded-full',
                      'transition-all duration-200',
                      active
                        ? 'bg-white/[0.08] text-[#D8BC8D]'
                        : 'bg-[#F1EEE7] text-[#7B8490] group-hover:bg-white group-hover:text-[#76582F]',
                    ].join(' ')}
                  >
                    <ChevronLeft
                      className="h-4 w-4"
                      strokeWidth={1.7}
                    />
                  </span>
                </Link>
              )
            })}
          </nav>

          {/* Mini brand note */}
          <div
            className="
              mt-5
              rounded-[17px]
              border
              border-[#E7E4DE]
              bg-gradient-to-br
              from-white
              to-[#F8F5EF]
              p-3.5
            "
          >
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-[#B79464]
                "
              />

              <span
                aria-hidden="true"
                className="
                  text-[8px]
                  font-black
                  tracking-[0.18em]
                  text-[#76582F]
                "
              >
                SARAYE SANG
              </span>
            </div>

            <p className="mt-2 text-[10px] font-medium leading-6 text-[#667085]">
              انتخاب دقیق سنگ برای پروژه‌هایی با
              کیفیت و ماندگاری واقعی.
            </p>
          </div>
        </div>

        {/* Footer CTA */}
        <div
          className="
            shrink-0
            border-t
            border-[#E9E9E7]
            bg-white/80
            p-4
          "
        >
          <a
            href={`tel:${TEL_PHONE}`}
            aria-label="تماس با مشاوران"
            className="
              group
              flex
              min-h-[50px]
              items-center
              justify-between
              gap-3
              rounded-full
              bg-[#112F50]
              px-4
              text-white
              outline-none
              shadow-[0_8px_22px_rgba(17,47,80,0.13)]
              transition-all
              duration-300
              hover:bg-[#193F63]
              active:scale-[0.99]
              focus-visible:ring-2
              focus-visible:ring-[#B79464]
              focus-visible:ring-offset-2
              focus-visible:ring-offset-white
            "
          >
            <span className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  bg-white/[0.09]
                "
              >
                <Phone
                  className="h-4 w-4"
                  strokeWidth={1.8}
                />
              </span>

              <span className="text-[10px] font-black">
                تماس با مشاوران
              </span>
            </span>

            <span className="text-[9px] font-medium text-white/55">
              پاسخ‌گویی سریع
            </span>
          </a>
        </div>
      </aside>
    </div>
  )
}