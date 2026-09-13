'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Menu, Phone, Search, X } from 'lucide-react'
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

  const [menuOpen, setMenuOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1023px)')

    const updateViewport = () => {
      const mobile = mediaQuery.matches

      setIsMobile(mobile)

      if (!mobile) {
        setHidden(false)
      }
    }

    updateViewport()

    mediaQuery.addEventListener('change', updateViewport)

    return () => {
      mediaQuery.removeEventListener('change', updateViewport)
    }
  }, [])

  useEffect(() => {
    if (menuOpen && isMobile) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen, isMobile])

  useEffect(() => {
    if (!isMobile) {
      setHidden(false)
      return
    }

    let previous = window.scrollY

    const onScroll = () => {
      const current = window.scrollY

      if (menuOpen) {
        setHidden(false)
      } else if (current <= 24) {
        setHidden(false)
      } else if (current > previous + 4) {
        setHidden(true)
      } else if (current < previous - 4) {
        setHidden(false)
      }

      previous = current
    }

    window.addEventListener('scroll', onScroll, {
      passive: true,
    })

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [isMobile, menuOpen])

  const shouldHide = isMobile && hidden && !menuOpen

  return (
    <>
      <header
        dir="rtl"
        className={[
          'fixed inset-x-0 top-0 z-[60]',
          'px-3 pt-3 sm:px-4 sm:pt-4 lg:px-6 lg:pt-5',
          'transition-transform duration-300 ease-out',
          shouldHide
            ? '-translate-y-[120%]'
            : 'translate-y-0',
        ].join(' ')}
      >
        <div
          className={[
            'mx-auto flex w-full max-w-[1440px] items-center',
            'h-[60px] sm:h-[64px] lg:h-[70px]',
            'rounded-[20px] lg:rounded-[23px]',
            'border border-[#e9ecef]/80',
            'bg-[#fcfcfb]/[0.94]',
            'px-2.5 sm:px-3 lg:px-4',
            'shadow-[0_10px_35px_rgba(10,25,41,0.07),0_2px_8px_rgba(10,25,41,0.03)]',
            'backdrop-blur-2xl',
            'supports-[backdrop-filter]:bg-[#fcfcfb]/[0.78]',
          ].join(' ')}
        >
          {/* Logo */}
          <Link
            href="/"
            aria-label={SITE_NAME}
            className={[
              'relative shrink-0',
              'h-9 w-[102px]',
              'sm:h-10 sm:w-[110px]',
              'lg:h-11 lg:w-[126px]',
              'transition-transform duration-200',
              'hover:scale-[1.015]',
            ].join(' ')}
          >
            <Image
              src="/logo.png"
              alt={SITE_NAME}
              fill
              priority
              sizes="126px"
              className="object-contain object-right"
            />
          </Link>

          {/* Desktop navigation */}
          <DesktopNav
            links={NAV_LINKS}
            pathname={pathname}
          />

          {/* Desktop actions */}
          <div className="mr-auto hidden items-center gap-2 lg:flex">
            <HeaderSearch />

            <a
              href={`tel:${TEL_PHONE}`}
              aria-label="تماس با ما"
              className={[
                'group flex h-11 w-11 shrink-0 items-center justify-center',
                'rounded-full',
                'bg-primary text-white',
                'shadow-[0_6px_18px_rgba(17,47,80,0.14)]',
                'transition-all duration-200',
                'hover:-translate-y-0.5 hover:bg-primary-light',
                'hover:shadow-[0_9px_22px_rgba(17,47,80,0.17)]',
                'active:translate-y-0',
              ].join(' ')}
            >
              <Phone
                className="h-[18px] w-[18px] transition-transform duration-200 group-hover:scale-105"
                strokeWidth={1.8}
              />
            </a>
          </div>

          {/* Mobile actions */}
          <div className="mr-auto flex items-center gap-1.5 lg:hidden">
            <Link
              href="/search"
              aria-label="جستجو"
              className={[
                'flex h-10 w-10 items-center justify-center',
                'rounded-full',
                'border border-transparent',
                'bg-[#f4efe7]',
                'text-primary',
                'transition-all duration-200',
                'active:scale-95',
              ].join(' ')}
            >
              <Search
                className="h-[18px] w-[18px]"
                strokeWidth={1.9}
              />
            </Link>

            <a
              href={`tel:${TEL_PHONE}`}
              aria-label="تماس"
              className={[
                'flex h-10 w-10 items-center justify-center',
                'rounded-full',
                'bg-primary text-white',
                'shadow-[0_4px_12px_rgba(17,47,80,0.12)]',
                'transition-all duration-200',
                'active:scale-95',
              ].join(' ')}
            >
              <Phone
                className="h-[17px] w-[17px]"
                strokeWidth={1.9}
              />
            </a>

            <button
              type="button"
              aria-label={menuOpen ? 'بستن منو' : 'باز کردن منو'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((value) => !value)}
              className={[
                'flex h-10 w-10 items-center justify-center',
                'rounded-full border',
                'transition-all duration-200',
                'active:scale-95',
                menuOpen
                  ? 'border-primary bg-primary text-white shadow-[0_4px_12px_rgba(17,47,80,0.12)]'
                  : 'border-[#e5e0d7] bg-white text-primary hover:border-accent/40 hover:bg-accent/[0.04]',
              ].join(' ')}
            >
              {menuOpen ? (
                <X
                  className="h-[19px] w-[19px]"
                  strokeWidth={1.8}
                />
              ) : (
                <Menu
                  className="h-[19px] w-[19px]"
                  strokeWidth={1.8}
                />
              )}
            </button>
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