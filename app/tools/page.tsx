import type { Metadata } from 'next'

import StoneCalculators from '@/components/tools/StoneCalculators'
import { SITE_NAME, SITE_URL } from '@/lib/constants'

import { DEFAULT_SOCIAL_IMAGE } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'ابزارهای محاسبات سنگ',
  description:
    'محاسبه متراژ سنگ نما، پله، تعداد تایل، اسلب، پرت، مصالح نصب، نانو و وزن بار در ابزارهای تخصصی سرای سنگ.',
  alternates: {
    canonical: `${SITE_URL}/tools`,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'ابزارهای محاسبات سنگ | سرای سنگ',
    description:
      'ابزارهای تخصصی سرای سنگ برای محاسبه متراژ، پرت، تایل، اسلب، مصالح نصب و وزن بار.',
    type: 'website',
    url: `${SITE_URL}/tools`,
    siteName: SITE_NAME,
    locale: 'fa_IR',
    images: [{ url: DEFAULT_SOCIAL_IMAGE, width: 1920, height: 758, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [DEFAULT_SOCIAL_IMAGE],
    title: 'ابزارهای محاسبات سنگ | سرای سنگ',
    description:
      'ابزارهای تخصصی سرای سنگ برای محاسبه متراژ، پرت، تایل، اسلب، مصالح نصب و وزن بار.',
  },
}

export default function ToolsPage() {
  return <StoneCalculators />
}