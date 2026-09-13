import Image from 'next/image'

import Container from '@/components/ui/container'

import { comparisonProducts } from './data'

const comparisonRows = [
  ['جنسیت', 'تراورتن', 'مرمریت'],
  ['وزن', '۲.۶ تن / متر مکعب', '۲.۷ تن / متر مکعب'],
  ['جذب آب', 'کم', 'بسیار کم'],
  ['کاربرد', 'نما و فضای باز', 'فضای داخلی'],
] as const

export default function ComparisonSection() {
  return (
    <>
      {/* =========================================================
          SECTION HEADER
      ========================================================== */}
      <section className="w-full bg-white pb-5 pt-14 sm:pb-6 sm:pt-16 md:pt-20">
        <Container>
          <div
            className="mx-auto max-w-[760px] text-center"
            dir="rtl"
          >
            <h2
              className="
                text-[28px]
                font-black
                leading-[1.3]
                tracking-[-0.035em]
                text-[#12365A]
                sm:text-[34px]
                md:text-[40px]
                lg:text-[42px]
              "
            >
              مقایسه تخصصی سنگ ها
            </h2>

            <p
              className="
                mt-2
                text-[12px]
                font-medium
                leading-7
                text-[#5D7186]
                sm:mt-2.5
                sm:text-[15px]
                md:text-[17px]
                lg:text-[18px]
                lg:leading-normal
              "
            >
              مشخصات فنی و ظاهری را قبل از خرید مقایسه کنید
            </p>
          </div>
        </Container>
      </section>

      {/* =========================================================
          COMPARISON PANEL
      ========================================================== */}
      <section className="w-full bg-white pb-10 sm:pb-12 md:pb-16">
        <Container>
          <div
            className="
              w-full
              overflow-hidden
              rounded-[24px]
              bg-[#12365A]
              p-3
              shadow-[0_8px_22px_rgba(18,54,90,0.10)]
              sm:rounded-[26px]
              sm:p-4
              md:p-5
              lg:rounded-[28px]
            "
          >
            <div
              className="
                grid
                min-w-0
                items-stretch
                gap-3
                lg:grid-cols-[minmax(0,1fr)_minmax(0,1.18fr)]
                lg:gap-4
              "
              dir="ltr"
            >
              {/* ===================================================
                  PRODUCT CARDS
                  LEFT SIDE
              ==================================================== */}
              <div
                className="
                  order-2
                  grid
                  min-w-0
                  grid-cols-2
                  gap-3
                  lg:order-1
                  lg:grid-cols-2
                  lg:gap-3
                "
                dir="rtl"
              >
                {comparisonProducts.map((product) => (
                  <article
                    key={product.name}
                    className="
                      flex
                      min-w-0
                      flex-col
                      overflow-hidden
                      rounded-[19px]
                      bg-white
                      p-2
                      shadow-[0_4px_10px_rgba(0,0,0,0.08)]
                      sm:rounded-[20px]
                      sm:p-2.5
                    "
                  >
                    {/* IMAGE */}
                    <div
                      className="
                        relative
                        aspect-square
                        w-full
                        overflow-hidden
                        rounded-[15px]
                        bg-[#D9D9D9]
                        sm:rounded-[16px]
                      "
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="
                          (max-width: 639px) 42vw,
                          (max-width: 1023px) 44vw,
                          220px
                        "
                        className="object-cover"
                      />
                    </div>

                    {/* CARD CONTENT */}
                    <div
                      className="
                        flex
                        flex-1
                        flex-col
                        px-1
                        pb-1
                        pt-2
                        sm:px-1.5
                        sm:pt-2.5
                      "
                    >
                      {/* NAME */}
                      <h3
                        className="
                          truncate
                          text-center
                          text-[11px]
                          font-black
                          leading-5
                          text-[#12365A]
                          sm:text-[12px]
                          md:text-[13px]
                        "
                      >
                        {product.name}
                      </h3>

                      {/* GOLD DIVIDER */}
                      <div
                        className="
                          my-1.5
                          h-px
                          w-full
                          bg-[#C9A66C]/45
                          sm:my-2
                        "
                      />

                      {/* PRICE + UNIT */}
                      <div className="text-center">
                        <div
                          className="
                            text-[11px]
                            font-black
                            leading-5
                            text-[#12365A]
                            sm:text-[12px]
                            md:text-[13px]
                          "
                        >
                          {product.price}
                        </div>

                        <div
                          className="
                            mt-0.5
                            text-[7px]
                            font-medium
                            text-[#7B8794]
                            sm:text-[8px]
                            md:text-[9px]
                          "
                        >
                          {product.unit}
                        </div>
                      </div>

                      {/* BUTTON */}
                      <button
                        type="button"
                        className="
                          mt-auto
                          inline-flex
                          h-8
                          w-full
                          items-center
                          justify-center
                          rounded-full
                          bg-[linear-gradient(119.61deg,#112F50_36.45%,#0A1929_77.49%)]
                          px-2
                          text-[9px]
                          font-black
                          text-white
                          shadow-[0_3px_8px_rgba(16,47,80,0.15)]
                          transition-all
                          duration-200
                          hover:-translate-y-[1px]
                          hover:shadow-[0_5px_10px_rgba(16,47,80,0.20)]
                          sm:h-9
                          sm:text-[10px]
                          md:text-[11px]
                        "
                      >
                        انتخاب سنگ
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              {/* ===================================================
                  COMPARISON TABLE
                  RIGHT SIDE
              ==================================================== */}
              <div
                className="
                  order-1
                  min-w-0
                  overflow-hidden
                  rounded-[19px]
                  bg-white
                  lg:order-2
                  sm:rounded-[20px]
                "
                dir="rtl"
              >
                <div className="w-full">
                  <table className="w-full border-collapse table-fixed">
                    <thead>
                      <tr>
                        <th
                          className="
                            w-[32%]
                            whitespace-nowrap
                            rounded-r-[16px]
                            bg-[linear-gradient(110.1deg,#B79464_14.09%,#EFC994_86.56%)]
                            px-2
                            py-3
                            text-[10px]
                            font-black
                            text-[#12365A]
                            shadow-[0_3px_7px_rgba(0,0,0,0.10)]
                            sm:py-3.5
                            sm:text-[11px]
                            md:text-[12px]
                          "
                        >
                          مشخصات
                        </th>

                        <th
                          className="
                            w-[34%]
                            whitespace-nowrap
                            bg-[linear-gradient(110.1deg,#B79464_14.09%,#EFC994_86.56%)]
                            px-2
                            py-3
                            text-[10px]
                            font-black
                            text-[#12365A]
                            shadow-[0_3px_7px_rgba(0,0,0,0.08)]
                            sm:py-3.5
                            sm:text-[11px]
                            md:text-[12px]
                          "
                        >
                          سنگ اول
                        </th>

                        <th
                          className="
                            w-[34%]
                            whitespace-nowrap
                            rounded-l-[16px]
                            bg-[linear-gradient(110.1deg,#B79464_14.09%,#EFC994_86.56%)]
                            px-2
                            py-3
                            text-[10px]
                            font-black
                            text-[#12365A]
                            shadow-[0_3px_7px_rgba(0,0,0,0.08)]
                            sm:py-3.5
                            sm:text-[11px]
                            md:text-[12px]
                          "
                        >
                          سنگ دوم
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {comparisonRows.map((row, index) => (
                        <tr
                          key={row[0]}
                          className={index < comparisonRows.length - 1 ? 'border-b border-[#12365A]/15' : ''}
                        >
                          {/* SPEC */}
                          <td
                            className="
                              whitespace-nowrap
                              px-2
                              py-4
                              text-right
                              text-[9px]
                              font-black
                              text-[#12365A]
                              sm:px-3
                              sm:py-5
                              sm:text-[10px]
                              md:text-[11px]
                            "
                          >
                            {row[0]}
                          </td>

                          {/* FIRST */}
                          <td
                            className="
                              border-r
                              border-[#12365A]/15
                              px-2
                              py-4
                              text-center
                              text-[9px]
                              font-medium
                              leading-5
                              text-[#425366]
                              sm:px-3
                              sm:py-5
                              sm:text-[10px]
                              md:text-[11px]
                            "
                          >
                            {row[1]}
                          </td>

                          {/* SECOND */}
                          <td
                            className="
                              border-r
                              border-[#12365A]/15
                              px-2
                              py-4
                              text-center
                              text-[9px]
                              font-medium
                              leading-5
                              text-[#425366]
                              sm:px-3
                              sm:py-5
                              sm:text-[10px]
                              md:text-[11px]
                            "
                          >
                            {row[2]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}