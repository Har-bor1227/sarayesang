import { ANY_VALUE, QUESTION_CONFIG } from './config'
import type {
  Answers,
  FinderProduct,
  QuestionKey,
  RankedProduct,
} from './types'

export function normalizeText(
  value: string,
): string {
  return value
    .replace(/\u200c/g, ' ')
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[ـ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

export function splitFacetValues(
  value?: string,
): string[] {
  if (!value) {
    return []
  }

  return value
    .replace(/\u200c/g, ' ')
    .split(/[,،|/;؛\n]+/)
    .map((item) => item.trim())
    .filter(Boolean)
}

export function facetMatches(
  source: string | undefined,
  selected: string,
): boolean {
  const wanted = normalizeText(selected)

  if (!wanted) {
    return true
  }

  return splitFacetValues(source).some(
    (value) => {
      const normalized = normalizeText(value)

      return (
        normalized === wanted ||
        normalized.includes(wanted) ||
        wanted.includes(normalized)
      )
    },
  )
}

export function getFieldValue(
  product: FinderProduct,
  key: QuestionKey,
): string | undefined {
  return product.acf[key]
}

export function getColorSwatch(
  value: string,
): string {
  const normalized = normalizeText(value)

  if (normalized.includes('سفید')) return '#F4F1E8'
  if (normalized.includes('کرم')) return '#D8C3A0'
  if (normalized.includes('بژ')) return '#CAB58E'

  if (
    normalized.includes('طوسی') ||
    normalized.includes('خاکستری')
  ) {
    return '#8D949A'
  }

  if (
    normalized.includes('مشکی') ||
    normalized.includes('سیاه')
  ) {
    return '#25282A'
  }

  if (normalized.includes('قهوه')) {
    return '#775B49'
  }

  if (normalized.includes('سبز')) {
    return '#63735D'
  }

  if (
    normalized.includes('آبی') ||
    normalized.includes('ابی')
  ) {
    return '#657A8D'
  }

  if (normalized.includes('قرمز')) {
    return '#8B514A'
  }

  if (normalized.includes('زرد')) {
    return '#C5A65A'
  }

  if (normalized.includes('صورتی')) {
    return '#B78C85'
  }

  return 'linear-gradient(135deg,#EDE9DF 0%,#9D978E 100%)'
}

export function getOptionSymbol(
  key: QuestionKey,
  value: string,
): string {
  const normalized = normalizeText(value)

  if (normalized.includes('نما')) return '◫'
  if (normalized.includes('کف')) return '▦'
  if (normalized.includes('پله')) return '⌗'
  if (normalized.includes('دیوار')) return '▤'

  if (
    normalized.includes('محوطه') ||
    normalized.includes('حیاط')
  ) {
    return '◌'
  }

  if (normalized.includes('کانتر')) return '◇'
  if (normalized.includes('تراورتن')) return '◍'
  if (normalized.includes('مرمریت')) return '◈'
  if (normalized.includes('گرانیت')) return '▣'
  if (normalized.includes('چینی')) return '✦'
  if (normalized.includes('مرمر')) return '◉'
  if (normalized.includes('بازالت')) return '◈'
  if (normalized.includes('ساب')) return '✧'
  if (normalized.includes('چرمی')) return '≈'
  if (normalized.includes('هوند')) return '•'

  if (key === 'colorFamily') {
    return '●'
  }

  return '◆'
}

export function getProductMatch(
  product: FinderProduct,
  answers: Answers,
): RankedProduct['match'] {
  const selected = QUESTION_CONFIG.filter(
    (question) =>
      Boolean(answers[question.key]) &&
      answers[question.key] !== ANY_VALUE,
  )

  if (!selected.length) {
    return 0
  }

  let earned = 0
  let possible = 0

  for (const question of selected) {
    const answer = answers[question.key]

    if (
      !answer ||
      answer === ANY_VALUE
    ) {
      continue
    }

    possible += question.weight

    if (
      facetMatches(
        getFieldValue(
          product,
          question.key,
        ),
        answer,
      )
    ) {
      earned += question.weight
    }
  }

  if (!possible) {
    return 0
  }

  return Math.round(
    (earned / possible) * 100,
  )
}

export function getMatchedFields(
  product: FinderProduct,
  answers: Answers,
): number {
  return QUESTION_CONFIG.reduce(
    (count, question) => {
      const answer = answers[question.key]

      if (
        !answer ||
        answer === ANY_VALUE
      ) {
        return count
      }

      return facetMatches(
        getFieldValue(
          product,
          question.key,
        ),
        answer,
      )
        ? count + 1
        : count
    },
    0,
  )
}

export function rankProducts(
  products: FinderProduct[],
  answers: Answers,
): RankedProduct[] {
  return products
    .map((product) => ({
      ...product,
      match: getProductMatch(
        product,
        answers,
      ),
      matchedFields:
        getMatchedFields(
          product,
          answers,
        ),
    }))
    .sort((a, b) => {
      if (b.match !== a.match) {
        return b.match - a.match
      }

      if (
        b.matchedFields !==
        a.matchedFields
      ) {
        return (
          b.matchedFields -
          a.matchedFields
        )
      }

      const aPrice =
        Number.parseFloat(
          a.price || '',
        )

      const bPrice =
        Number.parseFloat(
          b.price || '',
        )

      if (
        Number.isFinite(aPrice) &&
        Number.isFinite(bPrice)
      ) {
        return aPrice - bPrice
      }

      return 0
    })
    .slice(0, 5)
}

export function isAnyValue(
  value?: string,
): boolean {
  return value === ANY_VALUE
}

export function formatSelection(
  value?: string,
): string {
  if (!value || isAnyValue(value)) {
    return 'فرقی ندارد'
  }

  return value
}

export function getScoreLabel(
  score: number,
): string {
  if (score === 0) {
    return 'پیشنهاد اولیه'
  }

  if (score >= 90) {
    return 'تطابق خیلی بالا'
  }

  if (score >= 75) {
    return 'تطابق بالا'
  }

  if (score >= 55) {
    return 'تطابق مناسب'
  }

  return 'گزینه قابل بررسی'
}