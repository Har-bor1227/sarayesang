'use client'

import { useState } from 'react'

import { Check } from 'lucide-react'

import { formatNumber } from '@/lib/format'

import ProductVariationSelector from './ProductVariationSelector'

import type {
  ProductDetailAttribute,
  ProductDetailProduct,
  ProductDetailVariation,
} from './types'

type ProductPricePanelProps = {
  price?: string | null
  regularPrice?: string | null
  onSale?: boolean | null

  isVariable?: boolean

  priceFrom?: string | null
  priceTo?: string | null

  variationAttributes?: ProductDetailAttribute[]
  variations?: ProductDetailVariation[]
  defaultAttributes?: ProductDetailProduct['defaultAttributes']
}

function parsePrice(
  value?: string | null,
): number | null {
  if (
    value === null ||
    value === undefined ||
    value.trim() === ''
  ) {
    return null
  }

  const numericValue = Number(value)

  return Number.isFinite(numericValue) &&
    numericValue > 0
    ? numericValue
    : null
}

function formatPrice(
  value?: string | null,
): string | null {
  const numericValue = parsePrice(value)

  if (numericValue === null) {
    return null
  }

  const formatted = formatNumber(
    String(numericValue),
  )

  return formatted !== '0'
    ? formatted
    : null
}

function getVariationSummary(
  variation?: ProductDetailVariation | null,
): string {
  if (!variation) {
    return ''
  }

  return variation.attributes
    .map((attribute) =>
      attribute.option?.trim(),
    )
    .filter(Boolean)
    .join(' • ')
}

function getVariationPriceRange(
  variations?: ProductDetailVariation[],
) {
  if (
    !variations ||
    variations.length === 0
  ) {
    return {
      min: null,
      max: null,
    }
  }

  const prices = variations
    .map((variation) =>
      parsePrice(variation.price),
    )
    .filter(
      (
        value,
      ): value is number =>
        value !== null,
    )

  if (prices.length === 0) {
    return {
      min: null,
      max: null,
    }
  }

  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  }
}

export default function ProductPricePanel({
  price,
  regularPrice,
  onSale,
  isVariable = false,
  priceFrom,
  priceTo,
  variationAttributes = [],
  variations = [],
  defaultAttributes,
}: ProductPricePanelProps) {
  const [
    selectedVariation,
    setSelectedVariation,
  ] =
    useState<ProductDetailVariation | null>(
      null,
    )

  const derivedRange =
    getVariationPriceRange(
      variations,
    )

  const effectivePriceFrom =
    priceFrom ||
    (
      derivedRange.min !== null
        ? String(derivedRange.min)
        : null
    )

  const effectivePriceTo =
    priceTo ||
    (
      derivedRange.max !== null
        ? String(derivedRange.max)
        : null
    )

  const selectedPrice =
    selectedVariation?.price?.trim() ||
    null

  const selectedRegularPrice =
    selectedVariation?.regularPrice?.trim() ||
    null

  const selectedOnSale =
    Boolean(
      selectedVariation?.onSale,
    )

  const exactPrice =
    selectedPrice ||
    (
      !isVariable
        ? price?.trim() || null
        : null
    )

  const exactRegularPrice =
    selectedRegularPrice ||
    (
      !isVariable
        ? regularPrice?.trim() || null
        : null
    )

  const exactOnSale =
    selectedVariation
      ? selectedOnSale
      : Boolean(onSale)

  const rangeFrom =
    formatPrice(
      effectivePriceFrom,
    )

  const rangeTo =
    formatPrice(
      effectivePriceTo,
    )

  const formattedExactPrice =
    formatPrice(exactPrice)

  const formattedExactRegularPrice =
    formatPrice(
      exactRegularPrice,
    )

  const hasExactPrice =
    Boolean(
      formattedExactPrice,
    )

  const hasVariableRange =
    isVariable &&
    !selectedVariation &&
    Boolean(rangeFrom)

  const hasDifferentRange =
    hasVariableRange &&
    Boolean(rangeTo) &&
    rangeFrom !== rangeTo

  const hasAnyPrice =
    hasExactPrice ||
    hasVariableRange

  const variationSummary =
    getVariationSummary(
      selectedVariation,
    )

  const showVariationSelector =
    isVariable &&
    variations.length > 0 &&
    variationAttributes.length > 0

  const handleVariationChange = (
    variation: ProductDetailVariation | null,
  ) => {
    setSelectedVariation(
      variation,
    )
  }

  return (
    <div className="min-w-0">
      {showVariationSelector && (
        <div>
          <ProductVariationSelector
            attributes={
              variationAttributes
            }
            variations={
              variations
            }
            defaultAttributes={
              defaultAttributes
            }
            onVariationChange={
              handleVariationChange
            }
          />
        </div>
      )}

      <section
        className={[
          showVariationSelector
            ? 'mt-5 border-t border-[#112F50]/10 pt-5'
            : '',
          'min-w-0',
        ].join(' ')}
        aria-labelledby="product-price-title"
        aria-live="polite"
        aria-atomic="true"
      >
        <div
          className="
            flex
            items-end
            justify-between
            gap-4
          "
        >
          <div className="min-w-0">
            <span
              className="
                block
                text-[12px]
                font-extrabold
                text-[#7A838D]
                sm:text-[12px]
              "
            >
              قیمت
            </span>

            <div className="mt-2">
              {hasVariableRange &&
              hasDifferentRange ? (
                <div
                  className="
                    flex
                    flex-wrap
                    items-baseline
                    gap-2
                  "
                >
                  <span
                    id="product-price-title"
                    className="
                      text-[28px]
                      font-black
                      leading-none
                      tracking-[-0.045em]
                      text-[#112F50]
                      sm:text-[30px]
                    "
                  >
                    {rangeFrom}
                  </span>

                  <span
                    className="
                      text-[12px]
                      font-extrabold
                      text-[#B79464]
                    "
                  >
                    تا
                  </span>

                  <span
                    className="
                      text-[28px]
                      font-black
                      leading-none
                      tracking-[-0.045em]
                      text-[#112F50]
                      sm:text-[30px]
                    "
                  >
                    {rangeTo}
                  </span>

                  <span
                    className="
                      text-[12px]
                      font-bold
                      text-[#7A838D]
                    "
                  >
                    تومان
                  </span>
                </div>
              ) : hasVariableRange ? (
                <div
                  className="
                    flex
                    items-baseline
                    gap-2
                  "
                >
                  <span
                    id="product-price-title"
                    className="
                      text-[29px]
                      font-black
                      leading-none
                      tracking-[-0.045em]
                      text-[#112F50]
                      sm:text-[32px]
                    "
                  >
                    {rangeFrom}
                  </span>

                  <span
                    className="
                      text-[12px]
                      font-bold
                      text-[#7A838D]
                    "
                  >
                    تومان
                  </span>
                </div>
              ) : hasExactPrice ? (
                <div
                  className="
                    flex
                    flex-wrap
                    items-baseline
                    gap-x-3
                    gap-y-1
                  "
                >
                  <span
                    id="product-price-title"
                    className="
                      text-[30px]
                      font-black
                      leading-none
                      tracking-[-0.045em]
                      text-[#112F50]
                      sm:text-[34px]
                    "
                  >
                    {formattedExactPrice}
                  </span>

                  <span
                    className="
                      text-[12px]
                      font-bold
                      text-[#7A838D]
                    "
                  >
                    تومان
                  </span>

                  {exactOnSale &&
                    formattedExactRegularPrice && (
                      <span
                        className="
                          text-[12px]
                          font-semibold
                          text-[#98A0A8]
                          line-through
                          decoration-[#B79464]/60
                        "
                      >
                        {
                          formattedExactRegularPrice
                        }{' '}
                        تومان
                      </span>
                    )}
                </div>
              ) : (
                <div
                  id="product-price-title"
                  className="
                    text-[17px]
                    font-black
                    text-[#112F50]
                    sm:text-[19px]
                  "
                >
                  استعلام قیمت
                </div>
              )}
            </div>
          </div>

          {exactOnSale &&
            formattedExactRegularPrice &&
            hasExactPrice && (
              <span
                className="
                  shrink-0
                  rounded-full
                  bg-[#F4EBDD]
                  px-2.5
                  py-1.5
                  text-[12px]
                  font-black
                  text-[#927149]
                "
              >
                ویژه
              </span>
            )}
        </div>

        {selectedVariation &&
          variationSummary && (
            <div
              className="
                mt-3
                flex
                min-w-0
                items-center
                gap-2
              "
            >
              <Check
                aria-hidden="true"
                className="
                  h-4
                  w-4
                  shrink-0
                  text-[#B79464]
                "
              />

              <span
                className="
                  min-w-0
                  truncate
                  text-[12px]
                  font-extrabold
                  text-[#112F50]
                  sm:text-[12px]
                "
              >
                {variationSummary}
              </span>
            </div>
          )}

        {!hasAnyPrice && (
          <div
            className="
              mt-4
              border-t
              border-[#112F50]/[0.07]
              pt-4
            "
          >
            <span
              className="
                text-[12px]
                font-medium
                text-[#7A838D]
                sm:text-[12px]
              "
            >
              قیمت نهایی بر اساس شرایط سفارش
              اعلام می‌شود.
            </span>
          </div>
        )}
      </section>
    </div>
  )
}