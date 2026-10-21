'use client'

import {
  Check,
  ChevronDown,
} from 'lucide-react'

import type {
  CatalogFilterGroup,
  CatalogFilterKey,
  CatalogFilterSelection,
} from '@/types/catalog'

interface FilterGroupsProps {
  groups: CatalogFilterGroup[]
  values: CatalogFilterSelection
  openGroups: Set<CatalogFilterKey>
  onToggleGroup: (key: CatalogFilterKey) => void
  onToggle: (
    key: CatalogFilterKey,
    value: string,
  ) => void
  compact?: boolean
}

export default function FilterGroups({
  groups,
  values,
  openGroups,
  onToggleGroup,
  onToggle,
  compact = false,
}: FilterGroupsProps) {
  return (
      <div
        className={
          compact
            ? 'space-y-2.5'
            : 'space-y-3'
        }
      >
        {groups.map((group) => {
          const selected =
            values[group.key]

          const isOpen =
            openGroups.has(
              group.key,
            )

          return (
            <div
              key={group.key}
              className="
                group
                relative
                overflow-hidden
                rounded-[24px]
                border
                border-white/80
                bg-white/[0.66]
                shadow-[0_10px_26px_rgba(17,47,80,0.055),inset_0_1px_0_rgba(255,255,255,0.92)]
                backdrop-blur-2xl
                transition-all
                duration-300
                hover:shadow-[0_14px_32px_rgba(17,47,80,0.075),inset_0_1px_0_rgba(255,255,255,0.96)]
              "
            >
              {/* Subtle ambient light */}
              <span
                className="
                  pointer-events-none
                  absolute
                  -right-10
                  -top-12
                  h-28
                  w-28
                  rounded-full
                  bg-[#B79464]/[0.075]
                  blur-3xl
                "
                aria-hidden="true"
              />

              <button
                type="button"
                aria-expanded={
                  isOpen
                }
                onClick={() =>
                  onToggleGroup(
                    group.key,
                  )
                }
                className="
                  relative
                  flex
                  min-h-[68px]
                  w-full
                  items-center
                  justify-between
                  gap-3
                  px-4
                  text-right
                  outline-none
                  transition-all
                  duration-300
                  hover:bg-white/40
                  focus-visible:ring-2
                  focus-visible:ring-inset
                  focus-visible:ring-[#B79464]/40
                "
              >
                <span className="flex min-w-0 items-center gap-3">
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
                      bg-[linear-gradient(145deg,#fffdf9,#ede4d8)]
                      text-[#B79464]
                      shadow-[0_6px_16px_rgba(183,148,100,0.12)]
                    "
                  >
                    <span
                      className="
                        absolute
                        inset-[5px]
                        rounded-[9px]
                        border
                        border-[#B79464]/10
                      "
                      aria-hidden="true"
                    />

                    <span
                      className="
                        h-1.5
                        w-1.5
                        rounded-full
                        bg-current
                        shadow-[0_0_12px_rgba(183,148,100,0.45)]
                      "
                      aria-hidden="true"
                    />
                  </span>

                  <span className="min-w-0">
                    <span className="block text-[7px] font-black uppercase tracking-[0.20em] text-[#B79464]/75">
                      Filter
                    </span>

                    <span className="mt-1 block truncate text-[11px] font-black text-[#112F50]">
                      {group.label}
                    </span>
                  </span>

                  {selected && (
                    <span
                      className="
                        flex
                        h-6
                        min-w-6
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-[#B79464]/30
                        bg-[#112F50]
                        px-1.5
                        text-[8px]
                        font-black
                        text-white
                        shadow-[0_5px_14px_rgba(17,47,80,0.16)]
                      "
                    >
                      ۱
                    </span>
                  )}
                </span>

                <span
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#112F50]/[0.065]
                    bg-white/75
                    text-[#98A2B3]
                    shadow-[0_4px_12px_rgba(17,47,80,0.04)]
                    transition-all
                    duration-300
                    group-hover:border-[#B79464]/20
                    group-hover:text-[#76582F]
                  "
                >
                  <ChevronDown
                    className={[
                      'h-4 w-4 transition-transform duration-300',
                      isOpen
                        ? 'rotate-180'
                        : '',
                    ].join(' ')}
                    aria-hidden="true"
                  />
                </span>
              </button>

              {/* Accordion content */}
              <div
                className={[
                  'grid transition-[grid-template-rows,opacity] duration-300 ease-out',
                  isOpen
                    ? 'grid-rows-[1fr] opacity-100'
                    : 'grid-rows-[0fr] opacity-0',
                ].join(' ')}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="border-t border-[#112F50]/[0.055] px-2.5 pb-2.5 pt-2.5">
                    <div className="space-y-1.5">
                      {group.options.map(
                        (option) => {
                          const isActive =
                            selected ===
                            option.slug

                          return (
                            <button
                              key={
                                option.id
                              }
                              type="button"
                              aria-pressed={
                                isActive
                              }
                              onClick={() =>
                                onToggle(
                                  group.key,
                                  option.slug,
                                )
                              }
                              className={[
                                `
                                  relative
                                  flex
                                  min-h-12
                                  w-full
                                  items-center
                                  justify-between
                                  gap-3
                                  overflow-hidden
                                  rounded-[16px]
                                  border
                                  px-3.5
                                  text-right
                                  transition-all
                                  duration-300
                                `,
                                isActive
                                  ? `
                                    border-[#112F50]
                                    bg-[linear-gradient(135deg,#112F50,#193F63)]
                                    text-white
                                    shadow-[0_10px_24px_rgba(17,47,80,0.18)]
                                  `
                                  : `
                                    border-transparent
                                    bg-white/45
                                    text-[#667085]
                                    hover:border-[#B79464]/15
                                    hover:bg-[#FBF8F2]
                                    hover:text-[#112F50]
                                    hover:shadow-[0_8px_18px_rgba(17,47,80,0.055)]
                                  `,
                              ].join(
                                ' ',
                              )}
                            >
                              <span
                                className="
                                  pointer-events-none
                                  absolute
                                  inset-0
                                  bg-[radial-gradient(circle_at_88%_50%,rgba(183,148,100,0.12),transparent_35%)]
                                  opacity-0
                                  transition-opacity
                                  duration-300
                                "
                                aria-hidden="true"
                              />

                              <span className="relative flex min-w-0 items-center gap-3">
                                <span
                                  className={[
                                    `
                                      flex
                                      h-6
                                      w-6
                                      shrink-0
                                      items-center
                                      justify-center
                                      rounded-[8px]
                                      border
                                      transition-all
                                      duration-300
                                    `,
                                    isActive
                                      ? `
                                        border-[#D5B98A]
                                        bg-[#B79464]
                                        text-[#112F50]
                                        shadow-[0_4px_12px_rgba(183,148,100,0.24)]
                                      `
                                      : `
                                        border-[#112F50]/[0.10]
                                        bg-white/90
                                        text-transparent
                                      `,
                                  ].join(
                                    ' ',
                                  )}
                                >
                                  {isActive && (
                                    <Check
                                      className="h-3.5 w-3.5"
                                      strokeWidth={
                                        3
                                      }
                                      aria-hidden="true"
                                    />
                                  )}
                                </span>

                                <span
                                  className={[
                                    'min-w-0 truncate text-[10px] font-extrabold sm:text-[11px]',
                                    isActive
                                      ? 'text-white'
                                      : '',
                                  ].join(
                                    ' ',
                                  )}
                                >
                                  {
                                    option.name
                                  }
                                </span>
                              </span>

                              <span
                                className={[
                                  `
                                    relative
                                    shrink-0
                                    rounded-full
                                    px-2
                                    py-1
                                    text-[8px]
                                    font-black
                                  `,
                                  isActive
                                    ? 'bg-white/10 text-white/60'
                                    : 'bg-[#112F50]/[0.035] text-[#98A2B3]',
                                ].join(
                                  ' ',
                                )}
                              >
                                {option.count.toLocaleString(
                                  'fa-IR',
                                )}
                              </span>
                            </button>
                          )
                        },
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

  )
}
