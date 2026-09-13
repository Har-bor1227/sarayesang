export interface Image {
  sourceUrl: string
  altText?: string

  mediaDetails?: {
    width: number
    height: number
  }
}

export interface ProductCategoryNode {
  id: string
  name: string
  slug: string

  count?: number
  description?: string

  image?: Image | null
}

export interface AttributeNode {
  id: string
  name: string
  options: string[]
}

export interface AcfProductData {
  productCode?: string
  stoneType?: string
  dimensions?: string
  weight?: string
  surfaceFinish?: string
  colorFamily?: string
  application?: string

  imageGallery?: Image[] | null
}

export type ProductStockStatus =
  | 'instock'
  | 'outofstock'
  | 'onbackorder'
  | 'unknown'

export interface Product {
  id: string
  name: string
  slug: string

  description?: string
  shortDescription?: string

  sku?: string

  /**
   * واحد قیمت داخلی پروژه:
   *
   * تومان
   *
   * این مقدار مستقیماً در UI نمایش داده می‌شود.
   * در Structured Data به ریال تبدیل می‌شود.
   */
  price?: string
  regularPrice?: string
  salePrice?: string

  onSale?: boolean

  averageRating?: number
  reviewCount?: number

  /**
   * وضعیت موجودی واقعی WooCommerce.
   */
  stockStatus?: ProductStockStatus

  image?: Image | null

  galleryImages?: {
    nodes?: Image[]
  } | null

  productCategories?: {
    nodes?: ProductCategoryNode[]
  } | null

  attributes?: {
    nodes?: AttributeNode[]
  } | null

  acf?: AcfProductData | null
}

export interface ProductCategorySummary {
  id: string
  name: string
  slug: string
}

export interface ProductSummary {
  id: string
  name: string
  slug: string

  /**
   * واحد قیمت داخلی پروژه:
   *
   * تومان
   */
  price?: string
  regularPrice?: string
  salePrice?: string

  onSale?: boolean

  image?: Image | null

  productCategories?: {
    nodes?: ProductCategorySummary[]
  } | null
}

export interface PageInfo {
  hasNextPage: boolean
  endCursor: string | null
  total?: number
}

export interface ProductConnection {
  pageInfo: PageInfo
  nodes: ProductSummary[]
}

export interface ProductCategoryConnection {
  pageInfo?: PageInfo
  nodes: ProductCategoryNode[]
}

export interface PostCategory {
  id: string
  name: string
  slug?: string
}

export interface Post {
  id: string
  title: string
  slug: string
  uri?: string

  content?: string
  excerpt?: string
  date?: string

  featuredImage?: {
    node?: Image | null
  } | null

  categories?: {
    nodes?: PostCategory[]
  } | null
}

export interface PostSummary {
  id: string
  title: string
  slug: string
  uri?: string

  excerpt?: string
  date?: string

  featuredImage?: {
    node?: Image | null
  } | null

  categories?: {
    nodes?: PostCategory[]
  } | null
}

export interface PostConnection {
  pageInfo: PageInfo
  nodes: PostSummary[]
}

export interface GetProductBySlugResponse {
  product: Product | null
}

export interface GetProductsResponse {
  products: ProductConnection
}

export interface GetProductCategoriesResponse {
  productCategories: {
    nodes: ProductCategoryNode[]
  }
}

export interface GetProductCategoryBySlugResponse {
  productCategory: ProductCategoryNode | null
}

export interface SearchProductsResponse {
  products: {
    nodes: ProductSummary[]
  }
}

export interface GetPostsResponse {
  posts: PostConnection
}

export interface GetPostBySlugResponse {
  post: Post | null
}

export interface GetAllProductSlugsResponse {
  products: {
    pageInfo: PageInfo

    nodes: {
      slug: string
    }[]
  }
}

export interface GetAllPostSlugsResponse {
  posts: {
    pageInfo: PageInfo

    nodes: {
      slug: string
    }[]
  }
}

export interface GetHomePageDataResponse {
  featuredProducts?: {
    nodes: ProductSummary[]
  }

  recentProducts?: {
    nodes: ProductSummary[]
  }

  productCategories?: {
    nodes: ProductCategoryNode[]
  }
}