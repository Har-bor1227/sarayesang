export interface WooCommerceImage {
  id?: number
  src?: string
  alt?: string
  width?: number
  height?: number
}

export interface WooCommerceCategory {
  id: number
  name: string
  slug: string
}

export interface WooCommerceAttribute {
  id: number
  name: string
  options?: string[]
  position?: number
  visible?: boolean
  variation?: boolean
}

export interface WooCommerceVariationAttribute {
  id?: number
  name?: string
  slug: string
  option: string
}

export interface WooCommerceMetaData {
  id?: number
  key?: string
  value?: unknown
}

export interface WooCommerceAcfData {
  productCode?: unknown
  product_code?: unknown

  stoneType?: unknown
  stone_type?: unknown

  dimensions?: unknown

  weight?: unknown

  surfaceFinish?: unknown
  surface_finish?: unknown

  colorFamily?: unknown
  color_family?: unknown

  application?: unknown

  imageGallery?: unknown
  image_gallery?: unknown
}

export interface WooCommerceVariation {
  id: number
  type?: 'variation' | string

  date_created?: string
  date_created_gmt?: string
  date_modified?: string
  date_modified_gmt?: string

  description?: string
  permalink?: string

  sku?: string
  global_unique_id?: string

  price?: string
  regular_price?: string
  sale_price?: string

  date_on_sale_from?: string | null
  date_on_sale_from_gmt?: string | null
  date_on_sale_to?: string | null
  date_on_sale_to_gmt?: string | null

  on_sale?: boolean
  status?: string
  purchasable?: boolean

  virtual?: boolean
  downloadable?: boolean

  downloads?: unknown[]
  download_limit?: number
  download_expiry?: number

  tax_status?: string
  tax_class?: string

  manage_stock?: boolean
  stock_quantity?: number | null
  stock_status?: string

  backorders?: string
  backorders_allowed?: boolean
  backordered?: boolean
  low_stock_amount?: number | null

  weight?: string

  dimensions?: {
    length?: string
    width?: string
    height?: string
  }

  shipping_class?: string
  shipping_class_id?: number

  image?: WooCommerceImage | null
  gallery_image_ids?: number[]

  attributes?: WooCommerceVariationAttribute[]

  menu_order?: number

  meta_data?: WooCommerceMetaData[]

  name?: string
  parent_id?: number
}

export interface WooCommerceDefaultAttribute {
  id?: number
  name?: string
  slug: string
  option: string
}

export interface WooCommerceProduct {
  id: number
  name: string
  slug: string

  type?: string

  description?: string
  short_description?: string

  sku?: string

  price?: string
  regular_price?: string
  sale_price?: string

  on_sale?: boolean
  featured?: boolean

  average_rating?: string
  rating_count?: number

  weight?: string

  dimensions?: {
    length?: string
    width?: string
    height?: string
  }

  categories?: WooCommerceCategory[]
  images?: WooCommerceImage[]
  attributes?: WooCommerceAttribute[]

  default_attributes?: WooCommerceDefaultAttribute[]

  variations?: number[]

  acf?: WooCommerceAcfData | null

  meta_data?: WooCommerceMetaData[]

  stock_status?: string

  date_created?: string
  date_modified?: string

  status?: string
}

export interface WooCommerceProductCategory {
  id: number
  name: string
  slug: string

  parent?: number

  description?: string
  count?: number

  image?: {
    id?: number
    src?: string
    alt?: string
    width?: number
    height?: number
  } | null
}

export interface WooCommerceGlobalAttribute {
  id: number
  name: string
  slug: string

  type?: string
  order_by?: string
  has_archives?: boolean
}

export interface WooCommerceProductAttributeTerm {
  id: number
  name: string
  slug: string

  description?: string
  menu_order?: number
  count?: number
}

export type WooCommerceProductList =
  WooCommerceProduct[]