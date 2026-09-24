import {
  ChevronDown,
} from 'lucide-react'

const FAQ_ITEMS = [
  {
    question:
      'چطور می‌توانم سنگ مناسب پروژه‌ام را انتخاب کنم؟',
    answer:
      'با توجه به کاربرد، رنگ، میزان رفت‌وآمد، شرایط محیط و بودجه، می‌توان سنگ مناسب را انتخاب کرد. جستجوی هوشمند سرای سنگ هم برای شروع، انتخاب‌های مناسب را سریع‌تر در اختیارتان قرار می‌دهد.',
  },
  {
    question:
      'قیمت سنگ‌ها چگونه محاسبه می‌شود؟',
    answer:
      'قیمت محصولات بر اساس نوع سنگ، کیفیت، ابعاد، فرآوری و شرایط روز بازار تعیین می‌شود. برای دریافت قیمت دقیق و به‌روز، می‌توانید از بخش استعلام قیمت هر محصول استفاده کنید.',
  },
  {
    question:
      'آیا برای انتخاب سنگ پروژه مشاوره ارائه می‌دهید؟',
    answer:
      'بله. برای انتخاب بهتر می‌توانید با ما تماس بگیرید تا بر اساس نوع پروژه و نیازتان، گزینه‌های مناسب بررسی شوند.',
  },
  {
    question:
      'آیا مشخصات فنی محصولات قابل مشاهده است؟',
    answer:
      'بله. در صفحه هر محصول می‌توانید مشخصاتی مانند نوع سنگ، رنگ، ابعاد، فرآوری سطح و سایر اطلاعات فنی ثبت‌شده را مشاهده کنید.',
  },
  {
    question:
      'برای نمای ساختمان چه سنگی مناسب‌تر است؟',
    answer:
      'انتخاب سنگ نما به عواملی مانند شرایط آب‌وهوایی، محل استفاده، سبک معماری و بودجه بستگی دارد. برای همین بهتر است قبل از انتخاب، مشخصات پروژه بررسی شود.',
  },
  {
    question:
      'چطور می‌توانم برای یک محصول استعلام قیمت بگیرم؟',
    answer:
      'در هر کارت محصول روی دکمه «استعلام قیمت» بزنید تا مستقیماً با شماره تماس مجموعه ارتباط بگیرید.',
  },
]

export default function FaqSection() {
  return (
    <section
      dir="rtl"
      aria-labelledby="faq-title"
      className="
        w-full
        bg-[#FCFCFB]
        px-3
        pb-7
        pt-1
        sm:px-0
        sm:pb-8
        sm:pt-2
        md:pb-9
        md:pt-3
        lg:pb-10
        lg:pt-4
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[1120px]
        "
      >
        {/* Header */}
        <header
          className="
            mb-4
            text-center
            sm:mb-5
            md:mb-6
          "
        >
          <h2
            id="faq-title"
            className="
              text-[22px]
              font-black
              leading-tight
              tracking-[-0.04em]
              text-[#112F50]
              sm:text-[27px]
              md:text-[31px]
            "
          >
            سوالات
            <span className="text-[#B79464]">
              {' '}
              متداول
            </span>
          </h2>

          <p
            className="
              mx-auto
              mt-1.5
              max-w-[520px]
              text-[9px]
              font-medium
              leading-5
              text-[#7A8793]
              sm:text-[10px]
              sm:leading-6
            "
          >
            پاسخ چند سؤال پرتکرار درباره انتخاب،
            قیمت و خرید سنگ از سرای‌سنگ
          </p>

          {/* Short decorative line */}
          <span
            aria-hidden="true"
            className="
              mx-auto
              mt-2.5
              block
              h-[2px]
              w-8
              rounded-full
              bg-gradient-to-r
              from-transparent
              via-[#B79464]
              to-transparent
            "
          />
        </header>

        {/* FAQ */}
        <div
          className="
            grid
            gap-2
            md:grid-cols-2
            md:gap-2.5
          "
        >
          {FAQ_ITEMS.map(
            (item, index) => (
              <details
                key={item.question}
                name="sarayesang-faq"
                open={index === 0}
                className="
                  group
                  overflow-hidden
                  rounded-[15px]
                  border
                  border-[#E4E7E8]
                  bg-white
                  transition-all
                  duration-300
                  hover:border-[#D8CCBB]
                  hover:shadow-[0_5px_18px_rgba(17,47,80,0.035)]

                  [&::details-content]:opacity-0
                  [&::details-content]:transition-opacity
                  [&::details-content]:duration-300
                  [&::details-content]:[transition-property:opacity,content-visibility]
                  [&::details-content]:[transition-behavior:allow-discrete]
                  open:[&::details-content]:opacity-100
                "
              >
                <summary
                  className="
                    flex
                    min-h-[52px]
                    w-full
                    cursor-pointer
                    list-none
                    items-center
                    gap-2.5
                    px-3
                    py-2.5
                    text-right
                    outline-none
                    transition-colors
                    duration-200
                    hover:bg-[#FBFAF7]
                    focus-visible:ring-2
                    focus-visible:ring-inset
                    focus-visible:ring-[#B79464]/35
                    [&::-webkit-details-marker]:hidden
                    sm:px-3.5
                  "
                >
                  {/* Number */}
                  <span
                    aria-hidden="true"
                    className="
                      flex
                      h-6
                      w-6
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-[#F7F2E9]
                      text-[7px]
                      font-black
                      text-[#9B7A4F]
                      sm:h-7
                      sm:w-7
                      sm:text-[8px]
                    "
                  >
                    {String(
                      index + 1,
                    ).padStart(2, '0')}
                  </span>

                  {/* Question */}
                  <span
                    className="
                      min-w-0
                      flex-1
                      text-[9px]
                      font-black
                      leading-5
                      text-[#112F50]
                      sm:text-[10px]
                      sm:leading-6
                      md:text-[11px]
                    "
                  >
                    {item.question}
                  </span>

                  {/* Chevron */}
                  <span
                    aria-hidden="true"
                    className="
                      flex
                      h-6
                      w-6
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#E3E7E9]
                      bg-[#FAFBFB]
                      text-[#8D98A2]
                      transition-all
                      duration-300
                      group-open:rotate-180
                      group-open:border-[#B79464]/25
                      group-open:bg-[#B79464]/[0.08]
                      group-open:text-[#9B7A4F]
                      sm:h-7
                      sm:w-7
                    "
                  >
                    <ChevronDown
                      className="h-3 w-3"
                      strokeWidth={1.8}
                    />
                  </span>
                </summary>

                {/* Answer */}
                <div
                  id={`faq-answer-${index}`}
                  className="
                    overflow-hidden
                  "
                >
                  <div
                    className="
                      mx-3
                      border-t
                      border-[#ECE9E3]
                      pb-3
                      pt-2.5
                      sm:mx-3.5
                      sm:pb-3.5
                    "
                  >
                    <div
                      aria-hidden="true"
                      className="
                        mb-1.5
                        h-[2px]
                        w-6
                        rounded-full
                        bg-gradient-to-r
                        from-[#B79464]
                        to-transparent
                      "
                    />

                    <p
                      className="
                        text-[8.5px]
                        font-medium
                        leading-6
                        text-[#707C88]
                        sm:text-[9.5px]
                        sm:leading-7
                      "
                    >
                      {item.answer}
                    </p>
                  </div>
                </div>
              </details>
            ),
          )}
        </div>
      </div>
    </section>
  )
}