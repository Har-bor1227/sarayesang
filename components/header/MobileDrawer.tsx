import Image from 'next/image'
import Link from 'next/link'
import {
  ChevronLeft,
  Phone,
  Search,
  X,
} from 'lucide-react'

import {
  NAV_LINKS,
  SITE_NAME,
  TEL_PHONE,
} from '@/lib/constants'

type Props = {
  open: boolean
  onClose: () => void
  pathname: string
}

export default function MobileDrawer({
  open,
  onClose,
  pathname,
}: Props) {
  const isActive = (href: string) =>
    href === '/'
      ? pathname === '/'
      : pathname === href ||
        pathname.startsWith(`${href}/`)

  return (
    <div
      className={[
        'fixed inset-0 z-[55] lg:hidden',
        open
          ? 'pointer-events-auto'
          : 'pointer-events-none',
      ].join(' ')}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="بستن منو"
        onClick={onClose}
        className={[
          'absolute inset-0',
          'bg-[#0a1929]/28',
          'backdrop-blur-[5px]',
          'transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
      />

      {/* Panel */}
      <aside
        dir="rtl"
        aria-hidden={!open}
        className={[
          'absolute right-2 top-2 bottom-2',
          'flex w-[calc(100%-16px)] max-w-[390px]',
          'flex-col overflow-hidden',
          'rounded-[28px]',
          'border border-[#e9ecef]',
          'bg-[#fcfcfb]',
          'shadow-[0_24px_80px_rgba(10,25,41,0.22)]',
          'transition-transform duration-300',
          'ease-[cubic-bezier(.22,1,.36,1)]',
          open
            ? 'translate-x-0'
            : 'translate-x-[110%]',
        ].join(' ')}
      >
        {/* Panel Header */}
        <div
          className={[
            'flex h-[74px] shrink-0 items-center',
            'justify-between',
            'border-b border-[#e9ecef]',
            'px-5',
          ].join(' ')}
        >
          <Link
            href="/"
            onClick={onClose}
            aria-label={SITE_NAME}
            className="relative h-10 w-[110px]"
          >
            <Image
              src="/logo.png"
              alt={SITE_NAME}
              fill
              sizes="110px"
              className="object-contain object-right"
            />
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className={[
              'flex h-10 w-10 items-center justify-center',
              'rounded-full',
              'border border-[#e5e0d7]',
              'bg-white text-primary',
              'transition-all duration-200',
              'hover:border-accent/40 hover:bg-accent/[0.04]',
              'active:scale-95',
            ].join(' ')}
          >
            <X className="h-5 w-5" strokeWidth={1.8} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {/* Search */}
          <Link
            href="/search"
            onClick={onClose}
            className={[
              'mb-7 flex h-12 items-center gap-3',
              'rounded-2xl',
              'border border-[#e9ecef]',
              'bg-[#f5f2ec]',
              'px-4',
              'text-sm font-semibold',
              'text-[#667085]',
              'transition-all duration-200',
              'hover:border-accent/30',
              'hover:bg-[#f1ede5]',
            ].join(' ')}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-accent shadow-[0_2px_8px_rgba(10,25,41,0.05)]">
              <Search
                className="h-[16px] w-[16px]"
                strokeWidth={1.9}
              />
            </span>

            <span>جستجوی محصول، سنگ یا مقاله...</span>
          </Link>

          {/* Section label */}
          <div className="mb-3 flex items-center gap-3 px-1">
            <span className="h-px flex-1 bg-gradient-to-l from-accent/30 to-transparent" />
            <span className="text-[11px] font-bold tracking-wide text-accent">
              ناوبری
            </span>
            <span className="h-px flex-1 bg-gradient-to-r from-accent/30 to-transparent" />
          </div>

          {/* Navigation */}
          <nav
            aria-label="منوی موبایل"
            className="space-y-1.5"
          >
            {NAV_LINKS.map((item) => {
              const active = isActive(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  aria-current={active ? 'page' : undefined}
                  className={[
                    'group flex min-h-[54px] items-center justify-between',
                    'rounded-2xl px-4',
                    'text-[15px] font-bold',
                    'transition-all duration-200',
                    active
                      ? 'bg-primary text-white shadow-[0_8px_22px_rgba(17,47,80,0.14)]'
                      : 'text-[#1d2d40] hover:bg-[#f5f2ec] hover:text-primary',
                  ].join(' ')}
                >
                  <span>{item.title}</span>

                  <span
                    className={[
                      'flex h-7 w-7 items-center justify-center rounded-full',
                      'transition-all duration-200',
                      active
                        ? 'bg-white/10'
                        : 'bg-[#f2eee7] group-hover:bg-white',
                    ].join(' ')}
                  >
                    <ChevronLeft
                      className={[
                        'h-4 w-4',
                        active
                          ? 'text-accent-light'
                          : 'text-[#98a2b3]',
                      ].join(' ')}
                    />
                  </span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Footer CTA */}
        <div
          className={[
            'shrink-0',
            'border-t border-[#e9ecef]',
            'bg-white/70',
            'p-5',
          ].join(' ')}
        >
          <a
            href={`tel:${TEL_PHONE}`}
            className={[
              'flex h-12 items-center justify-center gap-2',
              'rounded-full',
              'bg-primary text-sm font-bold text-white',
              'shadow-[0_7px_20px_rgba(17,47,80,0.14)]',
              'transition-all duration-200',
              'hover:-translate-y-px hover:bg-primary-light',
              'active:translate-y-0',
            ].join(' ')}
          >
            <Phone
              className="h-4 w-4"
              strokeWidth={1.9}
            />

            تماس با مشاوران
          </a>
        </div>
      </aside>
    </div>
  )
}