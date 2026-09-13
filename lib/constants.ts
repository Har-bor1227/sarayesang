export const SITE_NAME: string =
  process.env.NEXT_PUBLIC_SITE_NAME || 'سرای سنگ'

export const SITE_DESCRIPTION: string =
  'سرای سنگ | مرجع تخصصی سنگ‌های ساختمانی و استعلام قیمت'

export const SITE_URL: string =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://sarayesang.com'

export const WORDPRESS_URL: string =
  process.env.WORDPRESS_URL ||
  process.env.NEXT_PUBLIC_WORDPRESS_URL ||
  'https://sarayesang.com'

export const GRAPHQL_ENDPOINT: string =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ||
  `${WORDPRESS_URL}/index.php?graphql`

export const TEL_PHONE: string =
  process.env.NEXT_PUBLIC_TEL || '+989123456789'

export const COLORS = {
  primary: '#112F50',
  primaryLight: '#1A4166',
  primaryDark: '#0B1F35',
  accent: '#B79464',
  accentLight: '#C6A87E',
  accentDark: '#9E7F50',
} as const

export interface NavItem {
  title: string
  href: string
  icon?: string
}

export const SOCIAL_LINKS: Record<string, string> = {
  instagram: 'https://instagram.com/sarayesang',
  telegram: 'https://t.me/sarayesang',
  whatsapp: 'https://wa.me/989123456789',
}

export const NAV_LINKS: NavItem[] = [
  { title: 'خانه', href: '/' },
  { title: 'محصولات', href: '/products' },
  { title: 'دسته‌بندی‌ها', href: '/categories' },
  { title: 'بلاگ', href: '/blog' },
  { title: 'درباره ما', href: '/about' },
  { title: 'تماس با ما', href: '/contact' },
]

export const BOTTOM_NAV_ITEMS: NavItem[] = [
  { title: 'خانه', href: '/', icon: 'home' },
  { title: 'دسته‌بندی‌ها', href: '/categories', icon: 'grid' },
  { title: 'جستجو', href: '/search', icon: 'search' },
  { title: 'تماس', href: `tel:${TEL_PHONE}`, icon: 'phone' },
  { title: 'بلاگ', href: '/blog', icon: 'book' },
]