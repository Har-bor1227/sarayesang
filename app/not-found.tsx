import type { Metadata } from 'next'
import Link from 'next/link'

import {
  ArrowLeft,
  CircleHelp,
  FileQuestion,
  Home,
  Layers3,
  SearchX,
} from 'lucide-react'

import Container from '@/components/ui/container'
import { Button } from '@/components/ui/button'

import { SITE_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'صفحه یافت نشد',

  description: `صفحه مورد نظر شما در وب‌سایت ${SITE_NAME} پیدا نشد. برای مشاهده محصولات سنگ ساختمانی و دسته‌بندی‌ها به صفحه اصلی مراجعه کنید.`,

  robots: {
    index: false,
    follow: false,
  },
}

const possibleReasons = [
  'آدرس صفحه را اشتباه وارد کرده‌اید.',
  'صفحه مورد نظر تغییر آدرس داده است.',
  'محتوای صفحه حذف شده یا دیگر در دسترس نیست.',
]

export default function NotFound() {
  return (
    <main
      dir="rtl"
      className="relative isolate flex min-h-[75svh] items-center overflow-hidden bg-[#FCFCFB] py-12 sm:py-16 lg:py-20"
    >
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -right-32 -top-32 size-80 rounded-full bg-[#B79464]/10 blur-3xl sm:size-[28rem]" />

        <div className="absolute -bottom-40 -left-32 size-96 rounded-full bg-[#112F50]/[0.045] blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'radial-gradient(#112F50 0.7px, transparent 0.7px)',
            backgroundSize: '22px 22px',
          }}
        />
      </div>

      <Container className="relative w-full">
        <section
          aria-labelledby="not-found-title"
          className="mx-auto flex w-full max-w-2xl flex-col items-center text-center"
        >
          {/* Illustration */}
          <div
            aria-hidden="true"
            className="relative mb-8 flex size-56 items-center justify-center sm:mb-10 sm:size-64"
          >
            {/* Outer animated ring */}
            <div className="absolute inset-2 rounded-full border border-dashed border-[#B79464]/45 motion-safe:animate-[spin_36s_linear_infinite] motion-reduce:animate-none" />

            <div className="absolute inset-6 rounded-full border border-[#112F50]/[0.07]" />

            {/* Decorative floating elements */}
            <div className="absolute right-5 top-7 flex size-11 items-center justify-center rounded-2xl border border-[#B79464]/25 bg-white text-[#B79464] shadow-[0_8px_24px_rgba(17,47,80,0.06)] motion-safe:animate-[bounce_3s_ease-in-out_infinite]">
              <CircleHelp size={22} strokeWidth={1.8} />
            </div>

            <div className="absolute bottom-8 left-4 flex size-12 items-center justify-center rounded-2xl border border-[#112F50]/10 bg-white text-[#112F50] shadow-[0_8px_24px_rgba(17,47,80,0.06)] motion-safe:animate-[bounce_4s_ease-in-out_infinite]">
              <SearchX size={23} strokeWidth={1.7} />
            </div>

            <span className="absolute left-12 top-12 size-2 rounded-full bg-[#B79464] motion-safe:animate-pulse" />
            <span className="absolute bottom-14 right-7 size-2.5 rounded-full bg-[#112F50]/25 motion-safe:animate-pulse" />

            {/* Main visual card */}
            <div className="relative flex w-44 flex-col overflow-hidden rounded-[1.75rem] border border-[#112F50]/10 bg-white shadow-[0_20px_65px_rgba(17,47,80,0.12)] sm:w-48">
              <div className="flex h-9 items-center gap-1.5 border-b border-[#112F50]/[0.07] bg-[#FCFCFB] px-4">
                <span className="size-2 rounded-full bg-[#B79464]/70" />
                <span className="size-2 rounded-full bg-[#112F50]/15" />
                <span className="size-2 rounded-full bg-[#112F50]/10" />
              </div>

              <div className="flex flex-col items-center px-4 pb-5 pt-5 sm:pb-6">
                <div className="mb-1 flex size-12 items-center justify-center rounded-2xl bg-[#112F50]/[0.055] text-[#112F50]">
                  <FileQuestion size={27} strokeWidth={1.6} />
                </div>

                <span className="mt-1 text-[3.5rem] font-black leading-none tracking-[-0.06em] text-[#112F50] sm:text-[4rem]">
                  404
                </span>

                <div className="mt-3 h-1 w-12 rounded-full bg-[#B79464]" />

                <div className="mt-3 h-1.5 w-24 rounded-full bg-[#112F50]/10" />
                <div className="mt-2 h-1.5 w-16 rounded-full bg-[#112F50]/[0.06]" />
              </div>
            </div>
          </div>

          {/* Eyebrow */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#B79464]/30 bg-[#B79464]/[0.09] px-4 py-2 text-sm font-medium text-[#80613B]">
            <span className="size-1.5 rounded-full bg-[#B79464]" />
            <span>خطای ۴۰۴ · مسیر ناموجود</span>
          </div>

          {/* Heading */}
          <h1
            id="not-found-title"
            className="max-w-xl text-2xl font-extrabold leading-[1.7] tracking-tight text-[#112F50] sm:text-3xl md:text-4xl"
          >
            اوپس! به نظر می‌رسد
            <span className="relative mx-2 inline-block text-[#B79464]">
              گم شده‌اید!
              <span className="absolute -bottom-0.5 right-0 h-1 w-full rounded-full bg-[#B79464]/20" />
            </span>
          </h1>

          <p className="mt-4 max-w-lg text-sm leading-8 text-[#647184] sm:text-base sm:leading-9">
            متأسفانه صفحه‌ای که دنبالش هستید پیدا نشد. شاید آدرس آن تغییر کرده
            باشد یا این صفحه دیگر در دسترس نباشد.
          </p>

          {/* Possible reasons */}
          <div className="mt-7 w-full max-w-lg rounded-2xl border border-[#112F50]/[0.08] bg-white/80 p-5 text-right shadow-[0_8px_30px_rgba(17,47,80,0.035)] sm:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-[#112F50] sm:text-base">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#B79464]/10 text-[#A17B4C]">
                <CircleHelp size={17} />
              </span>
              چه اتفاقی افتاده است؟
            </h2>

            <ul className="space-y-3">
              {possibleReasons.map((reason, index) => (
                <li
                  key={reason}
                  className="flex items-start gap-3 text-sm leading-7 text-[#647184]"
                >
                  <span className="mt-1.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#112F50]/[0.055] text-[11px] font-bold text-[#112F50]">
                    {index + 1}
                  </span>

                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="mt-7 flex w-full max-w-lg flex-col gap-3 sm:mt-8 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              variant="primary"
              className="h-12 w-full gap-2 rounded-full bg-[#112F50] px-7 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(17,47,80,0.14)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#193F66] hover:shadow-[0_12px_26px_rgba(17,47,80,0.18)] sm:w-auto"
            >
              <Link href="/">
                <Home size={18} strokeWidth={1.9} />
                <span>بازگشت به صفحه اصلی</span>
                <ArrowLeft size={17} strokeWidth={1.8} />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 w-full gap-2 rounded-full border-[#112F50]/15 bg-white px-7 text-sm font-semibold text-[#112F50] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#B79464] hover:bg-[#B79464]/[0.06] hover:text-[#112F50] sm:w-auto"
            >
              <Link href="/categories">
                <Layers3 size={18} strokeWidth={1.8} />
                <span>مشاهده دسته‌بندی‌ها</span>
              </Link>
            </Button>
          </div>

          {/* Footer note */}
          <div className="mt-9 flex items-center justify-center gap-2 text-xs text-[#8993A1] sm:text-sm">
            <span className="h-px w-7 bg-[#B79464]/40" />
            <span>سرای سنگ؛ همراه شما در انتخاب سنگ ساختمانی</span>
            <span className="h-px w-7 bg-[#B79464]/40" />
          </div>
        </section>
      </Container>
    </main>
  )
}