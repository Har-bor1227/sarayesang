import type { Metadata } from 'next'

import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
} from 'lucide-react'

import {
  DEFAULT_SOCIAL_IMAGE,
  SITE_NAME,
  SITE_URL,
  WORDPRESS_URL,
} from '@/lib/constants'

import Container from '@/components/ui/container'
import WordPressArticleContent from '@/components/blog/WordPressArticleContent'
import { sanitizeWordPressHtml } from '@/lib/security/sanitize-wordpress-html'

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

export const revalidate = 3600

interface PostPageProps {
  params: Promise<{
    slug: string
  }>
}

interface TocItem {
  id: string
  title: string
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
): string {
  if (!value) {
    return ''
  }

  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#39;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/&#x27;/gi, "'")
    .replace(/&#x2F;/gi, '/')
    .replace(/&#x60;/gi, '`')
    .replace(/&#x3D;/gi, '=')
    .replace(
      /&#(\d+);/gi,
      (_, code: string) => {
        const parsedCode = Number(code)

        if (
          !Number.isFinite(parsedCode) ||
          parsedCode < 0 ||
          parsedCode > 0x10ffff
        ) {
          return _
        }

        try {
          return String.fromCodePoint(
            parsedCode,
          )
        } catch {
          return _
        }
      },
    )
    .replace(
      /&#x([0-9a-f]+);/gi,
      (_, code: string) => {
        const parsedCode =
          Number.parseInt(
            code,
            16,
          )

        if (
          !Number.isFinite(parsedCode) ||
          parsedCode < 0 ||
          parsedCode > 0x10ffff
        ) {
          return _
        }

        try {
          return String.fromCodePoint(
            parsedCode,
          )
        } catch {
          return _
        }
      },
    )
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
    getFrontendPostUrl(
      post.slug,
    )

  const description =
    stripHtml(post.excerpt) ||
    post.title

  const image =
    post.featuredImage?.node?.sourceUrl ||
    DEFAULT_SOCIAL_IMAGE

  return {
    title:
      post.title,

    description,

    alternates: {
      canonical:
        frontendPostUrl,
    },

    openGraph: {
      type:
        'article',

      title:
        `${SITE_NAME} | ${post.title}`,

      description,

      url:
        frontendPostUrl,

      siteName:
        SITE_NAME,

      locale:
        'fa_IR',

      images: image
        ? [
            {
              url:
                image,

              alt:
                post.featuredImage?.node
                  ?.altText ||
                post.title,
            },
          ]
        : undefined,
    },

    twitter: {
      card:
        'summary_large_image',

      title:
        `${SITE_NAME} | ${post.title}`,

      description,

      images: image
        ? [image]
        : undefined,
    },
  }
}

function getUniqueHeadingId(
  headingText: string,
  index: number,
  usedIds: Set<string>,
): string {
  const normalizedTitle =
    stripHtml(headingText)
      .toLowerCase()
      .replace(
        /[^\p{L}\p{N}\s-]/gu,
        '',
      )
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(
        /^-+|-+$/g,
        '',
      )

  const baseId =
    normalizedTitle
      ? `article-${normalizedTitle}`
      : `article-heading-${index + 1}`

  let uniqueId =
    baseId

  let suffix = 2

  while (
    usedIds.has(
      uniqueId,
    )
  ) {
    uniqueId =
      `${baseId}-${suffix}`

    suffix += 1
  }

  usedIds.add(
    uniqueId,
  )

  return uniqueId
}

function prepareArticleContent(
  html: string,
): {
  html: string
  toc: TocItem[]
} {
  if (!html) {
    return {
      html,
      toc: [],
    }
  }

  const toc: TocItem[] = []
  const usedIds =
    new Set<string>()

  const preparedHtml =
    html.replace(
      /<h2\b([^>]*)>([\s\S]*?)<\/h2>/gi,
      (
        fullMatch: string,
        rawAttributes: string,
        innerHtml: string,
      ) => {
        const headingTitle =
          stripHtml(
            innerHtml,
          )

        if (!headingTitle) {
          return fullMatch
        }

        const existingIdMatch =
          rawAttributes.match(
            /\bid\s*=\s*["']([^"']+)["']/i,
          )

        let id =
          existingIdMatch?.[1]?.trim() ||
          ''

        if (
          !id ||
          usedIds.has(id)
        ) {
          id =
            getUniqueHeadingId(
              headingTitle,
              toc.length,
              usedIds,
            )
        } else {
          usedIds.add(id)
        }

        toc.push({
          id,
          title:
            headingTitle,
        })

        let attributes =
          rawAttributes

        if (
          existingIdMatch
        ) {
          attributes =
            attributes.replace(
              /\bid\s*=\s*["'][^"']*["']/i,
              `id="${id}"`,
            )
        } else {
          attributes +=
            ` id="${id}"`
        }

        const existingClassMatch =
          attributes.match(
            /\bclass\s*=\s*["']([^"']*)["']/i,
          )

        if (
          existingClassMatch
        ) {
          const existingClass =
            existingClassMatch[1].trim()

          const mergedClass =
            existingClass.includes(
              'scroll-mt-28',
            )
              ? existingClass
              : `${existingClass} scroll-mt-28`

          attributes =
            attributes.replace(
              /\bclass\s*=\s*["'][^"']*["']/i,
              `class="${mergedClass}"`,
            )
        } else {
          attributes +=
            ' class="scroll-mt-28"'
        }

        return `<h2${attributes}>${innerHtml}</h2>`
      },
    )

  return {
    html:
      preparedHtml,

    toc,
  }
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } =
    await params

  const post =
    await getPostBySlug(
      slug,
    )

  if (!post) {
    return {
      title:
        'مقاله یافت نشد',

      description:
        'مقاله مورد نظر پیدا نشد.',

      robots: {
        index:
          false,

        follow:
          false,
      },
    }
  }

  const frontendPostUrl =
    getFrontendPostUrl(
      post.slug,
    )

  const wordpressUrl =
    getWordPressPostUrl(
      post,
    )

  const rankMath =
    await getPostSeo(
      wordpressUrl,
    )

  if (rankMath) {
    return rankMathToMetadata(
      rankMath,
      frontendPostUrl,
    )
  }

  return getFallbackPostMetadata(
    post,
  )
}

export default async function PostPage({
  params,
}: PostPageProps) {
  const { slug } =
    await params

  const post =
    await getPostBySlug(
      slug,
    )

  if (!post) {
    notFound()
  }

  const articleSchema =
    generateArticleSchema(
      post,
    )

  const breadcrumbSchema =
    generateBreadcrumbSchema([
      {
        name:
          'خانه',
        path:
          '/',
      },
      {
        name:
          'بلاگ',
        path:
          '/blog',
      },
      {
        name:
          post.title,
        path:
          `/blog/${post.slug}`,
      },
    ])

  const featuredImage =
    post.featuredImage?.node

  const category =
    post.categories?.nodes?.[0]?.name ||
    'مقالات'

  const preparedArticle =
    post.content
      ? prepareArticleContent(
          post.content,
        )
      : {
          html: '',
          toc: [],
        }

  const visibleTocItems =
    preparedArticle.toc.slice(
      0,
      5,
    )

  const hiddenTocItems =
    preparedArticle.toc.slice(
      5,
    )

  return (
    <div
      className="
        w-full
        max-w-full
        overflow-x-clip
        bg-[#FCFCFB]
      "
      dir="rtl"
    >
      <Container
        className="
          pb-14
          pt-4
          sm:pb-16
          sm:pt-5
          lg:pb-20
          lg:pt-6
        "
      >
        <JsonLd
          data={
            articleSchema
          }
        />

        <JsonLd
          data={
            breadcrumbSchema
          }
        />

        <nav
          className="
            mb-5
            overflow-hidden
            sm:mb-6
            lg:mb-7
          "
          aria-label="مسیر راهنما"
        >
          <ol
            className="
              flex
              min-w-0
              items-center
              gap-1.5
              overflow-hidden
              whitespace-nowrap
              text-[10px]
              sm:gap-2
              sm:text-[11px]
            "
          >
            <li className="shrink-0">
              <Link
                href="/"
                className="
                  font-bold
                  text-[#7A838D]
                  transition-colors
                  duration-200
                  hover:text-[#B79464]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#B79464]/40
                  focus-visible:ring-offset-2
                "
              >
                خانه
              </Link>
            </li>

            <li
              aria-hidden="true"
              className="
                flex
                shrink-0
                items-center
                text-[#B79464]/55
              "
            >
              <ChevronLeft
                className="
                  h-3
                  w-3
                "
              />
            </li>

            <li className="shrink-0">
              <Link
                href="/blog"
                className="
                  font-bold
                  text-[#7A838D]
                  transition-colors
                  duration-200
                  hover:text-[#B79464]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#B79464]/40
                  focus-visible:ring-offset-2
                "
              >
                بلاگ
              </Link>
            </li>

            <li
              aria-hidden="true"
              className="
                flex
                shrink-0
                items-center
                text-[#B79464]/55
              "
            >
              <ChevronLeft
                className="
                  h-3
                  w-3
                "
              />
            </li>

            <li
              aria-current="page"
              title={
                post.title
              }
              className="
                min-w-0
                truncate
                font-black
                text-[#112F50]
              "
            >
              {post.title}
            </li>
          </ol>
        </nav>

        <main
          className="
            min-w-0
            max-w-full
            overflow-x-clip
          "
        >
          <header
            className="
              mx-auto
              min-w-0
              max-w-[920px]
              overflow-hidden
            "
          >
            <div
              className="
                flex
                flex-wrap
                items-center
                gap-x-3
                gap-y-2
              "
            >
              <span
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-[#B79464]/20
                  bg-[#FBF8F2]
                  px-3
                  py-1.5
                  text-[9px]
                  font-black
                  text-[#9E7F50]
                  sm:text-[10px]
                "
              >
                <span
                  aria-hidden="true"
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-[#B79464]
                  "
                />

                {category}
              </span>

              {post.date && (
                <div
                  className="
                    flex
                    items-center
                    gap-1.5
                    text-[9px]
                    font-medium
                    text-[#7A838D]
                    sm:text-[10px]
                  "
                >
                  <CalendarDays
                    aria-hidden="true"
                    className="
                      h-3.5
                      w-3.5
                      text-[#B79464]
                    "
                  />

                  <time
                    dateTime={
                      post.date
                    }
                  >
                    {formatDate(
                      post.date,
                    )}
                  </time>
                </div>
              )}
            </div>
<h1
  title={post.title}
  className="
    mt-4
    max-w-full
    break-words
    text-[28px]
    font-black
    leading-[1.5]
    tracking-[-0.035em]
    text-[#112F50]
    sm:mt-5
    sm:text-[36px]
    sm:leading-[1.45]
    lg:text-[46px]
    lg:leading-[1.4]
  "
>
  {post.title}
</h1>
          </header>

          {featuredImage?.sourceUrl && (
            <figure
              className="
                mx-auto
                mt-7
                w-full
                max-w-[880px]
                sm:mt-8
                lg:mt-9
              "
            >
              <div
                className="
                  relative
                  aspect-[16/9]
                  w-full
                  overflow-hidden
                  rounded-[20px]
                  bg-[#ECEDEE]
                  shadow-[0_16px_44px_rgba(10,25,41,0.08)]
                  sm:rounded-[24px]
                "
              >
                <Image
                  src={
                    featuredImage.sourceUrl
                  }
                  alt={
                    featuredImage.altText ||
                    post.title
                  }
                  fill
                  loading="eager"
                  fetchPriority="high"
                  sizes="
                    (max-width: 639px) calc(100vw - 2rem),
                    (max-width: 1023px) calc(100vw - 3rem),
                    880px
                  "
                  className="
                    object-cover
                    object-center
                  "
                />
              </div>

              {featuredImage.altText && (
                <figcaption
                  className="
                    mt-2
                    px-2
                    text-center
                    text-[8px]
                    font-medium
                    leading-5
                    text-[#667085]/65
                    sm:text-[9px]
                  "
                >
                  {
                    featuredImage.altText
                  }
                </figcaption>
              )}
            </figure>
          )}

          {preparedArticle.toc.length > 0 && (
            <nav
              aria-label="فهرست مطالب"
              className="
                mx-auto
                mt-8
                max-w-[820px]
                rounded-[20px]
                border
                border-[#112F50]/[0.08]
                bg-white
                px-4
                py-4
                shadow-[0_10px_30px_rgba(10,25,41,0.035)]
                sm:mt-9
                sm:rounded-[22px]
                sm:px-5
                sm:py-5
                lg:mt-10
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2.5
                "
              >
                <span
                  aria-hidden="true"
                  className="
                    h-6
                    w-1
                    rounded-full
                    bg-[#B79464]
                  "
                />

                <h2
                  className="
                    text-[14px]
                    font-black
                    text-[#112F50]
                    sm:text-[15px]
                  "
                >
                  فهرست مطالب
                </h2>
              </div>

              <ol
                className="
                  mt-4
                  grid
                  gap-1.5
                  sm:mt-5
                  sm:gap-2
                "
              >
                {visibleTocItems.map(
                  (
                    item,
                    index,
                  ) => (
                    <li
                      key={
                        item.id
                      }
                    >
                      <a
                        href={
                          `#${item.id}`
                        }
                        className="
                          group
                          flex
                          min-w-0
                          items-start
                          gap-2.5
                          rounded-[12px]
                          px-2.5
                          py-2
                          text-right
                          text-[11px]
                          font-bold
                          leading-6
                          text-[#667085]
                          transition-colors
                          duration-200
                          hover:bg-[#FBF8F2]
                          hover:text-[#112F50]
                          focus-visible:bg-[#FBF8F2]
                          focus-visible:text-[#112F50]
                          focus-visible:outline-none
                          focus-visible:ring-2
                          focus-visible:ring-[#B79464]/35
                          sm:text-[12px]
                          sm:leading-7
                        "
                      >
                        <span
                          aria-hidden="true"
                          className="
                            mt-1.5
                            flex
                            h-5
                            min-h-5
                            w-5
                            min-w-5
                            items-center
                            justify-center
                            rounded-full
                            bg-[#FBF8F2]
                            text-[9px]
                            font-black
                            text-[#9E7F50]
                            transition-colors
                            duration-200
                            group-hover:bg-[#B79464]
                            group-hover:text-white
                          "
                        >
                          {index + 1}
                        </span>

                        <span
                          className="
                            min-w-0
                            flex-1
                          "
                        >
                          {
                            item.title
                          }
                        </span>

                        <ChevronLeft
                          aria-hidden="true"
                          className="
                            mt-1.5
                            h-4
                            w-4
                            shrink-0
                            text-[#B79464]/55
                            transition-transform
                            duration-200
                            group-hover:-translate-x-0.5
                          "
                        />
                      </a>
                    </li>
                  ),
                )}
              </ol>

              {hiddenTocItems.length > 0 && (
                <details
                  className="
                    group
                    mt-1
                    sm:mt-2
                  "
                >
                  <summary
                    className="
                      flex
                      cursor-pointer
                      list-none
                      items-center
                      justify-center
                      gap-2
                      rounded-[12px]
                      px-3
                      py-2.5
                      text-[10px]
                      font-black
                      text-[#9E7F50]
                      transition-colors
                      duration-200
                      hover:bg-[#FBF8F2]
                      hover:text-[#112F50]
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-[#B79464]/35
                      sm:text-[11px]
                    "
                  >
                    <span>
                      نمایش ادامه فهرست
                    </span>

                    <ChevronDown
                      aria-hidden="true"
                      className="
                        h-4
                        w-4
                        shrink-0
                        text-[#B79464]
                        transition-transform
                        duration-200
                        group-open:rotate-180
                      "
                    />
                  </summary>

                  <ol
                    start={6}
                    className="
                      mt-1
                      grid
                      gap-1.5
                      border-t
                      border-[#112F50]/[0.06]
                      pt-2
                      sm:gap-2
                      sm:pt-3
                    "
                  >
                    {hiddenTocItems.map(
                      (
                        item,
                        index,
                      ) => (
                        <li
                          key={
                            item.id
                          }
                        >
                          <a
                            href={
                              `#${item.id}`
                            }
                            className="
                              group
                              flex
                              min-w-0
                              items-start
                              gap-2.5
                              rounded-[12px]
                              px-2.5
                              py-2
                              text-right
                              text-[11px]
                              font-bold
                              leading-6
                              text-[#667085]
                              transition-colors
                              duration-200
                              hover:bg-[#FBF8F2]
                              hover:text-[#112F50]
                              focus-visible:bg-[#FBF8F2]
                              focus-visible:text-[#112F50]
                              focus-visible:outline-none
                              focus-visible:ring-2
                              focus-visible:ring-[#B79464]/35
                              sm:text-[12px]
                              sm:leading-7
                            "
                          >
                            <span
                              aria-hidden="true"
                              className="
                                mt-1.5
                                flex
                                h-5
                                min-h-5
                                w-5
                                min-w-5
                                items-center
                                justify-center
                                rounded-full
                                bg-[#FBF8F2]
                                text-[9px]
                                font-black
                                text-[#9E7F50]
                                transition-colors
                                duration-200
                                group-hover:bg-[#B79464]
                                group-hover:text-white
                              "
                            >
                              {index + 6}
                            </span>

                            <span
                              className="
                                min-w-0
                                flex-1
                              "
                            >
                              {
                                item.title
                              }
                            </span>

                            <ChevronLeft
                              aria-hidden="true"
                              className="
                                mt-1.5
                                h-4
                                w-4
                                shrink-0
                                text-[#B79464]/55
                                transition-transform
                                duration-200
                                group-hover:-translate-x-0.5
                              "
                            />
                          </a>
                        </li>
                      ),
                    )}
                  </ol>
                </details>
              )}
            </nav>
          )}

          {preparedArticle.html && (
            <article
              className="
                mx-auto
                mt-8
                min-w-0
                max-w-[820px]
                sm:mt-10
                lg:mt-11
              "
            >
              <WordPressArticleContent
                sanitizedHtml={sanitizeWordPressHtml(preparedArticle.html)}
              />
            </article>
          )}

          <div
            className="
              mx-auto
              mt-9
              flex
              max-w-[820px]
              justify-start
              sm:mt-10
            "
          >
            <Link
              href="/blog"
              className="
                group
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-[#112F50]/[0.10]
                bg-white
                px-4
                py-2.5
                text-[9px]
                font-black
                text-[#112F50]
                shadow-[0_7px_22px_rgba(10,25,41,0.04)]
                transition-all
                duration-200
                hover:border-[#B79464]/40
                hover:bg-[#FBF8F2]
                hover:text-[#9E7F50]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#B79464]/40
                focus-visible:ring-offset-2
              "
            >
              <ArrowLeft
                aria-hidden="true"
                className="
                  h-3.5
                  w-3.5
                  transition-transform
                  duration-200
                  group-hover:-translate-x-0.5
                "
              />

              <span>
                بازگشت به مقالات
              </span>
            </Link>
          </div>
        </main>
      </Container>
    </div>
  )
}