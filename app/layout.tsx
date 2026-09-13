import type { Metadata } from 'next'
import localFont from 'next/font/local'

import './globals.css'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BottomNav from '@/components/layout/BottomNav'

import {
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_URL,
} from '@/lib/constants'

import {
  generateOrganizationSchema,
  generateWebSiteSchema,
  JsonLd,
} from '@/lib/seo'

const vazirmatn = localFont({
  src: [
    {
      path: '../public/fonts/Vazirmatn[wght].woff2',
      weight: '100 900',
      style: 'normal',
    },
  ],

  variable: '--font-vazirmatn',

  display: 'swap',

  preload: true,
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default:
      `${SITE_NAME} | فروش و استعلام قیمت سنگ‌های ساختمانی`,
    template: `%s | ${SITE_NAME}`,
  },

  description:
    SITE_DESCRIPTION,

  keywords: [
    'سنگ ساختمانی',
    'سرای سنگ',
    'استعلام قیمت سنگ',
    'سنگ نما',
    'سنگ کف',
    'سنگ پله',
    'گرانیت',
    'مرمریت',
  ],

  authors: [
    {
      name: SITE_NAME,
    },
  ],

  creator: SITE_NAME,
  publisher: SITE_NAME,

  alternates: {
    canonical: SITE_URL,
  },

  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    url: SITE_URL,
    siteName: SITE_NAME,

    title:
      `${SITE_NAME} | فروش و استعلام قیمت سنگ‌های ساختمانی`,

    description:
      SITE_DESCRIPTION,
  },

  twitter: {
    card: 'summary_large_image',

    title:
      `${SITE_NAME} | فروش و استعلام قیمت سنگ‌های ساختمانی`,

    description:
      SITE_DESCRIPTION,
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const organizationSchema =
    generateOrganizationSchema()

  const websiteSchema =
    generateWebSiteSchema()

  return (
<html
  lang="fa"
  dir="rtl"
  className={vazirmatn.variable}
  data-scroll-behavior="smooth"
>
      <body className="font-sans min-h-screen flex flex-col bg-white text-gray-900">
        <JsonLd
          data={organizationSchema}
        />

        <JsonLd
          data={websiteSchema}
        />

        <Header />

        <main className="flex-1 pb-16 md:pb-0">
          {children}
        </main>

        <Footer />

        <BottomNav />
      </body>
    </html>
  )
}