import Container from '@/components/ui/container'

import {
  Phone,
  ShieldCheck,
  Tag,
} from 'lucide-react'

const trustItems = [
  {
    icon: ShieldCheck,
    eyebrow: 'QUALITY',
    title: 'کیفیت تضمین‌شده',
    description: 'انتخاب از میان سنگ‌های معتبر و باکیفیت',
  },
  {
    icon: Phone,
    eyebrow: 'CONSULTATION',
    title: 'مشاوره تخصصی',
    description: 'پاسخ‌گویی و راهنمایی برای انتخاب بهتر',
  },
  {
    icon: Tag,
    eyebrow: 'VALUE',
    title: 'قیمت رقابتی',
    description: 'ارائه قیمت متناسب با نیاز پروژه شما',
  },
]

export default function TrustStrip() {
  return (
    <section
      className="w-full bg-[#FCFCFB] pb-16 pt-5 sm:pb-20 sm:pt-7 lg:pb-24"
      dir="rtl"
      aria-label="مزایای همکاری با سرای سنگ"
    >
      <Container>
        <div className="overflow-hidden rounded-[28px] bg-[#0A1929] shadow-[0_18px_50px_rgba(10,25,41,0.12)]">
          {/* =========================================================
              TOP BRAND LINE
          ========================================================== */}
          <div className="flex items-center gap-3 border-b border-white/[0.08] px-5 py-4 sm:px-7 lg:px-9">
            <span className="h-px w-7 bg-[#B79464] sm:w-10" />

            <span className="text-[8px] font-black uppercase tracking-[0.24em] text-[#B79464] sm:text-[9px]">
              Why Saraye Sang
            </span>

            <span className="h-px flex-1 bg-white/[0.08]" />

            <span className="hidden text-[8px] font-medium tracking-[0.16em] text-white/35 sm:block">
              SARAYE SANG
            </span>
          </div>

          {/* =========================================================
              TRUST ITEMS
          ========================================================== */}
          <div className="grid sm:grid-cols-3">
            {trustItems.map((item, index) => {
              const Icon = item.icon

              return (
                <div
                  key={item.title}
                  className={[
                    'group relative flex min-w-0 items-center gap-4 px-5 py-5 sm:px-6 sm:py-7 lg:px-8',
                    index > 0
                      ? 'border-t border-white/[0.08] sm:border-t-0 sm:border-r sm:border-white/[0.08]'
                      : '',
                  ].join(' ')}
                >
                  {/* GOLD ACCENT */}
                  <span className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#B79464]/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* ICON */}
                  <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] border border-[#B79464]/20 bg-[#B79464]/[0.09] text-[#D4B27D] transition-all duration-300 group-hover:border-[#B79464]/40 group-hover:bg-[#B79464]/[0.14] sm:h-12 sm:w-12">
                    <Icon className="h-[19px] w-[19px] stroke-[1.6] sm:h-5 sm:w-5" />

                    <span className="absolute -bottom-1 -left-1 h-2 w-2 rounded-full border-2 border-[#0A1929] bg-[#B79464]" />
                  </div>

                  {/* CONTENT */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 text-[7px] font-black uppercase tracking-[0.18em] text-[#B79464]/75 sm:text-[8px]">
                      {item.eyebrow}
                    </div>

                    <h3 className="truncate text-[13px] font-black text-white sm:text-[14px]">
                      {item.title}
                    </h3>

                    <p className="mt-1 line-clamp-2 text-[9px] font-medium leading-5 text-white/45 sm:text-[10px] sm:leading-6">
                      {item.description}
                    </p>
                  </div>

                  {/* INDEX */}
                  <span className="hidden self-start pt-0.5 text-[9px] font-black tracking-[0.18em] text-white/15 lg:block">
                    0{index + 1}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}