
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  Sparkles,
} from 'lucide-react'

import Container from '@/components/ui/container'

export default function PromoBanners() {
  return (
    <section
      dir="rtl"
      className="
        relative
        w-full
        overflow-hidden
        bg-[#FCFCFB]
        py-8
        sm:py-10
        md:py-12
        lg:py-14
      "
    >
      <Container>
        <div
          className="
            grid
            min-w-0
            gap-4
            lg:grid-cols-[1.15fr_0.85fr]
            lg:gap-5
            xl:grid-cols-[1.1fr_0.9fr]
          "
        >
          {/* =========================================================
              NATURAL STONE
          ========================================================== */}
          <article
            className="
              group
              relative
              isolate
              min-h-[245px]
              overflow-hidden
              rounded-[28px]
              border
              border-[#E7DED0]
              bg-[#F3E9D8]
              shadow-[0_12px_34px_rgba(17,47,80,0.055)]
              transition-[transform,box-shadow]
              duration-500
              ease-[cubic-bezier(.22,1,.36,1)]
              hover:-translate-y-1
              hover:shadow-[0_18px_42px_rgba(17,47,80,0.09)]
              sm:min-h-[275px]
              lg:min-h-[315px]
            "
          >
            {/* Image layer */}
            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                inset-y-0
                left-0
                z-0
                w-[calc(50%+6px)]
                overflow-hidden
                sm:w-[calc(48%+6px)]
                lg:w-[calc(50%+6px)]
              "
            >
              <Image
                src="/images/home/banners/natural-stone.webp"
                alt=""
                fill
                sizes="
                  (max-width: 639px) 54vw,
                  (max-width: 1023px) 52vw,
                  430px
                "
                className="
                  object-cover
                  object-center
                  select-none
                  transition-transform
                  duration-1000
                  ease-[cubic-bezier(.22,1,.36,1)]
                  group-hover:scale-[1.06]
                "
              />

              {/* Single unified blend — no hard edge */}
              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-r
                  from-transparent
                  via-[#F3E9D8]/[0.18]
                  to-[#F3E9D8]
                "
              />
            </div>

            {/* Ambient glow */}
            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                -bottom-16
                -left-16
                z-0
                h-40
                w-40
                rounded-full
                bg-[#B79464]/[0.10]
                blur-3xl
              "
            />

            {/* Content */}
            <div
              className="
                relative
                z-10
                flex
                min-h-[245px]
                max-w-[74%]
                flex-col
                justify-center
                px-5
                py-6
                sm:min-h-[275px]
                sm:max-w-[67%]
                sm:px-7
                sm:py-8
                lg:min-h-[315px]
                lg:max-w-[64%]
                lg:px-8
              "
            >
              {/* Eyebrow */}
              <div className="mb-3 flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="
                    h-[2px]
                    w-7
                    shrink-0
                    rounded-full
                    bg-[#B79464]
                    sm:w-9
                  "
                />

                <span
                  className="
                    whitespace-nowrap
                    text-[9px]
                    font-black
                    text-[#8A6A42]
                    sm:text-[10px]
                  "
                >
                  انتخابی اصیل برای معماری
                </span>
              </div>

              {/* Title */}
              <h2
                className="
                  text-[25px]
                  font-black
                  leading-[1.3]
                  tracking-[-0.04em]
                  text-[#112F50]
                  sm:text-[30px]
                  lg:text-[34px]
                "
              >
                سنگ طبیعی،
                <br />
                <span className="text-[#98784F]">
                  حس اصالت
                </span>
              </h2>

              {/* Description */}
              <p
                className="
                  mt-3
                  max-w-[310px]
                  text-[10px]
                  font-medium
                  leading-6
                  text-[#5C6876]
                  sm:text-[11px]
                  sm:leading-7
                  lg:text-[12px]
                "
              >
                مجموعه‌ای از سنگ‌های طبیعی برای
                فضاهای ماندگار و پروژه‌هایی که
                قرار است سال‌ها زیبا بمانند.
              </p>

              {/* CTA */}
              <Link
                href="/products"
                className="
                  group/link
                  mt-5
                  inline-flex
                  h-10
                  w-fit
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-[#112F50]/10
                  bg-[#112F50]
                  px-4
                  text-[10px]
                  font-black
                  text-white
                  shadow-[0_6px_16px_rgba(17,47,80,0.13)]
                  transition-[transform,background-color,box-shadow]
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-[#0A1929]
                  hover:shadow-[0_9px_22px_rgba(17,47,80,0.18)]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#B79464]
                  focus-visible:ring-offset-2
                  sm:h-11
                  sm:px-5
                  sm:text-[11px]
                "
              >
                <span>مشاهده محصولات</span>

                <span
                  aria-hidden="true"
                  className="
                    flex
                    h-5
                    w-5
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-white/10
                  "
                >
                  <ArrowLeft
                    className="
                      h-3
                      w-3
                      transition-transform
                      duration-300
                      group-hover/link:-translate-x-0.5
                    "
                    strokeWidth={2}
                  />
                </span>
              </Link>
            </div>

            {/* Decorative corner */}
            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                right-5
                top-5
                z-20
                h-7
                w-7
                rounded-tr-xl
                border-r
                border-t
                border-[#B79464]/45
                sm:right-7
                sm:top-7
              "
            />
          </article>

          {/* =========================================================
              DISCOUNT
          ========================================================== */}
          <article
            className="
              group
              relative
              isolate
              min-h-[245px]
              overflow-hidden
              rounded-[28px]
              border
              border-white/10
              bg-[#0B1B2A]
              text-white
              shadow-[0_14px_38px_rgba(17,47,80,0.10)]
              transition-[transform,box-shadow]
              duration-500
              ease-[cubic-bezier(.22,1,.36,1)]
              hover:-translate-y-1
              hover:shadow-[0_20px_46px_rgba(17,47,80,0.16)]
              sm:min-h-[275px]
              lg:min-h-[315px]
            "
          >
            {/* Ambient background */}
            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                inset-0
                z-0
                bg-[radial-gradient(circle_at_top_right,rgba(183,148,100,0.18),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(49,86,125,0.16),transparent_42%)]
              "
            />

            {/* Image layer */}
            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                inset-y-0
                left-0
                z-0
                w-[calc(50%+6px)]
                overflow-hidden
                sm:w-[calc(52%+6px)]
                lg:w-[calc(53%+6px)]
              "
            >
              <Image
                src="/images/home/banners/stone-samples.webp"
                alt=""
                fill
                sizes="
                  (max-width: 639px) 54vw,
                  (max-width: 1023px) 55vw,
                  360px
                "
                className="
                  object-cover
                  object-center
                  opacity-[0.86]
                  select-none
                  transition-transform
                  duration-1000
                  ease-[cubic-bezier(.22,1,.36,1)]
                  group-hover:scale-[1.06]
                "
              />

              {/* Single unified blend — image edge disappears smoothly */}
              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-r
                  from-transparent
                  via-[#0B1B2A]/[0.34]
                  to-[#0B1B2A]
                "
              />
            </div>

            {/* Gold glow */}
            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                -right-16
                -top-16
                z-0
                h-44
                w-44
                rounded-full
                bg-[#B79464]/10
                blur-3xl
              "
            />

            {/* Content */}
            <div
              className="
                relative
                z-10
                flex
                min-h-[245px]
                max-w-[74%]
                flex-col
                justify-center
                px-5
                py-6
                sm:min-h-[275px]
                sm:max-w-[67%]
                sm:px-7
                sm:py-8
                lg:min-h-[315px]
                lg:max-w-[67%]
                lg:px-8
              "
            >
              {/* Badge */}
              <div
                className="
                  mb-4
                  inline-flex
                  w-fit
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-[#B79464]/30
                  bg-[#B79464]/[0.10]
                  px-3
                  py-1.5
                  backdrop-blur-md
                "
              >
                <Sparkles
                  aria-hidden="true"
                  className="h-3.5 w-3.5 text-[#D8BC8D]"
                  strokeWidth={1.7}
                />

                <span
                  className="
                    text-[9px]
                    font-black
                    text-[#E1CAA5]
                    sm:text-[10px]
                  "
                >
                  فرصت محدود
                </span>
              </div>

              {/* Discount */}
              <div className="flex items-end gap-2">
                <span
                  className="
                    text-[46px]
                    font-black
                    leading-none
                    tracking-[-0.065em]
                    text-white
                    sm:text-[54px]
                    lg:text-[60px]
                  "
                >
                  ۲۰٪
                </span>

                <span
                  className="
                    mb-1.5
                    text-[11px]
                    font-bold
                    text-[#D8BC8D]
                    sm:text-[12px]
                  "
                >
                  تخفیف
                </span>
              </div>

              {/* Main text */}
              <p
                className="
                  mt-2
                  text-[13px]
                  font-bold
                  leading-6
                  text-white/80
                  sm:text-[14px]
                  lg:text-[15px]
                "
              >
                روی سنگ‌های منتخب
              </p>

              {/* Supporting text */}
              <p
                className="
                  mt-1
                  max-w-[260px]
                  text-[9px]
                  font-medium
                  leading-5
                  text-white/45
                  sm:text-[10px]
                "
              >
                انتخابی ویژه برای پروژه‌های شما،
                فقط برای مدت محدود.
              </p>

              {/* CTA */}
              <Link
                href="/products?discount=true"
                className="
                  group/link
                  mt-5
                  inline-flex
                  h-10
                  w-fit
                  items-center
                  gap-2
                  rounded-full
                  bg-[#D8BC8D]
                  px-4
                  text-[10px]
                  font-black
                  text-[#112F50]
                  shadow-[0_7px_18px_rgba(183,148,100,0.18)]
                  transition-[transform,background-color,box-shadow]
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-[#E5D3B4]
                  hover:shadow-[0_10px_23px_rgba(183,148,100,0.24)]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#D8BC8D]
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-[#0B1B2A]
                  sm:h-11
                  sm:px-5
                  sm:text-[11px]
                "
              >
                <span>مشاهده سنگ‌های تخفیف‌دار</span>

                <span
                  aria-hidden="true"
                  className="
                    flex
                    h-5
                    w-5
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[#112F50]/10
                  "
                >
                  <ArrowLeft
                    className="
                      h-3
                      w-3
                      transition-transform
                      duration-300
                      group-hover/link:-translate-x-0.5
                    "
                    strokeWidth={2}
                  />
                </span>
              </Link>
            </div>

            {/* Decorative corner */}
            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                right-5
                top-5
                z-20
                h-7
                w-7
                rounded-tr-xl
                border-r
                border-t
                border-[#B79464]/45
                sm:right-7
                sm:top-7
              "
            />
          </article>
        </div>
      </Container>
    </section>
  )
}
