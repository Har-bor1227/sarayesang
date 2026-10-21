import 'server-only'

export {
  getProductsFromWooCommerce,
  getProductBySlugFromWooCommerce,
  getProductVariationsFromWooCommerce,
  searchWooCommerceProducts,
  getAllProductSlugsFromWooCommerce,
  getAllProductSitemapEntriesFromWooCommerce,
} from './woocommerce/products'

export type {
  WooCommerceProductQueryOptions,
  ProductSitemapEntry,
} from './woocommerce/products'

export {
  getProductCategoriesFromWooCommerce,
  getProductCategoryBySlugFromWooCommerce,
} from './woocommerce/categories'

export {
  getProductAttributesFromWooCommerce,
  getProductAttributeTermsFromWooCommerce,
} from './woocommerce/attributes'

export {
  getHomeProductsFromWooCommerce,
} from './woocommerce/home'

export {
  getAllProductsForSmartSearchFromWooCommerce,
} from './woocommerce/smart-search'

export {
  getAllProductsForStoneFinderFromWooCommerce,
} from './woocommerce/stone-finder'