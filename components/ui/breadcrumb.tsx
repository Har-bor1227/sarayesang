
import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

/* -------------------- Breadcrumb -------------------- */
interface BreadcrumbProps
  extends React.ComponentPropsWithoutRef<'nav'> {
  children: React.ReactNode
}

export function Breadcrumb({
  children,
  className,
  ...props
}: BreadcrumbProps) {
  return (
    <nav
      aria-label="breadcrumb"
      className={cn(
        'mb-6 text-sm text-gray-500',
        className,
      )}
      {...props}
    >
      {children}
    </nav>
  )
}

/* -------------------- BreadcrumbList -------------------- */
export function BreadcrumbList({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<'ol'>) {
  return (
    <ol
      className={cn(
        'flex flex-wrap items-center gap-2',
        className,
      )}
      {...props}
    >
      {children}
    </ol>
  )
}

/* -------------------- BreadcrumbItem -------------------- */
export function BreadcrumbItem({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<'li'>) {
  return (
    <li
      className={cn(
        'flex items-center gap-2',
        className,
      )}
      {...props}
    >
      {children}
    </li>
  )
}

/* -------------------- BreadcrumbLink -------------------- */
interface BreadcrumbLinkProps
  extends React.ComponentPropsWithoutRef<typeof Link> {
  children: React.ReactNode
}

export function BreadcrumbLink({
  children,
  className,
  ...props
}: BreadcrumbLinkProps) {
  return (
    <Link
      className={cn(
        'transition-colors hover:text-primary',
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  )
}

/* -------------------- BreadcrumbPage -------------------- */
export function BreadcrumbPage({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      aria-current="page"
      className={cn(
        'font-medium text-primary',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}

/* -------------------- BreadcrumbSeparator -------------------- */
export function BreadcrumbSeparator({
  children = '/',
  className,
  ...props
}: React.ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'text-gray-300 select-none',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
