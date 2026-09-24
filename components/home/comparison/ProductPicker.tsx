'use client'

import Image from 'next/image'
import {
  Search,
  LoaderCircle,
  Check,
  X,
} from 'lucide-react'
import { useEffect } from 'react'

import type {
  ProductPickerProps,
} from './types'
import {
  formatPrice,
  getImage,
  getCategoryText,
} from './utils'

export default function ProductPicker({
  open,
  slot,
  products,
  query,
  loading,
  error,
  selectedFirstId,
  selectedSecondId,
  onQueryChange,
  onSelect,
  onClose,
}: ProductPickerProps) {
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }

    window.addEventListener(
      'keydown',
      handleKeyDown,
    )

    return () =>
      window.removeEventListener(
        'keydown',
        handleKeyDown,
      )
  }, [open, onClose])

  if (!open || !slot) {
    return null
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-end
        justify-center
        bg-[#06111C]/58
        p-2
        backdrop-blur-sm
        sm:items-center
        sm:p-4
      "
      role="presentation"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose()
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="stone-picker-title"
        className="
          relative
          flex
          max-h-[88vh]
          w-full
          max-w-[880px]
          flex-col
          overflow-hidden
          rounded-[22px]
          border
          border-white/10
          bg-[#0B1B2A]
          shadow-[0_30px_90px_rgba(0,0,0,0.38)]
          sm:max-h-[86vh]
          sm:rounded-[28px]
        "
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#B79464]/[0.11] blur-3xl" />
          <div className="absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-[#4F7396]/[0.09] blur-3xl" />
        </div>

        <div
          className="
            relative
            shrink-0
            border-b
            border-white/[0.08]
            px-3.5
            pb-3.5
            pt-3.5
            sm:px-5
            sm:pb-4
            sm:pt-4.5
          "
        >
          <div className="flex items-center gap-2.5">
            <span
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-[13px]
                border
                border-[#B79464]/20
                bg-[#B79464]/[0.09]
                text-[#D8BC8D]
                sm:h-11
                sm:w-11
              "
            >
              <Search
                aria-hidden="true"
                className="h-4.5 w-4.5"
                strokeWidth={1.8}
              />
            </span>

            <div className="min-w-0 flex-1">
              <div className="text-[8px] font-black text-[#B79464] sm:text-[9px]">
                {slot === 'first'
                  ? 'سنگ اول'
                  : 'سنگ دوم'}
              </div>

              <h3
                id="stone-picker-title"
                className="mt-0.5 text-[17px] font-black text-white sm:text-[20px]"
              >
                انتخاب محصول
              </h3>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="
                flex
                h-8.5
                w-8.5
                shrink-0
                items-center
                justify-center
                rounded-full
                border
                border-white/10
                bg-white/[0.05]
                text-white/65
                transition-all
                hover:bg-white/[0.10]
                hover:text-white
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#B79464]/45
                sm:h-9
                sm:w-9
              "
              aria-label="بستن"
            >
              <X
                aria-hidden="true"
                className="h-4 w-4"
                strokeWidth={2}
              />
            </button>
          </div>

          <div className="relative mt-3">
            <Search
              aria-hidden="true"
              className="
                absolute
                right-3
                top-1/2
                h-3.5
                w-3.5
                -translate-y-1/2
                text-[#B79464]
              "
              strokeWidth={1.8}
            />

            <input
              autoFocus
              value={query}
              onChange={(event) =>
                onQueryChange(
                  event.target.value,
                )
              }
              type="search"
              inputMode="search"
              placeholder="جستجوی نام، نوع یا کاربرد..."
              className="
                h-11
                w-full
                rounded-[13px]
                border
                border-white/[0.09]
                bg-white/[0.055]
                pr-9
                pl-9
                text-[10px]
                font-bold
                text-white
                outline-none
                placeholder:text-white/25
                focus:border-[#B79464]/45
                focus:bg-white/[0.07]
                focus:ring-2
                focus:ring-[#B79464]/10
                sm:h-12
                sm:text-[11px]
              "
              aria-label="جستجوی محصولات سنگ"
            />

            {query ? (
              <button
                type="button"
                onClick={() =>
                  onQueryChange('')
                }
                className="
                  absolute
                  left-2
                  top-1/2
                  flex
                  h-7
                  w-7
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-full
                  text-white/35
                  hover:bg-white/[0.07]
                  hover:text-white
                "
                aria-label="پاک کردن جستجو"
              >
                <X
                  aria-hidden="true"
                  className="h-3.5 w-3.5"
                />
              </button>
            ) : null}
          </div>
        </div>

        <div className="relative min-h-0 flex-1 overflow-y-auto p-2.5 sm:p-4">
          {loading ? (
            <div className="flex min-h-[220px] items-center justify-center">
              <LoaderCircle
                aria-hidden="true"
                className="h-6 w-6 animate-spin text-[#D8BC8D]"
                strokeWidth={1.7}
              />
            </div>
          ) : error ? (
            <div className="flex min-h-[220px] flex-col items-center justify-center px-4 text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#B24C43]/10 text-[#D8837B]">
                <X
                  aria-hidden="true"
                  className="h-5 w-5"
                />
              </span>

              <p className="mt-3 text-[11px] font-black text-white">
                دریافت محصولات انجام نشد
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex min-h-[220px] flex-col items-center justify-center px-4 text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.05] text-white/40">
                <Search
                  aria-hidden="true"
                  className="h-5 w-5"
                />
              </span>

              <p className="mt-3 text-[11px] font-black text-white">
                محصولی پیدا نشد
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
              {products.map(
                (product) => {
                  const chosenElsewhere =
                    (slot === 'first' &&
                      product.id ===
                        selectedSecondId) ||
                    (slot === 'second' &&
                      product.id ===
                        selectedFirstId)

                  return (
                    <button
                      key={product.id}
                      type="button"
                      disabled={
                        chosenElsewhere
                      }
                      onClick={() =>
                        onSelect(product)
                      }
                      className="
                        group
                        min-w-0
                        overflow-hidden
                        rounded-[15px]
                        border
                        border-white/[0.08]
                        bg-white/[0.035]
                        text-right
                        transition-all
                        duration-300
                        hover:-translate-y-0.5
                        hover:border-[#B79464]/35
                        hover:bg-white/[0.055]
                        disabled:cursor-not-allowed
                        disabled:opacity-35
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-[#B79464]/50
                        sm:rounded-[17px]
                      "
                    >
                      <div className="relative aspect-[1.22] overflow-hidden bg-white/[0.04] sm:aspect-[1.3]">
                        <Image
                          src={getImage(
                            product,
                          )}
                          alt={
                            product.image
                              ?.altText ||
                            product.name
                          }
                          fill
                          sizes="(max-width: 639px) 46vw, (max-width: 1023px) 44vw, 28vw"
                          className="
                            object-cover
                            transition-transform
                            duration-500
                            group-hover:scale-[1.04]
                          "
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-[#06111C]/78 via-transparent to-transparent" />

                        <div className="absolute inset-x-2 bottom-2 flex items-end justify-between gap-1.5 sm:inset-x-2.5">
                          <span className="min-w-0 truncate rounded-full border border-white/10 bg-[#112F50]/76 px-1.5 py-1 text-[6px] font-black text-white backdrop-blur-md sm:px-2 sm:text-[7px]">
                            {product.acf
                              .stoneType ||
                              'سنگ'}
                          </span>

                          <span className="shrink-0 rounded-full border border-[#D8BC8D]/20 bg-[#B79464]/[0.16] px-1.5 py-1 text-[6px] font-black text-[#E9D9BB] backdrop-blur-md sm:px-2 sm:text-[7px]">
                            {formatPrice(
                              product.price,
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="p-2.5 sm:p-3">
                        <div className="line-clamp-2 min-h-[38px] text-[10px] font-black leading-5 text-white sm:min-h-[42px] sm:text-[11px] sm:leading-5.5">
                          {product.name}
                        </div>

                        <div className="mt-1.5 flex items-center justify-between gap-1.5">
                          <span className="min-w-0 truncate text-[6.5px] font-medium text-white/35 sm:text-[7.5px]">
                            {getCategoryText(
                              product,
                            ) ||
                              product.acf
                                .application ||
                              '—'}
                          </span>

                          <span className="inline-flex shrink-0 items-center gap-0.5 text-[7px] font-black text-[#D8BC8D] sm:text-[8px]">
                            {chosenElsewhere
                              ? 'انتخاب شده'
                              : 'انتخاب'}

                            <Check
                              aria-hidden="true"
                              className="h-2.5 w-2.5 sm:h-3 sm:w-3"
                              strokeWidth={2.3}
                            />
                          </span>
                        </div>
                      </div>
                    </button>
                  )
                },
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}