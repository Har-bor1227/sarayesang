import { sanitizeWordPressHtml } from '@/lib/security/sanitize-wordpress-html'
import WordPressArticleContent from '@/components/blog/WordPressArticleContent'

import styles from './ProductDetail.module.css'

type ProductDescriptionProps = {
  description?: string | null
}

export default function ProductDescription({
  description,
}: ProductDescriptionProps) {
  if (!description?.trim()) {
    return null
  }

  const safeDescription = sanitizeWordPressHtml(description)

  if (!safeDescription) {
    return null
  }

  return (
    <section
      id="product-description"
      className={styles.description}
      aria-labelledby="product-description-title"
    >
      <header className={styles.sectionHeading}>
        <span aria-hidden="true" />
        <div>
          <p>شناخت و انتخاب سنگ</p>
          <h2 id="product-description-title">درباره این محصول</h2>
        </div>
      </header>

      <WordPressArticleContent
        sanitizedHtml={safeDescription}
        className={styles.richText}
      />
    </section>
  )
}