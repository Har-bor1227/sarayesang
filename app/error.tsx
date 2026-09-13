'use client'

import { useEffect } from 'react'
import Link from 'next/link'

import Container from '@/components/ui/container'
import { Button } from '@/components/ui/button'

interface ErrorPageProps {
  error: Error & {
    digest?: string
  }
  reset: () => void
}

export default function ErrorPage({
  error,
  reset,
}: ErrorPageProps) {
  useEffect(() => {
    console.error(
      'Application error:',
      error
    )
  }, [error])

  return (
    <Container className="py-16 md:py-24">
      <div className="max-w-xl mx-auto text-center">
        <div className="mb-6 text-6xl">
          ⚠️
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-primary mb-4">
          مشکلی پیش آمده است
        </h1>

        <p className="text-gray-600 leading-relaxed mb-8">
          در بارگذاری این صفحه خطایی رخ داد.
          لطفاً دوباره تلاش کنید یا به صفحه اصلی برگردید.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={reset}
          >
            تلاش مجدد
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
          >
            <Link href="/">
              بازگشت به خانه
            </Link>
          </Button>
        </div>
      </div>
    </Container>
  )
}