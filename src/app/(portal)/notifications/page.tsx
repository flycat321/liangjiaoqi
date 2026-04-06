'use client'

import { useEffect, useState } from 'react'
import { Bell, Loader2, CheckCheck } from 'lucide-react'
import { demoGetUser } from '@/lib/utils/demo-auth'
import { formatRelative } from '@/lib/utils/format'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'

interface Notification {
  id: string
  title: string
  body: string | null
  link: string | null
  is_read: boolean
  created_at: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const user = demoGetUser()

  useEffect(() => {
    async function load() {
      if (!user?.phone) { setLoading(false); return }
      try {
        const res = await fetch(`/api/notifications?phone=${encodeURIComponent(user.phone)}`)
        if (res.ok) {
          const data = await res.json()
          setNotifications(data.notifications || [])
        }
      } catch {
        // Network error
      }
      setLoading(false)
    }
    load()
  }, [user?.phone])

  async function markAsRead(id: string) {
    const n = notifications.find(n => n.id === id)
    if (!n || n.is_read) return

    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
    try {
      await fetch('/api/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [id] }),
      })
    } catch {
      // ignore
    }
  }

  async function markAllRead() {
    const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id)
    if (unreadIds.length === 0) return

    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    try {
      await fetch('/api/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: unreadIds }),
      })
    } catch {
      // ignore
    }
  }

  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <div className="pb-4">
      <div className="px-4 pt-6 mb-4 flex items-center justify-between">
        <h1 className="text-xl font-serif font-bold">消息通知</h1>
        {unreadCount > 0 && (
          <Button size="sm" variant="outline" onClick={markAllRead}>
            <CheckCheck size={14} className="mr-1" /> 全部已读
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-brand-accent" /></div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-20">
          <Bell size={32} className="text-brand-border mx-auto mb-3" />
          <p className="text-brand-text-muted text-sm">暂无通知</p>
          <p className="text-brand-text-muted text-xs mt-1">项目有新动态时会在这里提醒您</p>
        </div>
      ) : (
        <div className="divide-y divide-brand-border/30">
          {notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={cn(
                'w-full flex gap-3 px-4 py-3.5 text-left transition-colors active:bg-brand-bg touch-manipulation',
                !n.is_read && 'bg-brand-accent/[0.03]'
              )}
            >
              <div className="relative w-9 h-9 rounded-full bg-brand-accent/10 flex items-center justify-center shrink-0">
                <Bell size={16} className="text-brand-accent" />
                {!n.is_read && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={cn('text-sm', n.is_read ? 'text-brand-text-secondary' : 'font-medium')}>{n.title}</h3>
                {n.body && <p className="text-[11px] text-brand-text-muted mt-0.5">{n.body}</p>}
                <p className="text-[10px] text-brand-text-muted mt-1">{formatRelative(n.created_at)}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
