'use client'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Send, User, Loader2, Bell } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { formatRelative } from '@/lib/utils/format'

interface ClientOption {
  id: string
  name: string
}

interface SentNotification {
  id: string
  title: string
  body: string | null
  created_at: string
  client_name: string
}

export default function AdminNotificationsPage() {
  const [form, setForm] = useState({ client: '', title: '', body: '' })
  const [loading, setLoading] = useState(false)
  const [clients, setClients] = useState<ClientOption[]>([])
  const [loadingClients, setLoadingClients] = useState(true)
  const [history, setHistory] = useState<SentNotification[]>([])
  const [loadingHistory, setLoadingHistory] = useState(true)

  useEffect(() => {
    // Load clients via API
    fetch('/api/admin/clients')
      .then(r => r.json())
      .then(data => { setClients(data.clients || []); setLoadingClients(false) })
      .catch(() => setLoadingClients(false))

    // Load sent notifications via API
    fetch('/api/admin/notifications')
      .then(r => r.json())
      .then(data => { setHistory(data.notifications || []); setLoadingHistory(false) })
      .catch(() => setLoadingHistory(false))
  }, [])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!form.client || !form.title) { toast.error('请选择客户并填写标题'); return }
    setLoading(true)

    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: form.client, title: form.title, body: form.body }),
      })
      const result = await res.json()

      if (res.ok) {
        const clientName = clients.find(c => c.id === form.client)?.name || ''
        toast.success(`已推送给 ${clientName}`)
        // Add to history
        setHistory(prev => [{
          id: result.id,
          title: form.title,
          body: form.body || null,
          created_at: new Date().toISOString(),
          client_name: clientName,
        }, ...prev])
        setForm({ client: '', title: '', body: '' })
      } else {
        toast.error(result.error || '发送失败')
      }
    } catch {
      toast.error('网络错误')
    }
    setLoading(false)
  }

  return (
    <div className="px-4 pt-6 pb-4">
      <h1 className="text-xl font-serif font-bold mb-6">消息推送</h1>

      {/* Compose */}
      <Card className="mb-6">
        <h2 className="text-sm font-medium mb-3">发送新通知</h2>
        <form onSubmit={handleSend} className="space-y-3">
          <select
            value={form.client}
            onChange={e => setForm(prev => ({ ...prev, client: e.target.value }))}
            className="w-full h-10 px-3 rounded-lg border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30 transition-colors appearance-none"
          >
            <option value="">选择客户</option>
            {loadingClients ? (
              <option disabled>加载中...</option>
            ) : clients.length === 0 ? (
              <option disabled>暂无客户</option>
            ) : (
              clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))
            )}
          </select>
          <input
            value={form.title}
            onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
            className="w-full h-10 px-3 rounded-lg border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30 transition-colors"
            placeholder="通知标题"
          />
          <textarea
            value={form.body}
            onChange={e => setForm(prev => ({ ...prev, body: e.target.value }))}
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30 transition-colors resize-none"
            placeholder="通知内容（选填）"
          />
          <Button type="submit" size="md" loading={loading} className="w-full">
            <Send size={14} className="mr-1.5" /> 发送通知
          </Button>
        </form>
      </Card>

      {/* History */}
      <h2 className="text-xs text-brand-text-muted tracking-wider mb-3">发送记录</h2>
      {loadingHistory ? (
        <div className="flex justify-center py-10"><Loader2 size={20} className="animate-spin text-brand-accent" /></div>
      ) : history.length === 0 ? (
        <div className="text-center py-10">
          <Bell size={24} className="text-brand-border mx-auto mb-2" />
          <p className="text-xs text-brand-text-muted">暂无发送记录</p>
        </div>
      ) : (
        <div className="space-y-2">
          {history.map((h) => (
            <Card key={h.id} padding="sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-bg flex items-center justify-center shrink-0">
                  <User size={14} className="text-brand-accent" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">{h.client_name}</span>
                    <span className="text-[10px] text-brand-text-muted">{formatRelative(h.created_at)}</span>
                  </div>
                  <p className="text-xs text-brand-text-secondary">{h.title}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
