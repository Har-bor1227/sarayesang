'use client'

import {
  ArrowLeft,
  ArrowRight,
  Check,
  SlidersHorizontal,
} from 'lucide-react'

import { ANY_VALUE } from './config'
import type {
  Answers,
  FinderApiResponse,
  QuestionConfig,
  QuestionKey,
} from './types'
import {
  getColorSwatch,
  getOptionSymbol,
} from './utils'

type StoneFinderQuestionStepProps = {
  data: FinderApiResponse
  answers: Answers
  currentQuestion: QuestionConfig
  availableQuestions: readonly QuestionConfig[]
  stepIndex: number
  answeredWithoutAny: number
  onSelect: (value: string) => void
  onContinue: () => void
  onBack: () => void
}

function OptionIcon({
  questionKey,
  value,
}: {
  questionKey: QuestionKey
  value: string
}) {
  if (questionKey === 'colorFamily') {
    return (
      <span
        aria-hidden="true"
        className="h-11 w-11 shrink-0 rounded-[14px] border border-black/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.75),inset_0_-7px_15px_rgba(0,0,0,0.08)] sm:h-14 sm:w-14 sm:rounded-[16px]"
        style={{
          background:
            getColorSwatch(value),
        }}
      />
    )
  }

  return (
    <span
      aria-hidden="true"
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-[#B79464]/15 bg-[#FBF8F2] text-[16px] font-black text-[#9E7F50] transition-transform duration-300 group-hover:scale-105 sm:h-14 sm:w-14 sm:rounded-[16px]"
    >
      {getOptionSymbol(
        questionKey,
        value,
      )}
    </span>
  )
}

export default function StoneFinderQuestionStep({
  data,
  answers,
  currentQuestion,
  availableQuestions,
  stepIndex,
  answeredWithoutAny,
  onSelect,
  onContinue,
  onBack,
}: StoneFinderQuestionStepProps) {
  const selectedValue =
    answers[currentQuestion.key]

  return (
    <div className="mx-auto flex min-h-full w-full max-w-[1120px] flex-col px-4 py-5 sm:px-7 sm:py-8 lg:px-10 lg:py-10">
      <div className="grid gap-6 lg:grid-cols-[0.74fr_1.26fr] lg:items-start lg:gap-10">
        <div className="lg:sticky lg:top-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#B79464]/20 bg-white px-3 py-1.5 text-[8px] font-black text-[#8F744F] sm:text-[9px]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B79464]" />
            {currentQuestion.eyebrow}
          </span>

          <h3 className="mt-3 text-[25px] font-black leading-[1.42] tracking-[-0.035em] text-[#112F50] sm:mt-4 sm:text-[34px] lg:text-[38px]">
            {currentQuestion.title}
          </h3>

          <p className="mt-2.5 max-w-[520px] text-[10px] font-medium leading-7 text-[#687480] sm:text-[12px] sm:leading-8">
            {currentQuestion.description}
          </p>

          <div className="mt-5 hidden rounded-[21px] border border-[#112F50]/[0.07] bg-white p-4 shadow-[0_14px_30px_rgba(17,47,80,0.05)] lg:block">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-[#112F50] text-white">
                <SlidersHorizontal className="h-4 w-4 text-[#D8BC8D]" />
              </div>

              <div>
                <span className="text-[8px] font-black uppercase tracking-[0.18em] text-[#B79464]">
                  یادآوری
                </span>

                <p className="mt-1 text-[10px] font-black leading-5 text-[#112F50]">
                  نزدیک‌ترین گزینه به نیاز واقعی پروژه را انتخاب کن.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4">
            {data.facets[
              currentQuestion.key
            ].map((option) => {
              const selected =
                selectedValue ===
                option

              return (
                <button
                  type="button"
                  key={option}
                  onClick={() =>
                    onSelect(option)
                  }
                  aria-pressed={selected}
                  className={[
                    'group relative flex min-h-[120px] flex-col items-center justify-center overflow-hidden rounded-[21px] border p-3 text-center transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B79464] focus-visible:ring-offset-2 sm:min-h-[154px] sm:rounded-[27px] sm:p-5',
                    selected
                      ? 'border-[#B79464] bg-[#FFFDF8] shadow-[0_16px_32px_rgba(183,148,100,0.14)] -translate-y-0.5'
                      : 'border-[#112F50]/[0.07] bg-white hover:-translate-y-1 hover:border-[#B79464]/30 hover:bg-[#FFFDF8] hover:shadow-[0_16px_32px_rgba(17,47,80,0.07)]',
                  ].join(' ')}
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-transparent via-[#B79464]/0 to-transparent transition-all duration-300 group-hover:via-[#B79464]/45" />

                  <div className="absolute right-2.5 top-2.5 sm:right-3 sm:top-3">
                    {selected ? (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#B79464] text-white shadow-[0_5px_12px_rgba(183,148,100,0.25)]">
                        <Check
                          className="h-3 w-3"
                          strokeWidth={3}
                        />
                      </span>
                    ) : (
                      <span className="block h-5 w-5 rounded-full border border-[#112F50]/[0.10] bg-white" />
                    )}
                  </div>

                  <OptionIcon
                    questionKey={
                      currentQuestion.key
                    }
                    value={option}
                  />

                  <span className="mt-3 line-clamp-2 text-[11px] font-black leading-5 text-[#112F50] sm:mt-4 sm:text-[13px] sm:leading-6">
                    {option}
                  </span>
                </button>
              )
            })}

            <button
              type="button"
              onClick={() =>
                onSelect(ANY_VALUE)
              }
              aria-pressed={
                selectedValue ===
                ANY_VALUE
              }
              className={[
                'group relative flex min-h-[120px] flex-col items-center justify-center rounded-[21px] border p-3 text-center transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B79464] focus-visible:ring-offset-2 sm:min-h-[154px] sm:rounded-[27px] sm:p-5',
                selectedValue ===
                ANY_VALUE
                  ? 'border-[#B79464] bg-[#FFFDF8] shadow-[0_16px_32px_rgba(183,148,100,0.14)] -translate-y-0.5'
                  : 'border-dashed border-[#112F50]/[0.10] bg-[#FBFAF7] hover:border-[#B79464]/35 hover:bg-white hover:-translate-y-0.5',
              ].join(' ')}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-[14px] border border-[#B79464]/15 bg-[#FBF8F2] text-[#9E7F50] transition-transform duration-300 group-hover:scale-105 sm:h-14 sm:w-14 sm:rounded-[16px]">
                <SlidersHorizontal className="h-5 w-5" />
              </div>

              <span className="mt-3 text-[11px] font-black text-[#112F50] sm:mt-4 sm:text-[13px]">
                فرقی ندارد
              </span>

              <span className="mt-1 text-[7px] font-bold text-[#87909A] sm:text-[8px]">
                آزاد گذاشتن این مرحله
              </span>
            </button>
          </div>

          <div className="mt-5 rounded-[19px] border border-[#112F50]/[0.06] bg-white px-3.5 py-3 shadow-sm sm:mt-7 sm:px-5 sm:py-3.5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F7F1E6] text-[#9E7F50]">
                  <Check
                    className="h-3.5 w-3.5"
                    strokeWidth={3}
                  />
                </div>

                <span className="truncate text-[8px] font-bold text-[#6F7882] sm:text-[10px]">
                  انتخاب‌ها فقط برای مرتب‌کردن پیشنهادها هستند.
                </span>
              </div>

              <span className="shrink-0 text-[8px] font-black text-[#B79464] sm:text-[9px]">
                {answeredWithoutAny}{' '}
                انتخاب دقیق
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 z-20 mt-auto -mx-4 border-t border-[#112F50]/[0.06] bg-[#F8F6F1]/95 px-4 py-3 backdrop-blur-xl sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:pt-8">
        <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <button
            type="button"
            onClick={onBack}
            disabled={stepIndex === 0}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[#112F50]/[0.09] bg-white px-5 text-[9px] font-black text-[#69737E] transition hover:border-[#B79464]/35 hover:text-[#112F50] disabled:cursor-not-allowed disabled:opacity-35 sm:h-11 sm:text-[10px]"
          >
            <ArrowRight className="h-3.5 w-3.5" />
            مرحله قبل
          </button>

          <button
            type="button"
            onClick={onContinue}
            disabled={!selectedValue}
            className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#112F50] px-7 text-[10px] font-black text-white shadow-[0_15px_32px_rgba(17,47,80,0.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#0A1929] disabled:cursor-not-allowed disabled:opacity-35 sm:min-w-[205px] sm:w-auto sm:text-[11px]"
          >
            <span>
              {stepIndex ===
              availableQuestions.length - 1
                ? 'دیدن سنگ‌های مناسب'
                : 'ادامه انتخاب'}
            </span>

            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  )
}