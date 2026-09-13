import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'

import { cn } from '@/lib/utils'

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'default'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'destructive'
    | 'link'
    | 'primary'
    | 'accent'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        ref={ref}
        className={cn(
          [
            'inline-flex items-center justify-center gap-2',
            'whitespace-nowrap select-none',
            'font-medium tracking-[-0.01em]',
            'transition-all duration-200 ease-out',
            'disabled:pointer-events-none disabled:opacity-50',
            'focus-visible:outline-none',
            'focus-visible:ring-2 focus-visible:ring-accent/50',
            'focus-visible:ring-offset-2',
            'focus-visible:ring-offset-background',
            '[&_svg]:pointer-events-none',
            '[&_svg]:size-4',
            '[&_svg]:shrink-0',
          ].join(' '),

          /* --------------------------------
             Variants
             -------------------------------- */

          variant === 'default' &&
            [
              'bg-primary text-primary-foreground',
              'shadow-[0_4px_14px_rgba(17,47,80,0.12)]',
              'hover:bg-primary-light',
              'hover:-translate-y-px',
              'hover:shadow-[0_7px_20px_rgba(17,47,80,0.16)]',
              'active:translate-y-0',
              'active:shadow-[0_3px_10px_rgba(17,47,80,0.12)]',
            ].join(' '),

          variant === 'primary' &&
            [
              'bg-primary text-primary-foreground',
              'shadow-[0_4px_14px_rgba(17,47,80,0.12)]',
              'hover:bg-primary-light',
              'hover:-translate-y-px',
              'hover:shadow-[0_7px_20px_rgba(17,47,80,0.16)]',
              'active:translate-y-0',
            ].join(' '),

          variant === 'outline' &&
            [
              'border border-border',
              'bg-background text-primary',
              'shadow-[0_1px_2px_rgba(10,25,41,0.03)]',
              'hover:border-accent/45',
              'hover:bg-accent/5',
              'hover:text-primary-dark',
              'hover:-translate-y-px',
              'hover:shadow-[0_5px_16px_rgba(10,25,41,0.06)]',
              'active:translate-y-0',
            ].join(' '),

          variant === 'secondary' &&
            [
              'bg-secondary text-secondary-foreground',
              'border border-transparent',
              'hover:bg-secondary/75',
              'hover:border-border',
            ].join(' '),

          variant === 'ghost' &&
            [
              'bg-transparent text-foreground',
              'hover:bg-primary/[0.045]',
              'hover:text-primary',
            ].join(' '),

          variant === 'destructive' &&
            [
              'bg-destructive text-destructive-foreground',
              'shadow-[0_4px_14px_rgba(220,53,69,0.12)]',
              'hover:bg-destructive/90',
              'hover:-translate-y-px',
              'active:translate-y-0',
            ].join(' '),

          variant === 'link' &&
            [
              'h-auto bg-transparent p-0',
              'text-primary',
              'underline-offset-4',
              'hover:text-accent-dark',
              'hover:underline',
            ].join(' '),

          variant === 'accent' &&
            [
              'bg-accent text-accent-foreground',
              'shadow-[0_4px_14px_rgba(183,148,100,0.18)]',
              'hover:bg-accent-dark',
              'hover:-translate-y-px',
              'hover:shadow-[0_7px_20px_rgba(183,148,100,0.22)]',
              'active:translate-y-0',
            ].join(' '),

          /* --------------------------------
             Sizes
             -------------------------------- */

          size === 'default' &&
            'h-10 rounded-lg px-4 text-sm',

          size === 'sm' &&
            'h-9 rounded-md px-3 text-xs sm:text-sm',

          size === 'lg' &&
            'h-12 rounded-xl px-6 text-sm sm:px-7',

          size === 'icon' &&
            'size-10 rounded-lg',

          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export { Button }