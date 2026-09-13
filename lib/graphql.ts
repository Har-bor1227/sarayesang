import { GRAPHQL_ENDPOINT } from '@/lib/constants'

interface GraphQLError {
  message: string
}

interface GraphQLResponse<T> {
  data?: T
  errors?: GraphQLError[]
}

interface PaginatedResult<T> {
  nodes?: T[]
  pageInfo?: {
    hasNextPage?: boolean
    endCursor?: string | null
  }
}

const GRAPHQL_TIMEOUT_MS = 10_000

export async function fetchGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>,
  revalidate = 3600
): Promise<T> {
  const controller = new AbortController()

  const timeout = setTimeout(() => {
    controller.abort()
  }, GRAPHQL_TIMEOUT_MS)

  try {
    const response = await fetch(
      GRAPHQL_ENDPOINT,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },

        body: JSON.stringify({
          query,
          variables,
        }),

        signal: controller.signal,

        next: {
          revalidate,
        },
      }
    )

    if (!response.ok) {
      throw new Error(
        `GraphQL request failed with status ${response.status}`
      )
    }

    const json =
      (await response.json()) as GraphQLResponse<T>

    if (json.errors?.length) {
      throw new Error(
        json.errors[0].message
      )
    }

    if (!json.data) {
      throw new Error(
        'No data returned from GraphQL'
      )
    }

    return json.data
  } catch (error) {
    if (
      error instanceof DOMException &&
      error.name === 'AbortError'
    ) {
      throw new Error(
        'GraphQL request timed out'
      )
    }

    throw error
  } finally {
    clearTimeout(timeout)
  }
}

export async function fetchAllGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>,
  revalidate = 3600
): Promise<T[]> {
  const items: T[] = []

  let hasNextPage = true
  let after: string | null = null

  while (hasNextPage) {
    const result: PaginatedResult<T> =
      await fetchGraphQL<PaginatedResult<T>>(
        query,
        {
          ...variables,
          first: 100,
          after,
        },
        revalidate
      )

    items.push(
      ...(result.nodes ?? [])
    )

    hasNextPage =
      result.pageInfo?.hasNextPage ??
      false

    after =
      result.pageInfo?.endCursor ??
      null
  }

  return items
}