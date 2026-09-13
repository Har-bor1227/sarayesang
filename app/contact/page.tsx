import type { Metadata } from 'next'

import Link from 'next/link'

import {
  ArrowLeft,
  Globe2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from 'lucide-react'

import Container from '@/components/ui/container'

import {
  generateOrganizationSchema,
  JsonLd,
} from '@/lib/seo'

import {
  SITE_NAME,
  SITE_URL,
  TEL_PHONE,
  SOCIAL_LINKS,
} from '@/lib/constants'

export const metadata: Metadata = {
  title: `تماس با ما | ${SITE_NAME}`,

  description:
    'برای استعلام قیمت سنگ و مشاوره تخصصی با سرای سنگ تماس بگیرید.',

  alternates: {
    canonical: `${SITE_URL}/contact`,
  },

  openGraph: {
    title: `تماس با ما | ${SITE_NAME}`,
    description:
      'برای استعلام قیمت سنگ و مشاوره تخصصی با ما تماس بگیرید.',
    type: 'website',
  },
}

const contactItems = [
  {
    icon: Phone,
    label: 'تلفن تماس',
    value: TEL_PHONE,
    href: `tel:${TEL_PHONE}`,
  },
  {
    icon: Mail,
    label: 'ایمیل',
    value: 'info@sarayesang.com',
    href: 'mailto:info@sarayesang.com',
  },
]

const socialItems = [
  {
    label: 'اینستاگرام',
    href: SOCIAL_LINKS.instagram,
    icon: Globe2,
  },
  {
    label: 'تلگرام',
    href: SOCIAL_LINKS.telegram,
    icon: Send,
  },
  {
    label: 'واتساپ',
    href: SOCIAL_LINKS.whatsapp,
    icon: MessageCircle,
  },
]

export default function ContactPage() {
  const organizationSchema =
    generateOrganizationSchema()

  return (
    <main
      className="w-full overflow-hidden bg-[#FCFCFB]"
      dir="rtl"
    >
      <JsonLd data={organizationSchema} />

      <Container className="pb-16 pt-5 sm:pb-20 sm:pt-7 lg:pb-24">
        {/* =========================================================
            BREADCRUMB
        ========================================================== */}
        <nav
          className="mb-8 pt-16 sm:pt-12 md:pt-5"
          aria-label="مسیر راهنما"
        >
          <div className="inline-flex max-w-full items-center rounded-full border border-gray-200 bg-white px-4 py-2.5 shadow-[0_4px_18px_rgba(17,47,80,0.08)]">
            <ol className="flex min-w-0 items-center gap-2 overflow-hidden text-xs sm:text-sm">
              <li className="shrink-0">
                <Link
                  href="/"
                  className="font-medium text-gray-400 transition-colors hover:text-accent"
                >
                  خانه
                </Link>
              </li>

              <li
                className="shrink-0 text-gray-300"
                aria-hidden="true"
              >
                /
              </li>

              <li className="shrink-0 font-bold text-primary">
                تماس با ما
              </li>
            </ol>
          </div>
        </nav>

        {/* =========================================================
            INTRO
        ========================================================== */}
        <header className="mb-10 sm:mb-12 lg:mb-14">
          <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-12">
            <div className="max-w-[780px]">
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-[#B79464] sm:w-10" />

                <span className="text-[9px] font-black uppercase tracking-[0.22em] text-[#B79464] sm:text-[10px]">
                  Contact / Consultation
                </span>
              </div>

              <h1 className="text-[30px] font-black leading-[1.45] tracking-[-0.035em] text-[#112F50] sm:text-[39px] sm:leading-[1.4] lg:text-[48px]">
                برای پروژه‌تان،
                <span className="text-[#B79464]">
                  {' '}
                  با ما صحبت کنید
                </span>
              </h1>

              <p className="mt-4 max-w-[680px] text-[11px] font-medium leading-7 text-[#667085] sm:text-[13px] sm:leading-8">
                برای استعلام قیمت، مشاوره تخصصی، بررسی
                سنگ مناسب پروژه و دریافت اطلاعات بیشتر،
                کارشناسان سرای سنگ در کنار شما هستند.
              </p>
            </div>

            <div className="hidden items-center gap-3 rounded-full border border-[#112F50]/[0.07] bg-white px-4 py-2.5 shadow-[0_6px_20px_rgba(10,25,41,0.04)] sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[#B79464]" />

              <span className="text-[9px] font-bold text-[#667085]">
                پاسخ‌گویی مستقیم
              </span>
            </div>
          </div>

          <div className="mt-7 h-px w-full bg-[#112F50]/[0.07]" />
        </header>

        {/* =========================================================
            CONTACT EXPERIENCE
        ========================================================== */}
        <section className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr] lg:gap-6">
          {/* =======================================================
              PRIMARY CONTACT PANEL
          ======================================================== */}
          <div className="relative overflow-hidden rounded-[28px] bg-[#0A1929] p-6 sm:p-8 lg:p-9">
            <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#B79464]/[0.08] blur-3xl" />

            <div className="pointer-events-none absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-white/[0.035] blur-3xl" />

            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#B79464]" />

                <span className="text-[8px] font-black uppercase tracking-[0.22em] text-[#B79464]">
                  Direct Line
                </span>
              </div>

              <h2 className="mt-5 text-[24px] font-black leading-[1.55] text-white sm:text-[30px]">
                مستقیماً با ما
                <span className="text-[#D8B883]">
                  {' '}
                  در ارتباط باشید
                </span>
              </h2>

              <p className="mt-3 max-w-[460px] text-[10px] font-medium leading-7 text-white/48 sm:text-[11px] sm:leading-8">
                سریع‌ترین راه برای استعلام قیمت و
                دریافت مشاوره درباره انتخاب سنگ،
                تماس مستقیم با تیم سرای سنگ است.
              </p>

              {/* PRIMARY CTA */}
              <a
                href={`tel:${TEL_PHONE}`}
                className="group mt-7 flex min-h-[58px] items-center justify-between gap-4 rounded-[18px] bg-[#B79464] px-5 text-[#0A1929] shadow-[0_14px_32px_rgba(183,148,100,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#D8B883]"
              >
                <div className="min-w-0">
                  <span className="block text-[8px] font-bold opacity-60">
                    تماس مستقیم
                  </span>

                  <span
                    className="mt-1 block truncate text-[14px] font-black"
                    dir="ltr"
                  >
                    {TEL_PHONE}
                  </span>
                </div>

                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0A1929]/[0.08]">
                  <Phone className="h-4 w-4" />
                </span>
              </a>

              {/* SECONDARY CONTACTS */}
              <div className="mt-7 space-y-3">
                {contactItems.map(
                  (item) => {
                    const Icon = item.icon

                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        className="group flex items-center gap-3 rounded-[17px] border border-white/[0.08] bg-white/[0.035] px-4 py-3.5 transition-all duration-300 hover:border-[#B79464]/30 hover:bg-white/[0.06]"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-white/[0.06] text-[#D8B883]">
                          <Icon className="h-4 w-4" />
                        </span>

                        <span className="min-w-0">
                          <span className="block text-[8px] font-semibold text-white/35">
                            {item.label}
                          </span>

                          <span
                            className="mt-1 block truncate text-[10px] font-bold text-white/80 sm:text-[11px]"
                            dir={
                              item.label ===
                              'تلفن تماس' ||
                              item.label ===
                              'ایمیل'
                                ? 'ltr'
                                : 'rtl'
                            }
                          >
                            {item.value}
                          </span>
                        </span>
                      </a>
                    )
                  },
                )}
              </div>

              <div className="mt-8 h-px bg-white/[0.08]" />

              <div className="mt-6 flex items-center justify-between gap-4">
                <span className="text-[8px] font-black uppercase tracking-[0.18em] text-white/25">
                  SARAYE SANG
                </span>

                <span className="text-[8px] font-medium text-white/25">
                  Consultation / Inquiry
                </span>
              </div>
            </div>
          </div>

          {/* =======================================================
              INFORMATION + SOCIAL
          ======================================================== */}
          <div className="grid gap-5">
            {/* ADDRESS */}
            <section className="rounded-[28px] border border-[#112F50]/[0.07] bg-white p-6 shadow-[0_10px_35px_rgba(10,25,41,0.04)] sm:p-8">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="h-px w-7 bg-[#B79464]" />

                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#B79464]">
                      Our Location
                    </span>
                  </div>

                  <h2 className="mt-4 text-[19px] font-black text-[#112F50] sm:text-[22px]">
                    در دسترس شما هستیم
                  </h2>

                  <p className="mt-2 max-w-[520px] text-[10px] font-medium leading-6 text-[#667085] sm:text-[11px] sm:leading-7">
                    برای ملاقات و هماهنگی، می‌توانید
                    از طریق اطلاعات زیر با ما در تماس
                    باشید.
                  </p>
                </div>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#FBF8F2] text-[#B79464]">
                  <MapPin className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-6 rounded-[20px] border border-[#112F50]/[0.07] bg-[#FCFCFB] p-4">
                <span className="block text-[8px] font-bold text-[#667085]">
                  آدرس
                </span>

                <p className="mt-1.5 text-[12px] font-black text-[#112F50]">
                  تهران، بازار سنگ
                </p>
              </div>
            </section>

            {/* SOCIAL */}
            <section className="rounded-[28px] border border-[#112F50]/[0.07] bg-[#FCFCFB] p-6 sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="h-px w-7 bg-[#B79464]" />

                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#B79464]">
                      Social
                    </span>
                  </div>

                  <h2 className="mt-4 text-[18px] font-black text-[#112F50] sm:text-[21px]">
                    ما را دنبال کنید
                  </h2>

                  <p className="mt-2 text-[10px] font-medium leading-6 text-[#667085]">
                    با ما در شبکه‌های اجتماعی
                    در ارتباط بمانید.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {socialItems.map(
                    (item) => {
                      const Icon = item.icon

                      return (
                        <a
                          key={item.label}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={item.label}
                          className="group flex h-11 w-11 items-center justify-center rounded-[14px] border border-[#112F50]/[0.08] bg-white text-[#112F50] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#B79464]/40 hover:bg-[#B79464] hover:text-white"
                        >
                          <Icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-105" />
                        </a>
                      )
                    },
                  )}
                </div>
              </div>
            </section>
          </div>
        </section>

        {/* =========================================================
            MAP
        ========================================================== */}
        <section className="mt-5 overflow-hidden rounded-[28px] border border-[#112F50]/[0.07] bg-white shadow-[0_12px_40px_rgba(10,25,41,0.05)]">
          <div className="flex flex-col gap-3 border-b border-[#112F50]/[0.07] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-7 bg-[#B79464]" />

                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#B79464]">
                  Location
                </span>
              </div>

              <h2 className="mt-2 text-[16px] font-black text-[#112F50] sm:text-[18px]">
                موقعیت سرای سنگ
              </h2>
            </div>

            <span className="text-[9px] font-medium text-[#667085]">
              تهران، بازار سنگ
            </span>
          </div>

          <div className="h-[320px] w-full bg-[#E9ECEF] sm:h-[390px] lg:h-[460px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3240.0!2d51.0!3d35.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDAwJzAwLjAiTiA1McKwMDAnMDAuMCJF!5e0!3m2!1sen!2s!4v1600000000000"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="نقشه موقعیت سرای سنگ"
            />
          </div>
        </section>

        {/* =========================================================
            FINAL CTA
        ========================================================== */}
        <section className="mt-5 overflow-hidden rounded-[28px] bg-[#112F50]">
          <div className="relative px-6 py-8 sm:px-8 sm:py-10 lg:px-10">
            <div className="pointer-events-none absolute -left-20 -top-20 h-44 w-44 rounded-full bg-[#B79464]/[0.08] blur-3xl" />

            <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#B79464]">
                  Start a Conversation
                </span>

                <h2 className="mt-2 text-[19px] font-black text-white sm:text-[23px]">
                  برای استعلام قیمت آماده‌ایم.
                </h2>
              </div>

              <a
                href={`tel:${TEL_PHONE}`}
                className="group inline-flex min-h-[46px] shrink-0 items-center justify-center gap-2 rounded-full bg-[#B79464] px-6 text-[10px] font-black text-[#0A1929] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#D8B883] sm:text-[11px]"
              >
                تماس با سرای سنگ

                <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              </a>
            </div>
          </div>
        </section>
      </Container>
    </main>
  )
}