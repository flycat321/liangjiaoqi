'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Home, ClipboardList, Bell, User } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { demoGetUser } from '@/lib/utils/demo-auth'

const tabs = [
  { label: '首页', icon: Home, href: '/dashboard', match: /^\/(dashboard)$/ },
  { label: '项目', icon: ClipboardList, href: '/dashboard', match: /^\/(dashboard|project)/ },
  { label: '通知', icon: Bell, href: '/notifications' },
  { label: '我的', icon: User, href: '/profile' },
]

export function PortalBottomNav() {
  const pathname = usePathname()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    async function fetchUnread() {
      const user = demoGetUser()
      if (!user?.phone) return
      try {
        const res = await fetch(`/api/notifications?phone=${encodeURIComponent(user.phone)}`)
        if (res.ok) {
          const data = await res.json()
          const unread = (data.notifications || []).filter((n: { is_read: boolean }) => !n.is_read).length
          setUnreadCount(unread)
        }
      } catch {
        // ignore
      }
    }
    fetchUnread()
  }, [pathname])

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-t border-brand-border/30 safe-bottom">
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const active = tab.match
            ? tab.match.test(pathname)
            : pathname === tab.href
          const isNotification = tab.label === '通知'
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={cn(
                'relative flex flex-col items-center gap-0.5 px-3 py-1 touch-manipulation transition-colors',
                active ? 'text-brand-accent' : 'text-brand-text-muted'
              )}
            >
              <div className="relative">
                <tab.icon size={20} strokeWidth={active ? 2.5 : 1.5} />
                {isNotification && unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-bold leading-none">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </div>
              <span className="text-[10px]">{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
