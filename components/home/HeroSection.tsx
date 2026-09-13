import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'

const heroImage = '/images/home/hero-banner.webp'

export default function HeroSection() {
  return (
    <section className="w-full bg-[#fcfcfb]">
      <div
        className="
          relative
          min-h-[570px]
          w-full
          overflow-hidden
          bg-[#0a1929]
          sm:min-h-[620px]
          md:min-h-[680px]
          lg:min-h-[720px]
          xl:min-h-[760px]
        "
      >
        {/* Hero image */}
        <Image
          src={heroImage}
          alt="فضای معماری لوکس با سنگ طبیعی"
          fill
          preload
          sizes="100vw"
          className="
            object-cover
            object-center
            transition-transform
            duration-[1400ms]
            ease-out
          "
        />

        {/* Dark architectural overlay */}
        <div
          aria-hidden="true"
          className="
            absolute
            inset-0
            bg-gradient-to-l
            from-[#0a1929]/65
            via-[#0a1929]/22
            to-[#0a1929]/0
          "
        />

        {/* Bottom depth */}
        <div
          aria-hidden="true"
          className="
            absolute
            inset-x-0
            bottom-0
            h-1/2
            bg-gradient-to-t
            from-[#0a1929]/35
            via-[#0a1929]/5
            to-transparent
          "
        />

        {/* Subtle warm atmosphere */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-24
            top-1/4
            h-64
            w-64
            rounded-full
            bg-accent/[0.08]
            blur-3xl
            sm:h-80
            sm:w-80
          "
        />

        {/* Content */}
        <div
          className="
            relative
            z-10
            mx-auto
            flex
            min-h-[570px]
            w-full
            max-w-[1360px]
            items-end
            px-4
            pb-16
            sm:min-h-[620px]
            sm:px-6
            sm:pb-20
            md:min-h-[680px]
            md:items-center
            md:pb-0
            md:px-8
            lg:min-h-[720px]
            lg:px-10
            xl:min-h-[760px]
            xl:px-12
          "
        >
        <div
          className="
            w-full
            max-w-[720px]
            text-right
            md:ml-auto
            md:mr-0
            lg:-translate-x-8
            xl:-translate-x-14
            2xl:-translate-x-20
          "
        >
            {/* Eyebrow */}
            <div className="mb-5 flex items-center justify-end gap-3">
              <span
                aria-hidden="true"
                className="
                  h-px
                  w-10
                  bg-accent
                  sm:w-14
                "
              />

              <span
                className="
                  text-[10px]
                  font-bold
                  tracking-[0.08em]
                  text-accent-light
                  sm:text-[11px]
                "
              >
                SARAYE SANG
              </span>
            </div>

            {/* Heading */}
            <h1
              className="
                max-w-[680px]
                text-[34px]
                font-black
                leading-[1.35]
                tracking-[-0.035em]
                text-white
                sm:text-[42px]
                md:text-[50px]
                lg:text-[58px]
                xl:text-[64px]
              "
            >
              زیبایی ماندگار،
              <br />
              از دل سنگ
            </h1>

            {/* Description */}
            <p
              className="
                mt-5
                max-w-[590px]
                text-sm
                font-medium
                leading-8
                text-white/72
                sm:text-[15px]
                sm:leading-8
                md:text-base
              "
            >
              مجموعه‌ای منتخب از سنگ‌های ساختمانی برای
              معماری، طراحی داخلی و پروژه‌های ماندگار.
            </p>

            {/* Actions */}
            <div
              className="
                mt-7
                flex
                flex-wrap
                items-center
                justify-start
                gap-2.5
                sm:mt-8
                sm:gap-3
              "
            >
              <Link
                href="/products"
                className="
                  group
                  inline-flex
                  h-12
                  items-center
                  gap-2.5
                  rounded-full
                  bg-white
                  px-5
                  text-sm
                  font-bold
                  text-primary
                  shadow-[0_8px_24px_rgba(10,25,41,0.14)]
                  transition-all
                  duration-250
                  hover:-translate-y-0.5
                  hover:bg-[#fcfcfb]
                  hover:shadow-[0_12px_30px_rgba(10,25,41,0.18)]
                  active:translate-y-0
                  sm:px-6
                "
              >
                مشاهده محصولات

                <ArrowLeft
                  className="
                    h-4
                    w-4
                    transition-transform
                    duration-200
                    group-hover:-translate-x-0.5
                  "
                  strokeWidth={1.8}
                />
              </Link>

              <Link
                href="/contact"
                className="
                  inline-flex
                  h-12
                  items-center
                  rounded-full
                  border
                  border-white/25
                  bg-white/[0.07]
                  px-5
                  text-sm
                  font-bold
                  text-white
                  backdrop-blur-md
                  transition-all
                  duration-250
                  hover:border-accent/50
                  hover:bg-accent/[0.12]
                  sm:px-6
                "
              >
                استعلام قیمت
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            bottom-7
            left-1/2
            hidden
            -translate-x-1/2
            items-center
            gap-2
            text-[9px]
            font-semibold
            tracking-[0.08em]
            text-white/45
            md:flex
          "
        >
          <span className="h-px w-8 bg-white/20" />
          SCROLL
          <span className="h-px w-8 bg-white/20" />
        </div>
      </div>
    </section>
  )
}