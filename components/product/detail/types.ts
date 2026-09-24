export type ProductDetailImage = {
  sourceUrl: string
  altText?: string | null
}

export type ProductDetailCategory = {
  id: string
  name: string
  slug: string
}

export type ProductDetailAttribute = {
  id: string
  name: string
  options: string[]
}

export type ProductDetailAcf = {
  dimensions?: string | null
  weight?: string | null
  stoneType?: string | null
  surfaceFinish?: string | null
  colorFamily?: string | null
  application?: string | null
}

export type ProductDetailProduct = {
  name: string
  slug: string

  price?: string | null
  regularPrice?: string | null
  onSale?: boolean | null

  shortDescription?: string | null
  description?: string | null

  image?: ProductDetailImage | null

  galleryImages?: {
    nodes?: ProductDetailImage[] | null
  } | null

  productCategories?: {
    nodes?: ProductDetailCategory[] | null
  } | null

  attributes?: {
    nodes?: ProductDetailAttribute[] | null
  } | null

  acf?: ProductDetailAcf | null
}