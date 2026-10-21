import { describe, expect, it } from 'vitest'

import {
  buildSitemapIndex,
  buildUrlSet,
  maxLastModified,
  normalizeLastModified,
} from '../../lib/sitemap'

describe('sitemap helpers', () => {
  describe('normalizeLastModified', () => {
    it('normalizes a valid date', () => {
      expect(
        normalizeLastModified(
          '2026-01-15T12:30:00Z',
        ),
      ).toBe(
        '2026-01-15T12:30:00.000Z',
      )
    })

    it('returns undefined for an invalid date', () => {
      expect(
        normalizeLastModified(
          'not-a-date',
        ),
      ).toBeUndefined()
    })

    it('returns undefined for an empty value', () => {
      expect(
        normalizeLastModified(
          '',
        ),
      ).toBeUndefined()
    })
  })

  describe('maxLastModified', () => {
    it('returns the latest valid date', () => {
      expect(
        maxLastModified([
          '2026-01-01T00:00:00Z',
          '2026-04-01T00:00:00Z',
          '2026-02-01T00:00:00Z',
        ]),
      ).toBe(
        '2026-04-01T00:00:00.000Z',
      )
    })

    it('ignores invalid values', () => {
      expect(
        maxLastModified([
          undefined,
          'invalid',
          '2026-03-01T00:00:00Z',
        ]),
      ).toBe(
        '2026-03-01T00:00:00.000Z',
      )
    })

    it('returns undefined when nothing is valid', () => {
      expect(
        maxLastModified([
          undefined,
          'invalid',
          '',
        ]),
      ).toBeUndefined()
    })
  })

  describe('buildUrlSet', () => {
    it('builds url entries', () => {
      const xml =
        buildUrlSet([
          {
            url:
              'https://sarayesang.com/products/test',
            lastModified:
              '2026-05-01T10:00:00Z',
            changeFrequency:
              'weekly',
            priority:
              0.9,
          },
        ])

      expect(xml).toContain(
        '<?xml version="1.0" encoding="UTF-8"?>',
      )

      expect(xml).toContain(
        '<urlset',
      )

      expect(xml).toContain(
        '<loc>https://sarayesang.com/products/test</loc>',
      )

      expect(xml).toContain(
        '<lastmod>2026-05-01T10:00:00.000Z</lastmod>',
      )

      expect(xml).toContain(
        '<changefreq>weekly</changefreq>',
      )

      expect(xml).toContain(
        '<priority>0.9</priority>',
      )
    })

    it('escapes xml special characters in urls', () => {
      const xml =
        buildUrlSet([
          {
            url:
              'https://example.com/?a=1&b=2',
          },
        ])

      expect(xml).toContain(
        '&amp;',
      )
    })
  })

  describe('buildSitemapIndex', () => {
    it('builds sitemap index entries', () => {
      const xml =
        buildSitemapIndex([
          {
            url:
              'https://sarayesang.com/product-sitemap.xml',
            lastModified:
              '2026-06-01T00:00:00Z',
          },
        ])

      expect(xml).toContain(
        '<?xml version="1.0" encoding="UTF-8"?>',
      )

      expect(xml).toContain(
        '<sitemapindex',
      )

      expect(xml).toContain(
        '<loc>https://sarayesang.com/product-sitemap.xml</loc>',
      )

      expect(xml).toContain(
        '<lastmod>2026-06-01T00:00:00.000Z</lastmod>',
      )
    })
  })
})