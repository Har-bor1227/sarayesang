'use client'

import { usePathname } from 'next/navigation'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export default function Breadcrumbs() {
  const pathname =
    usePathname()

  const segments =
    pathname
      .split('/')
      .filter(Boolean)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            href="/"
            aria-label="صفحه اصلی"
          >
            خانه
          </BreadcrumbLink>
        </BreadcrumbItem>

        {segments.map(
          (
            segment,
            index
          ) => {
            const isLast =
              index ===
              segments.length - 1

            const href = `/${segments
              .slice(
                0,
                index + 1
              )
              .join('/')}`

            const label =
              decodeURIComponent(
                segment
              ).replace(
                /-/g,
                ' '
              )

            return (
              <BreadcrumbItem
                key={href}
              >
                <BreadcrumbSeparator aria-hidden="true">
                  /
                </BreadcrumbSeparator>

                {isLast ? (
                  <BreadcrumbPage>
                    {label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href={href}
                  >
                    {label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            )
          }
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}