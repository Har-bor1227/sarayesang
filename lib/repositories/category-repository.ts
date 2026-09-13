import { cache } from 'react'

import {
  getProductCategoriesFromWooCommerce,
  getProductCategoryBySlugFromWooCommerce,
} from '@/lib/woocommerce'

export const getProductCategories =
  cache(async () => {
    return getProductCategoriesFromWooCommerce()
  })

export const getProductCategoryBySlug =
  cache(
    async (slug: string) => {
      return getProductCategoryBySlugFromWooCommerce(
        slug
      )
    }
  )