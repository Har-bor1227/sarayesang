import { describe, expect, it } from 'vitest'

import {
  normalizePositiveDimension,
  normalizeSlug,
  normalizeStockStatus,
  normalizeText,
  normalizeUrl,
} from '../../lib/woocommerce/normalizers'

describe('woocommerce normalizers', () => {
  describe('normalizeSlug', () => {
    it('decodes an encoded slug', () => {
      expect(
        normalizeSlug(
          'red%20marble',
        ),
      ).toBe(
        'red marble',
      )
    })

    it('returns the original value when decoding fails', () => {
      const value =
        '%E0%A4%A'

      expect(
        normalizeSlug(value),
      ).toBe(value)
    })
  })

  describe('normalizeText', () => {
    it('trims text', () => {
      expect(
        normalizeText(
          '  marble  ',
        ),
      ).toBe('marble')
    })

    it('returns undefined for non-string values', () => {
      expect(
        normalizeText(123),
      ).toBeUndefined()

      expect(
        normalizeText(null),
      ).toBeUndefined()
    })

    it('returns undefined for empty text', () => {
      expect(
        normalizeText('   '),
      ).toBeUndefined()
    })
  })

  describe('normalizeUrl', () => {
    it('accepts http urls', () => {
      expect(
        normalizeUrl(
          'http://example.com/image.jpg',
        ),
      ).toBe(
        'http://example.com/image.jpg',
      )
    })

    it('accepts https urls', () => {
      expect(
        normalizeUrl(
          'https://example.com/image.jpg',
        ),
      ).toBe(
        'https://example.com/image.jpg',
      )
    })

    it('rejects non-http urls', () => {
      expect(
        normalizeUrl(
          'ftp://example.com/file',
        ),
      ).toBeUndefined()
    })

    it('rejects empty values', () => {
      expect(
        normalizeUrl('   '),
      ).toBeUndefined()
    })
  })

  describe('normalizePositiveDimension', () => {
    it('normalizes text values', () => {
      expect(
        normalizePositiveDimension(
          ' 120 ',
        ),
      ).toBe('120')
    })

    it('returns undefined for empty values', () => {
      expect(
        normalizePositiveDimension(
          ' ',
        ),
      ).toBeUndefined()
    })
  })

  describe('normalizeStockStatus', () => {
    it('normalizes known statuses', () => {
      expect(
        normalizeStockStatus(
          'instock',
        ),
      ).toBe('instock')

      expect(
        normalizeStockStatus(
          'outofstock',
        ),
      ).toBe('outofstock')

      expect(
        normalizeStockStatus(
          'onbackorder',
        ),
      ).toBe('onbackorder')
    })

    it('is case insensitive', () => {
      expect(
        normalizeStockStatus(
          'InStock',
        ),
      ).toBe('instock')
    })

    it('returns unknown for unsupported values', () => {
      expect(
        normalizeStockStatus(
          'something-else',
        ),
      ).toBe('unknown')
    })
  })
})