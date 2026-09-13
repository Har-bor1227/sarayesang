import type { Metadata } from 'next'
import Link from 'next/link'

import Container from '@/components/ui/container'
import { Button } from '@/components/ui/button'

import {
  SITE_NAME,
} from '@/lib/constants'

export const metadata: Metadata = {
  title: `صفحه یافت نشد | ${SITE_NAME}`,

  description:
    'صفحه مورد نظر شما پیدا نشد. لطفاً به صفحه اصلی یا دسته‌بندی‌ها مراجعه کنید.',

  robots: {
    index: false,
    follow: false,
  },
}

export default function NotFound() {
  return (
    <Container className="py-16 md:py-24 text-center">
      <div className="max-w-md mx-auto">
        <div className="text-7xl font-extrabold text-primary mb-4">
          ۴۰۴
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
          صفحه مورد نظر پیدا نشد
        </h1>

        <p className="text-gray-600 mb-8">
          متأسفانه صفحه‌ای که به دنبال آن بودید وجود ندارد یا منتقل شده است.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            variant="primary"
          >
            <Link href="/">
              بازگشت به خانه
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
          >
            <Link href="/categories">
              مشاهده دسته‌بندی‌ها
            </Link>
          </Button>
        </div>
      </div>
    </Container>
  )
}