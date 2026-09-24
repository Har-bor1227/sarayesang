import {
  ChevronLeft,
} from 'lucide-react'

import type {
  ProductDetailAttribute,
} from './types'

type ProductTechnicalDataProps = {
  attributes: ProductDetailAttribute[]
}

export default function ProductTechnicalData({
  attributes,
}: ProductTechnicalDataProps) {
  if (attributes.length === 0) {
    return null
  }

  return (
    <section
      className="
        mt-6
        overflow-hidden
        rounded-[24px]
        border
        border-[#112F50]/[0.07]
        bg-white
      "
      aria-labelledby="technical-data-title"
    >
      <div
        className="
          flex
          items-center
          justify-between
          gap-4
          border-b
          border-[#112F50]/[0.07]
          bg-[#F7F6F3]
          px-5
          py-4
        "
      >
        <div>
          <span
            className="
              block
              text-[8px]
              font-black
              uppercase
              tracking-[0.18em]
              text-[#B79464]
            "
          >
            Technical Data
          </span>

          <h2
            id="technical-data-title"
            className="
              mt-1
              text-[15px]
              font-black
              text-[#112F50]
            "
          >
            مشخصات فنی
          </h2>
        </div>

        <span
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            bg-white
            text-[#B79464]
            shadow-sm
          "
          aria-hidden="true"
        >
          <ChevronLeft className="h-4 w-4" />
        </span>
      </div>

      <div
        className="
          divide-y
          divide-[#112F50]/[0.06]
          px-5
        "
      >
        {attributes.map(
          (attribute) => (
            <div
              key={attribute.id}
              className="
                flex
                items-start
                justify-between
                gap-5
                py-4
              "
            >
              <span
                className="
                  min-w-0
                  text-[9px]
                  font-bold
                  leading-6
                  text-[#747E88]
                  sm:text-[10px]
                "
              >
                {attribute.name}
              </span>

              <span
                className="
                  max-w-[62%]
                  text-left
                  text-[9px]
                  font-black
                  leading-6
                  text-[#112F50]
                  sm:text-[10px]
                "
              >
                {attribute.options.join(
                  '، ',
                )}
              </span>
            </div>
          ),
        )}
      </div>
    </section>
  )
}