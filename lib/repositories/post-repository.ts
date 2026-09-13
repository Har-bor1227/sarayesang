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

export const getAllPostSlugs =
  cache(
    async (): Promise<string[]> => {
      const slugs: string[] = []

      let hasNextPage = true

      let after:
        | string
        | null = null

      while (hasNextPage) {
        const data: GetAllPostSlugsQueryResponse =
          await fetchGraphQL<GetAllPostSlugsQueryResponse>(
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
          if (post.slug) {
            slugs.push(
              post.slug,
            )
          }
        }

        hasNextPage =
          data.posts.pageInfo
            .hasNextPage

        after =
          data.posts.pageInfo
            .endCursor
      }

      return slugs
    },
  )