'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ClipboardList, Bell, User } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const tabs = [
  { label: '首页', icon: Home, href: '/dashboard' },
  { label: '项目', icon: ClipboardList, href: '/dashboard', match: /^\/(dashboard|project)/ },
  { label: '通知', icon: Bell, href: '/notifications' },
  { label: '我的', icon: User, href: '/profile' },
]

export function PortalBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-t border-brand-border/30 safe-bottom">
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const active = tab.match
            ? tab.match.test(pathname)
            : pathname === tab.href
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1 touch-manipulation transition-colors',
                active ? 'text-brand-accent' : 'text-brand-text-muted'
              )}
            >
              <tab.icon size={20} strokeWidth={active ? 2.5 : 1.5} />
              <span className="text-[10px]">{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
