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
  variation?: boolean
}

export type ProductDetailVariationAttribute = {
  id?: string
  name?: string
  slug: string
  option: string
}

export type ProductDetailVariation = {
  id: string

  sku?: string | null

  price?: string | null
  regularPrice?: string | null
  salePrice?: string | null

  onSale?: boolean | null

  stockStatus?:
    | 'instock'
    | 'outofstock'
    | 'onbackorder'
    | 'unknown'
    | null

  stockQuantity?: number | null
  purchasable?: boolean | null

  weight?: string | null

  dimensions?: {
    length?: string | null
    width?: string | null
    height?: string | null
  } | null

  image?: ProductDetailImage | null

  attributes: ProductDetailVariationAttribute[]

  parentId?: string | null
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

  type?:
    | 'simple'
    | 'variable'
    | 'grouped'
    | 'external'
    | 'unknown'
    | null

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

  defaultAttributes?: ProductDetailVariationAttribute[] | null

  variations?: {
    nodes?: ProductDetailVariation[] | null
  } | null

  acf?: ProductDetailAcf | null
}