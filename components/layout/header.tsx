'use client'

import Image from 'next/image'
import Link from 'next/link'

import {
  Camera,
  Menu,
  Phone,
  Search,
  X,
} from 'lucide-react'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

import {
  NAV_LINKS,
  SITE_NAME,
  TEL_PHONE,
} from '@/lib/constants'

import DesktopNav from '../header/DesktopNav'
import HeaderSearch from '../header/HeaderSearch'
import MobileDrawer from '../header/MobileDrawer'

export default function Header() {
  const pathname = usePathname()

  const [menuOpen, setMenuOpen] =
    useState(false)

  const [hidden, setHidden] =
    useState(false)

  const [isMobile, setIsMobile] =
    useState(false)

  const isImageSearchPage =
    pathname === '/image-search' ||
    pathname.startsWith('/image-search/')

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    const mediaQuery =
      window.matchMedia(
        '(max-width: 1023px)',
      )

    const handleChange = () => {
      const mobile =
        mediaQuery.matches

      setIsMobile(mobile)

      if (!mobile) {
        setHidden(false)
      }
    }

    handleChange()

    mediaQuery.addEventListener(
      'change',
      handleChange,
    )

    return () => {
      mediaQuery.removeEventListener(
        'change',
        handleChange,
      )
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow =
      menuOpen && isMobile
        ? 'hidden'
        : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen, isMobile])

  useEffect(() => {
    if (!isMobile) {
      setHidden(false)
      return
    }

    let previousScrollY =
      window.scrollY

    const handleScroll = () => {
      const currentScrollY =
        window.scrollY

      if (menuOpen) {
        setHidden(false)
      } else if (
        currentScrollY <= 20
      ) {
        setHidden(false)
      } else if (
        currentScrollY >
        previousScrollY + 5
      ) {
        setHidden(true)
      } else if (
        currentScrollY <
        previousScrollY - 5
      ) {
        setHidden(false)
      }

      previousScrollY =
        currentScrollY
    }

    window.addEventListener(
      'scroll',
      handleScroll,
      { passive: true },
    )

    return () => {
      window.removeEventListener(
        'scroll',
        handleScroll,
      )
    }
  }, [isMobile, menuOpen])

  const shouldHide =
    (isMobile && hidden) ||
    menuOpen

  return (
    <>
      <header
        dir="rtl"
        className={[
          'sticky inset-x-0 top-0 z-[50]',
          'px-3 pt-3 pb-2',
          'sm:px-4 sm:pt-4 sm:pb-2.5',
          'lg:px-6 lg:pt-4 lg:pb-3',
          'transition-transform duration-300 ease-out',
          shouldHide
            ? '-translate-y-[115%]'
            : 'translate-y-0',
        ].join(' ')}
      >
        <div
          className="
            relative
            mx-auto
            flex
            h-[58px]
            w-full
            max-w-[1440px]
            items-center
            rounded-[19px]
            border
            border-[#E7E8E7]
            bg-[#FCFCFB]/[0.94]
            px-2
            shadow-[0_8px_30px_rgba(10,25,41,0.06)]
            backdrop-blur-2xl
            supports-[backdrop-filter]:bg-[#FCFCFB]/[0.80]
            sm:h-[62px]
            sm:px-2.5
            lg:h-[70px]
            lg:rounded-[22px]
            lg:px-3
          "
        >
          {/* Top highlight */}
          <span
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-x-8
              top-0
              h-px
              bg-gradient-to-r
              from-transparent
              via-[#B79464]/35
              to-transparent
              lg:inset-x-12
            "
          />

          {/* Logo */}
          <Link
            href="/"
            aria-label={SITE_NAME}
            className="
              absolute
              right-2.5
              top-1/2
              h-8
              w-[94px]
              -translate-y-1/2
              transition-transform
              duration-200
              hover:scale-[1.015]
              sm:right-3
              sm:h-9
              sm:w-[104px]
              lg:static
              lg:h-10
              lg:w-[118px]
              lg:shrink-0
              lg:translate-y-0
            "
          >
            <Image
              src="/logo.png"
              alt={SITE_NAME}
              fill
              priority
              sizes="118px"
              className="object-contain object-right"
            />
          </Link>

          {/* Desktop center navigation */}
          <div
            className="
              hidden
              min-w-0
              flex-1
              items-center
              justify-center
              px-4
              lg:flex
            "
          >
            <DesktopNav
              links={NAV_LINKS}
              pathname={pathname}
            />
          </div>

          {/* Desktop actions */}
          <div
            dir="ltr"
            className="
              ml-2
              hidden
              shrink-0
              items-center
              gap-2
              lg:flex
            "
          >
            {/* Image search CTA */}
            <Link
              href="/image-search"
              aria-current={
                isImageSearchPage
                  ? 'page'
                  : undefined
              }
              aria-label="جستجوی تصویری سنگ"
              className={[
                `
                  group
                  relative
                  flex
                  h-11
                  shrink-0
                  items-center
                  justify-center
                  gap-2
                  overflow-hidden
                  rounded-full
                  border
                  px-4
                  text-[10px]
                  font-black
                  transition-all
                  duration-300
                  active:scale-[0.98]
                `,
                isImageSearchPage
                  ? `
                    border-[#B79464]
                    bg-[#B79464]
                    text-[#112F50]
                    shadow-[0_8px_22px_rgba(183,148,100,0.20)]
                  `
                  : `
                    border-[#B79464]/35
                    bg-[#FBF6ED]
                    text-[#76582F]
                    shadow-[0_6px_18px_rgba(183,148,100,0.08)]
                    hover:-translate-y-0.5
                    hover:border-[#B79464]/60
                    hover:bg-[#F7F0E4]
                    hover:shadow-[0_9px_24px_rgba(183,148,100,0.13)]
                  `,
              ].join(' ')}
            >
              <span
                aria-hidden="true"
                className="
                  flex
                  h-7
                  w-7
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-white/80
                  text-[#9E7F50]
                  transition-transform
                  duration-300
                  group-hover:scale-105
                "
              >
                <Camera
                  className="h-[15px] w-[15px]"
                  strokeWidth={2}
                />
              </span>

              <span className="whitespace-nowrap">
                جستجوی تصویری
              </span>

              <span
                aria-hidden="true"
                className="
                  absolute
                  inset-y-0
                  left-0
                  w-8
                  translate-x-[-140%]
                  skew-x-[-18deg]
                  bg-white/20
                  transition-transform
                  duration-700
                  group-hover:translate-x-[420%]
                "
              />
            </Link>

            <div dir="rtl">
              <HeaderSearch />
            </div>

            <a
              href={`tel:${TEL_PHONE}`}
              aria-label="تماس با ما"
              className="
                group
                flex
                h-11
                min-w-[116px]
                shrink-0
                items-center
                justify-center
                gap-2
                rounded-full
                bg-[#112F50]
                px-4
                text-[11px]
                font-black
                text-white
                shadow-[0_7px_18px_rgba(17,47,80,0.11)]
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-[#193F63]
                hover:shadow-[0_10px_23px_rgba(17,47,80,0.15)]
                active:translate-y-0
              "
            >
              <span
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-full
                  bg-white/[0.09]
                "
              >
                <Phone
                  className="
                    h-[15px]
                    w-[15px]
                    transition-transform
                    duration-300
                    group-hover:scale-110
                  "
                  strokeWidth={1.8}
                />
              </span>

              تماس با ما
            </a>
          </div>

          {/* Mobile actions */}
          <div
            dir="ltr"
            className="
              absolute
              left-2.5
              top-1/2
              flex
              -translate-y-1/2
              items-center
              gap-1.5
              sm:left-3
              lg:hidden
            "
          >
            {/* Menu */}
            <button
              type="button"
              aria-label={
                menuOpen
                  ? 'بستن منو'
                  : 'باز کردن منو'
              }
              aria-expanded={menuOpen}
              onClick={() =>
                setMenuOpen(
                  (value) => !value,
                )
              }
              className={[
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                'border transition-all duration-200 active:scale-95',
                menuOpen
                  ? 'border-[#112F50] bg-[#112F50] text-white shadow-[0_5px_14px_rgba(17,47,80,0.12)]'
                  : 'border-[#DADDDC] bg-white text-[#112F50] hover:border-[#B79464]/40 hover:bg-[#FAF8F4]',
              ].join(' ')}
            >
              {menuOpen ? (
                <X
                  className="h-[18px] w-[18px]"
                  strokeWidth={1.8}
                />
              ) : (
                <Menu
                  className="h-[18px] w-[18px]"
                  strokeWidth={1.8}
                />
              )}
            </button>

            {/* Phone */}
            <a
              href={`tel:${TEL_PHONE}`}
              aria-label="تماس"
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-[#112F50]
                text-white
                shadow-[0_5px_13px_rgba(17,47,80,0.10)]
                transition-all
                duration-200
                active:scale-95
              "
            >
              <Phone
                className="h-[16px] w-[16px]"
                strokeWidth={1.8}
              />
            </a>

            {/* Search */}
            <Link
              href="/search"
              aria-label="جستجو"
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                border
                border-[#E5E0D7]
                bg-[#F6F2EB]
                text-[#112F50]
                transition-all
                duration-200
                active:scale-95
              "
            >
              <Search
                className="h-[17px] w-[17px]"
                strokeWidth={1.8}
              />
            </Link>
          </div>
        </div>
      </header>

      <MobileDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        pathname={pathname}
      />
    </>
  )
}