
'use client'

import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

type ProductCarouselControlsProps = {
  carouselId: string
}

export default function ProductCarouselControls({
  carouselId,
}: ProductCarouselControlsProps) {
  const scrollProducts = (
    direction: 'next' | 'previous',
  ) => {
    const carousel =
      document.getElementById(carouselId)

    carousel?.scrollBy({
      left:
        direction === 'next'
          ? 360
          : -360,
      behavior: 'smooth',
    })
  }

  return (
    <>
      {/* Previous */}
      <button
        type="button"
        aria-label="محصولات قبلی"
        onClick={() =>
          scrollProducts('previous')
        }
        className="
          hidden
          h-9
          w-9
          items-center
          justify-center
          rounded-full
          border
          border-white/10
          bg-white/[0.045]
          text-white/65
          backdrop-blur
          transition-all
          duration-200
          hover:border-[#B79464]/35
          hover:bg-white/[0.08]
          hover:text-white
          active:scale-95
          lg:flex
        "
      >
        <ChevronRight
          className="h-4 w-4"
          strokeWidth={1.8}
        />
      </button>

      {/* Next */}
      <button
        type="button"
        aria-label="محصولات بعدی"
        onClick={() =>
          scrollProducts('next')
        }
        className="
          hidden
          h-9
          w-9
          items-center
          justify-center
          rounded-full
          border
          border-white/10
          bg-white/[0.045]
          text-white/65
          backdrop-blur
          transition-all
          duration-200
          hover:border-[#B79464]/35
          hover:bg-white/[0.08]
          hover:text-white
          active:scale-95
          lg:flex
        "
      >
        <ChevronLeft
          className="h-4 w-4"
          strokeWidth={1.8}
        />
      </button>
    </>
  )
}

