import styles from './ProductDetail.module.css'
import type {
  ProductDetailAcf,
} from './types'

type ProductSpecsProps = {
  acf?: ProductDetailAcf | null
}

const SPEC_ITEMS = [
  {
    key: 'dimensions',
    label: 'ابعاد',
  },
  {
    key: 'weight',
    label: 'وزن',
  },
  {
    key: 'stoneType',
    label: 'نوع سنگ',
  },
  {
    key: 'surfaceFinish',
    label: 'پرداخت سطح',
  },
  {
    key: 'colorFamily',
    label: 'رنگ',
  },
  {
    key: 'application',
    label: 'کاربرد',
  },
] as const

export default function ProductSpecs({
  acf,
}: ProductSpecsProps) {
  const values = {
    dimensions: acf?.dimensions?.trim(),
    weight: acf?.weight?.trim(),
    stoneType: acf?.stoneType?.trim(),
    surfaceFinish:
      acf?.surfaceFinish?.trim(),
    colorFamily:
      acf?.colorFamily?.trim(),
    application:
      acf?.application?.trim(),
  }

  const specs = SPEC_ITEMS.filter(
    (item) =>
      Boolean(values[item.key]),
  )

  if (specs.length === 0) {
    return null
  }

  return (
    <section aria-labelledby="product-specs-title" className={styles.specSection}>
      <h2 id="product-specs-title">ویژگی‌های سنگ</h2>
      <dl className={styles.specGrid}>
        {specs.map(({ key, label }) => (
          <div key={key}>
            <dt>{label}</dt>
            <dd>{values[key]}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
