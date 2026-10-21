import {
  ArrowLeft,
  Phone,
} from 'lucide-react'

import { TEL_PHONE } from '@/lib/constants'

type ProductCTAProps = {
  productName: string
  telPhone?: string
}

export default function ProductCTA({
  productName,
  telPhone,
}: ProductCTAProps) {
  const phoneNumber =
    telPhone?.trim() ||
    TEL_PHONE.trim()

  return (
    <div>
      <a
        href={`tel:${phoneNumber}`}
        aria-label={`استعلام قیمت ${productName}`}
        className="
          group
          flex
          min-h-[58px]
          w-full
          items-center
          justify-between
          gap-4
          rounded-[16px]
          bg-[#112F50]
          px-4
          py-3
          text-white
          shadow-[0_16px_34px_rgba(17,47,80,0.16)]
          transition-all
          duration-250
          hover:-translate-y-0.5
          hover:bg-[#0A1929]
          hover:shadow-[0_20px_40px_rgba(17,47,80,0.2)]
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-[#B79464]/70
          focus-visible:ring-offset-2
          sm:min-h-[60px]
          sm:px-5
        "
      >
        <span className="flex min-w-0 items-center gap-3">
          <span
            aria-hidden="true"
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-[12px]
              bg-white/[0.09]
              text-[#DCC39D]
            "
          >
            <Phone className="h-4 w-4" />
          </span>

          <span
            className="
              min-w-0
              text-[13px]
              font-black
              sm:text-[14px]
            "
          >
            استعلام قیمت
          </span>
        </span>

        <span
          aria-hidden="true"
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-[#B79464]
            text-white
            transition-transform
            duration-250
            group-hover:-translate-x-1
          "
        >
          <ArrowLeft className="h-4 w-4" />
        </span>
      </a>
    </div>
  )
}