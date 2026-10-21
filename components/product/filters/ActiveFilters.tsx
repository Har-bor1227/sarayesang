
'use client'

import {
  RotateCcw,
  SlidersHorizontal,
  X,
} from 'lucide-react'

import type {
  CatalogFilterGroup,
  CatalogFilterKey,
} from '@/types/catalog'

import { FILTER_LABELS } from './constants'

interface ActiveFiltersProps {
  activeFilters: [CatalogFilterKey, string][]
  groups: CatalogFilterGroup[]
  activeFilterCount: number
  onRemoveFilter: (
    key: CatalogFilterKey,
  ) => void
  onClearFilters: () => void
  compact?: boolean
}

export default function ActiveFilters({
  activeFilters,
  groups,
  activeFilterCount,
  onRemoveFilter,
  onClearFilters,
  compact = false,
}: ActiveFiltersProps) {
  return (
    <div
      className={[
        `
          relative
          w-full
          overflow-hidden
          rounded-[22px]
          border
          border-[#B79464]/20
          bg-[linear-gradient(135deg,rgba(250,248,243,0.94),rgba(238,233,224,0.72))]
          shadow-[0_10px_28px_rgba(183,148,100,0.075),inset_0_1px_0_rgba(255,255,255,0.95)]
          backdrop-blur-2xl
        `,
        compact
          ? 'px-3 py-2.5'
          : 'px-4 py-3.5',
      ].join(' ')}
    >
      <span
        className="
          pointer-events-none
          absolute
          -left-10
          -top-10
          h-24
          w-24
          rounded-full
          bg-[#B79464]/10
          blur-3xl
        "
        aria-hidden="true"
      />

      <div
        className={[
          'relative',
          compact
            ? 'space-y-2.5'
            : 'flex min-h-[58px] items-center gap-3',
        ].join(' ')}
      >
        {/* =================================================
            HEADER
        ================================================== */}

        <div
          className={[
            'flex min-w-0 items-center',
            compact
              ? 'justify-between gap-2'
              : 'shrink-0 gap-2',
          ].join(' ')}
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
                border-[#B79464]/18
                bg-white/75
                text-[#B79464]
                shadow-[0_5px_14px_rgba(183,148,100,0.09)]
                sm:h-9
                sm:w-9
                sm:rounded-[11px]
              "
            >
              <SlidersHorizontal
                className="
                  h-3.5
                  w-3.5
                  sm:h-4
                  sm:w-4
                "
                aria-hidden="true"
              />
            </span>

            <div className="min-w-0">
              <span
                className="
                  block
                  truncate
                  text-[7px]
                  font-black
                  uppercase
                  tracking-[0.16em]
                  text-[#B79464]
                "
              >
                Selection
              </span>

              <span
                className="
                  mt-0.5
                  block
                  truncate
                  text-[9px]
                  font-black
                  text-[#112F50]
                  sm:text-[10px]
                "
              >
                فیلترهای فعال
              </span>
            </div>

            {activeFilterCount > 0 && (
              <span
                className="
                  flex
                  h-6
                  min-w-6
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#112F50]
                  px-1.5
                  text-[7px]
                  font-black
                  text-white
                  sm:h-7
                  sm:min-w-7
                  sm:text-[8px]
                "
              >
                {activeFilterCount.toLocaleString(
                  'fa-IR',
                )}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClearFilters}
            disabled={
              activeFilterCount === 0
            }
            className="
              inline-flex
              min-h-8
              shrink-0
              items-center
              gap-1.5
              rounded-full
              border
              border-[#112F50]/[0.06]
              bg-white/65
              px-2.5
              text-[7px]
              font-black
              text-[#76582F]
              transition-all
              duration-200
              hover:border-[#B79464]/25
              hover:bg-white
              hover:text-[#112F50]
              disabled:pointer-events-none
              disabled:opacity-35
              sm:px-3
              sm:text-[8px]
            "
          >
            <RotateCcw
              className="h-3 w-3"
              aria-hidden="true"
            />

            <span>
              حذف همه
            </span>
          </button>
        </div>

        {/* =================================================
            SELECTIONS
        ================================================== */}

        <div
          className={[
            'min-w-0',
            compact
              ? 'w-full'
              : 'flex-1',
          ].join(' ')}
        >
          {activeFilters.length > 0 ? (
            <div
              className="
                flex
                w-full
                min-w-0
                items-center
                gap-1.5
                overflow-x-auto
                pb-0.5
                scrollbar-none
              "
            >
              {activeFilters.map(
                ([key, value]) => {
                  const group =
                    groups.find(
                      (item) =>
                        item.key === key,
                    )

                  const option =
                    group?.options.find(
                      (item) =>
                        item.slug ===
                        value,
                    )

                  return (
                    <button
                      key={`${key}-${value}`}
                      type="button"
                      onClick={() =>
                        onRemoveFilter(
                          key,
                        )
                      }
                      title={
                        option?.name ??
                        value
                      }
                      className="
                        group/chip
                        inline-flex
                        min-h-8
                        max-w-[220px]
                        shrink-0
                        items-center
                        gap-1.5
                        rounded-full
                        border
                        border-[#B79464]/22
                        bg-white/80
                        px-2.5
                        text-[7px]
                        font-black
                        text-[#76582F]
                        shadow-[0_4px_12px_rgba(183,148,100,0.06)]
                        backdrop-blur-md
                        transition-all
                        duration-300
                        hover:border-[#B79464]/40
                        hover:bg-white
                        sm:min-h-9
                        sm:px-3
                        sm:text-[8px]
                      "
                    >
                      <span className="shrink-0">
                        {FILTER_LABELS[key]}
                      </span>

                      <span
                        className="
                          shrink-0
                          text-[#B79464]/55
                        "
                      >
                        /
                      </span>

                      <span
                        className="
                          min-w-0
                          truncate
                        "
                      >
                        {option?.name ??
                          value}
                      </span>

                      <span
                        className="
                          flex
                          h-5
                          w-5
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-[#FBF8F2]
                          text-[#B79464]
                          transition-all
                          duration-300
                          group-hover/chip:bg-[#112F50]
                          group-hover/chip:text-white
                        "
                      >
                        <X
                          className="h-2.5 w-2.5"
                          aria-hidden="true"
                        />
                      </span>
                    </button>
                  )
                },
              )}
            </div>
          ) : (
            <div
              className="
                rounded-[13px]
                border
                border-dashed
                border-[#112F50]/[0.08]
                bg-white/35
                px-3
                py-2
                text-center
              "
            >
              <span
                className="
                  block
                  truncate
                  text-[7px]
                  font-bold
                  text-[#98A2B3]
                "
              >
                هنوز فیلتری انتخاب نشده
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

