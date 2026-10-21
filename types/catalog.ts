export type CatalogFilterKey =
  | 'stoneType'
  | 'color'
  | 'application'
  | 'surfaceFinish'

export interface CatalogFilterOption {
  id: string
  name: string
  slug: string
  count: number
}

export interface CatalogFilterGroup {
  key: CatalogFilterKey
  label: string
  taxonomy: string
  options: CatalogFilterOption[]
}

export type CatalogFilterSelection = Partial<
  Record<
    CatalogFilterKey,
    string
  >
>

export type ProductSort =
  | 'newest'
  | 'price-asc'
  | 'price-desc'
  | 'name-asc'