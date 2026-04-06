'use client'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Send, User } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function AdminNotificationsPage() {
  const [form, setForm] = useState({ client: '', title: '', body: '' })
  const [loading, setLoading] = useState(false)

  const sentHistory = [
    { client: '张伟', title: '水电隐蔽验收待确认', time: '2小时前' },
    { client: '张伟', title: '新增3张施工照片', time: '昨天' },
    { client: '李婷', title: '概念方案已完成', time: '3天前' },
  ]

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!form.client || !form.title) { toast.error('请选择客户并填写标题'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    toast.success(`已推送给 ${form.client}`)
    setForm({ client: '', title: '', body: '' })
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
            <option>张伟</option>
            <option>李婷</option>
            <option>王磊</option>
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
      <div className="space-y-2">
        {sentHistory.map((h, i) => (
          <Card key={i} padding="sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-bg flex items-center justify-center shrink-0">
                <User size={14} className="text-brand-accent" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">{h.client}</span>
                  <span className="text-[10px] text-brand-text-muted">{h.time}</span>
                </div>
                <p className="text-xs text-brand-text-secondary">{h.title}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
