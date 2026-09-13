import 'server-only'

/**
 * واحد داخلی قیمت در تمام پروژه:
 *
 * تومان
 */
export const PROJECT_PRICE_CURRENCY =
  'TOMAN'

/**
 * واحد رسمی ISO برای ریال ایران.
 *
 * این مقدار فقط برای Structured Data استفاده می‌شود.
 */
export const SCHEMA_PRICE_CURRENCY =
  'IRR'

function normalizeNumericString(
  value:
    | string
    | number
    | null
    | undefined,
): string | null {
  if (
    value === null ||
    value === undefined
  ) {
    return null
  }

  const normalized =
    String(value)
      .trim()
      .replace(
        /,/g,
        '',
      )
      .replace(
        /٬/g,
        '',
      )
      .replace(
        /٫/g,
        '.',
      )

  if (!normalized) {
    return null
  }

  if (
    !/^\d+(?:\.\d+)?$/.test(
      normalized,
    )
  ) {
    return null
  }

  return normalized
}

export function tomansToRials(
  value:
    | string
    | number
    | null
    | undefined,
): string | null {
  const normalized =
    normalizeNumericString(
      value,
    )

  if (
    normalized === null
  ) {
    return null
  }

  const [
    integerPart,
    decimalPart,
  ] = normalized.split('.')

  /**
   * Multiplication by 10 is done as string
   * manipulation to avoid floating-point
   * precision problems.
   */
  if (
    !decimalPart
  ) {
    return `${integerPart}0`
  }

  const combined =
    `${integerPart}${decimalPart}`

  const decimalPosition =
    decimalPart.length - 1

  if (
    decimalPosition === 0
  ) {
    return combined
  }

  const cut =
    combined.length -
    decimalPosition

  let result =
    `${combined.slice(
      0,
      cut,
    )}.${combined.slice(cut)}`

  result =
    result.replace(
      /\.?0+$/,
      '',
    )

  return result
}

export function isValidTomanPrice(
  value:
    | string
    | number
    | null
    | undefined,
): boolean {
  return (
    normalizeNumericString(
      value,
    ) !== null
  )
}