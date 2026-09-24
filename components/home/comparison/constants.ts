import type { FinderProduct } from '../stone-finder/types'

export const INITIAL_QUERY = ''

export const MAX_SEARCH_RESULTS = 12

export const comparisonFields = [
  {
    key: 'stoneType',
    label: 'نوع سنگ',
    getValue: (
      product: FinderProduct,
    ) => product.acf.stoneType,
  },
  {
    key: 'application',
    label: 'کاربرد',
    getValue: (
      product: FinderProduct,
    ) => product.acf.application,
  },
  {
    key: 'colorFamily',
    label: 'طیف رنگی',
    getValue: (
      product: FinderProduct,
    ) => product.acf.colorFamily,
  },
  {
    key: 'surfaceFinish',
    label: 'پرداخت سطح',
    getValue: (
      product: FinderProduct,
    ) => product.acf.surfaceFinish,
  },
] as const