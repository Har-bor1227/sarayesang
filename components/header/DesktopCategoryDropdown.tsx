'use client'

import Link from 'next/link'

import {
  Check,
  ChevronLeft,
  ChevronDown,
  Layers3,
} from 'lucide-react'

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import type {
  ProductCategoryNode,
} from '@/types/wordpress'

interface DesktopCategoryDropdownProps {
  title: string
  pathname: string
  categories: ProductCategoryNode[]
}

export default function DesktopCategoryDropdown({
  title,
  pathname,
  categories,
}: DesktopCategoryDropdownProps) {
  const [open, setOpen] =
    useState(false)

  const rootCategories =
    useMemo(
      () =>
        categories.filter(
          (category) =>
            !category.parentId ||
            category.parentId === '0',
        ),
      [categories],
    )

  const [activeParentId, setActiveParentId] =
    useState<string | null>(
      rootCategories[0]?.id ?? null,
    )

  const closeTimer =
    useRef<ReturnType<
      typeof setTimeout
    > | null>(null)

  const containerRef =
    useRef<HTMLDivElement | null>(null)

  const activeParent =
    rootCategories.find(
      (category) =>
        category.id ===
        activeParentId,
    ) ??
    rootCategories[0] ??
    null

  const children =
    activeParent
      ? categories.filter(
          (category) =>
            category.parentId ===
            activeParent.id,
        )
      : []

  const isCategoriesActive =
    pathname === '/categories' ||
    pathname.startsWith(
      '/categories/',
    )

  const clearCloseTimer = () => {
    if (
      closeTimer.current
    ) {
      clearTimeout(
        closeTimer.current,
      )

      closeTimer.current = null
    }
  }

  const openMenu = () => {
    clearCloseTimer()

    if (!activeParentId) {
      setActiveParentId(
        rootCategories[0]?.id ??
          null,
      )
    }

    setOpen(true)
  }

  const scheduleClose = () => {
    clearCloseTimer()

    closeTimer.current =
      setTimeout(() => {
        setOpen(false)
      }, 120)
  }

  const toggleMenu = () => {
    clearCloseTimer()

    setOpen(
      (current) => !current,
    )
  }

  useEffect(() => {
    return () => {
      clearCloseTimer()
    }
  }, [])

  useEffect(() => {
    if (!open) {
      return
    }

    const handlePointerDown =
      (event: PointerEvent) => {
        const target =
          event.target

        if (
          target instanceof Node &&
          containerRef.current?.contains(
            target,
          )
        ) {
          return
        }

        setOpen(false)
      }

    const handleKeyDown =
      (event: KeyboardEvent) => {
        if (
          event.key ===
          'Escape'
        ) {
          setOpen(false)
        }
      }

    document.addEventListener(
      'pointerdown',
      handlePointerDown,
    )

    document.addEventListener(
      'keydown',
      handleKeyDown,
    )

    return () => {
      document.removeEventListener(
        'pointerdown',
        handlePointerDown,
      )

      document.removeEventListener(
        'keydown',
        handleKeyDown,
      )
    }
  }, [open])

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      {/* Trigger */}
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="desktop-category-dropdown"
        onClick={toggleMenu}
        onFocus={openMenu}
        className={[
          'group relative flex h-11 items-center gap-1.5',
          'rounded-[13px] px-3.5 xl:px-4',
          'whitespace-nowrap',
          'text-[12px] xl:text-[13px]',
          'font-bold tracking-[-0.015em]',
          'transition-all duration-200',
          isCategoriesActive ||
          open
            ? 'bg-[#F5F1E9] text-[#112F50]'
            : 'text-[#667085] hover:bg-[#F8F7F4] hover:text-[#112F50]',
        ].join(' ')}
      >
        <span>
          {title}
        </span>

        <ChevronDown
          className={[
            'h-3.5 w-3.5',
            'transition-transform duration-300',
            open
              ? 'rotate-180 text-[#B79464]'
              : 'text-[#98A2B3] group-hover:text-[#B79464]',
          ].join(' ')}
          strokeWidth={2}
        />

        <span
          aria-hidden="true"
          className={[
            'absolute bottom-[5px] left-1/2',
            '-translate-x-1/2',
            'h-[2px] rounded-full',
            'bg-[#B79464]',
            'transition-all duration-200',
            isCategoriesActive
              ? 'w-5 opacity-100'
              : 'w-0 opacity-0 group-hover:w-4 group-hover:opacity-100',
          ].join(' ')}
        />
      </button>

      {/* Dropdown */}
<div
  id="desktop-category-dropdown"
  role="menu"
  aria-hidden={!open}
  className={[
    'absolute right-0 top-[calc(100%+10px)]',
    'z-[200]',
    'w-[min(820px,calc(100vw-48px))]',
    'origin-top-right',
    'transition-all duration-200',
    'ease-[cubic-bezier(.22,1,.36,1)]',
    open
      ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
      : 'pointer-events-none -translate-y-2 scale-[0.985] opacity-0',
  ].join(' ')}
>
        {/* Floating shadow layer */}
        <div
          aria-hidden="true"
          className="
            absolute
            -inset-1
            rounded-[30px]
            bg-[#B79464]/[0.07]
            blur-2xl
          "
        />

        <div
          dir="rtl"
          className="
            relative
            overflow-hidden
            rounded-[26px]
            border
            border-white/80
            bg-[#FCFCFB]/[0.90]
            shadow-[0_24px_70px_rgba(10,25,41,0.14),0_8px_24px_rgba(183,148,100,0.08),inset_0_1px_0_rgba(255,255,255,0.96)]
            backdrop-blur-2xl
          "
        >
          {/* Top glass highlight */}
          <span
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-x-12
              top-0
              h-px
              bg-gradient-to-r
              from-transparent
              via-[#B79464]/45
              to-transparent
            "
          />

          {/* Header */}
          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-[#112F50]/[0.06]
              px-5
              py-4
            "
          >
            <div className="flex items-center gap-3">
              <span
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-[12px]
                  border
                  border-[#B79464]/20
                  bg-[#F5F1E9]
                  text-[#9E7F50]
                "
              >
                <Layers3
                  className="h-4 w-4"
                  strokeWidth={1.8}
                />
              </span>

              <div className="leading-none">
                <span
                  className="
                    block
                    text-[8px]
                    font-black
                    uppercase
                    tracking-[0.16em]
                    text-[#B79464]
                  "
                >
                  Categories
                </span>

                <span
                  className="
                    mt-1.5
                    block
                    text-[12px]
                    font-black
                    text-[#112F50]
                  "
                >
                  دسته‌بندی سنگ‌ها
                </span>
              </div>
            </div>

            <Link
              href="/categories"
              onClick={() =>
                setOpen(false)
              }
              className="
                rounded-full
                border
                border-[#112F50]/[0.07]
                bg-white/70
                px-3
                py-2
                text-[9px]
                font-black
                text-[#667085]
                transition-all
                duration-200
                hover:border-[#B79464]/30
                hover:bg-[#F8F3EA]
                hover:text-[#76582F]
              "
            >
              مشاهده همه
            </Link>
          </div>

          <div
            className="
              grid
              grid-cols-[220px_minmax(0,1fr)]
              min-h-[280px]
            "
          >
            {/* Parents */}
            <div
              className="
                border-l
                border-[#112F50]/[0.06]
                bg-[#F7F5F0]/55
                p-3
              "
            >
              <div className="px-2 pb-2 pt-1">
                <span
                  className="
                    text-[8px]
                    font-black
                    tracking-[0.08em]
                    text-[#98A2B3]
                  "
                >
                  دسته‌بندی‌های اصلی
                </span>
              </div>

              <div
                className="
                  space-y-1
                "
              >
                {rootCategories.length >
                0 ? (
                  rootCategories.map(
                    (parent) => {
                      const selected =
                        parent.id ===
                        activeParent?.id

                      const childCount =
                        categories.filter(
                          (category) =>
                            category.parentId ===
                            parent.id,
                        ).length

                      return (
                        <Link
                          key={
                            parent.id
                          }
                          href={`/categories/${parent.slug}`}
                          role="menuitem"
                          onMouseEnter={() => {
                            clearCloseTimer()
                            setActiveParentId(
                              parent.id,
                            )
                          }}
                          onFocus={() =>
                            setActiveParentId(
                              parent.id,
                            )
                          }
                          onClick={() =>
                            setOpen(false)
                          }
                          className={[
                            'group/parent flex min-h-11 w-full items-center justify-between gap-2',
                            'rounded-[14px] px-3',
                            'text-right',
                            'transition-all duration-200',
                            selected
                              ? 'bg-white text-[#112F50] shadow-[0_5px_16px_rgba(17,47,80,0.06)]'
                              : 'text-[#667085] hover:bg-white/75 hover:text-[#112F50]',
                          ].join(' ')}
                        >
                          <span className="flex min-w-0 items-center gap-2">
                            {selected ? (
                              <span
                                aria-hidden="true"
                                className="
                                  h-1.5
                                  w-1.5
                                  shrink-0
                                  rounded-full
                                  bg-[#B79464]
                                "
                              />
                            ) : (
                              <span
                                aria-hidden="true"
                                className="
                                  h-1.5
                                  w-1.5
                                  shrink-0
                                  rounded-full
                                  bg-[#D8D4CC]
                                  transition-colors
                                  group-hover/parent:bg-[#B79464]/70
                                "
                              />
                            )}

                            <span
                              className="
                                min-w-0
                                truncate
                                text-[11px]
                                font-black
                              "
                            >
                              {
                                parent.name
                              }
                            </span>
                          </span>

                          <span className="flex shrink-0 items-center gap-1">
                            {childCount >
                              0 && (
                              <span
                                className="
                                  rounded-full
                                  bg-[#F3F1EC]
                                  px-1.5
                                  py-1
                                  text-[7px]
                                  font-black
                                  text-[#98A2B3]
                                "
                              >
                                {
                                  childCount
                                }
                              </span>
                            )}

                            <ChevronLeft
                              className="
                                h-3.5
                                w-3.5
                                text-[#C5C1B9]
                                transition-all
                                duration-200
                                group-hover/parent:-translate-x-0.5
                                group-hover/parent:text-[#B79464]
                              "
                              strokeWidth={
                                1.8
                              }
                            />
                          </span>
                        </Link>
                      )
                    },
                  )
                ) : (
                  <div
                    className="
                      rounded-[14px]
                      border
                      border-dashed
                      border-[#112F50]/[0.08]
                      px-3
                      py-4
                      text-center
                      text-[9px]
                      font-bold
                      text-[#98A2B3]
                    "
                  >
                    دسته‌بندی‌ای موجود نیست
                  </div>
                )}
              </div>
            </div>

            {/* Children */}
            <div className="min-w-0 p-4">
              {activeParent ? (
                <>
                  <div
                    className="
                      mb-3
                      flex
                      items-center
                      justify-between
                      gap-3
                    "
                  >
                    <div className="min-w-0">
                      <span
                        className="
                          block
                          truncate
                          text-[8px]
                          font-black
                          tracking-[0.08em]
                          text-[#B79464]
                        "
                      >
                        زیرمجموعه
                      </span>

                      <span
                        className="
                          mt-1
                          block
                          truncate
                          text-[15px]
                          font-black
                          tracking-[-0.02em]
                          text-[#112F50]
                        "
                      >
                        {
                          activeParent.name
                        }
                      </span>
                    </div>

                    <Link
                      href={`/categories/${activeParent.slug}`}
                      onClick={() =>
                        setOpen(false)
                      }
                      className="
                        flex
                        shrink-0
                        items-center
                        gap-1.5
                        rounded-full
                        border
                        border-[#B79464]/20
                        bg-[#FBF6ED]
                        px-3
                        py-2
                        text-[8px]
                        font-black
                        text-[#76582F]
                        transition-all
                        duration-200
                        hover:border-[#B79464]/40
                        hover:bg-[#F7F0E4]
                      "
                    >
                      مشاهده دسته
                      <ChevronLeft
                        className="h-3 w-3"
                        strokeWidth={
                          2
                        }
                      />
                    </Link>
                  </div>

                  {children.length >
                  0 ? (
                    <div
                      className="
                        grid
                        grid-cols-2
                        gap-2
                        xl:grid-cols-3
                      "
                    >
                      {children.map(
                        (child) => {
                          const isCurrent =
                            pathname ===
                              `/categories/${child.slug}` ||
                            pathname.startsWith(
                              `/categories/${child.slug}/`,
                            )

                          return (
                            <Link
                              key={
                                child.id
                              }
                              href={`/categories/${child.slug}`}
                              role="menuitem"
                              onClick={() =>
                                setOpen(false)
                              }
                              className={[
                                'group/child flex min-h-[58px] items-center justify-between gap-3',
                                'rounded-[16px] border px-3',
                                'transition-all duration-250',
                                isCurrent
                                  ? 'border-[#B79464]/35 bg-[#F8F3EA] text-[#76582F]'
                                  : 'border-[#112F50]/[0.055] bg-white/65 text-[#667085] hover:-translate-y-0.5 hover:border-[#B79464]/25 hover:bg-white hover:text-[#112F50] hover:shadow-[0_8px_22px_rgba(17,47,80,0.07)]',
                              ].join(' ')}
                            >
                              <span className="min-w-0">
                                <span
                                  className="
                                    block
                                    truncate
                                    text-[10px]
                                    font-black
                                  "
                                >
                                  {
                                    child.name
                                  }
                                </span>

                                {typeof child.count ===
                                  'number' && (
                                  <span
                                    className="
                                      mt-1
                                      block
                                      text-[7px]
                                      font-bold
                                      text-[#98A2B3]
                                    "
                                  >
                                    {child.count.toLocaleString(
                                      'fa-IR',
                                    )}{' '}
                                    محصول
                                  </span>
                                )}
                              </span>

                              {isCurrent ? (
                                <Check
                                  className="
                                    h-3.5
                                    w-3.5
                                    shrink-0
                                    text-[#B79464]
                                  "
                                  strokeWidth={
                                    2.2
                                  }
                                />
                              ) : (
                                <ChevronLeft
                                  className="
                                    h-3.5
                                    w-3.5
                                    shrink-0
                                    text-[#D0CCC4]
                                    transition-all
                                    duration-200
                                    group-hover/child:-translate-x-0.5
                                    group-hover/child:text-[#B79464]
                                  "
                                  strokeWidth={
                                    1.8
                                  }
                                />
                              )}
                            </Link>
                          )
                        },
                      )}
                    </div>
                  ) : (
                    <div
                      className="
                        flex
                        min-h-[170px]
                        items-center
                        justify-center
                        rounded-[20px]
                        border
                        border-dashed
                        border-[#112F50]/[0.08]
                        bg-[#FAF9F6]/70
                        text-center
                      "
                    >
                      <div>
                        <span
                          className="
                            mx-auto
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-full
                            bg-[#F3F1EC]
                            text-[#B79464]
                          "
                        >
                          <Layers3
                            className="h-4 w-4"
                            strokeWidth={
                              1.7
                            }
                          />
                        </span>

                        <p
                          className="
                            mt-3
                            text-[9px]
                            font-bold
                            text-[#98A2B3]
                          "
                        >
                          این دسته هنوز
                          زیر‌دسته‌ای ندارد.
                        </p>

                        <Link
                          href={`/categories/${activeParent.slug}`}
                          onClick={() =>
                            setOpen(false)
                          }
                          className="
                            mt-2
                            inline-flex
                            text-[9px]
                            font-black
                            text-[#76582F]
                            hover:text-[#112F50]
                          "
                        >
                          مشاهده محصولات این دسته
                        </Link>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div
                  className="
                    flex
                    h-full
                    min-h-[240px]
                    items-center
                    justify-center
                    text-center
                  "
                >
                  <div>
                    <span
                      className="
                        mx-auto
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-full
                        bg-[#F3F1EC]
                        text-[#B79464]
                      "
                    >
                      <Layers3
                        className="h-5 w-5"
                        strokeWidth={1.7}
                      />
                    </span>

                    <p
                      className="
                        mt-3
                        text-[10px]
                        font-bold
                        text-[#98A2B3]
                      "
                    >
                      دسته‌بندی مورد نظر را
                      انتخاب کنید.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}