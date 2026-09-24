import { SITE_URL } from '@/lib/constants'

import {
  getAllPostSitemapEntries,
} from '@/lib/repositories/post-repository'

import {
  buildUrlSet,
} from '@/lib/sitemap'

export const revalidate = 300

const siteUrl =
  SITE_URL.replace(
    /\/+$/,
    '',
  )

export async function GET() {
  const posts =
    await getAllPostSitemapEntries()

  const xml =
    buildUrlSet(
      posts.map(
        (post) => ({
          url:
            siteUrl +
            '/blog/' +
            encodeURIComponent(
              post.slug,
            ),

          lastModified:
            post.lastModified,

          changeFrequency:
            'weekly' as const,

          priority:
            0.8,
        }),
      ),
    )

  return new Response(
    xml,
    {
      headers: {
        'Content-Type':
          'application/xml; charset=utf-8',

        'X-Content-Type-Options':
          'nosniff',
      },
    },
  )
}
