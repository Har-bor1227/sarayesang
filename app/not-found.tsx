import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold text-stone-gray-900">۴۰۴</h1>
      <p className="mt-2 text-lg text-stone-gray-600">صفحه مورد نظر یافت نشد.</p>
      <Link
        href="/"
        className="mt-6 rounded-md bg-stone-accent px-6 py-3 text-base font-medium text-stone-accent-contrast hover:bg-stone-accent-dark"
      >
        بازگشت به صفحه اصلی
      </Link>
    </div>
  );
}