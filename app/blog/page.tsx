import type { Metadata } from 'next'

import Image from 'next/image'
import Link from 'next/link'

import {
  ArrowLeft,
  ArrowUpLeft,
  BookOpen,
} from 'lucide-react'

import Container from '@/components/ui/container'

import {
  getPosts,
} from '@/lib/repositories/post-repository'

import { formatDate } from '@/lib/format'

import {
  generateBreadcrumbSchema,
  JsonLd,
} from '@/lib/seo'

import {
  DEFAULT_SOCIAL_IMAGE,
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

function getBlogCanonicalUrl(
  after?: string,
): string {
  const baseUrl =
    `${SITE_URL.replace(
      /\/+$/,
      '',
    )}/blog`

  if (!after) {
    return baseUrl
  }

  return `${baseUrl}?after=${encodeURIComponent(
    after,
  )}`
}

export async function generateMetadata({
  searchParams,
}: BlogPageProps): Promise<Metadata> {
  const resolvedSearchParams =
    await searchParams

  const after =
    typeof resolvedSearchParams?.after ===
      'string' &&
    resolvedSearchParams.after.length > 0
      ? resolvedSearchParams.after
      : undefined

  const hasPagination =
    Boolean(after)

  const canonicalUrl =
    getBlogCanonicalUrl(after)

  return {
    title:
      'مقالات و اخبار',

    description:
      'مقالات تخصصی در زمینه سنگ‌های ساختمانی، راهنمای انتخاب و نگهداری سنگ، اخبار و مطالب آموزشی.',

    alternates: {
      canonical:
        canonicalUrl,
    },

    robots: {
      index:
        !hasPagination,
      follow:
        true,
    },

    openGraph: {
      title:
        `${SITE_NAME} | مقالات و اخبار`,

      description:
        'مقالات تخصصی در زمینه سنگ‌های ساختمانی، راهنمای انتخاب و نگهداری سنگ، اخبار و مطالب آموزشی.',

      type:
        'website',

      url:
        canonicalUrl,

      siteName:
        SITE_NAME,

      locale:
        'fa_IR',

      images: [
        {
          url:
            DEFAULT_SOCIAL_IMAGE,

          width:
            1920,

          height:
            758,

          alt:
            SITE_NAME,
        },
      ],
    },

    twitter: {
      card:
        'summary_large_image',

      images: [
        DEFAULT_SOCIAL_IMAGE,
      ],

      title:
        `${SITE_NAME} | مقالات و اخبار`,

      description:
        'مقالات تخصصی در زمینه سنگ‌های ساختمانی، راهنمای انتخاب و نگهداری سنگ، اخبار و مطالب آموزشی.',
    },
  }
}

function stripHtml(
  value?: string | null,
): string {
  if (!value) {
    return ''
  }

  return value
    .replace(
      /<[^>]*>/g,
      ' ',
    )
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
    typeof resolvedSearchParams?.after ===
      'string'
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

  const featuredPost =
    posts[0]

  const secondaryPosts =
    posts.slice(1)

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
    ])

  return (
    <div
      className="
        min-h-screen
        w-full
        overflow-x-clip
        bg-[#FCFCFB]
      "
      dir="rtl"
    >
      <Container
        className="
          pb-14
          pt-2
          sm:pb-20
          sm:pt-4
          lg:pb-24
          lg:pt-5
        "
      >
        <JsonLd
          data={breadcrumbSchema}
        />

        {/* =========================================================
            BREADCRUMB
        ========================================================== */}

        <nav
          className="
            mb-7
            pt-3
            sm:mb-9
            sm:pt-3
          "
          aria-label="مسیر راهنما"
        >
          <ol
            className="
              flex
              min-w-0
              items-center
              gap-2
              text-[11px]
              sm:gap-2.5
              sm:text-xs
            "
          >
            <li className="shrink-0">
              <Link
                href="/"
                className="
                  rounded-sm
                  font-medium
                  text-[#7A838D]
                  transition-colors
                  duration-200
                  hover:text-[#B79464]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#B79464]/50
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
                text-[#B79464]
              "
            >
              <ArrowLeft
                className="
                  h-3
                  w-3
                "
              />
            </li>

            <li
              aria-current="page"
              className="
                min-w-0
                truncate
                font-bold
                text-[#112F50]
              "
            >
              مقالات و اخبار
            </li>
          </ol>
        </nav>

        {/* =========================================================
            EDITORIAL HEADER
        ========================================================== */}

        <header
          className="
            mb-8
            sm:mb-10
            lg:mb-12
          "
        >
          <div
            className="
              grid
              gap-5
              lg:grid-cols-[minmax(0,1fr)_auto]
              lg:items-end
              lg:gap-10
            "
          >
            <div
              className="
                min-w-0
              "
            >
              <div
                className="
                  mb-4
                  inline-flex
                  items-center
                  gap-2.5
                  rounded-full
                  border
                  border-[#B79464]/25
                  bg-[#B79464]/[0.07]
                  px-3.5
                  py-2
                  text-[11px]
                  font-bold
                  text-[#8F7147]
                  sm:mb-5
                  sm:text-xs
                "
              >
                <BookOpen
                  className="
                    h-4
                    w-4
                  "
                  strokeWidth={1.8}
                />

                <span>
                  مجله سرای سنگ
                </span>

                <span
                  aria-hidden="true"
                  className="
                    h-1
                    w-1
                    rounded-full
                    bg-[#B79464]
                  "
                />
              </div>

              <h1
                className="
                  max-w-[900px]
                  text-[30px]
                  font-black
                  leading-[1.6]
                  tracking-[-0.045em]
                  text-[#112F50]
                  sm:text-[40px]
                  sm:leading-[1.5]
                  lg:text-[52px]
                  lg:leading-[1.4]
                  xl:text-[57px]
                "
              >
                داستان‌های سنگ،
                <span
                  className="
                    text-[#B79464]
                  "
                >
                  {' '}
                  معماری و انتخاب
                </span>
              </h1>

              <p
                className="
                  mt-3
                  max-w-[650px]
                  text-[13px]
                  font-medium
                  leading-[2.1]
                  text-[#667085]
                  sm:mt-4
                  sm:text-[15px]
                  sm:leading-[2]
                "
              >
                از شناخت انواع سنگ‌های ساختمانی تا
                نکات انتخاب، نگهداری و کاربرد آن‌ها
                در فضاهای معماری؛ دانستنی‌هایی برای
                انتخابی آگاهانه‌تر.
              </p>
            </div>

            <div
              className="
                hidden
                items-center
                gap-4
                border-r
                border-[#112F50]/10
                pr-5
                pb-1
                lg:flex
              "
            >
              <div
                className="
                  flex
                  flex-col
                  gap-1
                "
              >
                <span
                  className="
                    text-[11px]
                    font-bold
                    text-[#8C929B]
                  "
                >
                  انتخاب آگاهانه
                </span>

                <span
                  className="
                    text-[14px]
                    font-black
                    text-[#112F50]
                  "
                >
                  از دل طبیعت
                  <span
                    className="
                      mx-1.5
                      text-[#B79464]
                    "
                  >
                    تا
                  </span>
                  معماری
                </span>
              </div>

              <span
                aria-hidden="true"
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#B79464]/30
                  text-[#B79464]
                "
              >
                <ArrowUpLeft
                  className="
                    h-5
                    w-5
                  "
                />
              </span>
            </div>
          </div>

          <div
            className="
              relative
              mt-7
              h-px
              w-full
              overflow-hidden
              bg-[#112F50]/[0.09]
              sm:mt-9
            "
          >
            <span
              aria-hidden="true"
              className="
                absolute
                right-0
                top-0
                h-px
                w-24
                bg-[#B79464]
                sm:w-36
              "
            />
          </div>
        </header>

        {/* =========================================================
            FEATURED ARTICLE
        ========================================================== */}

        {featuredPost ? (
          <>
            <article
              aria-label="مقاله منتخب"
              className="
                group
                mb-10
                grid
                overflow-hidden
                rounded-[24px]
                border
                border-[#112F50]/[0.07]
                bg-white
                shadow-[0_12px_45px_rgba(10,25,41,0.055)]
                transition-shadow
                duration-500
                hover:shadow-[0_22px_60px_rgba(10,25,41,0.10)]
                sm:mb-14
                sm:rounded-[30px]
                lg:mb-16
                lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]
              "
            >
              {/* Featured image */}

              <Link
                href={`/blog/${featuredPost.slug}`}
                aria-label={
                  `مطالعه مقاله ${featuredPost.title}`
                }
                className="
                  relative
                  block
                  aspect-[1.22]
                  overflow-hidden
                  bg-[#E9E5DD]
                  sm:aspect-[1.5]
                  lg:aspect-auto
                  lg:min-h-[440px]
                  xl:min-h-[490px]
                "
              >
                <Image
                  src={getImage(featuredPost)}
                  alt={getImageAlt(featuredPost)}
                  fill
                  loading="eager"
                  fetchPriority="high"
                  sizes="
                    (max-width: 1023px) 100vw,
                    55vw
                  "
                  className="
                    object-cover
                    transition-transform
                    duration-700
                    ease-out
                    group-hover:scale-[1.045]
                  "
                />

                <div
                  aria-hidden="true"
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-[#0A1929]/45
                    via-transparent
                    to-[#0A1929]/10
                    opacity-80
                    transition-opacity
                    duration-500
                    group-hover:opacity-100
                  "
                />

                <div
                  className="
                    absolute
                    inset-x-0
                    top-0
                    flex
                    items-start
                    justify-between
                    gap-3
                    p-4
                    sm:p-6
                    lg:p-7
                  "
                >
                  <span
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-full
                      border
                      border-white/25
                      bg-[#0A1929]/25
                      px-3.5
                      py-2
                      text-[10px]
                      font-bold
                      text-white
                      backdrop-blur-md
                      sm:text-xs
                    "
                  >
                    <span
                      className="
                        h-1.5
                        w-1.5
                        rounded-full
                        bg-[#D5B584]
                      "
                    />

                    مقاله منتخب
                  </span>

                  <span
                    aria-hidden="true"
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/25
                      bg-white/10
                      text-white
                      backdrop-blur-md
                      transition-all
                      duration-300
                      group-hover:border-[#D5B584]/70
                      group-hover:bg-[#B79464]
                      sm:h-12
                      sm:w-12
                    "
                  >
                    <ArrowUpLeft
                      className="
                        h-4
                        w-4
                        sm:h-5
                        sm:w-5
                      "
                    />
                  </span>
                </div>
              </Link>

              {/* Featured content */}

              <div
                className="
                  relative
                  flex
                  min-w-0
                  flex-col
                  justify-between
                  overflow-hidden
                  bg-[#112F50]
                  p-5
                  sm:p-8
                  lg:min-h-[440px]
                  lg:p-9
                  xl:min-h-[490px]
                  xl:p-11
                "
              >
                <div
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute
                    -left-24
                    -top-20
                    h-64
                    w-64
                    rounded-full
                    border
                    border-white/[0.055]
                  "
                />

                <div
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute
                    -left-12
                    -top-8
                    h-40
                    w-40
                    rounded-full
                    border
                    border-[#B79464]/[0.13]
                  "
                />

                <div
                  className="
                    relative
                    z-10
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
                        max-w-full
                        items-center
                        rounded-full
                        bg-[#B79464]/15
                        px-3
                        py-1.5
                        text-[10px]
                        font-bold
                        text-[#DFC39B]
                        sm:text-xs
                      "
                    >
                      <span className="truncate">
                        {getCategory(featuredPost)}
                      </span>
                    </span>

                    <span
                      aria-hidden="true"
                      className="
                        h-px
                        w-6
                        bg-[#B79464]/70
                      "
                    />

                    <time
                      dateTime={
                        featuredPost.date ||
                        undefined
                      }
                      className="
                        text-[10px]
                        font-medium
                        text-white/55
                        sm:text-xs
                      "
                    >
                      {formatDate(
                        featuredPost.date,
                      )}
                    </time>
                  </div>

                  <h2
                    className="
                      mt-5
                      text-[25px]
                      font-black
                      leading-[1.7]
                      tracking-[-0.035em]
                      text-white
                      sm:mt-7
                      sm:text-[33px]
                      sm:leading-[1.65]
                      lg:mt-8
                      lg:text-[37px]
                      lg:leading-[1.65]
                      xl:text-[42px]
                      xl:leading-[1.6]
                    "
                  >
                    <Link
                      href={`/blog/${featuredPost.slug}`}
                      className="
                        rounded-sm
                        transition-colors
                        duration-300
                        hover:text-[#E0C59E]
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-[#D5B584]
                        focus-visible:ring-offset-4
                        focus-visible:ring-offset-[#112F50]
                      "
                    >
                      {featuredPost.title}
                    </Link>
                  </h2>

                  {stripHtml(
                    featuredPost.excerpt,
                  ) ? (
                    <p
                      className="
                        mt-4
                        max-w-[560px]
                        line-clamp-3
                        text-[12px]
                        font-medium
                        leading-[2.15]
                        text-white/65
                        sm:mt-5
                        sm:text-[14px]
                        sm:leading-[2.1]
                      "
                    >
                      {stripHtml(
                        featuredPost.excerpt,
                      )}
                    </p>
                  ) : null}
                </div>

                <div
                  className="
                    relative
                    z-10
                    mt-7
                    border-t
                    border-white/10
                    pt-5
                    sm:mt-9
                    sm:pt-6
                  "
                >
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="
                      group/read
                      inline-flex
                      min-h-11
                      items-center
                      gap-3
                      rounded-full
                      text-[12px]
                      font-black
                      text-white
                      transition-colors
                      duration-300
                      hover:text-[#E0C59E]
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-[#D5B584]
                      sm:text-sm
                    "
                  >
                    <span
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        bg-[#B79464]
                        text-[#0A1929]
                        transition-all
                        duration-300
                        group-hover/read:bg-[#E0C59E]
                      "
                    >
                      <ArrowLeft
                        className="
                          h-4
                          w-4
                          transition-transform
                          duration-300
                          group-hover/read:-translate-x-0.5
                        "
                      />
                    </span>

                    مطالعه مقاله
                  </Link>
                </div>
              </div>
            </article>

            {/* =====================================================
                ARTICLE COLLECTION HEADER
            ====================================================== */}

            {secondaryPosts.length > 0 && (
              <section
                aria-labelledby="blog-articles-heading"
                className="
                  mt-10
                  sm:mt-14
                "
              >
                <div
                  className="
                    flex
                    flex-col
                    gap-4
                    border-b
                    border-[#112F50]/[0.09]
                    pb-5
                    sm:flex-row
                    sm:items-end
                    sm:justify-between
                    sm:gap-6
                    sm:pb-6
                  "
                >
                  <div
                    className="
                      min-w-0
                    "
                  >
                    <div
                      className="
                        mb-2.5
                        flex
                        items-center
                        gap-2
                        text-[10px]
                        font-bold
                        text-[#9A7A4E]
                        sm:text-xs
                      "
                    >
                      <span
                        className="
                          h-1.5
                          w-1.5
                          rounded-full
                          bg-[#B79464]
                        "
                      />

                      از مجله سرای سنگ
                    </div>

                    <h2
                      id="blog-articles-heading"
                      className="
                        text-[23px]
                        font-black
                        leading-[1.7]
                        tracking-[-0.035em]
                        text-[#112F50]
                        sm:text-[30px]
                        sm:leading-[1.55]
                        lg:text-[34px]
                      "
                    >
                      بیشتر بخوانید
                    </h2>

                    <p
                      className="
                        mt-1.5
                        text-[12px]
                        font-medium
                        leading-7
                        text-[#7A838D]
                        sm:text-[13px]
                      "
                    >
                      دانستنی‌ها و ایده‌هایی برای
                      انتخاب بهتر سنگ در معماری
                    </p>
                  </div>

                  <div
                    className="
                      inline-flex
                      w-fit
                      shrink-0
                      items-center
                      gap-2
                      rounded-full
                      border
                      border-[#112F50]/[0.08]
                      bg-white
                      px-3.5
                      py-2
                      text-[11px]
                      font-bold
                      text-[#667085]
                      sm:text-xs
                    "
                  >
                    <BookOpen
                      className="
                        h-4
                        w-4
                        text-[#B79464]
                      "
                      strokeWidth={1.8}
                    />

                    <span>
                      {posts.length.toLocaleString('fa-IR')}
                      {' '}
                      مطلب در این صفحه
                    </span>
                  </div>
                </div>

                {/* =================================================
                    ARTICLE GRID
                ================================================== */}

                <div
                  className="
                    mt-5
                    grid
                    grid-cols-1
                    gap-4
                    sm:mt-7
                    sm:grid-cols-2
                    sm:gap-5
                    lg:grid-cols-3
                    lg:gap-6
                  "
                >
                  {secondaryPosts.map(
                    (post) => {
                      const excerpt =
                        stripHtml(
                          post.excerpt,
                        )

                      return (
                        <article
                          key={post.id}
                          className="
                            group
                            flex
                            min-w-0
                            flex-col
                            overflow-hidden
                            rounded-[22px]
                            border
                            border-[#112F50]/[0.075]
                            bg-white
                            shadow-[0_5px_24px_rgba(10,25,41,0.035)]
                            transition-all
                            duration-300
                            hover:-translate-y-1
                            hover:border-[#B79464]/35
                            hover:shadow-[0_16px_38px_rgba(10,25,41,0.085)]
                            sm:rounded-[25px]
                          "
                        >
                          {/* Card image */}

                          <Link
                            href={`/blog/${post.slug}`}
                            aria-label={
                              `مطالعه مقاله ${post.title}`
                            }
                            className="
                              relative
                              block
                              aspect-[1.4]
                              overflow-hidden
                              bg-[#E9E5DD]
                              sm:aspect-[1.3]
                              lg:aspect-[1.35]
                            "
                          >
                            <Image
                              src={getImage(post)}
                              alt={getImageAlt(post)}
                              fill
                              sizes="
                                (max-width: 639px) 100vw,
                                (max-width: 1023px) 50vw,
                                33vw
                              "
                              className="
                                object-cover
                                transition-transform
                                duration-700
                                ease-out
                                group-hover:scale-[1.045]
                              "
                            />

                            <div
                              aria-hidden="true"
                              className="
                                absolute
                                inset-0
                                bg-gradient-to-t
                                from-[#0A1929]/35
                                via-transparent
                                to-[#0A1929]/[0.03]
                              "
                            />

                            <span
                              aria-hidden="true"
                              className="
                                absolute
                                left-4
                                top-4
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-white/25
                                bg-[#0A1929]/15
                                text-white
                                backdrop-blur-md
                                transition-all
                                duration-300
                                group-hover:border-[#D5B584]/80
                                group-hover:bg-[#B79464]
                                sm:h-11
                                sm:w-11
                              "
                            >
                              <ArrowUpLeft
                                className="
                                  h-4
                                  w-4
                                "
                              />
                            </span>
                          </Link>

                          {/* Card content */}

                          <div
                            className="
                              flex
                              flex-1
                              flex-col
                              p-4
                              sm:p-5
                              lg:p-6
                            "
                          >
                            <div
                              className="
                                flex
                                flex-wrap
                                items-center
                                justify-between
                                gap-x-3
                                gap-y-2
                              "
                            >
                              <span
                                className="
                                  inline-flex
                                  max-w-[65%]
                                  min-w-0
                                  items-center
                                  gap-2
                                  rounded-full
                                  bg-[#F6F2EA]
                                  px-2.5
                                  py-1.5
                                  text-[10px]
                                  font-bold
                                  text-[#8E7148]
                                  sm:text-[11px]
                                "
                              >
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

                                <span className="truncate">
                                  {getCategory(post)}
                                </span>
                              </span>

                              <time
                                dateTime={
                                  post.date ||
                                  undefined
                                }
                                className="
                                  shrink-0
                                  text-[10px]
                                  font-medium
                                  text-[#8A919B]
                                  sm:text-[11px]
                                "
                              >
                                {formatDate(
                                  post.date,
                                )}
                              </time>
                            </div>

                            <h3
                              className="
                                mt-4
                                text-[16px]
                                font-black
                                leading-[1.85]
                                tracking-[-0.02em]
                                text-[#112F50]
                                transition-colors
                                duration-300
                                group-hover:text-[#9A794D]
                                sm:mt-5
                                sm:text-[18px]
                                sm:leading-[1.8]
                              "
                            >
                              <Link
                                href={`/blog/${post.slug}`}
                                className="
                                  rounded-sm
                                  focus-visible:outline-none
                                  focus-visible:ring-2
                                  focus-visible:ring-[#B79464]/60
                                "
                              >
                                {post.title}
                              </Link>
                            </h3>

                            {excerpt ? (
                              <p
                                className="
                                  mt-3
                                  line-clamp-3
                                  text-[12px]
                                  font-medium
                                  leading-[2.1]
                                  text-[#707987]
                                  sm:text-[13px]
                                  sm:leading-[2.05]
                                "
                              >
                                {excerpt}
                              </p>
                            ) : null}

                            <div
                              className="
                                mt-auto
                                pt-5
                                sm:pt-6
                              "
                            >
                              <Link
                                href={`/blog/${post.slug}`}
                                className="
                                  group/read
                                  flex
                                  min-h-11
                                  items-center
                                  justify-between
                                  gap-3
                                  border-t
                                  border-[#112F50]/[0.075]
                                  pt-4
                                  text-[11px]
                                  font-black
                                  text-[#112F50]
                                  transition-colors
                                  duration-300
                                  hover:text-[#9A794D]
                                  sm:text-xs
                                "
                              >
                                <span>
                                  مطالعه مقاله
                                </span>

                                <span
                                  className="
                                    flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-[#F6F2EA]
                                    text-[#9A794D]
                                    transition-all
                                    duration-300
                                    group-hover/read:bg-[#B79464]
                                    group-hover/read:text-white
                                  "
                                >
                                  <ArrowLeft
                                    className="
                                      h-3.5
                                      w-3.5
                                      transition-transform
                                      duration-300
                                      group-hover/read:-translate-x-0.5
                                    "
                                  />
                                </span>
                              </Link>
                            </div>
                          </div>
                        </article>
                      )
                    },
                  )}
                </div>
              </section>
            )}
          </>
        ) : (
          /* =======================================================
              EMPTY STATE
          ======================================================== */

          <div
            className="
              relative
              overflow-hidden
              rounded-[26px]
              border
              border-dashed
              border-[#112F50]/[0.12]
              bg-white
              px-5
              py-14
              text-center
              sm:px-10
              sm:py-20
            "
          >
            <div
              aria-hidden="true"
              className="
                mx-auto
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-full
                bg-[#F6F2EA]
                text-[#B79464]
              "
            >
              <BookOpen
                className="
                  h-7
                  w-7
                "
                strokeWidth={1.5}
              />
            </div>

            <h2
              className="
                mt-5
                text-[20px]
                font-black
                text-[#112F50]
                sm:text-2xl
              "
            >
              مقاله‌ای یافت نشد
            </h2>

            <p
              className="
                mx-auto
                mt-3
                max-w-md
                text-[13px]
                font-medium
                leading-8
                text-[#707987]
                sm:text-sm
              "
            >
              در حال حاضر مقاله‌ای برای نمایش
              وجود ندارد. لطفاً در زمان دیگری
              دوباره به مجله سرای سنگ سر بزنید.
            </p>

            <Link
              href="/"
              className="
                mt-7
                inline-flex
                min-h-11
                items-center
                justify-center
                gap-2
                rounded-full
                bg-[#112F50]
                px-6
                text-xs
                font-bold
                text-white
                transition-colors
                duration-300
                hover:bg-[#1B456D]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#B79464]
                focus-visible:ring-offset-2
                sm:text-sm
              "
            >
              بازگشت به صفحه اصلی

              <ArrowLeft
                className="
                  h-4
                  w-4
                "
              />
            </Link>
          </div>
        )}

        {/* =========================================================
            PAGINATION
        ========================================================== */}

        {pageInfo.hasNextPage &&
          pageInfo.endCursor && (
            <div
              className="
                mt-10
                flex
                justify-center
                border-t
                border-[#112F50]/[0.075]
                pt-8
                sm:mt-14
                sm:pt-10
              "
            >
              <Link
                href={`/blog?after=${encodeURIComponent(
                  pageInfo.endCursor,
                )}`}
                className="
                  group
                  inline-flex
                  min-h-12
                  items-center
                  justify-center
                  gap-4
                  rounded-full
                  border
                  border-[#112F50]/[0.12]
                  bg-white
                  px-5
                  text-xs
                  font-black
                  text-[#112F50]
                  shadow-[0_5px_20px_rgba(10,25,41,0.035)]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:border-[#B79464]/45
                  hover:bg-[#FBF8F2]
                  hover:text-[#8F7147]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#B79464]/60
                  focus-visible:ring-offset-2
                  sm:min-h-14
                  sm:px-7
                  sm:text-sm
                "
              >
                <span>
                  مشاهده مقالات بیشتر
                </span>

                <span
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    bg-[#F6F2EA]
                    transition-colors
                    duration-300
                    group-hover:bg-[#B79464]
                    group-hover:text-white
                    sm:h-9
                    sm:w-9
                  "
                >
                  <ArrowLeft
                    className="
                      h-4
                      w-4
                      transition-transform
                      duration-300
                      group-hover:-translate-x-0.5
                    "
                  />
                </span>
              </Link>
            </div>
          )}
      </Container>
    </div>
  )
}