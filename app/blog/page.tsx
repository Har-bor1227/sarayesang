import type { Metadata } from 'next'

import Image from 'next/image'
import Link from 'next/link'

import {
  ArrowLeft,
  ArrowUpLeft,
} from 'lucide-react'

import Container from '@/components/ui/container'

import {
  getPosts,
} from '@/lib/repositories/post-repository'

import { formatDate } from '@/lib/format'

import {
  SITE_NAME,
  SITE_URL,
} from '@/lib/constants'

export const revalidate = 3600

interface BlogPageProps {
  searchParams?: Promise<{
    [key: string]:
      | string
      | string[]
      | undefined
  }>
}

export async function generateMetadata({
  searchParams,
}: BlogPageProps): Promise<Metadata> {
  const resolvedSearchParams =
    await searchParams

  const hasPagination =
    typeof resolvedSearchParams?.after === 'string' &&
    resolvedSearchParams.after.length > 0

  return {
    title: `مقالات و اخبار | ${SITE_NAME}`,

    description:
      'مقالات تخصصی در زمینه سنگ‌های ساختمانی، راهنمای انتخاب و نگهداری سنگ، اخبار و مطالب آموزشی.',

    alternates: {
      canonical: `${SITE_URL}/blog`,
    },

    robots: hasPagination
      ? {
          index: false,
          follow: true,
        }
      : {
          index: true,
          follow: true,
        },

    openGraph: {
      title: `مقالات و اخبار | ${SITE_NAME}`,

      description:
        'مقالات تخصصی در زمینه سنگ‌های ساختمانی، راهنمای انتخاب و نگهداری سنگ، اخبار و مطالب آموزشی.',

      type: 'website',

      url: `${SITE_URL}/blog`,
    },
  }
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

function getCategory(post: {
  categories?: {
    nodes?: Array<{
      name: string
    }>
  } | null
}) {
  return (
    post.categories?.nodes?.[0]?.name ||
    'مقالات'
  )
}

function getImage(post: {
  featuredImage?: {
    node?: {
      sourceUrl: string
      altText?: string
    } | null
  } | null
}) {
  return (
    post.featuredImage?.node?.sourceUrl ||
    '/images/home/product-placeholder.webp'
  )
}

function getImageAlt(post: {
  title: string
  featuredImage?: {
    node?: {
      altText?: string
    } | null
  } | null
}) {
  return (
    post.featuredImage?.node?.altText ||
    post.title
  )
}

export default async function BlogPage({
  searchParams,
}: BlogPageProps) {
  const resolvedSearchParams =
    await searchParams

  const after =
    typeof resolvedSearchParams?.after === 'string'
      ? resolvedSearchParams.after
      : undefined

  const postsConnection =
    await getPosts({
      first: 9,
      after,
    })

  const posts =
    postsConnection.nodes ?? []

  const pageInfo =
    postsConnection.pageInfo

  const featuredPost = posts[0]
  const secondaryPosts = posts.slice(1)

  return (
    <main
      className="w-full overflow-hidden bg-[#FCFCFB]"
      dir="rtl"
    >
      <Container className="pb-16 pt-5 sm:pb-20 sm:pt-7 lg:pb-24">
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

              <li className="shrink-0 font-bold text-primary">
                بلاگ
              </li>
            </ol>
          </div>
        </nav>

        {/* =========================================================
            INTRO
        ========================================================== */}
        <header className="mb-10 sm:mb-12 lg:mb-14">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[780px]">
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-[#B79464] sm:w-10" />

                <span className="text-[9px] font-black uppercase tracking-[0.22em] text-[#B79464] sm:text-[10px]">
                  Journal / Insights
                </span>
              </div>

              <h1 className="text-[30px] font-black leading-[1.45] tracking-[-0.035em] text-[#112F50] sm:text-[39px] sm:leading-[1.4] lg:text-[48px]">
                داستان‌های سنگ،
                <span className="text-[#B79464]">
                  {' '}
                  معماری و انتخاب
                </span>
              </h1>

              <p className="mt-4 max-w-[680px] text-[11px] font-medium leading-7 text-[#667085] sm:text-[13px] sm:leading-8">
                راهنمای انتخاب سنگ، نکات تخصصی، تجربه‌های
                اجرایی و روایت‌هایی از دنیای متریال و
                معماری.
              </p>
            </div>

            <div className="hidden items-center gap-3 rounded-full border border-[#112F50]/[0.07] bg-white px-4 py-2.5 shadow-[0_6px_20px_rgba(10,25,41,0.04)] sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[#B79464]" />

              <span className="text-[9px] font-bold text-[#667085]">
                مجله تخصصی سرای سنگ
              </span>
            </div>
          </div>

          <div className="mt-7 h-px w-full bg-[#112F50]/[0.07]" />
        </header>

        {/* =========================================================
            ARTICLES
        ========================================================== */}
        {featuredPost ? (
          <>
            {/* =====================================================
                FEATURED ARTICLE
            ====================================================== */}
            <article className="group relative mb-5 min-h-[410px] overflow-hidden rounded-[28px] bg-[#0A1929] sm:min-h-[500px] lg:min-h-[560px]">
              <Link
                href={`/blog/${featuredPost.slug}`}
                aria-label={featuredPost.title}
                className="absolute inset-0"
              >
                <Image
                  src={getImage(featuredPost)}
                  alt={getImageAlt(featuredPost)}
                  fill
                  priority
                  sizes="(max-width: 1023px) 100vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                />

                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,25,41,0.03)_12%,rgba(10,25,41,0.12)_42%,rgba(10,25,41,0.90)_100%)]" />

                <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(10,25,41,0.16),transparent)]" />
              </Link>

              <div className="absolute right-5 top-5 z-10 sm:right-7 sm:top-7">
                <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.18em] text-white backdrop-blur-md sm:text-[9px]">
                  Featured Story
                </span>
              </div>

              <span className="pointer-events-none absolute left-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition-all duration-300 group-hover:border-[#B79464]/60 group-hover:bg-[#B79464] sm:left-7 sm:top-7">
                <ArrowUpLeft className="h-4 w-4" />
              </span>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-5 sm:p-7 lg:p-10">
                <div className="mb-4 flex items-center gap-3">
                  <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[8px] font-bold text-white backdrop-blur-md sm:text-[9px]">
                    {getCategory(featuredPost)}
                  </span>

                  <span className="h-px w-8 bg-[#B79464] sm:w-12" />

                  <time
                    dateTime={
                      featuredPost.date ||
                      undefined
                    }
                    className="text-[8px] font-medium text-white/55 sm:text-[9px]"
                  >
                    {formatDate(
                      featuredPost.date,
                    )}
                  </time>
                </div>

                <h2 className="max-w-[850px] text-[25px] font-black leading-[1.55] tracking-[-0.025em] text-white sm:text-[33px] sm:leading-[1.5] lg:text-[44px] lg:leading-[1.42]">
                  {featuredPost.title}
                </h2>

                {stripHtml(
                  featuredPost.excerpt,
                ) ? (
                  <p className="mt-3 max-w-[730px] line-clamp-2 text-[10px] font-medium leading-7 text-white/68 sm:mt-4 sm:text-[12px] sm:leading-8">
                    {stripHtml(
                      featuredPost.excerpt,
                    )}
                  </p>
                ) : null}

                <div className="mt-5 flex items-center gap-2 text-[9px] font-black text-white sm:mt-7 sm:text-[10px]">
                  <span>مطالعه مقاله</span>

                  <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                </div>
              </div>
            </article>

            {/* =====================================================
                SECONDARY ARTICLES
            ====================================================== */}
            {secondaryPosts.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
                {secondaryPosts.map(
                  (post) => {
                    const excerpt =
                      stripHtml(
                        post.excerpt,
                      )

                    return (
                      <article
                        key={post.id}
                        className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-[#112F50]/[0.07] bg-white shadow-[0_8px_28px_rgba(10,25,41,0.035)] transition-all duration-400 hover:-translate-y-1 hover:border-[#B79464]/25 hover:shadow-[0_18px_45px_rgba(10,25,41,0.08)]"
                      >
                        <Link
                          href={`/blog/${post.slug}`}
                          aria-label={post.title}
                          className="relative block aspect-[1.15] overflow-hidden"
                        >
                          <Image
                            src={getImage(
                              post,
                            )}
                            alt={getImageAlt(
                              post,
                            )}
                            fill
                            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                          />

                          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_58%,rgba(10,25,41,0.22)_100%)]" />

                          <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/10 text-white backdrop-blur-md">
                            <ArrowUpLeft className="h-3.5 w-3.5" />
                          </span>
                        </Link>

                        <div className="flex flex-1 flex-col p-4 sm:p-5">
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <span className="inline-flex max-w-[60%] items-center gap-2 truncate text-[8px] font-black text-[#667085] sm:text-[9px]">
                              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#B79464]" />

                              <span className="truncate">
                                {getCategory(
                                  post,
                                )}
                              </span>
                            </span>

                            <time
                              dateTime={
                                post.date ||
                                undefined
                              }
                              className="shrink-0 text-[8px] font-medium text-[#667085]/65"
                            >
                              {formatDate(
                                post.date,
                              )}
                            </time>
                          </div>

                          <Link
                            href={`/blog/${post.slug}`}
                            className="block"
                          >
                            <h2 className="line-clamp-3 text-[14px] font-black leading-[1.75] tracking-[-0.015em] text-[#112F50] transition-colors duration-300 group-hover:text-[#B79464] sm:text-[15px]">
                              {post.title}
                            </h2>
                          </Link>

                          {excerpt ? (
                            <p className="mt-2.5 line-clamp-3 text-[9px] font-medium leading-[1.9] text-[#667085]">
                              {excerpt}
                            </p>
                          ) : null}

                          <div className="mt-auto pt-5">
                            <Link
                              href={`/blog/${post.slug}`}
                              className="inline-flex items-center gap-1.5 text-[8px] font-black text-[#112F50] transition-colors duration-300 hover:text-[#B79464] sm:text-[9px]"
                            >
                              مطالعه مقاله

                              <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
                            </Link>
                          </div>
                        </div>
                      </article>
                    )
                  },
                )}
              </div>
            )}
          </>
        ) : (
          <div className="rounded-[26px] border border-dashed border-[#112F50]/[0.10] bg-white px-6 py-20 text-center shadow-[0_10px_35px_rgba(10,25,41,0.035)]">
            <h2 className="text-[17px] font-black text-[#112F50]">
              مقاله‌ای یافت نشد
            </h2>

            <p className="mt-2 text-[10px] font-medium leading-6 text-[#667085] sm:text-[11px]">
              در حال حاضر مقاله‌ای برای نمایش
              وجود ندارد.
            </p>
          </div>
        )}

        {/* =========================================================
            PAGINATION
        ========================================================== */}
        {pageInfo.hasNextPage &&
          pageInfo.endCursor && (
            <div className="mt-10 flex justify-center sm:mt-12">
              <Link
                href={`/blog?after=${encodeURIComponent(
                  pageInfo.endCursor,
                )}`}
                className="group inline-flex h-11 items-center justify-center rounded-full border border-[#112F50]/[0.10] bg-white px-6 text-[10px] font-black text-[#112F50] shadow-[0_6px_20px_rgba(10,25,41,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#B79464]/40 hover:bg-[#FBF8F2] hover:text-[#9E7F50]"
              >
                <span>مشاهده مقالات بیشتر</span>

                <ArrowLeft className="mr-2 h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
              </Link>
            </div>
          )}

        {/* =========================================================
            FOOTER BRAND LINE
        ========================================================== */}
        {posts.length > 0 && (
          <div className="mt-10 flex items-center gap-4 sm:mt-12">
            <span className="h-px flex-1 bg-[#112F50]/[0.08]" />

            <span className="text-[8px] font-black tracking-[0.24em] text-[#667085]/50 sm:text-[9px]">
              SARAYE SANG / JOURNAL
            </span>

            <span className="h-px flex-1 bg-[#112F50]/[0.08]" />
          </div>
        )}
      </Container>
    </main>
  )
}