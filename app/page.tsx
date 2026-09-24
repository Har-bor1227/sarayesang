
import { getHomePageData } from '@/lib/repositories/home-repository'
import { getPosts } from '@/lib/repositories/post-repository'

import Container from '@/components/ui/container'

import HeroSection from '@/components/home/HeroSection'
import SmartSearchSection from '@/components/home/SmartSearchSection'
import StoneCategoryCarousel from '@/components/home/StoneCategoryCarousel'
import StoneFinderSection from '@/components/home/StoneFinderSection'
import ProductCarousel from '@/components/home/ProductCarousel'
import StoryShowcase from '@/components/home/StoryShowcase'
import PromoBanners from '@/components/home/PromoBanners'
import FaqSection from '@/components/home/FaqSection'
import ComparisonSection from '@/components/home/ComparisonSection'
import StoneCategoryCollage from '@/components/home/StoneCategoryCollage'
import PriceInquiryCTA from '@/components/home/PriceInquiryCTA'
import ArticlesSection from '@/components/home/ArticlesSection'
import TrustStrip from '@/components/home/TrustStrip'

export const revalidate = 3600

export default async function HomePage() {
  const [
    homeData,
    postsConnection,
  ] = await Promise.all([
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
      dir="rtl"
      className="
        w-full
        max-w-full
        overflow-x-clip
        bg-[#FCFCFB]
      "
    >
      <h1 className="sr-only">
        سرای سنگ؛ مرجع تخصصی سنگ‌های ساختمانی و
        استعلام قیمت
      </h1>

      {/* Hero */}
      <HeroSection />

<StoneFinderSection />

      {/* Stone Categories */}
      <StoneCategoryCarousel
        categories={categories}
      />
{/* Stories */}
      <StoryShowcase />

      {/* Featured Products */}
      <section
        aria-label="محصولات منتخب"
        className="
          w-full
          py-4
          sm:py-5
          lg:py-6
        "
      >
        <Container>
          <ProductCarousel
            products={primaryProducts}
            theme="navy"
          />
        </Container>
      </section>

      {/* Promotional Banners */}
      <PromoBanners />

      {/* Recent Products */}
      <section
        aria-label="جدیدترین محصولات"
        className="
          w-full
          py-4
          sm:py-5
          lg:py-6
        "
      >
        <Container>
          <ProductCarousel
            products={secondaryProducts}
            theme="gold"
          />
        </Container>
      </section>

      {/* Comparison */}
      <ComparisonSection />

      {/* Stone Categories Collage */}
      <StoneCategoryCollage />
      {/* Smart Search */}
            <SmartSearchSection />
      {/* Price Inquiry */}
      <PriceInquiryCTA />

      {/* Articles */}
      <ArticlesSection
        articles={articles}
      />

      {/* FAQ */}
      <FaqSection />

      {/* Trust */}
      <TrustStrip />
    </div>
  )
}

