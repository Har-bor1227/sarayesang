import type { Metadata } from 'next'

import {
  SITE_NAME,
  SITE_URL,
} from '@/lib/constants'

import {
  AboutHero,
  AboutIntro,
  CollaborationSection,
  ValuesSection,
  WhyUsSection,
} from '@/components/about/AboutSections'

import { DEFAULT_SOCIAL_IMAGE } from '@/lib/constants'

import {
  generateAboutPageSchema,
  JsonLd,
} from '@/lib/seo'

export const metadata: Metadata = {
  title: 'درباره ما',

  description:
    'سرای سنگ، مرجع تخصصی سنگ‌های ساختمانی با سال‌ها تجربه در تأمین و عرضه سنگ‌های با کیفیت.',

  alternates: {
    canonical:
      `${SITE_URL}/about`,
  },

  openGraph: {
    title:
      `${SITE_NAME} | درباره ما`,

    description:
      'سرای سنگ، مرجع تخصصی سنگ‌های ساختمانی با سال‌ها تجربه.',

    type: 'website',
    url: `${SITE_URL}/about`,
    siteName: SITE_NAME,
    locale: 'fa_IR',
    images: [{ url: DEFAULT_SOCIAL_IMAGE, width: 1920, height: 758, alt: SITE_NAME }],
  },

  twitter: {
    card: 'summary_large_image',
    images: [DEFAULT_SOCIAL_IMAGE],
    title:
      `${SITE_NAME} | درباره ما`,
    description:
      'سرای سنگ، مرجع تخصصی سنگ‌های ساختمانی با سال‌ها تجربه.',
  },
}

const aboutPageSchema =
  generateAboutPageSchema()


export default function AboutPage() {
  return (
    <div
      dir="rtl"
      className="w-full overflow-x-clip bg-white"
    >
      <JsonLd data={aboutPageSchema} />

      <AboutHero />

      <AboutIntro />

      <ValuesSection />

      <CollaborationSection />

      <WhyUsSection />
    </div>
  )
}