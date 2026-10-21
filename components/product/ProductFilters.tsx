'use client'

import {
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react'

import {
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation'

import type {
  CatalogFilterGroup,
  CatalogFilterKey,
  CatalogFilterSelection,
  ProductSort,
} from '@/types/catalog'

import DesktopFilterConsole from './filters/DesktopFilterConsole'
import MobileFilterSheet from './filters/MobileFilterSheet'
import MobileFilterToolbar from './filters/MobileFilterToolbar'
import {
  EMPTY_SELECTION,
  FILTER_KEYS,
} from './filters/constants'
import { getActiveFilterCount } from './filters/utils'

interface ProductFiltersProps {
  groups: CatalogFilterGroup[]
  selection: CatalogFilterSelection
  sort: ProductSort
}

type StateUpdate<T> =
  | T
  | ((current: T) => T)

interface DraftSelectionState {
  committed: CatalogFilterSelection
  value: CatalogFilterSelection
}

interface DraftSortState {
  committed: ProductSort
  value: ProductSort
}

/**
 * Compare filter values rather than object references.
 *
 * This keeps staged filters intact when the parent renders
 * a new selection object with the same committed values.
 */
function selectionsAreEqual(
  first: CatalogFilterSelection,
  second: CatalogFilterSelection,
): boolean {
  return FILTER_KEYS.every(
    (key) => first[key] === second[key],
  )
}

export default function ProductFilters({
  groups,
  selection,
  sort,
}: ProductFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [isPending, startTransition] =
    useTransition()

  const [mobileOpen, setMobileOpen] =
    useState(false)

  /*
   * Draft filters retain the committed selection they
   * were created from.
   *
   * When the committed selection changes, the effective
   * draft automatically falls back to the new selection.
   * No synchronization effect or cascading render is needed.
   */
  const [draftSelectionState, setDraftSelectionState] =
    useState<DraftSelectionState>(() => ({
      committed: selection,
      value: selection,
    }))

  const draftSelection = selectionsAreEqual(
    draftSelectionState.committed,
    selection,
  )
    ? draftSelectionState.value
    : selection

  function setDraftSelection(
    update: StateUpdate<CatalogFilterSelection>,
  ) {
    setDraftSelectionState((current) => {
      const currentValue = selectionsAreEqual(
        current.committed,
        selection,
      )
        ? current.value
        : selection

      const nextValue =
        typeof update === 'function'
          ? update(currentValue)
          : update

      return {
        committed: selection,
        value: nextValue,
      }
    })
  }

  /*
   * Sort uses the same committed/draft pattern.
   *
   * While the mobile sheet is closed, a changed server sort
   * is reflected immediately. While the sheet is open,
   * temporary sort choices are preserved until Apply or Close.
   */
  const [draftSortState, setDraftSortState] =
    useState<DraftSortState>(() => ({
      committed: sort,
      value: sort,
    }))

  const draftSort =
    !mobileOpen &&
    draftSortState.committed !== sort
      ? sort
      : draftSortState.value

  function setDraftSort(
    update: StateUpdate<ProductSort>,
  ) {
    setDraftSortState((current) => {
      const currentValue =
        !mobileOpen &&
        current.committed !== sort
          ? sort
          : current.value

      const nextValue =
        typeof update === 'function'
          ? update(currentValue)
          : update

      return {
        committed: sort,
        value: nextValue,
      }
    })
  }

  /*
   * Explicit accordion state.
   *
   * Empty by default means all filter tabs are closed.
   */
  const [openGroups, setOpenGroups] =
    useState<Set<CatalogFilterKey>>(
      () => new Set(),
    )

  const pendingScrollY =
    useRef<number | null>(null)

  /*
   * Committed filters are represented by the URL/server state.
   */
  const activeFilters =
    Object.entries(selection).filter(
      ([, value]) => Boolean(value),
    ) as [
      CatalogFilterKey,
      string,
    ][]

  /*
   * Draft filters are staged in the filter console.
   */
  const draftFilters =
    Object.entries(draftSelection).filter(
      ([, value]) => Boolean(value),
    ) as [
      CatalogFilterKey,
      string,
    ][]

  const activeFilterCount =
    getActiveFilterCount(selection)

  const draftFilterCount =
    getActiveFilterCount(draftSelection)

  const hasDraftFilterChanges =
    FILTER_KEYS.some(
      (key) =>
        draftSelection[key] !== selection[key],
    )

  /*
   * Restore the exact viewport position after the
   * router.replace RSC refresh completes.
   */
  useEffect(() => {
    if (pendingScrollY.current === null) {
      return
    }

    const targetY = pendingScrollY.current

    pendingScrollY.current = null

    let frameOne = 0
    let frameTwo = 0

    frameOne = requestAnimationFrame(() => {
      window.scrollTo({
        top: targetY,
        left: 0,
        behavior: 'instant',
      })

      frameTwo = requestAnimationFrame(() => {
        window.scrollTo({
          top: targetY,
          left: 0,
          behavior: 'instant',
        })
      })
    })

    return () => {
      cancelAnimationFrame(frameOne)
      cancelAnimationFrame(frameTwo)
    }
  }, [
    selection,
    sort,
  ])

  /*
   * Lock body scrolling while the mobile filter sheet
   * is open.
   */
  useEffect(() => {
    if (!mobileOpen) {
      document.body.style.overflow = ''
      return
    }

    const previousOverflow =
      document.body.style.overflow

    document.body.style.overflow = 'hidden'

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === 'Escape') {
        setDraftSortState({
          committed: sort,
          value: sort,
        })

        setMobileOpen(false)
      }
    }

    window.addEventListener(
      'keydown',
      handleKeyDown,
    )

    return () => {
      document.body.style.overflow =
        previousOverflow

      window.removeEventListener(
        'keydown',
        handleKeyDown,
      )
    }
  }, [
    mobileOpen,
    sort,
  ])

  /*
   * Close the mobile sheet and discard temporary sort changes.
   */
  function closeMobileSheet() {
    setDraftSort(sort)
    setMobileOpen(false)
  }

  /*
   * Apply a route change.
   *
   * Only this function commits filters or sort to the URL.
   */
  function navigate(
    update: (
      params: URLSearchParams,
    ) => void,
  ) {
    pendingScrollY.current = window.scrollY

    const params = new URLSearchParams(
      searchParams.toString(),
    )

    params.delete('page')
    params.delete('after')

    update(params)

    const query = params.toString()

    const href = query
      ? `${pathname}?${query}`
      : pathname

    startTransition(() => {
      router.replace(href, {
        scroll: false,
      })
    })
  }

  /*
   * Desktop / staged filter toggle.
   * This does not navigate.
   */
  function updateDraftFilter(
    key: CatalogFilterKey,
    value: string,
  ) {
    setDraftSelection((current) => ({
      ...current,
      [key]:
        current[key] === value
          ? undefined
          : value,
    }))
  }

  /*
   * Remove a staged desktop filter.
   */
  function removeDraftFilter(
    key: CatalogFilterKey,
  ) {
    setDraftSelection((current) => ({
      ...current,
      [key]: undefined,
    }))
  }

  /*
   * Clear all staged desktop filters.
   */
  function clearDraftFilters() {
    setDraftSelection({
      ...EMPTY_SELECTION,
    })
  }

  /*
   * Restore staged filters to the current committed selection.
   */
  function cancelDraftChanges() {
    setDraftSelection(selection)
  }

  /*
   * Apply staged desktop filters.
   */
  function applyDesktopFilters() {
    if (!hasDraftFilterChanges) {
      return
    }

    navigate((params) => {
      FILTER_KEYS.forEach((key) => {
        params.delete(key)

        const value = draftSelection[key]

        if (value) {
          params.set(key, value)
        }
      })
    })
  }

  /*
   * Remove an already-applied filter from the mobile toolbar.
   */
  function removeAppliedFilter(
    key: CatalogFilterKey,
  ) {
    navigate((params) => {
      params.delete(key)
    })
  }

  /*
   * Clear all already-applied filters.
   */
  function clearAppliedFilters() {
    navigate((params) => {
      FILTER_KEYS.forEach((key) => {
        params.delete(key)
      })
    })
  }

  /*
   * Update a temporary mobile filter.
   */
  function updateMobileDraft(
    key: CatalogFilterKey,
    value: string,
  ) {
    setDraftSelection((current) => ({
      ...current,
      [key]:
        current[key] === value
          ? undefined
          : value,
    }))
  }

  function clearMobileDraft() {
    setDraftSelection({
      ...EMPTY_SELECTION,
    })

    setDraftSort('newest')
  }

  /*
   * Desktop sort remains immediate.
   */
  function changeSort(
    value: ProductSort,
  ) {
    navigate((params) => {
      if (value === 'newest') {
        params.delete('sort')
      } else {
        params.set('sort', value)
      }
    })
  }

  /*
   * Apply mobile filters and sort together.
   */
  function applyMobileFilters() {
    navigate((params) => {
      FILTER_KEYS.forEach((key) => {
        params.delete(key)

        const value = draftSelection[key]

        if (value) {
          params.set(key, value)
        }
      })

      if (draftSort === 'newest') {
        params.delete('sort')
      } else {
        params.set('sort', draftSort)
      }
    })

    closeMobileSheet()
  }

  function toggleGroup(
    key: CatalogFilterKey,
  ) {
    setOpenGroups((current) => {
      const next = new Set(current)

      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }

      return next
    })
  }

  function openMobileSheet() {
    setDraftSelection(selection)
    setDraftSort(sort)
    setMobileOpen(true)
  }

  return (
    <div className="relative space-y-4">
      <MobileFilterToolbar
        groups={groups}
        sort={sort}
        mobileOpen={mobileOpen}
        activeFilters={activeFilters}
        activeFilterCount={activeFilterCount}
        onOpen={openMobileSheet}
        onChangeSort={changeSort}
        onRemoveFilter={removeAppliedFilter}
        onClearFilters={clearAppliedFilters}
      />

      <DesktopFilterConsole
        groups={groups}
        selection={draftSelection}
        sort={sort}
        activeFilters={draftFilters}
        activeFilterCount={draftFilterCount}
        hasPendingChanges={hasDraftFilterChanges}
        openGroups={openGroups}
        onToggleGroup={toggleGroup}
        onToggleFilter={updateDraftFilter}
        onRemoveFilter={removeDraftFilter}
        onClearFilters={clearDraftFilters}
        onCancelChanges={cancelDraftChanges}
        onApplyFilters={applyDesktopFilters}
        onChangeSort={changeSort}
      />

      <MobileFilterSheet
        open={mobileOpen}
        groups={groups}
        draftSelection={draftSelection}
        draftSort={draftSort}
        draftFilterCount={draftFilterCount}
        openGroups={openGroups}
        onToggleGroup={toggleGroup}
        onUpdateDraft={updateMobileDraft}
        onSetDraftSort={setDraftSort}
        onClearDraft={clearMobileDraft}
        onApply={applyMobileFilters}
        onClose={closeMobileSheet}
      />

      {isPending && (
        <div
          className="
            pointer-events-none
            fixed
            left-1/2
            top-3
            z-[120]
            -translate-x-1/2
            rounded-full
            border
            border-white/80
            bg-white/80
            px-3
            py-1.5
            text-[7px]
            font-black
            text-[#112F50]
            opacity-90
            shadow-[0_8px_24px_rgba(17,47,80,0.12)]
            backdrop-blur-xl
            lg:top-5
          "
          aria-hidden="true"
        >
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#B79464]" />
            در حال بروزرسانی
          </span>
        </div>
      )}
    </div>
  )
}