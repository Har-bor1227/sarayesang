'use client'

import Image from 'next/image'
import { createPortal } from 'react-dom'
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
} from 'lucide-react'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import type { ProductDetailImage } from './types'

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
    const allImages = [mainImage, ...galleryImages]
    const seen = new Set<string>()

    return allImages.filter((image) => {
      const sourceUrl = image.sourceUrl?.trim()

      if (!sourceUrl || seen.has(sourceUrl)) {
        return false
      }

      seen.add(sourceUrl)
      return true
    })
  }, [mainImage, galleryImages])

  const [activeIndex, setActiveIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const fullscreenTriggerRef =
    useRef<HTMLButtonElement>(null)

  const closeButtonRef =
    useRef<HTMLButtonElement>(null)

  /*
   * Keep the displayed index valid when the image list changes.
   *
   * This replaces the state-synchronizing effect and avoids
   * an unnecessary render when the number of images changes.
   */
  const currentIndex =
    images.length === 0
      ? 0
      : Math.min(
          Math.max(activeIndex, 0),
          images.length - 1,
        )

  const activeImage =
    images[currentIndex] ?? mainImage

  const hasMultipleImages = images.length > 1

  const showPrevious = useCallback(() => {
    if (!hasMultipleImages) return

    setActiveIndex((current) => {
      const lastIndex = images.length - 1

      const normalizedIndex = Math.min(
        Math.max(current, 0),
        lastIndex,
      )

      return normalizedIndex === 0
        ? lastIndex
        : normalizedIndex - 1
    })
  }, [hasMultipleImages, images.length])

  const showNext = useCallback(() => {
    if (!hasMultipleImages) return

    setActiveIndex((current) => {
      const lastIndex = images.length - 1

      const normalizedIndex = Math.min(
        Math.max(current, 0),
        lastIndex,
      )

      return normalizedIndex >= lastIndex
        ? 0
        : normalizedIndex + 1
    })
  }, [hasMultipleImages, images.length])

  const selectImage = useCallback(
    (index: number) => {
      if (index < 0 || index >= images.length) return

      setActiveIndex(index)
    },
    [images.length],
  )

  const openFullscreen = useCallback(() => {
    setIsFullscreen(true)
  }, [])

  const closeFullscreen = useCallback(() => {
    setIsFullscreen(false)
  }, [])

  useEffect(() => {
    if (!isFullscreen) return

    const previousBodyOverflow =
      document.body.style.overflow

    const previousDocumentOverflow =
      document.documentElement.style.overflow

    /*
     * Capture the trigger element while the effect is active.
     * Cleanup uses this captured reference rather than reading
     * ref.current after the DOM may have changed.
     */
    const fullscreenTrigger =
      fullscreenTriggerRef.current

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeFullscreen()
        return
      }

      if (
        event.key === 'ArrowLeft' &&
        hasMultipleImages
      ) {
        event.preventDefault()
        showNext()
        return
      }

      if (
        event.key === 'ArrowRight' &&
        hasMultipleImages
      ) {
        event.preventDefault()
        showPrevious()
      }
    }

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    document.addEventListener(
      'keydown',
      handleKeyDown,
    )

    closeButtonRef.current?.focus()

    return () => {
      document.removeEventListener(
        'keydown',
        handleKeyDown,
      )

      document.body.style.overflow =
        previousBodyOverflow

      document.documentElement.style.overflow =
        previousDocumentOverflow

      fullscreenTrigger?.focus()
    }
  }, [
    closeFullscreen,
    hasMultipleImages,
    isFullscreen,
    showNext,
    showPrevious,
  ])

  const fullscreenModal =
    isFullscreen && typeof document !== 'undefined'
      ? createPortal(
          <div
            className="
              fixed
              inset-0
              z-[99999]
              isolate
              flex
              flex-col
              overflow-hidden
              overscroll-none
              bg-[#050B12]
              text-white
              [touch-action:pan-y]
            "
            dir="rtl"
            role="dialog"
            aria-modal="true"
            aria-label={`نمایش تمام صفحه ${productName}`}
          >
            {/* نوار بالایی مستقل از تصویر */}
            <header
              className="
                relative
                z-50
                flex
                min-h-[68px]
                shrink-0
                items-center
                justify-between
                gap-3
                border-b
                border-white/[0.08]
                bg-[#08121E]
                px-3
                pb-3
                pt-3
                sm:min-h-[84px]
                sm:px-7
                sm:pb-4
                sm:pt-4
                lg:px-10
              "
              style={{
                paddingTop:
                  'max(12px, env(safe-area-inset-top))',
              }}
            >
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeFullscreen}
                aria-label="بستن نمایش تمام صفحه"
                title="بستن"
                className="
                  group
                  relative
                  z-[100000]
                  inline-flex
                  min-h-11
                  min-w-11
                  shrink-0
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  border
                  border-white/[0.16]
                  bg-white/[0.07]
                  px-3
                  text-white
                  shadow-[0_4px_20px_rgba(0,0,0,0.18)]
                  outline-none
                  transition-all
                  duration-200
                  hover:border-[#B79464]/70
                  hover:bg-[#B79464]
                  active:scale-95
                  focus-visible:ring-2
                  focus-visible:ring-[#D8BC8D]
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-[#08121E]
                  sm:min-h-12
                  sm:min-w-0
                  sm:px-4
                "
              >
                <X
                  className="
                    h-5
                    w-5
                    shrink-0
                    transition-transform
                    duration-200
                    group-hover:rotate-90
                    sm:h-[21px]
                    sm:w-[21px]
                  "
                  strokeWidth={2.2}
                />

                <span className="hidden text-sm font-semibold sm:inline">
                  بستن
                </span>
              </button>

              <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
                <div className="min-w-0 text-right">
                  <p className="truncate text-sm font-semibold text-white sm:text-base">
                    {productName}
                  </p>

                  <p className="mt-1 hidden text-xs text-white/45 sm:block">
                    نمایش تمام‌صفحه تصویر محصول
                  </p>
                </div>

                {hasMultipleImages && (
                  <span
                    aria-live="polite"
                    aria-atomic="true"
                    className="
                      inline-flex
                      h-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/[0.10]
                      bg-white/[0.05]
                      px-3
                      text-xs
                      font-semibold
                      tabular-nums
                      text-white/75
                      sm:h-10
                      sm:px-3.5
                      sm:text-sm
                    "
                  >
                    {currentIndex + 1}
                    <span className="mx-1.5 text-white/30">
                      /
                    </span>
                    {images.length}
                  </span>
                )}
              </div>
            </header>

            {/* فضای نمایش تصویر */}
            <main
              className="
                relative
                flex
                min-h-0
                flex-1
                items-center
                justify-center
                overflow-hidden
                px-1
                py-3
                sm:px-5
                sm:py-5
                lg:px-8
              "
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                  closeFullscreen()
                }
              }}
            >
              <div
                className="
                  relative
                  h-full
                  min-h-0
                  w-full
                  max-w-[1700px]
                "
              >
                <Image
                  src={activeImage.sourceUrl}
                  alt={activeImage.altText || productName}
                  fill
                  sizes="100vw"
                  draggable={false}
                  priority
                  className="
                    pointer-events-none
                    select-none
                    object-contain
                  "
                />

                {hasMultipleImages && (
                  <>
                    <button
                      type="button"
                      onClick={showPrevious}
                      aria-label="تصویر قبلی"
                      title="تصویر قبلی"
                      className="
                        absolute
                        right-1
                        top-1/2
                        z-30
                        flex
                        h-11
                        w-11
                        -translate-y-1/2
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-white/[0.16]
                        bg-[#112F50]/90
                        text-white
                        shadow-[0_5px_24px_rgba(0,0,0,0.28)]
                        backdrop-blur-xl
                        transition-all
                        duration-200
                        hover:border-[#D8BC8D]/70
                        hover:bg-[#B79464]
                        active:scale-95
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-[#D8BC8D]
                        sm:right-3
                        sm:h-12
                        sm:w-12
                        lg:right-5
                        lg:h-[52px]
                        lg:w-[52px]
                      "
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>

                    <button
                      type="button"
                      onClick={showNext}
                      aria-label="تصویر بعدی"
                      title="تصویر بعدی"
                      className="
                        absolute
                        left-1
                        top-1/2
                        z-30
                        flex
                        h-11
                        w-11
                        -translate-y-1/2
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-white/[0.16]
                        bg-[#112F50]/90
                        text-white
                        shadow-[0_5px_24px_rgba(0,0,0,0.28)]
                        backdrop-blur-xl
                        transition-all
                        duration-200
                        hover:border-[#D8BC8D]/70
                        hover:bg-[#B79464]
                        active:scale-95
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-[#D8BC8D]
                        sm:left-3
                        sm:h-12
                        sm:w-12
                        lg:left-5
                        lg:h-[52px]
                        lg:w-[52px]
                      "
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
            </main>

            {/* نوار پایین با رعایت فضای امن موبایل */}
            <footer
              className="
                relative
                z-40
                flex
                min-h-[14px]
                shrink-0
                items-center
                justify-center
                border-t
                border-white/[0.06]
                bg-[#08121E]
                px-4
                py-2
                sm:min-h-[20px]
                sm:py-3
              "
              style={{
                paddingBottom:
                  'max(8px, env(safe-area-inset-bottom))',
              }}
            >
              <span className="text-[10px] text-white/35 sm:text-xs">
                {hasMultipleImages
                  ? 'برای مشاهده تصاویر دیگر از فلش‌ها استفاده کنید'
                  : 'برای خروج، دکمه بستن را انتخاب کنید'}
              </span>
            </footer>
          </div>,
          document.body,
        )
      : null

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
            rounded-[20px]
            bg-[#F0EFEC]
            sm:rounded-[24px]
            lg:rounded-[24px]
          "
        >
          <div
            className="
              group
              relative
              aspect-square
              overflow-hidden
              bg-[#F0EFEC]
              sm:aspect-square
              lg:aspect-[1.06]
            "
          >
            <Image
              key={activeImage.sourceUrl}
              src={activeImage.sourceUrl}
              alt={activeImage.altText || productName}
              fill
              loading={currentIndex === 0 ? 'eager' : 'lazy'}
              fetchPriority={currentIndex === 0 ? 'high' : 'auto'}
              sizes="
                (max-width: 639px) 100vw,
                (max-width: 1023px) 92vw,
                (max-width: 1400px) 48vw, 640px
              "
              className="
                object-contain
                transition-transform
                duration-500
                ease-out
                group-hover:scale-[1.01]
              "
            />

            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                inset-0
                bg-gradient-to-t
                from-[#07131F]/10
                via-transparent
                to-transparent
              "
            />

            {onSale && (
              <span
                className="
                  absolute
                  left-4
                  top-4
                  z-10
                  inline-flex
                  items-center
                  rounded-full
                  bg-[#B79464]
                  px-3
                  py-1.5
                  text-[9px]
                  font-black
                  text-white
                  shadow-[0_8px_24px_rgba(183,148,100,0.28)]
                  sm:left-5
                  sm:top-5
                "
              >
                ویژه
              </span>
            )}

            <div
              className="
                absolute
                bottom-4
                left-4
                right-4
                z-10
                flex
                items-center
                justify-between
                gap-3
                sm:bottom-5
                sm:left-5
                sm:right-5
              "
            >
              <button
                ref={fullscreenTriggerRef}
                type="button"
                onClick={openFullscreen}
                aria-label="نمایش تمام صفحه تصویر"
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/20
                  bg-[#07131F]/45
                  text-white
                  shadow-lg
                  backdrop-blur-xl
                  transition
                  duration-200
                  hover:bg-[#07131F]/70
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#D8BC8D]
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-transparent
                  sm:h-11
                  sm:w-11
                "
              >
                <Maximize2 className="h-4 w-4" />
              </button>

              {hasMultipleImages && (
                <span
                  aria-live="polite"
                  className="
                    rounded-full
                    border
                    border-white/20
                    bg-[#07131F]/45
                    px-3
                    py-1.5
                    text-[9px]
                    font-black
                    tabular-nums
                    text-white
                    shadow-lg
                    backdrop-blur-xl
                  "
                >
                  {currentIndex + 1}
                  {' / '}
                  {images.length}
                </span>
              )}
            </div>

            {hasMultipleImages && (
              <>
                <button
                  type="button"
                  onClick={showPrevious}
                  aria-label="تصویر قبلی"
                  className="
                    absolute
                    right-3
                    top-1/2
                    z-10
                    flex
                    h-10
                    w-10
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/20
                    bg-[#07131F]/35
                    text-white
                    shadow-lg
                    backdrop-blur-xl
                    transition
                    duration-200
                    hover:bg-[#07131F]/60
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[#D8BC8D]
                    sm:right-4
                    sm:h-11
                    sm:w-11
                  "
                >
                  <ChevronRight className="h-[18px] w-[18px]" />
                </button>

                <button
                  type="button"
                  onClick={showNext}
                  aria-label="تصویر بعدی"
                  className="
                    absolute
                    left-3
                    top-1/2
                    z-10
                    flex
                    h-10
                    w-10
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/20
                    bg-[#07131F]/35
                    text-white
                    shadow-lg
                    backdrop-blur-xl
                    transition
                    duration-200
                    hover:bg-[#07131F]/60
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[#D8BC8D]
                    sm:left-4
                    sm:h-11
                    sm:w-11
                  "
                >
                  <ChevronLeft className="h-[18px] w-[18px]" />
                </button>
              </>
            )}
          </div>
        </div>

        {hasMultipleImages && (
          <div className="mt-3 sm:mt-4">
            <div
              className="
                flex
                gap-2
                overflow-x-auto
                pb-1
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
                sm:grid
                sm:grid-cols-5
                sm:gap-2.5
                sm:overflow-visible
              "
              aria-label="انتخاب تصویر محصول"
            >
              {images.map((image, index) => {
                const isActive = currentIndex === index

                return (
                  <button
                    key={`${image.sourceUrl}-${index}`}
                    type="button"
                    onClick={() => selectImage(index)}
                    aria-label={`تصویر ${index + 1} از ${images.length}`}
                    aria-current={isActive ? 'true' : undefined}
                    className={[
                      'group relative shrink-0 overflow-hidden rounded-[13px] bg-[#F0EFEC] outline-none transition-all duration-200 sm:shrink',
                      isActive
                        ? 'ring-2 ring-[#B79464] ring-offset-2 ring-offset-[#FCFCFB]'
                        : 'opacity-75 hover:opacity-100',
                    ].join(' ')}
                  >
                    <span
                      className="
                        relative
                        block
                        aspect-square
                        w-[64px]
                        overflow-hidden
                        sm:w-auto
                      "
                    >
                      <Image
                        src={image.sourceUrl}
                        alt={
                          image.altText ||
                          `${productName} - تصویر ${index + 1}`
                        }
                        fill
                        sizes="(max-width: 639px) 64px, 16vw"
                        className="
                          object-contain
                          transition-transform
                          duration-300
                          group-hover:scale-[1.04]
                        "
                      />

                      <span
                        aria-hidden="true"
                        className={[
                          'absolute inset-0 transition-colors duration-200',
                          isActive
                            ? 'bg-[#112F50]/[0.08]'
                            : 'bg-transparent group-hover:bg-[#112F50]/[0.04]',
                        ].join(' ')}
                      />
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </section>

      {fullscreenModal}
    </>
  )
}