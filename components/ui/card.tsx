import * as React from 'react'

import { cn } from '@/lib/utils'

function Card({
  className,
  size = 'default',
  ...props
}: React.ComponentProps<'div'> & {
  size?: 'default' | 'sm'
}) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        [
          'group/card flex flex-col overflow-hidden',
          'bg-card text-card-foreground',
          'rounded-xl',
          'border border-border/80',
          'shadow-[0_1px_2px_rgba(10,25,41,0.025)]',
          'transition-all duration-300 ease-out',
          '[--card-spacing:1rem]',
          'data-[size=sm]:[--card-spacing:0.75rem]',
          'has-[>img:first-child]:pt-0',
          'has-data-[slot=card-footer]:pb-0',
          '*:[img:first-child]:rounded-t-xl',
          '*:[img:last-child]:rounded-b-xl',
        ].join(' '),
        className
      )}
      {...props}
    />
  )
}

function CardHeader({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        [
          'group/card-header @container/card-header',
          'grid auto-rows-min items-start',
          'gap-1',
          'px-[var(--card-spacing)]',
          'pt-[var(--card-spacing)]',
          'has-data-[slot=card-action]:grid-cols-[1fr_auto]',
          'has-data-[slot=card-description]:grid-rows-[auto_auto]',
        ].join(' '),
        className
      )}
      {...props}
    />
  )
}

function CardTitle({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        [
          'font-heading',
          'text-base font-bold leading-snug',
          'tracking-[-0.015em]',
          'text-primary',
          'group-data-[size=sm]/card:text-sm',
        ].join(' '),
        className
      )}
      {...props}
    />
  )
}

function CardDescription({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        [
          'text-sm leading-7',
          'text-muted-foreground',
        ].join(' '),
        className
      )}
      {...props}
    />
  )
}

function CardAction({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        [
          'col-start-2 row-span-2 row-start-1',
          'self-start justify-self-end',
        ].join(' '),
        className
      )}
      {...props}
    />
  )
}

function CardContent({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        'px-[var(--card-spacing)] pb-[var(--card-spacing)]',
        className
      )}
      {...props}
    />
  )
}

function CardFooter({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        [
          'flex items-center',
          'border-t border-border/70',
          'bg-muted/35',
          'px-[var(--card-spacing)]',
          'py-[var(--card-spacing)]',
        ].join(' '),
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}