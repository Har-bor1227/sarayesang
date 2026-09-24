import {
  ArrowLeft,
  Phone,
} from 'lucide-react'

type ProductCTAProps = {
  productName: string
  telPhone: string
}

export default function ProductCTA({
  productName,
  telPhone,
}: ProductCTAProps) {
  return (
    <div className="mt-8">
      <a
        href={`tel:${telPhone}`}
        aria-label={`تماس برای استعلام قیمت ${productName}`}
        className="
          group
          flex
          min-h-[58px]
          w-full
          items-center
          justify-between
          gap-4
          rounded-[19px]
          bg-[#112F50]
          px-5
          py-3
          text-white
          shadow-[0_18px_40px_rgba(17,47,80,0.18)]
          transition-all
          duration-300
          hover:-translate-y-0.5
          hover:bg-[#0A1929]
          hover:shadow-[0_22px_48px_rgba(17,47,80,0.22)]
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-[#B79464]
          focus-visible:ring-offset-2
        "
      >
        <span className="flex min-w-0 items-center gap-3">
          <span
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-white/[0.08]
            "
          >
            <Phone className="h-4.5 w-4.5" />
          </span>

          <span className="min-w-0">
            <span
              className="
                block
                text-[12px]
                font-black
                sm:text-[13px]
              "
            >
              تماس برای استعلام قیمت
            </span>

            <span
              className="
                mt-0.5
                block
                text-[8px]
                font-medium
                text-white/55
                sm:text-[9px]
              "
            >
              موجودی و شرایط سفارش را
              هماهنگ کنید
            </span>
          </span>
        </span>

        <span
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-[#B79464]
            transition-transform
            duration-300
            group-hover:-translate-x-1
          "
        >
          <ArrowLeft className="h-4 w-4" />
        </span>
      </a>

      <div
        className="
          mt-3
          flex
          items-center
          justify-center
          gap-2
          text-center
          text-[8px]
          font-medium
          leading-5
          text-[#7A838D]
          sm:text-[9px]
        "
      >
        <span
          className="
            h-1.5
            w-1.5
            rounded-full
            bg-[#B79464]
          "
        />

        کارشناسان سرای سنگ پاسخگوی شما
        هستند.
      </div>
    </div>
  )
}