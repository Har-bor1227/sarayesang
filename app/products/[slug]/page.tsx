import type { Metadata } from 'next'

import { DEFAULT_SOCIAL_IMAGE } from '@/lib/constants'

import { notFound } from 'next/navigation'

import Container from '@/components/ui/container'

import ProductBreadcrumb from '@/components/product/detail/ProductBreadcrumb'
import ProductDescription from '@/components/product/detail/ProductDescription'
import ProductGallery from '@/components/product/detail/ProductGallery'
import ProductInfo from '@/components/product/detail/ProductInfo'

import { getProductPageData } from '@/lib/repositories/product-page-repository'
import { rankMathToMetadata } from '@/lib/rank-math'

import {
  generateBreadcrumbSchema,
  generateProductSchema,
  JsonLd,
} from '@/lib/seo'

import {
  SITE_NAME,
  SITE_URL,
  TEL_PHONE,
} from '@/lib/constants'

export const revalidate = 3600

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

type ProductData = NonNullable<
  Awaited<
    ReturnType<typeof getProductPageData>
  >['product']
>

function getFrontendProductUrl(
  slug: string,
): string {
  return `${SITE_URL.replace(
    /\/+$/,
    '',
  )}/products/${encodeURIComponent(slug)}`
}

function stripHtml(
  value?: string | null,
): string {
  if (!value) return ''

  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(
      /&nbsp;/gi,
      ' ',
    )
    .replace(
      /&amp;/gi,
      '&',
    )
    .replace(
      /&lt;/gi,
      '<',
    )
    .replace(
      /&gt;/gi,
      '>',
    )
    .replace(
      /&#39;/gi,
      "'",
    )
    .replace(
      /&quot;/gi,
      '"',
    )
    .replace(
      /\s+/g,
      ' ',
    )
    .trim()
}

function getFallbackMetadata(
  product: ProductData,
): Metadata {
  const frontendProductUrl =
    getFrontendProductUrl(product.slug)

  const description =
    stripHtml(
      product.shortDescription ||
        product.description,
    ) || product.name

  const image =
    product.image?.sourceUrl || DEFAULT_SOCIAL_IMAGE

  return {
    title: product.name,

    description,

    alternates: {
      canonical: frontendProductUrl,
    },

    openGraph: {
      type: 'website',
      title: product.name,
      description,
      url: frontendProductUrl,
      siteName: SITE_NAME,
      locale: 'fa_IR',

      images: image
        ? [
            {
              url: image,
              alt:
                product.image?.altText ||
                product.name,
            },
          ]
        : undefined,
    },

    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description,
      images: image
        ? [image]
        : undefined,
    },
  }
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } =
    await params

  const { product, seo } =
    await getProductPageData(slug)

  if (!product) {
    return {
      title: 'محصول یافت نشد',

      description:
        'محصول مورد نظر پیدا نشد.',

      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const frontendProductUrl =
    getFrontendProductUrl(product.slug)

  if (seo) {
    return rankMathToMetadata(
      seo,
      frontendProductUrl,
    )
  }

  return getFallbackMetadata(product)
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } =
    await params

  const { product } =
    await getProductPageData(slug)

  if (!product) {
    notFound()
  }

  const productSchema =
    generateProductSchema(product)

  const breadcrumbSchema =
    generateBreadcrumbSchema([
      {
        name: 'خانه',
        path: '/',
      },
      {
        name: 'محصولات',
        path: '/products',
      },
      {
        name: product.name,
        path: `/products/${product.slug}`,
      },
    ])

  const mainImage = {
    sourceUrl:
      product.image?.sourceUrl ||
      '/images/home/product-placeholder.webp',

    altText:
      product.image?.altText ||
      product.name,
  }

  const galleryImages =
    product.galleryImages?.nodes ?? []

  const categories =
    product.productCategories?.nodes ?? []

  const attributes =
    product.attributes?.nodes ?? []

  const shortDescription =
    stripHtml(
      product.shortDescription,
    )

  return (
    <div
      className="
        w-full
        overflow-hidden
        bg-[#FCFCFB]
      "
      dir="rtl"
    >
      <Container
        className="
          pb-16
          pt-5
          sm:pb-20
          sm:pt-7
          lg:pb-24
        "
      >
        <JsonLd
          data={productSchema}
        />

        <JsonLd
          data={breadcrumbSchema}
        />

        <ProductBreadcrumb
          productName={product.name}
        />

        <main>
          <div
            className="
              grid
              items-start
              gap-7
              lg:grid-cols-[1.08fr_0.92fr]
              lg:gap-10
              xl:gap-14
            "
          >
            <ProductGallery
              productName={product.name}
              mainImage={mainImage}
              galleryImages={
                galleryImages
              }
              onSale={product.onSale}
            />

            <ProductInfo
              productName={product.name}
              categories={categories}
              shortDescription={
                shortDescription
              }
              price={product.price}
              regularPrice={
                product.regularPrice
              }
              onSale={product.onSale}
              acf={product.acf}
              attributes={attributes}
            />
          </div>

          <ProductDescription
            description={
              product.description
            }
          />
        </main>
      </Container>
    </div>
  )
}