'use client'

import {
  SlidersHorizontal,
  X,
} from 'lucide-react'

import type {
  CatalogFilterGroup,
  CatalogFilterKey,
  CatalogFilterSelection,
  ProductSort,
} from '@/types/catalog'

import FilterGroups from './FilterGroups'
import { SORT_OPTIONS } from './constants'

interface MobileFilterSheetProps {
  open: boolean
  groups: CatalogFilterGroup[]
  draftSelection: CatalogFilterSelection
  draftSort: ProductSort
  draftFilterCount: number
  openGroups: Set<CatalogFilterKey>
  onToggleGroup: (key: CatalogFilterKey) => void
  onUpdateDraft: (
    key: CatalogFilterKey,
    value: string,
  ) => void
  onSetDraftSort: (value: ProductSort) => void
  onClearDraft: () => void
  onApply: () => void
  onClose: () => void
}

export default function MobileFilterSheet({
  open,
  groups,
  draftSelection,
  draftSort,
  draftFilterCount,
  openGroups,
  onToggleGroup,
  onUpdateDraft,
  onSetDraftSort,
  onClearDraft,
  onApply,
  onClose,
}: MobileFilterSheetProps) {
  if (!open) {
    return null
  }

  return (
        <div
          className="
            fixed
            inset-0
            z-[100]
            bg-[#071522]/60
            backdrop-blur-[6px]
            lg:hidden
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
            id="mobile-filter-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-filter-title"
            className="
              absolute
              inset-x-0
              bottom-0
              max-h-[92vh]
              overflow-hidden
              rounded-t-[36px]
              border-t
              border-white/80
              bg-[linear-gradient(180deg,#F1F0EC,#E7E5DF)]
              shadow-[0_-26px_85px_rgba(7,21,34,0.38),inset_0_1px_0_rgba(255,255,255,0.98)]
            "
          >
            <span
              className="
                pointer-events-none
                absolute
                -right-16
                -top-16
                h-40
                w-40
                rounded-full
                bg-[#B79464]/10
                blur-3xl
              "
              aria-hidden="true"
            />

            <div className="relative mx-auto max-w-2xl">
              {/* Sheet header */}
              <header className="border-b border-[#112F50]/[0.065] px-5 pb-4 pt-3 sm:px-6">
                <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-[#C7C5BE]" />

                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-[14px]
                        border
                        border-[#B79464]/20
                        bg-[linear-gradient(145deg,#fffdf9,#ede4d7)]
                        text-[#B79464]
                        shadow-[0_8px_20px_rgba(183,148,100,0.12)]
                      "
                    >
                      <SlidersHorizontal
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </span>

                    <div className="min-w-0">
                      <span className="block text-[7px] font-black uppercase tracking-[0.20em] text-[#B79464]">
                        Refine your selection
                      </span>

                      <h2
                        id="mobile-filter-title"
                        className="mt-1 text-[21px] font-black tracking-[-0.04em] text-[#112F50]"
                      >
                        فیلتر محصولات
                      </h2>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      onClose()
                    }
                    className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#112F50]/[0.07]
                      bg-white/80
                      text-[#112F50]
                      shadow-[0_7px_18px_rgba(17,47,80,0.06)]
                      backdrop-blur-xl
                      transition-all
                      duration-300
                      hover:bg-white
                    "
                    aria-label="بستن فیلترها"
                  >
                    <X
                      className="h-4 w-4"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </header>

              {/* Scrollable sheet content */}
              <div
                className="
                  max-h-[58vh]
                  overflow-y-auto
                  overscroll-contain
                  px-5
                  pb-5
                  pt-4
                  sm:px-6
                "
              >
                {/* Sort */}
                <section
                  className="
                    mb-4
                    rounded-[25px]
                    border
                    border-white/90
                    bg-white/[0.70]
                    p-3.5
                    shadow-[0_12px_30px_rgba(17,47,80,0.06),inset_0_1px_0_rgba(255,255,255,0.98)]
                    backdrop-blur-xl
                  "
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <span className="block text-[7px] font-black uppercase tracking-[0.18em] text-[#B79464]">
                        Sort
                      </span>

                      <span className="mt-1 block text-[10px] font-black text-[#112F50]">
                        مرتب‌سازی محصولات
                      </span>
                    </div>

                    <span
                      className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-[10px]
                        bg-[#FBF8F2]
                        text-[#B79464]
                      "
                    >
                      <SlidersHorizontal
                        className="h-3.5 w-3.5"
                        aria-hidden="true"
                      />
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {SORT_OPTIONS.map(
                      (option) => {
                        const active =
                          draftSort ===
                          option.value

                        return (
                          <button
                            key={
                              option.value
                            }
                            type="button"
                            onClick={() =>
                              onSetDraftSort(
                                option.value,
                              )
                            }
                            className={[
                              `
                                relative
                                min-h-11
                                overflow-hidden
                                rounded-[14px]
                                border
                                px-3
                                text-[9px]
                                font-black
                                transition-all
                                duration-300
                              `,
                              active
                                ? `
                                  border-[#112F50]
                                  bg-[linear-gradient(135deg,#112F50,#193F63)]
                                  text-white
                                  shadow-[0_9px_20px_rgba(17,47,80,0.17)]
                                `
                                : `
                                  border-[#112F50]/[0.06]
                                  bg-[#F7F6F2]
                                  text-[#667085]
                                  hover:border-[#B79464]/20
                                  hover:bg-white
                                `,
                            ].join(
                              ' ',
                            )}
                          >
                            {active && (
                              <span
                                className="
                                  pointer-events-none
                                  absolute
                                  -left-4
                                  -top-5
                                  h-14
                                  w-14
                                  rounded-full
                                  bg-[#B79464]/15
                                  blur-lg
                                "
                                aria-hidden="true"
                              />
                            )}

                            <span className="relative">
                              {
                                option.label
                              }
                            </span>
                          </button>
                        )
                      },
                    )}
                  </div>
                </section>

                {draftFilterCount >
                  0 && (
                  <div
                    className="
                      mb-4
                      rounded-[20px]
                      border
                      border-[#B79464]/18
                      bg-[#FBF8F2]/80
                      px-3.5
                      py-3
                      shadow-[0_7px_20px_rgba(183,148,100,0.06)]
                    "
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[9px] font-black text-[#112F50]">
                        انتخاب فعلی
                      </span>

                      <span className="text-[8px] font-black text-[#B79464]">
                        {draftFilterCount.toLocaleString(
                          'fa-IR',
                        )}{' '}
                        فیلتر
                      </span>
                    </div>
                  </div>
                )}

                {/* ALL MOBILE ACCORDIONS ARE CLOSED BY DEFAULT */}
                <FilterGroups
                  groups={groups}
                  values={draftSelection}
                  openGroups={openGroups}
                  onToggleGroup={onToggleGroup}
                  onToggle={onUpdateDraft}
                  compact
                />
              </div>

              {/* Bottom actions */}
              <footer
                className="
                  border-t
                  border-[#112F50]/[0.07]
                  bg-white/[0.80]
                  p-4
                  pb-[calc(1rem+env(safe-area-inset-bottom))]
                  shadow-[0_-9px_30px_rgba(17,47,80,0.06)]
                  backdrop-blur-2xl
                  sm:p-5
                  sm:pb-[calc(1.25rem+env(safe-area-inset-bottom))]
                "
              >
                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={onClearDraft}
                    className="
                      min-h-12
                      flex-1
                      rounded-[17px]
                      border
                      border-[#112F50]/[0.08]
                      bg-[#F6F5F1]
                      px-4
                      text-[10px]
                      font-black
                      text-[#667085]
                      shadow-[inset_0_1px_0_rgba(255,255,255,0.92)]
                      transition-all
                      duration-300
                      hover:bg-white
                      hover:text-[#112F50]
                    "
                  >
                    پاک کردن
                  </button>

                  <button
                    type="button"
                    onClick={
                      onApply
                    }
                    className="
                      group
                      relative
                      min-h-12
                      flex-[1.8]
                      overflow-hidden
                      rounded-[17px]
                      bg-[linear-gradient(135deg,#112F50,#193F63)]
                      px-4
                      text-[10px]
                      font-black
                      text-white
                      shadow-[0_12px_28px_rgba(17,47,80,0.20)]
                      transition-all
                      duration-300
                      hover:-translate-y-0.5
                      hover:shadow-[0_16px_32px_rgba(17,47,80,0.24)]
                      active:translate-y-0
                    "
                  >
                    <span
                      className="
                        pointer-events-none
                        absolute
                        -right-5
                        -top-9
                        h-24
                        w-24
                        rounded-full
                        bg-[#B79464]/18
                        blur-xl
                        transition-transform
                        duration-500
                        group-hover:scale-125
                      "
                      aria-hidden="true"
                    />

                    <span className="relative flex items-center justify-center gap-2">
                      اعمال فیلترها

                      {draftFilterCount >
                        0 && (
                        <span
                          className="
                            flex
                            h-5
                            min-w-5
                            items-center
                            justify-center
                            rounded-full
                            bg-[#B79464]
                            px-1.5
                            text-[8px]
                            font-black
                            text-[#112F50]
                          "
                        >
                          {draftFilterCount.toLocaleString(
                            'fa-IR',
                          )}
                        </span>
                      )}
                    </span>
                  </button>
                </div>
              </footer>
            </div>
          </div>
        </div>

  )
}
