import * as React from 'react'

import { cn } from '@/lib/utils'

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'default'
    | 'outline'
    | 'secondary'
    | 'destructive'
    | 'primary'
    | 'accent'
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          [
            'inline-flex items-center justify-center',
            'min-h-7 rounded-full',
            'px-3 py-1',
            'text-[11px] font-semibold',
            'leading-none tracking-[0.01em]',
            'transition-colors duration-200',
            'whitespace-nowrap',
          ].join(' '),

          variant === 'default' &&
            [
              'bg-primary text-primary-foreground',
            ].join(' '),

          variant === 'primary' &&
            [
              'bg-primary text-primary-foreground',
            ].join(' '),

          variant === 'outline' &&
            [
              'border border-primary/15',
              'bg-transparent text-primary',
              'hover:border-accent/35',
              'hover:bg-accent/5',
            ].join(' '),

          variant === 'secondary' &&
            [
              'border border-border/70',
              'bg-secondary text-secondary-foreground',
            ].join(' '),

          variant === 'destructive' &&
            [
              'bg-destructive text-destructive-foreground',
            ].join(' '),

          variant === 'accent' &&
            [
              'bg-accent/12 text-accent-dark',
              'border border-accent/15',
            ].join(' '),

          className
        )}
        {...props}
      />
    )
  }
)

Badge.displayName = 'Badge'

export { Badge }