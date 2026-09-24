import {
  Scale,
} from 'lucide-react'

import Container from '@/components/ui/container'

import ComparisonInteractive from './ComparisonInteractive'

export default function ComparisonSection() {
  return (
    <>
      <section
        dir="rtl"
        className="
          relative
          w-full
          overflow-hidden
          bg-[#FCFCFB]
          pb-4
          pt-9
          sm:pb-5
          sm:pt-11
          md:pt-13
          lg:pt-15
        "
      >
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            right-[-130px]
            top-[-110px]
            h-64
            w-64
            rounded-full
            bg-[#B79464]/[0.045]
            blur-3xl
            sm:h-72
            sm:w-72
          "
        />

        <Container>
          <div className="mx-auto max-w-[760px] text-center">
            <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-[#B79464]/20 bg-[#B79464]/[0.07] px-3 py-1.5">
              <Scale
                aria-hidden="true"
                className="h-3 w-3 text-[#B79464]"
                strokeWidth={1.8}
              />

              <span className="text-[8px] font-black text-[#81623D] sm:text-[9px]">
                مقایسه سنگ‌ها
              </span>
            </div>

            <h2 className="text-[24px] font-black leading-[1.3] tracking-[-0.045em] text-[#112F50] sm:text-[30px] md:text-[36px] lg:text-[40px]">
              دو سنگ،
              <span className="text-[#B79464]">
                {' '}
                یک انتخاب دقیق
              </span>
            </h2>
          </div>
        </Container>
      </section>

      <ComparisonInteractive />
    </>
  )
}