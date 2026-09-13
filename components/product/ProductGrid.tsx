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
      <div
        className="
          rounded-2xl
          border
          border-dashed
          border-gray-200
          bg-gray-50
          px-6
          py-16
          text-center
        "
      >
        <p className="text-sm text-gray-500 sm:text-base">
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
        sm:grid-cols-2
        sm:gap-5
        md:grid-cols-3
        lg:grid-cols-4
        lg:gap-6
      "
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={
            index < priorityCount
          }
        />
      ))}
    </div>
  )
}