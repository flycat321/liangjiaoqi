'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { FileText, CheckCircle, AlertCircle, Loader2, ChevronRight } from 'lucide-react'

interface ProjectFee {
  id: string
  name: string
  address: string
  area: number | null
  client_name: string
  has_fee: boolean
  total_amount: number
  client_confirmed: boolean
  client_confirmed_at: string | null
}

export default function ContractsPage() {
  const [projects, setProjects] = useState<ProjectFee[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/contracts')
      .then(r => r.json())
      .then(d => { setProjects(d.projects || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-brand-accent" /></div>

  const withFee = projects.filter(p => p.has_fee)
  const withoutFee = projects.filter(p => !p.has_fee)

  return (
    <div className="px-4 pt-6 pb-4">
      <h1 className="text-xl font-serif font-bold mb-2">合同与费用</h1>
      <p className="text-xs text-brand-text-muted mb-6">点击项目编辑费用明细，保存后客户可在线查看确认</p>

      {projects.length === 0 ? (
        <div className="text-center py-20">
          <FileText size={32} className="text-brand-border mx-auto mb-3" />
          <p className="text-brand-text-muted text-sm">暂无项目</p>
          <p className="text-brand-text-muted text-xs mt-1">创建项目后可在此编辑合同费用</p>
        </div>
      ) : (
        <>
          {/* Projects without fee */}
          {withoutFee.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs text-brand-text-muted tracking-wider mb-3 flex items-center gap-1.5">
                <AlertCircle size={12} className="text-brand-warning" /> 待编辑费用（{withoutFee.length}）
              </h2>
              <div className="space-y-3">
                {withoutFee.map(p => (
                  <Link key={p.id} href={`/admin/projects/${p.id}/contract`}>
                    <Card className="flex items-center gap-3 active:scale-[0.99] transition-transform touch-manipulation">
                      <div className="w-10 h-10 rounded-lg bg-brand-warning/10 flex items-center justify-center shrink-0">
                        <FileText size={18} className="text-brand-warning" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium truncate">{p.name}</h3>
                        <p className="text-[11px] text-brand-text-muted">{p.client_name} · {p.area ? `${p.area}㎡` : '面积未填'}</p>
                      </div>
                      <Badge variant="default">未编辑</Badge>
                      <ChevronRight size={16} className="text-brand-text-muted shrink-0" />
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Projects with fee */}
          {withFee.length > 0 && (
            <div>
              <h2 className="text-xs text-brand-text-muted tracking-wider mb-3">已编辑费用（{withFee.length}）</h2>
              <div className="space-y-3">
                {withFee.map(p => (
                  <Link key={p.id} href={`/admin/projects/${p.id}/contract`}>
                    <Card className="flex items-center gap-3 active:scale-[0.99] transition-transform touch-manipulation">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${p.client_confirmed ? 'bg-green-50' : 'bg-brand-accent/10'}`}>
                        {p.client_confirmed
                          ? <CheckCircle size={18} className="text-brand-success" />
                          : <FileText size={18} className="text-brand-accent" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium truncate">{p.name}</h3>
                        <p className="text-[11px] text-brand-text-muted">{p.client_name} · 合同 ¥{p.total_amount.toLocaleString()}</p>
                      </div>
                      <Badge variant={p.client_confirmed ? 'success' : 'accent'}>
                        {p.client_confirmed ? '客户已确认' : '待客户确认'}
                      </Badge>
                      <ChevronRight size={16} className="text-brand-text-muted shrink-0" />
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
