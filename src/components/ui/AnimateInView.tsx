'use client'

import { useRef, useEffect, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

interface AnimateInViewProps {
  children: ReactNode
  className?: string
  /** Animation delay in ms */
  delay?: number
  /** Slide direction */
  direction?: 'up' | 'left' | 'right' | 'none'
}

export function AnimateInView({
  children,
  className,
  delay = 0,
  direction = 'up',
}: AnimateInViewProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const translateMap = {
    up: 'translate-y-6',
    left: 'translate-x-6',
    right: '-translate-x-6',
    none: '',
  }

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        visible
          ? 'opacity-100 translate-y-0 translate-x-0'
          : `opacity-0 ${translateMap[direction]}`,
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
