import type {
  CatalogFilterKey,
  ProductSort,
} from '@/types/catalog'

export const SORT_OPTIONS: {
  value: ProductSort
  label: string
}[] = [
  {
    value: 'newest',
    label: 'جدیدترین',
  },
  {
    value: 'price-asc',
    label: 'ارزان‌ترین',
  },
  {
    value: 'price-desc',
    label: 'گران‌ترین',
  },
  {
    value: 'name-asc',
    label: 'الفبایی',
  },
]

export const FILTER_LABELS: Record<
  CatalogFilterKey,
  string
> = {
  stoneType: 'نوع سنگ',
  color: 'رنگ',
  application: 'کاربرد',
  surfaceFinish: 'پرداخت',
}

export const FILTER_KEYS: CatalogFilterKey[] = [
  'stoneType',
  'color',
  'application',
  'surfaceFinish',
]

export const EMPTY_SELECTION = {
  stoneType: undefined,
  color: undefined,
  application: undefined,
  surfaceFinish: undefined,
} satisfies Record<
  CatalogFilterKey,
  string | undefined
>
