import Link from 'next/link'

type NavLink = {
  title: string
  href: string
}

interface DesktopNavProps {
  links: NavLink[]
  pathname: string
}

export default function DesktopNav({
  links,
  pathname,
}: DesktopNavProps) {
  const isActive = (href: string) =>
    href === '/'
      ? pathname === '/'
      : pathname === href ||
        pathname.startsWith(`${href}/`)

  return (
    <nav
      aria-label="منوی اصلی"
      className="
        flex
        min-w-0
        items-center
        justify-center
      "
    >
      <div className="flex items-center gap-0.5">
        {links.map((item) => {
          const active = isActive(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={
                active ? 'page' : undefined
              }
              className={[
                'group relative flex h-11 items-center',
                'rounded-[13px] px-3.5 xl:px-4',
                'whitespace-nowrap',
                'text-[12px] xl:text-[13px]',
                'font-bold tracking-[-0.015em]',
                'transition-all duration-200',
                active
                  ? 'bg-[#F5F1E9] text-[#112F50]'
                  : 'text-[#667085] hover:bg-[#F8F7F4] hover:text-[#112F50]',
              ].join(' ')}
            >
              <span>{item.title}</span>

              <span
                aria-hidden="true"
                className={[
                  'absolute bottom-[5px] left-1/2',
                  '-translate-x-1/2',
                  'h-[2px] rounded-full',
                  'bg-[#B79464]',
                  'transition-all duration-200',
                  active
                    ? 'w-5 opacity-100'
                    : 'w-0 opacity-0 group-hover:w-4 group-hover:opacity-100',
                ].join(' ')}
              />
            </Link>
          )
        })}
      </div>
    </nav>
  )
}