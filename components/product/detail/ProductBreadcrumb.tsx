import Link from 'next/link'

import {
  ChevronLeft,
} from 'lucide-react'

type ProductBreadcrumbProps = {
  productName: string
}

export default function ProductBreadcrumb({
  productName,
}: ProductBreadcrumbProps) {
  return (
    <nav
      className="
        mb-5
        overflow-hidden
        sm:mb-6
        lg:mb-7
      "
      aria-label="مسیر راهنما"
    >
      <ol
        className="
          flex
          min-w-0
          items-center
          gap-1.5
          overflow-hidden
          whitespace-nowrap
          text-[10px]
          sm:gap-2
          sm:text-[11px]
        "
      >
        <li className="shrink-0">
          <Link
            href="/"
            className="
              font-bold
              text-[#7A838D]
              transition-colors
              duration-200
              hover:text-[#B79464]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#B79464]/40
              focus-visible:ring-offset-2
            "
          >
            خانه
          </Link>
        </li>

        <li
          aria-hidden="true"
          className="
            flex
            shrink-0
            items-center
            text-[#B79464]/55
          "
        >
          <ChevronLeft
            className="
              h-3
              w-3
            "
          />
        </li>

        <li className="shrink-0">
          <Link
            href="/products"
            className="
              font-bold
              text-[#7A838D]
              transition-colors
              duration-200
              hover:text-[#B79464]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#B79464]/40
              focus-visible:ring-offset-2
            "
          >
            محصولات
          </Link>
        </li>

        <li
          aria-hidden="true"
          className="
            flex
            shrink-0
            items-center
            text-[#B79464]/55
          "
        >
          <ChevronLeft
            className="
              h-3
              w-3
            "
          />
        </li>

        <li
          aria-current="page"
          className="
            min-w-0
            truncate
            font-black
            text-[#112F50]
          "
        >
          {productName}
        </li>
      </ol>
    </nav>
  )
}