import type { Metadata } from 'next'

import {
  generateOrganizationSchema,
  JsonLd,
} from '@/lib/seo'

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

export const metadata: Metadata = {
  title: `درباره ما | ${SITE_NAME}`,

  description:
    'سرای سنگ، مرجع تخصصی سنگ‌های ساختمانی با سال‌ها تجربه در تأمین و عرضه سنگ‌های با کیفیت.',

  alternates: {
    canonical:
      `${SITE_URL}/about`,
  },

  openGraph: {
    title:
      `درباره ما | ${SITE_NAME}`,

    description:
      'سرای سنگ، مرجع تخصصی سنگ‌های ساختمانی با سال‌ها تجربه.',

    type: 'website',
  },
}

export default function AboutPage() {
  const organizationSchema =
    generateOrganizationSchema()

  return (
    <div
      dir="rtl"
      className="w-full overflow-x-clip bg-white"
    >
      <JsonLd
        data={organizationSchema}
      />

      <AboutHero />

      <AboutIntro />

      <ValuesSection />

      <CollaborationSection />

      <WhyUsSection />
    </div>
  )
}