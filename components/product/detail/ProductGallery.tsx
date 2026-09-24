'use client'

import Image from 'next/image'
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
} from 'lucide-react'
import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import { Badge } from '@/components/ui/badge'

import type {
  ProductDetailImage,
} from './types'

type ProductGalleryProps = {
  productName: string
  mainImage: ProductDetailImage
  galleryImages: ProductDetailImage[]
  onSale?: boolean | null
}

export default function ProductGallery({
  productName,
  mainImage,
  galleryImages,
  onSale,
}: ProductGalleryProps) {
  const images = useMemo(() => {
    const allImages = [
      mainImage,
      ...galleryImages,
    ]

    const seen = new Set<string>()

    return allImages.filter((image) => {
      if (!image.sourceUrl) {
        return false
      }

      if (seen.has(image.sourceUrl)) {
        return false
      }

      seen.add(image.sourceUrl)

      return true
    })
  }, [mainImage, galleryImages])

  const [activeIndex, setActiveIndex] =
    useState(0)

  const [isFullscreen, setIsFullscreen] =
    useState(false)

  const activeImage =
    images[activeIndex] ?? mainImage

  const hasMultipleImages =
    images.length > 1

  const showPrevious = () => {
    if (!hasMultipleImages) return

    setActiveIndex((current) =>
      current === 0
        ? images.length - 1
        : current - 1,
    )
  }

  const showNext = () => {
    if (!hasMultipleImages) return

    setActiveIndex((current) =>
      current === images.length - 1
        ? 0
        : current + 1,
    )
  }

  useEffect(() => {
    if (!isFullscreen) return

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === 'Escape') {
        setIsFullscreen(false)
      }

      if (event.key === 'ArrowLeft') {
        showNext()
      }

      if (event.key === 'ArrowRight') {
        showPrevious()
      }
    }

    window.addEventListener(
      'keydown',
      handleKeyDown,
    )

    document.body.style.overflow =
      'hidden'

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown,
      )

      document.body.style.overflow =
        ''
    }
  }, [isFullscreen])

  return (
    <>
      <section
        aria-label="تصاویر محصول"
        className="min-w-0"
      >
        <div
          className="
            relative
            overflow-hidden
            rounded-[32px]
            border
            border-[#112F50]/[0.06]
            bg-[#EDECE8]
            shadow-[0_26px_70px_rgba(10,25,41,0.08)]
            sm:rounded-[38px]
          "
        >
          <div
            className="
              group
              relative
              aspect-[0.92]
              overflow-hidden
              bg-[#EDECE8]
              sm:aspect-[0.96]
              lg:aspect-[0.98]
            "
          >
            <Image
              key={activeImage.sourceUrl}
              src={activeImage.sourceUrl}
              alt={
                activeImage.altText ||
                productName
              }
              fill
              preload={activeIndex === 0}
              sizes="(max-width: 1024px) 100vw, 56vw"
              className="
                object-cover
                transition-transform
                duration-700
                ease-out
                group-hover:scale-[1.018]
              "
            />

            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                inset-0
                bg-[linear-gradient(180deg,rgba(7,18,30,0.04)_0%,transparent_45%,rgba(7,18,30,0.22)_100%)]
              "
            />

            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                inset-x-0
                bottom-0
                h-32
                bg-gradient-to-t
                from-[#07131F]/20
                to-transparent
              "
            />

            <div
              className="
                absolute
                right-4
                top-4
                z-20
                flex
                items-center
                gap-2
                sm:right-6
                sm:top-6
              "
            >
              <span
                className="
                  inline-flex
                  items-center
                  rounded-full
                  border
                  border-white/15
                  bg-[#07131F]/40
                  px-3
                  py-2
                  text-[8px]
                  font-black
                  tracking-[0.18em]
                  text-white
                  shadow-lg
                  backdrop-blur-xl
                  sm:text-[9px]
                "
              >
                SARAYE SANG
              </span>
            </div>

            {onSale && (
              <div
                className="
                  absolute
                  left-4
                  top-4
                  z-20
                  sm:left-6
                  sm:top-6
                "
              >
                <Badge
                  className="
                    rounded-full
                    border-0
                    bg-[#B79464]
                    px-3
                    py-2
                    text-[9px]
                    font-black
                    text-white
                    shadow-[0_10px_30px_rgba(183,148,100,0.30)]
                    sm:text-[10px]
                  "
                >
                  ویژه
                </Badge>
              </div>
            )}

            {hasMultipleImages && (
              <>
                <button
                  type="button"
                  onClick={showPrevious}
                  aria-label="تصویر قبلی"
                  className="
                    absolute
                    right-4
                    top-1/2
                    z-20
                    flex
                    h-11
                    w-11
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/15
                    bg-[#07131F]/35
                    text-white
                    opacity-100
                    backdrop-blur-xl
                    transition
                    duration-300
                    hover:bg-[#07131F]/60
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[#D8BC8D]
                    sm:right-6
                    sm:h-12
                    sm:w-12
                  "
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={showNext}
                  aria-label="تصویر بعدی"
                  className="
                    absolute
                    left-4
                    top-1/2
                    z-20
                    flex
                    h-11
                    w-11
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/15
                    bg-[#07131F]/35
                    text-white
                    opacity-100
                    backdrop-blur-xl
                    transition
                    duration-300
                    hover:bg-[#07131F]/60
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[#D8BC8D]
                    sm:left-6
                    sm:h-12
                    sm:w-12
                  "
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() =>
                setIsFullscreen(true)
              }
              aria-label="نمایش تمام صفحه تصویر"
              className="
                absolute
                bottom-4
                left-4
                z-20
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-white/15
                bg-[#07131F]/35
                text-white
                backdrop-blur-xl
                transition
                duration-300
                hover:bg-[#07131F]/60
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#D8BC8D]
                sm:bottom-6
                sm:left-6
              "
            >
              <Maximize2 className="h-4 w-4" />
            </button>

            <div
              className="
                absolute
                bottom-4
                right-4
                z-20
                rounded-full
                border
                border-white/15
                bg-[#07131F]/35
                px-3
                py-1.5
                text-[9px]
                font-black
                text-white
                backdrop-blur-xl
                sm:bottom-6
                sm:right-6
              "
            >
              {String(activeIndex + 1).padStart(
                2,
                '0',
              )}
              {' / '}
              {String(images.length).padStart(
                2,
                '0',
              )}
            </div>
          </div>
        </div>

        {images.length > 0 && (
          <div className="mt-4">
            <div
              className="
                flex
                gap-2.5
                overflow-x-auto
                pb-1
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
                sm:grid
                sm:grid-cols-5
                sm:gap-3
                sm:overflow-visible
              "
              aria-label="تصاویر بیشتر محصول"
            >
              {images.map(
                (image, index) => (
                  <button
                    key={`${image.sourceUrl}-${index}`}
                    type="button"
                    onClick={() =>
                      setActiveIndex(index)
                    }
                    aria-label={`نمایش تصویر ${
                      index + 1
                    }`}
                    aria-pressed={
                      activeIndex === index
                    }
                    className={[
                      'group relative shrink-0 overflow-hidden rounded-[17px] border bg-[#F1F0ED] outline-none transition-all duration-300 sm:shrink',
                      activeIndex === index
                        ? 'border-[#B79464] shadow-[0_10px_25px_rgba(183,148,100,0.15)] ring-2 ring-[#B79464]/15'
                        : 'border-[#112F50]/[0.07] hover:border-[#B79464]/45',
                    ].join(' ')}
                  >
                    <span className="relative block aspect-square w-[76px] sm:w-auto">
                      <Image
                        src={
                          image.sourceUrl
                        }
                        alt={
                          image.altText ||
                          `${productName} - تصویر ${
                            index + 1
                          }`
                        }
                        fill
                        sizes="(max-width: 640px) 76px, 18vw"
                        className="
                          object-cover
                          transition-transform
                          duration-500
                          group-hover:scale-[1.05]
                        "
                      />

                      <span
                        className={[
                          'absolute inset-0 transition-all',
                          activeIndex === index
                            ? 'bg-[#112F50]/10'
                            : 'bg-transparent group-hover:bg-[#112F50]/5',
                        ].join(' ')}
                      />
                    </span>
                  </button>
                ),
              )}
            </div>
          </div>
        )}
      </section>

      {isFullscreen && (
        <div
          className="
            fixed
            inset-0
            z-[200]
            flex
            items-center
            justify-center
            bg-[#040B12]/95
            p-3
            backdrop-blur-2xl
            sm:p-6
          "
          role="dialog"
          aria-modal="true"
          aria-label={`نمایش تمام صفحه ${productName}`}
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setIsFullscreen(false)
            }
          }}
        >
          <div
            className="
              relative
              h-full
              w-full
              max-w-[1500px]
            "
          >
            <Image
              src={activeImage.sourceUrl}
              alt={
                activeImage.altText ||
                productName
              }
              fill
              sizes="100vw"
              className="object-contain"
            />

            <button
              type="button"
              onClick={() =>
                setIsFullscreen(false)
              }
              aria-label="بستن نمایش تمام صفحه"
              className="
                absolute
                right-2
                top-2
                z-10
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                border
                border-white/15
                bg-white/10
                text-white
                backdrop-blur-xl
                transition
                hover:bg-white/15
                sm:right-4
                sm:top-4
              "
            >
              <X className="h-5 w-5" />
            </button>

            {hasMultipleImages && (
              <>
                <button
                  type="button"
                  onClick={showPrevious}
                  aria-label="تصویر قبلی"
                  className="
                    absolute
                    right-2
                    top-1/2
                    z-10
                    flex
                    h-11
                    w-11
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/15
                    bg-white/10
                    text-white
                    backdrop-blur-xl
                    transition
                    hover:bg-white/15
                    sm:right-5
                    sm:h-12
                    sm:w-12
                  "
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={showNext}
                  aria-label="تصویر بعدی"
                  className="
                    absolute
                    left-2
                    top-1/2
                    z-10
                    flex
                    h-11
                    w-11
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/15
                    bg-white/10
                    text-white
                    backdrop-blur-xl
                    transition
                    hover:bg-white/15
                    sm:left-5
                    sm:h-12
                    sm:w-12
                  "
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              </>
            )}

            <div
              className="
                absolute
                bottom-2
                left-1/2
                z-10
                -translate-x-1/2
                rounded-full
                border
                border-white/10
                bg-white/10
                px-4
                py-2
                text-[10px]
                font-black
                text-white
                backdrop-blur-xl
              "
            >
              {activeIndex + 1} /{' '}
              {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  )
}