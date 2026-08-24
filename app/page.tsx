import Link from 'next/link';

export default function HomePage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-stone-gray-900 sm:text-5xl">
          پلتفرم تخصصی صنعت سنگ
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-gray-600">
          جستجو، مقایسه و استعلام قیمت سنگ‌های ساختمانی از تولیدکنندگان معتبر
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/stones"
            className="rounded-md bg-stone-accent px-6 py-3 text-base font-medium text-stone-accent-contrast hover:bg-stone-accent-dark"
          >
            مشاهده سنگ‌ها
          </Link>
          <Link
            href="/companies"
            className="rounded-md border border-stone-gray-300 bg-white px-6 py-3 text-base font-medium text-stone-gray-700 hover:bg-stone-gray-50"
          >
            کارخانه‌ها
          </Link>
        </div>
      </div>
    </section>
  );
}