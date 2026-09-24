'use client'

import {
  useCallback,
  useMemo,
  useState,
} from 'react'

import {
  INITIAL_QUERY,
  MAX_SEARCH_RESULTS,
} from './constants'
import type {
  CompareSlot,
  ApiStatus,
} from './types'
import {
  matchesQuery,
} from './utils'
import type {
  FinderApiResponse,
  FinderProduct,
} from '../stone-finder/types'
import {
  normalizeText,
} from '../stone-finder/utils'

export function useComparison() {
  const [data, setData] =
    useState<FinderApiResponse | null>(
      null,
    )

  const [status, setStatus] =
    useState<ApiStatus>('idle')

  const [error, setError] =
    useState('')

  const [firstProduct, setFirstProduct] =
    useState<FinderProduct | null>(
      null,
    )

  const [
    secondProduct,
    setSecondProduct,
  ] =
    useState<FinderProduct | null>(
      null,
    )

  const [pickerSlot, setPickerSlot] =
    useState<CompareSlot | null>(
      null,
    )

  const [query, setQuery] =
    useState(INITIAL_QUERY)

  const loadProducts = useCallback(
    async () => {
      if (data) return

      setStatus('loading')
      setError('')

      try {
        const response = await fetch(
          '/api/stone-finder',
          {
            method: 'GET',
            headers: {
              Accept:
                'application/json',
            },
            cache: 'no-store',
          },
        )

        if (!response.ok) {
          throw new Error(
            `stone-finder-request-failed-${response.status}`,
          )
        }

        const payload =
          (await response.json()) as FinderApiResponse

        setData(payload)
        setStatus('ready')
      } catch {
        setStatus('error')
        setError(
          'دریافت محصولات انجام نشد.',
        )
      }
    },
    [data],
  )

  const openPicker = useCallback(
    (slot: CompareSlot) => {
      setPickerSlot(slot)
      setQuery(INITIAL_QUERY)

      void loadProducts()
    },
    [loadProducts],
  )

  const closePicker =
    useCallback(() => {
      setPickerSlot(null)
      setQuery(INITIAL_QUERY)
    }, [])

  const selectProduct = useCallback(
    (product: FinderProduct) => {
      if (
        pickerSlot === 'first' &&
        product.id ===
          secondProduct?.id
      ) {
        return
      }

      if (
        pickerSlot === 'second' &&
        product.id ===
          firstProduct?.id
      ) {
        return
      }

      if (pickerSlot === 'first') {
        setFirstProduct(product)
      } else if (
        pickerSlot === 'second'
      ) {
        setSecondProduct(product)
      }

      closePicker()
    },
    [
      closePicker,
      firstProduct?.id,
      pickerSlot,
      secondProduct?.id,
    ],
  )

  const clearProduct = useCallback(
    (slot: CompareSlot) => {
      if (slot === 'first') {
        setFirstProduct(null)
        return
      }

      setSecondProduct(null)
    },
    [],
  )

  const searchResults = useMemo(
    () => {
      if (!data) return []

      const normalized =
        normalizeText(query)

      if (!normalized) {
        return data.products.slice(
          0,
          MAX_SEARCH_RESULTS,
        )
      }

      return data.products
        .filter((product) =>
          matchesQuery(
            product,
            query,
          ),
        )
        .slice(
          0,
          MAX_SEARCH_RESULTS,
        )
    },
    [data, query],
  )

  const compareCount =
    Number(Boolean(firstProduct)) +
    Number(Boolean(secondProduct))

  const pickerTarget =
    firstProduct && !secondProduct
      ? 'second'
      : 'first'

  return {
    data,
    status,
    error,
    firstProduct,
    secondProduct,
    pickerSlot,
    query,
    searchResults,
    compareCount,
    pickerTarget,
    setQuery,
    openPicker,
    closePicker,
    selectProduct,
    clearProduct,
  }
}