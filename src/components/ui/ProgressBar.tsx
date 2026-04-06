'use client'

import { cn } from '@/lib/utils/cn'

interface ProgressBarProps {
  value: number
  max?: number
  size?: 'sm' | 'md'
  showLabel?: boolean
  className?: string
}

export function ProgressBar({ value, max = 100, size = 'md', showLabel = false, className }: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100)

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'flex-1 rounded-full bg-brand-border/50 overflow-hidden',
          size === 'sm' ? 'h-1.5' : 'h-2.5'
        )}
      >
        <div
          className="h-full rounded-full bg-brand-accent transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-brand-text-muted tabular-nums">
          {percentage}%
        </span>
      )}
    </div>
  )
}
