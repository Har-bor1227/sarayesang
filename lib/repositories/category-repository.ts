import { cache } from 'react'

import {
  getProductCategoriesFromWooCommerce,
  getProductCategoryBySlugFromWooCommerce,
} from '@/lib/woocommerce'

import type {
  ProductCategoryNode,
} from '@/types/wordpress'

export const getProductCategories =
  cache(async () => {
    return getProductCategoriesFromWooCommerce()
  })

export const getProductCategoryBySlug =
  cache(
    async (slug: string) => {
      return getProductCategoryBySlugFromWooCommerce(
        slug,
      )
    },
  )

export interface ProductCategoryContext {
  category: ProductCategoryNode
  parent: ProductCategoryNode | null
  children: ProductCategoryNode[]
  siblings: ProductCategoryNode[]
}

export const getProductCategoryContext =
  cache(
    async (
      slug: string,
    ): Promise<
      ProductCategoryContext | null
    > => {
      const categories =
        await getProductCategories()

      const category =
        categories.find(
          (item) =>
            item.slug ===
            slug,
        )

      if (!category) {
        return null
      }

      const parent =
        category.parentId
          ? (
              categories.find(
                (item) =>
                  item.id ===
                  category.parentId,
              ) ?? null
            )
          : null

      const children =
        categories.filter(
          (item) =>
            item.parentId ===
            category.id,
        )

      const siblings =
        categories.filter(
          (item) =>
            item.id !==
              category.id &&
            item.parentId ===
              (category.parentId ??
                null),
        )

      return {
        category,
        parent,
        children,
        siblings,
      }
    },
  )

export const getRootProductCategories =
  cache(
    async () => {
      const categories =
        await getProductCategories()

      return categories.filter(
        (category) =>
          !category.parentId ||
          category.parentId ===
            '0',
      )
    },
  )

export const getChildProductCategories =
  cache(
    async (
      parentId: string,
    ) => {
      const categories =
        await getProductCategories()

      return categories.filter(
        (category) =>
          category.parentId ===
          parentId,
      )
    },
  )