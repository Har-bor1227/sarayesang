import type {
  AcfProductData,
  Image,
  Product,
  ProductCategoryNode,
  ProductSummary,
  ProductType,
  ProductVariation,
} from '@/types/wordpress'

import type {
  WooCommerceDefaultAttribute,
  WooCommerceProduct,
  WooCommerceProductCategory,
  WooCommerceVariation,
} from './types'

import {
  normalizePositiveDimension,
  normalizeSlug,
  normalizeStockStatus,
  normalizeText,
} from './normalizers'

import {
  normalizeImage,
  uniqueImages,
} from './images'

import {
  getAcfImages,
  getAcfString,
} from './acf'

export function mapCategory(
  category: WooCommerceProductCategory,
  allProducts?: WooCommerceProduct[],
): ProductCategoryNode {
  const count =
    category.count ??
    (
      allProducts
        ? allProducts.filter(
            (
              product,
            ) =>
              product.categories?.some(
                (
                  item,
                ) =>
                  item.id ===
                  category.id,
              ),
          ).length
        : undefined
    )

  const imageSrc =
    category.image?.src

  return {
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

    parentId:
      typeof category.parent ===
        'number'
        ? String(
            category.parent,
          )
        : null,

    count,

    description:
      category.description ||
      undefined,

    image:
      imageSrc
        ? {
            sourceUrl:
              imageSrc,

            altText:
              category.image
                ?.alt ||
              category.name,

            mediaDetails:
              category.image?.width &&
              category.image?.height
                ? {
                    width:
                      category.image
                        .width,

                    height:
                      category.image
                        .height,
                  }
                : undefined,
          }
        : null,
  }
}

export function mapProductSummary(
  product: WooCommerceProduct,
): ProductSummary {
  const normalizedImage =
    normalizeImage(
      product.images?.[0],
      product.name,
    )

  return {
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
      normalizedImage,

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
  }
}

function buildProductAcfData(
  product: WooCommerceProduct,
): AcfProductData | null {
  const productCode =
    getAcfString(
      product,
      [
        'productCode',
        'product_code',
        'productcode',
        'code',
        'product-id',
        'product_id',
      ],
    )

  const stoneType =
    getAcfString(
      product,
      [
        'stoneType',
        'stone_type',
        'stonetype',
        'stone',
      ],
    )

  const dimensionsFromAcf =
    getAcfString(
      product,
      [
        'dimensions',
        'dimension',
      ],
    )

  const weight =
    getAcfString(
      product,
      [
        'weight',
        'stone_weight',
      ],
    )

  const surfaceFinish =
    getAcfString(
      product,
      [
        'surfaceFinish',
        'surface_finish',
        'surfacefinish',
        'finish',
      ],
    )

  const colorFamily =
    getAcfString(
      product,
      [
        'colorFamily',
        'color_family',
        'colorfamily',
        'color',
        'colour_family',
      ],
    )

  const application =
    getAcfString(
      product,
      [
        'application',
        'applications',
        'usage',
      ],
    )

  const wooDimensionParts = [
    normalizePositiveDimension(
      product.dimensions?.length,
    ),

    normalizePositiveDimension(
      product.dimensions?.width,
    ),

    normalizePositiveDimension(
      product.dimensions?.height,
    ),
  ].filter(
    (
      value,
    ): value is string =>
      Boolean(value),
  )

  const dimensions =
    dimensionsFromAcf ||
    (
      wooDimensionParts.length >
        0
        ? wooDimensionParts.join(
            ' × ',
          )
        : undefined
    )

  const imageGallery =
    getAcfImages(
      product,
      [
        'imageGallery',
        'image_gallery',
        'imagegallery',
        'gallery',
        'gallery_images',
        'product_gallery',
      ],
      product.name,
    )

  const hasAnyValue =
    Boolean(
      productCode ||
      stoneType ||
      dimensions ||
      weight ||
      surfaceFinish ||
      colorFamily ||
      application ||
      imageGallery.length,
    )

  if (!hasAnyValue) {
    return null
  }

  return {
    productCode,

    stoneType,

    dimensions,

    weight,

    surfaceFinish,

    colorFamily,

    application,

    imageGallery:
      imageGallery.length >
        0
        ? imageGallery
        : null,
  }
}

function normalizeProductType(
  value?: string,
): ProductType {
  switch (
    value
      ?.trim()
      .toLowerCase()
  ) {
    case 'simple':
      return 'simple'

    case 'variable':
      return 'variable'

    case 'grouped':
      return 'grouped'

    case 'external':
      return 'external'

    default:
      return 'unknown'
  }
}

function mapVariationAttribute(
  attribute: NonNullable<
    WooCommerceVariation['attributes']
  >[number],
): ProductVariation['attributes'][number] | null {
  const slug =
    normalizeText(
      attribute.slug,
    )

  const option =
    normalizeText(
      attribute.option,
    )

  if (
    !slug ||
    !option
  ) {
    return null
  }

  return {
    id:
      typeof attribute.id ===
        'number'
        ? String(
            attribute.id,
          )
        : undefined,

    name:
      normalizeText(
        attribute.name,
      ),

    slug,

    option,
  }
}

function mapProductVariation(
  variation: WooCommerceVariation,
): ProductVariation {
  const mappedAttributes =
    (
      variation.attributes ?? []
    )
      .map(
        mapVariationAttribute,
      )
      .filter(
        (
          attribute,
        ): attribute is ProductVariation['attributes'][number] =>
          Boolean(
            attribute,
          ),
      )

  const image =
    normalizeImage(
      variation.image,
      variation.name ||
        '',
    )

  return {
    id:
      String(
        variation.id,
      ),

    sku:
      normalizeText(
        variation.sku,
      ),

    price:
      normalizeText(
        variation.price,
      ),

    regularPrice:
      normalizeText(
        variation.regular_price,
      ),

    salePrice:
      normalizeText(
        variation.sale_price,
      ),

    onSale:
      Boolean(
        variation.on_sale,
      ),

    stockStatus:
      normalizeStockStatus(
        variation.stock_status,
      ),

    stockQuantity:
      typeof variation.stock_quantity ===
        'number'
        ? variation.stock_quantity
        : variation.stock_quantity ===
            null
          ? null
          : undefined,

    purchasable:
      typeof variation.purchasable ===
        'boolean'
        ? variation.purchasable
        : undefined,

    weight:
      normalizeText(
        variation.weight,
      ),

    dimensions: {
      length:
        normalizeText(
          variation.dimensions
            ?.length,
        ),

      width:
        normalizeText(
          variation.dimensions
            ?.width,
        ),

      height:
        normalizeText(
          variation.dimensions
            ?.height,
        ),
    },

    image,

    attributes:
      mappedAttributes,

    parentId:
      typeof variation.parent_id ===
        'number'
        ? String(
            variation.parent_id,
          )
        : undefined,
  }
}

function mapDefaultAttribute(
  attribute: WooCommerceDefaultAttribute,
): NonNullable<
  Product['defaultAttributes']
>[number] | null {
  const slug =
    normalizeText(
      attribute.slug,
    )

  const option =
    normalizeText(
      attribute.option,
    )

  if (
    !slug ||
    !option
  ) {
    return null
  }

  return {
    id:
      typeof attribute.id ===
        'number'
        ? String(
            attribute.id,
          )
        : undefined,

    name:
      normalizeText(
        attribute.name,
      ),

    slug,

    option,
  }
}

export function mapProduct(
  product: WooCommerceProduct,
  variations?: WooCommerceVariation[],
): Product {
  const rawImages =
    product.images ?? []

  const mappedWooImages =
    rawImages
      .map(
        (
          image,
        ) =>
          normalizeImage(
            image,
            product.name,
          ),
      )
      .filter(
        (
          image,
        ): image is Image =>
          Boolean(image),
      )

  const primaryImage =
    mappedWooImages[0] ??
    null

  const acf =
    buildProductAcfData(
      product,
    )

  const acfGallery =
    acf?.imageGallery ?? []

  const galleryImages =
    uniqueImages(
      [
        ...mappedWooImages.slice(
          1,
        ),

        ...acfGallery,
      ],
    )

  const categories =
    product.categories ?? []

  const attributes =
    product.attributes ?? []

  const mappedAttributes =
    attributes
      .filter(
        (
          attribute,
        ) =>
          Boolean(
            normalizeText(
              attribute.name,
            ),
          ),
      )
      .map(
        (
          attribute,
        ) => ({
          id:
            String(
              attribute.id,
            ),

          name:
            attribute.name.trim(),

          options:
            Array.isArray(
              attribute.options,
            )
              ? attribute.options
                  .map(
                    (
                      option,
                    ) =>
                      normalizeText(
                        option,
                      ),
                  )
                  .filter(
                    (
                      option,
                    ): option is string =>
                      Boolean(
                        option,
                      ),
                  )
              : [],

          variation:
            Boolean(
              attribute.variation,
            ),
        }),
      )
      .filter(
        (
          attribute,
        ) =>
          attribute.options
            .length >
          0,
      )

  const mappedDefaultAttributes =
    (
      product.default_attributes ??
      []
    )
      .map(
        mapDefaultAttribute,
      )
      .filter(
        (
          attribute,
        ): attribute is NonNullable<
          Product['defaultAttributes']
        >[number] =>
          Boolean(
            attribute,
          ),
      )

  const mappedVariations =
    Array.isArray(
      variations,
    )
      ? variations
          .map(
            mapProductVariation,
          )
      : []

  return {
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

    type:
      normalizeProductType(
        product.type,
      ),

    description:
      normalizeText(
        product.description,
      ),

    shortDescription:
      normalizeText(
        product.short_description,
      ),

    sku:
      normalizeText(
        product.sku,
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

    averageRating:
      product.average_rating
        ? Number(
            product.average_rating,
          )
        : undefined,

    reviewCount:
      typeof product.rating_count ===
        'number'
        ? product.rating_count
        : undefined,

    stockStatus:
      normalizeStockStatus(
        product.stock_status,
      ),

    image:
      primaryImage,

    galleryImages:
      galleryImages.length >
        0
        ? {
            nodes:
              galleryImages,
          }
        : null,

    productCategories:
      categories.length >
        0
        ? {
            nodes:
              categories.map(
                (
                  category,
                ) =>
                  mapCategory(
                    {
                      id:
                        category.id,

                      name:
                        category.name,

                      slug:
                        category.slug,

                      parent:
                        undefined,

                      description:
                        undefined,

                      count:
                        undefined,

                      image:
                        null,
                    },
                  ),
              ),
          }
        : null,

    attributes:
      mappedAttributes.length >
        0
        ? {
            nodes:
              mappedAttributes,
          }
        : null,

    defaultAttributes:
      mappedDefaultAttributes.length >
        0
        ? mappedDefaultAttributes
        : [],

    variations:
      Array.isArray(
        variations,
      )
        ? {
            nodes:
              mappedVariations,
          }
        : null,

    acf,
  }
}