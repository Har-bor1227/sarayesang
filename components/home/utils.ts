import type { ProductSummary } from '@/types/wordpress'

export function getProductImage(
  product: ProductSummary
) {
  return (
    product.image?.sourceUrl ||
    '/images/home/product-placeholder.webp'
  )
}

export function getProductAlt(
  product: ProductSummary
) {
  return (
    product.image?.altText ||
    product.name ||
    'محصول سنگ'
  )
}

export function getProductSlug(
  product: ProductSummary
) {
  return product.slug || ''
}

export function getProductPrice(
  product: ProductSummary
) {
  return (
    product.salePrice ||
    product.price ||
    product.regularPrice ||
    '—'
  )
}

export function getProductRegularPrice(
  product: ProductSummary
) {
  if (
    product.regularPrice &&
    product.salePrice &&
    product.regularPrice !==
      product.salePrice
  ) {
    return product.regularPrice
  }

  return null
}