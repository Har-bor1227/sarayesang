'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  Gem,
  Search,
  X,
} from 'lucide-react'

import type {
  ProductSlotProps,
} from './types'
import { getImage } from './utils'

export default function ProductSlot({
  product,
  slot,
  onOpenPicker,
  onClear,
}: ProductSlotProps) {
  const isFirst =
    slot === 'first'

  if (!product) {
    return (
      <button
        type="button"
        onClick={() =>
          onOpenPicker(slot)
        }
        className="
          group
          relative
          flex
          h-[175px]
          w-full
          flex-col
          items-center
          justify-center
          overflow-hidden
          rounded-[18px]
          border
          border-dashed
          border-[#B79464]/30
          bg-[radial-gradient(circle_at_50%_0%,rgba(183,148,100,0.10),transparent_58%)]
          px-4
          text-center
          transition-all
          duration-300
          hover:-translate-y-0.5
          hover:border-[#B79464]/55
          hover:bg-[radial-gradient(circle_at_50%_0%,rgba(183,148,100,0.15),transparent_62%)]
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-[#B79464]/45
          sm:h-[195px]
          sm:rounded-[21px]
        "
        aria-label={`انتخاب سنگ ${
          isFirst
            ? 'اول'
            : 'دوم'
        }`}
      >
        <span
          aria-hidden="true"
          className="
            absolute
            inset-x-12
            top-0
            h-px
            bg-gradient-to-r
            from-transparent
            via-[#B79464]/60
            to-transparent
          "
        />

        <span
          className="
            mb-2.5
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-[13px]
            border
            border-[#B79464]/20
            bg-[#F4EFE5]
            text-[#B79464]
            shadow-[0_10px_24px_rgba(183,148,100,0.10)]
            transition-transform
            duration-300
            group-hover:scale-[1.05]
            sm:h-11
            sm:w-11
          "
        >
          <Gem
            aria-hidden="true"
            className="h-5 w-5"
            strokeWidth={1.6}
          />
        </span>

        <span className="text-[9px] font-black text-[#B79464] sm:text-[10px]">
          {isFirst
            ? 'سنگ اول'
            : 'سنگ دوم'}
        </span>

        <span className="mt-1 text-[14px] font-black leading-6 text-white sm:text-[16px]">
          انتخاب سنگ
        </span>

        <span
          className="
            mt-2.5
            inline-flex
            min-h-8.5
            items-center
            gap-1.5
            rounded-[10px]
            border
            border-[#D8BC8D]/22
            bg-[#B79464]/[0.11]
            px-3
            py-1.5
            text-[9px]
            font-black
            text-[#E5D0AD]
            transition-all
            duration-300
            group-hover:bg-[#B79464]/[0.18]
            sm:text-[10px]
          "
        >
          <Search
            aria-hidden="true"
            className="h-3 w-3"
            strokeWidth={2}
          />
          جستجو
        </span>
      </button>
    )
  }

  return (
    <article
      className="
        group
        relative
        h-[175px]
        w-full
        overflow-hidden
        rounded-[18px]
        border
        border-white/[0.10]
        bg-[#102233]
        shadow-[0_16px_38px_rgba(0,0,0,0.14)]
        sm:h-[195px]
        sm:rounded-[21px]
      "
    >
      <button
        type="button"
        onClick={() =>
          onOpenPicker(slot)
        }
        className="
          absolute
          inset-0
          z-10
          block
          h-full
          w-full
          text-right
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-inset
          focus-visible:ring-[#B79464]/50
        "
        aria-label="تغییر محصول"
      >
        <Image
          src={getImage(product)}
          alt={
            product.image?.altText ||
            product.name
          }
          fill
          sizes="(max-width: 767px) 94vw, 43vw"
          className="
            object-cover
            transition-transform
            duration-700
            ease-[cubic-bezier(.22,1,.36,1)]
            group-hover:scale-[1.035]
          "
        />

        <div
          aria-hidden="true"
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-[#06111C]/96
            via-[#06111C]/48
            to-[#06111C]/08
          "
        />

        <div
          aria-hidden="true"
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_78%_15%,rgba(216,188,141,0.12),transparent_32%)]
          "
        />
      </button>

      <div
        className="
          absolute
          left-2.5
          top-2.5
          z-30
          sm:left-3
          sm:top-3
        "
      >
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            onClear(slot)
          }}
          className="
            flex
            h-7
            w-7
            items-center
            justify-center
            rounded-full
            border
            border-white/35
            bg-[#06111C]/55
            text-white/75
            shadow-lg
            backdrop-blur-md
            transition-all
            duration-200
            hover:border-white/55
            hover:bg-[#06111C]/75
            hover:text-white
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#B79464]/50
          "
          aria-label="حذف محصول"
        >
          <X
            aria-hidden="true"
            className="h-3.5 w-3.5"
            strokeWidth={2.2}
          />
        </button>
      </div>

      <div
        className="
          absolute
          inset-x-3
          bottom-3
          z-30
          flex
          items-end
          justify-between
          gap-3
          sm:inset-x-4
          sm:bottom-3.5
        "
      >
        <h3
          className="
            min-w-0
            max-w-[65%]
            text-left
            text-[14px]
            font-black
            leading-6
            text-white
            drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]
            sm:text-[16px]
            sm:leading-7
          "
        >
          {product.name}
        </h3>

        <Link
          href={`/products/${product.slug}`}
          className="
            inline-flex
            min-h-8
            shrink-0
            items-center
            gap-1
            rounded-[9px]
            border
            border-white/15
            bg-white/[0.10]
            px-2.5
            text-[7px]
            font-black
            text-white
            shadow-[0_8px_20px_rgba(0,0,0,0.18)]
            backdrop-blur-md
            transition-all
            duration-200
            hover:bg-white/[0.20]
            sm:px-3
            sm:text-[8px]
          "
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          مشاهده
          <ArrowLeft
            aria-hidden="true"
            className="h-2.5 w-2.5"
            strokeWidth={2}
          />
        </Link>
      </div>
    </article>
  )
}