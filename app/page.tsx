import { getHomePageData } from '@/lib/repositories/home-repository'
import { getPosts } from '@/lib/repositories/post-repository'

import Container from '@/components/ui/container'

import HeroSection from '@/components/home/HeroSection'
import StoneCategoryCarousel from '@/components/home/StoneCategoryCarousel'
import ProductCarousel from '@/components/home/ProductCarousel'
import PromoBanners from '@/components/home/PromoBanners'
import ComparisonSection from '@/components/home/ComparisonSection'
import StoneCategoryCollage from '@/components/home/StoneCategoryCollage'
import PriceInquiryCTA from '@/components/home/PriceInquiryCTA'
import ArticlesSection from '@/components/home/ArticlesSection'
import TrustStrip from '@/components/home/TrustStrip'

export const revalidate = 3600

export default async function HomePage() {
  const [homeData, postsConnection] =
    await Promise.all([
      getHomePageData(),
      getPosts({
        first: 5,
      }),
    ])

  const featuredProducts =
    homeData?.featuredProducts?.nodes ?? []

  const recentProducts =
    homeData?.recentProducts?.nodes ?? []

  const categories =
    homeData?.productCategories?.nodes ?? []

  const articles =
    postsConnection?.nodes ?? []

  const primaryProducts =
    featuredProducts.length > 0
      ? featuredProducts
      : recentProducts.slice(0, 5)

  const secondaryProducts =
    recentProducts.length > 0
      ? recentProducts
      : featuredProducts

  return (
    <div
      className="w-full max-w-full overflow-x-clip bg-[#FCFCFB]"
      dir="rtl"
    >
      {/* =========================================================
          HERO
      ========================================================== */}
      <HeroSection />

      {/* =========================================================
          STONE CATEGORIES
      ========================================================== */}
      <StoneCategoryCarousel
        categories={
          categories.length > 0
            ? categories
            : []
        }
      />

      {/* =========================================================
          FEATURED PRODUCTS
      ========================================================== */}
      <section className="w-full bg-white pb-10 pt-2 sm:pb-14 sm:pt-4">
        <Container>
          <ProductCarousel
            products={primaryProducts}
            theme="navy"
          />
        </Container>
      </section>

      {/* =========================================================
          PROMO BANNERS
      ========================================================== */}
      <PromoBanners />

      {/* =========================================================
          RECENT PRODUCTS
      ========================================================== */}
      <section className="w-full bg-white py-10 sm:py-14 lg:py-16">
        <Container>
          <ProductCarousel
            products={secondaryProducts}
            theme="gold"
          />
        </Container>
      </section>

      {/* =========================================================
          COMPARISON
          Kept intact for future real product-comparison logic.
      ========================================================== */}
      <ComparisonSection />

      {/* =========================================================
          STONE CATEGORY COLLAGE
      ========================================================== */}
      <StoneCategoryCollage />

      {/* =========================================================
          PRICE INQUIRY
      ========================================================== */}
      <PriceInquiryCTA />

      {/* =========================================================
          ARTICLES
      ========================================================== */}
      <ArticlesSection
        articles={articles}
      />

      {/* =========================================================
          FINAL TRUST STRIP
      ========================================================== */}
      <TrustStrip />
    </div>
  )
}