import Link from 'next/link'
import {
  CheckCircle2,
  Gem,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'

import ProductCTA from './ProductCTA'
import ProductPricePanel from './ProductPricePanel'
import ProductSpecs from './ProductSpecs'
import ProductTechnicalData from './ProductTechnicalData'

import type {
  ProductDetailAcf,
  ProductDetailAttribute,
  ProductDetailCategory,
} from './types'

type ProductInfoProps = {
  productName: string
  categories: ProductDetailCategory[]
  shortDescription?: string
  price?: string | null
  regularPrice?: string | null
  onSale?: boolean | null
  acf?: ProductDetailAcf | null
  attributes: ProductDetailAttribute[]
}

const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    title: 'مشاوره پیش از خرید',
    text: 'انتخاب مناسب برای پروژه',
  },
  {
    icon: CheckCircle2,
    title: 'بررسی موجودی',
    text: 'هماهنگی قبل از سفارش',
  },
  {
    icon: Gem,
    title: 'اطلاعات محصول',
    text: 'مشخصات و تصاویر واقعی',
  },
]

export default function ProductInfo({
  productName,
  categories,
  shortDescription,
  price,
  regularPrice,
  onSale,
  acf,
  attributes,
}: ProductInfoProps) {
  return (
    <div className="min-w-0">
      <div
        className="
          relative
          overflow-hidden
          rounded-[30px]
          border
          border-[#112F50]/[0.07]
          bg-white
          p-5
          shadow-[0_22px_60px_rgba(10,25,41,0.05)]
          sm:rounded-[34px]
          sm:p-7
          lg:p-8
          xl:p-9
        "
      >
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-24
            -top-24
            h-56
            w-56
            rounded-full
            bg-[#B79464]/[0.08]
            blur-3xl
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            bottom-0
            left-0
            h-44
            w-44
            rounded-full
            bg-[#112F50]/[0.035]
            blur-3xl
          "
        />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="
                h-px
                w-10
                bg-[#B79464]
                sm:w-12
              "
            />

            <span
              className="
                text-[8px]
                font-black
                uppercase
                tracking-[0.24em]
                text-[#B79464]
                sm:text-[9px]
              "
            >
              Natural Stone Collection
            </span>
          </div>

          {categories.length > 0 && (
            <div
              className="
                mt-5
                flex
                flex-wrap
                gap-2
              "
            >
              {categories.map(
                (category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="outline-none"
                  >
                    <Badge
                      variant="outline"
                      className="
                        rounded-full
                        border-[#B79464]/25
                        bg-[#FBF8F2]
                        px-3
                        py-1.5
                        text-[9px]
                        font-black
                        text-[#95774D]
                        transition-all
                        duration-300
                        hover:border-[#B79464]
                        hover:bg-[#B79464]
                        hover:text-white
                        focus-visible:ring-2
                        focus-visible:ring-[#B79464]/40
                        focus-visible:ring-offset-2
                        sm:text-[10px]
                      "
                    >
                      {category.name}
                    </Badge>
                  </Link>
                ),
              )}
            </div>
          )}

          <div className="mt-5">
            <h1
              className="
                max-w-[780px]
                text-[32px]
                font-black
                leading-[1.38]
                tracking-[-0.045em]
                text-[#112F50]
                sm:text-[42px]
                lg:text-[47px]
                xl:text-[50px]
              "
            >
              {productName}
            </h1>

            <div className="mt-4 flex items-center gap-2">
              <Sparkles
                aria-hidden="true"
                className="h-4 w-4 text-[#B79464]"
              />

              <span
                className="
                  text-[9px]
                  font-bold
                  text-[#7A838D]
                  sm:text-[10px]
                "
              >
                انتخابی برای پروژه‌های
                متمایز
              </span>
            </div>
          </div>

          {shortDescription && (
            <p
              className="
                mt-5
                max-w-[700px]
                text-[12px]
                font-medium
                leading-8
                text-[#667085]
                sm:text-[14px]
                sm:leading-9
              "
            >
              {shortDescription}
            </p>
          )}

          <ProductPricePanel
            price={price}
            regularPrice={regularPrice}
            onSale={onSale}
          />

          <ProductSpecs acf={acf} />

          <ProductTechnicalData
            attributes={attributes}
          />

          <div className="mt-7 grid gap-2.5 sm:grid-cols-3">
            {TRUST_ITEMS.map(
              ({
                icon: Icon,
                title,
                text,
              }) => (
                <div
                  key={title}
                  className="
                    rounded-[20px]
                    border
                    border-[#112F50]/[0.06]
                    bg-[#FAFAF7]
                    px-3.5
                    py-3
                  "
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[#F5EDDF]
                        text-[#9D7D4F]
                      "
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <p
                        className="
                          truncate
                          text-[10px]
                          font-black
                          text-[#112F50]
                        "
                      >
                        {title}
                      </p>

                      <p
                        className="
                          mt-0.5
                          truncate
                          text-[8px]
                          font-medium
                          text-[#7A838D]
                        "
                      >
                        {text}
                      </p>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>

          <ProductCTA
            productName={productName}
            telPhone=""
          />
        </div>
      </div>
    </div>
  )
}