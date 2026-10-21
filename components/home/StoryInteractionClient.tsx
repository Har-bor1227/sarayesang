'use client'

import Image from 'next/image'
import {
  ArrowLeft,
  ArrowRight,
  X,
} from 'lucide-react'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react'

type Story = {
  id: number
  title: string
  subtitle: string
  image: string
  accent: string
}

const STORY_DURATION = 5000

interface StoryInteractionClientProps {
  children: ReactNode
  stories: Story[]
}

export default function StoryInteractionClient({
  children,
  stories,
}: StoryInteractionClientProps) {
  const [activeIndex, setActiveIndex] =
    useState<number | null>(null)

  const [progress, setProgress] =
    useState(0)

  const progressTimer =
    useRef<ReturnType<typeof setInterval> | null>(
      null,
    )

  const isOpen = activeIndex !== null

  const activeStory =
    activeIndex !== null
      ? stories[activeIndex]
      : null

  const goNext = useCallback(() => {
    if (stories.length === 0) {
      return
    }

    setActiveIndex((current) => {
      if (current === null) {
        return null
      }

      return (current + 1) % stories.length
    })

    setProgress(0)
  }, [stories.length])

  const goPrevious = useCallback(() => {
    if (stories.length === 0) {
      return
    }

    setActiveIndex((current) => {
      if (current === null) {
        return null
      }

      return (
        (current - 1 + stories.length) %
        stories.length
      )
    })

    setProgress(0)
  }, [stories.length])

  const closeViewer = useCallback(() => {
    setActiveIndex(null)
    setProgress(0)
  }, [])

  const handleContentClick = (
    event: MouseEvent<HTMLDivElement>,
  ) => {
    const target = event.target

    if (!(target instanceof Element)) {
      return
    }

    const storyButton =
      target.closest<HTMLElement>(
        '[data-story-index]',
      )

    if (storyButton) {
      const index = Number(
        storyButton.dataset.storyIndex,
      )

      if (
        Number.isInteger(index) &&
        index >= 0 &&
        index < stories.length
      ) {
        setActiveIndex(index)
        setProgress(0)
      }

      return
    }

    const scrollButton =
      target.closest<HTMLElement>(
        '[data-story-scroll]',
      )

    if (!scrollButton) {
      return
    }

    const direction =
      scrollButton.dataset.storyScroll

    const rail =
      document.getElementById(
        'stone-story-rail',
      )

    rail?.scrollBy({
      left:
        direction === 'next'
          ? 330
          : -330,
      behavior: 'smooth',
    })
  }

  /*
   * Automatically advance the story viewer.
   * Stable callbacks are included in the dependency list.
   */
  useEffect(() => {
    if (!isOpen || stories.length <= 1) {
      if (progressTimer.current !== null) {
        clearInterval(progressTimer.current)
        progressTimer.current = null
      }

      return
    }

    const startedAt = Date.now()

    progressTimer.current = setInterval(() => {
      const elapsed = Date.now() - startedAt

      const nextProgress = Math.min(
        100,
        (elapsed / STORY_DURATION) * 100,
      )

      setProgress(nextProgress)

      if (nextProgress >= 100) {
        goNext()
      }
    }, 40)

    return () => {
      if (progressTimer.current !== null) {
        clearInterval(progressTimer.current)
        progressTimer.current = null
      }
    }
  }, [
    activeIndex,
    goNext,
    isOpen,
    stories.length,
  ])

  /*
   * Keyboard navigation and body scroll locking.
   * Restore the previous overflow value during cleanup.
   */
  useEffect(() => {
    if (!isOpen) {
      return
    }

    const previousBodyOverflow =
      document.body.style.overflow

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === 'Escape') {
        closeViewer()
        return
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        goNext()
        return
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        goPrevious()
      }
    }

    document.addEventListener(
      'keydown',
      handleKeyDown,
    )

    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener(
        'keydown',
        handleKeyDown,
      )

      document.body.style.overflow =
        previousBodyOverflow
    }
  }, [
    closeViewer,
    goNext,
    goPrevious,
    isOpen,
  ])

  return (
    <>
      <div
        className="mx-auto w-full max-w-[1380px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12"
        onClick={handleContentClick}
      >
        {children}
      </div>

      {/* Viewer */}
      {isOpen && activeStory && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-[#050D15]/[0.94]
            p-2
            backdrop-blur-xl
            sm:p-5
          "
          onClick={closeViewer}
        >
          <div
            className="
              relative
              flex
              h-[100dvh]
              max-h-[860px]
              w-full
              max-w-[470px]
              flex-col
              overflow-hidden
              rounded-none
              border
              border-white/10
              bg-[#0B1825]
              shadow-[0_35px_120px_rgba(0,0,0,0.50)]
              sm:h-[min(90vh,860px)]
              sm:rounded-[30px]
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* Top gradient */}
            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                inset-x-0
                top-0
                z-10
                h-32
                bg-gradient-to-b
                from-black/35
                to-transparent
              "
            />

            {/* Progress */}
            <div
              className="
                absolute
                inset-x-4
                top-3
                z-40
                flex
                gap-1
                sm:inset-x-5
                sm:top-4
              "
            >
              {stories.map((story, index) => {
                const completed =
                  activeIndex !== null &&
                  index < activeIndex

                const current =
                  activeIndex === index

                return (
                  <div
                    key={story.id}
                    className="
                      relative
                      h-[3px]
                      flex-1
                      overflow-hidden
                      rounded-full
                      bg-white/20
                    "
                  >
                    <div
                      className="
                        absolute
                        inset-y-0
                        right-0
                        rounded-full
                        bg-[#D9BC91]
                        shadow-[0_0_8px_rgba(217,188,145,0.35)]
                      "
                      style={{
                        width: completed
                          ? '100%'
                          : current
                            ? `${progress}%`
                            : '0%',
                      }}
                    />
                  </div>
                )
              })}
            </div>

            {/* Close */}
            <button
              type="button"
              aria-label="بستن"
              onClick={closeViewer}
              className="
                absolute
                left-4
                top-8
                z-40
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-white/15
                bg-[#07111D]/35
                text-white
                backdrop-blur-lg
                transition-all
                duration-200
                hover:border-white/25
                hover:bg-white/10
                active:scale-95
                sm:left-5
                sm:top-9
              "
            >
              <X
                className="h-4 w-4"
                strokeWidth={1.8}
              />
            </button>

            {/* Story */}
            <div
              className="
                relative
                flex-1
                overflow-hidden
                bg-[#07111D]
              "
            >
              <Image
                key={activeStory.id}
                src={activeStory.image}
                alt={activeStory.title}
                fill
                sizes="470px"
                className="object-cover"
              />

              {/* Overlay */}
              <div
                aria-hidden="true"
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-[#07111D]
                  via-[#07111D]/5
                  to-transparent
                "
              />

              {/* Tap zones */}
              <button
                type="button"
                aria-label="استوری قبلی"
                onClick={goPrevious}
                className="
                  absolute
                  inset-y-0
                  right-0
                  z-10
                  w-[35%]
                  cursor-pointer
                "
              />

              <button
                type="button"
                aria-label="استوری بعدی"
                onClick={goNext}
                className="
                  absolute
                  inset-y-0
                  left-0
                  z-10
                  w-[35%]
                  cursor-pointer
                "
              />

              {/* Desktop navigation */}
              <button
                type="button"
                aria-label="استوری قبلی"
                onClick={goPrevious}
                className="
                  absolute
                  right-4
                  top-1/2
                  z-30
                  hidden
                  h-11
                  w-11
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/15
                  bg-[#07111D]/40
                  text-white
                  backdrop-blur-xl
                  transition-all
                  hover:bg-[#07111D]/70
                  sm:flex
                "
              >
                <ArrowRight
                  className="h-4 w-4"
                  strokeWidth={1.8}
                />
              </button>

              <button
                type="button"
                aria-label="استوری بعدی"
                onClick={goNext}
                className="
                  absolute
                  left-4
                  top-1/2
                  z-30
                  hidden
                  h-11
                  w-11
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/15
                  bg-[#07111D]/40
                  text-white
                  backdrop-blur-xl
                  transition-all
                  hover:bg-[#07111D]/70
                  sm:flex
                "
              >
                <ArrowLeft
                  className="h-4 w-4"
                  strokeWidth={1.8}
                />
              </button>

              {/* Caption */}
              <div
                className="
                  absolute
                  inset-x-5
                  bottom-7
                  z-30
                  sm:bottom-9
                  sm:left-7
                  sm:right-7
                "
              >
                <div
                  className="
                    mb-3
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-white/10
                    bg-white/[0.07]
                    px-3
                    py-1.5
                    backdrop-blur-md
                  "
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{
                      backgroundColor:
                        activeStory.accent,
                    }}
                  />

                  <span
                    className="
                      text-[8px]
                      font-bold
                      tracking-[0.10em]
                      text-white/65
                    "
                  >
                    SARAYE SANG
                  </span>
                </div>

                <h3
                  className="
                    text-[25px]
                    font-black
                    tracking-[-0.035em]
                    text-white
                    sm:text-[30px]
                  "
                >
                  {activeStory.title}
                </h3>

                <p
                  className="
                    mt-2
                    max-w-[340px]
                    text-[11px]
                    font-medium
                    leading-7
                    text-white/65
                    sm:text-[12px]
                  "
                >
                  {activeStory.subtitle}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}