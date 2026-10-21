import styles from './ProductDetail.module.css'
import type {
  ProductDetailAttribute,
} from './types'

type ProductTechnicalDataProps = {
  attributes: ProductDetailAttribute[]
}

export default function ProductTechnicalData({
  attributes,
}: ProductTechnicalDataProps) {
  const technicalAttributes =
    attributes.filter(
      (attribute) =>
        attribute.variation !== true &&
        attribute.options.some(
          (option) =>
            option?.trim(),
        ),
    )

  if (
    technicalAttributes.length === 0
  ) {
    return null
  }

  return (
    <section aria-labelledby="technical-data-title" className={styles.specSection}>
      <h2 id="technical-data-title">مشخصات فنی</h2>
      <dl className={styles.technicalList}>
        {technicalAttributes.map(attribute => (
          <div key={attribute.id}>
            <dt>{attribute.name}</dt>
            <dd>{attribute.options.map(option => option?.trim()).filter(Boolean).join('، ')}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
