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
      /&(nbsp|amp|lt|gt|quot|apos|#39|#8217|#8220|#8221|ndash|mdash|hellip);/gi,
      (match) =>
        ({
          '&nbsp;': ' ',
          '&amp;': '&',
          '&lt;': '<',
          '&gt;': '>',
          '&quot;': '"',
          '&apos;': "'",
          '&#39;': "'",
          '&#8217;': '’',
          '&#8220;': '“',
          '&#8221;': '”',
          '&ndash;': '–',
          '&mdash;': '—',
          '&hellip;': '…',
        })[match.toLowerCase()] ?? '',
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
        isolate
        min-h-[350px]
        overflow-hidden
        rounded-[26px]
        bg-[#0A1929]
        shadow-[0_18px_50px_rgba(10,25,41,0.10)]
        sm:min-h-[420px]
        sm:rounded-[30px]
        lg:min-h-[500px]
      "
    >
      {/* تصویر اصلی مقاله */}
      <Link
        href={href}
        aria-label={`مطالعه مقاله: ${article.title}`}
        className="absolute inset-0 z-0 overflow-hidden"
      >
        <Image
          src={image}
          alt={alt}
          fill
          sizes="
            (max-width: 1023px) 100vw,
            (max-width: 1359px) 55vw,
            680px
          "
          className="
            object-cover
            transition-transform
            duration-1000
            ease-out
            group-hover:scale-[1.045]
          "
        />
      </Link>

      {/* لایه خوانایی متن */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          z-10
          bg-[linear-gradient(180deg,rgba(10,25,41,0.20)_0%,rgba(10,25,41,0.02)_30%,rgba(10,25,41,0.30)_55%,rgba(10,25,41,0.94)_100%)]
        "
      />

      {/* جزئیات بالای تصویر */}
      <div
        dir="rtl"
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          z-20
          flex
          items-start
          justify-between
          gap-3
          p-4
          sm:p-5
          lg:p-6
        "
      >
        <span
          className="
            inline-flex
            max-w-[65%]
            items-center
            gap-2
            rounded-full
            border
            border-white/20
            bg-[#0A1929]/35
            px-3.5
            py-2
            text-[11px]
            font-bold
            text-white
            backdrop-blur-xl
            sm:text-xs
          "
        >
          <span
            aria-hidden="true"
            className="
              h-1.5
              w-1.5
              shrink-0
              rounded-full
              bg-[#D8B886]
            "
          />

          <span className="truncate">
            {category}
          </span>
        </span>

        <span
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            border-white/20
            bg-white/10
            text-white
            backdrop-blur-xl
            transition-colors
            duration-300
            group-hover:border-[#D8B886]/70
            group-hover:bg-[#B79464]/25
            sm:h-11
            sm:w-11
          "
        >
          <ArrowUpLeft
            aria-hidden="true"
            className="h-[18px] w-[18px]"
            strokeWidth={1.6}
          />
        </span>
      </div>

      {/* محتوای اصلی */}
      <div
        dir="rtl"
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          z-20
          p-5
          sm:p-7
          lg:p-8
        "
      >
        <div className="mb-3 flex items-center gap-3">
          <span
            className="
              text-[10px]
              font-bold
              tracking-[0.03em]
              text-[#E0C39A]
              sm:text-xs
            "
          >
            پیشنهاد مجله سرای سنگ
          </span>

          <span
            aria-hidden="true"
            className="h-px w-9 bg-[#B79464] sm:w-12"
          />
        </div>

        <h3
          className="
            max-w-[650px]
            text-right
            text-[24px]
            font-black
            leading-[1.65]
            tracking-[-0.035em]
            text-white
            sm:text-[30px]
            sm:leading-[1.6]
            md:text-[34px]
            lg:text-[36px]
            xl:text-[39px]
          "
        >
          {article.title}
        </h3>

        {excerpt && (
          <p
            className="
              mt-3
              line-clamp-2
              max-w-[570px]
              text-right
              text-[12px]
              font-medium
              leading-[2]
              text-white/75
              sm:mt-4
              sm:text-[13px]
              sm:leading-7
            "
          >
            {excerpt}
          </p>
        )}

        <div
          className="
            mt-5
            flex
            items-center
            justify-between
            gap-3
            border-t
            border-white/20
            pt-4
            sm:mt-6
            sm:pt-5
          "
        >
          <span
            className="
              inline-flex
              items-center
              gap-2
              text-[12px]
              font-extrabold
              text-white
              sm:text-sm
            "
          >
            مطالعه مقاله

            <ArrowLeft
              aria-hidden="true"
              className="
                h-4
                w-4
                text-[#E0C39A]
                transition-transform
                duration-300
                group-hover:-translate-x-1
              "
            />
          </span>

          <span
            className="
              text-[10px]
              font-medium
              tracking-wide
              text-white/55
              sm:text-xs
            "
          >
            سرای سنگ
          </span>
        </div>
      </div>
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
        min-h-[128px]
        overflow-hidden
        rounded-[20px]
        border
        border-[#112F50]/[0.08]
        bg-white
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:border-[#B79464]/45
        hover:shadow-[0_12px_30px_rgba(10,25,41,0.07)]
        sm:min-h-[136px]
        lg:min-h-[115px]
      "
    >
      {/* تصویر بندانگشتی */}
      <Link
        href={href}
        aria-label={`مطالعه مقاله: ${article.title}`}
        className="
          relative
          block
          w-[34%]
          min-w-[108px]
          shrink-0
          overflow-hidden
          bg-[#F0EDE7]
          sm:w-[32%]
          lg:w-[34%]
        "
      >
        <Image
          src={image}
          alt={alt}
          fill
          sizes="
            (max-width: 639px) 34vw,
            (max-width: 1023px) 32vw,
            190px
          "
          className="
            object-cover
            transition-transform
            duration-700
            ease-out
            group-hover:scale-[1.06]
          "
        />

        <span
          aria-hidden="true"
          className="
            absolute
            bottom-2
            left-2
            flex
            h-7
            w-7
            items-center
            justify-center
            rounded-full
            border
            border-white/30
            bg-[#0A1929]/35
            text-white
            backdrop-blur-md
            transition-colors
            group-hover:bg-[#B79464]
            sm:bottom-2.5
            sm:left-2.5
            sm:h-8
            sm:w-8
          "
        >
          <ArrowUpLeft
            className="h-3.5 w-3.5"
            strokeWidth={1.7}
          />
        </span>
      </Link>

      {/* متن مقاله */}
      <div
        dir="rtl"
        className="
          flex
          min-w-0
          flex-1
          flex-col
          justify-between
          p-3
          sm:p-3.5
          lg:p-3
          xl:p-3.5
        "
      >
        <div className="min-w-0">
          <div className="mb-1.5 flex items-center gap-2 sm:mb-2">
            <span
              aria-hidden="true"
              className="
                h-1.5
                w-1.5
                shrink-0
                rounded-full
                bg-[#B79464]
              "
            />

            <span
              className="
                truncate
                text-[10px]
                font-bold
                text-[#76582F]
                sm:text-[11px]
              "
            >
              {category}
            </span>
          </div>

          <h3
            className="
              text-[13px]
              font-extrabold
              leading-[1.85]
              tracking-[-0.015em]
              text-[#112F50]
              transition-colors
              duration-300
              group-hover:text-[#76582F]
              sm:text-sm
              sm:leading-[1.9]
              lg:text-[13px]
              lg:leading-[1.8]
              xl:text-sm
            "
          >
            <Link
              href={href}
              className="
                rounded-sm
                outline-none
                focus-visible:ring-2
                focus-visible:ring-[#B79464]
                focus-visible:ring-offset-2
              "
            >
              {article.title}
            </Link>
          </h3>

          {excerpt && (
            <p
              className="
                mt-1.5
                hidden
                line-clamp-2
                text-[11px]
                font-medium
                leading-[1.8]
                text-[#667085]
                sm:block
                lg:hidden
              "
            >
              {excerpt}
            </p>
          )}
        </div>

        <div
          className="
            mt-2
            flex
            items-center
            justify-between
            gap-2
            border-t
            border-[#112F50]/[0.07]
            pt-2
          "
        >
          <Link
            href={href}
            aria-label={`ادامه مطلب: ${article.title}`}
            className="
              inline-flex
              min-h-7
              items-center
              gap-1.5
              rounded-sm
              text-[10px]
              font-extrabold
              text-[#112F50]
              transition-colors
              hover:text-[#76582F]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#B79464]
              sm:text-[11px]
            "
          >
            ادامه مطلب

            <ArrowLeft
              aria-hidden="true"
              className="
                h-3.5
                w-3.5
                transition-transform
                duration-300
                group-hover:-translate-x-0.5
              "
            />
          </Link>

          <span
            className="
              truncate
              text-[10px]
              font-medium
              text-[#98A2B3]
            "
          >
            مجله سرای سنگ
          </span>
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

  const [
    featuredArticle,
    ...secondaryArticles
  ] = visibleArticles

  return (
    <section
      dir="rtl"
      aria-labelledby="articles-heading"
      className="
        relative
        isolate
        w-full
        overflow-hidden
        border-y
        border-[#112F50]/[0.05]
        bg-[#FCFCFB]
        px-4
        py-12
        sm:py-16
        lg:px-0
        lg:py-[76px]
      "
    >
      {/* جزئیات ظریف پس‌زمینه */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-40
          top-0
          -z-10
          h-[360px]
          w-[360px]
          rounded-full
          border
          border-[#B79464]/[0.10]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-28
          top-12
          -z-10
          h-[260px]
          w-[260px]
          rounded-full
          border
          border-[#B79464]/[0.09]
        "
      />

      <Container>
        {/* سربرگ مجله */}
        <div
          className="
            relative
            mb-7
            flex
            flex-col
            gap-5
            sm:mb-9
            lg:mb-10
            lg:flex-row
            lg:items-end
            lg:justify-between
            lg:gap-8
          "
        >
          <div className="min-w-0 max-w-[780px]">
            <div className="mb-4 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="
                  h-7
                  w-[3px]
                  rounded-full
                  bg-[#B79464]
                  sm:h-8
                "
              />

              <span
                className="
                  text-[11px]
                  font-extrabold
                  tracking-wide
                  text-[#76582F]
                  sm:text-xs
                "
              >
                مجله سرای سنگ
              </span>

              <span
                aria-hidden="true"
                className="
                  h-px
                  w-12
                  bg-[#B79464]/50
                  sm:w-16
                "
              />

              <span
                className="
                  text-[10px]
                  font-medium
                  text-[#98A2B3]
                  sm:text-[11px]
                "
              >
                دانش، متریال و معماری
              </span>
            </div>

            <h2
              id="articles-heading"
              className="
                text-[29px]
                font-black
                leading-[1.55]
                tracking-[-0.04em]
                text-[#112F50]
                sm:text-[36px]
                sm:leading-[1.5]
                md:text-[40px]
                lg:text-[44px]
              "
            >
              روایت‌هایی از

              <span className="text-[#9A7545]">
                {' '}دل سنگ
              </span>
            </h2>

            <p
              className="
                mt-3
                max-w-[600px]
                text-[13px]
                font-medium
                leading-[2]
                text-[#667085]
                sm:mt-4
                sm:text-sm
                sm:leading-8
                lg:text-[15px]
              "
            >
              از شناخت انواع سنگ و انتخاب آگاهانه تا جزئیات
              اجرا و ایده‌هایی برای خلق فضاهای ماندگار.
            </p>
          </div>

          {/* پیوند همه مقالات */}
          <div className="flex shrink-0 lg:pb-1">
            <Link
              href="/blog"
              className="
                group
                inline-flex
                min-h-12
                w-full
                items-center
                justify-center
                gap-3
                rounded-full
                border
                border-[#112F50]/[0.12]
                bg-white
                px-5
                text-xs
                font-extrabold
                text-[#112F50]
                shadow-[0_4px_16px_rgba(10,25,41,0.035)]
                transition-all
                duration-300
                hover:border-[#B79464]/60
                hover:bg-[#112F50]
                hover:text-white
                sm:w-auto
                sm:px-6
                sm:text-[13px]
              "
            >
              مشاهده همه مقالات

              <span
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-full
                  bg-[#F3EFE7]
                  text-[#76582F]
                  transition-colors
                  duration-300
                  group-hover:bg-white/10
                  group-hover:text-[#E0C39A]
                "
              >
                <ArrowLeft
                  aria-hidden="true"
                  className="
                    h-3.5
                    w-3.5
                    transition-transform
                    duration-300
                    group-hover:-translate-x-1
                  "
                />
              </span>
            </Link>
          </div>
        </div>

        {/* شبکه مقالات */}
        <div
          className={`
            relative
            grid
            gap-3
            sm:gap-4
            lg:gap-5
            ${
              secondaryArticles.length > 0
                ? 'lg:grid-cols-[minmax(0,1.13fr)_minmax(0,0.87fr)]'
                : 'lg:grid-cols-1'
            }
          `}
        >
          <FeaturedArticle
            article={featuredArticle}
          />

          {secondaryArticles.length > 0 && (
            <div
              className="
                grid
                content-start
                gap-3
                sm:gap-3.5
                lg:gap-3
              "
            >
              {secondaryArticles.map((article) => (
                <SecondaryArticle
                  key={article.id}
                  article={article}
                />
              ))}
            </div>
          )}
        </div>

        {/* امضای پایانی بخش */}
        <div
          className="
            mt-7
            flex
            items-center
            justify-between
            gap-4
            border-t
            border-[#112F50]/[0.07]
            pt-4
            sm:mt-8
            sm:pt-5
          "
        >
        </div>
      </Container>
    </section>
  )
}