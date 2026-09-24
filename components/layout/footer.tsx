import Link from 'next/link'
import {
  ArrowUpLeft,
  Globe2,
  Mail,
  MapPin,
  Phone,
  Send,
} from 'lucide-react'

import {
  NAV_LINKS,
  TEL_PHONE,
  SITE_NAME,
  SOCIAL_LINKS,
} from '@/lib/constants'

export default function Footer() {
  return (
    <footer
      className="mt-auto overflow-hidden bg-[#0A1929] text-white"
      dir="rtl"
    >
      <div className="container">
        {/* =========================================================
            MAIN FOOTER
        ========================================================== */}
        <div className="relative py-14 sm:py-16 lg:py-20">
          {/* Decorative background */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              -left-24
              -top-24
              h-64
              w-64
              rounded-full
              bg-[#B79464]/[0.055]
              blur-3xl
            "
          />

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              -bottom-32
              right-1/4
              h-72
              w-72
              rounded-full
              bg-[#112F50]/[0.45]
              blur-3xl
            "
          />

          <div
            className="
              relative
              grid
              grid-cols-2
              gap-x-5
              gap-y-10
              lg:grid-cols-[1.35fr_0.8fr_0.95fr_0.9fr]
              lg:gap-12
            "
          >
            {/* =====================================================
                BRAND
            ====================================================== */}
            <div
              className="
                col-span-2
                max-w-md
                lg:col-span-1
              "
            >
              <div className="mb-6 flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-px w-9 bg-[#B79464] sm:w-10"
                />

                <span
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.24em]
                    text-[#D8B883]
                    sm:text-[10px]
                  "
                >
                  SARAYE SANG
                </span>
              </div>

              <h2
                className="
                  text-[27px]
                  font-black
                  tracking-[-0.035em]
                  text-white
                  sm:text-3xl
                "
              >
                {SITE_NAME}
              </h2>

              <p
                className="
                  mt-4
                  max-w-sm
                  text-[12px]
                  font-medium
                  leading-8
                  text-white/72
                  sm:text-[13px]
                "
              >
                سرای سنگ، مرجع تخصصی سنگ‌های ساختمانی؛
                انتخاب دقیق متریال برای پروژه‌هایی که کیفیت
                و ماندگاری در آن‌ها اهمیت دارد.
              </p>

              {/* Call CTA */}
              <a
                href={`tel:${TEL_PHONE}`}
                className="
                  group
                  mt-6
                  inline-flex
                  min-h-11
                  max-w-full
                  items-center
                  gap-3
                  rounded-full
                  border
                  border-[#B79464]/25
                  bg-white/[0.045]
                  px-4
                  py-2.5
                  transition-all
                  duration-300
                  hover:border-[#B79464]/55
                  hover:bg-[#B79464]/[0.10]
                  active:scale-[0.99]
                "
              >
                <span
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[#B79464]/[0.13]
                    text-[#D8B883]
                    transition-transform
                    duration-200
                    group-hover:scale-105
                  "
                >
                  <Phone
                    aria-hidden="true"
                    className="h-4 w-4"
                    strokeWidth={1.8}
                  />
                </span>

                <span className="min-w-0 text-right">
                  <span
                    className="
                      block
                      text-[9px]
                      font-medium
                      text-white/65
                    "
                  >
                    مشاوره و استعلام قیمت
                  </span>

                  <span
                    dir="ltr"
                    className="
                      mt-0.5
                      block
                      text-[13px]
                      font-black
                      tracking-[0.01em]
                      text-white
                    "
                  >
                    {TEL_PHONE}
                  </span>
                </span>

                <ArrowUpLeft
                  aria-hidden="true"
                  className="
                    mr-1
                    h-4
                    w-4
                    shrink-0
                    text-[#D8B883]
                    transition-transform
                    duration-300
                    group-hover:-translate-y-0.5
                    group-hover:-translate-x-0.5
                  "
                  strokeWidth={1.7}
                />
              </a>
            </div>

            {/* =====================================================
                QUICK LINKS
            ====================================================== */}
            <div>
              <div className="mb-5 flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-[#B79464]"
                />

                <h3 className="text-sm font-black text-white">
                  دسترسی سریع
                </h3>
              </div>

              <ul className="space-y-1.5">
                {NAV_LINKS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="
                        group
                        inline-flex
                        min-h-11
                        items-center
                        gap-2
                        py-2
                        text-[12px]
                        font-medium
                        text-white/68
                        transition-all
                        duration-200
                        hover:text-[#D8B883]
                      "
                    >
                      <span
                        aria-hidden="true"
                        className="
                          h-px
                          w-0
                          shrink-0
                          bg-[#B79464]
                          transition-all
                          duration-200
                          group-hover:w-3
                        "
                      />

                      <span>
                        {item.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* =====================================================
                CONTACT
            ====================================================== */}
            <div>
              <div className="mb-5 flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-[#B79464]"
                />

                <h3 className="text-sm font-black text-white">
                  ارتباط با ما
                </h3>
              </div>

              <ul className="space-y-2 text-[12px] font-medium text-white/68">
                {/* Address */}
                <li className="flex items-start gap-2.5">
                  <MapPin
                    aria-hidden="true"
                    className="mt-1 h-4 w-4 shrink-0 text-[#D8B883]"
                    strokeWidth={1.7}
                  />

                  <span className="leading-7">
                    تهران، بازار سنگ
                  </span>
                </li>

                {/* Phone */}
                <li className="flex items-start gap-2.5">
                  <Phone
                    aria-hidden="true"
                    className="mt-1 h-4 w-4 shrink-0 text-[#D8B883]"
                    strokeWidth={1.7}
                  />

                  <a
                    href={`tel:${TEL_PHONE}`}
                    dir="ltr"
                    className="
                      inline-flex
                      min-h-11
                      items-center
                      py-1
                      transition-colors
                      hover:text-white
                    "
                  >
                    {TEL_PHONE}
                  </a>
                </li>

                {/* Email */}
                <li className="flex items-start gap-2.5">
                  <Mail
                    aria-hidden="true"
                    className="mt-1 h-4 w-4 shrink-0 text-[#D8B883]"
                    strokeWidth={1.7}
                  />

                  <a
                    href="mailto:info@sarayesang.com"
                    className="
                      inline-flex
                      min-h-11
                      max-w-full
                      items-center
                      break-all
                      py-1
                      transition-colors
                      hover:text-white
                    "
                  >
                    info@sarayesang.com
                  </a>
                </li>
              </ul>
            </div>

            {/* =====================================================
                SOCIAL
            ====================================================== */}
            <div>
              <div className="mb-5 flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-[#B79464]"
                />

                <h3 className="text-sm font-black text-white">
                  شبکه‌های اجتماعی
                </h3>
              </div>

              <p
                className="
                  max-w-[250px]
                  text-[12px]
                  font-medium
                  leading-7
                  text-white/68
                "
              >
                برای مشاهده نمونه‌کارها، محصولات جدید و
                اخبار سرای سنگ، همراه ما باشید.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="اینستاگرام"
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/10
                    bg-white/[0.045]
                    text-white/78
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:border-[#B79464]/40
                    hover:bg-[#B79464]
                    hover:text-white
                    active:scale-95
                  "
                >
                  <Globe2
                    aria-hidden="true"
                    className="h-[17px] w-[17px]"
                    strokeWidth={1.8}
                  />
                </a>

                <a
                  href={SOCIAL_LINKS.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="تلگرام"
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/10
                    bg-white/[0.045]
                    text-white/78
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:border-[#B79464]/40
                    hover:bg-[#B79464]
                    hover:text-white
                    active:scale-95
                  "
                >
                  <Send
                    aria-hidden="true"
                    className="h-[17px] w-[17px]"
                    strokeWidth={1.8}
                  />
                </a>

                <a
                  href={SOCIAL_LINKS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="واتساپ"
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/10
                    bg-white/[0.045]
                    text-white/78
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:border-[#B79464]/40
                    hover:bg-[#B79464]
                    hover:text-white
                    active:scale-95
                  "
                >
                  <Phone
                    aria-hidden="true"
                    className="h-[17px] w-[17px]"
                    strokeWidth={1.8}
                  />
                </a>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-px w-8 bg-[#B79464]/70"
                />

                <span
                  className="
                    text-[8px]
                    font-black
                    uppercase
                    tracking-[0.22em]
                    text-[#D8B883]
                  "
                >
                  QUALITY / DETAIL
                </span>
              </div>
            </div>
          </div>

          {/* =========================================================
              BOTTOM BAR
          ========================================================== */}
          <div
            className="
              relative
              mt-12
              border-t
              border-white/[0.09]
              pt-6
              sm:mt-14
              sm:pt-7
            "
          >
            <div
              className="
                flex
                flex-col
                gap-3
                text-center
                sm:flex-row
                sm:items-center
                sm:justify-between
                sm:text-right
              "
            >
              <p
                className="
                  text-[10px]
                  font-medium
                  leading-6
                  text-white/58
                  sm:text-[11px]
                "
              >
                © {new Date().getFullYear()} {SITE_NAME} —
                تمامی حقوق محفوظ است.
              </p>

              <span
                className="
                  text-[9px]
                  font-bold
                  tracking-[0.05em]
                  text-white/48
                "
              >
                کیفیت، انتخاب، ماندگاری
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}