import type {
  ProductCategoryNode,
  ProductSummary,
} from '@/types/wordpress'

import {
  getProductsFromWooCommerce,
} from './products'

import {
  getProductCategoriesFromWooCommerce,
} from './categories'

export async function getHomeProductsFromWooCommerce(): Promise<{
  featuredProducts: {
    nodes: ProductSummary[]
  }

  recentProducts: {
    nodes: ProductSummary[]
  }

  productCategories: {
    nodes: ProductCategoryNode[]
  }
}> {
  const [
    featuredResult,
    recentResult,
    categories,
  ] = await Promise.all([
    getProductsFromWooCommerce({
      page:
        1,

      perPage:
        8,

      featured:
        true,
    }),

    getProductsFromWooCommerce({
      page:
        1,

      perPage:
        8,
    }),

    getProductCategoriesFromWooCommerce(),
  ])

  return {
    featuredProducts: {
      nodes:
        featuredResult.products,
    },

    recentProducts: {
      nodes:
        recentResult.products,
    },

    productCategories: {
      nodes:
        categories.slice(
          0,
          10,
        ),
    },
  }
}
