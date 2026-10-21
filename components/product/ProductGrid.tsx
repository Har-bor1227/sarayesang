import ProductCard from './ProductCard'

import type {
  ProductSummary,
} from '@/types/wordpress'

interface ProductGridProps {
  products: ProductSummary[]
  priorityCount?: number
}

export default function ProductGrid({
  products,
  priorityCount = 0,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-[28px] border border-dashed border-[#112F50]/[0.10] bg-white px-6 py-16 text-center shadow-[0_10px_34px_rgba(10,25,41,0.035)]">
        <p className="text-[12px] font-bold text-[#667085] sm:text-[13px]">
          محصولی یافت نشد.
        </p>
      </div>
    )
  }

  return (
    <div
      className="
        grid
        grid-cols-2
        gap-3
        sm:gap-5
        lg:grid-cols-3
        xl:gap-6
        2xl:grid-cols-4
      "
    >
      {products.map(
        (
          product,
          index,
        ) => (
          <ProductCard
            key={product.id}
            product={product}
            priority={
              index < priorityCount
            }
          />
        ),
      )}
    </div>
  )
}
