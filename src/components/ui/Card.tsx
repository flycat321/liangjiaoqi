import { cn } from '@/lib/utils/cn'
import { type HTMLAttributes, forwardRef } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'sm' | 'md' | 'lg'
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, padding = 'md', children, ...props }, ref) => {
    const paddings = {
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    }
    return (
      <div
        ref={ref}
        className={cn(
          'bg-brand-surface rounded-xl border border-brand-border/50 shadow-sm',
          paddings[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'
