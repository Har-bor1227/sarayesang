import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-stone-gray-200 bg-stone-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold text-stone-gray-900">سنگ‌یاب</h3>
            <p className="mt-2 text-sm text-stone-gray-600">
              پلتفرم تخصصی جستجو و مقایسه سنگ ساختمانی
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-stone-gray-900">دسترسی سریع</h4>
            <ul className="mt-3 space-y-2">
              <li><Link href="/stones" className="text-sm text-stone-gray-600 hover:text-stone-gray-900">سنگ‌ها</Link></li>
              <li><Link href="/companies" className="text-sm text-stone-gray-600 hover:text-stone-gray-900">کارخانه‌ها</Link></li>
              <li><Link href="/articles" className="text-sm text-stone-gray-600 hover:text-stone-gray-900">مقالات</Link></li>
              <li><Link href="/projects" className="text-sm text-stone-gray-600 hover:text-stone-gray-900">پروژه‌ها</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-stone-gray-900">خدمات</h4>
            <ul className="mt-3 space-y-2">
              <li><Link href="/stone-market" className="text-sm text-stone-gray-600 hover:text-stone-gray-900">بازار سنگ</Link></li>
              <li><Link href="/calculator" className="text-sm text-stone-gray-600 hover:text-stone-gray-900">محاسبه‌گر</Link></li>
              <li><Link href="/dictionary" className="text-sm text-stone-gray-600 hover:text-stone-gray-900">دیکشنری</Link></li>
              <li><Link href="/faq" className="text-sm text-stone-gray-600 hover:text-stone-gray-900">سوالات متداول</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-stone-gray-900">تماس</h4>
            <ul className="mt-3 space-y-2 text-sm text-stone-gray-600">
              <li>تهران، ایران</li>
              <li>info@example.com</li>
              <li>021-12345678</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-stone-gray-200 pt-6 text-center text-sm text-stone-gray-500">
          © {new Date().getFullYear()} سنگ‌یاب. تمامی حقوق محفوظ است.
        </div>
      </div>
    </footer>
  );
}