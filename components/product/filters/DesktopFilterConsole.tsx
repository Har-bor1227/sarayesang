
'use client'

import {
  Check,
  Filter,
  RotateCcw,
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

interface DesktopFilterConsoleProps {
  groups: CatalogFilterGroup[]
  selection: CatalogFilterSelection
  sort: ProductSort
  activeFilters: [CatalogFilterKey, string][]
  activeFilterCount: number
  hasPendingChanges: boolean
  openGroups: Set<CatalogFilterKey>
  onToggleGroup: (
    key: CatalogFilterKey,
  ) => void
  onToggleFilter: (
    key: CatalogFilterKey,
    value: string,
  ) => void
  onRemoveFilter: (
    key: CatalogFilterKey,
  ) => void
  onClearFilters: () => void
  onCancelChanges: () => void
  onApplyFilters: () => void
  onChangeSort: (
    value: ProductSort,
  ) => void
}

export default function DesktopFilterConsole({
  groups,
  selection,
  sort,
  activeFilters,
  activeFilterCount,
  hasPendingChanges,
  openGroups,
  onToggleGroup,
  onToggleFilter,
  onRemoveFilter,
  onClearFilters,
  onCancelChanges,
  onApplyFilters,
  onChangeSort,
}: DesktopFilterConsoleProps) {
  return (
    <div className="hidden lg:block">
      <div className="space-y-3">
        {/* =================================================
            ACTIVE FILTERS
        ================================================== */}

        {activeFilters.length > 0 && (
          <section
            aria-label="فیلترهای انتخاب‌شده"
            className="
              w-full
              overflow-hidden
              rounded-[22px]
              border
              border-[#B79464]/20
              bg-[linear-gradient(145deg,rgba(251,248,242,0.98),rgba(244,239,230,0.92))]
              p-3
              shadow-[0_10px_26px_rgba(17,47,80,0.055),inset_0_1px_0_rgba(255,255,255,0.95)]
            "
          >
            <div
              className="
                flex
                flex-wrap
                items-center
                justify-between
                gap-2
              "
            >
              <div
                className="
                  flex
                  min-w-0
                  items-center
                  gap-2
                "
              >
                <span
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-[10px]
                    border
                    border-[#B79464]/15
                    bg-white
                    text-[#B79464]
                  "
                >
                  <Check
                    className="h-3.5 w-3.5"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                </span>

                <div className="min-w-0">
                  <span
                    className="
                      block
                      text-[8px]
                      font-black
                      text-[#112F50]
                    "
                  >
                    فیلترهای انتخاب‌شده
                  </span>

                  {hasPendingChanges && (
                    <span
                      className="
                        mt-0.5
                        block
                        truncate
                        text-[7px]
                        font-bold
                        text-[#B79464]
                      "
                    >
                      آماده برای اعمال
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={
                  onClearFilters
                }
                className="
                  inline-flex
                  min-h-8
                  shrink-0
                  items-center
                  gap-1
                  rounded-full
                  px-2
                  text-[7px]
                  font-black
                  text-[#76582F]
                  transition-all
                  duration-200
                  hover:bg-white
                  hover:text-[#112F50]
                "
              >
                <RotateCcw
                  className="h-3 w-3"
                  aria-hidden="true"
                />

                حذف همه
              </button>
            </div>

            <div
              className="
                mt-3
                flex
                max-w-full
                flex-wrap
                gap-1.5
              "
            >
              {activeFilters.map(
                ([key, value]) => {
                  const group =
                    groups.find(
                      (item) =>
                        item.key ===
                        key,
                    )

                  const option =
                    group?.options.find(
                      (item) =>
                        item.slug ===
                        value,
                    )

                  const label =
                    option?.name ??
                    value

                  return (
                    <button
                      key={`${key}-${value}`}
                      type="button"
                      onClick={() =>
                        onRemoveFilter(
                          key,
                        )
                      }
                      title={label}
                      className="
                        group
                        inline-flex
                        min-w-0
                        max-w-full
                        items-center
                        gap-1.5
                        rounded-full
                        border
                        border-[#B79464]/25
                        bg-white
                        px-2.5
                        py-1.5
                        text-[8px]
                        font-black
                        text-[#76582F]
                        shadow-[0_3px_10px_rgba(183,148,100,0.05)]
                        transition-all
                        duration-200
                        hover:border-[#B79464]/45
                        hover:bg-[#FBF8F2]
                      "
                    >
                      <span
                        className="
                          min-w-0
                          max-w-full
                          truncate
                        "
                      >
                        {label}
                      </span>

                      <X
                        className="
                          h-3
                          w-3
                          shrink-0
                          text-[#98A2B3]
                          transition-colors
                          group-hover:text-[#B79464]
                        "
                        aria-hidden="true"
                      />
                    </button>
                  )
                },
              )}
            </div>
          </section>
        )}

        {/* =================================================
            MAIN FILTER CONSOLE
        ================================================== */}

        <section
          aria-label="فیلتر محصولات"
          className="
            relative
            overflow-hidden
            rounded-[30px]
            border
            border-white/90
            bg-[linear-gradient(145deg,rgba(235,237,235,0.96),rgba(222,224,221,0.80))]
            p-3
            shadow-[0_22px_52px_rgba(17,47,80,0.11),0_4px_12px_rgba(17,47,80,0.035),inset_0_1px_0_rgba(255,255,255,0.98)]
            backdrop-blur-2xl
          "
        >
          {/* Ambient lights */}

          <span
            className="
              pointer-events-none
              absolute
              -right-16
              -top-16
              h-48
              w-48
              rounded-full
              bg-[#B79464]/[0.11]
              blur-3xl
            "
            aria-hidden="true"
          />

          <span
            className="
              pointer-events-none
              absolute
              -bottom-20
              -left-20
              h-48
              w-48
              rounded-full
              bg-[#112F50]/[0.045]
              blur-3xl
            "
            aria-hidden="true"
          />

          <div className="relative space-y-3">
            {/* =================================================
                CONSOLE HEADING
            ================================================== */}

            <header
              className="
                rounded-[23px]
                border
                border-white/90
                bg-white/[0.70]
                p-3.5
                shadow-[0_11px_28px_rgba(17,47,80,0.065),inset_0_1px_0_rgba(255,255,255,0.98)]
                backdrop-blur-xl
              "
            >
              <div
                className="
                  flex
                  min-w-0
                  items-center
                  justify-between
                  gap-2.5
                "
              >
                <div
                  className="
                    flex
                    min-w-0
                    items-center
                    gap-2.5
                  "
                >
                  <span
                    className="
                      relative
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-[13px]
                      border
                      border-[#B79464]/20
                      bg-[linear-gradient(145deg,#fffdf9,#ede4d7)]
                      text-[#B79464]
                      shadow-[0_8px_20px_rgba(183,148,100,0.14)]
                    "
                  >
                    <Filter
                      className="h-4.5 w-4.5"
                      aria-hidden="true"
                    />

                    <span
                      className="
                        absolute
                        -right-1
                        -top-1
                        h-3
                        w-3
                        rounded-full
                        border-2
                        border-white
                        bg-[#B79464]
                        shadow-[0_0_12px_rgba(183,148,100,0.42)]
                      "
                      aria-hidden="true"
                    />
                  </span>

                  <div className="min-w-0">

                    <h2
                      className="
                        mt-1
                        truncate
                        text-[16px]
                        font-black
                        tracking-[-0.03em]
                        text-[#112F50]
                      "
                    >
                      فیلتر محصولات
                    </h2>
                  </div>
                </div>

                <span
                  className="
                    flex
                    h-9
                    min-w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#B79464]/20
                    bg-[#FBF8F2]
                    px-2
                    text-[9px]
                    font-black
                    text-[#76582F]
                    shadow-[0_5px_14px_rgba(183,148,100,0.08)]
                  "
                >
                  {activeFilterCount.toLocaleString(
                    'fa-IR',
                  )}
                </span>
              </div>

              <div
                className="
                  mt-2.5
                  flex
                  items-center
                  gap-2
                "
              >
                <span className="h-px flex-1 bg-[#112F50]/[0.06]" />

                <span
                  className="
                    shrink-0
                    text-[7px]
                    font-bold
                    text-[#98A2B3]
                  "
                >
                  ویژگی محصول
                </span>

                <span className="h-px flex-1 bg-[#112F50]/[0.06]" />
              </div>
            </header>

            {/* =================================================
                FILTER GROUPS

                All groups are closed by default.
            ================================================== */}

            <FilterGroups
              groups={groups}
              values={selection}
              openGroups={openGroups}
              onToggleGroup={
                onToggleGroup
              }
              onToggle={
                onToggleFilter
              }
            />

            {/* =================================================
                SORT
            ================================================== */}

            <section
              className="
                rounded-[22px]
                border
                border-white/90
                bg-white/[0.70]
                p-3
                shadow-[0_11px_28px_rgba(17,47,80,0.055),inset_0_1px_0_rgba(255,255,255,0.98)]
                backdrop-blur-xl
              "
            >
              <div
                className="
                  mb-2.5
                  flex
                  items-center
                  justify-between
                  gap-3
                  px-1
                "
              >
                <div>
                  <span
                    className="
                      block
                      text-[7px]
                      font-black
                      uppercase
                      tracking-[0.18em]
                      text-[#B79464]
                    "
                  >
                    Sort
                  </span>

                  <span
                    className="
                      mt-1
                      block
                      text-[10px]
                      font-black
                      text-[#112F50]
                    "
                  >
                    مرتب‌سازی
                  </span>
                </div>

                <span
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
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

              <select
                id="catalog-sort"
                value={sort}
                onChange={(event) =>
                  onChangeSort(
                    event.target
                      .value as ProductSort,
                  )
                }
                className="
                  h-11
                  w-full
                  appearance-none
                  rounded-[14px]
                  border
                  border-[#112F50]/[0.07]
                  bg-[#F7F6F2]
                  px-3
                  text-[10px]
                  font-black
                  text-[#112F50]
                  shadow-[inset_0_1px_2px_rgba(17,47,80,0.025)]
                  outline-none
                  transition-all
                  duration-300
                  hover:bg-white
                  focus:border-[#B79464]/40
                  focus:bg-white
                  focus:shadow-[0_0_0_4px_rgba(183,148,100,0.08)]
                "
              >
                {SORT_OPTIONS.map(
                  (option) => (
                    <option
                      key={
                        option.value
                      }
                      value={
                        option.value
                      }
                    >
                      {option.label}
                    </option>
                  ),
                )}
              </select>
            </section>

            {/* =================================================
                APPLY BAR
            ================================================== */}

            <section
              className="
                rounded-[22px]
                border
                border-[#112F50]/[0.07]
                bg-white/[0.64]
                p-2.5
                shadow-[0_10px_24px_rgba(17,47,80,0.045),inset_0_1px_0_rgba(255,255,255,0.95)]
                backdrop-blur-xl
              "
            >
              <button
                type="button"
                onClick={
                  onApplyFilters
                }
                disabled={
                  !hasPendingChanges
                }
                className="
                  group
                  relative
                  flex
                  min-h-12
                  w-full
                  items-center
                  justify-center
                  gap-2
                  overflow-hidden
                  rounded-[16px]
                  bg-[linear-gradient(135deg,#112F50,#193F63)]
                  px-4
                  text-[10px]
                  font-black
                  text-white
                  shadow-[0_10px_22px_rgba(17,47,80,0.16)]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:shadow-[0_14px_28px_rgba(17,47,80,0.20)]
                  disabled:cursor-not-allowed
                  disabled:translate-y-0
                  disabled:bg-[#C8C8C4]
                  disabled:text-[#7A7A76]
                  disabled:shadow-none
                "
              >
                <span
                  className="
                    pointer-events-none
                    absolute
                    -left-8
                    -top-8
                    h-20
                    w-20
                    rounded-full
                    bg-[#B79464]/[0.14]
                    blur-2xl
                    transition-transform
                    duration-500
                    group-hover:scale-125
                  "
                  aria-hidden="true"
                />

                <span
                  className="
                    relative
                    flex
                    min-w-0
                    items-center
                    gap-2
                  "
                >
                  <Check
                    className="h-3.5 w-3.5 shrink-0"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />

                  <span className="truncate">
                    {hasPendingChanges
                      ? `اعمال فیلترها${activeFilterCount > 0 ? ` (${activeFilterCount.toLocaleString('fa-IR')})` : ''}`
                      : 'فیلترها اعمال شده‌اند'}
                  </span>
                </span>
              </button>

              {hasPendingChanges && (
                <button
                  type="button"
                  onClick={
                    onCancelChanges
                  }
                  className="
                    mt-2
                    flex
                    min-h-8
                    w-full
                    items-center
                    justify-center
                    gap-1.5
                    rounded-full
                    text-[8px]
                    font-black
                    text-[#667085]
                    transition-all
                    duration-200
                    hover:bg-white/70
                    hover:text-[#112F50]
                  "
                >
                  <RotateCcw
                    className="h-3 w-3"
                    aria-hidden="true"
                  />

                  لغو تغییرات
                </button>
              )}
            </section>
          </div>
        </section>
      </div>
    </div>
  )
}

