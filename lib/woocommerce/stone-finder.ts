import type {
  Image,
  ProductCategorySummary,
} from '@/types/wordpress'

import {
  getAllPublishedProductsFromWooCommerce,
} from './catalog'

import {
  normalizeSlug,
  normalizeText,
} from './normalizers'

import {
  normalizeImage,
} from './images'

import {
  getAcfString,
} from './acf'

export async function getAllProductsForStoneFinderFromWooCommerce() {
  const products:
    Array<{
      id: string
      name: string
      slug: string
      price?: string
      regularPrice?: string
      salePrice?: string
      onSale?: boolean
      image?: Image | null
      productCategories?: {
        nodes?: ProductCategorySummary[]
      } | null
      acf: {
        application?: string
        stoneType?: string
        colorFamily?: string
        surfaceFinish?: string
        dimensions?: string
        weight?: string
      }
    }> = []

  const rawProducts =
    await getAllPublishedProductsFromWooCommerce()

  products.push(
    ...rawProducts.map(
      (
        product,
      ) => ({
        id:
          String(
            product.id,
          ),

        name:
          product.name,

        slug:
          normalizeSlug(
            product.slug,
          ),

        price:
          normalizeText(
            product.price,
          ),

        regularPrice:
          normalizeText(
            product.regular_price,
          ),

        salePrice:
          normalizeText(
            product.sale_price,
          ),

        onSale:
          Boolean(
            product.on_sale,
          ),

        image:
          normalizeImage(
            product.images?.[0],
            product.name,
          ),

        productCategories:
          product.categories?.length
            ? {
                nodes:
                  product.categories.map(
                    (
                      category,
                    ) => ({
                      id:
                        String(
                          category.id,
                        ),

                      name:
                        category.name,

                      slug:
                        normalizeSlug(
                          category.slug,
                        ),
                    }),
                  ),
              }
            : null,

        acf: {
          application:
            getAcfString(
              product,
              [
                'application',
                'applications',
                'usage',
              ],
            ),

          stoneType:
            getAcfString(
              product,
              [
                'stoneType',
                'stone_type',
                'stonetype',
                'type',
              ],
            ),

          colorFamily:
            getAcfString(
              product,
              [
                'colorFamily',
                'color_family',
                'colorfamily',
                'color',
                'colour_family',
              ],
            ),

          surfaceFinish:
            getAcfString(
              product,
              [
                'surfaceFinish',
                'surface_finish',
                'surfacefinish',
                'finish',
                'finishing',
              ],
            ),

          dimensions:
            getAcfString(
              product,
              [
                'dimensions',
                'dimension',
                'size',
              ],
            ),

          weight:
            getAcfString(
              product,
              [
                'weight',
                'weights',
              ],
            ),
        },
      }),
    ),
  )

  return products
}