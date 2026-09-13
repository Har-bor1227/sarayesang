import type { Metadata } from 'next'

import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import {
  ArrowLeft,
  CalendarDays,
} from 'lucide-react'

import Container from '@/components/ui/container'

import {
  getPostBySlug,
} from '@/lib/repositories/post-repository'

import {
  getPostSeo,
} from '@/lib/repositories/seo-repository'

import {
  rankMathToMetadata,
} from '@/lib/rank-math'

import { formatDate } from '@/lib/format'

import {
  generateArticleSchema,
  generateBreadcrumbSchema,
  JsonLd,
} from '@/lib/seo'

import {
  SITE_NAME,
  SITE_URL,
  WORDPRESS_URL,
} from '@/lib/constants'

export const revalidate = 3600

interface PostPageProps {
  params: Promise<{
    slug: string
  }>
}

function getWordPressPostUrl(
  post: {
    slug: string
    uri?: string
  },
): string {
  if (post.uri) {
    if (
      post.uri.startsWith('http://') ||
      post.uri.startsWith('https://')
    ) {
      return post.uri
    }

    return `${WORDPRESS_URL.replace(
      /\/+$/,
      '',
    )}/${post.uri.replace(
      /^\/+/,
      '',
    )}`
  }

  return `${WORDPRESS_URL.replace(
    /\/+$/,
    '',
  )}/${encodeURIComponent(post.slug)}/`
}

function getFrontendPostUrl(
  slug: string,
): string {
  return `${SITE_URL.replace(
    /\/+$/,
    '',
  )}/blog/${encodeURIComponent(slug)}`
}

function stripHtml(
  value?: string | null,
) {
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

function getFallbackPostMetadata(
  post: {
    title: string
    slug: string
    excerpt?: string
    featuredImage?: {
      node?: {
        sourceUrl: string
        altText?: string
      } | null
    } | null
  },
): Metadata {
  const frontendPostUrl =
    getFrontendPostUrl(post.slug)

  const description =
    stripHtml(post.excerpt) ||
    post.title

  const image =
    post.featuredImage?.node?.sourceUrl

  return {
    title: post.title,

    description,

    alternates: {
      canonical: frontendPostUrl,
    },

    openGraph: {
      type: 'article',
      title: post.title,
      description,
      url: frontendPostUrl,
      siteName: SITE_NAME,
      locale: 'fa_IR',

      images: image
        ? [
            {
              url: image,
              alt:
                post.featuredImage?.node
                  ?.altText ||
                post.title,
            },
          ]
        : undefined,
    },

    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: image
        ? [image]
        : undefined,
    },
  }
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params

  const post =
    await getPostBySlug(slug)

  if (!post) {
    return {
      title:
        `مقاله یافت نشد | ${SITE_NAME}`,

      description:
        'مقاله مورد نظر پیدا نشد.',

      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const frontendPostUrl =
    getFrontendPostUrl(post.slug)

  const wordpressUrl =
    getWordPressPostUrl(post)

  const rankMath =
    await getPostSeo(wordpressUrl)

  if (rankMath) {
    return rankMathToMetadata(
      rankMath,
      frontendPostUrl,
    )
  }

  return getFallbackPostMetadata(post)
}

export default async function PostPage({
  params,
}: PostPageProps) {
  const { slug } = await params

  const post =
    await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const articleSchema =
    generateArticleSchema(post)

  const breadcrumbSchema =
    generateBreadcrumbSchema([
      {
        name: 'خانه',
        path: '/',
      },
      {
        name: 'بلاگ',
        path: '/blog',
      },
      {
        name: post.title,
        path: `/blog/${post.slug}`,
      },
    ])

  const featuredImage =
    post.featuredImage?.node

  const excerpt =
    stripHtml(post.excerpt)

  const category =
    post.categories?.nodes?.[0]?.name ||
    'مقالات'

  return (
    <main
      className="w-full overflow-hidden bg-[#FCFCFB]"
      dir="rtl"
    >
      <Container className="pb-16 pt-5 sm:pb-20 sm:pt-7 lg:pb-24">
        {/* =========================================================
            SEO / STRUCTURED DATA
        ========================================================== */}
        <JsonLd data={articleSchema} />

        <JsonLd
          data={breadcrumbSchema}
        />

        {/* =========================================================
            BREADCRUMB
        ========================================================== */}
        <nav
          className="mb-8 pt-16 sm:pt-12 md:pt-5"
          aria-label="مسیر راهنما"
        >
          <div className="inline-flex max-w-full items-center rounded-full border border-gray-200 bg-white px-4 py-2.5 shadow-[0_4px_18px_rgba(17,47,80,0.08)]">
            <ol className="flex min-w-0 items-center gap-2 overflow-hidden text-xs sm:text-sm">
              <li className="shrink-0">
                <Link
                  href="/"
                  className="font-medium text-gray-400 transition-colors hover:text-accent"
                >
                  خانه
                </Link>
              </li>

              <li
                className="shrink-0 text-gray-300"
                aria-hidden="true"
              >
                /
              </li>

              <li className="shrink-0">
                <Link
                  href="/blog"
                  className="font-medium text-gray-400 transition-colors hover:text-accent"
                >
                  بلاگ
                </Link>
              </li>

              <li
                className="shrink-0 text-gray-300"
                aria-hidden="true"
              >
                /
              </li>

              <li className="min-w-0 truncate font-bold text-primary">
                {post.title}
              </li>
            </ol>
          </div>
        </nav>

        {/* =========================================================
            ARTICLE HEADER
        ========================================================== */}
        <header className="mx-auto max-w-[980px] text-center">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#B79464] sm:w-10" />

            <span className="text-[8px] font-black uppercase tracking-[0.22em] text-[#B79464] sm:text-[9px]">
              Journal / Insight
            </span>

            <span className="h-px w-8 bg-[#B79464] sm:w-10" />
          </div>

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#B79464]/20 bg-[#FBF8F2] px-3.5 py-1.5 text-[8px] font-black text-[#9E7F50] sm:text-[9px]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B79464]" />

            {category}
          </div>

          <h1 className="text-[28px] font-black leading-[1.55] tracking-[-0.035em] text-[#112F50] sm:text-[38px] sm:leading-[1.45] lg:text-[52px] lg:leading-[1.4]">
            {post.title}
          </h1>

          {excerpt ? (
            <p className="mx-auto mt-5 max-w-[760px] text-[11px] font-medium leading-7 text-[#667085] sm:mt-6 sm:text-[13px] sm:leading-8">
              {excerpt}
            </p>
          ) : null}

          {post.date && (
            <div className="mt-6 flex items-center justify-center gap-2 text-[9px] font-semibold text-[#667085] sm:text-[10px]">
              <CalendarDays className="h-3.5 w-3.5 text-[#B79464]" />

              <time dateTime={post.date}>
                {formatDate(post.date)}
              </time>

              <span className="mx-1 h-1 w-1 rounded-full bg-[#B79464]/50" />

              <span>
                SARAYE SANG JOURNAL
              </span>
            </div>
          )}
        </header>

        {/* =========================================================
            FEATURED IMAGE
        ========================================================== */}
        {featuredImage?.sourceUrl && (
          <figure className="mx-auto mt-9 max-w-[1180px] sm:mt-11 lg:mt-14">
            <div className="group relative aspect-[16/9] overflow-hidden rounded-[28px] bg-[#ECEDEE] shadow-[0_20px_55px_rgba(10,25,41,0.10)] sm:aspect-[16/8.3]">
              <Image
                src={
                  featuredImage.sourceUrl
                }
                alt={
                  featuredImage.altText ||
                  post.title
                }
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 1180px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.015]"
              />

              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,25,41,0.02),transparent_55%,rgba(10,25,41,0.16))]" />

              <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6">
                <span className="rounded-full border border-white/15 bg-[#0A1929]/25 px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.18em] text-white backdrop-blur-md sm:text-[9px]">
                  Saraye Sang
                </span>
              </div>
            </div>

            {featuredImage.altText && (
              <figcaption className="mt-3 text-center text-[8px] font-medium leading-5 text-[#667085]/60 sm:text-[9px]">
                {featuredImage.altText}
              </figcaption>
            )}
          </figure>
        )}

        {/* =========================================================
            ARTICLE BODY
        ========================================================== */}
        {post.content && (
          <article className="mx-auto mt-11 max-w-[820px] sm:mt-14 lg:mt-16">
            <div className="mb-8 flex items-center gap-4 sm:mb-10">
              <span className="h-px flex-1 bg-[#112F50]/[0.07]" />

              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#B79464] sm:text-[9px]">
                Article
              </span>

              <span className="h-px flex-1 bg-[#112F50]/[0.07]" />
            </div>

            <div
              className="wordpress-content"
              dangerouslySetInnerHTML={{
                __html: post.content,
              }}
            />
          </article>
        )}

        {/* =========================================================
            BACK TO BLOG
        ========================================================== */}
        <div className="mx-auto mt-12 flex max-w-[820px] justify-center sm:mt-14 lg:mt-16">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 rounded-full border border-[#112F50]/[0.10] bg-white px-5 py-2.5 text-[9px] font-black text-[#112F50] shadow-[0_7px_22px_rgba(10,25,41,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#B79464]/40 hover:bg-[#FBF8F2] hover:text-[#9E7F50]"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />

            <span>
              بازگشت به مقالات
            </span>
          </Link>
        </div>

        {/* =========================================================
            BRAND LINE
        ========================================================== */}
        <div className="mt-10 flex items-center gap-4 sm:mt-12">
          <span className="h-px flex-1 bg-[#112F50]/[0.08]" />

          <span className="text-[8px] font-black tracking-[0.24em] text-[#667085]/45 sm:text-[9px]">
            SARAYE SANG / JOURNAL
          </span>

          <span className="h-px flex-1 bg-[#112F50]/[0.08]" />
        </div>
      </Container>
    </main>
  )
}