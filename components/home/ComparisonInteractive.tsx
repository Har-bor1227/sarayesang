'use client'

import {
  ArrowLeft,
  Gem,
  Search,
  Scale,
} from 'lucide-react'

import Container from '@/components/ui/container'

import ComparisonShowcase from './comparison/ComparisonShowcase'
import ProductPicker from './comparison/ProductPicker'
import ProductSlot from './comparison/ProductSlot'
import { useComparison } from './comparison/useComparison'

export default function ComparisonInteractive() {
  const {
    status,
    error,
    firstProduct,
    secondProduct,
    pickerSlot,
    query,
    searchResults,
    compareCount,
    pickerTarget,
    setQuery,
    openPicker,
    closePicker,
    selectProduct,
    clearProduct,
  } = useComparison()

  return (
    <>
      <section
        dir="rtl"
        className="
          relative
          w-full
          overflow-hidden
          bg-[#FCFCFB]
          pb-9
          sm:pb-11
          md:pb-13
          lg:pb-15
        "
      >
        <Container>
          <div
            className="
              relative
              overflow-hidden
              rounded-[24px]
              border
              border-[#D8E1E8]
              bg-[#0B1B2A]
              p-1.5
              shadow-[0_20px_50px_rgba(17,47,80,0.10)]
              sm:rounded-[29px]
              sm:p-2
              lg:rounded-[33px]
              lg:p-2.5
            "
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
            >
              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#B79464]/[0.13] blur-3xl" />

              <div className="absolute -left-28 bottom-[-120px] h-80 w-80 rounded-full bg-[#31567D]/[0.12] blur-3xl" />

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.04),transparent_35%)]" />
            </div>

            <div
              className="
                relative
                overflow-hidden
                rounded-[19px]
                border
                border-white/[0.08]
                bg-white/[0.045]
                p-2.5
                backdrop-blur-2xl
                sm:rounded-[23px]
                sm:p-3.5
                md:p-4.5
                lg:rounded-[26px]
                lg:p-5
              "
            >
              <div className="mb-2.5 flex items-center justify-between gap-3 sm:mb-3">
                <div className="flex items-center gap-1.5">
                  <Gem
                    aria-hidden="true"
                    className="h-3.5 w-3.5 text-[#B79464]"
                    strokeWidth={1.7}
                  />

                  <span className="text-[9px] font-black text-[#DCC5A1] sm:text-[10px]">
                    انتخاب محصولات
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[8px] font-bold text-white/35 sm:text-[9px]">
                  <span className="flex h-5.5 min-w-5.5 items-center justify-center rounded-full bg-white/[0.06] px-1.5 text-[#D8BC8D] sm:h-6 sm:min-w-6">
                    {compareCount}/۲
                  </span>

                  انتخاب
                </div>
              </div>

              <div className="grid gap-2.5 lg:grid-cols-2 lg:gap-3">
                <ProductSlot
                  product={firstProduct}
                  slot="first"
                  onOpenPicker={openPicker}
                  onClear={clearProduct}
                />

                <ProductSlot
                  product={secondProduct}
                  slot="second"
                  onOpenPicker={openPicker}
                  onClear={clearProduct}
                />
              </div>

              <div className="mt-3 sm:mt-3.5">
                <div className="mb-2 flex items-center justify-center gap-2 sm:mb-2.5">
                  <div className="flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full bg-[#B79464]/[0.11] text-[#D8BC8D] sm:h-7 sm:w-7">
                    <Scale
                      aria-hidden="true"
                      className="h-3.5 w-3.5"
                      strokeWidth={1.8}
                    />
                  </div>

                  <div className="text-[10px] font-black text-white sm:text-[11px]">
                    مقایسه مشخصات
                  </div>
                </div>

                <ComparisonShowcase
                  first={firstProduct}
                  second={secondProduct}
                />
              </div>

              {status === 'error' ? (
                <div className="mt-2.5 rounded-[12px] border border-[#B24C43]/20 bg-[#B24C43]/[0.07] px-3 py-2 text-center text-[8px] font-bold text-[#E29B94] sm:mt-3 sm:text-[9px]">
                  {error}
                </div>
              ) : null}

              <div className="mt-3 flex justify-center sm:mt-3.5">
                <button
                  id="comparison-picker-trigger"
                  type="button"
                  onClick={() => {
                    if (
                      pickerTarget === 'first' ||
                      pickerTarget === 'second'
                    ) {
                      openPicker(pickerTarget)
                    }
                  }}
                  className="
                    group
                    inline-flex
                    min-h-9.5
                    w-full
                    items-center
                    justify-center
                    gap-1.5
                    rounded-[10px]
                    border
                    border-[#D8BC8D]/24
                    bg-gradient-to-b
                    from-[#D9BF92]
                    to-[#BE9A63]
                    px-4
                    text-[9px]
                    font-black
                    text-[#112F50]
                    shadow-[0_7px_18px_rgba(183,148,100,0.11)]
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:from-[#E2CCA7]
                    hover:to-[#C9A773]
                    active:translate-y-0
                    sm:w-auto
                    sm:min-w-[175px]
                    sm:px-5
                    sm:text-[10px]
                  "
                >
                  <Search
                    aria-hidden="true"
                    className="h-3.5 w-3.5"
                    strokeWidth={2}
                  />

                  {firstProduct ||
                  secondProduct
                    ? 'تغییر انتخاب'
                    : 'شروع مقایسه'}

                  <ArrowLeft
                    aria-hidden="true"
                    className="
                      h-3.5
                      w-3.5
                      transition-transform
                      duration-300
                      group-hover:-translate-x-1
                    "
                    strokeWidth={2}
                  />
                </button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <ProductPicker
        open={pickerSlot !== null}
        slot={pickerSlot}
        products={searchResults}
        query={query}
        loading={status === 'loading'}
        error={error}
        selectedFirstId={
          firstProduct?.id
        }
        selectedSecondId={
          secondProduct?.id
        }
        onQueryChange={setQuery}
        onSelect={selectProduct}
        onClose={closePicker}
      />
    </>
  )
}