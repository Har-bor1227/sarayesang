import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b border-stone-gray-200 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold text-stone-gray-900">
            سنگ‌یاب
          </Link>
          {/* منوی دسکتاپ (موقت) */}
          <div className="hidden items-center gap-6 lg:flex">
            <Link href="/stones" className="text-sm font-medium text-stone-gray-600 hover:text-stone-gray-900">
              سنگ‌ها
            </Link>
            <Link href="/companies" className="text-sm font-medium text-stone-gray-600 hover:text-stone-gray-900">
              کارخانه‌ها
            </Link>
            <Link href="/articles" className="text-sm font-medium text-stone-gray-600 hover:text-stone-gray-900">
              مقالات
            </Link>
            <Link href="/projects" className="text-sm font-medium text-stone-gray-600 hover:text-stone-gray-900">
              پروژه‌ها
            </Link>
            <Link href="/dictionary" className="text-sm font-medium text-stone-gray-600 hover:text-stone-gray-900">
              دیکشنری
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* دکمه موبایل (در آینده) */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-stone-gray-600 hover:bg-stone-gray-100 lg:hidden"
            aria-label="منو"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <Link
            href="/contact"
            className="hidden rounded-md bg-stone-accent px-4 py-2 text-sm font-medium text-stone-accent-contrast hover:bg-stone-accent-dark sm:inline-flex"
          >
            استعلام قیمت
          </Link>
        </div>
      </nav>
    </header>
  );
}