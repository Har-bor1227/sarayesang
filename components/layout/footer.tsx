import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowUpLeft,
  ChevronLeft,
  Headphones,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
  Truck,
} from 'lucide-react'

import {
  BUSINESS,
  CONTACT,
  NAV_LINKS,
  SITE_NAME,
  SOCIAL_LINKS,
} from '@/lib/constants'

const PHONE_HREF = `tel:${CONTACT.phoneInternational}`
const ADDRESS = BUSINESS.address

const toPersianDigits = (value: string) =>
  value.replace(
    /\d/g,
    (digit) => '۰۱۲۳۴۵۶۷۸۹'[Number(digit)],
  )

const PERSIAN_PHONE = toPersianDigits(CONTACT.phone)

function InstagramIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-[15px] w-[15px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        x="3.25"
        y="3.25"
        width="17.5"
        height="17.5"
        rx="5"
      />
      <circle cx="12" cy="12" r="4" />
      <circle
        cx="17.35"
        cy="6.7"
        r="0.8"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-[15px] w-[15px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19.7 11.1a7.7 7.7 0 0 1-11.2 7L4 19.5l1.4-4a7.7 7.7 0 1 1 14.3-4.4Z" />
      <path d="M8.8 8.2c.18-.34.33-.36.62-.36h.42c.2 0 .34.08.44.32l.7 1.5c.1.22.08.4-.08.58l-.56.62c.7 1.17 1.68 2.05 2.86 2.58l.63-.67c.17-.18.35-.22.57-.12l1.47.67c.23.1.34.3.27.54-.12.48-.46 1.17-.96 1.4-.48.23-1.62.18-3.48-.72-1.86-.9-3.2-2.55-3.75-3.76-.55-1.22-.44-2-.15-2.58Z" />
    </svg>
  )
}

function SocialButton({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="
        flex h-9 w-9 shrink-0 items-center justify-center
        rounded-full border border-white/[0.10]
        bg-white/[0.025] text-white/60
        transition-all duration-300
        hover:-translate-y-0.5
        hover:border-[#B79464]/45
        hover:bg-[#B79464]
        hover:text-[#071119]
        active:scale-95
      "
    >
      {children}
    </a>
  )
}

function BrandSection() {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="h-px w-9 shrink-0 bg-[#B79464]/70 sm:w-11"
        />

        <div className="flex items-center gap-2.5">
          <span
            className="
              text-[25px] font-black leading-none
              tracking-[-0.045em] text-white
              sm:text-[29px]
            "
          >
            {SITE_NAME}
          </span>

          <span
            aria-hidden="true"
            className="
              relative flex h-8 w-8
              shrink-0 items-center justify-center
            "
          >
            <span
              className="
                absolute h-[19px] w-[19px]
                rotate-45 border-[2px]
                border-[#B79464]
              "
            />

            <span
              className="
                absolute h-[8px] w-[8px]
                rotate-45 bg-[#D8B883]
              "
            />

            <span
              className="
                absolute h-[2px] w-[27px]
                rotate-45 bg-[#B79464]/45
              "
            />
          </span>
        </div>
      </div>

      <p className="mt-3 max-w-[360px] text-right text-[10px] font-medium leading-6 text-white/55 sm:text-[11px] sm:leading-7">
        ارائه‌دهنده انواع سنگ ساختمانی و دکوراتیو
        <br />
        با تمرکز بر کیفیت و انتخاب دقیق برای پروژه‌های شما.
      </p>

      <a
        href={PHONE_HREF}
        className="
          group mt-4 flex w-full max-w-[300px]
          items-center gap-2.5
          rounded-full
          border border-[#B79464]/25
          bg-white/[0.03]
          px-2.5 py-2
          transition-all duration-300
          hover:border-[#B79464]/55
          hover:bg-[#B79464]/[0.06]
        "
      >
        <span
          className="
            flex h-8 w-8 shrink-0 items-center
            justify-center rounded-full
            bg-[#D8B883] text-[#071119]
            transition-transform duration-300
            group-hover:scale-105
          "
        >
          <Phone
            aria-hidden="true"
            className="h-[14px] w-[14px]"
            strokeWidth={1.9}
          />
        </span>

        <span className="min-w-0 flex-1 text-right">
          <span className="block text-[7px] font-medium text-white/40 sm:text-[8px]">
            مشاوره و استعلام قیمت
          </span>

          <span
            dir="ltr"
            className="mt-0.5 block text-[11px] font-black text-white sm:text-[12px]"
          >
            {PERSIAN_PHONE}
          </span>
        </span>

        <ArrowUpLeft
          aria-hidden="true"
          className="
            h-3.5 w-3.5 shrink-0
            text-[#D8B883]
            transition-transform duration-300
            group-hover:-translate-y-0.5
            group-hover:-translate-x-0.5
          "
          strokeWidth={1.7}
        />
      </a>

      <div className="mt-4 flex items-center gap-1.5">
        <SocialButton
          href={SOCIAL_LINKS.instagram}
          label="اینستاگرام"
        >
          <InstagramIcon />
        </SocialButton>

        <SocialButton
          href={SOCIAL_LINKS.telegram}
          label="تلگرام"
        >
          <Send
            aria-hidden="true"
            className="h-[15px] w-[15px]"
            strokeWidth={1.7}
          />
        </SocialButton>

        <SocialButton
          href={SOCIAL_LINKS.whatsapp}
          label="واتساپ"
        >
          <WhatsAppIcon />
        </SocialButton>
      </div>
    </div>
  )
}

function QuickLinksSection() {
  return (
    <div className="min-w-0">
      <div className="mb-4 flex items-center gap-2">
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full bg-[#B79464]"
        />

        <h3 className="text-right text-[12px] font-black text-white sm:text-[13px]">
          دسترسی سریع
        </h3>
      </div>

      <ul className="space-y-0.5">
        {NAV_LINKS.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="
                group flex min-h-8
                items-center justify-start
                gap-2 text-right
                text-[10px] font-medium
                text-white/52
                transition-colors duration-200
                hover:text-[#D8B883]
                sm:text-[11px]
              "
            >
              <ChevronLeft
                aria-hidden="true"
                className="
                  h-3 w-3 shrink-0
                  text-white/18
                  transition-all duration-200
                  group-hover:-translate-x-0.5
                  group-hover:text-[#D8B883]
                "
                strokeWidth={1.8}
              />

              <span>{item.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ContactSection() {
  return (
    <div className="min-w-0">
      <div className="mb-4 flex items-center gap-2">
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full bg-[#B79464]"
        />

        <h3 className="text-right text-[12px] font-black text-white sm:text-[13px]">
          راه‌های ارتباطی
        </h3>
      </div>

      <div className="space-y-4">
        <a
          href={PHONE_HREF}
          className="group flex items-start gap-2.5"
        >
          <Phone
            aria-hidden="true"
            className="mt-0.5 h-4 w-4 shrink-0 text-[#D8B883]"
            strokeWidth={1.65}
          />

          <span className="min-w-0 text-right">
            <span className="block text-[7px] font-medium text-white/35">
              تماس مستقیم
            </span>

            <span
              dir="ltr"
              className="
                mt-0.5 block
                text-[10px] font-black
                text-white/82
                transition-colors
                group-hover:text-[#D8B883]
                sm:text-[11px]
              "
            >
              {PERSIAN_PHONE}
            </span>
          </span>
        </a>

        <div className="flex items-start gap-2.5">
          <MapPin
            aria-hidden="true"
            className="mt-0.5 h-4 w-4 shrink-0 text-[#D8B883]"
            strokeWidth={1.65}
          />

          <span className="min-w-0 text-right">
            <span className="block text-[7px] font-medium text-white/35">
              آدرس
            </span>

            <span className="mt-0.5 block text-[10px] font-medium leading-5 text-white/62 sm:text-[11px]">
              {ADDRESS}
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}

function NewsletterSection() {
  return (
    <div className="min-w-0">
      <div className="mb-4 flex items-center gap-2">
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full bg-[#B79464]"
        />

        <h3 className="text-right text-[12px] font-black text-white sm:text-[13px]">
          عضویت در خبرنامه
        </h3>
      </div>

      <p className="text-right text-[9px] font-medium leading-6 text-white/48 sm:text-[10px]">
        با عضویت در خبرنامه از جدیدترین محصولات،
        <br />
        تخفیف‌ها و اخبار سرای سنگ مطلع شوید.
      </p>

      <div className="mt-3 flex h-10 items-center rounded-full border border-white/[0.10] bg-white/[0.025] p-1">
        <span className="flex min-w-0 flex-1 items-center px-3">
          <span className="text-right text-[8px] text-white/25 sm:text-[9px]">
            ایمیل خود را وارد کنید
          </span>
        </span>

        <button
          type="button"
          aria-label="عضویت در خبرنامه"
          className="
            flex h-8 w-8 shrink-0
            items-center justify-center
            rounded-full bg-[#D8B883]
            text-[#071119]
            transition-transform duration-200
            hover:scale-105 active:scale-95
          "
        >
          <ArrowUpLeft
            aria-hidden="true"
            className="h-3.5 w-3.5"
            strokeWidth={1.8}
          />
        </button>
      </div>

      <a
        href={PHONE_HREF}
        className="
          group mt-2.5 flex min-h-[45px]
          items-center gap-2.5
          rounded-full
          border border-[#B79464]/30
          px-2.5 py-1.5
          transition-all duration-300
          hover:border-[#B79464]/55
          hover:bg-[#B79464]/[0.05]
        "
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#D8B883] text-[#071119]">
          <Phone
            aria-hidden="true"
            className="h-[14px] w-[14px]"
            strokeWidth={1.9}
          />
        </span>

        <span className="min-w-0 flex-1 text-right">
          <span className="block text-[7px] font-medium text-white/35">
            مشاوره و استعلام قیمت
          </span>

          <span
            dir="ltr"
            className="mt-0.5 block text-[9px] font-black text-white sm:text-[10px]"
          >
            {PERSIAN_PHONE}
          </span>
        </span>

        <ArrowUpLeft
          aria-hidden="true"
          className="h-3.5 w-3.5 shrink-0 text-[#D8B883]"
          strokeWidth={1.7}
        />
      </a>
    </div>
  )
}

function TrustFeatures() {
  return (
    <div className="mt-6 border-t border-white/[0.07] pt-4">
      <div className="flex flex-wrap items-center justify-start gap-x-6 gap-y-3">
        <span className="inline-flex items-center gap-1.5 text-[8px] font-medium text-white/38 sm:text-[9px]">
          <ShieldCheck
            aria-hidden="true"
            className="h-3.5 w-3.5 text-[#D8B883]"
            strokeWidth={1.7}
          />
          تضمین کیفیت
        </span>

        <span className="inline-flex items-center gap-1.5 text-[8px] font-medium text-white/38 sm:text-[9px]">
          <Truck
            aria-hidden="true"
            className="h-3.5 w-3.5 text-[#D8B883]"
            strokeWidth={1.7}
          />
          ارسال به سراسر کشور
        </span>

        <span className="inline-flex items-center gap-1.5 text-[8px] font-medium text-white/38 sm:text-[9px]">
          <Headphones
            aria-hidden="true"
            className="h-3.5 w-3.5 text-[#D8B883]"
            strokeWidth={1.7}
          />
          مشاوره تخصصی
        </span>
      </div>
    </div>
  )
}

export default function Footer() {
  return (
    <footer
      dir="rtl"
      className="
        relative mt-auto overflow-hidden
        bg-[#071119] text-white
      "
    >
      {/* Desktop stone image */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute
          left-0 bottom-0
          hidden
          h-[245px]
          w-1/2
          overflow-hidden
          lg:block
        "
      >
        <Image
          src="/images/footer-stone.jpg"
          alt=""
          aria-hidden="true"
          fill
          sizes="(min-width: 1024px) 50vw, 0px"
          className="
            object-cover
            object-right-bottom
            opacity-[0.72]
          "
        />

        {/* Fade into background from left side */}
        <div
          className="
            pointer-events-none absolute inset-0
            bg-gradient-to-l
            from-transparent
            via-transparent
            to-[#071119]/75
          "
        />

        {/* Decorative stone/gold lines */}
        <div
          className="
            absolute bottom-[59px] right-0
            h-px w-[45%]
            bg-gradient-to-l
            from-[#B79464]/80
            to-transparent
          "
        />

        <div
          className="
            absolute bottom-[45px] right-[15%]
            h-px w-[25%]
            bg-gradient-to-l
            from-[#B79464]/45
            to-transparent
          "
        />
      </div>

      {/* Single footer content */}
      <div className="relative z-10 mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-10 xl:px-12">
        <div className="py-10 sm:py-11 lg:py-12">
          {/* Desktop */}
          <div className="hidden lg:grid lg:grid-cols-[1.12fr_0.82fr_0.82fr_1.15fr] lg:gap-x-12">
            <BrandSection />
            <ContactSection />
            <QuickLinksSection />
            <NewsletterSection />
          </div>

          {/* Mobile */}
          <div className="lg:hidden">
            <BrandSection />

            <div className="mt-6 border-t border-white/[0.07]">
              <details className="group border-b border-white/[0.07]">
                <summary className="flex cursor-pointer list-none items-center justify-between py-4 [&::-webkit-details-marker]:hidden">
                  <ChevronLeft
                    aria-hidden="true"
                    className="h-4 w-4 text-[#D8B883] transition-transform duration-200 group-open:-rotate-90"
                    strokeWidth={1.6}
                  />

                  <span className="text-[11px] font-black text-white">
                    دسترسی سریع
                  </span>
                </summary>

                <div className="pb-4">
                  <QuickLinksSection />
                </div>
              </details>

              <details className="group border-b border-white/[0.07]">
                <summary className="flex cursor-pointer list-none items-center justify-between py-4 [&::-webkit-details-marker]:hidden">
                  <ChevronLeft
                    aria-hidden="true"
                    className="h-4 w-4 text-[#D8B883] transition-transform duration-200 group-open:-rotate-90"
                    strokeWidth={1.6}
                  />

                  <span className="text-[11px] font-black text-white">
                    راه‌های ارتباطی
                  </span>
                </summary>

                <div className="pb-5">
                  <ContactSection />
                </div>
              </details>

              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between py-4 [&::-webkit-details-marker]:hidden">
                  <ChevronLeft
                    aria-hidden="true"
                    className="h-4 w-4 text-[#D8B883] transition-transform duration-200 group-open:-rotate-90"
                    strokeWidth={1.6}
                  />

                  <span className="text-[11px] font-black text-white">
                    عضویت در خبرنامه
                  </span>
                </summary>

                <div className="pb-5">
                  <NewsletterSection />
                </div>
              </details>
            </div>

            <TrustFeatures />
          </div>

          {/* Desktop trust */}
          <div className="hidden lg:block">
            <TrustFeatures />
          </div>

          {/* Bottom bar */}
          <div className="relative mt-7 border-t border-white/[0.08] pt-4 sm:mt-8 sm:pt-5">
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
              <p className="order-2 text-right text-[8px] font-medium leading-5 text-white/30 sm:order-1 sm:text-[9px]">
                © {new Date().getFullYear()} {SITE_NAME} — تمامی حقوق محفوظ است.
              </p>

              <div className="order-1 flex items-center justify-end gap-3 sm:order-2">
                <span className="text-[8px] font-medium text-white/28 sm:text-[9px]">
                  کیفیت
                </span>

                <span className="h-1 w-1 rounded-full bg-[#B79464]/50" />

                <span className="text-[8px] font-medium text-white/28 sm:text-[9px]">
                  انتخاب
                </span>

                <span className="h-1 w-1 rounded-full bg-[#B79464]/50" />

                <span className="text-[8px] font-medium text-white/28 sm:text-[9px]">
                  ماندگاری
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}