import 'server-only'

import { cache } from 'react'

import { fetchGraphQL } from '@/lib/graphql'

import {
  GET_ALL_POST_SLUGS,
  GET_POST_BY_SLUG,
  GET_POSTS,
} from '@/lib/queries'

import type {
  Post,
  PostConnection,
} from '@/types/wordpress'

interface AllPostSlugsConnection {
  pageInfo: {
    hasNextPage: boolean
    endCursor: string | null
  }

  nodes: {
    slug: string
    modified: string | null
  }[]
}

interface GetPostsQueryResponse {
  posts: PostConnection
}

interface GetPostBySlugQueryResponse {
  post: Post | null
}

interface GetAllPostSlugsQueryResponse {
  posts: AllPostSlugsConnection
}

export const getPosts = cache(
  async (
    options: {
      first?: number
      after?: string
    } = {},
  ): Promise<PostConnection> => {
    const first =
      options.first ?? 12

    const after =
      options.after ?? null

    const data: GetPostsQueryResponse =
      await fetchGraphQL<GetPostsQueryResponse>(
        GET_POSTS,
        {
          first,
          after,
        },
      )

    return data.posts
  },
)

export const getPostBySlug =
  cache(
    async (
      slug: string,
    ): Promise<Post | null> => {
      const normalizedSlug =
        decodeURIComponent(slug).trim()

      if (!normalizedSlug) {
        return null
      }

      const data: GetPostBySlugQueryResponse =
        await fetchGraphQL<GetPostBySlugQueryResponse>(
          GET_POST_BY_SLUG,
          {
            slug:
              normalizedSlug,
          },
        )

      return data.post
    },
  )

export const getAllPostSitemapEntries =
  cache(
    async (): Promise<
      {
        slug: string
        lastModified?: string
      }[]
    > => {
      const entries: {
        slug: string
        lastModified?: string
      }[] = []

      let hasNextPage = true

      let after:
        | string
        | null = null

      while (
        hasNextPage
      ) {
        const data:
          GetAllPostSlugsQueryResponse =
          await fetchGraphQL<
            GetAllPostSlugsQueryResponse
          >(
            GET_ALL_POST_SLUGS,
            {
              first: 100,
              after,
            },
          )

        for (
          const post of
          data.posts.nodes
        ) {
          if (
            !post.slug
          ) {
            continue
          }

          entries.push({
            slug:
              post.slug,
            lastModified:
              post.modified ||
              undefined,
          })
        }

        if (
          entries.length >
          50000
        ) {
          throw new Error(
            'Article sitemap exceeds the 50,000 URL limit. Split it into multiple sitemaps.',
          )
        }

        hasNextPage =
          data.posts.pageInfo
            .hasNextPage

        after =
          data.posts.pageInfo
            .endCursor
      }

      return entries
    },
  )

export const getAllPostSlugs =
  cache(
    async (): Promise<string[]> => {
      const entries =
        await getAllPostSitemapEntries()

      return entries.map(
        (entry) =>
          entry.slug,
      )
    },
  )
