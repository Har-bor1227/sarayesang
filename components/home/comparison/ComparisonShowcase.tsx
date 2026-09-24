'use client'

import Image from 'next/image'
import { Gem } from 'lucide-react'

import {
  comparisonFields,
} from './constants'
import type {
  ComparisonShowcaseProps,
} from './types'
import {
  formatPriceWithUnit,
  getImage,
  getValue,
} from './utils'

export default function ComparisonShowcase({
  first,
  second,
}: ComparisonShowcaseProps) {
  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-[20px]
        border
        border-white/[0.08]
        bg-[#071522]
        p-1.5
        shadow-[0_16px_42px_rgba(0,0,0,0.18)]
        sm:rounded-[23px]
        sm:p-2
      "
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[#B79464]/[0.12] blur-3xl" />
        <div className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-[#31567D]/[0.13] blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05),transparent_38%)]" />
      </div>

      <div
        className="
          relative
          grid
          grid-cols-[68px_minmax(0,1fr)_minmax(0,1fr)]
          gap-1.5
          sm:grid-cols-[94px_minmax(0,1fr)_minmax(0,1fr)]
          sm:gap-2
          md:grid-cols-[112px_minmax(0,1fr)_minmax(0,1fr)]
          lg:gap-2.5
        "
      >
        <div
          className="
            overflow-hidden
            rounded-[15px]
            border
            border-white/[0.07]
            bg-white/[0.028]
            shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]
            backdrop-blur-xl
            sm:rounded-[17px]
          "
        >
          <div
            className="
              flex
              h-[62px]
              items-center
              justify-center
              border-b
              border-white/[0.06]
              px-2
              text-center
              sm:h-[72px]
              sm:px-2.5
            "
          >
            <div className="w-full">
              <span className="block text-[7px] font-bold uppercase tracking-[0.14em] text-[#B79464]/75 sm:text-[8px]">
                specs
              </span>

              <span className="mt-1 block text-[10px] font-black text-white sm:text-[11px] md:text-[12px]">
                مشخصات
              </span>
            </div>
          </div>

          <div className="divide-y divide-white/[0.055]">
            {comparisonFields.map(
              (field) => (
                <div
                  key={field.key}
                  className="
                    flex
                    min-h-[60px]
                    items-center
                    justify-center
                    px-1.5
                    py-2.5
                    text-center
                    sm:min-h-[68px]
                    sm:px-2.5
                    sm:py-3
                    md:min-h-[72px]
                  "
                >
                  <div className="w-full">
                    <span
                      aria-hidden="true"
                      className="
                        mx-auto
                        mb-1.5
                        block
                        h-1
                        w-5
                        rounded-full
                        bg-[#B79464]/55
                        shadow-[0_0_12px_rgba(183,148,100,0.18)]
                        sm:w-6
                      "
                    />

                    <span className="block text-[9px] font-black leading-5 text-white/80 sm:text-[10px] md:text-[11px]">
                      {field.label}
                    </span>
                  </div>
                </div>
              ),
            )}

            <div
              className="
                flex
                min-h-[58px]
                items-center
                justify-center
                px-1.5
                py-2.5
                text-center
                sm:min-h-[66px]
                sm:px-2.5
              "
            >
              <div className="w-full">
                <span
                  aria-hidden="true"
                  className="
                    mx-auto
                    mb-1.5
                    block
                    h-1
                    w-5
                    rounded-full
                    bg-[#D8BC8D]/70
                    sm:w-6
                  "
                />

                <span className="block text-[9px] font-black text-white/80 sm:text-[10px] md:text-[11px]">
                  قیمت
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="
            overflow-hidden
            rounded-[15px]
            border
            border-[#D8BC8D]/15
            bg-gradient-to-b
            from-white/[0.085]
            via-white/[0.04]
            to-white/[0.025]
            shadow-[0_16px_36px_rgba(0,0,0,0.17),inset_0_1px_0_rgba(255,255,255,0.10)]
            backdrop-blur-2xl
            sm:rounded-[17px]
          "
        >
          <div
            aria-hidden="true"
            className="h-px bg-gradient-to-r from-transparent via-[#D8BC8D]/75 to-transparent"
          />

          <div className="relative h-[62px] overflow-hidden border-b border-white/[0.07] sm:h-[72px]">
            {first ? (
              <>
                <Image
                  src={getImage(first)}
                  alt={
                    first.image
                      ?.altText ||
                    first.name
                  }
                  fill
                  sizes="(max-width: 639px) 40vw, 30vw"
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#06111C]/96 via-[#06111C]/42 to-transparent" />

                <div className="absolute inset-x-2 bottom-1.5 text-center sm:inset-x-2.5 sm:bottom-2">
                  <h3 className="line-clamp-2 text-[10px] font-black leading-5 text-white drop-shadow-[0_2px_12px_rgba(255,255,255,0.18)] sm:text-[12px] sm:leading-5.5 md:text-[13px]">
                    {first.name}
                  </h3>
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-white/24">
                <Gem
                  aria-hidden="true"
                  className="h-4.5 w-4.5"
                  strokeWidth={1.5}
                />
              </div>
            )}
          </div>

          <div className="divide-y divide-white/[0.055]">
            {comparisonFields.map(
              (field) => (
                <div
                  key={field.key}
                  className="
                    flex
                    min-h-[60px]
                    items-center
                    justify-center
                    px-2
                    py-2.5
                    text-center
                    sm:min-h-[68px]
                    sm:px-2.5
                    sm:py-3
                    md:min-h-[72px]
                  "
                >
                  <span className="block w-full break-words text-center text-[10px] font-bold leading-5.5 text-white/82 sm:text-[11px] sm:leading-6 md:text-[12px]">
                    {first
                      ? getValue(
                          first,
                          field.getValue,
                        )
                      : '—'}
                  </span>
                </div>
              ),
            )}

            <div
              className="
                flex
                min-h-[58px]
                items-center
                justify-center
                px-2
                py-2.5
                text-center
                sm:min-h-[66px]
                sm:px-2.5
              "
            >
              <span className="block w-full break-words text-center text-[10px] font-black leading-5 text-[#E8D4B2] sm:text-[11px] md:text-[12px]">
                {first
                  ? formatPriceWithUnit(
                      first.price,
                    )
                  : '—'}
              </span>
            </div>
          </div>
        </div>

        <div
          className="
            overflow-hidden
            rounded-[15px]
            border
            border-white/[0.10]
            bg-gradient-to-b
            from-white/[0.065]
            via-white/[0.035]
            to-white/[0.02]
            shadow-[0_16px_36px_rgba(0,0,0,0.16),inset_0_1px_0_rgba(255,255,255,0.07)]
            backdrop-blur-2xl
            sm:rounded-[17px]
          "
        >
          <div
            aria-hidden="true"
            className="h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
          />

          <div className="relative h-[62px] overflow-hidden border-b border-white/[0.07] sm:h-[72px]">
            {second ? (
              <>
                <Image
                  src={getImage(second)}
                  alt={
                    second.image
                      ?.altText ||
                    second.name
                  }
                  fill
                  sizes="(max-width: 639px) 40vw, 30vw"
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#06111C]/96 via-[#06111C]/42 to-transparent" />

                <div className="absolute inset-x-2 bottom-1.5 text-center sm:inset-x-2.5 sm:bottom-2">
                  <h3 className="line-clamp-2 text-[10px] font-black leading-5 text-white drop-shadow-[0_2px_12px_rgba(255,255,255,0.14)] sm:text-[12px] sm:leading-5.5 md:text-[13px]">
                    {second.name}
                  </h3>
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-white/24">
                <Gem
                  aria-hidden="true"
                  className="h-4.5 w-4.5"
                  strokeWidth={1.5}
                />
              </div>
            )}
          </div>

          <div className="divide-y divide-white/[0.055]">
            {comparisonFields.map(
              (field) => (
                <div
                  key={field.key}
                  className="
                    flex
                    min-h-[60px]
                    items-center
                    justify-center
                    px-2
                    py-2.5
                    text-center
                    sm:min-h-[68px]
                    sm:px-2.5
                    sm:py-3
                    md:min-h-[72px]
                  "
                >
                  <span className="block w-full break-words text-center text-[10px] font-bold leading-5.5 text-white/76 sm:text-[11px] sm:leading-6 md:text-[12px]">
                    {second
                      ? getValue(
                          second,
                          field.getValue,
                        )
                      : '—'}
                  </span>
                </div>
              ),
            )}

            <div
              className="
                flex
                min-h-[58px]
                items-center
                justify-center
                px-2
                py-2.5
                text-center
                sm:min-h-[66px]
                sm:px-2.5
              "
            >
              <span className="block w-full break-words text-center text-[10px] font-black leading-5 text-white/82 sm:text-[11px] md:text-[12px]">
                {second
                  ? formatPriceWithUnit(
                      second.price,
                    )
                  : '—'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}