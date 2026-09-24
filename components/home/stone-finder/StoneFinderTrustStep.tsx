'use client'

import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
} from 'lucide-react'

import { TRUST_POINTS } from './config'
import type {
  Answers,
  QuestionConfig,
} from './types'
import { formatSelection } from './utils'

type StoneFinderTrustStepProps = {
  answers: Answers
  availableQuestions: readonly QuestionConfig[]
  onContinue: () => void
  onBack: () => void
}

export default function StoneFinderTrustStep({
  answers,
  availableQuestions,
  onContinue,
  onBack,
}: StoneFinderTrustStepProps) {
  const completedCount = Math.min(
    2,
    availableQuestions.length,
  )

  const remainingCount = Math.max(
    availableQuestions.length -
      completedCount,
    0,
  )

  return (
    <div className="flex min-h-full items-center justify-center px-3 py-4 sm:px-7 sm:py-9">
      <div className="w-full max-w-[900px]">
        <div className="overflow-hidden rounded-[24px] border border-[#B79464]/15 bg-[#FCFAF5] shadow-[0_22px_50px_rgba(183,148,100,0.10)] sm:rounded-[34px]">
          <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
            <div className="relative overflow-hidden bg-[#112F50] p-5 text-white sm:p-8 lg:p-10">
              <div
                aria-hidden="true"
                className="absolute -left-16 -top-16 h-52 w-52 rounded-full bg-[#B79464]/[0.12] blur-2xl"
              />

              <div
                aria-hidden="true"
                className="absolute -bottom-24 -right-14 h-64 w-64 rounded-full bg-white/[0.035] blur-3xl"
              />

              <div className="relative z-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-[16px] border border-white/[0.08] bg-white/[0.05]">
                  <Sparkles className="h-5 w-5 text-[#D8BC8D]" />
                </div>

                <p className="mt-5 text-[8px] font-black uppercase tracking-[0.22em] text-[#D8BC8D]">
                  نیمه راه
                </p>

                <h3 className="mt-2 text-[24px] font-black leading-[1.48] tracking-[-0.03em] sm:text-[32px]">
                  تا اینجا انتخاب‌هایت مشخص شده‌اند.
                </h3>

                <p className="mt-2.5 text-[9px] font-medium leading-7 text-white/65 sm:text-[11px] sm:leading-8">
                  {remainingCount > 0
                    ? `فقط ${remainingCount} مرحله دیگر مانده تا پیشنهادها را ببینی.`
                    : 'همین حالا می‌توانی پیشنهادها را ببینی.'}
                </p>

                <div className="mt-6 flex gap-1.5">
                  {availableQuestions.map(
                    (question, index) => (
                      <span
                        key={question.key}
                        className={[
                          'h-1.5 rounded-full transition-all',
                          index < completedCount
                            ? 'w-12 bg-[#D8BC8D]'
                            : 'w-5 bg-white/20',
                        ].join(' ')}
                      />
                    ),
                  )}
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-8 lg:p-10">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#B79464] sm:text-[9px]">
                چرا ساده نگهش داشته‌ایم؟
              </span>

              <h4 className="mt-2 text-[21px] font-black leading-[1.5] text-[#112F50] sm:text-[29px]">
                انتخابت را نگه می‌داریم، نه اینکه محدودت کنیم.
              </h4>

              <p className="mt-2.5 max-w-[650px] text-[10px] font-medium leading-7 text-[#6C7680] sm:text-[11px] sm:leading-8">
                Finder برای حذف سردرگمی ساخته شده؛ نه برای اینکه به‌جای تو تصمیم بگیرد.
              </p>

              <div className="mt-5 grid gap-2 sm:grid-cols-3">
                {TRUST_POINTS.map((point) => (
                  <div
                    key={point.value}
                    className="rounded-[17px] border border-[#112F50]/[0.07] bg-white p-3.5 shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#B79464]" />

                      <span className="min-w-0 text-[11px] font-black text-[#112F50]">
                        {point.value}
                      </span>
                    </div>

                    <p className="mt-1.5 text-[8px] font-medium leading-5 text-[#727C85]">
                      {point.text}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-[#B79464]/20 bg-[#FBF8F2] px-3 py-1.5 text-[8px] font-black text-[#92764F]">
                  کاربرد:{' '}
                  {formatSelection(
                    answers.application,
                  )}
                </span>

                <span className="rounded-full border border-[#B79464]/20 bg-[#FBF8F2] px-3 py-1.5 text-[8px] font-black text-[#92764F]">
                  نوع:{' '}
                  {formatSelection(
                    answers.stoneType,
                  )}
                </span>
              </div>

              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={onContinue}
                  className="group inline-flex h-12 w-full min-w-0 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#112F50] px-5 text-[11px] font-black text-white shadow-[0_14px_30px_rgba(17,47,80,0.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#0A1929] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B79464]/40 active:translate-y-0 sm:min-w-0 sm:flex-1 sm:px-6 sm:text-[11px]"
                >
                  <span className="truncate">
                    ادامه انتخاب
                  </span>

                  <ArrowLeft className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:-translate-x-1" />
                </button>

                <button
                  type="button"
                  onClick={onBack}
                  className="inline-flex h-12 w-full min-w-0 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[#112F50]/[0.08] bg-white px-5 text-[10px] font-black text-[#6F7984] transition duration-300 hover:border-[#B79464]/30 hover:bg-[#FBF8F2] hover:text-[#112F50] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B79464]/30 active:translate-y-0 sm:h-11 sm:w-auto sm:min-w-[110px] sm:px-4 sm:text-[9px]"
                >
                  <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                  <span>برگشت</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}