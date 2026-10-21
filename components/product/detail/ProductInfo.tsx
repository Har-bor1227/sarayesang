import styles from './ProductDetail.module.css'
import Link from 'next/link'

import ProductCTA from './ProductCTA'
import ProductPricePanel from './ProductPricePanel'

import type {
  ProductDetailAcf,
  ProductDetailAttribute,
  ProductDetailCategory,
  ProductDetailProduct,
  ProductDetailVariation,
} from './types'

type ProductInfoProps = {
  productName: string
  categories: ProductDetailCategory[]
  shortDescription?: string
  price?: string | null
  regularPrice?: string | null
  onSale?: boolean | null
  acf?: ProductDetailAcf | null
  attributes: ProductDetailAttribute[]
  variations?: ProductDetailVariation[]
  defaultAttributes?: ProductDetailProduct['defaultAttributes']
}

export default function ProductInfo({
  productName,
  categories,
  shortDescription,
  price,
  regularPrice,
  onSale,
  attributes,
  variations = [],
  defaultAttributes,
}: ProductInfoProps) {
  const variationAttributes =
    attributes.filter(
      (attribute) =>
        attribute.variation === true,
    )

  const isVariable =
    variations.length > 0 &&
    variationAttributes.length > 0

  return (
    <div className={styles.info}>
      <header>
        {categories.length > 0 && (
          <div className={styles.categories}>
            {categories.map(category => (
              <Link key={category.id} href={`/categories/${category.slug}`}>
                {category.name}
              </Link>
            ))}
          </div>
        )}
        <h1 className={styles.title}>{productName}</h1>
        {shortDescription && <p className={styles.summary}>{shortDescription}</p>}
      </header>
      <div className={styles.commerce}>
        <ProductPricePanel
          price={price}
          regularPrice={regularPrice}
          onSale={onSale}
          isVariable={isVariable}
          variationAttributes={variationAttributes}
          variations={variations}
          defaultAttributes={defaultAttributes}
        />
        <div className={styles.primaryAction}>
          <ProductCTA productName={productName} />
          <p className={styles.purchaseNote}>برای تأیید قیمت، موجودی و هماهنگی سفارش تماس بگیرید.</p>
        </div>
      </div>
    </div>
  )
}
