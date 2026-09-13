import Image from 'next/image'
import Link from 'next/link'

import { ArrowLeft, ArrowUpLeft } from 'lucide-react'

import Container from '@/components/ui/container'

import type { PostSummary } from '@/types/wordpress'

interface ArticlesSectionProps {
  articles: PostSummary[]
}

function getArticleCategory(article: PostSummary) {
  return article.categories?.nodes?.[0]?.name || 'مقالات'
}

function getArticleImage(article: PostSummary) {
  return (
    article.featuredImage?.node?.sourceUrl ||
    '/images/home/product-placeholder.webp'
  )
}

function getArticleImageAlt(article: PostSummary) {
  return article.featuredImage?.node?.altText || article.title
}

function getArticleHref(article: PostSummary) {
  return article.slug
    ? `/blog/${encodeURIComponent(article.slug)}`
    : '/blog'
}

function stripHtml(value?: string | null) {
  if (!value) return ''

  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#39;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

function FeaturedArticle({
  article,
}: {
  article: PostSummary
}) {
  const category = getArticleCategory(article)
  const image = getArticleImage(article)
  const imageAlt = getArticleImageAlt(article)
  const href = getArticleHref(article)
  const excerpt = stripHtml(article.excerpt)

  return (
    <article className="group relative min-h-[430px] overflow-hidden rounded-[28px] bg-[#0A1929] sm:min-h-[500px] lg:min-h-[610px]">
      <Link
        href={href}
        aria-label={article.title}
        className="absolute inset-0"
      >
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(max-width: 1023px) 100vw, 58vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
          priority
        />

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,25,41,0.03)_10%,rgba(10,25,41,0.10)_36%,rgba(10,25,41,0.88)_100%)]" />

        <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(10,25,41,0.18),transparent)]" />
      </Link>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-5 sm:p-7 lg:p-9">
        <div className="mb-4 flex items-center gap-3">
          <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[9px] font-bold text-white backdrop-blur-md sm:text-[10px]">
            {category}
          </span>

          <span className="h-px w-8 bg-[#B79464] sm:w-12" />

          <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/60 sm:text-[10px]">
            Featured Insight
          </span>
        </div>

        <h3 className="max-w-[760px] text-right text-[25px] font-black leading-[1.55] tracking-[-0.025em] text-white sm:text-[32px] sm:leading-[1.5] lg:text-[42px] lg:leading-[1.45]">
          {article.title}
        </h3>

        {excerpt ? (
          <p className="mt-3 max-w-[680px] line-clamp-2 text-right text-[11px] font-medium leading-7 text-white/72 sm:mt-4 sm:text-[13px] sm:leading-8">
            {excerpt}
          </p>
        ) : null}

        <div className="mt-5 flex items-center justify-between gap-4 sm:mt-7">
          <span className="inline-flex items-center gap-2 text-[10px] font-black text-white sm:text-[11px]">
            مطالعه مقاله
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
          </span>

          <span className="text-[9px] font-medium tracking-[0.16em] text-white/45">
            SARAYE SANG
          </span>
        </div>
      </div>

      <div className="pointer-events-none absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition-all duration-300 group-hover:border-[#B79464]/60 group-hover:bg-[#B79464] sm:right-7 sm:top-7">
        <ArrowUpLeft className="h-4 w-4" />
      </div>
    </article>
  )
}

function SecondaryArticle({
  article,
}: {
  article: PostSummary
}) {
  const category = getArticleCategory(article)
  const image = getArticleImage(article)
  const imageAlt = getArticleImageAlt(article)
  const href = getArticleHref(article)
  const excerpt = stripHtml(article.excerpt)

  return (
    <article className="group flex min-h-[220px] overflow-hidden rounded-[22px] border border-[#112F50]/[0.07] bg-[#FCFCFB] transition-all duration-400 hover:-translate-y-1 hover:border-[#B79464]/25 hover:shadow-[0_18px_45px_rgba(10,25,41,0.08)] sm:min-h-[245px]">
      <Link
        href={href}
        aria-label={article.title}
        className="relative block w-[38%] shrink-0 overflow-hidden sm:w-[41%]"
      >
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(max-width: 639px) 38vw, (max-width: 1023px) 41vw, 20vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.055]"
        />

        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(10,25,41,0.25))]" />

        <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/10 text-white backdrop-blur-md sm:right-4 sm:top-4">
          <ArrowUpLeft className="h-3.5 w-3.5" />
        </span>
      </Link>

      <div
        className="flex min-w-0 flex-1 flex-col justify-between p-4 sm:p-5"
        dir="rtl"
      >
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#B79464]" />

            <span className="min-w-0 truncate text-[8px] font-black text-[#667085] sm:text-[9px]">
              {category}
            </span>
          </div>

          <Link href={href} className="block">
            <h3 className="line-clamp-3 text-[13px] font-black leading-[1.8] tracking-[-0.015em] text-[#112F50] transition-colors duration-300 group-hover:text-[#B79464] sm:text-[15px] sm:leading-[1.75]">
              {article.title}
            </h3>
          </Link>

          {excerpt ? (
            <p className="mt-2.5 line-clamp-2 text-[8.5px] font-medium leading-[1.9] text-[#667085] sm:mt-3 sm:text-[9.5px]">
              {excerpt}
            </p>
          ) : null}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 text-[8px] font-black text-[#112F50] transition-colors duration-300 hover:text-[#B79464] sm:text-[9px]"
          >
            <span>مطالعه مقاله</span>

            <ArrowLeft className="h-3 w-3 transition-transform duration-300 group-hover:-translate-x-1" />
          </Link>

          <span className="h-px flex-1 bg-[#112F50]/[0.08]" />
        </div>
      </div>
    </article>
  )
}

export default function ArticlesSection({
  articles,
}: ArticlesSectionProps) {
  const visibleArticles = articles.slice(0, 5)

  if (!visibleArticles.length) {
    return null
  }

  const featuredArticle = visibleArticles[0]
  const secondaryArticles = visibleArticles.slice(1, 5)

  return (
    <section
      className="w-full overflow-hidden bg-[#FCFCFB] py-16 sm:py-20 lg:py-24"
      dir="rtl"
      aria-label="مقالات و دانش سرای سنگ"
    >
      <Container>
        {/* =========================================================
            SECTION HEADER
        ========================================================== */}
        <div className="mb-9 flex flex-col gap-6 sm:mb-11 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[700px]">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-[#B79464] sm:w-10" />

              <span className="text-[9px] font-black uppercase tracking-[0.22em] text-[#B79464] sm:text-[10px]">
                Knowledge &amp; Stories
              </span>
            </div>

            <h2 className="text-[30px] font-black leading-[1.45] tracking-[-0.035em] text-[#112F50] sm:text-[38px] sm:leading-[1.4] lg:text-[46px]">
              دانش، تجربه
              <span className="text-[#B79464]">، الهام</span>
            </h2>

            <p className="mt-3 max-w-[610px] text-[11px] font-medium leading-7 text-[#667085] sm:mt-4 sm:text-[13px] sm:leading-8">
              روایت‌ها، نکات تخصصی و تجربه‌های ما درباره سنگ، انتخاب متریال
              و معماری ماندگار.
            </p>
          </div>

          <Link
            href="/blog"
            className="group inline-flex w-fit items-center gap-3 border-b border-[#112F50]/20 pb-2 text-[10px] font-black text-[#112F50] transition-colors duration-300 hover:border-[#B79464] hover:text-[#B79464] sm:text-[11px]"
          >
            <span>مشاهده همه مقالات</span>

            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
          </Link>
        </div>

        {/* =========================================================
            EDITORIAL GRID
        ========================================================== */}
        <div className="grid gap-4 lg:grid-cols-[1.12fr_0.88fr] lg:gap-5">
          {/* FEATURED */}
          <FeaturedArticle article={featuredArticle} />

          {/* SECONDARY ARTICLES */}
          {secondaryArticles.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:gap-5">
              {secondaryArticles.map((article) => (
                <SecondaryArticle
                  key={article.id}
                  article={article}
                />
              ))}
            </div>
          ) : null}
        </div>

        {/* =========================================================
            BOTTOM BRAND LINE
        ========================================================== */}
        <div className="mt-8 flex items-center gap-4 sm:mt-10">
          <span className="h-px flex-1 bg-[#112F50]/[0.08]" />

          <span className="text-[8px] font-black tracking-[0.25em] text-[#667085]/55 sm:text-[9px]">
            SARAYE SANG / INSIGHTS
          </span>

          <span className="h-px flex-1 bg-[#112F50]/[0.08]" />

        </div>
      </Container>
    </section>
  )
}