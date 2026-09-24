import type { Metadata } from 'next'

import ImageSearchClient from '@/components/image-search/ImageSearchClient'

import {
  SITE_NAME,
  SITE_URL,
} from '@/lib/constants'

import { DEFAULT_SOCIAL_IMAGE } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'جستجوی تصویری سنگ',

  description:
    'تصویر سنگ خود را در سرای سنگ بارگذاری کنید و سنگ‌های مشابه را بر اساس شباهت بصری پیدا کنید.',

  alternates: {
    canonical: `${SITE_URL}/image-search`,
  },

  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    images: [{ url: DEFAULT_SOCIAL_IMAGE, width: 1920, height: 758, alt: SITE_NAME }],
    url: `${SITE_URL}/image-search`,
    siteName: SITE_NAME,
    title: `جستجوی تصویری سنگ | ${SITE_NAME}`,
    description:
      'سنگ مشابه را با آپلود تصویر پیدا کنید.',
  },

  twitter: {
    card: 'summary_large_image',
    images: [DEFAULT_SOCIAL_IMAGE],
    title: `جستجوی تصویری سنگ | ${SITE_NAME}`,
    description:
      'سنگ مشابه را با آپلود تصویر پیدا کنید.',
  },

  robots: {
    index: true,
    follow: true,
  },
}

export default function ImageSearchPage() {
  return <ImageSearchClient />
}