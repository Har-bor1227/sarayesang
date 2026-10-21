'use client'

import { Filter } from 'lucide-react'

import type {
  CatalogFilterGroup,
  CatalogFilterKey,
  ProductSort,
} from '@/types/catalog'

import ActiveFilters from './ActiveFilters'
import { SORT_OPTIONS } from './constants'

interface MobileFilterToolbarProps {
  groups: CatalogFilterGroup[]
  sort: ProductSort
  mobileOpen: boolean
  activeFilters: [CatalogFilterKey, string][]
  activeFilterCount: number
  onOpen: () => void
  onChangeSort: (value: ProductSort) => void
  onRemoveFilter: (key: CatalogFilterKey) => void
  onClearFilters: () => void
}

export default function MobileFilterToolbar({
  groups,
  sort,
  mobileOpen,
  activeFilters,
  activeFilterCount,
  onOpen,
  onChangeSort,
  onRemoveFilter,
  onClearFilters,
}: MobileFilterToolbarProps) {
  return (
      <div className="lg:hidden">
        <section
          aria-label="فیلتر و مرتب‌سازی محصولات"
          className="
            relative
            space-y-2.5
          "
        >
          <div
            className="
              relative
              overflow-hidden
              rounded-[26px]
              border
              border-white/90
              bg-[linear-gradient(145deg,rgba(235,234,229,0.94),rgba(224,223,217,0.78))]
              p-2
              shadow-[0_18px_42px_rgba(17,47,80,0.105),0_4px_10px_rgba(17,47,80,0.035),inset_0_1px_0_rgba(255,255,255,0.96)]
              backdrop-blur-2xl
            "
          >
            <span
              className="
                pointer-events-none
                absolute
                -right-12
                -top-14
                h-32
                w-32
                rounded-full
                bg-[#B79464]/10
                blur-3xl
              "
              aria-hidden="true"
            />

            <div className="relative grid grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] gap-2">
              <button
                type="button"
                onClick={onOpen}
                aria-expanded={
                  mobileOpen
                }
                aria-controls="mobile-filter-sheet"
                className="
                  group
                  relative
                  flex
                  min-h-12
                  items-center
                  justify-center
                  gap-2
                  overflow-hidden
                  rounded-[18px]
                  bg-[linear-gradient(135deg,#112F50,#193F63)]
                  px-3
                  text-[10px]
                  font-black
                  text-white
                  shadow-[0_10px_24px_rgba(17,47,80,0.20)]
                  transition-all
                  duration-300
                  active:scale-[0.985]
                "
              >
                <span
                  className="
                    pointer-events-none
                    absolute
                    -right-4
                    -top-5
                    h-20
                    w-20
                    rounded-full
                    bg-[#B79464]/18
                    blur-xl
                  "
                  aria-hidden="true"
                />

                <span
                  className="
                    relative
                    flex
                    h-7
                    w-7
                    shrink-0
                    items-center
                    justify-center
                    rounded-[9px]
                    border
                    border-white/10
                    bg-white/10
                  "
                >
                  <Filter
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  />
                </span>

                <span className="relative">
                  فیلتر محصولات
                </span>

                {activeFilterCount >
                  0 && (
                  <span
                    className="
                      relative
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
                      shadow-[0_4px_10px_rgba(183,148,100,0.28)]
                    "
                  >
                    {activeFilterCount.toLocaleString(
                      'fa-IR',
                    )}
                  </span>
                )}
              </button>

              <select
                id="catalog-sort-mobile"
                aria-label="مرتب‌سازی محصولات"
                value={sort}
                onChange={(event) =>
                  onChangeSort(
                    event.target
                      .value as ProductSort,
                  )
                }
                className="
                  min-h-12
                  w-full
                  appearance-none
                  rounded-[18px]
                  border
                  border-white/80
                  bg-white/75
                  px-3
                  text-center
                  text-[10px]
                  font-black
                  text-[#112F50]
                  shadow-[inset_0_1px_0_rgba(255,255,255,0.96),0_5px_14px_rgba(17,47,80,0.035)]
                  outline-none
                  backdrop-blur-xl
                  transition-all
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
            </div>
          </div>

          {/* Fixed-height active-filter tray:
              It is ALWAYS present, preventing layout jump. */}
          <ActiveFilters
            activeFilters={activeFilters}
            groups={groups}
            activeFilterCount={activeFilterCount}
            onRemoveFilter={onRemoveFilter}
            onClearFilters={onClearFilters}
            compact
          />
        </section>
      </div>

  )
}
