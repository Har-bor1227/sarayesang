'use client'

import {
  Children,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from 'react'

const AUTOPLAY_DELAY = 5000
const SWIPE_THRESHOLD = 45

export default function HeroSlider({
  children,
}: {
  children: ReactNode
}) {
  const slides = Children.toArray(children)

  const [activeIndex, setActiveIndex] =
    useState(0)

  const [isDragging, setIsDragging] =
    useState(false)

  const [isPaused, setIsPaused] =
    useState(false)

  const pointerStartX =
    useRef<number | null>(null)

  const pointerCurrentX =
    useRef<number | null>(null)

  useEffect(() => {
    if (
      isPaused ||
      slides.length <= 1
    ) {
      return
    }

    const timeout = window.setTimeout(() => {
      setActiveIndex((current) =>
        (current + 1) % slides.length,
      )
    }, AUTOPLAY_DELAY)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [
    activeIndex,
    isPaused,
    slides.length,
  ])

  if (!slides.length) {
    return null
  }

  const goTo = (index: number) => {
    setActiveIndex(
      (index + slides.length) %
        slides.length,
    )
  }

  const goNext = () => {
    setActiveIndex((current) =>
      (current + 1) % slides.length,
    )
  }

  const goPrevious = () => {
    setActiveIndex((current) =>
      (current - 1 + slides.length) %
        slides.length,
    )
  }

  const handlePointerDown = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    pointerStartX.current =
      event.clientX

    pointerCurrentX.current =
      event.clientX

    setIsDragging(true)
    setIsPaused(true)

    event.currentTarget.setPointerCapture(
      event.pointerId,
    )
  }

  const handlePointerMove = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    if (!isDragging) {
      return
    }

    pointerCurrentX.current =
      event.clientX
  }

  const handlePointerUp = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    const startX =
      pointerStartX.current

    const currentX =
      pointerCurrentX.current

    setIsDragging(false)

    if (
      startX !== null &&
      currentX !== null
    ) {
      const distance =
        currentX - startX

      if (
        Math.abs(distance) >=
        SWIPE_THRESHOLD
      ) {
        if (distance < 0) {
          goNext()
        } else {
          goPrevious()
        }
      }
    }

    pointerStartX.current = null
    pointerCurrentX.current = null

    setIsPaused(false)

    try {
      event.currentTarget.releasePointerCapture(
        event.pointerId,
      )
    } catch {
      // Pointer capture may already be released.
    }
  }

  const handlePointerCancel = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    setIsDragging(false)

    pointerStartX.current = null
    pointerCurrentX.current = null

    setIsPaused(false)

    try {
      event.currentTarget.releasePointerCapture(
        event.pointerId,
      )
    } catch {
      // Pointer capture may already be released.
    }
  }

  return (
    <div
      className={[
        'relative w-full overflow-hidden',
        'touch-pan-y',
        'perspective-[1200px]',
        isDragging
          ? 'cursor-grabbing'
          : 'cursor-grab',
      ].join(' ')}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      <div
        className="
          relative
          aspect-[16/6.5]
          min-h-[155px]
          w-full
          sm:min-h-[190px]
          md:aspect-[16/5.2]
          md:min-h-[220px]
          lg:aspect-[16/4.9]
          lg:min-h-[245px]
          xl:min-h-[275px]
        "
      >
        {slides.map(
          (slide, index) => {
            const isActive =
              index === activeIndex

            return (
              <div
                key={index}
                aria-hidden={!isActive}
                className={[
                  'absolute inset-0',
                  'transition-all duration-700',
                  'ease-[cubic-bezier(.22,1,.36,1)]',
                  isActive
                    ? 'z-10 translate-x-0 translate-y-0 scale-100 opacity-100'
                    : 'pointer-events-none translate-x-[1%] translate-y-[3px] scale-[0.99] opacity-0',
                ].join(' ')}
              >
                {slide}
              </div>
            )
          },
        )}

        {/* Very soft edge shading */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            z-20
            bg-gradient-to-t
            from-black/[0.035]
            via-transparent
            to-white/[0.01]
          "
        />
      </div>

      {/* Indicators */}
      {slides.length > 1 && (
        <div
          className="
            absolute
            bottom-2
            left-1/2
            z-30
            flex
            -translate-x-1/2
            items-center
            gap-0.5
            rounded-full
            border
            border-white/10
            bg-[#0a1929]/25
            px-1
            py-0.5
            backdrop-blur-md
            sm:bottom-2.5
            sm:gap-1
            sm:px-1.5
            sm:py-1
          "
        >
          {slides.map(
            (_, index) => {
              const active =
                index === activeIndex

              return (
                <button
                  key={index}
                  type="button"
                  aria-label={`نمایش بنر ${index + 1}`}
                  aria-current={
                    active
                      ? 'true'
                      : undefined
                  }
                  onClick={() => {
                    goTo(index)
                    setIsPaused(false)
                  }}
                  className="
                    group
                    flex
                    h-5.5
                    w-5.5
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    p-0
                    outline-none
                    transition-all
                    duration-300
                    focus-visible:ring-2
                    focus-visible:ring-white/90
                    focus-visible:ring-offset-1
                    focus-visible:ring-offset-[#0a1929]
                    sm:h-6
                    sm:w-6
                  "
                >
                  <span
                    aria-hidden="true"
                    className={[
                      'block rounded-full transition-all duration-300',
                      active
                        ? 'h-1.5 w-5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.22)]'
                        : 'h-1.5 w-1.5 bg-white/35 group-hover:bg-white/65',
                    ].join(' ')}
                  />
                </button>
              )
            },
          )}
        </div>
      )}
    </div>
  )
}