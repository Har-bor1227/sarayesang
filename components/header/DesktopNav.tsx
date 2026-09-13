import Link from 'next/link'

type NavLink = {
  title: string
  href: string
}

type Props = {
  links: NavLink[]
  pathname: string
}

export default function DesktopNav({
  links,
  pathname,
}: Props) {
  const isActive = (href: string) =>
    href === '/'
      ? pathname === '/'
      : pathname === href ||
        pathname.startsWith(`${href}/`)

  return (
    <nav
      aria-label="منوی اصلی"
      className="mx-auto hidden lg:block"
    >
      <div className="flex items-center gap-0.5 xl:gap-1">
        {links.map((item) => {
          const active = isActive(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={[
                'group relative flex items-center',
                'h-10 rounded-full',
                'px-3.5 xl:px-4.5',
                'whitespace-nowrap',
                'text-[13px] xl:text-[14px]',
                'font-semibold',
                'tracking-[-0.01em]',
                'transition-all duration-200',
                active
                  ? 'text-primary'
                  : 'text-[#667085] hover:bg-primary/[0.035] hover:text-primary',
              ].join(' ')}
            >
              {item.title}

              <span
                aria-hidden="true"
                className={[
                  'absolute bottom-[5px] left-1/2',
                  '-translate-x-1/2',
                  'h-[2px] rounded-full',
                  'bg-accent',
                  'transition-all duration-250 ease-out',
                  active
                    ? 'w-5 opacity-100'
                    : 'w-0 opacity-0 group-hover:w-5 group-hover:opacity-100',
                ].join(' ')}
              />
            </Link>
          )
        })}
      </div>
    </nav>
  )
}