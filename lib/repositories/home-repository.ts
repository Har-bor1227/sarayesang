import { cache } from 'react'

import {
  getHomeProductsFromWooCommerce,
} from '@/lib/woocommerce'

import type {
  GetHomePageDataResponse,
} from '@/types/wordpress'

export const getHomePageData =
  cache(
    async (): Promise<GetHomePageDataResponse> => {
      return getHomeProductsFromWooCommerce()
    }
  )