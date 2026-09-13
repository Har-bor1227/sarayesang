import Image from 'next/image'

import Container from '@/components/ui/container'

import { Calculator, Coins } from 'lucide-react'

import { TEL_PHONE } from '@/lib/constants'

export default function PriceInquiryCTA() {
  return (
    <section className="w-full bg-white py-7 sm:py-10 md:py-12">
      <Container>
        <div
          className="
            relative
            w-full
            overflow-hidden
            rounded-[24px]
            bg-[#102F50]
            shadow-[0_10px_30px_rgba(16,47,80,0.12)]
            sm:rounded-[26px]
            md:rounded-[28px]
          "
        >
          {/* =========================================================
              LEFT IMAGE
          ========================================================== */}
          <div
            className="
              absolute
              inset-y-0
              left-0
              z-0
w-[65%]
sm:w-[50%]
md:w-[40%]
lg:w-[39%]
            "
          >
            <Image
              src="/images/home/price-inquiry.webp"
              alt="استعلام قیمت پروژه سنگ"
              fill
              sizes="
                (max-width: 639px) 44vw,
                (max-width: 1023px) 42vw,
                40vw
              "
              className="object-contain object-left-bottom"
            />
          </div>

          {/* =========================================================
              CONTENT
          ========================================================== */}
          <div
            className="
              relative
              z-10
              flex
              min-h-[250px]
              w-full
              items-stretch
              justify-start
              sm:min-h-[265px]
              md:min-h-[275px]
              lg:min-h-[290px]
            "
          >
            <div
              className="
                flex
                w-[58%]
                max-w-[680px]
                flex-col
                justify-between
                px-4
                py-6
                text-right
                sm:w-[60%]
                sm:px-7
                sm:py-7
                md:w-[61%]
                md:px-9
                md:py-8
                lg:w-[62%]
                lg:px-10
                lg:py-9
                xl:px-12
              "
              dir="rtl"
            >
              {/* =====================================================
                  TOP CONTENT
              ====================================================== */}
              <div className="w-full">
                {/* LABEL */}
                <div
                  className="
                    mb-2
                    flex
                    items-center
                    justify-start
                    gap-2
                    sm:mb-2.5
                  "
                >
                  <Calculator
                    className="
                      h-4
                      w-4
                      shrink-0
                      text-[#E2BD76]
                      sm:h-[18px]
                      sm:w-[18px]
                    "
                  />

                  <span
                    className="
                      text-[9px]
                      font-bold
                      leading-none
                      text-[#E2BD76]
                      sm:text-[10px]
                      md:text-[11px]
                    "
                  >
                    استعلام سریع و دقیق
                  </span>
                </div>

                {/* ===================================================
                    TITLE
                ==================================================== */}
                <h2
                  className="
                    w-full
                    whitespace-nowrap
                    text-right
                    text-[20px]
                    font-black
                    leading-none
                    tracking-[-0.035em]
                    text-white
                    min-[390px]:text-[21px]
                    sm:text-[27px]
                    md:text-[31px]
                    lg:text-[35px]
                    xl:text-[38px]
                  "
                >
                  قیمت پروژه خود را{' '}
                  <span className="text-[#E2BD76]">
                    آنلاین
                  </span>{' '}
                  استعلام بگیرید
                </h2>

                {/* ===================================================
                    DESCRIPTION
                ==================================================== */}
                <div className="mt-4 sm:mt-5">
                  <p
                    className="
                      text-right
                      text-[11px]
                      font-medium
                      leading-[2]
                      text-white
                      sm:text-[13px]
                      sm:leading-[2.1]
                      md:text-[14px]
                      lg:text-[15px]
                    "
                  >
                    قیمت سنگ به متراژ ، سورت ، ضخامت و موجودی روز بستگی دارد.
                  </p>

                  <p
                    className="
                      mt-1
                      text-right
                      text-[11px]
                      font-medium
                      leading-[2]
                      text-white
                      sm:text-[13px]
                      sm:leading-[2.1]
                      md:text-[14px]
                      lg:text-[15px]
                    "
                  >
                    درخواست خود را ثبت کنید تا کارشناسان سنگانه در کوتاه ترین
                    زمان قیمت دقیق را اعلام کنند.
                  </p>
                </div>
              </div>

              {/* =====================================================
                  CTA — BOTTOM OF TEXT BOX
              ====================================================== */}
              <div className="mt-5 flex justify-start sm:mt-6">
                <a
                  href={`tel:${TEL_PHONE}`}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-full
                    px-5
                    py-2.5
                    text-[10px]
                    font-black
                    text-[#102F50]
                    shadow-[0_6px_16px_rgba(0,0,0,0.12)]
                    transition-all
                    duration-300
                    hover:brightness-105
                    hover:shadow-[0_8px_20px_rgba(0,0,0,0.16)]
                    sm:px-6
                    sm:py-3
                    sm:text-[11px]
                  "
                  style={{
                    background:
                      'linear-gradient(110.1deg, #B79464 14.09%, #EFC994 86.56%)',
                  }}
                >
                  <Coins className="h-4 w-4 shrink-0" />

                  <span>
                    استعلام قیمت
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}