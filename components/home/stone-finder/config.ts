import type {
  QuestionConfig,
  TrustPoint,
} from './types'

export const FALLBACK_IMAGE =
  '/images/home/product-placeholder.webp'

export const ANY_VALUE = '__any__'

export const QUESTION_CONFIG = [
  {
    key: 'application',
    eyebrow: '01 · کاربرد پروژه',
    title: 'سنگ را برای چه فضایی می‌خواهید؟',
    description:
      'کاربرد اصلی را انتخاب کن تا پیشنهادها از همان ابتدا به پروژه‌ات نزدیک‌تر شوند.',
    weight: 40,
    shortLabel: 'کاربرد',
  },
  {
    key: 'stoneType',
    eyebrow: '02 · جنس سنگ',
    title: 'چه نوع سنگی بیشتر می‌پسندی؟',
    description:
      'نوع سنگ را مشخص کن؛ اگر هنوز تصمیم نگرفته‌ای، «فرقی ندارد» کاملاً آزاد است.',
    weight: 30,
    shortLabel: 'جنس سنگ',
  },
  {
    key: 'colorFamily',
    eyebrow: '03 · طیف رنگی',
    title: 'کدام رنگ به فضای تو نزدیک‌تر است؟',
    description:
      'نزدیک‌ترین طیف را انتخاب کن؛ قرار نیست بین چند رنگ مشابه سردرگم شوی.',
    weight: 20,
    shortLabel: 'رنگ',
  },
  {
    key: 'surfaceFinish',
    eyebrow: '04 · پرداخت سطح',
    title: 'چه پرداختی را ترجیح می‌دهی؟',
    description:
      'پرداخت سطح روی ظاهر نهایی سنگ اثر زیادی دارد. مطمئن نیستی؟ این مرحله را آزاد بگذار.',
    weight: 10,
    shortLabel: 'پرداخت',
  },
] satisfies readonly QuestionConfig[]

export const TRUST_POINTS: readonly TrustPoint[] = [
  {
    value: 'واقعی',
    text: 'محصولات و مشخصات واقعی سرای سنگ',
  },
  {
    value: 'سریع',
    text: 'چند انتخاب کوتاه و مستقیم',
  },
  {
    value: 'شفاف',
    text: 'پیشنهاد می‌دهد؛ تصمیم با توست',
  },
]