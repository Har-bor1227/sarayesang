import Image from 'next/image'
import Link from 'next/link'

import {
  ArrowLeft,
  Award,
  Factory,
  Gem,
  Headset,
  Ruler,
  ShieldCheck,
  Users,
} from 'lucide-react'

const COLORS = {
  navy: '#112F50',
  navyDark: '#0A1929',
  gold: '#B79464',
  goldLight: '#D8B883',
  text: '#112F50',
  muted: '#667085',
  cream: '#FCFCFB',
  border: '#E9ECEF',
  white: '#FFFFFF',
} as const

const values = [
  {
    title: 'کیفیت',
    description:
      'در انتخاب و ارائه محصولات، کیفیت و اصالت سنگ همیشه برای ما در اولویت قرار دارد.',
    icon: Gem,
  },
  {
    title: 'اعتماد',
    description:
      'شفافیت در همکاری و احترام به مشتری، پایه اصلی ارتباط ماندگار ما با شماست.',
    icon: ShieldCheck,
    featured: true,
  },
  {
    title: 'تخصص',
    description:
      'تجربه و شناخت دقیق بازار به ما کمک می‌کند انتخابی مطمئن و متناسب با پروژه داشته باشید.',
    icon: Award,
  },
  {
    title: 'تعهد',
    description:
      'از اولین مشاوره تا تحویل نهایی، همراه شما می‌مانیم تا تجربه‌ای حرفه‌ای داشته باشید.',
    icon: Users,
  },
]

const benefits = [
  {
    value: '+10000',
    label: 'کیلو بار',
    icon: Factory,
    tone: 'gold' as const,
    eyebrow: 'ظرفیت همکاری',
  },
  {
    value: '+500',
    label: 'پروژه موفق',
    icon: Ruler,
    tone: 'navy' as const,
    eyebrow: 'سابقه اجرا',
  },
  {
    value: '+12',
    label: 'سال تجربه',
    icon: Award,
    tone: 'gold' as const,
    eyebrow: 'تجربه تخصصی',
  },
  {
    value: '+100',
    label: 'همکار حرفه‌ای',
    icon: Users,
    tone: 'navy' as const,
    eyebrow: 'شبکه همکاری',
  },
  {
    value: '+20',
    label: 'نوع خدمات',
    icon: Headset,
    tone: 'gold' as const,
    eyebrow: 'خدمات تخصصی',
  },
]

function SectionContainer({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-8 xl:px-10 ${className}`}
    >
      {children}
    </div>
  )
}

function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
}: {
  eyebrow: string
  title: React.ReactNode
  description: string
  align?: 'center' | 'right'
}) {
  const centered = align === 'center'

  return (
    <div
      className={[
        centered
          ? 'mx-auto max-w-[760px] text-center'
          : 'max-w-[760px] text-right',
      ].join(' ')}
    >
      <div
        className={[
          'mb-4 flex items-center gap-3',
          centered
            ? 'justify-center'
            : 'justify-start',
        ].join(' ')}
      >
        <span className="h-px w-8 bg-[#B79464] sm:w-10" />

        <span className="text-[8px] font-black uppercase tracking-[0.24em] text-[#B79464] sm:text-[9px]">
          {eyebrow}
        </span>
      </div>

      <h2 className="text-[28px] font-black leading-[1.5] tracking-[-0.035em] text-[#112F50] sm:text-[34px] sm:leading-[1.42] lg:text-[42px]">
        {title}
      </h2>

      <p
        className={[
          'mt-3 text-[11px] font-medium leading-7 text-[#667085] sm:text-[13px] sm:leading-8',
          centered
            ? 'mx-auto max-w-[620px]'
            : 'max-w-[620px]',
        ].join(' ')}
      >
        {description}
      </p>
    </div>
  )
}

function BodyCopy({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <p className="text-[12px] font-medium leading-[2.05] text-[#667085] sm:text-[14px] sm:leading-[2.15] lg:text-[15px]">
      {children}
    </p>
  )
}

function ImageFrame({
  src,
  alt,
  aspect = 'aspect-[1.25/1]',
  priority = false,
}: {
  src: string
  alt: string
  aspect?: string
  priority?: boolean
}) {
  return (
    <div className="relative overflow-hidden rounded-[26px] bg-[#E9ECEF]">
      <div className={`group relative w-full ${aspect}`}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 1023px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
        />

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,25,41,0.02),transparent_55%,rgba(10,25,41,0.14))]" />

        <span className="pointer-events-none absolute right-4 top-4 rounded-full border border-white/20 bg-[#0A1929]/20 px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.18em] text-white backdrop-blur-md">
          Saraye Sang
        </span>
      </div>
    </div>
  )
}

export function AboutHero() {
  return (
    <section
      className="relative w-full overflow-hidden bg-[#0A1929]"
      aria-labelledby="about-hero-title"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-40 -top-32 h-[420px] w-[420px] rounded-full bg-[#B79464]/[0.08] blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[480px] w-[480px] rounded-full bg-white/[0.04] blur-3xl" />
      </div>

      <SectionContainer className="relative">
        <div className="grid min-h-[500px] items-center gap-10 py-14 sm:min-h-[560px] sm:py-16 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14 lg:py-20">
          <div className="order-2 max-w-[700px] text-right lg:order-1">
            <div className="mb-5 flex items-center justify-start gap-3">
              <span className="h-px w-9 bg-[#B79464] sm:w-12" />

              <span className="text-[8px] font-black uppercase tracking-[0.24em] text-[#B79464] sm:text-[9px]">
                About Saraye Sang
              </span>
            </div>

            <h1
              id="about-hero-title"
              className="text-[31px] font-black leading-[1.5] tracking-[-0.04em] text-white sm:text-[40px] lg:text-[54px] lg:leading-[1.4]"
            >
              سنگ، فقط یک متریال نیست؛
              <span className="mt-1 block text-[#D8B883]">
                بخشی از هویت معماری است.
              </span>
            </h1>

            <p className="mt-5 max-w-[680px] text-[11px] font-medium leading-7 text-white/62 sm:text-[13px] sm:leading-8 lg:text-[14px]">
              اینجا با مجموعه‌ای از تجربه، تخصص و شناخت دقیق بازار سنگ در کنار شما
              هستیم؛ تا برای هر پروژه، انتخابی مطمئن، باکیفیت و متناسب با نیازتان
              داشته باشید.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-start sm:gap-4">
              <Link
                href={`tel:${process.env.NEXT_PUBLIC_TEL ?? ''}`}
                className="group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#B79464] px-6 text-[10px] font-black text-[#0A1929] shadow-[0_12px_28px_rgba(183,148,100,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#D8B883] sm:min-w-[190px] sm:text-[11px]"
              >
                ارتباط مستقیم با ما

                <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              </Link>

              <Link
                href="/products"
                className="group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-6 text-[10px] font-black text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.10] sm:min-w-[190px] sm:text-[11px]"
              >
                مشاهده محصولات

                <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              </Link>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative mx-auto max-w-[620px]">
              <div className="absolute -inset-3 rounded-[30px] border border-[#B79464]/15 sm:-inset-4" />

              <div className="relative overflow-hidden rounded-[28px]">
                <div className="relative aspect-[1.12/1]">
                  <Image
                    src="/images/about-stone.jpg"
                    alt="دستگاه صنعتی فرآوری و برش سنگ در کارخانه"
                    fill
                    sizes="(max-width: 1023px) 100vw, 55vw"
                    priority
                    className="object-cover"
                  />

                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(10,25,41,0.42))]" />

                  <div className="absolute bottom-5 right-5 left-5 flex items-end justify-between gap-4 sm:bottom-6 sm:right-6 sm:left-6">
                    <div>
                      <span className="block text-[8px] font-black uppercase tracking-[0.18em] text-[#D8B883]">
                        Experience / Craft
                      </span>

                      <span className="mt-1 block text-[10px] font-bold text-white">
                        تجربه، تخصص، انتخاب دقیق
                      </span>
                    </div>

                    <span className="text-[30px] font-black leading-none text-white/15 sm:text-[42px]">
                      ۱۳۹۷
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>
    </section>
  )
}

export function AboutIntro() {
  return (
    <section
      className="w-full bg-[#FCFCFB] py-14 sm:py-18 lg:py-24"
      aria-labelledby="about-intro-title"
    >
      <SectionContainer>
        <SectionHeading
          eyebrow="Our Story"
          title={
            <>
              قصه ما از
              <span className="text-[#B79464]">
                {' '}
                یک انتخاب
              </span>{' '}
              درست شروع شد
            </>
          }
          description="تجربه‌ای که با شناخت سنگ شکل گرفت و امروز به یک مسیر حرفه‌ای برای انتخاب متریال تبدیل شده است."
        />

        <div className="mt-10 grid items-center gap-10 sm:mt-14 lg:grid-cols-[1fr_0.9fr] lg:gap-18">
          <div className="order-2 lg:order-1">
            <div className="space-y-5">
              <BodyCopy>
                مجموعه بازرگانی و کارخانجات سرای سنگ از سال ۱۳۹۷ فعالیت خود را با
                هدف تأمین، فرآوری و عرضه سنگ‌های ساختمانی باکیفیت آغاز کرده است.
                ما با تکیه بر تجربه، شناخت بازار و همکاری با مجموعه‌های معتبر،
                تلاش کرده‌ایم مسیر انتخاب و خرید سنگ را برای مشتریان ساده‌تر و
                مطمئن‌تر کنیم.
              </BodyCopy>

              <BodyCopy>
                فعالیت ما تنها به فروش سنگ محدود نمی‌شود؛ بلکه از مرحله مشاوره و
                انتخاب محصول تا بررسی نیاز پروژه و ارائه راهکار مناسب، در کنار
                شما هستیم. تنوع محصولات، کنترل کیفیت و توجه به جزئیات، بخش مهمی
                از رویکرد ما در ارائه خدمات حرفه‌ای است.
              </BodyCopy>

              <BodyCopy>
                امروز تلاش می‌کنیم با توسعه خدمات و ارتباط نزدیک‌تر با مشتریان،
                تجربه‌ای متفاوت و قابل اعتماد در حوزه سنگ‌های ساختمانی ایجاد
                کنیم؛ تجربه‌ای که بر پایه کیفیت، صداقت و تعهد شکل گرفته است.
              </BodyCopy>
            </div>

            <div className="mt-7 flex items-center gap-4">
              <span className="h-px w-10 bg-[#B79464]" />

              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#667085]">
                SARAYE SANG / SINCE 1397
              </span>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <ImageFrame
              src="/images/about-stone.jpg"
              alt="دستگاه صنعتی فرآوری و برش سنگ در کارخانه"
              aspect="aspect-[1.18/1]"
            />
          </div>
        </div>
      </SectionContainer>
    </section>
  )
}

export function ValuesSection() {
  return (
    <section
      className="w-full bg-white py-14 sm:py-18 lg:py-24"
      aria-labelledby="values-title"
    >
      <SectionContainer>
        <SectionHeading
          eyebrow="Our Principles"
          title={
            <>
              چیزهایی که برای ما
              <span className="text-[#B79464]">
                {' '}
                قابل مذاکره نیستند
              </span>
            </>
          }
          description="اصولی که کیفیت محصول، کیفیت همکاری و تجربه مشتری را در کنار هم شکل می‌دهند."
        />

        <div className="mt-10 grid gap-3 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {values.map((value, index) => {
            const Icon = value.icon

            return (
              <article
                key={value.title}
                className={[
                  'group relative overflow-hidden rounded-[24px] p-6 sm:min-h-[290px] sm:p-7',
                  value.featured
                    ? 'bg-[#112F50] text-white shadow-[0_18px_44px_rgba(17,47,80,0.15)]'
                    : 'border border-[#112F50]/[0.07] bg-[#FCFCFB] text-[#112F50]',
                ].join(' ')}
              >
                {value.featured && (
                  <div className="absolute inset-x-0 top-0 h-1 bg-[#B79464]" />
                )}

                <div className="flex items-start justify-between gap-4">
                  <div
                    className={[
                      'flex h-11 w-11 items-center justify-center rounded-[15px]',
                      value.featured
                        ? 'bg-[#B79464] text-[#0A1929]'
                        : 'bg-[#112F50] text-white',
                    ].join(' ')}
                  >
                    <Icon className="h-[19px] w-[19px]" />
                  </div>

                  <span
                    className={[
                      'text-[9px] font-black tracking-[0.18em]',
                      value.featured
                        ? 'text-white/25'
                        : 'text-[#112F50]/15',
                    ].join(' ')}
                  >
                    0{index + 1}
                  </span>
                </div>

                <div className="mt-12">
                  <h3
                    className={[
                      'text-[19px] font-black',
                      value.featured
                        ? 'text-white'
                        : 'text-[#112F50]',
                    ].join(' ')}
                  >
                    {value.title}
                  </h3>

                  <p
                    className={[
                      'mt-3 text-[10px] font-medium leading-[2] sm:text-[11px]',
                      value.featured
                        ? 'text-white/62'
                        : 'text-[#667085]',
                    ].join(' ')}
                  >
                    {value.description}
                  </p>
                </div>

                <div
                  className={[
                    'absolute bottom-0 left-0 h-px w-14 transition-all duration-500 group-hover:w-24',
                    value.featured
                      ? 'bg-[#B79464]'
                      : 'bg-[#B79464]',
                  ].join(' ')}
                />
              </article>
            )
          })}
        </div>
      </SectionContainer>
    </section>
  )
}

export function CollaborationSection() {
  return (
    <section
      className="w-full bg-[#FCFCFB] py-14 sm:py-18 lg:py-24"
      aria-labelledby="collaboration-title"
    >
      <SectionContainer>
        <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-18">
          <div>
            <ImageFrame
              src="/images/our-team.jpg"
              alt="عضو تیم سرای سنگ در محیط اداری"
              aspect="aspect-[1.08/1]"
            />
          </div>

          <div>
            <SectionHeading
              eyebrow="Collaboration"
              align="right"
              title={
                <>
                  در کنار شما،
                  <span className="text-[#B79464]">
                    {' '}
                    از انتخاب تا اجرا
                  </span>
                </>
              }
              description="برای ما هر پروژه یک همکاری ساده نیست؛ فرصتی است برای ساختن یک تجربه مطمئن و ارزشمند."
            />

            <div className="mt-7 space-y-5">
              <BodyCopy>
                مجموعه بازرگانی و کارخانجات سرای سنگ از سال ۱۳۹۷ با هدف ایجاد
                ارتباطی حرفه‌ای و ماندگار با مشتریان شکل گرفت. برای ما هر پروژه
                یک همکاری ساده نیست؛ بلکه فرصتی است برای ساختن یک تجربه مطمئن و
                ارزشمند.
              </BodyCopy>

              <BodyCopy>
                ما در مسیر انتخاب سنگ، بررسی ویژگی‌های فنی، هماهنگی خرید و ارائه
                خدمات، کنار شما هستیم تا بتوانید با اطلاعات دقیق‌تر و اطمینان
                بیشتر تصمیم بگیرید. تلاش ما این است که کیفیت محصول و کیفیت
                ارتباط با مشتری در یک سطح قرار داشته باشد.
              </BodyCopy>

              <BodyCopy>
                از پروژه‌های کوچک تا مجموعه‌های بزرگ، هدف ما ارائه راهکاری
                متناسب با نیاز شماست؛ راهکاری که بر پایه تجربه، مسئولیت‌پذیری،
                سرعت عمل و شناخت واقعی از بازار سنگ شکل می‌گیرد.
              </BodyCopy>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                'مشاوره تخصصی',
                'انتخاب متریال',
                'همراهی پروژه',
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[18px] border border-[#112F50]/[0.07] bg-white px-4 py-4"
                >
                  <span className="mb-2 block h-1.5 w-1.5 rounded-full bg-[#B79464]" />

                  <span className="text-[9px] font-black text-[#112F50] sm:text-[10px]">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionContainer>
    </section>
  )
}

function BenefitCard({
  benefit,
}: {
  benefit: (typeof benefits)[number]
}) {
  const isGold = benefit.tone === 'gold'

  return (
    <article
      className={[
        'group relative overflow-hidden rounded-[22px] p-5 transition-all duration-400 hover:-translate-y-1',
        isGold
          ? 'bg-[#B79464] text-[#0A1929] shadow-[0_16px_35px_rgba(183,148,100,0.16)]'
          : 'bg-[#112F50] text-white shadow-[0_16px_35px_rgba(17,47,80,0.16)]',
      ].join(' ')}
    >
      <div
        className={[
          'pointer-events-none absolute -left-10 -top-10 h-24 w-24 rounded-full blur-2xl',
          isGold
            ? 'bg-white/20'
            : 'bg-white/[0.07]',
        ].join(' ')}
      />

      <div className="relative z-10 flex h-[170px] flex-col">
        <div className="flex items-start justify-between gap-3">
          <span
            className={[
              'text-[8px] font-black uppercase tracking-[0.18em]',
              isGold
                ? 'text-[#0A1929]/55'
                : 'text-white/40',
            ].join(' ')}
          >
            {benefit.eyebrow}
          </span>

          <div
            className={[
              'flex h-9 w-9 items-center justify-center rounded-[12px]',
              isGold
                ? 'bg-[#0A1929]/[0.06]'
                : 'bg-white/[0.07]',
            ].join(' ')}
          >
            <benefit.icon
              className="h-[17px] w-[17px]"
              strokeWidth={1.8}
            />
          </div>
        </div>

        <div className="mt-auto">
          <div className="text-[30px] font-black leading-none tracking-[-0.04em] sm:text-[33px]">
            {benefit.value}
          </div>

          <div
            className={[
              'mt-2 text-[9px] font-bold',
              isGold
                ? 'text-[#0A1929]/65'
                : 'text-white/55',
            ].join(' ')}
          >
            {benefit.label}
          </div>
        </div>
      </div>
    </article>
  )
}

export function WhyUsSection() {
  return (
    <section
      className="w-full bg-[#0A1929] py-14 sm:py-18 lg:py-24"
      aria-labelledby="why-us-title"
    >
      <SectionContainer>
        <div className="grid items-end gap-8 lg:grid-cols-[0.6fr_1.4fr] lg:gap-16">
          <div className="order-2 lg:order-1">
            <div className="hidden border-r border-[#B79464]/30 pr-5 lg:block">
              <span className="text-[8px] font-black uppercase tracking-[0.24em] text-[#B79464]">
                Trust / Experience / Detail
              </span>

              <p className="mt-4 max-w-[260px] text-[10px] font-medium leading-6 text-white/38">
                کیفیت محصول زمانی ارزشمند است که در تمام مسیر همکاری نیز
                تجربه‌ای حرفه‌ای و قابل اعتماد شکل بگیرد.
              </p>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-[#B79464] sm:w-10" />

              <span className="text-[8px] font-black uppercase tracking-[0.24em] text-[#B79464] sm:text-[9px]">
                Why Saraye Sang
              </span>
            </div>

            <h2
              id="why-us-title"
              className="text-[28px] font-black leading-[1.5] tracking-[-0.035em] text-white sm:text-[35px] sm:leading-[1.42] lg:text-[42px]"
            >
              چرا
              <span className="text-[#D8B883]">
                {' '}
                سرای سنگ؟
              </span>
            </h2>

            <p className="mt-3 max-w-[650px] text-[11px] font-medium leading-7 text-white/48 sm:text-[13px] sm:leading-8">
              تجربه، تخصص و تعهدی که تفاوت را برای شما می‌سازد.
            </p>
          </div>
        </div>

        <div className="mt-9 grid grid-cols-2 gap-3 sm:mt-12 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {benefits.map((benefit) => (
            <BenefitCard
              key={`${benefit.value}-${benefit.label}`}
              benefit={benefit}
            />
          ))}
        </div>

        <div className="mt-8 flex items-center gap-4 sm:mt-10">
          <span className="h-px flex-1 bg-white/[0.08]" />

          <span className="text-[8px] font-black tracking-[0.24em] text-white/25 sm:text-[9px]">
            SARAYE SANG / SINCE 1397
          </span>

          <span className="h-px flex-1 bg-white/[0.08]" />
        </div>
      </SectionContainer>
    </section>
  )
}