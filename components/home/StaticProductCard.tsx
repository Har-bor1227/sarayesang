import Image from 'next/image'

import { ArrowLeft, MessageCircle } from 'lucide-react'

export default function StaticProductCard({
  product,
}: {
  product: {
    name: string
    image: string
    price: string
    regularPrice?: string
  }
}) {
  return (
    <article className="rounded-[24px] bg-white p-3 shadow-[0_12px_35px_rgba(16,47,80,0.08)]">
      <div className="relative aspect-[0.95] overflow-hidden rounded-[20px] bg-[#F2F2F0]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 245px, 285px"
          className="object-cover"
        />
      </div>

      <div className="px-2 pb-2 pt-4">
        <h3 className="min-h-[48px] line-clamp-2 text-right text-[16px] font-extrabold leading-7 text-[#102F50]">
          {product.name}
        </h3>

        <div className="mt-3 text-right">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[16px] font-black text-[#102F50]">
              {product.price}
            </span>

            {product.regularPrice && (
              <span className="text-[12px] font-semibold text-[#C96C64] line-through">
                {product.regularPrice}
              </span>
            )}
          </div>

          <span className="mt-1 block text-[11px] font-medium text-[#7B8794]">
            تومان / متر مربع
          </span>
        </div>

        <div className="mt-4 flex gap-2 max-[340px]:flex-col">
          <button
            type="button"
            className="
              flex
              h-9
              min-w-0
              flex-1
              items-center
              justify-center
              gap-1
              rounded-full
              bg-[#102F50]
              px-2
              text-[11px]
              font-bold
              text-white
            "
          >
            خرید
            <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
          </button>

          <button
            type="button"
            className="
              flex
              h-9
              min-w-0
              flex-1
              items-center
              justify-center
              gap-1
              rounded-full
              border
              border-[#102F50]
              px-2
              text-[11px]
              font-bold
              text-[#102F50]
            "
          >
            مشاوره
            <MessageCircle className="h-3.5 w-3.5 shrink-0" />
          </button>
        </div>
      </div>
    </article>
  )
}