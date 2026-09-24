'use client'

import {
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide-react'

import type { StoneFinderController } from './useStoneFinder'
import StoneFinderQuestionStep from './StoneFinderQuestionStep'
import StoneFinderResults from './StoneFinderResults'
import StoneFinderTrustStep from './StoneFinderTrustStep'

type StoneFinderDialogProps = {
  controller: StoneFinderController
}

export default function StoneFinderDialog({
  controller,
}: StoneFinderDialogProps) {
  const {
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
    answeredWithoutAny,
    hasRealFilters,
    dialogRef,
    closeButtonRef,
    closeFinder,
    reset,
    openFinder,
    selectAnswer,
    continueStep,
    goBack,
    moveResult,
    handlePointerDown,
    handlePointerUp,
    handlePointerCancel,
    openFromResults,
  } = controller

  if (!isOpen) {
    return null
  }

  const completedAnswers =
    availableQuestions.filter(
      (question) =>
        Boolean(
          answers[question.key],
        ),
    ).length

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-[#06131F]/[0.86] p-0 backdrop-blur-xl sm:items-center sm:p-4"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          closeFinder()
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="stone-finder-dialog-title"
        aria-describedby="stone-finder-dialog-description"
        className="relative flex h-[100dvh] w-full max-w-[1240px] flex-col overflow-hidden rounded-t-[28px] border border-white/[0.10] bg-[#F8F6F1] shadow-[0_-20px_80px_rgba(0,0,0,0.35)] sm:h-[min(900px,calc(100vh-32px))] sm:rounded-[32px] sm:shadow-[0_42px_120px_rgba(0,0,0,0.40)]"
      >
        <header className="relative shrink-0 border-b border-[#112F50]/[0.07] bg-white/95 px-4 py-3.5 backdrop-blur-xl sm:px-7 sm:py-5 lg:px-9">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[#112F50]/[0.10] sm:hidden" />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-l from-transparent via-[#B79464]/35 to-transparent" />

          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-[#112F50] text-white shadow-[0_10px_24px_rgba(17,47,80,0.16)] sm:h-12 sm:w-12 sm:rounded-[16px]">
                <Sparkles className="h-4.5 w-4.5 text-[#D8BC8D] sm:h-5 sm:w-5" />
              </div>

              <div className="min-w-0">
                <p className="text-[8px] font-black uppercase tracking-[0.20em] text-[#B79464] sm:text-[9px]">
                  Saraye Sang Finder
                </p>

                <h2
                  id="stone-finder-dialog-title"
                  className="mt-0.5 truncate text-[14px] font-black text-[#112F50] sm:text-[17px]"
                >
                  راهنمای هوشمند انتخاب سنگ
                </h2>

                <p
                  id="stone-finder-dialog-description"
                  className="sr-only"
                >
                  با پاسخ به چند سؤال کوتاه، گزینه‌های نزدیک به نیاز پروژه نمایش داده می‌شوند.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={reset}
                aria-label="شروع دوباره"
                className="hidden h-10 w-10 items-center justify-center rounded-full border border-[#112F50]/[0.08] bg-[#FAF9F6] text-[#69737E] transition hover:border-[#B79464]/40 hover:text-[#8F7048] sm:flex"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeFinder}
                aria-label="بستن"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#112F50]/[0.08] bg-white text-[#69737E] transition hover:border-[#B79464]/40 hover:text-[#112F50] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B79464]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {!loading &&
            !error &&
            data &&
            !showResults &&
            availableQuestions.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between gap-3 text-[8px] font-black text-[#7A838D] sm:text-[9px]">
                  <span>
                    {showTrust
                      ? 'نیمه راه'
                      : currentQuestion?.eyebrow}
                  </span>

                  <span>
                    {showTrust
                      ? `${completedAnswers} از ${availableQuestions.length} انتخاب`
                      : `${Math.min(
                          stepIndex + 1,
                          availableQuestions.length,
                        )} از ${
                          availableQuestions.length
                        }`}
                  </span>
                </div>

                <div className="mt-2 flex gap-1.5">
                  {availableQuestions.map(
                    (question, index) => {
                      const hasAnswer =
                        Boolean(
                          answers[
                            question.key
                          ],
                        )

                      const done =
                        hasAnswer &&
                        (index <
                          stepIndex ||
                          showTrust)

                      const active =
                        !showTrust &&
                        index ===
                          stepIndex

                      return (
                        <div
                          key={
                            question.key
                          }
                          className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#112F50]/[0.06]"
                        >
                          <div
                            className={[
                              'h-full rounded-full transition-all duration-500',
                              done
                                ? 'w-full bg-[#B79464]'
                                : active
                                  ? 'w-2/5 bg-[#D8BC8D]'
                                  : 'w-0 bg-transparent',
                            ].join(
                              ' ',
                            )}
                          />
                        </div>
                      )
                    },
                  )}
                </div>
              </div>
            )}
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {loading && (
            <div className="flex min-h-full items-center justify-center px-5 py-12">
              <div className="w-full max-w-[560px] text-center">
                <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-[23px] border border-[#B79464]/15 bg-white shadow-[0_18px_45px_rgba(17,47,80,0.08)] sm:h-20 sm:w-20 sm:rounded-[25px]">
                  <Sparkles className="h-7 w-7 animate-pulse text-[#B79464]" />
                </div>

                <h3 className="mt-5 text-[22px] font-black text-[#112F50] sm:mt-6 sm:text-[30px]">
                  در حال آماده‌کردن انتخاب‌ها
                </h3>

                <p className="mx-auto mt-2.5 max-w-[500px] text-[10px] font-medium leading-7 text-[#6D7782] sm:mt-3 sm:text-[12px] sm:leading-8">
                  اطلاعات سنگ‌های واقعی مجموعه را بررسی می‌کنیم تا گزینه‌های مناسب‌تر برایت آماده شوند.
                </p>

                <div className="mx-auto mt-5 flex max-w-[260px] gap-1.5 sm:mt-6">
                  {[0, 1, 2, 3].map(
                    (item) => (
                      <span
                        key={item}
                        className="h-1.5 flex-1 animate-pulse rounded-full bg-[#B79464]/25"
                        style={{
                          animationDelay: `${item * 120}ms`,
                        }}
                      />
                    ),
                  )}
                </div>
              </div>
            </div>
          )}

          {!loading && error && (
            <div className="flex min-h-full items-center justify-center px-5 py-12">
              <div className="max-w-[520px] text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#FBF0EE] text-[#B34F45]">
                  <RotateCcw className="h-6 w-6" />
                </div>

                <h3 className="mt-5 text-[21px] font-black text-[#112F50] sm:mt-6 sm:text-[26px]">
                  یک مشکل موقت پیش آمد
                </h3>

                <p className="mt-2.5 text-[10px] font-medium leading-7 text-[#6D7782] sm:text-[12px] sm:leading-8">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={openFinder}
                  className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#112F50] px-6 text-[10px] font-black text-white shadow-[0_14px_30px_rgba(17,47,80,0.16)] transition hover:-translate-y-0.5 hover:bg-[#0A1929] sm:mt-7 sm:text-[11px]"
                >
                  تلاش دوباره
                  <span aria-hidden="true">
                    ←
                  </span>
                </button>
              </div>
            </div>
          )}

          {!loading &&
            !error &&
            data &&
            availableQuestions.length ===
              0 && (
              <div className="flex min-h-full items-center justify-center px-5 py-12">
                <div className="max-w-[540px] text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#FBF8F2] text-[#B79464]">
                    <SlidersHorizontal className="h-6 w-6" />
                  </div>

                  <h3 className="mt-5 text-[21px] font-black text-[#112F50] sm:mt-6 sm:text-[25px]">
                    هنوز داده کافی نداریم
                  </h3>

                  <p className="mt-2.5 text-[10px] font-medium leading-7 text-[#6D7782] sm:text-[11px] sm:leading-8">
                    ویژگی‌های محصولات هنوز برای پیشنهاددهی کامل نشده‌اند. بعداً دوباره امتحان کن.
                  </p>
                </div>
              </div>
            )}

          {!loading &&
            !error &&
            data &&
            !showResults &&
            !showTrust &&
            currentQuestion && (
              <StoneFinderQuestionStep
                data={data}
                answers={answers}
                currentQuestion={
                  currentQuestion
                }
                availableQuestions={
                  availableQuestions
                }
                stepIndex={stepIndex}
                answeredWithoutAny={
                  answeredWithoutAny
                }
                onSelect={selectAnswer}
                onContinue={
                  continueStep
                }
                onBack={goBack}
              />
            )}

          {!loading &&
            !error &&
            data &&
            !showResults &&
            showTrust && (
              <StoneFinderTrustStep
                answers={answers}
                availableQuestions={
                  availableQuestions
                }
                onContinue={
                  continueStep
                }
                onBack={goBack}
              />
            )}

          {!loading &&
            !error &&
            data &&
            showResults && (
              <StoneFinderResults
                results={results}
                activeResult={
                  activeResult
                }
                resultIndex={resultIndex}
                answeredWithoutAny={
                  answeredWithoutAny
                }
                hasRealFilters={
                  hasRealFilters
                }
                onMoveResult={
                  moveResult
                }
                onPointerDown={
                  handlePointerDown
                }
                onPointerUp={
                  handlePointerUp
                }
                onPointerCancel={
                  handlePointerCancel
                }
                onOpenResult={
                  openFromResults
                }
                onBack={goBack}
                onReset={reset}
              />
            )}
        </div>
      </div>
    </div>
  )
}