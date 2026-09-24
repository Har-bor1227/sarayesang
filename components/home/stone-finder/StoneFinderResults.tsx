'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Phone,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react'
import type {
  PointerEvent as ReactPointerEvent,
} from 'react'

import { formatPrice } from '@/lib/format'
import { TEL_PHONE } from '@/lib/constants'

import { FALLBACK_IMAGE } from './config'
import type {
  FinderProduct,
  RankedProduct,
} from './types'
import {
  getScoreLabel,
  splitFacetValues,
} from './utils'

type StoneFinderResultsProps = {
  results: RankedProduct[]
  activeResult?: RankedProduct
  resultIndex: number
  answeredWithoutAny: number
  hasRealFilters: boolean
  onMoveResult: (
    direction: 'next' | 'previous',
  ) => void
  onPointerDown: (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => void
  onPointerUp: (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => void
  onPointerCancel: () => void
  onOpenResult: (index: number) => void
  onBack: () => void
  onReset: () => void
}
function ResultCard({
  product,
  index,
  active,
  onOpen,
}: {
  product: RankedProduct
  index: number
  active: boolean
  onOpen: (index: number) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      className={[
        'group overflow-hidden rounded-[18px] border text-right transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B79464] focus-visible:ring-offset-2 sm:rounded-[21px]',
        active
          ? 'border-[#B79464] bg-[#FFFDF8] shadow-[0_12px_30px_rgba(183,148,100,0.13)]'
          : 'border-[#112F50]/[0.07] bg-white hover:-translate-y-0.5 hover:border-[#B79464]/25 hover:shadow-[0_10px_25px_rgba(17,47,80,0.06)]',
      ].join(' ')}
    >
      <div className="relative aspect-[1.35] overflow-hidden bg-[#EAE8E2]">
        <Image
          src={
            product.image
              ?.sourceUrl ||
            FALLBACK_IMAGE
          }
          alt={
            product.image?.altText ||
            product.name
          }
          fill
          sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 20vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />

        <div className="absolute right-2 top-2 rounded-full bg-[#07131F]/40 px-2 py-1 text-[7px] font-black text-white backdrop-blur-md">
          {product.match > 0
            ? `${product.match}%`
            : 'اولیه'}
        </div>
      </div>

      <div className="p-2.5 sm:p-3">
        <span className="block line-clamp-1 text-[8px] font-black text-[#112F50] sm:text-[10px]">
          {product.name}
        </span>

        <span className="mt-1 block text-[7px] font-bold text-[#7B858F] sm:text-[8px]">
          {getScoreLabel(
            product.match,
          )}
        </span>
      </div>
    </button>
  )
}

function ProductFacts({
  product,
}: {
  product: FinderProduct
}) {
  const facts = [
    [
      'رنگ',
      product.acf.colorFamily,
    ],
    [
      'پرداخت',
      product.acf.surfaceFinish,
    ],
    [
      'ابعاد',
      product.acf.dimensions,
    ],
    [
      'وزن',
      product.acf.weight,
    ],
  ]
    .filter(([, value]) =>
      Boolean(value),
    )
    .slice(0, 4)

  return (
    <div className="mt-4 grid grid-cols-2 gap-2">
      {facts.map(([label, value]) => (
        <div
          key={label}
          className="rounded-[16px] border border-[#112F50]/[0.07] bg-[#FBFAF7] p-3 sm:rounded-[18px] sm:p-3.5"
        >
          <span className="block text-[7px] font-bold text-[#78828C] sm:text-[9px]">
            {label}
          </span>

          <span className="mt-1 block line-clamp-2 text-[9px] font-black leading-5 text-[#112F50] sm:text-[11px]">
            {value}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function StoneFinderResults({
  results,
  activeResult,
  resultIndex,
  answeredWithoutAny,
  hasRealFilters,
  onMoveResult,
  onPointerDown,
  onPointerUp,
  onPointerCancel,
  onOpenResult,
  onBack,
  onReset,
}: StoneFinderResultsProps) {
  return (
    <div className="mx-auto min-h-full w-full max-w-[1180px] px-4 py-4 sm:px-7 sm:py-7 lg:px-9 lg:py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#B79464]/20 bg-white px-3 py-1.5 text-[8px] font-black text-[#8E744F] sm:text-[9px]">
            <Sparkles className="h-3 w-3 text-[#B79464]" />
            پیشنهادهای شخصی‌سازی‌شده
          </span>

          <h3 className="mt-3 text-[25px] font-black leading-[1.42] tracking-[-0.035em] text-[#112F50] sm:text-[35px] lg:text-[40px]">
            سنگ‌های نزدیک به انتخاب تو
          </h3>

          <p className="mt-2 max-w-[720px] text-[10px] font-medium leading-6 text-[#687480] sm:text-[12px] sm:leading-7">
            نتیجه‌ها را ورق بزن؛ امتیاز فقط میزان نزدیکی به انتخاب‌های تو را نشان می‌دهد.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 rounded-[17px] border border-[#112F50]/[0.07] bg-white px-3.5 py-2.5 shadow-sm">
          <span className="text-[8px] font-black text-[#B79464]">
            {answeredWithoutAny}
          </span>

          <span className="text-[9px] font-black text-[#626C76]">
            معیار مشخص
          </span>
        </div>
      </div>

      {results.length > 0 &&
      activeResult ? (
        <>
          <div className="mt-5 overflow-hidden rounded-[27px] border border-[#112F50]/[0.07] bg-white shadow-[0_24px_60px_rgba(10,25,41,0.08)] sm:mt-8 sm:rounded-[36px]">
            <div className="grid lg:grid-cols-[1.17fr_0.83fr]">
              <div
                className="relative min-h-[255px] overflow-hidden bg-[#E9E7E1] sm:min-h-[390px] lg:min-h-[555px]"
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
                onPointerCancel={
                  onPointerCancel
                }
                style={{
                  touchAction: 'pan-y',
                }}
              >
                <Image
                  key={activeResult.id}
                  src={
                    activeResult.image
                      ?.sourceUrl ||
                    FALLBACK_IMAGE
                  }
                  alt={
                    activeResult.image
                      ?.altText ||
                    activeResult.name
                  }
                  fill
                  sizes="(max-width: 1023px) 100vw, 62vw"
                  priority
                  className="object-cover"
                />

                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(6,19,31,0.03)_0%,transparent_50%,rgba(6,19,31,0.42)_100%)]" />

                <div className="absolute right-3 top-3 flex max-w-[calc(100%-24px)] flex-wrap items-center gap-1.5 sm:right-6 sm:top-6 sm:gap-2">
                  <span className="rounded-full border border-white/20 bg-[#07131F]/35 px-2.5 py-1.5 text-[7px] font-black uppercase tracking-[0.14em] text-white backdrop-blur-md sm:px-3 sm:text-[9px]">
                    Saraye Sang
                  </span>

                  <span className="rounded-full border border-white/10 bg-[#B79464] px-2.5 py-1.5 text-[7px] font-black text-white shadow-[0_8px_20px_rgba(183,148,100,0.22)] sm:px-3 sm:text-[9px]">
                    {activeResult.match > 0
                      ? `${activeResult.match}% تطابق`
                      : 'پیشنهاد اولیه'}
                  </span>
                </div>

                {results.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        onMoveResult(
                          'previous',
                        )
                      }
                      aria-label="سنگ قبلی"
                      className="absolute right-2.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#07131F]/30 text-white backdrop-blur-md transition hover:bg-[#07131F]/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-5 sm:h-12 sm:w-12"
                    >
                      <ChevronRight className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onMoveResult('next')
                      }
                      aria-label="سنگ بعدی"
                      className="absolute left-2.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#07131F]/30 text-white backdrop-blur-md transition hover:bg-[#07131F]/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-5 sm:h-12 sm:w-12"
                    >
                      <ChevronLeft className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                    </button>
                  </>
                )}

                <div className="absolute bottom-3 right-3 left-3 flex items-end justify-between gap-3 sm:bottom-5 sm:right-6 sm:left-6 sm:gap-4">
                  <div className="min-w-0 max-w-[76%]">
                    <span className="block truncate text-[7px] font-black text-white/70 sm:text-[9px]">
                      {getScoreLabel(
                        activeResult.match,
                      )}
                    </span>

                    <h4 className="mt-1 line-clamp-2 text-[18px] font-black leading-[1.45] text-white sm:text-[28px]">
                      {activeResult.name}
                    </h4>
                  </div>

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-[#07131F]/30 p-1 backdrop-blur-md sm:h-14 sm:w-14">
                    <div
                      className="flex h-full w-full items-center justify-center rounded-full"
                      style={{
                        background:
                          activeResult.match > 0
                            ? `conic-gradient(#D8BC8D ${activeResult.match * 3.6}deg, rgba(255,255,255,0.18) 0deg)`
                            : 'rgba(255,255,255,0.12)',
                      }}
                    >
                      <span className="flex h-[76%] w-[76%] items-center justify-center rounded-full bg-[#07131F]/70 text-[8px] font-black text-white backdrop-blur-sm sm:text-[10px]">
                        {activeResult.match >
                        0
                          ? `${activeResult.match}%`
                          : '—'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col p-4 sm:p-7 lg:p-8">
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {splitFacetValues(
                    activeResult.acf
                      .stoneType,
                  )
                    .slice(0, 2)
                    .map((value) => (
                      <span
                        key={value}
                        className="rounded-full border border-[#B79464]/20 bg-[#FBF8F2] px-2.5 py-1.5 text-[7px] font-black text-[#92764F] sm:px-3 sm:text-[9px]"
                      >
                        {value}
                      </span>
                    ))}

                  {splitFacetValues(
                    activeResult.acf
                      .application,
                  )
                    .slice(0, 1)
                    .map((value) => (
                      <span
                        key={value}
                        className="rounded-full border border-[#112F50]/[0.08] bg-[#FBFAF7] px-2.5 py-1.5 text-[7px] font-black text-[#69737D] sm:px-3 sm:text-[9px]"
                      >
                        {value}
                      </span>
                    ))}
                </div>

                <h4 className="mt-4 text-[25px] font-black leading-[1.42] tracking-[-0.03em] text-[#112F50] sm:mt-5 sm:text-[35px]">
                  {activeResult.name}
                </h4>

                <div className="mt-4 rounded-[20px] border border-[#B79464]/15 bg-[#FBF8F2] p-3.5 sm:mt-5 sm:rounded-[23px] sm:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <span className="text-[8px] font-bold text-[#737D87] sm:text-[9px]">
                        قیمت فعلی
                      </span>

                      <div className="mt-1 flex flex-wrap items-end gap-2">
                        <span className="text-[21px] font-black tracking-[-0.03em] text-[#112F50] sm:text-[30px]">
                          {formatPrice(
                            activeResult.price,
                          )}
                        </span>

                        {activeResult.onSale &&
                          activeResult.regularPrice && (
                            <span className="pb-0.5 text-[9px] font-semibold text-[#6E7781]/50 line-through sm:text-[11px]">
                              {formatPrice(
                                activeResult.regularPrice,
                              )}
                            </span>
                          )}
                      </div>
                    </div>

                    <span className="shrink-0 rounded-full bg-white px-2.5 py-1.5 text-[7px] font-black text-[#92764F] shadow-sm sm:text-[8px]">
                      {
                        activeResult.matchedFields
                      }{' '}
                      معیار
                    </span>
                  </div>
                </div>

                <ProductFacts
                  product={activeResult}
                />

                <div className="mt-5 border-t border-[#112F50]/[0.07] pt-4 sm:mt-auto sm:pt-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-2.5">
                    <a
                      href={`tel:${TEL_PHONE}`}
                      aria-label={`خرید و استعلام ${activeResult.name}`}
                      className="group inline-flex min-h-[50px] flex-1 items-center justify-center gap-2 rounded-[16px] bg-[#B79464] px-4 text-[9px] font-black text-white shadow-[0_13px_28px_rgba(183,148,100,0.20)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#9D7C4D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B79464] focus-visible:ring-offset-2 sm:text-[11px]"
                    >
                      <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      خرید و استعلام این سنگ
                    </a>

                    <Link
                      href={`/products/${encodeURIComponent(
                        activeResult.slug,
                      )}`}
                      className="group inline-flex min-h-[50px] flex-1 items-center justify-center gap-2 rounded-[16px] border border-[#112F50]/[0.10] bg-white px-4 text-[9px] font-black text-[#112F50] transition duration-300 hover:-translate-y-0.5 hover:border-[#B79464]/40 hover:bg-[#FBF8F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B79464] focus-visible:ring-offset-2 sm:text-[11px]"
                    >
                      مشاهده محصول

                      <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                    </Link>
                  </div>

                  <div className="mt-2.5 flex items-start justify-center gap-1.5 text-center text-[7px] font-medium leading-5 text-[#78818B] sm:text-[9px]">
                    <Phone className="mt-0.5 h-3 w-3 shrink-0 text-[#B79464]" />

                    <span>
                      برای خرید نهایی، موجودی و شرایط سفارش را با کارشناسان هماهنگ کن.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {results.length > 1 && (
            <div className="mt-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-[9px] font-black text-[#112F50] sm:text-[10px]">
                  پیشنهادهای دیگر
                </span>

                <span className="text-[8px] font-bold text-[#7C858E] sm:text-[9px]">
                  {resultIndex + 1} /{' '}
                  {results.length}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5 lg:grid-cols-5">
                {results.map(
                  (product, index) => (
                    <ResultCard
                      key={product.id}
                      product={product}
                      index={index}
                      active={
                        index ===
                        resultIndex
                      }
                      onOpen={
                        onOpenResult
                      }
                    />
                  ),
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="mx-auto mt-7 max-w-[660px] rounded-[25px] border border-dashed border-[#112F50]/[0.10] bg-white px-5 py-12 text-center shadow-sm sm:mt-8 sm:rounded-[28px] sm:px-6 sm:py-14">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#FBF8F2] text-[#B79464]">
            <SlidersHorizontal className="h-6 w-6" />
          </div>

          <h4 className="mt-5 text-[20px] font-black text-[#112F50] sm:text-[24px]">
            هنوز نتیجه‌ای پیدا نشد
          </h4>

          <p className="mt-2 text-[10px] font-medium leading-6 text-[#707A84] sm:text-[11px] sm:leading-7">
            با انتخاب‌های فعلی تطابق کافی پیدا نشد. یکی از انتخاب‌ها را آزادتر کن و دوباره ببین.
          </p>

          <button
            type="button"
            onClick={onBack}
            className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#112F50] px-5 text-[10px] font-black text-white transition hover:bg-[#0A1929]"
          >
            تغییر انتخاب‌ها
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full px-3.5 text-[8px] font-black text-[#69737E] transition hover:text-[#112F50] sm:h-10 sm:px-4 sm:text-[9px]"
          >
            <ArrowRight className="h-3.5 w-3.5" />
            تغییر انتخاب‌ها
          </button>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-[#112F50]/[0.08] bg-white px-3.5 text-[8px] font-black text-[#69737E] transition hover:border-[#B79464]/35 hover:text-[#112F50] sm:h-10 sm:px-4 sm:text-[9px]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            از اول
          </button>
        </div>

        <div className="text-center text-[8px] font-bold text-[#79828B] sm:text-left sm:text-[9px]">
          {results.length > 0
            ? `نمایش ${resultIndex + 1} از ${results.length} پیشنهاد`
            : hasRealFilters
              ? 'بررسی دوباره انتخاب‌ها'
              : 'پیشنهادهای مجموعه سرای سنگ'}
        </div>
      </div>
    </div>
  )
}