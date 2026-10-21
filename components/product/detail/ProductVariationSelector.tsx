'use client'

import {
  Check,
  ChevronDown,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react'

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import type {
  ProductDetailAttribute,
  ProductDetailVariation,
  ProductDetailVariationAttribute,
} from './types'

type SelectionMap = Record<string, string>

type StateUpdate<T> =
  | T
  | ((current: T) => T)

type SelectionState = {
  key: string
  value: SelectionMap
}

type ProductVariationSelectorProps = {
  attributes: ProductDetailAttribute[]
  variations: ProductDetailVariation[]
  defaultAttributes?: ProductDetailVariationAttribute[] | null
  onVariationChange?: (
    variation: ProductDetailVariation | null,
    selections: SelectionMap,
  ) => void
}

type VariationAttributeGroup = {
  slug: string
  id?: string
  name: string
  options: string[]
}

function normalizeValue(value?: string | null): string {
  return (
    value
      ?.replace(/\u200c/g, ' ')
      .replace(/ي/g, 'ی')
      .replace(/ك/g, 'ک')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase() || ''
  )
}

function getAttributeValue(
  variation: ProductDetailVariation,
  slug: string,
): string | null {
  const normalizedSlug = normalizeValue(slug)

  const attribute = variation.attributes.find(
    (item) => normalizeValue(item.slug) === normalizedSlug,
  )

  return attribute?.option?.trim() || null
}

function variationMatchesSelection(
  variation: ProductDetailVariation,
  selections: SelectionMap,
  ignoredSlug?: string,
): boolean {
  for (const [slug, option] of Object.entries(selections)) {
    if (slug === ignoredSlug) {
      continue
    }

    const variationOption = getAttributeValue(
      variation,
      slug,
    )

    if (
      !variationOption ||
      normalizeValue(variationOption) !== normalizeValue(option)
    ) {
      return false
    }
  }

  return true
}

function getExactVariation(
  variations: ProductDetailVariation[],
  groups: VariationAttributeGroup[],
  selections: SelectionMap,
): ProductDetailVariation | null {
  if (groups.length === 0) {
    return null
  }

  const hasAllSelections = groups.every((group) =>
    Boolean(selections[group.slug]),
  )

  if (!hasAllSelections) {
    return null
  }

  return (
    variations.find((variation) =>
      groups.every((group) => {
        const selected = selections[group.slug]
        const value = getAttributeValue(variation, group.slug)

        return (
          Boolean(selected) &&
          Boolean(value) &&
          normalizeValue(selected) === normalizeValue(value)
        )
      }),
    ) ?? null
  )
}

function uniqueOptions(options: string[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []

  for (const option of options) {
    const normalized = normalizeValue(option)

    if (!normalized || seen.has(normalized)) {
      continue
    }

    seen.add(normalized)
    result.push(option.trim())
  }

  return result
}

function variationHasOption(
  variations: ProductDetailVariation[],
  slug: string,
  option: string,
): boolean {
  const normalizedOption = normalizeValue(option)

  return variations.some((variation) => {
    const value = getAttributeValue(variation, slug)

    return (
      Boolean(value) &&
      normalizeValue(value) === normalizedOption
    )
  })
}

function buildVariationGroups(
  attributes: ProductDetailAttribute[],
  variations: ProductDetailVariation[],
): VariationAttributeGroup[] {
  const variationAttributeMap = new Map<
    string,
    {
      id?: string
      name: string
      options: Set<string>
    }
  >()

  for (const variation of variations) {
    for (const attribute of variation.attributes) {
      const slug = attribute.slug.trim()

      if (!slug) {
        continue
      }

      const normalizedSlug = normalizeValue(slug)
      const existing = variationAttributeMap.get(normalizedSlug)

      if (existing) {
        if (attribute.option?.trim()) {
          existing.options.add(attribute.option.trim())
        }

        continue
      }

      variationAttributeMap.set(normalizedSlug, {
        id: attribute.id,
        name: attribute.name?.trim() || slug,
        options: new Set(
          attribute.option?.trim()
            ? [attribute.option.trim()]
            : [],
        ),
      })
    }
  }

  const groups: VariationAttributeGroup[] = []
  const usedSlugs = new Set<string>()

  for (const attribute of attributes) {
    const matched = Array.from(
      variationAttributeMap.entries(),
    ).find(([normalizedSlug, data]) => {
      const sameId = Boolean(
        data.id &&
          attribute.id &&
          data.id === attribute.id,
      )

      const sameName =
        normalizeValue(data.name) ===
        normalizeValue(attribute.name)

      return (
        !usedSlugs.has(normalizedSlug) &&
        (sameId || sameName)
      )
    })

    if (!matched) {
      continue
    }

    const [normalizedSlug, data] = matched

    const realSlug =
      Array.from(data.options).length >= 0
        ? (
            variations
              .flatMap((variation) => variation.attributes)
              .find(
                (item) =>
                  normalizeValue(item.slug) === normalizedSlug,
              )?.slug || normalizedSlug
          )
        : normalizedSlug

    const parentOptions = Array.isArray(attribute.options)
      ? attribute.options.filter((option) =>
          variationHasOption(
            variations,
            realSlug,
            option,
          ),
        )
      : []

    const options = uniqueOptions([
      ...parentOptions,
      ...Array.from(data.options),
    ])

    if (options.length === 0) {
      continue
    }

    groups.push({
      slug: realSlug,
      id: data.id || attribute.id,
      name: attribute.name?.trim() || data.name,
      options,
    })

    usedSlugs.add(normalizedSlug)
  }

  for (const [normalizedSlug, data] of variationAttributeMap) {
    if (usedSlugs.has(normalizedSlug)) {
      continue
    }

    const options = uniqueOptions(Array.from(data.options))

    if (options.length === 0) {
      continue
    }

    const realSlug =
      variations
        .flatMap((variation) => variation.attributes)
        .find(
          (item) =>
            normalizeValue(item.slug) === normalizedSlug,
        )?.slug || normalizedSlug

    groups.push({
      slug: realSlug,
      id: data.id,
      name: data.name,
      options,
    })

    usedSlugs.add(normalizedSlug)
  }

  return groups
}

function buildInitialSelections(
  defaultAttributes:
    | ProductDetailVariationAttribute[]
    | null
    | undefined,
  groups: VariationAttributeGroup[],
): SelectionMap {
  const selection: SelectionMap = {}

  if (!Array.isArray(defaultAttributes)) {
    return selection
  }

  for (const attribute of defaultAttributes) {
    const matchingGroup = groups.find(
      (group) =>
        normalizeValue(group.slug) ===
          normalizeValue(attribute.slug) ||
        Boolean(
          group.id &&
            attribute.id &&
            group.id === attribute.id,
        ),
    )

    if (!matchingGroup) {
      continue
    }

    const matchingOption = matchingGroup.options.find(
      (option) =>
        normalizeValue(option) ===
        normalizeValue(attribute.option),
    )

    if (matchingOption) {
      selection[matchingGroup.slug] = matchingOption
    }
  }

  return selection
}

function selectionIsValidForGroup(
  variations: ProductDetailVariation[],
  slug: string,
  option: string,
  selections: SelectionMap,
): boolean {
  return variations.some((variation) => {
    const variationOption = getAttributeValue(
      variation,
      slug,
    )

    if (
      !variationOption ||
      normalizeValue(variationOption) !== normalizeValue(option)
    ) {
      return false
    }

    return variationMatchesSelection(
      variation,
      selections,
      slug,
    )
  })
}

function pruneIncompatibleSelections(
  variations: ProductDetailVariation[],
  groups: VariationAttributeGroup[],
  selections: SelectionMap,
  changedSlug: string,
): SelectionMap {
  const next = { ...selections }

  const orderedGroups = groups.map((group) => group.slug)
  const changedIndex = orderedGroups.indexOf(changedSlug)

  for (const group of groups) {
    if (group.slug === changedSlug) {
      continue
    }

    const selected = next[group.slug]

    if (!selected) {
      continue
    }

    const valid = selectionIsValidForGroup(
      variations,
      group.slug,
      selected,
      next,
    )

    if (!valid) {
      delete next[group.slug]
    }
  }

  if (changedIndex >= 0) {
    const changedValue = next[changedSlug]

    if (!changedValue) {
      return next
    }

    for (
      let index = changedIndex + 1;
      index < groups.length;
      index += 1
    ) {
      const slug = groups[index].slug
      const selected = next[slug]

      if (!selected) {
        continue
      }

      const valid = selectionIsValidForGroup(
        variations,
        slug,
        selected,
        next,
      )

      if (!valid) {
        delete next[slug]
      }
    }
  }

  return next
}

function selectionsToKey(selections: SelectionMap): string {
  return Object.entries(selections)
    .sort(([first], [second]) => first.localeCompare(second))
    .map(
      ([slug, option]) =>
        `${slug}:${normalizeValue(option)}`,
    )
    .join('|')
}

export default function ProductVariationSelector({
  attributes,
  variations,
  defaultAttributes,
  onVariationChange,
}: ProductVariationSelectorProps) {
  const groups = useMemo(
    () => buildVariationGroups(attributes, variations),
    [attributes, variations],
  )

  const initialSelections = useMemo(
    () =>
      buildInitialSelections(
        defaultAttributes,
        groups,
      ),
    [defaultAttributes, groups],
  )

  const initialSelectionKey = useMemo(
    () => selectionsToKey(initialSelections),
    [initialSelections],
  )

  /*
   * Keep draft selections associated with the default selection
   * they were created from. If defaults change, derive the new
   * selection immediately rather than calling setState in an effect.
   */
  const [selectionState, setSelectionState] =
    useState<SelectionState>(() => ({
      key: initialSelectionKey,
      value: initialSelections,
    }))

  const selections =
    selectionState.key === initialSelectionKey
      ? selectionState.value
      : initialSelections

  function setSelections(
    update: StateUpdate<SelectionMap>,
  ) {
    setSelectionState((current) => {
      const currentSelections =
        current.key === initialSelectionKey
          ? current.value
          : initialSelections

      const nextSelections =
        typeof update === 'function'
          ? update(currentSelections)
          : update

      return {
        key: initialSelectionKey,
        value: nextSelections,
      }
    })
  }

  const [openSlug, setOpenSlug] =
    useState<string | null>(null)

  /*
   * A slug that no longer exists in the current product data
   * is treated as closed. This replaces a state-resetting effect.
   */
  const visibleOpenSlug =
    openSlug &&
    groups.some((group) => group.slug === openSlug)
      ? openSlug
      : null

  const rootRef = useRef<HTMLElement | null>(null)

  const onVariationChangeRef = useRef(onVariationChange)

  useEffect(() => {
    onVariationChangeRef.current = onVariationChange
  }, [onVariationChange])

  /*
   * Close the option menu on outside click or Escape.
   * State changes happen in event handlers, not in the effect body.
   */
  useEffect(() => {
    if (!visibleOpenSlug) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target

      if (
        target instanceof Node &&
        rootRef.current?.contains(target)
      ) {
        return
      }

      setOpenSlug(null)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenSlug(null)
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
  }, [visibleOpenSlug])

  const selectedVariation = useMemo(
    () =>
      getExactVariation(
        variations,
        groups,
        selections,
      ),
    [variations, groups, selections],
  )

  const availableOptionsBySlug = useMemo(() => {
    const result: Record<string, Set<string>> = {}

    for (const group of groups) {
      const available = new Set<string>()

      for (const option of group.options) {
        if (
          selectionIsValidForGroup(
            variations,
            group.slug,
            option,
            selections,
          )
        ) {
          available.add(normalizeValue(option))
        }
      }

      result[group.slug] = available
    }

    return result
  }, [groups, selections, variations])

  useEffect(() => {
    onVariationChangeRef.current?.(
      selectedVariation,
      selections,
    )
  }, [selectedVariation, selections])

  const handleSelect = (
    slug: string,
    option: string,
  ) => {
    setSelections((current) => {
      const next = {
        ...current,
        [slug]: option,
      }

      return pruneIncompatibleSelections(
        variations,
        groups,
        next,
        slug,
      )
    })

    setOpenSlug(null)
  }

  const handleClear = (slug: string) => {
    setSelections((current) => {
      const next = { ...current }
      delete next[slug]
      return next
    })

    setOpenSlug(null)
  }

  const selectedCount = groups.filter(
    (group) => Boolean(selections[group.slug]),
  ).length

  const allSelected =
    groups.length > 0 &&
    selectedCount === groups.length

  if (groups.length === 0) {
    return null
  }

  return (
    <section
      ref={rootRef}
      className="
        relative mt-0 rounded-[18px] border
        border-[#112F50]/[0.08] bg-white shadow-none
      "
      aria-labelledby="product-variation-title"
    >
      <div
        className="
          border-b border-[#112F50]/[0.07]
          bg-[linear-gradient(135deg,#FCFAF5_0%,#F8F4EC_100%)]
          px-4 py-4 sm:px-5 sm:py-5
        "
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="
                flex h-10 w-10 shrink-0 items-center
                justify-center rounded-[12px] bg-[#112F50]
                text-white shadow-[0_10px_24px_rgba(17,47,80,0.14)]
              "
            >
              <SlidersHorizontal className="h-4.5 w-4.5" />
            </div>

            <div className="min-w-0">
              <span className="block text-[12px] font-black tracking-normal text-[#B79464] sm:text-[12px]">
                انتخاب سنگ
              </span>

              <h2
                id="product-variation-title"
                className="
                  mt-0.5 break-words text-[15px] font-black
                  tracking-[-0.02em] text-[#112F50] sm:text-[18px]
                "
              >
                مشخصات سفارش
              </h2>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span
              className="
                rounded-full bg-white/80 px-2.5 py-1.5
                text-[12px] font-black text-[#7D6A50]
              "
            >
              {selectedCount}/{groups.length}
            </span>
          </div>
        </div>

        <p className="mt-3 text-[12px] font-medium leading-6 text-[#727C85] sm:text-[12px]">
          گزینه‌ها را انتخاب کنید؛ فقط ترکیب‌های موجود قابل انتخاب هستند.
        </p>
      </div>

      <div className="px-4 py-4 sm:px-5 sm:py-5">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {groups.map((group, groupIndex) => {
            const selected = selections[group.slug]
            const isOpen = visibleOpenSlug === group.slug

            const availableOptions =
              availableOptionsBySlug[group.slug] ??
              new Set<string>()

            const menuId =
              `variation-menu-${groupIndex}-${group.slug.replace(
                /[^a-zA-Z0-9-_]/g,
                '-',
              )}`

            return (
              <div
                key={group.slug}
                className="relative"
              >
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className="
                        flex h-6 w-6 shrink-0 items-center
                        justify-center rounded-[8px] bg-[#F0E7DA]
                        text-[12px] font-black text-[#9A784B]
                      "
                    >
                      {String(groupIndex + 1).padStart(2, '0')}
                    </span>

                    <span className="truncate text-[12px] font-black text-[#112F50] sm:text-[13px]">
                      {group.name}
                    </span>
                  </div>

                  {selected && (
                    <span className="max-w-[45%] truncate text-[12px] font-bold text-[#A07F52]">
                      {selected}
                    </span>
                  )}
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenSlug((current) =>
                        current === group.slug
                          ? null
                          : group.slug,
                      )
                    }
                    aria-expanded={isOpen}
                    aria-controls={menuId}
                    className={[
                      'flex w-full min-h-[50px] items-center justify-between gap-3 rounded-[15px] border px-3.5 py-2.5 text-right transition-all duration-200',
                      selected
                        ? 'border-[#112F50]/15 bg-[#112F50]/[0.025] shadow-[0_7px_18px_rgba(17,47,80,0.035)]'
                        : 'border-[#112F50]/[0.08] bg-[#FBFBF9] hover:border-[#B79464]/45 hover:bg-[#FBF8F2]',
                      isOpen
                        ? 'border-[#B79464]/55 ring-4 ring-[#B79464]/[0.07]'
                        : '',
                    ].join(' ')}
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span
                        className={[
                          'flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px]',
                          selected
                            ? 'bg-[#112F50] text-white'
                            : 'bg-white text-[#A0A7AE]',
                        ].join(' ')}
                      >
                        {selected ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <SlidersHorizontal className="h-3.5 w-3.5" />
                        )}
                      </span>

                      <span
                        className={[
                          'min-w-0 truncate text-[12px] font-black sm:text-[13px]',
                          selected
                            ? 'text-[#112F50]'
                            : 'text-[#8B949C]',
                        ].join(' ')}
                      >
                        {selected || 'انتخاب کنید'}
                      </span>
                    </div>

                    <ChevronDown
                      className={[
                        'h-4 w-4 shrink-0 text-[#B79464] transition-transform duration-200',
                        isOpen ? 'rotate-180' : '',
                      ].join(' ')}
                      aria-hidden="true"
                    />
                  </button>

                  {isOpen && (
                    <div
                      id={menuId}
                      role="listbox"
                      aria-label={group.name}
                      className="
                        absolute inset-x-0 top-full z-50 mt-2
                        overflow-hidden rounded-[16px] border
                        border-[#112F50]/[0.09] bg-white p-1.5
                        shadow-[0_20px_45px_rgba(10,25,41,0.14)]
                      "
                    >
                      {selected && (
                        <button
                          type="button"
                          onClick={() => handleClear(group.slug)}
                          className="
                            mb-1 flex w-full items-center
                            justify-between rounded-[11px] px-3 py-2.5
                            text-right transition-colors hover:bg-[#FFF7EE]
                          "
                        >
                          <span className="text-[12px] font-black text-[#9A784B]">
                            پاک کردن انتخاب
                          </span>

                          <RotateCcw className="h-3.5 w-3.5 text-[#B79464]" />
                        </button>
                      )}

                      <div
                        className="
                          max-h-[280px] overflow-y-auto
                          overscroll-contain [scrollbar-width:thin]
                        "
                      >
                        {group.options.map((option) => {
                          const isSelected =
                            Boolean(selected) &&
                            normalizeValue(selected) ===
                              normalizeValue(option)

                          const isAvailable =
                            availableOptions.has(
                              normalizeValue(option),
                            )

                          return (
                            <button
                              key={option}
                              type="button"
                              role="option"
                              aria-selected={isSelected}
                              disabled={!isAvailable}
                              onClick={() =>
                                handleSelect(group.slug, option)
                              }
                              className={[
                                'flex w-full items-center justify-between gap-3 rounded-[11px] px-3 py-2.5 text-right transition-all duration-150',
                                isSelected
                                  ? 'bg-[#112F50] text-white'
                                  : isAvailable
                                    ? 'text-[#112F50] hover:bg-[#FBF8F2]'
                                    : 'cursor-not-allowed text-[#B3B8BD] opacity-55',
                              ].join(' ')}
                            >
                              <span className="min-w-0 truncate text-[12px] font-black sm:text-[12px]">
                                {option}
                              </span>

                              {isSelected && (
                                <Check className="h-3.5 w-3.5 shrink-0" />
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div
          className="
            mt-4 flex items-center justify-between gap-3
            rounded-[14px] border border-[#B79464]/15
            bg-[#FBF8F2] px-3 py-2.5
          "
        >
          <div className="flex min-w-0 items-center gap-2">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#B79464]" />

            <p className="text-[12px] font-medium leading-5 text-[#6D7781] sm:text-[12px]">
              فقط ترکیب‌های تعریف‌شده در سیستم قابل انتخاب هستند.
            </p>
          </div>

          <span
            className={[
              'shrink-0 rounded-full px-2.5 py-1 text-[12px] font-black sm:text-[12px]',
              allSelected
                ? 'bg-[#E9F3EC] text-[#41724B]'
                : 'bg-white text-[#8C7453]',
            ].join(' ')}
          >
            {allSelected ? 'ترکیب کامل' : 'در حال انتخاب'}
          </span>
        </div>

        {selectedVariation && (
          <div
            className="
              mt-2.5 flex items-center justify-between gap-3
              rounded-[14px] border border-[#112F50]/[0.07]
              bg-white px-3 py-2.5
            "
          >
            <span className="text-[12px] font-bold text-[#7A838D] sm:text-[12px]">
              شناسه ترکیب
            </span>

            <span
              className="
                rounded-full bg-[#F3ECE1] px-2.5 py-1
                text-[12px] font-black text-[#927248]
              "
            >
              #{selectedVariation.id}
            </span>
          </div>
        )}
      </div>
    </section>
  )
}