'use client'

import type { PointerEvent as ReactPointerEvent } from 'react'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import {
  ANY_VALUE,
  QUESTION_CONFIG,
} from './config'
import type {
  Answers,
  FinderApiResponse,
} from './types'
import { rankProducts } from './utils'

export function useStoneFinder() {
  const [isOpen, setIsOpen] =
    useState(false)

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState('')

  const [data, setData] =
    useState<FinderApiResponse | null>(
      null,
    )

  const [answers, setAnswers] =
    useState<Answers>({})

  const [stepIndex, setStepIndex] =
    useState(0)

  const [showTrust, setShowTrust] =
    useState(false)

  const [showResults, setShowResults] =
    useState(false)

  const [resultIndex, setResultIndex] =
    useState(0)

  const touchStartX =
    useRef<number | null>(null)

  const dialogRef =
    useRef<HTMLDivElement | null>(null)

  const closeButtonRef =
    useRef<HTMLButtonElement | null>(
      null,
    )

  const openerRef =
    useRef<HTMLButtonElement | null>(
      null,
    )

  const availableQuestions =
    useMemo(
      () =>
        data
          ? QUESTION_CONFIG.filter(
              (question) =>
                data.facets[
                  question.key
                ]?.length > 0,
            )
          : [],
      [data],
    )

  const currentQuestion =
    availableQuestions[stepIndex]

  const results = useMemo(
    () =>
      data
        ? rankProducts(
            data.products,
            answers,
          )
        : [],
    [data, answers],
  )

  const activeResult =
    results[resultIndex] ??
    results[0]

  const completedSteps =
    availableQuestions.filter(
      (question) =>
        Boolean(
          answers[question.key],
        ),
    ).length

  const answeredWithoutAny =
    Object.values(answers).filter(
      (value) =>
        Boolean(value) &&
        value !== ANY_VALUE,
    ).length

  const hasRealFilters =
    answeredWithoutAny > 0

  const reset = useCallback(() => {
    setAnswers({})
    setStepIndex(0)
    setShowTrust(false)
    setShowResults(false)
    setResultIndex(0)
    setError('')
  }, [])

  const closeFinder = useCallback(() => {
    setIsOpen(false)
    reset()

    window.requestAnimationFrame(() => {
      openerRef.current?.focus()
    })
  }, [reset])

  const openFinder = useCallback(
    async () => {
      setIsOpen(true)
      setError('')

      if (data) {
        return
      }

      setLoading(true)

      try {
        const response = await fetch(
          '/api/stone-finder',
          {
            method: 'GET',
            headers: {
              Accept:
                'application/json',
            },
            cache: 'no-store',
          },
        )

        if (!response.ok) {
          throw new Error(
            'stone-finder-request-failed',
          )
        }

        const payload =
          (await response.json()) as FinderApiResponse

        setData(payload)
      } catch {
        setError(
          'دریافت اطلاعات سنگ‌ها با مشکل روبه‌رو شد. لطفاً دوباره تلاش کنید.',
        )
      } finally {
        setLoading(false)
      }
    },
    [data],
  )

  const selectAnswer = useCallback(
    (value: string) => {
      if (!currentQuestion) {
        return
      }

      setAnswers((current) => ({
        ...current,
        [currentQuestion.key]:
          value,
      }))
    },
    [currentQuestion],
  )

  const continueStep = useCallback(() => {
    if (!currentQuestion) {
      return
    }

    const currentAnswer =
      answers[currentQuestion.key]

    if (!currentAnswer) {
      return
    }

    /*
     * Trust بین مرحله دوم و سوم نمایش داده می‌شود.
     *
     * بار اول:
     * stepIndex = 1
     * showTrust = false
     *
     * بنابراین Trust باز می‌شود.
     */
    if (
      stepIndex === 1 &&
      availableQuestions.length > 2 &&
      !showTrust
    ) {
      setShowTrust(true)
      return
    }

    /*
     * اگر الان داخل Trust هستیم،
     * قبل از رفتن به مرحله بعد باید Trust بسته شود.
     *
     * باگ قبلی همین‌جا بود:
     * stepIndex تغییر می‌کرد ولی showTrust=true باقی می‌ماند.
     */
    if (showTrust) {
      setShowTrust(false)
    }

    /*
     * اگر هنوز سؤال دیگری وجود دارد،
     * به سؤال بعدی برو.
     */
    if (
      stepIndex <
      availableQuestions.length - 1
    ) {
      setStepIndex(
        (current) => current + 1,
      )
      return
    }

    /*
     * آخرین سؤال تمام شده است.
     * وارد نتایج شو.
     */
    setShowTrust(false)
    setResultIndex(0)
    setShowResults(true)
  }, [
    answers,
    availableQuestions.length,
    currentQuestion,
    showTrust,
    stepIndex,
  ])

  const goBack = useCallback(() => {
    if (showResults) {
      setShowResults(false)
      setResultIndex(0)
      return
    }

    if (showTrust) {
      setShowTrust(false)
      return
    }

    if (stepIndex > 0) {
      setStepIndex(
        (current) => current - 1,
      )
    }
  }, [
    showResults,
    showTrust,
    stepIndex,
  ])

  const moveResult = useCallback(
    (
      direction:
        | 'next'
        | 'previous',
    ) => {
      if (!results.length) {
        return
      }

      setResultIndex((current) => {
        if (direction === 'next') {
          return current <
            results.length - 1
            ? current + 1
            : 0
        }

        return current > 0
          ? current - 1
          : results.length - 1
      })
    },
    [results.length],
  )

  const handlePointerDown =
    useCallback(
      (
        event: ReactPointerEvent<HTMLDivElement>,
      ) => {
        touchStartX.current =
          event.clientX
      },
      [],
    )

  const handlePointerUp =
    useCallback(
      (
        event: ReactPointerEvent<HTMLDivElement>,
      ) => {
        if (
          touchStartX.current === null
        ) {
          return
        }

        const delta =
          event.clientX -
          touchStartX.current

        touchStartX.current = null

        if (Math.abs(delta) < 55) {
          return
        }

        if (delta > 0) {
          moveResult('previous')
        } else {
          moveResult('next')
        }
      },
      [moveResult],
    )

  const handlePointerCancel =
    useCallback(() => {
      touchStartX.current = null
    }, [])

  const openFromResults =
    useCallback((index: number) => {
      setResultIndex(index)
    }, [])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const previousOverflow =
      document.body.style.overflow

    document.body.style.overflow =
      'hidden'

    return () => {
      document.body.style.overflow =
        previousOverflow
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const frame =
      window.requestAnimationFrame(
        () => {
          closeButtonRef.current?.focus()
        },
      )

    return () => {
      window.cancelAnimationFrame(frame)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeFinder()
        return
      }

      if (
        showResults &&
        results.length > 0 &&
        event.key === 'ArrowRight'
      ) {
        event.preventDefault()

        setResultIndex((current) =>
          current > 0
            ? current - 1
            : results.length - 1,
        )

        return
      }

      if (
        showResults &&
        results.length > 0 &&
        event.key === 'ArrowLeft'
      ) {
        event.preventDefault()

        setResultIndex((current) =>
          current <
          results.length - 1
            ? current + 1
            : 0,
        )

        return
      }

      if (
        event.key !== 'Tab' ||
        !dialogRef.current
      ) {
        return
      }

      const focusable =
        Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
          ),
        ).filter(
          (element) =>
            element.getClientRects()
              .length > 0,
        )

      if (!focusable.length) {
        event.preventDefault()
        return
      }

      const first =
        focusable[0]

      const last =
        focusable[
          focusable.length - 1
        ]

      if (
        event.shiftKey &&
        document.activeElement ===
          first
      ) {
        event.preventDefault()
        last.focus()
      } else if (
        !event.shiftKey &&
        document.activeElement ===
          last
      ) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener(
      'keydown',
      handleKeyDown,
    )

    return () =>
      window.removeEventListener(
        'keydown',
        handleKeyDown,
      )
  }, [
    closeFinder,
    isOpen,
    results.length,
    showResults,
  ])

  return {
    isOpen,
    loading,
    error,
    data,
    answers,
    stepIndex,
    showTrust,
    showResults,
    resultIndex,
    availableQuestions,
    currentQuestion,
    results,
    activeResult,
    completedSteps,
    answeredWithoutAny,
    hasRealFilters,
    dialogRef,
    closeButtonRef,
    openerRef,
    openFinder,
    closeFinder,
    reset,
    selectAnswer,
    continueStep,
    goBack,
    moveResult,
    handlePointerDown,
    handlePointerUp,
    handlePointerCancel,
    openFromResults,
  }
}

export type StoneFinderController =
  ReturnType<typeof useStoneFinder>