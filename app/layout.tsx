import type { Metadata } from 'next'
import '@fontsource-variable/estedad/wght.css'

import './globals.css'

import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import BottomNav from '@/components/layout/BottomNav'

import {
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_URL,
  DEFAULT_SOCIAL_IMAGE,
  SEO_KEYWORDS,
} from '@/lib/constants'

import {
  generateOrganizationSchema,
  generateWebSiteSchema,
  JsonLd,
} from '@/lib/seo'

import {
  getProductCategories,
} from '@/lib/repositories/category-repository'


const SITE_TITLE =
  `${SITE_NAME} | خرید و استعلام قیمت سنگ ساختمانی`


export const metadata: Metadata = {

  metadataBase:
    new URL(SITE_URL),


  title: {

    default:
      SITE_TITLE,

    template:
      `${SITE_NAME} | %s`,

  },


  description:
    SITE_DESCRIPTION,


  keywords:
    SEO_KEYWORDS,

    
  icons: {
    icon:
      '/favicon.ico',

    shortcut:
      '/favicon.ico',

    apple:
      '/favicon.ico',
  },



  authors: [

    {
      name: SITE_NAME,
    },

  ],


  creator:
    SITE_NAME,


  publisher:
    SITE_NAME,


  alternates: {

    canonical:
      SITE_URL,

  },


  openGraph: {

    type:
      'website',

    locale:
      'fa_IR',

    url:
      SITE_URL,

    siteName:
      SITE_NAME,


    title:
      SITE_TITLE,


    description:
      SITE_DESCRIPTION,


    images: [

      {

        url:
          DEFAULT_SOCIAL_IMAGE,

        width:
          1920,

        height:
          758,

        alt:
          SITE_NAME,

      },

    ],

  },


  twitter: {

    card:
      'summary_large_image',


    title:
      SITE_TITLE,


    description:
      SITE_DESCRIPTION,


    images:

      [
        DEFAULT_SOCIAL_IMAGE,
      ],

  },


  robots: {

    index:
      true,

    follow:
      true,


    googleBot: {

      index:
        true,

      follow:
        true,

      'max-image-preview':
        'large',

      'max-snippet':
        -1,

      'max-video-preview':
        -1,

    },

  },

}



export default async function RootLayout({

  children,

}: Readonly<{

  children:
    React.ReactNode

}>) {


  const [

    organizationSchema,

    websiteSchema,

    categories,

  ] = await Promise.all([


    Promise.resolve(
      generateOrganizationSchema(),
    ),


    Promise.resolve(
      generateWebSiteSchema(),
    ),


    getProductCategories(),

  ])



  return (

    <html

      lang="fa"

      dir="rtl"

      data-scroll-behavior="smooth"

    >

      <body

        className="
          font-sans
          min-h-screen
          flex
          flex-col
          bg-white
          text-gray-900
        "

      >


        <JsonLd
          data={organizationSchema}
        />


        <JsonLd
          data={websiteSchema}
        />


        <Header

          categories={
            categories
          }

        />


        <main

          className="
            flex-1
            pb-16
            md:pb-0
          "

        >

          {children}

        </main>


        <Footer />


        <BottomNav

          categories={
            categories
          }

        />


      </body>


    </html>

  )

}