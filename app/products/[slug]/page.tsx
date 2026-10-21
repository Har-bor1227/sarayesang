import type { Metadata } from 'next'
import type { ProductDetailAttribute } from '@/components/product/detail/types'
import { notFound } from 'next/navigation'
import ProductBreadcrumb from '@/components/product/detail/ProductBreadcrumb'
import ProductDescription from '@/components/product/detail/ProductDescription'
import ProductGallery from '@/components/product/detail/ProductGallery'
import ProductInfo from '@/components/product/detail/ProductInfo'
import ProductSpecs from '@/components/product/detail/ProductSpecs'
import ProductTechnicalData from '@/components/product/detail/ProductTechnicalData'
import styles from '@/components/product/detail/ProductDetail.module.css'
import { getProductPageData } from '@/lib/repositories/product-page-repository'
import { rankMathToMetadata } from '@/lib/rank-math'
import { generateBreadcrumbSchema, generateProductSchema, JsonLd } from '@/lib/seo'
import { DEFAULT_SOCIAL_IMAGE, SITE_NAME, SITE_URL } from '@/lib/constants'

export const revalidate = 3600
interface ProductPageProps { params: Promise<{ slug: string }> }
type ProductData = NonNullable<Awaited<ReturnType<typeof getProductPageData>>['product']>
function getFrontendProductUrl(slug: string): string {
  return `${SITE_URL.replace(/\/+$/, '')}/products/${encodeURIComponent(slug)}`
}
function stripHtml(value?: string | null): string {
  if (!value) return ''
  return value.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>')
    .replace(/&#39;/gi, "'").replace(/&quot;/gi, '"').replace(/\s+/g, ' ').trim()
}
function getFallbackMetadata(product: ProductData): Metadata {
  const frontendProductUrl = getFrontendProductUrl(product.slug)
  const description = stripHtml(product.shortDescription || product.description) || product.name
  const image = product.image?.sourceUrl || DEFAULT_SOCIAL_IMAGE
  return {
    title: product.name, description,
    alternates: { canonical: frontendProductUrl },
    openGraph: {
      type: 'website', title: product.name, description, url: frontendProductUrl,
      siteName: SITE_NAME, locale: 'fa_IR',
      images: image ? [{ url: image, alt: product.image?.altText || product.name }] : undefined,
    },
    twitter: { card: 'summary_large_image', title: product.name, description, images: image ? [image] : undefined },
  }
}
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const { product, seo } = await getProductPageData(slug)
  if (!product) return {
    title: 'محصول یافت نشد', description: 'محصول مورد نظر پیدا نشد.',
    robots: { index: false, follow: false },
  }
  if (seo) return rankMathToMetadata(seo, getFrontendProductUrl(product.slug))
  return getFallbackMetadata(product)
}
export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const { product } = await getProductPageData(slug)
  if (!product) notFound()
  const categories = product.productCategories?.nodes ?? []
  const attributes: ProductDetailAttribute[] = product.attributes?.nodes ?? []
  const variations = product.variations?.nodes ?? []
  const hasSpecs = [product.acf?.dimensions, product.acf?.weight, product.acf?.stoneType, product.acf?.surfaceFinish, product.acf?.colorFamily, product.acf?.application].some(value => Boolean(value?.trim()))
  const hasTechnicalData = attributes.some(attribute => attribute.variation !== true && attribute.options.some(option => option?.trim()))
  return (
    <div className={styles.page} dir="rtl">
      <div className={styles.shell}>
        <JsonLd data={generateProductSchema(product)} />
        <JsonLd data={generateBreadcrumbSchema([
          { name: 'خانه', path: '/' }, { name: 'محصولات', path: '/products' },
          { name: product.name, path: `/products/${product.slug}` },
        ])} />
        <ProductBreadcrumb productName={product.name} />
        <main>
          <section aria-label="اطلاعات محصول" className={styles.hero}>
            <div className={styles.visual}>
              <ProductGallery
                productName={product.name}
                mainImage={{ sourceUrl: product.image?.sourceUrl || '/images/home/product-placeholder.webp', altText: product.image?.altText || product.name }}
                galleryImages={product.galleryImages?.nodes ?? []}
                onSale={product.onSale}
              />
              <div className={styles.imageNote}>
                <span>بافت و جزئیات سنگ</span>
                <span>رنگ و رگه‌های سنگ طبیعی ممکن است متفاوت باشد.</span>
              </div>
            </div>
            <ProductInfo
              productName={product.name} categories={categories}
              shortDescription={stripHtml(product.shortDescription)}
              price={product.price} regularPrice={product.regularPrice} onSale={product.onSale}
              acf={product.acf} attributes={attributes} variations={variations}
              defaultAttributes={product.defaultAttributes ?? []}
            />
          </section>
          {(hasSpecs || hasTechnicalData) && (
            <div id="product-specifications" className={styles.detailArea}>
              <ProductSpecs acf={product.acf} />
              <ProductTechnicalData attributes={attributes} />
            </div>
          )}
          <ProductDescription description={product.description} />
        </main>
      </div>
    </div>
  )
}
