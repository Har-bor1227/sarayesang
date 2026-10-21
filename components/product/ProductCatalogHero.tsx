import Link from 'next/link'
import { ArrowLeft, Search, Sparkles } from 'lucide-react'

import { SITE_NAME } from '@/lib/constants'

interface ProductCatalogHeroProps {
  query: string
  total: number
}

export default function ProductCatalogHero({
  query,
  total,
}: ProductCatalogHeroProps) {
  return (
    <section
      className="
        relative
        isolate
        overflow-hidden
        rounded-[30px]
        border
        border-[#203E5B]
        bg-[#0E2945]
        px-5
        py-6
        shadow-[0_24px_70px_rgba(10,25,41,0.14)]
        sm:rounded-[36px]
        sm:px-7
        sm:py-8
        lg:px-10
        lg:py-10
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-24
          -top-28
          h-72
          w-72
          rounded-full
          bg-[#B79464]/[0.14]
          blur-3xl
        "
      />
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -bottom-28
          left-[-5rem]
          h-80
          w-80
          rounded-full
          bg-[#5B7EA2]/[0.10]
          blur-3xl
        "
      />
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.10]
          [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)]
          [background-size:38px_38px]
          [mask-image:linear-gradient(to_bottom,black,transparent_88%)]
        "
      />

      <div className="relative grid gap-7 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-end lg:gap-10">
        <div className="min-w-0">
          <div className="mb-5 flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#B79464]/30 bg-[#B79464]/[0.10] text-[#D7BA8E]">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            </span>

            <span className="text-[9px] font-black uppercase tracking-[0.22em] text-[#D7BA8E] sm:text-[10px]">
              {SITE_NAME} / Stone Collection
            </span>
          </div>

          <h1 className="max-w-[840px] text-[31px] font-black leading-[1.35] tracking-[-0.045em] text-white sm:text-[42px] lg:text-[54px]">
            {query ? (
              <>
                نتایج جستجوی
                <span className="mr-2 text-[#D5B684]">
                  «{query}»
                </span>
              </>
            ) : (
              <>
                مجموعه
                <span className="mr-2 text-[#D5B684]">
                  سنگ‌های سرای سنگ
                </span>
              </>
            )}
          </h1>

          <p className="mt-4 max-w-[720px] text-[12px] font-medium leading-8 text-white/65 sm:text-[13px] lg:text-[14px]">
            سنگ مناسب پروژه را سریع‌تر پیدا کنید؛ از جستجو و دسته‌بندی تا
            فیلتر بر اساس نوع، رنگ، کاربرد و پرداخت.
          </p>

          <form action="/products" method="get" className="mt-6">
            <div className="flex flex-col gap-2 rounded-[22px] border border-white/10 bg-white/[0.07] p-2 backdrop-blur-xl sm:flex-row">
              <label className="relative min-w-0 flex-1">
                <Search
                  className="pointer-events-none absolute right-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[#667085]"
                  aria-hidden="true"
                />

                <input
                  type="search"
                  name="q"
                  defaultValue={query}
                  placeholder="نام سنگ، نوع سنگ یا محصول را جستجو کنید..."
                  autoComplete="off"
                  className="
                    h-14
                    w-full
                    rounded-[16px]
                    border
                    border-transparent
                    bg-white
                    pr-12
                    pl-4
                    text-[12px]
                    font-bold
                    text-[#112F50]
                    outline-none
                    transition
                    placeholder:text-[#667085]/60
                    focus:border-[#B79464]/50
                    focus:ring-4
                    focus:ring-[#B79464]/[0.12]
                    sm:text-[13px]
                  "
                  aria-label="جستجوی محصولات"
                />
              </label>

              <button
                type="submit"
                className="
                  inline-flex
                  min-h-14
                  items-center
                  justify-center
                  gap-2
                  rounded-[16px]
                  bg-[#B79464]
                  px-6
                  text-[11px]
                  font-black
                  text-[#112F50]
                  shadow-[0_10px_28px_rgba(183,148,100,0.20)]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-[#C6A87E]
                  active:translate-y-0
                  sm:min-w-[126px]
                "
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                جستجو
              </button>

              {query && (
                <Link
                  href="/products"
                  className="
                    inline-flex
                    min-h-14
                    items-center
                    justify-center
                    rounded-[16px]
                    border
                    border-white/10
                    bg-white/[0.06]
                    px-5
                    text-[10px]
                    font-black
                    text-white/80
                    transition
                    hover:bg-white/[0.10]
                    hover:text-white
                    sm:min-w-[104px]
                  "
                >
                  حذف
                </Link>
              )}
            </div>
          </form>
        </div>

        <div
          className="
            hidden
            rounded-[26px]
            border
            border-white/10
            bg-white/[0.065]
            p-5
            backdrop-blur-xl
            lg:block
          "
        >
          <span className="block text-[9px] font-bold text-white/45">
            {query ? 'تعداد نتایج' : 'تعداد محصولات'}
          </span>

          <span className="mt-2 block text-[38px] font-black leading-none tracking-[-0.05em] text-white">
            {total.toLocaleString('fa-IR')}
          </span>

          <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
            <span className="text-[8px] font-bold text-white/45">
              کاتالوگ
            </span>
            <ArrowLeft className="h-3.5 w-3.5 text-[#D5B684]" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  )
}
