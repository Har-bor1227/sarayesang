'use client'

import {
  useEffect,
  useState,
} from 'react'

import {
  Sparkles,
} from 'lucide-react'

export default function SmartSearchSelectionSummary() {
  const [selectedApplication, setSelectedApplication] =
    useState('')

  const [selectedColor, setSelectedColor] =
    useState('')

  useEffect(() => {
    const form = document.getElementById(
      'smart-search-form',
    )

    if (!(form instanceof HTMLFormElement)) {
      return
    }

    const syncSelection = () => {
      const application =
        form.querySelector<HTMLInputElement>(
          'input[name="application"]:checked',
        )

      const color =
        form.querySelector<HTMLInputElement>(
          'input[name="color"]:checked',
        )

      setSelectedApplication(
        application?.value ?? '',
      )

      setSelectedColor(
        color?.value ?? '',
      )
    }

    syncSelection()

    form.addEventListener(
      'change',
      syncSelection,
    )

    return () => {
      form.removeEventListener(
        'change',
        syncSelection,
      )
    }
  }, [])

  return (
    <div
      className="
        flex
        min-w-0
        items-center
        justify-center
        gap-2
        text-center
        sm:justify-start
        sm:text-right
      "
    >
      <div
        className="
          flex
          h-7
          w-7
          shrink-0
          items-center
          justify-center
          rounded-full
          border
          border-[#B79464]/20
          bg-[#B79464]/[0.07]
          text-[#D8BC8D]
        "
      >
        <Sparkles
          aria-hidden="true"
          className="h-3.5 w-3.5"
          strokeWidth={1.8}
        />
      </div>

      <div className="min-w-0">
        <div
          className="
            text-[8px]
            font-medium
            text-white/35
            sm:text-[9px]
          "
        >
          انتخاب‌های شما
        </div>

        <div
          className="
            mt-0.5
            flex
            items-center
            justify-center
            gap-1.5
            truncate
            text-[9px]
            font-bold
            text-white
            sm:justify-start
            sm:text-[10px]
          "
        >
          <span>
            {selectedApplication ||
              'انتخاب کاربرد'}
          </span>

          <span className="text-[#B79464]">
            •
          </span>

          <span>
            {selectedColor ||
              'انتخاب رنگ'}
          </span>
        </div>
      </div>
    </div>
  )
}