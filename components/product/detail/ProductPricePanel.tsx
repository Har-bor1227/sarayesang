import {
  Check,
  CircleDollarSign,
} from 'lucide-react'

import { formatPrice } from '@/lib/format'

type ProductPricePanelProps = {
  price?: string | null
  regularPrice?: string | null
  onSale?: boolean | null
}

export default function ProductPricePanel({
  price,
  regularPrice,
  onSale,
}: ProductPricePanelProps) {
  if (!price) {
    return (
      <div
        className="
          mt-7
          overflow-hidden
          rounded-[24px]
          border
          border-[#B79464]/15
          bg-[#FBF8F2]
          p-5
          sm:p-6
        "
      >
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[#F1E6D5]
              text-[#9E7D4F]
            "
          >
            <CircleDollarSign className="h-5 w-5" />
          </div>

          <div>
            <span
              className="
                block
                text-[9px]
                font-black
                text-[#112F50]
              "
            >
              قیمت و شرایط سفارش
            </span>

            <p
              className="
                mt-1
                text-[9px]
                font-medium
                leading-6
                text-[#727C85]
              "
            >
              برای دریافت قیمت روز و
              وضعیت موجودی با کارشناسان
              سرای سنگ هماهنگ کنید.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="
        mt-7
        overflow-hidden
        rounded-[26px]
        border
        border-[#B79464]/20
        bg-[linear-gradient(135deg,#FCFAF5_0%,#F7F2E9_100%)]
        shadow-[0_18px_45px_rgba(183,148,100,0.08)]
      "
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <span
              className="
                block
                text-[8px]
                font-black
                uppercase
                tracking-[0.17em]
                text-[#A38354]
                sm:text-[9px]
              "
            >
              Current Price
            </span>

            <p
              className="
                mt-2
                text-[10px]
                font-bold
                text-[#69737E]
              "
            >
              قیمت محصول
            </p>

            <div
              className="
                mt-1
                flex
                flex-wrap
                items-end
                gap-3
              "
            >
              <span
                className="
                  text-[27px]
                  font-black
                  leading-none
                  tracking-[-0.04em]
                  text-[#112F50]
                  sm:text-[34px]
                "
              >
                {formatPrice(price)}
              </span>

              <span
                className="
                  pb-0.5
                  text-[10px]
                  font-bold
                  text-[#7A838D]
                "
              >
                تومان
              </span>

              {onSale &&
                regularPrice && (
                  <span
                    className="
                      pb-0.5
                      text-[11px]
                      font-semibold
                      text-[#7A838D]/50
                      line-through
                    "
                  >
                    {formatPrice(
                      regularPrice,
                    )}
                  </span>
                )}
            </div>
          </div>

          <div
            className="
              shrink-0
              rounded-full
              bg-[#112F50]
              px-3
              py-2
              text-[8px]
              font-black
              text-white
              shadow-[0_10px_25px_rgba(17,47,80,0.14)]
              sm:text-[9px]
            "
          >
            استعلام نهایی
          </div>
        </div>

        <div
          className="
            mt-5
            flex
            items-start
            gap-2.5
            rounded-[17px]
            border
            border-[#112F50]/[0.06]
            bg-white/60
            px-3.5
            py-3
          "
        >
          <Check
            aria-hidden="true"
            className="
              mt-0.5
              h-4
              w-4
              shrink-0
              text-[#B79464]
            "
          />

          <p
            className="
              text-[9px]
              font-medium
              leading-6
              text-[#68737D]
              sm:text-[10px]
            "
          >
            قیمت نمایش داده‌شده برای
            استعلام اولیه است؛ موجودی،
            قیمت نهایی و شرایط سفارش
            پیش از خرید با شما هماهنگ
            می‌شود.
          </p>
        </div>
      </div>
    </div>
  )
}