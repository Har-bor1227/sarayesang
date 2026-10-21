import type { Metadata } from 'next'

import {
  ArrowLeft,
  Globe2,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Send,
  Sparkles,
  UserRound,
} from 'lucide-react'

import Container from '@/components/ui/container'

import {
  BUSINESS,
  CONTACT,
  DEFAULT_SOCIAL_IMAGE,
  SITE_NAME,
  SITE_URL,
  SOCIAL_LINKS,
} from '@/lib/constants'

import {
  generateContactPageSchema,
  generateLocalBusinessSchema,
  JsonLd,
} from '@/lib/seo'

export const metadata: Metadata = {
  title: 'تماس با ما',

  description:
    'برای استعلام قیمت، مشاوره تخصصی و ارتباط مستقیم با تیم سرای سنگ با ما در تماس باشید.',

  alternates: {
    canonical: `${SITE_URL}/contact`,
  },

  openGraph: {
    title: `${SITE_NAME} | تماس با ما`,
    description:
      'برای استعلام قیمت، مشاوره تخصصی و ارتباط مستقیم با تیم سرای سنگ با ما در تماس باشید.',
    type: 'website',
    url: `${SITE_URL}/contact`,
    siteName: SITE_NAME,
    locale: 'fa_IR',
    images: [
      {
        url: DEFAULT_SOCIAL_IMAGE,
        width: 1920,
        height: 758,
        alt: SITE_NAME,
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    images: [DEFAULT_SOCIAL_IMAGE],
    title: `${SITE_NAME} | تماس با ما`,
    description:
      'برای استعلام قیمت، مشاوره تخصصی و ارتباط مستقیم با تیم سرای سنگ با ما در تماس باشید.',
  },
}

const contactPersons = [
  {
    name: 'محمدرضا مومنیان',
    role: 'کارشناس فروش',
    phone: CONTACT.phone,
  },
  {
    name: 'علی حجاری',
    role: 'کارشناس فروش',
    phone: CONTACT.secondaryPhone,
  },
]

const contactChannels = [
  {
    icon: Mail,
    label: 'ایمیل',
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
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

const OFFICE_ADDRESS =
  BUSINESS.address

const MAP_LAT =
  BUSINESS.latitude

const MAP_LNG =
  BUSINESS.longitude

const MAP_EMBED_URL =
  `https://www.google.com/maps?q=${MAP_LAT},${MAP_LNG}&z=16&output=embed`

const GOOGLE_MAPS_URL =
  `https://www.google.com/maps/search/?api=1&query=${MAP_LAT},${MAP_LNG}`

const localBusinessSchema =
  generateLocalBusinessSchema({
    streetAddress:
      `${BUSINESS.street} - ${BUSINESS.building}`,

    addressLocality:
      BUSINESS.city,

    addressCountry:
      BUSINESS.country,

    latitude:
      MAP_LAT,

    longitude:
      MAP_LNG,

    email:
      CONTACT.email,

    mapUrl:
      GOOGLE_MAPS_URL,
  })

const contactPageSchema =
  generateContactPageSchema()


function PhonePersonCard({
  name,
  role,
  phone,
}: {
  name: string
  role: string
  phone: string
}) {
  return (
    <a
      href={`tel:${phone}`}
      dir="rtl"
      className="
        group
        relative
        overflow-hidden
        rounded-[24px]
        border
        border-white/[0.09]
        bg-[#0B1B2A]
        p-5
        text-center
        shadow-[0_14px_40px_rgba(10,25,41,0.14)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[#B79464]/30
        hover:shadow-[0_20px_50px_rgba(10,25,41,0.18)]
        sm:p-6
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-12
          -top-12
          h-28
          w-28
          rounded-full
          bg-[#B79464]/[0.08]
          blur-3xl
          transition-transform
          duration-500
          group-hover:scale-125
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -bottom-16
          -left-16
          h-28
          w-28
          rounded-full
          bg-[#31567D]/[0.10]
          blur-3xl
        "
      />

      <div className="relative z-10 flex flex-col items-center">
        <span
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            border
            border-[#D8BC8D]/20
            bg-[#B79464]/[0.10]
            text-[#D8BC8D]
            shadow-[0_8px_24px_rgba(183,148,100,0.10)]
          "
        >
          <UserRound
            aria-hidden="true"
            className="h-5 w-5"
            strokeWidth={1.7}
          />
        </span>

        <h3 className="mt-1.5 text-[15px] font-black text-white sm:text-[16px]">
          {name}
        </h3>

        <span className="mt-1 text-[9px] font-bold text-white/35">
          {role}
        </span>

        <div
          className="
            mt-5
            w-full
            rounded-[18px]
            border
            border-[#D8BC8D]/20
            bg-[#F4EFE5]
            px-4
            py-4
            shadow-[0_10px_28px_rgba(0,0,0,0.15)]
            transition-all
            duration-300
            group-hover:bg-[#FAF7F0]
          "
        >
          <span
            dir="ltr"
            className="
              block
              text-[20px]
              font-black
              tracking-[0.025em]
              text-[#112F50]
              sm:text-[23px]
            "
          >
            {phone}
          </span>

          <span className="mt-1.5 block text-[8px] font-bold text-[#7A6850]">
            برای تماس لمس کنید
          </span>
        </div>

        <div className="mt-4 flex items-center gap-1.5 text-[8px] font-black text-white/30 transition-colors duration-300 group-hover:text-[#D8BC8D]">
          <Phone
            aria-hidden="true"
            className="h-3 w-3"
            strokeWidth={2}
          />

          تماس مستقیم
        </div>
      </div>
    </a>
  )
}


export default function ContactPage() {
  return (
    <div
      dir="rtl"
      className="
        w-full
        overflow-hidden
        bg-[#FCFCFB]
        text-[#112F50]
      "
    >
      <JsonLd data={contactPageSchema} />
      <JsonLd data={localBusinessSchema} />

      <Container className="pb-16 pt-4 sm:pb-20 sm:pt-6 lg:pb-24">
        {/* =========================================================
            HERO
        ========================================================== */}
        <header className="pt-16 sm:pt-12 md:pt-7">
          <div
            className="
              relative
              overflow-hidden
              rounded-[30px]
              border
              border-[#D9E1E7]
              bg-[#0A1929]
              px-5
              py-6
              shadow-[0_24px_70px_rgba(17,47,80,0.11)]
              sm:rounded-[38px]
              sm:px-8
              sm:py-9
              lg:px-11
              lg:py-11
            "
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
            >
              <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full bg-[#B79464]/[0.12] blur-3xl" />

              <div className="absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-[#396183]/[0.12] blur-3xl" />

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_0%,rgba(255,255,255,0.05),transparent_35%)]" />

              <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_15%,rgba(255,255,255,0.025)_50%,transparent_82%)]" />
            </div>

            <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-12">
              <div className="max-w-[850px]">
                <div className="mb-5 flex items-center gap-3">
                  <span className="h-px w-8 bg-[#B79464] sm:w-11" />

                </div>

                <h1 className="max-w-[820px] text-[29px] font-black leading-[1.45] tracking-[-0.045em] text-white sm:text-[40px] sm:leading-[1.4] lg:text-[54px] lg:leading-[1.32]">
                  برای انتخاب سنگ
                  <span className="text-[#D8BC8D]">
                    {' '}
                    مستقیم با ما صحبت کنید
                  </span>
                </h1>

                <p className="mt-4 max-w-[700px] text-[11px] font-medium leading-7 text-white/48 sm:mt-5 sm:text-[13px] sm:leading-8">
                  برای استعلام قیمت، بررسی موجودی،
                  انتخاب سنگ مناسب پروژه و مشاوره
                  تخصصی، تیم سرای سنگ در کنار شماست.
                </p>
              </div>

              <div
                className="
                  flex
                  items-center
                  gap-3
                  self-start
                  rounded-full
                  border
                  border-white/[0.09]
                  bg-white/[0.045]
                  px-4
                  py-2.5
                  backdrop-blur-xl
                  lg:self-end
                "
              >
                <span className="flex h-6.5 w-6.5 items-center justify-center rounded-full bg-[#B79464]/[0.12] text-[#D8BC8D]">
                  <Phone
                    aria-hidden="true"
                    className="h-3.5 w-3.5"
                    strokeWidth={1.8}
                  />
                </span>

                <span className="text-[8px] font-black text-white/65 sm:text-[9px]">
                  ارتباط مستقیم با تیم فروش
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* =========================================================
            CONTACT PEOPLE
        ========================================================== */}
        <section className="mt-5 sm:mt-6">
          <div className="mb-5 px-1 text-center sm:mb-6">
            <h2 className="mt-2 text-[21px] font-black text-[#112F50] sm:text-[25px]">
              مستقیم با کارشناسان فروش صحبت کنید
            </h2>

            <p className="mx-auto mt-2 max-w-[580px] text-[10px] font-medium leading-6 text-[#667085] sm:text-[11px] sm:leading-7">
              برای استعلام قیمت، مشاوره و هماهنگی خرید،
              می‌توانید مستقیماً با کارشناسان فروش سرای سنگ
              در ارتباط باشید.
            </p>

            <div className="mx-auto mt-3 flex items-center justify-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#B79464]" />

              <span className="text-[8px] font-bold text-[#8A94A0]">
                پاسخ‌گویی مستقیم
              </span>

              <span className="h-1.5 w-1.5 rounded-full bg-[#B79464]" />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {contactPersons.map((person) => (
              <PhonePersonCard
                key={person.phone}
                {...person}
              />
            ))}
          </div>
        </section>

        {/* =========================================================
            MAIN CONTACT EXPERIENCE
        ========================================================== */}
        <section className="mt-5 grid gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:gap-6">
          {/* OFFICE */}
          <section
            className="
              relative
              overflow-hidden
              rounded-[30px]
              border
              border-[#D7E0E7]
              bg-white
              p-5
              shadow-[0_14px_45px_rgba(17,47,80,0.055)]
              sm:p-7
              lg:p-8
            "
          >
            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                -left-24
                -top-24
                h-56
                w-56
                rounded-full
                bg-[#B79464]/[0.045]
                blur-3xl
              "
            />

            <div className="relative z-10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="h-px w-7 bg-[#B79464] sm:w-9" />
                  </div>

                  <h2 className="mt-4 text-[22px] font-black leading-8 text-[#112F50] sm:text-[28px]">
                    دفتر فروش سرای سنگ
                  </h2>

                  <p className="mt-2 max-w-[620px] text-[10px] font-medium leading-6 text-[#667085] sm:text-[11px] sm:leading-7">
                    برای مراجعه حضوری، هماهنگی فروش و
                    دریافت مشاوره می‌توانید به دفتر فروش
                    سرای سنگ مراجعه کنید.
                  </p>
                </div>

                <span
                  className="
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-[16px]
                    border
                    border-[#B79464]/15
                    bg-[#FBF8F2]
                    text-[#B79464]
                  "
                >
                  <MapPin
                    aria-hidden="true"
                    className="h-5 w-5"
                    strokeWidth={1.7}
                  />
                </span>
              </div>

              <div
                className="
                  mt-6
                  rounded-[22px]
                  border
                  border-[#112F50]/[0.07]
                  bg-[#FCFCFB]
                  p-4
                  sm:p-5
                "
              >
                <span className="text-[8px] font-bold text-[#9AA3AD]">
                  آدرس دفتر فروش
                </span>

                <p className="mt-2 text-[12px] font-black leading-7 text-[#112F50] sm:text-[14px] sm:leading-8">
                  {OFFICE_ADDRESS}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span
                    dir="ltr"
                    className="
                      rounded-full
                      border
                      border-[#112F50]/[0.07]
                      bg-white
                      px-3
                      py-1.5
                      text-[8px]
                      font-bold
                      text-[#6E7883]
                    "
                  >
                    {MAP_LAT}, {MAP_LNG}
                  </span>

                  <a
                    href={GOOGLE_MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      group
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-full
                      bg-[#112F50]
                      px-3
                      py-1.5
                      text-[8px]
                      font-black
                      text-white
                      transition-all
                      duration-300
                      hover:-translate-y-0.5
                      hover:bg-[#183E62]
                    "
                  >
                    مسیریابی

                    <Navigation
                      aria-hidden="true"
                      className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      strokeWidth={1.9}
                    />
                  </a>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div
                  className="
                    rounded-[18px]
                    border
                    border-[#112F50]/[0.06]
                    bg-[#112F50]/[0.025]
                    p-4
                  "
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#112F50]/[0.05] text-[#B79464]">
                      <MapPin
                        aria-hidden="true"
                        className="h-3.5 w-3.5"
                      />
                    </span>

                    <span className="text-[8px] font-black text-[#8D96A0]">
                      شهر
                    </span>
                  </div>

                  <p className="mt-2 text-[12px] font-black text-[#112F50]">
                    {BUSINESS.city}
                  </p>
                </div>

                <div
                  className="
                    rounded-[18px]
                    border
                    border-[#112F50]/[0.06]
                    bg-[#112F50]/[0.025]
                    p-4
                  "
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#B79464]/[0.08] text-[#B79464]">
                      <Sparkles
                        aria-hidden="true"
                        className="h-3.5 w-3.5"
                        strokeWidth={1.8}
                      />
                    </span>

                    <span className="text-[8px] font-black text-[#8D96A0]">
                      موقعیت
                    </span>
                  </div>

                  <p className="mt-2 text-[12px] font-black text-[#112F50]">
                    {BUSINESS.area}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CHANNELS */}
          <section
            className="
              relative
              overflow-hidden
              rounded-[30px]
              bg-[#0B1B2A]
              p-5
              shadow-[0_20px_55px_rgba(17,47,80,0.13)]
              sm:p-7
              lg:p-8
            "
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
            >
              <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#B79464]/[0.10] blur-3xl" />

              <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-[#31567D]/[0.10] blur-3xl" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#B79464]" />
              </div>

              <h2 className="mt-4 text-[22px] font-black leading-8 text-white sm:text-[27px]">
                راه‌های دیگر
                <span className="text-[#D8BC8D]">
                  {' '}
                  ارتباط با ما
                </span>
              </h2>

              <p className="mt-2 max-w-[440px] text-[10px] font-medium leading-6 text-white/40 sm:text-[11px] sm:leading-7">
                برای دریافت اطلاعات بیشتر از طریق ایمیل
                یا شبکه‌های اجتماعی نیز می‌توانید با ما
                در ارتباط باشید.
              </p>

              <div className="mt-6 space-y-3">
                {contactChannels.map((item) => {
                  const Icon = item.icon

                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      className="
                        group
                        flex
                        items-center
                        gap-3
                        rounded-[19px]
                        border
                        border-white/[0.08]
                        bg-white/[0.035]
                        p-3.5
                        transition-all
                        duration-300
                        hover:-translate-y-0.5
                        hover:border-[#B79464]/25
                        hover:bg-white/[0.06]
                      "
                    >
                      <span
                        className="
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-[12px]
                          border
                          border-[#D8BC8D]/15
                          bg-[#B79464]/[0.08]
                          text-[#D8BC8D]
                        "
                      >
                        <Icon
                          aria-hidden="true"
                          className="h-4 w-4"
                          strokeWidth={1.7}
                        />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block text-[8px] font-bold text-white/30">
                          {item.label}
                        </span>

                        <span
                          dir="ltr"
                          className="mt-1 block truncate text-[11px] font-black text-white/80 sm:text-[12px]"
                        >
                          {item.value}
                        </span>
                      </span>

                      <ArrowLeft
                        aria-hidden="true"
                        className="
                          h-3.5
                          w-3.5
                          shrink-0
                          text-white/20
                          transition-transform
                          duration-300
                          group-hover:-translate-x-1
                          group-hover:text-[#D8BC8D]
                        "
                        strokeWidth={1.8}
                      />
                    </a>
                  )
                })}
              </div>

              <div className="mt-7">
                <div className="mb-3 text-[8px] font-black uppercase tracking-[0.2em] text-white/25">
                  Social
                </div>

                <div className="flex gap-2">
                  {socialItems.map((item) => {
                    const Icon = item.icon

                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={item.label}
                        className="
                          group
                          flex
                          h-11
                          w-11
                          items-center
                          justify-center
                          rounded-[13px]
                          border
                          border-white/[0.09]
                          bg-white/[0.035]
                          text-white/65
                          transition-all
                          duration-300
                          hover:-translate-y-0.5
                          hover:border-[#B79464]/35
                          hover:bg-[#B79464]
                          hover:text-[#0B1B2A]
                        "
                      >
                        <Icon
                          aria-hidden="true"
                          className="h-4 w-4 transition-transform duration-300 group-hover:scale-105"
                          strokeWidth={1.7}
                        />
                      </a>
                    )
                  })}
                </div>
              </div>

              <div className="mt-7 flex items-center justify-between gap-3 border-t border-white/[0.08] pt-5">
              </div>
            </div>
          </section>
        </section>

        {/* =========================================================
            MAP
        ========================================================== */}
        <section
          className="
            relative
            mt-5
            overflow-hidden
            rounded-[30px]
            border
            border-[#D7E0E7]
            bg-white
            shadow-[0_14px_45px_rgba(17,47,80,0.055)]
            sm:mt-6
          "
        >
          <div className="flex flex-col gap-4 border-b border-[#112F50]/[0.07] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-6 lg:px-8">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#B79464]" />
              </div>

              <h2 className="mt-2.5 text-[19px] font-black text-[#112F50] sm:text-[23px]">
                موقعیت دقیق دفتر فروش
              </h2>

              <p className="mt-1.5 text-[9px] font-medium text-[#7B8590] sm:text-[10px]">
                {OFFICE_ADDRESS}
              </p>
            </div>

            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="
                group
                inline-flex
                min-h-10
                shrink-0
                items-center
                justify-center
                gap-2
                rounded-full
                border
                border-[#112F50]/[0.08]
                bg-[#112F50]
                px-4
                text-[9px]
                font-black
                text-white
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-[#183E62]
                sm:px-5
              "
            >
              باز کردن در گوگل مپ

              <Navigation
                aria-hidden="true"
                className="
                  h-3.5
                  w-3.5
                  transition-transform
                  duration-300
                  group-hover:translate-x-0.5
                  group-hover:-translate-y-0.5
                "
                strokeWidth={1.9}
              />
            </a>
          </div>

          <div className="relative h-[330px] overflow-hidden sm:h-[400px] lg:h-[500px]">
            <iframe
              src={MAP_EMBED_URL}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="لوکیشن دفتر فروش سرای سنگ در اصفهان"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06111C]/[0.13] via-transparent to-transparent"
            />

            <div className="pointer-events-none absolute bottom-4 right-4 max-w-[280px] rounded-[17px] border border-white/[0.12] bg-[#0B1B2A]/78 px-3.5 py-3 shadow-[0_14px_35px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:bottom-5 sm:right-5">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#B79464]/[0.14] text-[#D8BC8D]">
                  <MapPin
                    aria-hidden="true"
                    className="h-3.5 w-3.5"
                  />
                </span>

                <div>
                  <span className="block text-[7px] font-bold text-white/35">
                    دفتر فروش
                  </span>

                  <span className="mt-0.5 block text-[9px] font-black leading-5 text-white">
                    {BUSINESS.building}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            FINAL CTA
        ========================================================== */}
        <section
          className="
            relative
            mt-5
            overflow-hidden
            rounded-[30px]
            bg-[#112F50]
            shadow-[0_20px_50px_rgba(17,47,80,0.12)]
            sm:mt-6
          "
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute -left-16 -top-20 h-48 w-48 rounded-full bg-[#B79464]/[0.10] blur-3xl" />

            <div className="absolute -right-20 -bottom-20 h-52 w-52 rounded-full bg-white/[0.04] blur-3xl" />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.04),transparent_42%)]" />
          </div>

          <div className="relative z-10 px-5 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>

                <h2 className="mt-2 text-[19px] font-black text-white sm:text-[24px]">
                  برای استعلام قیمت، مستقیم تماس بگیرید.
                </h2>

                <p className="mt-1.5 text-[9px] font-medium leading-6 text-white/35 sm:text-[10px]">
                  کارشناسان فروش سرای سنگ آماده پاسخ‌گویی
                  و راهنمایی شما هستند.
                </p>
              </div>

              <a
                href={`tel:${CONTACT.phone}`}
                className="
                  group
                  inline-flex
                  min-h-[47px]
                  shrink-0
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  bg-[#D3B17A]
                  px-6
                  text-[10px]
                  font-black
                  text-[#0B1B2A]
                  shadow-[0_12px_28px_rgba(183,148,100,0.17)]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-[#E0C596]
                  sm:text-[11px]
                "
              >
                تماس با سرای سنگ

                <Phone
                  aria-hidden="true"
                  className="
                    h-4
                    w-4
                    transition-transform
                    duration-300
                    group-hover:rotate-[-8deg]
                  "
                  strokeWidth={1.9}
                />
              </a>
            </div>
          </div>
        </section>

        {/* =========================================================
            FOOT NOTE
        ========================================================== */}
        <div className="mt-5 flex flex-col items-center justify-center gap-1.5 text-center sm:mt-6">

          <span className="text-[8px] font-medium text-[#9AA3AD]">
            دفتر فروش اصفهان · ارتباط مستقیم با تیم سرای سنگ
          </span>
        </div>
      </Container>
    </div>
  )
}