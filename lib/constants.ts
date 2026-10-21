export const SITE_NAME = 'سرای سنگ'

export const SITE_DESCRIPTION =
  'سرای سنگ، مرجع تخصصی خرید و استعلام قیمت سنگ ساختمانی؛ معرفی انواع تراورتن، مرمریت، گرانیت و سایر سنگ‌ها با مشخصات فنی، کاربرد و مشاوره تخصصی.'
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://sarayesang.com'

/**
 * Official Business Information
 *
 * Single source of truth for the
 * business identity and official
 * contact information.
 */
export const BUSINESS = {
  name:
    SITE_NAME,

  legalName:
    'سرای سنگ',

  phone:
    '09137071730',

  phoneInternational:
    '+989137071730',

  secondaryPhone:
    '09135055775',

  secondaryPhoneInternational:
    '+989135055775',

  email:
    'info@sarayesang.com',

  address:
    'اصفهان، شهرک صنعتی محمودآباد، خیابان ۲۸، ساختمان ماهفر',

  city:
    'اصفهان',

  area:
    'شهرک صنعتی محمودآباد',

  street:
    'خیابان ۲۸',

  building:
    'ساختمان ماهفر',

  country:
    'IR',

  countryName:
    'ایران',

  latitude:
    32.798606,

  longitude:
    51.545424,

} as const



/**
 * Brand Information
 */
export const BRAND = {
  name:
    BUSINESS.name,

  legalName:
    BUSINESS.legalName,

  description:
    SITE_DESCRIPTION,

  url:
    SITE_URL,

  logo:
    '/logo.png',

  locale:
    'fa_IR',

  language:
    'fa',

  country:
    BUSINESS.country,

  city:
    BUSINESS.city,

  address:
    BUSINESS.address,

} as const



/**
 * Contact Information
 */
export const CONTACT = {
  phone:
    BUSINESS.phone,

  phoneInternational:
    BUSINESS.phoneInternational,

  secondaryPhone:
    BUSINESS.secondaryPhone,

  secondaryPhoneInternational:
    BUSINESS.secondaryPhoneInternational,

  whatsapp:
    BUSINESS.secondaryPhone,

  whatsappUrl:
    `https://wa.me/${BUSINESS.secondaryPhoneInternational.replace(
      /^\+/,
      '',
    )}`,

  email:
    BUSINESS.email,

} as const



/**
 * Backward-compatible primary phone export.
 *
 * Existing components currently import TEL_PHONE.
 */
export const TEL_PHONE =
  CONTACT.phone



/**
 * SEO Keywords
 */
export const SEO_KEYWORDS = [
  'سنگ ساختمانی',
  'خرید سنگ ساختمانی',
  'قیمت سنگ ساختمانی',
  'استعلام قیمت سنگ',
  'سنگ نما',
  'سنگ کف',
  'سنگ پله',
  'سنگ تراورتن',
  'سنگ مرمریت',
  'سنگ گرانیت',
  'سنگ ساختمانی اصفهان',
  'کارخانه سنگ',
  'مرکز فروش سنگ',
]



/**
 * Default Social Image
 */
export const DEFAULT_SOCIAL_IMAGE =
  '/images/home/banner-desktop-1.png'



/**
 * WordPress / WooCommerce API
 */
export const WORDPRESS_URL =
  process.env.WORDPRESS_URL ||
  process.env.NEXT_PUBLIC_WORDPRESS_URL ||
  'https://api.sarayesang.com'


export const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ||
  `${WORDPRESS_URL}/index.php?graphql`



/**
 * Social Profiles
 */
export const SOCIAL_LINKS = {
  instagram:
    'https://instagram.com/sarayesang',

  telegram:
    'https://t.me/sarayesang',

  whatsapp:
    CONTACT.whatsappUrl,

} as const



/**
 * Theme Colors
 */
export const COLORS = {
  primary:
    '#112F50',

  primaryLight:
    '#1A4166',

  primaryDark:
    '#0B1F35',

  accent:
    '#B79464',

  accentLight:
    '#C6A87E',

  accentDark:
    '#9E7F50',

} as const



export interface NavItem {
  title: string

  href: string

  icon?: string
}



/**
 * Main Navigation
 */
export const NAV_LINKS: NavItem[] = [
  {
    title: 'خانه',
    href: '/',
  },

  {
    title: 'محصولات',
    href: '/products',
  },

  {
    title: 'دسته‌بندی‌ها',
    href: '/categories',
  },

  {
    title: 'ابزارها',
    href: '/tools',
  },

  {
    title: 'بلاگ',
    href: '/blog',
  },

  {
    title: 'درباره ما',
    href: '/about',
  },

  {
    title: 'تماس با ما',
    href: '/contact',
  },
]



/**
 * Mobile Bottom Navigation
 */
export const BOTTOM_NAV_ITEMS: NavItem[] = [
  {
    title: 'خانه',
    href: '/',
    icon: 'home',
  },

  {
    title: 'محصولات',
    href: '/products',
    icon: 'grid',
  },

  {
    title: 'جستجو',
    href: '/search',
    icon: 'search',
  },

  {
    title: 'تماس',
    href: `tel:${CONTACT.phone}`,
    icon: 'phone',
  },

  {
    title: 'بلاگ',
    href: '/blog',
    icon: 'book',
  },
]