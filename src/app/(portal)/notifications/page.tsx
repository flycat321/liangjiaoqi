'use client'

import { useEffect, useState } from 'react'
import { Bell, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { demoGetUser } from '@/lib/utils/demo-auth'
import { formatRelative } from '@/lib/utils/format'

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

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      // For now show all notifications (proper filtering needs auth)
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)
      setNotifications(data || [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="pb-4">
      <div className="px-4 pt-6 mb-4">
        <h1 className="text-xl font-serif font-bold">消息通知</h1>
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
            <a key={n.id} href={n.link || '#'}
              className="flex gap-3 px-4 py-3.5 transition-colors active:bg-brand-bg touch-manipulation">
              <div className="w-9 h-9 rounded-full bg-brand-accent/10 flex items-center justify-center shrink-0">
                <Bell size={16} className="text-brand-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium">{n.title}</h3>
                {n.body && <p className="text-[11px] text-brand-text-muted mt-0.5 truncate">{n.body}</p>}
                <p className="text-[10px] text-brand-text-muted mt-1">{formatRelative(n.created_at)}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
