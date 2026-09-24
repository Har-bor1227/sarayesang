
import Image from 'next/image'
import Link from 'next/link'

import {
  ArrowLeft,
  ArrowUpLeft,
} from 'lucide-react'

import Container from '@/components/ui/container'

import type { PostSummary } from '@/types/wordpress'

interface ArticlesSectionProps {
  articles: PostSummary[]
}

const PLACEHOLDER =
  '/images/home/product-placeholder.webp'

function articleData(article: PostSummary) {
  return {
    category:
      article.categories?.nodes?.[0]?.name ||
      'مقالات',
    image:
      article.featuredImage?.node?.sourceUrl ||
      PLACEHOLDER,
    alt:
      article.featuredImage?.node?.altText ||
      article.title,
    href: article.slug
      ? `/blog/${encodeURIComponent(article.slug)}`
      : '/blog',
    excerpt: stripHtml(article.excerpt),
  }
}

function stripHtml(value?: string | null) {
  if (!value) return ''

  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(
      /&(nbsp|amp|lt|gt|#39|quot);/gi,
      (match) =>
        ({
          '&nbsp;': ' ',
          '&amp;': '&',
          '&lt;': '<',
          '&gt;': '>',
          '&#39;': "'",
          '&quot;': '"',
        })[match.toLowerCase()] || '',
    )
    .replace(/\s+/g, ' ')
    .trim()
}

function FeaturedArticle({
  article,
}: {
  article: PostSummary
}) {
  const {
    category,
    image,
    alt,
    href,
    excerpt,
  } = articleData(article)

  return (
    <article
      className="
        group
        relative
        aspect-[1.4]
        overflow-hidden
        rounded-[22px]
        bg-[#0A1929]
        lg:aspect-[1.28]
        lg:rounded-[26px]
      "
    >
      <Link
        href={href}
        aria-label={article.title}
        className="absolute inset-0"
      >
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(max-width: 1023px) 100vw, 62vw"
          className="
            object-cover
            transition-transform
            duration-700
            ease-out
            group-hover:scale-[1.04]
          "
        />

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,25,41,.02)_15%,rgba(10,25,41,.12)_42%,rgba(10,25,41,.9)_100%)]" />
      </Link>

      <div
        className="
          absolute
          inset-x-0
          bottom-0
          z-10
          p-4
          sm:p-5
          lg:p-7
        "
      >
        <div className="mb-2.5 flex items-center gap-2">
          <span
            className="
              rounded-full
              border
              border-white/20
              bg-white/10
              px-2.5
              py-1
              text-[8px]
              font-bold
              text-white
              backdrop-blur-md
              sm:text-[9px]
            "
          >
            {category}
          </span>

          <span className="h-px w-7 bg-[#B79464]" />

          <span className="text-[7px] font-semibold uppercase tracking-[.16em] text-white/65 sm:text-[8px]">
            Featured
          </span>
        </div>

        <h3
          className="
            max-w-[700px]
            text-right
            text-[18px]
            font-black
            leading-[1.55]
            tracking-[-.02em]
            text-white
            sm:text-[24px]
            md:text-[28px]
            lg:text-[34px]
          "
        >
          {article.title}
        </h3>

        {excerpt && (
          <p className="mt-2 line-clamp-2 max-w-[620px] text-[9px] font-medium leading-6 text-white/75 sm:text-[10px] sm:leading-7">
            {excerpt}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between gap-3 sm:mt-4">
          <span className="inline-flex items-center gap-1.5 text-[8px] font-black text-white sm:text-[9px]">
            مطالعه مقاله
            <ArrowLeft
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1"
              aria-hidden="true"
            />
          </span>

          <span className="text-[7px] tracking-[.14em] text-white/50 sm:text-[8px]">
            SARAYE SANG
          </span>
        </div>
      </div>

      <span
        aria-hidden="true"
        className="
          absolute
          right-3.5
          top-3.5
          z-10
          flex
          h-8
          w-8
          items-center
          justify-center
          rounded-full
          border
          border-white/15
          bg-black/10
          text-white
          backdrop-blur-md
          sm:right-4
          sm:top-4
          sm:h-9
          sm:w-9
        "
      >
        <ArrowUpLeft
          className="h-3.5 w-3.5"
          strokeWidth={1.8}
        />
      </span>
    </article>
  )
}

function SecondaryArticle({
  article,
}: {
  article: PostSummary
}) {
  const {
    category,
    image,
    alt,
    href,
    excerpt,
  } = articleData(article)

  return (
    <article
      className="
        group
        flex
        min-h-[150px]
        overflow-hidden
        rounded-[18px]
        border
        border-[#112F50]/[.07]
        bg-[#FCFCFB]
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:border-[#B79464]/25
        hover:shadow-[0_14px_32px_rgba(10,25,41,.07)]
        sm:min-h-[160px]
      "
    >
      <Link
        href={href}
        aria-label={article.title}
        className="relative w-[37%] shrink-0 overflow-hidden sm:w-[39%]"
      >
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(max-width: 639px) 37vw, (max-width: 1023px) 39vw, 20vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
        />

        <span className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-black/10 text-white backdrop-blur-md">
          <ArrowUpLeft
            className="h-3 w-3"
            strokeWidth={1.8}
          />
        </span>
      </Link>

      <div
        dir="rtl"
        className="flex min-w-0 flex-1 flex-col justify-between p-3 sm:p-3.5"
      >
        <div>
          <div className="mb-1.5 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#B79464]" />

            <span className="truncate text-[7px] font-black text-[#667085] sm:text-[8px]">
              {category}
            </span>
          </div>

          <Link href={href}>
            <h3 className="line-clamp-3 text-[11px] font-black leading-[1.75] tracking-[-.01em] text-[#112F50] transition-colors group-hover:text-[#76582f] sm:text-[12px]">
              {article.title}
            </h3>
          </Link>

          {excerpt && (
            <p className="mt-1.5 line-clamp-2 text-[7.5px] font-medium leading-[1.8] text-[#667085] sm:text-[8.5px]">
              {excerpt}
            </p>
          )}
        </div>

        <div className="mt-2 flex items-center gap-2">
          <Link
            href={href}
            className="inline-flex min-h-8 shrink-0 items-center gap-1 text-[7px] font-black text-[#112F50] transition-colors hover:text-[#76582f] sm:text-[8px]"
          >
            مطالعه مقاله

            <ArrowLeft
              className="h-3 w-3 transition-transform duration-300 group-hover:-translate-x-1"
              aria-hidden="true"
            />
          </Link>

          <span className="h-px flex-1 bg-[#112F50]/[.07]" />
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

  const [featuredArticle, ...secondaryArticles] =
    visibleArticles

  return (
    <section
      dir="rtl"
      aria-label="مقالات و دانش سرای سنگ"
      className="w-full bg-[#FCFCFB] px-3 pb-6 pt-3 sm:px-0 sm:pb-7 sm:pt-4 lg:pb-9 lg:pt-6"
    >
      <Container>
        {/* Header */}
        <div className="mx-auto mb-5 max-w-[700px] text-center sm:mb-6 md:mb-7">
          <div className="mb-2.5 flex items-center justify-center gap-2.5">
            <span className="h-px w-7 bg-[#B79464] sm:w-9" />

            <span className="text-[8px] font-black uppercase tracking-[.2em] text-[#76582f] sm:text-[9px]">
              Knowledge &amp; Stories
            </span>

            <span className="h-px w-7 bg-[#B79464] sm:w-9" />
          </div>

          <h2 className="text-[25px] font-black leading-[1.4] tracking-[-.035em] text-[#112F50] sm:text-[31px] md:text-[36px] lg:text-[40px]">
            دانش، تجربه
            <span className="text-[#76582f]">
              ، الهام
            </span>
          </h2>

          <Link
            href="/blog"
            className="
              group
              mx-auto
              mt-3
              inline-flex
              min-h-9
              items-center
              gap-2
              rounded-full
              border
              border-[#112F50]/10
              bg-white
              px-3.5
              text-[8px]
              font-black
              text-[#112F50]
              shadow-[0_4px_14px_rgba(10,25,41,.04)]
              transition-all
              hover:border-[#B79464]/25
              hover:text-[#76582f]
              sm:text-[9px]
            "
          >
            مشاهده همه مقالات

            <ArrowLeft
              className="h-3 w-3 transition-transform duration-300 group-hover:-translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>

        {/* Articles */}
        <div className="grid gap-3 lg:grid-cols-[1.2fr_.8fr] lg:gap-4">
          <FeaturedArticle article={featuredArticle} />

          {secondaryArticles.length > 0 && (
            <div className="grid gap-3">
              {secondaryArticles.map((article) => (
                <SecondaryArticle
                  key={article.id}
                  article={article}
                />
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}

