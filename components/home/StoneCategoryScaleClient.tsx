'use client'

import {
  useEffect,
  useRef,
  type ReactNode,
} from 'react'

interface StoneCategoryScaleClientProps {
  children: ReactNode
  itemCount: number
}

interface ViewportMetrics {
  center: number
  width: number
}

export default function StoneCategoryScaleClient({
  children,
  itemCount,
}: StoneCategoryScaleClientProps) {
  const viewportRef =
    useRef<HTMLDivElement>(null)

  useEffect(() => {
    const viewport =
      viewportRef.current

    if (!viewport || itemCount === 0) {
      return
    }

    const reducedMotionQuery =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      )

    const items = Array.from(
      viewport.querySelectorAll<HTMLElement>(
        '[data-stone-category-item]',
      ),
    )

    if (!items.length) {
      return
    }

    let animationFrame = 0
    let viewportMetrics: ViewportMetrics = {
      center: 0,
      width: 0,
    }

    let isVisible =
      document.visibilityState === 'visible'

    const lastScales = new Array<string>(
      items.length,
    ).fill('1')

    const updateViewportMetrics = (
      width: number,
    ) => {
      viewportMetrics = {
        center: width / 2,
        width,
      }
    }

    const resetScales = () => {
      items.forEach((item, index) => {
        if (lastScales[index] === '1') {
          return
        }

        item.style.setProperty(
          '--category-scale',
          '1',
        )

        lastScales[index] = '1'
      })
    }

    const calculateAndApplyScales = () => {
      if (
        !isVisible ||
        reducedMotionQuery.matches
      ) {
        return
      }

      const {
        center: viewportCenter,
        width: viewportWidth,
      } = viewportMetrics

      if (viewportWidth <= 0) {
        return
      }

      const isMobile =
        viewportWidth < 640

      const isTablet =
        viewportWidth >= 640 &&
        viewportWidth < 1024

      const fullScaleZone = isMobile
        ? viewportWidth * 0.09
        : isTablet
          ? Math.min(
              110,
              viewportWidth * 0.11,
            )
          : Math.min(
              180,
              Math.max(
                110,
                viewportWidth * 0.14,
              ),
            )

      const edgeZone = Math.max(
        viewportWidth * 0.55,
        fullScaleZone + 180,
      )

      const minScale = isMobile
        ? 0.78
        : isTablet
          ? 0.73
          : 0.68

      const range = Math.max(
        edgeZone - fullScaleZone,
        1,
      )

      // READ PHASE
      // Read all geometry before changing any styles.
      const distances = items.map(
        (item) => {
          const rect =
            item.getBoundingClientRect()

          const itemCenter =
            rect.left +
            rect.width / 2

          return Math.abs(
            itemCenter -
              viewportCenter,
          )
        },
      )

      // CALCULATE PHASE
      const nextScales =
        distances.map((distance) => {
          if (
            distance <= fullScaleZone
          ) {
            return '1'
          }

          const rawProgress =
            Math.min(
              1,
              Math.max(
                0,
                (distance -
                  fullScaleZone) /
                  range,
              ),
            )

          const smoothProgress =
            rawProgress *
            rawProgress *
            (3 - 2 * rawProgress)

          const scale =
            1 -
            (1 - minScale) *
              smoothProgress

          return scale.toFixed(3)
        })

      // WRITE PHASE
      // Apply all style changes only after all reads are done.
      items.forEach((item, index) => {
        const nextScale =
          nextScales[index]

        if (
          nextScale ===
          lastScales[index]
        ) {
          return
        }

        item.style.setProperty(
          '--category-scale',
          nextScale,
        )

        lastScales[index] =
          nextScale
      })
    }

    const scheduleNextFrame = () => {
      if (!isVisible) {
        return
      }

      animationFrame =
        requestAnimationFrame(() => {
          calculateAndApplyScales()
          scheduleNextFrame()
        })
    }

    const start = () => {
      cancelAnimationFrame(
        animationFrame,
      )

      if (
        reducedMotionQuery.matches
      ) {
        resetScales()
        return
      }

      calculateAndApplyScales()
      scheduleNextFrame()
    }

    const handleMotionChange = () => {
      start()
    }

    const handleVisibilityChange =
      () => {
        isVisible =
          document.visibilityState ===
          'visible'

        if (!isVisible) {
          cancelAnimationFrame(
            animationFrame,
          )
          return
        }

        start()
      }

    const resizeObserver =
      new ResizeObserver(
        (entries) => {
          const entry =
            entries[0]

          if (!entry) {
            return
          }

          updateViewportMetrics(
            entry.contentRect.width,
          )
        },
      )

    resizeObserver.observe(viewport)

    reducedMotionQuery.addEventListener(
      'change',
      handleMotionChange,
    )

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange,
    )

    updateViewportMetrics(
      viewport.clientWidth,
    )

    start()

    return () => {
      cancelAnimationFrame(
        animationFrame,
      )

      resizeObserver.disconnect()

      reducedMotionQuery.removeEventListener(
        'change',
        handleMotionChange,
      )

      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange,
      )
    }
  }, [itemCount])

  return (
    <div ref={viewportRef}>
      {children}
    </div>
  )
}