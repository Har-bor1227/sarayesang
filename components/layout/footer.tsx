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
    <footer className="mt-auto overflow-hidden bg-[#0a1929] text-white">
      <div className="container">
        {/* Main footer */}
        <div
          className="
            relative
            py-14
            sm:py-16
            lg:py-20
          "
        >
          {/* Decorative accent */}
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
              bg-accent/[0.055]
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
              bg-primary-light/[0.045]
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
            {/* Brand */}
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
                  className="
                    h-px
                    w-8
                    bg-accent
                  "
                />

                <span
                  className="
                    text-[10px]
                    font-bold
                    tracking-[0.08em]
                    text-accent-light
                  "
                >
                  SARAYE SANG
                </span>
              </div>

              <h2
                className="
                  text-2xl
                  font-black
                  tracking-[-0.03em]
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
                  text-sm
                  leading-8
                  text-white/62
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
                  max-w-full
                  items-center
                  gap-3
                  rounded-full
                  border
                  border-accent/20
                  bg-white/[0.045]
                  px-4
                  py-2.5
                  transition-all
                  duration-200
                  hover:border-accent/45
                  hover:bg-accent/[0.09]
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
                    bg-accent/[0.12]
                    text-accent-light
                    transition-transform
                    duration-200
                    group-hover:scale-105
                  "
                >
                  <Phone
                    className="h-4 w-4"
                    strokeWidth={1.8}
                  />
                </span>

                <span className="min-w-0 text-right">
                  <span className="block text-[10px] font-medium text-white/45">
                    مشاوره و استعلام قیمت
                  </span>

                  <span
                    dir="ltr"
                    className="mt-0.5 block text-sm font-bold text-white"
                  >
                    {TEL_PHONE}
                  </span>
                </span>

                <ArrowUpLeft
                  className="
                    mr-1
                    h-4
                    w-4
                    shrink-0
                    text-accent-light
                    transition-transform
                    duration-200
                    group-hover:-translate-y-0.5
                    group-hover:-translate-x-0.5
                  "
                  strokeWidth={1.7}
                />
              </a>
            </div>

            {/* Quick links */}
            <div>
              <div className="mb-5 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />

                <h3 className="text-sm font-bold text-white">
                  دسترسی سریع
                </h3>
              </div>

              <ul className="space-y-3">
                {NAV_LINKS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="
                        group
                        inline-flex
                        items-center
                        gap-2
                        text-sm
                        text-white/55
                        transition-colors
                        duration-200
                        hover:text-accent-light
                      "
                    >
                      <span
                        className="
                          h-px
                          w-0
                          bg-accent
                          transition-all
                          duration-200
                          group-hover:w-3
                        "
                      />

                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <div className="mb-5 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />

                <h3 className="text-sm font-bold text-white">
                  ارتباط با ما
                </h3>
              </div>

              <ul className="space-y-4 text-sm text-white/55">
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <MapPin
                    className="mt-0.5 h-4 w-4 shrink-0 text-accent-light"
                    strokeWidth={1.7}
                  />

                  <span className="leading-6">
                    تهران، بازار سنگ
                  </span>
                </li>

                <li className="flex items-start gap-2.5 sm:gap-3">
                  <Phone
                    className="mt-0.5 h-4 w-4 shrink-0 text-accent-light"
                    strokeWidth={1.7}
                  />

                  <a
                    href={`tel:${TEL_PHONE}`}
                    dir="ltr"
                    className="transition-colors hover:text-white"
                  >
                    {TEL_PHONE}
                  </a>
                </li>

                <li className="flex items-start gap-2.5 sm:gap-3">
                  <Mail
                    className="mt-0.5 h-4 w-4 shrink-0 text-accent-light"
                    strokeWidth={1.7}
                  />

                  <a
                    href="mailto:info@sarayesang.com"
                    className="
                      break-all
                      transition-colors
                      hover:text-white
                    "
                  >
                    info@sarayesang.com
                  </a>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <div className="mb-5 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />

                <h3 className="text-sm font-bold text-white">
                  شبکه‌های اجتماعی
                </h3>
              </div>

              <p className="max-w-[240px] text-sm leading-7 text-white/50">
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
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/10
                    bg-white/[0.045]
                    text-white/65
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:border-accent/30
                    hover:bg-accent
                    hover:text-white
                  "
                >
                  <Globe2
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
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/10
                    bg-white/[0.045]
                    text-white/65
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:border-accent/30
                    hover:bg-accent
                    hover:text-white
                  "
                >
                  <Send
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
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/10
                    bg-white/[0.045]
                    text-white/65
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:border-accent/30
                    hover:bg-accent
                    hover:text-white
                  "
                >
                  <Phone
                    className="h-[17px] w-[17px]"
                    strokeWidth={1.8}
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom line */}
          <div
            className="
              relative
              mt-12
              border-t
              border-white/[0.09]
              pt-6
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
              <p className="text-[11px] leading-6 text-white/35">
                © {new Date().getFullYear()} {SITE_NAME} —
                تمامی حقوق محفوظ است.
              </p>

              <span className="text-[10px] font-medium text-white/25">
                کیفیت، انتخاب، ماندگاری
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}