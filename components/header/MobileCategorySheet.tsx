'use client'

import Link from 'next/link'
import {
  ChevronLeft,
  Layers3,
} from 'lucide-react'
import {
  useMemo,
  useState,
} from 'react'

import type {
  ProductCategoryNode,
} from '@/types/wordpress'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

interface MobileCategorySheetProps {
  categories: ProductCategoryNode[]
}

export default function MobileCategorySheet({
  categories,
}: MobileCategorySheetProps) {
  const [open, setOpen] = useState(false)
  const [selectedParentId, setSelectedParentId] =
    useState<string | null>(null)

  const rootCategories = useMemo(
    () =>
      categories.filter(
        (category) =>
          !category.parentId ||
          category.parentId === '0',
      ),
    [categories],
  )

  // Derive a valid selection instead of synchronizing state
  // through an effect when the categories change.
  const activeParentId = rootCategories.some(
    (category) => category.id === selectedParentId,
  )
    ? selectedParentId
    : rootCategories[0]?.id ?? null

  const activeParent =
    rootCategories.find(
      (category) => category.id === activeParentId,
    ) ?? null

  const children = useMemo(
    () =>
      activeParent
        ? categories.filter(
            (category) =>
              category.parentId === activeParent.id,
          )
        : [],
    [categories, activeParent],
  )

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
    >
      {/* Trigger */}
      <button
        type="button"
        aria-label="دسته‌بندی‌های سنگ"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="
          group
          relative
          flex
          min-w-0
          flex-1
          flex-col
          items-center
          justify-center
          rounded-[18px]
          px-1
          text-[9px]
          font-bold
          text-[#667085]
          transition-all
          duration-200
          active:scale-[0.94]
        "
      >
        <span
          aria-hidden="true"
          className="
            relative
            mb-0.5
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-[13px]
            transition-all
            duration-200
            group-hover:bg-[#F3F0E9]
            group-hover:text-[#76582F]
          "
        >
          <Layers3
            className="h-[19px] w-[19px]"
            strokeWidth={1.8}
          />
        </span>

        <span className="leading-none">
          دسته‌بندی‌ها
        </span>
      </button>

      {/* Sidebar from the right */}
      <SheetContent
        side="right"
        dir="rtl"
        className="
          !right-0
          !left-auto
          top-0
          bottom-0
          w-[70vw]
          max-w-[390px]
          border-l
          border-[#E6E3DD]
          bg-[#FCFCFB]/[0.96]
          p-0
          text-[#112F50]
          shadow-[-18px_0_55px_rgba(10,25,41,0.16)]
          backdrop-blur-2xl
          data-[state=open]:slide-in-from-right
          data-[state=closed]:slide-out-to-right
        "
      >
        {/* Header */}
        <SheetHeader
          className="
            shrink-0
            border-b
            border-[#E9E7E2]
            bg-white/[0.72]
            px-4
            pb-3
            pt-4
            text-right
          "
        >
          <SheetTitle
            className="
              text-[14px]
              font-black
              tracking-[-0.025em]
              text-[#112F50]
            "
          >
            دسته‌بندی‌ها
          </SheetTitle>
        </SheetHeader>

        {/* Main content */}
        <div
          dir="ltr"
          className="
            min-h-0
            flex-1
            overflow-hidden
          "
        >
          <div
            className="
              grid
              h-full
              grid-cols-[minmax(0,1fr)_76px]
            "
          >
            {/* CHILDREN — LEFT */}
            <section
              dir="rtl"
              className="
                min-w-0
                overflow-y-auto
                bg-white/50
                px-3
                py-3.5
              "
            >
              {activeParent ? (
                <>
                  {/* Active parent */}
                  <Link
                    href={`/categories/${activeParent.slug}`}
                    onClick={() => setOpen(false)}
                    className="
                      mb-3
                      flex
                      min-h-10
                      items-center
                      justify-between
                      gap-2
                      rounded-[14px]
                      border
                      border-[#B79464]/20
                      bg-[#FBF6ED]/80
                      px-3
                      text-[#112F50]
                      transition-all
                      duration-200
                      active:scale-[0.985]
                    "
                  >
                    <span
                      className="
                        truncate
                        text-[11px]
                        font-black
                      "
                    >
                      {activeParent.name}
                    </span>

                    <ChevronLeft
                      aria-hidden="true"
                      className="
                        h-3.5
                        w-3.5
                        shrink-0
                        text-[#B79464]
                      "
                      strokeWidth={1.9}
                    />
                  </Link>

                  {/* Children */}
                  {children.length > 0 ? (
                    <div
                      key={activeParent.id}
                      className="
                        grid
                        grid-cols-2
                        gap-2
                        animate-in
                        fade-in
                        duration-200
                      "
                    >
                      {children.map((child) => (
                        <Link
                          key={child.id}
                          href={`/categories/${child.slug}`}
                          onClick={() => setOpen(false)}
                          className="
                            group
                            flex
                            min-h-[58px]
                            min-w-0
                            items-center
                            justify-between
                            gap-2
                            rounded-[15px]
                            border
                            border-[#112F50]/[0.055]
                            bg-white/[0.80]
                            px-2.5
                            py-2
                            text-right
                            shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]
                            transition-all
                            duration-200
                            active:scale-[0.985]
                            hover:border-[#B79464]/25
                            hover:bg-white
                          "
                        >
                          <span className="min-w-0">
                            <span
                              className="
                                block
                                line-clamp-2
                                text-[9px]
                                font-black
                                leading-[1.7]
                                text-[#112F50]
                              "
                            >
                              {child.name}
                            </span>
                          </span>

                          <ChevronLeft
                            aria-hidden="true"
                            className="
                              h-3
                              w-3
                              shrink-0
                              text-[#C9B58F]
                              transition-transform
                              duration-200
                              group-hover:-translate-x-0.5
                            "
                            strokeWidth={1.8}
                          />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      href={`/categories/${activeParent.slug}`}
                      onClick={() => setOpen(false)}
                      className="
                        flex
                        min-h-[120px]
                        items-center
                        justify-center
                        rounded-[18px]
                        border
                        border-dashed
                        border-[#112F50]/[0.08]
                        bg-[#FAF9F6]/80
                        px-4
                        text-center
                        text-[9px]
                        font-black
                        text-[#76582F]
                      "
                    >
                      مشاهده محصولات
                    </Link>
                  )}
                </>
              ) : (
                <div
                  className="
                    flex
                    min-h-[220px]
                    items-center
                    justify-center
                    text-center
                    text-[9px]
                    font-bold
                    text-[#98A2B3]
                  "
                >
                  دسته‌ای موجود نیست
                </div>
              )}
            </section>

            {/* PARENTS — RIGHT */}
            <aside
              dir="rtl"
              className="
                min-h-0
                overflow-y-auto
                border-l
                border-[#E8E5DF]
                bg-[#F5F2EC]/85
                px-1.5
                py-3
              "
            >
              <div className="space-y-2">
                {rootCategories.map((parent) => {
                  const selected =
                    parent.id === activeParent?.id

                  return (
                    <button
                      key={parent.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() =>
                        setSelectedParentId(parent.id)
                      }
                      className={[
                        `
                          flex
                          aspect-square
                          w-full
                          flex-col
                          items-center
                          justify-center
                          rounded-[15px]
                          border
                          px-1
                          text-center
                          outline-none
                          transition-all
                          duration-200
                          active:scale-[0.96]
                          focus-visible:ring-2
                          focus-visible:ring-[#B79464]/50
                          focus-visible:ring-offset-1
                        `,
                        selected
                          ? `
                            border-[#B79464]/40
                            bg-white
                            text-[#112F50]
                            shadow-[0_7px_18px_rgba(17,47,80,0.08)]
                          `
                          : `
                            border-[#112F50]/[0.045]
                            bg-white/45
                            text-[#667085]
                            hover:border-[#B79464]/20
                            hover:bg-white
                            hover:text-[#112F50]
                          `,
                      ].join(' ')}
                    >
                      <span
                        aria-hidden="true"
                        className={[
                          `
                            flex
                            h-7
                            w-7
                            shrink-0
                            items-center
                            justify-center
                            rounded-[9px]
                          `,
                          selected
                            ? 'bg-[#F5F1E9] text-[#9E7F50]'
                            : 'bg-[#F0EEE8] text-[#A0A7AF]',
                        ].join(' ')}
                      >
                        <Layers3
                          className="h-3.5 w-3.5"
                          strokeWidth={selected ? 2 : 1.7}
                        />
                      </span>

                      <span
                        className="
                          mt-1
                          line-clamp-2
                          w-full
                          text-[7px]
                          font-black
                          leading-[1.45]
                        "
                      >
                        {parent.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            </aside>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}