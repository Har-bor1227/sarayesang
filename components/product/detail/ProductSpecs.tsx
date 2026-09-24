import {
  Box,
  Layers3,
  Palette,
  Ruler,
  Scale,
  Sparkles,
} from 'lucide-react'

import type {
  ProductDetailAcf,
} from './types'

type ProductSpecsProps = {
  acf?: ProductDetailAcf | null
}

const SPEC_ITEMS = [
  {
    key: 'dimensions',
    label: 'ابعاد',
    icon: Ruler,
  },
  {
    key: 'weight',
    label: 'وزن',
    icon: Scale,
  },
  {
    key: 'stoneType',
    label: 'نوع سنگ',
    icon: Layers3,
  },
  {
    key: 'surfaceFinish',
    label: 'پرداخت سطح',
    icon: Sparkles,
  },
  {
    key: 'colorFamily',
    label: 'خانواده رنگ',
    icon: Palette,
  },
  {
    key: 'application',
    label: 'کاربرد',
    icon: Box,
  },
] as const

export default function ProductSpecs({
  acf,
}: ProductSpecsProps) {
  const values = {
    dimensions: acf?.dimensions,
    weight: acf?.weight,
    stoneType: acf?.stoneType,
    surfaceFinish:
      acf?.surfaceFinish,
    colorFamily: acf?.colorFamily,
    application: acf?.application,
  }

  const specs = SPEC_ITEMS.filter(
    (item) =>
      Boolean(values[item.key]),
  )

  if (specs.length === 0) {
    return null
  }

  return (
    <section
      className="mt-8"
      aria-labelledby="product-specs-title"
    >
      <div className="mb-4">
        <span
          className="
            block
            text-[8px]
            font-black
            uppercase
            tracking-[0.20em]
            text-[#B79464]
            sm:text-[9px]
          "
        >
          Specifications
        </span>

        <h2
          id="product-specs-title"
          className="
            mt-1.5
            text-[19px]
            font-black
            tracking-[-0.02em]
            text-[#112F50]
            sm:text-[21px]
          "
        >
          مشخصات کلیدی سنگ
        </h2>
      </div>

      <div
        className="
          grid
          grid-cols-2
          gap-2.5
          sm:grid-cols-2
          sm:gap-3
        "
      >
        {specs.map(
          ({
            key,
            label,
            icon: Icon,
          }) => {
            const value =
              values[key]

            if (!value) {
              return null
            }

            return (
              <div
                key={key}
                className="
                  group
                  rounded-[20px]
                  border
                  border-[#112F50]/[0.07]
                  bg-[#FBFBF9]
                  p-3.5
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:border-[#B79464]/30
                  hover:bg-[#FBF8F2]
                "
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-[11px]
                      bg-[#F3ECE1]
                      text-[#9D7E50]
                    "
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <span
                      className="
                        block
                        text-[8px]
                        font-bold
                        text-[#7A838D]
                        sm:text-[9px]
                      "
                    >
                      {label}
                    </span>

                    <p
                      className="
                        mt-1
                        line-clamp-2
                        text-[10px]
                        font-black
                        leading-5
                        text-[#112F50]
                        sm:text-[11px]
                      "
                    >
                      {value}
                    </p>
                  </div>
                </div>
              </div>
            )
          },
        )}
      </div>
    </section>
  )
}