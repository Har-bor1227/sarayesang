import { describe, expect, it } from 'vitest'

import {
  EMPTY_SELECTION,
  FILTER_KEYS,
  SORT_OPTIONS,
} from '../../components/product/filters/constants'

import {
  getActiveFilterCount,
} from '../../components/product/filters/utils'

describe('catalog filter contracts', () => {
  describe('getActiveFilterCount', () => {
    it('returns zero for an empty selection', () => {
      expect(
        getActiveFilterCount(
          EMPTY_SELECTION,
        ),
      ).toBe(0)
    })

    it('counts active selections', () => {
      expect(
        getActiveFilterCount({
          stoneType: 'granite',
          color: 'black',
          application: undefined,
          surfaceFinish: undefined,
        }),
      ).toBe(2)
    })

    it('counts every truthy selected value', () => {
      expect(
        getActiveFilterCount({
          stoneType: 'granite',
          color: 'black',
          application: 'kitchen',
          surfaceFinish: 'polished',
        }),
      ).toBe(4)
    })

    it('does not count undefined values', () => {
      expect(
        getActiveFilterCount({
          stoneType: undefined,
          color: undefined,
          application: 'kitchen',
          surfaceFinish: undefined,
        }),
      ).toBe(1)
    })
  })

  describe('filter keys', () => {
    it('contains every supported filter key exactly once', () => {
      expect(
        FILTER_KEYS,
      ).toEqual([
        'stoneType',
        'color',
        'application',
        'surfaceFinish',
      ])
    })

    it('contains no duplicate filter keys', () => {
      expect(
        new Set(FILTER_KEYS).size,
      ).toBe(
        FILTER_KEYS.length,
      )
    })
  })

  describe('sort options', () => {
    it('contains every supported product sort', () => {
      expect(
        SORT_OPTIONS.map(
          (option) =>
            option.value,
        ),
      ).toEqual([
        'newest',
        'price-asc',
        'price-desc',
        'name-asc',
      ])
    })

    it('contains no duplicate sort values', () => {
      const values =
        SORT_OPTIONS.map(
          (option) =>
            option.value,
        )

      expect(
        new Set(values).size,
      ).toBe(
        values.length,
      )
    })
  })
})