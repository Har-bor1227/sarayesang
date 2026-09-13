import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'

import Container from '@/components/ui/container'

export default function PromoBanners() {
  return (
    <section className="w-full bg-[#fcfcfb] py-8 sm:py-10 md:py-12">
      <Container>
        <div
          className="
            grid
            min-w-0
            gap-4
            lg:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.95fr)]
            lg:gap-5
          "
        >
          {/* Natural stone */}
          <article
            className="
              group
              relative
              min-h-[210px]
              overflow-hidden
              rounded-[24px]
              border
              border-[#e8e2d8]
              bg-[#f1e6d3]
              p-5
              shadow-[0_5px_20px_rgba(10,25,41,0.035)]
              transition-all
              duration-300
              hover:border-accent/25
              hover:shadow-[0_12px_32px_rgba(10,25,41,0.07)]
              sm:min-h-[225px]
              sm:p-7
            "
          >
            <div
              className="
                pointer-events-none
                absolute
                inset-y-0
                left-0
                w-[43%]
                overflow-hidden
                sm:w-[45%]
              "
            >
              <Image
                src="/images/home/banners/natural-stone.webp"
                alt="سنگ طبیعی"
                fill
                sizes="
                  (max-width: 640px) 43vw,
                  (max-width: 1024px) 45vw,
                  420px
                "
                className="
                  object-cover
                  object-center
                  transition-transform
                  duration-700
                  ease-out
                  group-hover:scale-[1.045]
                "
              />

              <div
                aria-hidden="true"
                className="
                  absolute
                  inset-0
                  bg-gradient-to-r
                  from-[#f1e6d3]/0
                  via-[#f1e6d3]/15
                  to-[#f1e6d3]/85
                "
              />
            </div>

            <div
              className="
                relative
                z-10
                max-w-[70%]
                sm:max-w-[61%]
              "
              dir="rtl"
            >
              <div className="mb-2.5 flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-px w-5 bg-accent"
                />

                <span
                  className="
                    text-[10px]
                    font-bold
                    text-accent-dark
                    sm:text-[11px]
                  "
                >
                  انتخابی اصیل برای معماری
                </span>
              </div>

              <h2
                className="
                  text-[22px]
                  font-black
                  leading-[1.35]
                  tracking-[-0.025em]
                  text-primary
                  sm:text-[25px]
                "
              >
                سنگ طبیعی،
                <br className="hidden sm:block" />
                حس اصالت
              </h2>

              <p
                className="
                  mt-2
                  max-w-sm
                  text-[10px]
                  font-medium
                  leading-6
                  text-[#5c6876]
                  sm:text-[11px]
                  sm:leading-7
                "
              >
                مجموعه‌ای از سنگ‌های طبیعی برای فضاهای
                ماندگار و پروژه‌های خاص.
              </p>

              <Link
                href="/products"
                className="
                  group/link
                  mt-4
                  inline-flex
                  h-9
                  items-center
                  gap-1.5
                  rounded-full
                  bg-accent
                  px-4
                  text-[10px]
                  font-bold
                  text-primary-dark
                  shadow-[0_5px_14px_rgba(183,148,100,0.18)]
                  transition-all
                  duration-200
                  hover:-translate-y-px
                  hover:bg-accent-light
                  sm:h-10
                  sm:px-5
                  sm:text-[11px]
                "
              >
                مشاهده محصولات

                <ArrowLeft
                  className="
                    h-3.5
                    w-3.5
                    transition-transform
                    duration-200
                    group-hover/link:-translate-x-0.5
                  "
                  strokeWidth={1.8}
                />
              </Link>
            </div>
          </article>

          {/* Discount */}
          <article
            className="
              group
              relative
              min-h-[210px]
              overflow-hidden
              rounded-[24px]
              bg-primary
              p-5
              text-white
              shadow-[0_8px_25px_rgba(10,25,41,0.07)]
              transition-all
              duration-300
              hover:shadow-[0_14px_35px_rgba(10,25,41,0.12)]
              sm:min-h-[225px]
              sm:p-7
            "
          >
            <div
              className="
                pointer-events-none
                absolute
                inset-y-0
                left-0
                w-[44%]
                overflow-hidden
                sm:w-[48%]
              "
            >
              <Image
                src="/images/home/banners/stone-samples.webp"
                alt="نمونه سنگ"
                fill
                sizes="
                  (max-width: 640px) 44vw,
                  (max-width: 1024px) 48vw,
                  320px
                "
                className="
                  object-cover
                  object-center
                  transition-transform
                  duration-700
                  ease-out
                  group-hover:scale-[1.045]
                "
              />

              <div
                aria-hidden="true"
                className="
                  absolute
                  inset-0
                  bg-gradient-to-r
                  from-primary/0
                  via-primary/25
                  to-primary/95
                "
              />
            </div>

            <div
              className="
                relative
                z-10
                max-w-[68%]
                sm:max-w-[61%]
              "
              dir="rtl"
            >
              <div className="mb-2.5 flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-px w-5 bg-accent-light"
                />

                <span
                  className="
                    text-[10px]
                    font-bold
                    text-accent-light
                    sm:text-[11px]
                  "
                >
                  فرصت محدود
                </span>
              </div>

              <h2
                className="
                  text-[30px]
                  font-black
                  leading-none
                  tracking-[-0.04em]
                  text-white
                  sm:text-[35px]
                "
              >
                تا ۲۰٪
              </h2>

              <p
                className="
                  mt-2
                  text-[14px]
                  font-bold
                  text-white/78
                  sm:text-[15px]
                "
              >
                تخفیف روی سنگ‌های منتخب
              </p>

              <Link
                href="/products?discount=true"
                className="
                  group/link
                  mt-5
                  inline-flex
                  h-9
                  items-center
                  gap-1.5
                  rounded-full
                  bg-accent-light
                  px-4
                  text-[10px]
                  font-bold
                  text-primary-dark
                  shadow-[0_5px_15px_rgba(183,148,100,0.16)]
                  transition-all
                  duration-200
                  hover:-translate-y-px
                  hover:bg-white
                  sm:h-10
                  sm:px-5
                  sm:text-[11px]
                "
              >
                مشاهده محصولات

                <ArrowLeft
                  className="
                    h-3.5
                    w-3.5
                    transition-transform
                    duration-200
                    group-hover/link:-translate-x-0.5
                  "
                  strokeWidth={1.8}
                />
              </Link>
            </div>
          </article>
        </div>
      </Container>
    </section>
  )
}