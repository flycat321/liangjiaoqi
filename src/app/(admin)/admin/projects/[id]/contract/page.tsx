'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, FileText, Loader2, CheckCircle, Clock, Eye } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

interface Contract {
  id: string
  title: string
  status: string
  created_at: string
  sent_at: string | null
  viewed_at: string | null
  signed_at: string | null
}

const statusLabel: Record<string, { text: string; variant: 'accent' | 'default' }> = {
  draft: { text: '草稿', variant: 'default' },
  sent: { text: '已发送', variant: 'accent' },
  viewed: { text: '已查看', variant: 'accent' },
  signed: { text: '已签署', variant: 'accent' },
}

export default function AdminProjectContractPage() {
  const { id } = useParams()
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/admin/projects/${id}/contracts`)
      .then(r => r.json())
      .then(d => { setContracts(d.contracts || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-brand-accent" /></div>

  return (
    <div className="pb-8">
      <div className="sticky top-[52px] z-40 bg-white/90 backdrop-blur-lg border-b border-brand-border/30 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href={`/admin/projects/${id}`} className="p-1 -ml-1 touch-manipulation"><ArrowLeft size={20} /></Link>
          <h1 className="text-sm font-medium">合同管理</h1>
        </div>
      </div>

      <div className="px-4 pt-4">
        {contracts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 rounded-full bg-brand-bg flex items-center justify-center mb-4">
              <FileText size={28} className="text-brand-text-muted" />
            </div>
            <h2 className="text-base font-serif font-bold mb-2">暂无合同</h2>
            <p className="text-sm text-brand-text-muted text-center leading-relaxed mb-4">
              创建合同后发送给客户在线签署。
            </p>
            <p className="text-xs text-brand-accent">合同编辑功能开发中，敬请期待</p>
          </div>
        ) : (
          <div className="space-y-3">
            {contracts.map(c => {
              const s = statusLabel[c.status] || statusLabel.draft
              return (
                <Card key={c.id}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-brand-accent/10 flex items-center justify-center shrink-0">
                      <FileText size={18} className="text-brand-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-medium truncate">{c.title}</h3>
                        <Badge variant={s.variant}>{s.text}</Badge>
                      </div>
                      <div className="space-y-0.5 text-[11px] text-brand-text-muted">
                        {c.sent_at && <div className="flex items-center gap-1"><Clock size={10} /> 发送：{new Date(c.sent_at).toLocaleDateString()}</div>}
                        {c.viewed_at && <div className="flex items-center gap-1"><Eye size={10} /> 查看：{new Date(c.viewed_at).toLocaleDateString()}</div>}
                        {c.signed_at && <div className="flex items-center gap-1"><CheckCircle size={10} className="text-brand-success" /> 签署：{new Date(c.signed_at).toLocaleDateString()}</div>}
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
