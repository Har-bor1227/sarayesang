import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export const metadata: Metadata = {
  title: {
    default: 'پلتفرم صنعت سنگ',
    template: '%s | پلتفرم صنعت سنگ',
  },
  description: 'سامانه تخصصی جستجو، مقایسه و استعلام قیمت سنگ ساختمانی',
  keywords: ['سنگ', 'تراورتن', 'مرمریت', 'گرانیت', 'کارخانه سنگ'],
  authors: [{ name: 'Stone Platform' }],
  openGraph: {
    title: 'پلتفرم صنعت سنگ',
    description: 'سامانه تخصصی جستجو، مقایسه و استعلام قیمت سنگ ساختمانی',
    locale: 'fa_IR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="font-sans bg-stone-white text-stone-gray-900">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}