import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface ProductCategoryRailProps {
  categories: Array<{
    id: string
    slug: string
    name: string
  }>
}

export default function ProductCategoryRail({
  categories,
}: ProductCategoryRailProps) {
  if (categories.length === 0) {
    return null
  }

  return (
    <section
      aria-labelledby="catalog-categories-title"
      className="mt-5"
    >
      <div className="mb-3 flex items-end justify-between gap-4 px-1">
        <div>
          <h2
            id="catalog-categories-title"
            className="mt-1 text-[17px] font-black tracking-[-0.025em] text-[#112F50] sm:text-[19px]"
          >
            دسته‌بندی‌های سریع
          </h2>
        </div>

        <Link
          href="/products"
          className="group inline-flex items-center gap-1.5 text-[9px] font-black text-[#667085] transition hover:text-[#76582F]"
        >
          همه محصولات
          <ArrowLeft
            className="h-3 w-3 transition-transform duration-200 group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Link
          href="/products"
          aria-current="page"
          className="
            shrink-0
            rounded-full
            border
            border-[#112F50]
            bg-[#112F50]
            px-4
            py-2.5
            text-[9px]
            font-black
            text-white
            shadow-[0_8px_20px_rgba(17,47,80,0.10)]
            transition
            hover:bg-[#0A1929]
          "
        >
          همه سنگ‌ها
        </Link>

        {categories.slice(0, 10).map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="
              shrink-0
              rounded-full
              border
              border-[#112F50]/[0.08]
              bg-white
              px-4
              py-2.5
              text-[9px]
              font-black
              text-[#667085]
              shadow-[0_5px_18px_rgba(10,25,41,0.025)]
              transition-all
              hover:-translate-y-0.5
              hover:border-[#B79464]/35
              hover:bg-[#FBF8F2]
              hover:text-[#76582F]
            "
          >
            {category.name}
          </Link>
        ))}
      </div>
    </section>
  )
}
