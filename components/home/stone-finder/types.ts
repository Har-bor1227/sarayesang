export type QuestionKey =
  | 'application'
  | 'stoneType'
  | 'colorFamily'
  | 'surfaceFinish'

export type Answers =
  Partial<Record<QuestionKey, string>>

export type QuestionConfig = {
  key: QuestionKey
  eyebrow: string
  title: string
  description: string
  weight: number
  shortLabel: string
}

export type FinderProduct = {
  id: string
  name: string
  slug: string
  price?: string
  regularPrice?: string
  onSale?: boolean
  image?: {
    sourceUrl: string
    altText?: string
  } | null
  productCategories?: {
    nodes?: Array<{
      id: string
      name?: string
      slug?: string
    }>
  } | null
  acf: {
    application?: string
    stoneType?: string
    colorFamily?: string
    surfaceFinish?: string
    dimensions?: string
    weight?: string
  }
}

export type FinderApiResponse = {
  products: FinderProduct[]
  facets: Record<QuestionKey, string[]>
}

export type RankedProduct =
  FinderProduct & {
    match: number
    matchedFields: number
  }

export type TrustPoint = {
  value: string
  text: string
}