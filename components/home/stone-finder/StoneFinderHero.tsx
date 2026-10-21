'use client'

import {
  ArrowLeft,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react'
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from 'react'

import { QUESTION_CONFIG } from './config'

type StoneFinderHeroProps = {
  onOpen: () => void
  openerRef: RefObject<
    HTMLButtonElement | null
  >
}

const DYNAMIC_WORDS = [
  'سریع‌تر',
  'راحت‌تر',
  'ساده‌تر',
  'تخصصی‌تر',
  'دقیق‌تر',
]

const ROTATE_DELAY = 1500
const REVEAL_DURATION = 600
const COLLAPSED_WIDTH = 2
const WIDTH_PADDING = 10

const HEADLINE_TEXT_CLASS =
  'font-black leading-[1.38] tracking-[-0.04em]'

export default function StoneFinderHero({
  onOpen,
  openerRef,
}: StoneFinderHeroProps) {
  const [wordIndex, setWordIndex] = useState(0)
  const [wordWidths, setWordWidths] = useState<
    number[]
  >([])
  const [isCollapsed, setIsCollapsed] =
    useState(false)

  const wrapperRef =
    useRef<HTMLSpanElement | null>(null)

  const measureRefs = useRef<
    Array<HTMLSpanElement | null>
  >([])

  /*
   * اندازه‌گیری واقعی کلمات
   */
  useLayoutEffect(() => {
    const measureWords = () => {
      const widths = measureRefs.current.map(
        (element) =>
          element?.getBoundingClientRect().width ??
          0,
      )

      if (
        widths.length !== DYNAMIC_WORDS.length ||
        widths.some((width) => width <= 0)
      ) {
        return
      }

      setWordWidths(widths)
    }

    measureWords()

    const handleResize = () => {
      requestAnimationFrame(measureWords)
    }

    window.addEventListener(
      'resize',
      handleResize,
    )

    if (
      typeof document !== 'undefined' &&
      'fonts' in document
    ) {
      document.fonts.ready.then(measureWords)
    }

    return () => {
      window.removeEventListener(
        'resize',
        handleResize,
      )
    }
  }, [])

  /*
   * چرخه انیمیشن:
   *
   * 1. نمایش کلمه
   * 2. جمع شدن wrapper
   * 3. تعویض کلمه
   * 4. باز شدن wrapper
   */
  useEffect(() => {
    if (
      wordWidths.length !==
      DYNAMIC_WORDS.length
    ) {
      return
    }

    let timer: ReturnType<typeof setTimeout>

    if (!isCollapsed) {
      timer = setTimeout(() => {
        setIsCollapsed(true)
      }, ROTATE_DELAY)

      return () => {
        clearTimeout(timer)
      }
    }

    timer = setTimeout(() => {
      const nextIndex =
        (wordIndex + 1) %
        DYNAMIC_WORDS.length

      setWordIndex(nextIndex)

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsCollapsed(false)
        })
      })
    }, REVEAL_DURATION)

    return () => {
      clearTimeout(timer)
    }
  }, [isCollapsed, wordIndex, wordWidths])

  const currentWidth =
    wordWidths[wordIndex] ?? 0

  const wrapperWidth = isCollapsed
    ? COLLAPSED_WIDTH
    : currentWidth + WIDTH_PADDING

  return (
    <section
      id="stone-finder"
      dir="rtl"
      className="w-full overflow-hidden bg-[#F7F5F0] px-2.5 py-3 sm:px-4 sm:py-7 lg:px-8 lg:py-9"
    >
      <div className="relative mx-auto w-full max-w-[1320px] overflow-hidden rounded-[22px] border border-[#112F50]/[0.07] bg-[#FBFAF7] shadow-[0_16px_45px_rgba(10,25,41,0.06)] sm:rounded-[32px] sm:shadow-[0_20px_60px_rgba(10,25,41,0.06)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#B79464]/[0.08] blur-3xl sm:-right-28 sm:-top-28 sm:h-64 sm:w-64" />

          <div className="absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-[#112F50]/[0.04] blur-3xl sm:-bottom-32 sm:-left-24 sm:h-72 sm:w-72" />
        </div>

        <div className="relative z-10 flex flex-col gap-5 px-4 py-5 sm:gap-6 sm:px-8 sm:py-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:px-12 lg:py-10">
          <div className="min-w-0 flex-1">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#B79464]/20 bg-white/80 px-2.5 py-1.5 shadow-sm sm:px-3">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#B79464] shadow-[0_0_0_4px_rgba(183,148,100,0.10)]" />

              <span className="truncate text-[8px] font-black text-[#8E744F] sm:text-[10px]">
                جستجوی هوشمند سنگ
              </span>
            </div>

            <div className="mt-3 w-full max-w-[780px]">
              <h2
                className={`
                  ${HEADLINE_TEXT_CLASS}
                  w-full
                  max-w-full
                  whitespace-nowrap
                  text-[clamp(14px,5.15vw,28px)]
                  text-[#112F50]
                  sm:text-[38px]
                  lg:text-[46px]
                `}
              >
                سنگ مناسب پروژه‌ات را{' '}

                <span
                  ref={wrapperRef}
                  aria-live="polite"
                  className="relative inline-block overflow-hidden align-baseline pb-[0.02em]"
                  style={{
                    width: `${wrapperWidth}px`,
                    maxWidth: '24vw',
                    transition: `width ${REVEAL_DURATION}ms ease-in-out`,
                    verticalAlign: 'bottom',
                  }}
                >
                  <span className="inline-block whitespace-nowrap text-[#B79464]">
                    {DYNAMIC_WORDS[wordIndex]}
                  </span>

                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-1/2 h-[90%] w-[2px] -translate-y-1/2 rounded-full bg-[#B79464]"
                  />
                </span>

                {' '}پیدا کن
              </h2>

              <p className="mt-2.5 max-w-[700px] text-[10px] font-medium leading-6 text-[#69737F] sm:mt-3 sm:text-[13px] sm:leading-8">
                چند انتخاب کوتاه انجام بده تا از میان محصولات واقعی سرای سنگ، گزینه‌های نزدیک‌تر به نیازت را ببینی.
              </p>
            </div>

            <div className="mt-4 flex max-w-full flex-wrap items-center gap-1.5 sm:mt-5 sm:gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#112F50]/[0.07] bg-white px-2.5 py-1.5 text-[8px] font-black text-[#58636E] sm:px-3 sm:py-2 sm:text-[9px]">
                <Sparkles className="h-3 w-3 text-[#B79464] sm:h-3.5 sm:w-3.5" />
                ۴ مرحله کوتاه
              </span>

              <span className="inline-flex items-center rounded-full border border-[#112F50]/[0.07] bg-white px-2.5 py-1.5 text-[8px] font-black text-[#58636E] sm:px-3 sm:py-2 sm:text-[9px]">
                بدون فرم طولانی
              </span>

              <span className="inline-flex items-center rounded-full border border-[#112F50]/[0.07] bg-white px-2.5 py-1.5 text-[8px] font-black text-[#58636E] sm:px-3 sm:py-2 sm:text-[9px]">
                تصمیم نهایی با تو
              </span>
            </div>
          </div>

          <div className="w-full shrink-0 lg:w-[320px]">
            <div className="relative rounded-[20px] border border-[#112F50]/[0.07] bg-[#112F50] p-1.5 shadow-[0_18px_40px_rgba(17,47,80,0.15)] sm:rounded-[27px] sm:p-2 sm:shadow-[0_22px_50px_rgba(17,47,80,0.16)]">
              <div className="rounded-[16px] border border-white/[0.08] bg-[#0D2741] p-3.5 sm:rounded-[21px] sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[7px] font-black tracking-[0.16em] text-[#D8BC8D] sm:text-[8px] sm:tracking-[0.18em]">
                      انتخاب هوشمند
                    </span>

                    <p className="mt-1 text-[13px] font-black text-white sm:text-[15px]">
                      راهنمای انتخاب سنگ
                    </p>
                  </div>

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] border border-white/[0.08] bg-white/[0.05] sm:h-10 sm:w-10 sm:rounded-[13px]">
                    <SlidersHorizontal className="h-4 w-4 text-[#D8BC8D]" />
                  </div>
                </div>

                <div className="mt-3.5 flex items-center gap-1 sm:mt-4 sm:gap-1.5">
                  {QUESTION_CONFIG.map(
                    (question, index) => (
                      <div
                        key={question.key}
                        className="flex min-w-0 flex-1 items-center gap-1 sm:gap-1.5"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#D8BC8D] text-[7px] font-black text-[#112F50] sm:h-6 sm:w-6 sm:text-[8px]">
                          {index + 1}
                        </span>

                        {index <
                          QUESTION_CONFIG.length -
                            1 && (
                          <span className="h-px flex-1 bg-white/[0.10]" />
                        )}
                      </div>
                    ),
                  )}
                </div>

                <button
                  ref={openerRef}
                  type="button"
                  onClick={onOpen}
                  className="group mt-3.5 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[15px] bg-[#B79464] px-4 text-[11px] font-black text-white shadow-[0_12px_26px_rgba(0,0,0,0.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#C6A574] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#112F50] active:translate-y-0 sm:mt-4 sm:min-h-[58px] sm:gap-2.5 sm:rounded-[17px] sm:px-5 sm:text-[13px]"
                >
                  شروع انتخاب سنگ

                  <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1 sm:h-4 sm:w-4" />
                </button>
              </div>
            </div>

            <div className="mt-2 text-center text-[7px] font-bold text-[#7A838C] sm:mt-2.5 sm:text-[9px]">
              چند سؤال کوتاه تا رسیدن به پیشنهادها
            </div>
          </div>
        </div>

        {/* اندازه‌گیری واقعی کلمات */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed -left-[10000px] top-0 opacity-0"
        >
          {DYNAMIC_WORDS.map((word, index) => (
            <span
              key={word}
              ref={(element) => {
                measureRefs.current[index] =
                  element
              }}
              dir="rtl"
              className={`
                ${HEADLINE_TEXT_CLASS}
                inline-block
                whitespace-nowrap
                text-[clamp(14px,5.15vw,28px)]
                text-[#B79464]
                sm:text-[38px]
                lg:text-[46px]
              `}
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}